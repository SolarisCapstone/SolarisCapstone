require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// PostgreSQL connection (used for onboarding + planner)
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "solaris_capstone",
  password: "batman01R",
  port: 5432,
});

pool.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to PostgreSQL database.");
});

// Optional: Login system (JawsDB)
const userDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// userDB.connect(err => {
//   if (err) {
//     console.error("User DB (JawsDB) connection failed:", err);
//   } else {
//     console.log("Connected to JawsDB for Login System.");
//   }
// });

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------------------------
// ONBOARDING-RELATED ROUTE
// -------------------------

// ✅ NEW: Provides catalog_name values for onboarder dropdown
app.get("/api/concentrations", async (req, res) => {
  try {
    const result = await pool.query("SELECT catalog_name FROM Catalogs ORDER BY catalog_name");
    const names = result.rows.map(row => row.catalog_name);
    res.json(names);
  } catch (err) {
    console.error("Error fetching concentrations:", err.stack);
    res.status(500).send("Internal Server Error");
  }
});

// -------------------------
// EXISTING ROUTES (left untouched)
// -------------------------

app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
  userDB.query(sql, [username, password], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).send("Username already taken.");
      }
      return res.status(500).send("Error creating user.");
    }
    res.send("Signup successful!");
  });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  userDB.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).send("Login error.");
    if (results.length > 0) {
      res.send("Login successful!");
    } else {
      res.status(401).send("Invalid credentials.");
    }
  });
});

app.get("/api/degree/:majorId", async (req, res) => {
  const majorId = req.params.majorId;

  try {
    const coreCourses = await pool.query(`
      SELECT course_name AS code, description AS title
      FROM Courses
      WHERE type = 'Core' AND course_name IN (
        SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
      )`, [majorId]);

    const mathStatsCourses = await pool.query(`
      SELECT course_name AS code, description AS title
      FROM Courses
      WHERE type = 'Mathematics and Statistics' AND course_name IN (
        SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
      )`, [majorId]);

    const concentrationRequired = await pool.query(`
      SELECT course_name AS code, description AS title
      FROM Courses
      WHERE type = 'Conc Required' AND course_name IN (
        SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
      )`, [majorId]);

    const concentrationElectives = await pool.query(`
      SELECT course_name AS code, description AS title
      FROM Courses
      WHERE type = 'Conc Elective' AND course_name IN (
        SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
      )`, [majorId]);

    res.json({
      coreCourses: coreCourses.rows,
      mathStatsCourses: mathStatsCourses.rows,
      concentration: {
        required: concentrationRequired.rows,
        electives: {
          options: concentrationElectives.rows,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching degree data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/courses", (req, res) => {
  const query = "SELECT course_name, description, type FROM Courses";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching courses:", err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results.rows);
  });
});

app.get("/api/prerequisites", (req, res) => {
  const query = "SELECT course_name, prerequisite_name FROM Prerequisites";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching prerequisites:", err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results.rows);
  });
});

app.get("/api/catalogs", (req, res) => {
  const query = "SELECT catalog_id, catalog_name, description FROM Catalogs ORDER BY catalog_name";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching catalogs:", err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results.rows);
  });
});

app.get("/api/catalogcourses", (req, res) => {
  const query = "SELECT catalog_id, course_name FROM CatalogCourses";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching catalog courses:", err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results.rows);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

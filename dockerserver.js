//jawsDB environment
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();

// Our MySQL for the course data
const courseDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "SolarisDatabase",
});

courseDB.connect((err) => {
  if (err) {
    console.error("Course DB connection failed: " + err.stack);
    return;
  }
  console.log("Connected to Local Course Database.");
});

// Login-system JawsDB database
const userDB = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

userDB.connect(err => {
  if (err) {
    console.error("User DB (JawsDB) connection failed:", err);
  } else {
    console.log("Connected to JawsDB for Login System.");
  }
});

//here is the middleware

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Login Routes here

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//The degree planners API routes(from jonathans original server)

app.get("/api/degree/:majorId", (req, res) => {
  const majorId = req.params.majorId;

  const coreCoursesQuery=`SELECT course_name AS code, description AS title, type FROM Courses WHERE type = 'Core' AND course_name IN (SELECT course_name FROM CatalogCourses WHERE catalog_id = ?)`;
  const mathStatsCoursesQuery = `SELECT course_name AS code, description AS title, type FROM Courses WHERE type = 'Mathematics and Statistics' AND course_name IN (SELECT course_name FROM CatalogCourses WHERE catalog_id = ?)`;
  const concentrationRequiredQuery = `SELECT course_name AS code, description AS title, type FROM Courses WHERE type = 'Conc Required' AND course_name IN (SELECT course_name FROM CatalogCourses WHERE catalog_id = ?)`;
  const concentrationElectivesQuery = `SELECT course_name AS code, description AS title, type FROM Courses WHERE type = 'Conc Elective' AND course_name IN (SELECT course_name FROM CatalogCourses WHERE catalog_id = ?)`;

  Promise.all([
    courseDB.promise().query(coreCoursesQuery, [majorId]),
    courseDB.promise().query(mathStatsCoursesQuery, [majorId]),
    courseDB.promise().query(concentrationRequiredQuery, [majorId]),
    courseDB.promise().query(concentrationElectivesQuery, [majorId])
  ])
  .then(([coreCourses, mathStatsCourses, concentrationRequired, concentrationElectives]) => {
    res.json({
      coreCourses: coreCourses[0],
      mathStatsCourses: mathStatsCourses[0],
      concentration: {
        required: concentrationRequired[0],
        electives: {
          options: concentrationElectives[0]
        }
      }
    });
  })
  .catch((err) => {
    console.error("Error fetching degree data:", err.stack);
    res.status(500).send("Internal Server Error");
  });
});

app.get("/api/courses", (req, res) => {
  const query ="SELECT course_name, description, type FROM Courses";
  courseDB.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.get("/api/prerequisites", (req, res) => {
  const query= "SELECT course_name, prerequisite_name FROM Prerequisites";
  courseDB.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.get("/api/catalogs", (req, res) => {
  const query= "SELECT catalog_id, catalog_name, description FROM Catalogs";
  courseDB.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.get("/api/catalogcourses", (req, res) => {
  const query ="SELECT catalog_id, course_name FROM CatalogCourses";
  courseDB.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});






/*
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'username',
//     password: 'password',
//     database: 'SolarisDatabase'
// });

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "SolarisDatabase",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/courses", (req, res) => {
  const query = "SELECT course_name, description, type FROM Courses";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.get("/api/prerequisites", (req, res) => {
  const query = "SELECT course_name, prerequisite_name FROM Prerequisites";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.get("/api/catalogs", (req, res) => {
  const query = "SELECT catalog_id, catalog_name, description FROM Catalogs";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

app.get("/api/catalogcourses", (req, res) => {
  const query = "SELECT catalog_id, course_name FROM CatalogCourses";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from the database: " + err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

*/
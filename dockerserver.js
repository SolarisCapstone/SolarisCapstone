//jawsDB environment
require("dotenv").config();
//for the usr profiles
const session= require('express-session');

const express = require("express");
const { Pool } = require("pg");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql2");



const app = express();


const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});


pool.connect((err) => {
 if (err) {
   console.error("Database connection failed: " + err.stack);
   return;
 }
 console.log("Connected to PostgreSQL database.");
}
);


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
//the express-session stuff 
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave:false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

//Login Routes here


app.post("/signup", (req, res) => {
 const { username, password } = req.body;
 const sql = "INSERT INTO Users (username, password) VALUES (?, ?)";
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
 const sql = "SELECT * FROM Users WHERE username = ? AND password = ?";
 userDB.query(sql, [username, password], (err, results) => {
   if (err) return res.status(500).send("Login error.");
   if (results.length > 0) {

    req.session.user = {
      id: results[0].id,
      username: results[0].username
    };
    

     res.send("Login successful!");
   } else {
     res.status(401).send("Invalid credentials.");
   }
 });
});

app.get("/api/session", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie('connect.sid'); // this little snippet clears the cookie
    res.send("Logged out");
  });
});


app.get("/", (req, res) => {
 res.sendFile(path.join(__dirname, "public", "index.html"));
});


//The degree planners API routes(from jonathans original server)
app.get("/api/degree/:majorId", async (req, res) => {
 const majorId = req.params.majorId;


 try {
   const coreCoursesQuery = `
     SELECT course_name AS code, description AS title
     FROM Courses
     WHERE type = 'Core' AND course_name IN (
       SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
     )
   `;
   const mathStatsCoursesQuery = `
     SELECT course_name AS code, description AS title
     FROM Courses
     WHERE type = 'Mathematics and Statistics' AND course_name IN (
       SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
     )
   `;
   const concentrationRequiredQuery = `
     SELECT course_name AS code, description AS title
     FROM Courses
     WHERE type = 'Conc Required' AND course_name IN (
       SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
     )
   `;
   const concentrationElectivesQuery = `
     SELECT course_name AS code, description AS title
     FROM Courses
     WHERE type = 'Conc Elective' AND course_name IN (
       SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
     )
   `;


   const coreCourses = await pool.query(coreCoursesQuery, [majorId]);
   const mathStatsCourses = await pool.query(mathStatsCoursesQuery, [majorId]);
   const concentrationRequired = await pool.query(concentrationRequiredQuery, [majorId]);
   const concentrationElectives = await pool.query(concentrationElectivesQuery, [majorId]);


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

app.get("/api/concentrations", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT catalog_name FROM Catalogs ORDER BY catalog_name");
    const concentrations = result.rows.map(row => row.catalog_name);
    res.json(concentrations);
  } catch (err) {
    console.error("Error fetching concentrations:", err);
    res.status(500).send("Server error");
  }
});

const bcrypt = require("bcrypt");

app.post("/api/onboarding", async (req, res) => {
  console.log("Incoming /api/onboarding request body:", req.body);
  const {
    name,
    email,
    password,
    is_advisor,
    major,
    concentration,
    semester,
    year,
    credit_hours,
    summer_classes,
    summer_credits,
    transfer_credits
  } = req.body;


  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const role = is_advisor ? 'advisor' : 'student';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Inserting into Users...");
    const userInsert = await client.query(
      `INSERT INTO Users (email, name, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id`,
      [email, name, hashedPassword, role]
    );
    console.log("Inserted user:", userInsert.rows[0]);


    const userId = userInsert.rows[0].user_id;

    if (role === 'student') {
      await client.query(
        `INSERT INTO UserPreferences (
          user_id, major, concentration, start_semester, start_year,
          credit_hours_per_semester, takes_summer_classes, has_transfer_credits
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          major,
          concentration,
          semester,
          parseInt(year),                    // cast to int
          parseInt(credit_hours),            // cast to int
          summer_classes === 'Yes',          // cast to boolean
          transfer_credits === 'Yes'         // cast to boolean
        ]
      );
    }else {
      await client.query(
        `INSERT INTO AdvisorPreferences (user_id) VALUES ($1)`,
        [userId]
      );
    }

    await client.query("COMMIT");
    res.status(200).send("Preferences saved");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error saving onboarding info:", err.stack); // or err.message
    res.status(500).send("Failed to save preferences");
  }finally {
    client.release();
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running at http://localhost:${PORT}`);
});



// please god work for course catalog
app.get("/api/pg-degree/:majorId", async (req, res) => {
  const majorId = req.params.majorId;

  try {
    const courseQuery = `
      SELECT course_name AS code, 
             description AS title, 
             type, 
             credit_hours
      FROM Courses
      WHERE course_name IN (
        SELECT course_name FROM CatalogCourses WHERE catalog_id = $1
      )
    `;
    const result = await pool.query(courseQuery, [majorId]);

    // Optional: add placeholder status (until you wire real UserPlans data)
    const coursesWithStatus = result.rows.map(course => ({
      ...course,
      status: 'needed' // or 'completed' / 'planned' if you can query that later
    }));

    res.json({ courses: coursesWithStatus });
  } catch (error) {
    console.error("Error fetching degree data:", error);
    res.status(500).send("Internal Server Error");
  }
});
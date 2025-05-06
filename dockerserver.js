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
//Changed from mySQL to PostgreSQL



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

// --- Prerequisite planner shit (i hope) ---

app.get("/api/courses", async (req, res) => {
  // Selects course code and its name (description), orders them for the dropdown
  // Ensure your 'Courses' table has 'course_name' and 'description' columns
  const query = "SELECT course_name AS code, description AS name FROM Courses ORDER BY course_name";
  try {
    // Execute the query using the PostgreSQL pool
    const results = await pool.query(query);
    // Send the resulting rows as JSON
    res.json(results.rows);
  } catch (error) {
    // Log any errors and send a 500 status code
    console.error("Error fetching courses:", error.stack);
    res.status(500).send("Internal Server Error: Could not fetch courses.");
  }
});

// --- End of code to add ---


// app.get("/api/courses", (req, res) => {
//  const query ="SELECT course_name, description, type FROM Courses";
//  courseDB.query(query, (err, results) => {
//    if (err) {
//      console.error("Error fetching data from the database: " + err.stack);
//      return res.status(500).send("Internal Server Error");
//    }
//    res.json(results);
//  });
// });

app.get("/api/prerequisites", (req, res) => {
  const query = `
    SELECT course_name, prerequisite_name 
    FROM Prerequisites
  `;
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching prerequisites:", err.stack);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results.rows); // Use `.rows` for PostgreSQL
  });
});

// app.get("/api/catalogs", (req, res) => {
//  const query= "SELECT catalog_id, catalog_name, description FROM Catalogs";
//  courseDB.query(query, (err, results) => {
//    if (err) {
//      console.error("Error fetching data from the database: " + err.stack);
//      return res.status(500).send("Internal Server Error");
//    }
//    res.json(results);
//  });
// });


// app.get("/api/catalogcourses", (req, res) => {
//  const query ="SELECT catalog_id, course_name FROM CatalogCourses";
//  courseDB.query(query, (err, results) => {
//    if (err) {
//      console.error("Error fetching data from the database: " + err.stack);
//      return res.status(500).send("Internal Server Error");
//    }
//    res.json(results);
//  });
// });


// Return list of concentrations (catalog names)
app.get("/api/concentrations", async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT catalog_name FROM Catalogs ORDER BY catalog_name");
    const names = result.rows.map(row => row.catalog_name);
    res.json(names);
  } catch (err) {
    console.error("Error fetching concentrations:", err);
    res.status(500).send("Failed to fetch concentrations");
  }
});
// Onboarding route for saving user preferences
app.post("/api/onboarding", async (req, res) => {
  const {
    name, email, is_advisor,
    major, concentration,
    semester, year, credit_hours,
    summer_classes, summer_credits,
    transfer_credits
  } = req.body;

  try {
    // 1. Get user_id from existing email
    const userResult = await pool.query(
      `SELECT user_id FROM users WHERE email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).send("User not found. Complete signup first.");
    }

    const userId = userResult.rows[0].user_id;

    // 2. Route logic: insert into student or advisor preferences
    if (!is_advisor) {
      await pool.query(
        `INSERT INTO UserPreferences (
          user_id, major, concentration, start_semester, start_year,
          credit_hours_per_semester, takes_summer_classes, has_transfer_credits
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (user_id) DO UPDATE SET
          major = EXCLUDED.major,
          concentration = EXCLUDED.concentration,
          start_semester = EXCLUDED.start_semester,
          start_year = EXCLUDED.start_year,
          credit_hours_per_semester = EXCLUDED.credit_hours_per_semester,
          takes_summer_classes = EXCLUDED.takes_summer_classes,
          has_transfer_credits = EXCLUDED.has_transfer_credits
        `,
        [
          userId,
          major,
          concentration,
          semester,
          year,
          credit_hours,
          summer_classes === 'Yes',
          transfer_credits === 'Yes'
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO AdvisorPreferences (
          user_id, advising_department, advising_focus, max_advisee_count
        ) VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id) DO UPDATE SET
          advising_department = EXCLUDED.advising_department,
          advising_focus = EXCLUDED.advising_focus,
          max_advisee_count = EXCLUDED.max_advisee_count
        `,
        [userId, 'Computer Science', 'General Advising', 25] // Hardcoded for now
      );
    }

    res.status(200).send("Preferences saved successfully");
  } catch (error) {
    console.error("Error saving onboarding preferences:", error);
    res.status(500).send("Failed to save onboarding preferences");
  }
});


// please god work for course catalog/prerequisite planners
app.get("/api/pg-degree/:majorId", async (req, res) => {
  const majorId = req.params.majorId;

  try {
    const groupedQuery = `
      SELECT 
        c.course_name AS code,
        c.description AS title,
        c.type,
        c.credit_hours
      FROM Courses c
      JOIN CatalogCourses cc ON c.course_name = cc.course_name
      WHERE cc.catalog_id = $1
    `;

    const result = await pool.query(groupedQuery, [majorId]);

    // Group courses by type
    const grouped = {};
    result.rows.forEach(course => {
      if (!grouped[course.type]) {
        grouped[course.type] = [];
      }
      grouped[course.type].push({
        code: course.code,
        title: course.title,
        credit_hours: course.credit_hours,
        type: course.type,
        status: 'needed'  // placeholder for now
      });
    });

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching degree data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/api/courses-with-prereqs', async (req, res) => {
  try {
    // Get all courses
    const coursesResult = await pool.query('SELECT course_name, description FROM Courses');
    const courses = {};
    coursesResult.rows.forEach(row => {
      courses[row.course_name] = {
        name: row.description,
        prereqs: []
      };
    });

    // Get all prerequisites
    const prereqsResult = await pool.query('SELECT course_name, prerequisite_name FROM Prerequisites');
    prereqsResult.rows.forEach(row => {
      if (courses[row.course_name]) {
        courses[row.course_name].prereqs.push(row.prerequisite_name);
      }
    });

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses with prerequisites:', error);
    res.status(500).send('Internal Server Error');
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
 console.log(`Server is running at http://localhost:${PORT}`);
});
const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

const db = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "SolarisDatabase",
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

app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});

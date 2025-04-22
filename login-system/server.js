const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname, "../public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//MySQL connection- no using railway
const db = mysql.createConnection({
  host: "switchyard.proxy.rlwy.net",
  user: "root",
  password: "password",  // here lies the all new Railway password
  database: "login_system",  // new schema
  port: 45892
});
db.connect(err => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL login-system");
  }
});

// This is the route for the signup-vaibhav
app.post("/signup", (req,res) => {
  const { username, password } = req.body;
  const sql="INSERT INTO users (username, password) VALUES (?, ?)";
  db.query(sql, [username, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).send("Username already taken.");
      }
      return res.status(500).send("Error creating user.");
    }
    res.send("Signup successful!");
  });
});

// And this is the route for the login-vaibhav
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).send("Login error.");
    if (results.length > 0) {
      res.send("Login successful!");
    } else {
      res.status(401).send("Invalid credentials.");
    }
  });
});
//server and port stuff ig
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

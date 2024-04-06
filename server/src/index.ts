const path = require("path"); // Add the 'path' module
const express = require("express");
const app = express();

const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const pool = mysql.createPool({
  connectionLimit: process.env.CONNECTION_LIMIT,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.query(
  "SELECT * FROM task",
  function (error: any, results: any, fields: any) {
    if (error) throw error;
    console.log(results);
  }
);

// Serve static files from the 'dist' folder
const distPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(distPath));

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

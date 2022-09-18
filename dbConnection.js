const mysql = require("mysql2");
require('dotenv').config()

const db_connection = mysql 
  .createConnection({

    // host     : 'localhost',
    // user     : 'root', 
    // password : '', 
    // database : 'capno'
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS, 
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection; 
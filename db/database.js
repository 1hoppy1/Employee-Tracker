const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'process.env.SQLPASSWORD',
  database: 'employeeTracker',
});
console.log(process.env.SQLPASSWORD)
console.log('Connected to the employeeTracker database.');

module.exports = db;
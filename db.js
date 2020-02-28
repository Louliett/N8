"use strict"

const mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users',
  multipleStatements: true
});

//connect to the data base
connection.connect((err) => {
  if(!err) {
    console.log("DB Connection Successful!");
  } else {
    console.log("DB Connection Failed!" + err);
  }
});

module.exports = connection;

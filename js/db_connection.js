"use strict"
var express = require('express');
var mysql = require('mysql');
var app = express();
var port = 3000;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users'
});

connection.connect(function(error) {
  if(!!error) {
    console.log('Connection Failed!' + error.message);
  } else {
    console.log('Connection Successful!');
  }
});

app.get('/query', function(req, resp) {
  //about
  connection.query("select * from customers", function(error, rows, fields) {
    if(!!error) {
      console.log('Invalid Query!' + error);
    } else {
      console.log('Successful Query!');
      rows.forEach( (row) => {
        console.log(`${row.name}`);
      });
    }
  });
})

app.listen(port);

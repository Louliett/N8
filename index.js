"use strict"

const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();
var port = 3000;

app.use(bodyparser.json());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users',
  multipleStatements: true
});

connection.connect((err) => {
  if(!err) {
    console.log("DB Connection Successful!");
  } else {
    console.log("DB Connection Failed!");
  }
});

app.listen(port, () => console.log('Express server is running on port: ' + port));

app.get('/customers', (request, response) => {
  connection.query('SELECT * from customers', (err, rows, fields) => {
    if(!err) {
      response.send(rows);
    } else {
      console.log(err);
    }
  });
});

app.get('/customers/:id', (request, response) => {
  connection.query('SELECT * from customers WHERE id = ?',[request.params.id], (err, rows, fields) => {
    if(!err) {
      response.send(rows);
    } else {
      console.log(err);
    }
  });
});

app.delete('/customers/:id', (request, response) => {
  connection.query('DELETE FROM customers WHERE id = ?', [request.params.id], (err, rows, fields) => {
    if(!err) {
      response.send('Deletion Complete!');
    } else {
      console.log(err);
    }
  });
});

app.post('/customers', (request, response) => {
  let cus = request.body;
  var sql = "INSERT INTO customers (name) VALUES (?)"
  connection.query(sql, [cus.name], (err, rows, fields) => {
    if(!err) {
      response.send('This person was added: ' + rows);
    } else {
      console.log(err);
    }
  });
});

app.put('/customers', (request, response) => {
  let cus = request.body;
  var sql = "UPDATE customers SET name = ? WHERE id = ?"
  connection.query(sql, [cus.name, cus.id], (err, rows, fields) => {
    if(!err) {
      response.send('Updated Successfuly!');
    } else {
      console.log(err);
    }
  });
});

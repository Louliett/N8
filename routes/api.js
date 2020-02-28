"use strict"

const express = require('express');
const connection = require('../db')
const router = express.Router();



//get a list of users from db
router.get('/customers', (request, response, next) => {
  connection.query('SELECT * from customers', (err, rows, fields) => {
    if(!err) {
      console.log(request.body);
      response.send(rows);
    } else {
      console.log(err);
    }
  });
});

//get a specific user based on id
router.get('/customers/:id', (request, response, next) => {
    connection.query('SELECT * from customers WHERE id = ?',[request.params.id], (err, rows, fields) => {
      if(!err) {
        console.log("this runs");
        response.send(rows);

      } else {
        console.log(err);
        next(err);
      }
    });
});

//create a new user
router.post('/customers', (request, response, next) => {
  let cus = request.body;
  var sql = "INSERT INTO customers (name) VALUES (?)"
  connection.query(sql, [cus.name], (err, rows, fields) => {
    if(!err) {
      response.send(cus);
    } else {
      console.log(err);
    }
  });
});

//update a specific user based on id
router.put('/customers', (request, response, next) => {
  let cus = request.body;
  var sql = "UPDATE customers SET name = ? WHERE id = ?";
  connection.query(sql, [cus.name, cus.id], (err, rows, fields) => {
    if(!err) {
      //response.send('Updated Successfuly!');
    } else {
      console.log(err);
    }
  });
});

//delete a specific user based on id
router.delete('/customers', (request, response, next) => {
  let cus = request.body;
  var sql = "DELETE FROM customers WHERE id = ?";
  connection.query(sql, [cus.id], (err, rows, fields) => {
    if(!err) {
      response.send(rows);
    } else {
      console.log(err);
      next(err);
    }
  });
});

module.exports = router;

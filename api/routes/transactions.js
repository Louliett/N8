"use strict"

const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//get transaction based on user id
router.post('/customer-transaction-id', (req, res) => {

  connection.query(sql, [], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//create transaction based on user id
router.post('/create transaction', (req, res) => {

  connection.query(sql, [], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("transaction created");
    }
  });
});














module.exports = router;

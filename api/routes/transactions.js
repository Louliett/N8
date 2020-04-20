"use strict"

const express = require('express');
const connection = require('../../db');
var nodemailer = require('nodemailer');
const router = express.Router();

var sql;
//server email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'motandolofan@gmail.com',
    pass: 'hanumatut0r'
  }
});


//get transaction based on user id
router.post('/customer-transaction-id', (req, res) => {

  connection.query(sql, [], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//create transaction based on user id
router.post('/create-transaction', (req, res) => {

  connection.query(sql, [], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send("transaction created");
    }
  });
});

//create unregistred user transaction
router.post('/create-unregistered', (req, res) => {
  var trans = req.body;
  var email = req.body.email;

  console.log(trans, "body");
  var info = [trans.code, trans.first_name, trans.last_name,
    trans.shipping_address, trans.billing_address, trans.card_details,
    trans.total_amount, trans.items, trans.email, trans.timestamp,
    trans.type];
    var str = JSON.stringify(trans);

  const data = {
    code: trans.code,
    first_name: trans.first_name,
    last_name: trans.last_name,
    shipping_address: trans.shipping_address,
    billing_address: trans.billing_address,
    card_details: trans.card_details,
    total_amount: trans.total_amount,
    items: trans.items,
    email: trans.email,
    timestamp: trans.timestamp,
    type: trans.type
  };


  console.log(info);
  sql = "INSERT INTO unregistred_transaction (code, first_name, last_name, " +
        "shipping_address, billing_address, card_details, total_amount, " +
        "items, email, timestamp, type) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

  connection.query(sql, info, (err, rows, fields) => {
      if(err) {
        res.send(err);
      } else {
        res.render("receipt", data);
        // var mailOptions = {
        //   from: 'motandolofan@gmail.com',
        //   to: email,
        //   subject: 'N8 Receipt',
        //   text: str
        // };
        //
        // transporter.sendMail(mailOptions, function(error, info) {
        //   if (error) {
        //     console.log(error);
        //     res.send(error);
        //   } else {
        //
        //     console.log('Email sent: ' + info.response);
        //   }
        // });

      }
    });


});


router.get('/test', (req, res) => {
  res.sendFile('/receipt.html', {root : __dirname});
});







module.exports = router;

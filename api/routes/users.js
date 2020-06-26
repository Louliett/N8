"use strict";

const express = require('express');
const connection = require('../../db');
//stripe payment --------------------------------------
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config({
    path: './.env'
  });
}
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripe = require('stripe')(stripeSecretKey);
//---------------------------------------------------
const router = express.Router();
//reusable variables
var id;
var sql;
var role;
var user;
var values;

//get all the admins
router.get('/get-admins', (req, res) => {
  role = "admin";
  sql = "SELECT * FROM user WHERE user.role = ?; ";
  connection.query(sql, [role], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//get all the customers
router.get('/get-customers', (req, res) => {
  role = "customer";
  sql = "SELECT * FROM user WHERE user.role = ?;";
  connection.query(sql, [role], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//get customer based on id
router.post('/get-customer-by-id', (req, res) => {
  id = req.body.id;
  role = "customer";
  sql = "SELECT * FROM user WHERE id = ? AND role = ?";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//create a new customer
router.post('/register-customer', (req, res) => {
  user = req.body;
  role = "customer";

  createStripeCustomer(user.email, user.first_name + " " + user.last_name)
    .then((stripeCustomer) => {

      values = [stripeCustomer.id, role, user.first_name, user.last_name, user.email, user.password];
      sql = "INSERT INTO user (stripe_id, role, first_name, last_name, email, password) " +
            "VALUES (?, ?, ?, ?, ?, ?); ";
      connection.query(sql, values, (err, rows, fields) => {
        if (err) {
          res.send(err);
        } else {
          res.send("Customer Created!");
        }
      });

    }).catch(error => console.error(error));


});

async function createStripeCustomer(cus_email, cus_name) {

  var stripeCustomer = await stripe.customers.create({
    email: cus_email,
    name: cus_name,
  });

  return stripeCustomer;
}


//create a new admin
router.post('/register-admin', (req, res) => {
  user = req.body;
  role = "admin";
  values = [role, user.first_name, user.last_name, user.email, user.password];

  sql = "INSERT INTO user (role, first_name, last_name, email, password) " +
    "VALUES (?, ?, ?, ?, ?); ";

  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Admin Created!");
    }
  });
});

//login user if exists
router.post('/login-user', (req, res) => {
  user = req.body;
  sql = "SELECT user.* " +
    "FROM user " +
    "WHERE email=? AND password=?; ";
  connection.query(sql, [user.email, user.password], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//check if email exists in db
router.post('/check-email', (req, res) => {
  var email = req.body.email;
  sql = "SELECT email " +
    "FROM user " +
    "WHERE email = ?; ";
  connection.query(sql, [email], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      if (rows == 0) {
        res.send(false);
      } else {
        res.send(true);
      }
    }
  });
});

//update customer
router.put('/update-customer', (req, res) => {
  user = req.body;
  role = "customer";
  values = [user.first_name, user.last_name, user.id, role];
  sql = "UPDATE user " +
    "SET first_name = ?, last_name = ? " +
    "WHERE user.id = ? AND user.role = ?";
  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send("Customer Updated!");
    }
  });
});

//deletes a customer based on id (to be added transaction)
router.delete('/delete-customer', (req, res) => {
  id = req.body.id;
  role = "customer";
  sql = "DELETE user_address, address, card, user " +
    "FROM user " +
    "LEFT JOIN user_address ON user.id = user_address.user_id " +
    "LEFT JOIN address ON user_address.address_id = address.id " +
    "LEFT JOIN card ON user.id = card.user_id " +
    "WHERE user.id = ? AND user.role = ?;";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send("customer deleted!");
    }
  });
});

//deletes an user based on email
router.delete('/delete-admin', (req, res) => {
  id = req.body.id;
  role = "admin";
  sql = "DELETE FROM user WHERE id = ? AND role = ?;";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send("admin deleted!");
    }
  });
});


module.exports = router;
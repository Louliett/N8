//"use strict"

const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//get all the admins
router.get('/get-admins', (req, res) => {
  var role = "admin";
  sql = "SELECT * FROM user WHERE user.role = ?; ";
  connection.query(sql, [role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//get all the customers
router.get('/get-customers', (req, res) => {
  var role = "customer";
  sql = "SELECT * FROM user WHERE user.role = ?;";
  connection.query(sql, [role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//get customer based on id
router.post('/get-customer-by-id', (req, res) => {
  var id = req.body.id;
  var role = "customer";
  sql = "SELECT * FROM user WHERE id = ? AND role = ?";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//create a new customer
router.post('/register-customer', (req, res) => {
  var user = req.body;
  var role = "customer";
  sql = "INSERT INTO user (role, first_name, last_name, email, password) " +
        "VALUES (?, ?, ?, ?, ?); ";
  connection.query(sql, [role, user.first_name, user.last_name,
    user.email, user.password], (err, rows, fields) => {
      if(err) {
        res.send(err);
      } else {
        res.send(" was created!");
        console.log(user);
      }
  });
});

//create a new admin
router.post('/register-admin', (req, res) => {
  var user = req.body;
  var role = "admin";
  sql = "INSERT INTO user (role, first_name, last_name, email, password) " +
        "VALUES (?, ?, ?, ?, ?); ";
  connection.query(sql, [role, user.first_name, user.last_name,
    user.email, user.password], (err, rows, fields) => {
      if(err) {
        res.send(err);
      } else {
        console.log(user);
      }
  });
});

//login user if exists
router.post('/login-user', (req, res) => {
  var user = req.body;
  console.log(user);
  sql = "SELECT user.* " +
        "FROM user " +
        "WHERE email=? AND password=?; ";
  connection.query(sql, [user.email, user.password], (err, rows, fields) => {
      if(err) {
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
  var user = req.body;
  console.log(user);
  var role = "customer";
  sql = "UPDATE user " +
        "SET first_name = ?, last_name = ? " +
        "WHERE user.id = ? AND user.role = ?";
  connection.query(sql, [user.first_name, user.last_name,
    user.id, role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("customer updated!");
    }
  });
});

//deletes a customer based on id (to be added transaction)
router.delete('/delete-customer', (req, res) => {
  var id = req.body.id;
  var role = "customer";
  sql = "DELETE user_address, address, card, user " +
        "FROM user " +
        "LEFT JOIN user_address ON user.id = user_address.user_id " +
        "LEFT JOIN address ON user_address.address_id = address.id " +
        "LEFT JOIN card ON user.id = card.user_id " +
        "WHERE user.id = ? AND user.role = ?;";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("customer deleted!");
    }
  });
});

//deletes an user based on email
router.delete('/delete-admin', (req, res) => {
  var id = req.body.id;
  var role = "admin";
  sql = "DELETE FROM user WHERE id = ? AND role = ?;";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("admin deleted!");
    }
  });
});


module.exports = router;

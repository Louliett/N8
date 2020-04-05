//"use strict"

const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;


//get all the admins
router.get('/get-admins', (req, res) => {
  var role = "admin";
  sql = "SELECT user.first_name, user.last_name, user.email, address.phone_number, " +
        "address.name, address.city, address.postcode, address.country " +
        "FROM user " +
        "LEFT JOIN user_address ON user.id = user_address.user_id " +
        "left join address on user_address.address_id = address.id " +
        "WHERE user.role = ?; ";
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
  sql = "SELECT user.first_name, user.last_name, user.email, address.phone_number, " +
        "address.name, address.city, address.postcode, address.country " +
        "FROM user " +
        "LEFT JOIN user_address ON user.id = user_address.user_id " +
        "left join address on user_address.address_id = address.id " +
        "WHERE user.role = ?; ";
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

//deletes an user based on email
router.delete('/delete-user', (req, res) => {
  var email = req.body.email;
  sql = "DELETE address, user_address " +
        "FROM address " +
        "INNER JOIN user_address ON address.id = user_address.address_id " +
        "WHERE user_id = (Select id from user where email=?); " +
        "DELETE FROM user " +
        "WHERE user.email=?; ";
  connection.query(sql, [email, email], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(email + " was deleted!");
    }
  });
});


module.exports = router;

"use strict"


const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;
var id;
var address;

//get address based on customer
router.post('/customer-address-id', (req, res) => {
  id = req.body.id;
  var role = "customer";
  sql = "SELECT address.* " +
        "FROM user " +
        "LEFT JOIN user_address ON user.id = user_address.user_id " +
        "LEFT JOIN address ON user_address.address_id = address.id " +
        "WHERE user.id = ? AND user.role = ?; ";
  connection.query(sql, [id, role], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//create address
// router.post('/create-address', (req, res) => {
//   var adr = req.body;
//   sql = "INSERT INTO address(name, second_name, city, postcode, phone_number, shipping) " +
//         "VALUES (?, ?, ?, ?, ?, ?); " +
//         "INSERT INTO user_address (user_id, address_id) " +
//         "VALUES (?, (SELECT id FROM address WHERE name=? AND second_name=? AND city =? AND postcode =?)); ";
//   connection.query(sql, [adr.name, adr.second_name, adr.city, adr.postcode,
//     adr.phone_number, adr.shipping, adr.id, adr.name, adr.second_name,
//     adr.city, adr.postcode], (err, rows, fields) => {
//        if(err) {
//          res.send(err);
//        } else {
//          res.send("created!");
//        }
//      });
// });

//create address
router.post('/create-address', (req, res) => {
  var adr = req.body;
  var customer_id = req.body.id;
  sql = "INSERT INTO address(name, second_name, city, postcode, phone_number, shipping) " +
        "VALUES (?, ?, ?, ?, ?, ?); " + 
        "SET @addressID = LAST_INSERT_ID(); " +
        "INSERT INTO user_address (user_id, address_id) " +
        "VALUES (?, @addressID); ";
  connection.query(sql, [adr.name, adr.second_name, adr.city, adr.postcode,
    adr.phone_number, adr.shipping, customer_id], (err, rows, fields) => {
       if(err) {
         res.send(err);
       } else {
         console.log(sql);
         res.send("created!");
       }
     });
});

//update address
router.put('/update-address', (req, res) => {
  console.log(req.body);
  var cid = req.body.customer_id;
  var aid = req.body.address_id;
  address = req.body;
  sql = "UPDATE address " +
        "JOIN user_address ON user_address.address_id = address.id " +
        "SET name=?, second_name=?, city=?, postcode=?, phone_number=?, shipping=? " +
        "WHERE user_address.user_id = ? AND user_address.address_id = ?; ";
  connection.query(sql, [address.name, address.second_name, address.city, address.postcode,
    address.phone_number, address.shipping, cid, aid], (err, rows, fields) => {
      if(err) {
        res.send(err);
      } else {
        res.send("updated!");
      }
  });
});

//delete address based on user id and address id
router.delete('/delete-address', (req, res) => {
  var uid = req.body.customer_id;
  var aid = req.body.address_id;
  sql = "DELETE address, user_address " +
        "FROM address " +
        "INNER JOIN user_address ON address.id = user_address.address_id " +
        "WHERE user_id = ? and address_id = ?; ";
  connection.query(sql, [uid, aid], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("deleted!");
    }
  });
});

//change shipping address
router.put('/update-shipping-address', (req, res) => {
  var cid = req.body.customer_id;
  var aid = req.body.address_id;
  var on = "1";
  var off = "0";
  sql = "UPDATE address " +
        "SET shipping = ?" +
        "WHERE id = ?; " +
        "UPDATE address " +
        "JOIN user_address ON user_address.address_id = address.id " +
        "SET shipping = ? " +
        "WHERE user_address.user_id = ? AND user_address.address_id !=?; ";
  connection.query(sql, [on, aid, off, cid, aid], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("Shipping changed!")
    }
  });
});

module.exports = router;

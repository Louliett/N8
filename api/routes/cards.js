"use strict"


const express = require('express');
const connection = require('../../db');
const router = express.Router();

var sql;



// get cards
router.post('/get-card', (req, res) => {
  var user_id = req.body.cus_id;
  sql = "SELECT card.*, currency_code.name AS currency, card_type.name AS type " +
        "FROM user " +
        "JOIN card ON user.id = card.user_id " +
        "JOIN currency_code ON card.currency_code_id = currency_code.id " +
        "JOIN card_type ON card.card_type_id = card_type.id " +
        "WHERE user.id = ?; ";
  connection.query(sql, [user_id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//create card
router.post('/create-card', (req, res) => {
  var card = req.body;
  sql = "INSERT INTO card (user_id, card_type_id, currency_code_id, number, holder, month, year, cvv) " +
        "VALUES (?, (SELECT id FROM card_type WHERE name = ?), " +
        "(SELECT id from currency_code where name = ?), ?, ?, ?, ?, ?); ";
  connection.query(sql, [card.cus_id, card.type, card.currency, card.number,
    card.holder, card.month, card.year, card.cvv], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      console.log(sql);
      res.send("card created!")
    }
  });
});

//delete card
router.delete('/delete-card', (req, res) => {
  var id = req.body.card_id;
  sql = "DELETE FROM card WHERE id = ?; ";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("card deleted!")
    }
  });
});

module.exports = router;

"use strict";

const express = require('express');
const connection = require('../../db');
const nodemailer = require('nodemailer');
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
//server email
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'motandolofan@gmail.com',
    pass: 'hanumatut0r'
  }
});

//reusable variables
var sql;
var sql2;


//get stripe public key
router.get('/get-public-key', (req, res) => {
  res.send(stripePublicKey);
});


router.post('/purchase', (req, res) => {
  var items = req.body.items;

  createSession(items)
    .then((result) => {

      console.log(result, "session");

      res.send(result);

    }).catch(error => console.error(error));


});

async function createSession(items) {

  var products = [];

  for (let i = 0; i < items.length; i++) {
    products.push({
      price: items[i].stripe_price,
      quantity: items[i].quantity
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: products,
    mode: 'payment',
    success_url: 'http://localhost:3000/public/path//payment_success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/public/path/cart.html',
  });

  return session;
}

//update product quantity after purchase
router.post('/products-purchased', (req, res) => {
  var products = req.body.products;
  sql = "SELECT product.price, product.quantity FROM product WHERE id = ?;";
  sql2 = "UPDATE product SET quantity = GREATEST(0, quantity - ?) WHERE id = ?;";

  //iterate through the items from the request
  for (let i = 0; i < products.length; i++) {

    //at each iteration, make a DB call to fetch the price for a product
    connection.query(sql, [products[i].id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        //if the quantity of a product is not 0 then decrease quantity by 1
        if (rows[0].quantity > 0) {

          connection.query(sql2, [products[i].quantity, products[i].id], (err, rows, fields) => {
            if (err) {
              res.send(err);
            } else {
              res.send("Products quantities updated!");
            }
          });
        } else {
          res.send("There are no items left");
        }

      }
    });

  }

});

//get transaction based on user id
router.post('/puvvrchase', (req, res) => {
  var items = req.body.items;
  var token = req.body.token;
  let total = 0;
  sql = "SELECT product.price, product.quantity FROM product WHERE id = ?;";
  sql2 = "UPDATE product SET quantity = quantity - ? WHERE  id = ?;";
  //console.log(token, "id");

  //iterate through the items from the request
  for (let i = 0; i < items.length; i++) {

    //at each iteration, make a DB call to fetch the price for a product
    connection.query(sql, [items[i].id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        //increase the total price by adding product price and quantity
        total = total + parseFloat(rows[0].price) * parseInt(items[i].quantity);
        console.log(rows[0].quantity, "quantity");

        //if the quantity of a product is not 0 then decrease quantity by 1
        if (rows[0].quantity > 0) {
          console.log("quantity > 0");

          connection.query(sql2, [items[i].quantity, items[i].id], (err, rows, fields) => {
            if (err) {
              res.send(err);
            } else {

              //by the end of all the items in the cart, maake a purchase
              if (i === items.length - 1) {

                stripe.charges.create({
                  amount: total * 100,
                  source: token.id,
                  currency: 'bgn'
                }).then(() => {

                  const data = {
                    "card_brand": token.card.brand,
                    "card_last4": token.card.last4,
                    "card_holder": token.card.name,
                    "date": token.created,
                    "email": token.email,
                    "total_amount": total + "Lev"
                  };

                  //on purchase success, inflate a page with purchase infor
                  res.render("receipt", data);


                }).catch((error) => {
                  console.log(error);
                  res.send(error);
                });
              }

            }
          });
        } else {
          console.log("quantity = 0");

          res.send("There are no items left");
        }



      }
    });

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

  var info = [trans.code, trans.first_name, trans.last_name,
    trans.shipping_address, trans.billing_address, trans.card_details,
    trans.total_amount, trans.items, trans.email, trans.timestamp,
    trans.type
  ];

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
    if (err) {
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
  res.sendFile('/receipt.html', {
    root: __dirname
  });
});

module.exports = router;
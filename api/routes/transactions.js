"use strict";

const express = require('express');
const connection = require('../../db');
const nodemailer = require('nodemailer');
const {
  get
} = require('./products');
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
  var cus = req.body;

  console.log(cus.stripe_id, "customerid");


  if (cus.stripe_id === "") {
    createUnregistredSession(items)
      .then((result) => {

        console.log(result, "session");
        res.send(result);

      }).catch(error => console.error(error));
  } else {
    createRegistredSession(items, cus.stripe_id)
      .then((result) => {

        console.log(result, "session");
        res.send(result);

      }).catch(error => console.error(error));
  }


});

async function createRegistredSession(items, customer_id) {

  var products = [];

  for (let i = 0; i < items.length; i++) {
    products.push({
      price: items[i].stripe_price,
      quantity: items[i].quantity
    });
  }

  const session = await stripe.checkout.sessions.create({
    customer: customer_id,
    payment_method_types: ['card'],
    line_items: products,
    mode: 'payment',
    success_url: 'http://localhost:3000/public/path/payment_success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:3000/public/path/cart.html',
  });

  return session;
}

async function createUnregistredSession(items) {

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
    success_url: 'http://192.168.0.108:3000/public/path/payment_success.html?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://192.168.108:3000/public/path/cart.html',
  });

  return session;
}


router.post('/get-stripe-session-line-items', (req, res) => {
  var session_id = req.body.sessionid;

  getStripeSessionLineItems(session_id)
    .then((session) => {
      console.log(session, "session");

      res.send(session);
    }).catch(error => console.error(error));
});


//update product quantity after purchase
router.post('/purchased-products', (req, res) => {
  var products = req.body.products;
  sql = "SELECT product.price, product.quantity FROM product WHERE stripe_price = ?;";
  sql2 = "UPDATE product SET quantity = GREATEST(0, quantity - ?) WHERE stripe_price = ?;";
  console.log(products, "products");

  //iterate through the items from the request
  for (let i = 0; i < products.length; i++) {

    //at each iteration, make a DB call to fetch the price for a product
    connection.query(sql, [products[i].stripe_id], (err, rows, fields) => {
      if (err) {
        //res.send(err);
        console.log(err);

      } else {
        //if the quantity of a product is not 0 then decrease quantity by 1
        if (rows[0].quantity > 0) {

          connection.query(sql2, [products[i].quantity, products[i].stripe_id], (err, rows, fields) => {
            if (err) {
              res.send(err);
            } else {
              res.send("Products quantities updated!");
            }
          });
        } else {
          console.log("there are no items left");

          //res.send("There are no items left");
        }

      }
    });

  }

});




//get transaction based on user id
// router.post('/puvvrchase', (req, res) => {
//   var items = req.body.items;
//   var token = req.body.token;
//   let total = 0;
//   sql = "SELECT product.price, product.quantity FROM product WHERE id = ?;";
//   sql2 = "UPDATE product SET quantity = quantity - ? WHERE  id = ?;";
//   //console.log(token, "id");

//   //iterate through the items from the request
//   for (let i = 0; i < items.length; i++) {

//     //at each iteration, make a DB call to fetch the price for a product
//     connection.query(sql, [items[i].id], (err, rows, fields) => {
//       if (err) {
//         res.send(err);
//       } else {
//         //increase the total price by adding product price and quantity
//         total = total + parseFloat(rows[0].price) * parseInt(items[i].quantity);
//         console.log(rows[0].quantity, "quantity");

//         //if the quantity of a product is not 0 then decrease quantity by 1
//         if (rows[0].quantity > 0) {
//           console.log("quantity > 0");

//           connection.query(sql2, [items[i].quantity, items[i].id], (err, rows, fields) => {
//             if (err) {
//               res.send(err);
//             } else {

//               //by the end of all the items in the cart, maake a purchase
//               if (i === items.length - 1) {

//                 stripe.charges.create({
//                   amount: total * 100,
//                   source: token.id,
//                   currency: 'bgn'
//                 }).then(() => {

//                   const data = {
//                     "card_brand": token.card.brand,
//                     "card_last4": token.card.last4,
//                     "card_holder": token.card.name,
//                     "date": token.created,
//                     "email": token.email,
//                     "total_amount": total + "Lev"
//                   };

//                   //on purchase success, inflate a page with purchase infor
//                   res.render("receipt", data);


//                 }).catch((error) => {
//                   console.log(error);
//                   res.send(error);
//                 });
//               }

//             }
//           });
//         } else {
//           console.log("quantity = 0");

//           res.send("There are no items left");
//         }



//       }
//     });

//   }

// });


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

//get stripe payment intent object
router.get('/payment-intent/:paymentid', (req, res) => {
  var payment_id = req.params.paymentid;

  getPaymentIntent(payment_id)
    .then((payment) => {
      console.log(payment, "http received");

      res.send(payment);
    }).catch(error => res.send(error));
});

//get stripe session id object
router.get('/stripe-session/:id', (req, res) => {
  var session_id = req.params.id;

  getSession(session_id).then((session) => {
    res.send(session);
  }).catch(error => res.send(error));
});

router.post('/create-order', (req, res) => {
  var session_id = req.body.sessionid;
  var values;
  //console.log(sql, "at begining");

  var sql = "INSERT INTO orders (receipt_number, created, amount) VALUES (?, ?, ?); " +
    "SET @orderID = LAST_INSERT_ID(); " +
    "INSERT INTO user_order (user_id, order_id) VALUES " +
    "((SELECT id FROM user WHERE stripe_id = ?), @orderID); ";
  console.log(session_id, "from request");

  getSession(session_id)
    .then((session) => {
      console.log(session, "get session");

      getPaymentIntent(session.payment_intent)
        .then((intent) => {
          //console.log(intent, "intent");
          console.log(intent.charges.data[0], "datazero");
          console.log(intent.charges.data[0].receipt_number, "receipt number");
          console.log(intent.created, "created");
          console.log(intent.amount / 100, "amount");
          console.log(session.customer, "customer");

          //we pass to the array the receipt_number, data created, amount and stripe customer
          values = [intent.charges.data[0].receipt_number, intent.created, intent.amount / 100, session.customer];

          console.log(sql, "cursed sql");
          console.log(values, "values");

          connection.query(sql, values, (err, rows, fields) => {
            if (err) {
              res.send(err);
            } else {
              res.sendStatus(201);
            }
          });
        }).catch(error => console.error(error));

    }).catch(error => res.send(error));

});


router.get('/orders/:id', (req, res) => {
  var user_id = req.params.id;

  sql = "SELECT orders.* " +
    "FROM user " +
    "LEFT JOIN user_order ON user.id = user_order.user_id " +
    "LEFT JOIN orders ON user_order.order_id = orders.id " +
    "WHERE user.id = ?;";
  connection.query(sql, [user_id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });

});

//Stripe session ----------------------------------------------------------

async function getSession(session_id) {
  var session = await stripe.checkout.sessions.retrieve(session_id);
  return session;
}

async function getStripeSessionLineItems(session_id) {
  let stripeSession = await stripe.checkout.sessions.listLineItems(session_id);
  return stripeSession;
}

//Stripe payment intent --------------------------------------------------

async function getPaymentIntent(payment_id) {
  var paymentIntent = await stripe.paymentIntents.retrieve(payment_id);
  return paymentIntent;
}

module.exports = router;
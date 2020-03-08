"use strict"

const express = require('express');
const connection = require('../db');
const router = express.Router();


//select all subcategories
router.get('/subcategory', (request, response, next) => {
  connection.query('SELECT name FROM subcategory', (err, rows, fields) => {
    if(!err) {
      response.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select all categories
router.get('/category', (request, response, next) => {
  connection.query('SELECT name FROM category', (err, rows, fields) => {
    if(!err) {
      response.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select all sections
router.get('/section', (request, response, next) => {
  connection.query('SELECT name FROM section', (err, rows, fields) => {
    if(!err) {
      response.send(rows);
    } else {
      console.log(err);
    }
  });
});

//create a new product
router.post('/create-product', (request, response, next) => {
  let product = request.body;
  var sql = "INSERT INTO product (name, price, new_price, ean, quantity, brand, design, image_link, description, material, colour, length, width, height, volume, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);INSERT INTO product_category (product_id, subcategory_id, category_id, section_id) VALUES ((SELECT id FROM product WHERE ean=?), (SELECT id FROM subcategory WHERE name=?), (SELECT id FROM category WHERE name=?), (SELECT id FROM section WHERE name=?))";


  connection.query(sql, [product.name, product.price, product.new_price, product.ean, product.quantity, product.brand, product.design, product.image_link, product.description, product.material,
    product.colour, product.length, product.width, product.height, product.volume, product.weight, product.ean, product.subcategory, product.category, product.section], (err, rows, fields) => {
    if(!err) {
      //response.send(product);
    } else {
      console.log(err);
    }
  });
});

//get all products
// router.get('/get-products', (request, response, next) => {
//   var queries = [
//     "SELECT * FROM product",
//     "SELECT * FROM registros"
//   ];
//   connection.query(sql, (err, rows, fields) => {
//     if(!err) {
//       response.send(rows);
//       console.log(rows);
//     } else {
//       console.log(err);
//     }
//   });
// });


module.exports = router;

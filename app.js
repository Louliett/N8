"use strict"

const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const bodyparser = require('body-parser');
//const multer = require('multer');
const product_routes = require('./api/routes/products');
//var upload = require('./api/routes/products');
var app = express();


app.use(morgan('dev'));
//app.use(upload);
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json()); // IDEA: add limit
app.use(cors());

//routes which should handle requests
app.use('/products', product_routes);
app.use(express.static('public'));

//error handling (should always be last!)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message
  });
});

module.exports = app;

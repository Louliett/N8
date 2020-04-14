"use strict"

const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const path = require('path');
const bodyparser = require('body-parser');
const users_route = require('./api/routes/users');
const products_route = require('./api/routes/products');
const addresses_route = require('./api/routes/addresses');
const cards_route = require('./api/routes/cards');
const classifications_route = require('./api/routes/classifications');
var app = express();



app.use(cors());
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json()); // IDEA: add limit

//API routes
app.use('/users', users_route);
app.use('/products', products_route);
app.use('/addresses', addresses_route);
app.use('/cards', cards_route);
app.use('/classifications', classifications_route);
//Static files
app.use('/public', express.static('public'));


//error handling (should always be last!)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});


module.exports = app;

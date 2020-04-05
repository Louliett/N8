"use strict"

const express = require('express');
const morgan = require('morgan');
var cors = require('cors');
const bodyparser = require('body-parser');
const users_route = require('./api/routes/users');
const products_route = require('./api/routes/products');
const classifications_route = require('./api/routes/classifications');
var app = express();



app.use(cors());
//app.use('*', cors());
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json()); // IDEA: add limit

////routes which should handle requests
app.use('/users', users_route);
app.use('/products', products_route);
app.use('/classifications', classifications_route);
app.use(express.static('public'));

//error handling (should always be last!)
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});


module.exports = app;

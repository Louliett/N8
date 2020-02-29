"use strict"

const express = require('express');
const bodyparser = require('body-parser');
const routes = require('./routes/api');
var app = express();
var port = 3000;


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Middlewares below
app.use(express.static('public'));

//set up bodyparser (order is important!!)
app.use(bodyparser.json()); // IDEA: add limit

//initialize routes
app.use('/api', routes);

//error handling (should always be last!)



//set up the server on a specific port
app.listen(
  process.env.port || port, () =>
  console.log('Express server is running on port: ' + port)
);

"use strict"

const express = require('express');
const cors = require('cors');
const connection = require('../../db');
const multer = require('multer');
const path = require('path');
const router = express.Router();
var sql;

const storage = multer.diskStorage({
  destination: './public/images/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {fileSize: 1024 * 1024 * 10},
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);  }
}).array('myImage', 3);

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if(extname && mimetype) {
    return cb(null, true);
  } else {
    return cb('Invalid file type');
  }
}


router.post('/upload', (req, res) => {

  upload(req, res, (err) => {
    if(err) {
      res.send(err);
    } else {
      console.log(req.files);

      for(var i=0; i<req.files.length; i++){
        console.log(req.files[i].filename);
        console.log(req.files[i].destination);
      }
      res.send('works');
    }
  });
});


//select all subcategories
router.get('/subcategory', (req, res, next) => {
  sql = "SELECT name FROM subcategory";
  connection.query(sql, (err, rows, fields) => {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select all categories
router.get('/category', (req, res, next) => {
  sql = "SELECT name FROM category";
  connection.query(sql, (err, rows, fields) => {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select all sections
router.get('/section', (req, res, next) => {
  sql = "SELECT name FROM section";
  connection.query(sql, (err, rows, fields) => {
    if(!err) {
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//create a new product
router.post('/create-product', (req, res, next) => {
  let product = req.body;
  sql = "INSERT INTO product (name, price, new_price, ean, quantity, brand, design, description, material, colour, length, width, height, volume, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);INSERT INTO product_category (product_id, subcategory_id, category_id, section_id) VALUES ((SELECT id FROM product WHERE ean=?), (SELECT id FROM subcategory WHERE name=?), (SELECT id FROM category WHERE name=?), (SELECT id FROM section WHERE name=?))";

  connection.query(sql, [product.name, product.price, product.new_price, product.ean, product.quantity, product.brand, product.design, product.description, product.material,
    product.colour, product.length, product.width, product.height, product.volume, product.weight, product.ean, product.subcategory, product.category, product.section], (err, rows, fields) => {
    if(!err) {
      //response.send(product);
    } else {
      console.log(err);
    }
  });
});

router.post('/test', (req, res) => {

  upload(req, res, (err) => {

    if(err) {
      res.send(err);
      console.log("Images were not uploaded to the server!!");
	  } else {

      let product = req.body;
      sql = "INSERT INTO product (name, price, new_price, ean, quantity, brand, design, description, material, colour, length, width, height, volume, weight)" +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);" +
            "INSERT INTO product_classification (product_id, subcategory_id, category_id, section_id)" +
            "VALUES ((SELECT id FROM product WHERE ean=?), (SELECT id FROM subcategory WHERE name=?), (SELECT id FROM category WHERE name=?), (SELECT id FROM section WHERE name=?))";

      connection.query(sql, [product.name, product.price, product.new_price, product.ean, product.quantity, product.brand, product.design, product.description,
                             product.material, product.colour, product.length, product.width, product.height, product.volume, product.weight, product.ean,
                             product.subcategory, product.category, product.section], (err, rows, fields) => {
        if(!err) {
          //res.send("Insert into products query works!");
          console.log("Insert into products query works!");
        } else {
          console.log(err);
          console.log("Insert into products query doesnt work!");
        }
      });

      console.log(req.files);
      //res.send("images uploaded to the server!!")

      var first = "";
      var second = "";
      let imgarray = [];
      let imgproduct = [];
      let bigboss = []

      for (var i=0; i<req.files.length; i++) {

        imgarray.push([req.files[i].filename, req.files[i].destination]);
        imgproduct.push([product.ean, req.files[i].filename]);

        if(i !== req.files.length-1) {
          first = first + "(?, ?),";
          second = second + "((select id from product where ean=?), (select id from image where name=?)),"
        } else {
            first = first + "(?, ?);";
            second = second + "((select id from product where ean=?), (select id from image where name=?));"
          }

		  }

      var sql2 = "INSERT INTO image (name, path) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;


      for (var i = 0; i < imgarray.length; i++) {
        bigboss.push(imgarray[i]);
      }

      for (var i = 0; i < imgproduct.length; i++) {
        bigboss.push(imgproduct[i]);
      }


      const newboss = bigboss.flat(Infinity);

      connection.query(sql2, newboss, (err, rows, fields) => {
          if(!err) {
            //res.send("insert into image query works!");
            console.log("insert into image query success!");
          } else {
            //res.send(err);
            console.log(err);
            console.log("insert into image query fail!");
          }
        });

    }
  });
  
res.status(200).end();

});



module.exports = router;

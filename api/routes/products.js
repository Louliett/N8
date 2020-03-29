"use strict"

const express = require('express');
const connection = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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

// TODO: link this to the db delete
router.delete('/delete-images', (req, res, next) => {
  var path = req.body.path;
  var name = req.body.name;
  sql = "DELETE image, product_image " +
        "FROM image " +
        "INNER JOIN product_image ON image.id = product_image.image_id " +
        "WHERE image.name =?;";

  connection.query(sql, [name], (err, rows, fields) => {
    if(!err) {
      console.log(name + " deleted from sb");
      try {
        fs.unlinkSync("." + path);
        console.log(path + " deleted from server");
        res.send(path + " was deleted");
        //file removed
      } catch(err) {
        console.error(err);
        res.send(err);
      }
    } else {
      console.log(err);
    }
  });
});

// TODO: fix the sql into a single statement
router.delete('/delete-product', (req, res, next) => {

  var id = req.body.id;
  var path = req.body.path;
  sql = "DELETE image, product_image " +
        "FROM image " +
        "INNER JOIN product_image ON image.id = product_image.image_id " +
        "WHERE product_id = ?; " +
        "DELETE FROM product_classification " +
        "WHERE product_id = ?; " +
        "DELETE FROM product " +
        "WHERE product.id = ?; ";
  console.log(id);
  connection.query(sql, [id, id, id], (err, rows, fields) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      //res.send(rows);
      try {
        for (var i = 0; i < path.length; i++) {
          fs.unlinkSync("." + path[i])
        }
        console.log(path + " deleted from server");
      } catch(err) {
        console.error(err);
        res.send(err);
      }
    }
  });
});

// TODO: to be deleted
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


router.post('/upload-images-test', (req, res) => {
	upload(req, res, (err) => {
    let product = req.body;
    console.log(req.body);

    if(err) {
      res.send(err);
      console.log("Images were not uploaded to the server!!");
	} else {
      console.log(req.files);
      res.send("images uploaded to the server!!")
      var first = "";
      var second = "";
      let imgarray = [];
      let imgproduct = [];
      let bigboss = []

      for (var i=0; i < req.files.length; i++) {
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

      sql = "INSERT INTO image (name, path) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;

      for (var i = 0; i < imgarray.length; i++) {
        bigboss.push(imgarray[i]);
      }
      for (var i = 0; i < imgproduct.length; i++) {
        bigboss.push(imgproduct[i]);
      }

      const newboss = bigboss.flat(Infinity);

      connection.query(sql, newboss, (err, rows, fields) => {
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
});

//to be split into to methods
router.post('/create-product', (req, res) => {

	let product = req.body;
  sql = "INSERT INTO product (name, price, new_price, ean, quantity, brand, design, description, " +
        "material, colour, length, width, height, volume, weight, size) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); " +
        "INSERT INTO product_classification (product_id, subcategory_id, category_id, section_id) " +
        "VALUES ((SELECT id FROM product WHERE ean=?), (SELECT id FROM subcategory WHERE name=?), " +
        "(SELECT id FROM category WHERE name=?), (SELECT id FROM section WHERE name=?)); ";

  connection.query(sql, [product.name, product.price, product.new_price, product.ean,
                         product.quantity, product.brand, product.design, product.description,
                         product.material, product.colour, product.length, product.width,
                         product.height, product.volume, product.weight, product.size, product.ean,
                         product.subcategory, product.category, product.section], (err, rows, fields) => {
						if(!err) {
							res.send("Insert into products query works!");
							console.log("Insert into products query works!");
              console.log(req.body);
						} else {
							console.log(err);
							console.log("Insert into products query doesnt work!");
      }
    });
});

//select all products based on name's first letter
router.post('/name', (req, res, next) => {
  var letter = req.body.letter + "%";
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
        "FROM product_classification " +
        "JOIN product ON product_id=product.id " +
        "JOIN subcategory ON subcategory_id=subcategory.id " +
        "JOIN category ON category_id=category.id " +
        "JOIN section ON section_id=section.id " +
        "WHERE product.name LIKE ?";
  connection.query(sql, [letter], (err, rows, fields) => {
    if(!err) {
      console.log(sql);
      console.log(letter);
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select all products based on ean
router.post('/ean-text', (req, res, next) => {
  var ean = req.body.ean;
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
        "FROM product_classification " +
        "JOIN product ON product_id=product.id " +
        "JOIN subcategory ON subcategory_id=subcategory.id " +
        "JOIN category ON category_id=category.id " +
        "JOIN section ON section_id=section.id " +
        "WHERE product.ean =?";
  connection.query(sql, [ean], (err, rows, fields) => {
    if(!err) {
      console.log(sql);
      console.log(ean);
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

router.post('/ean-img', (req, res, next) => {
  var ean = req.body.ean;
  sql = "SELECT image.name " +
        "FROM product_image " +
        "JOIN product on product_id = product.id " +
        "JOIN image on image_id = image.id " +
        "WHERE product.id = (SELECT id FROM product WHERE ean=?);";
  connection.query(sql, [ean], (err, rows, fields) => {
    if(!err) {
      console.log(sql);
      console.log(ean);
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

router.put('/update-product', (req, res, next) => {
  let product = req.body;
  sql = "UPDATE product " +
        "SET name =?, price=?, new_price=?, ean=?, quantity=?, brand=?, design=?, description=?, material=?, colour=?, length=?, width=?, height=?, volume=?, weight=? " +
        "WHERE id=?; " +
        "UPDATE product_classification " +
        "SET subcategory_id=(select id from subcategory where name=?), " +
        "category_id=(select id from category where name=?), " +
        "section_id=(select id from section where name=?) " +
        "WHERE product_id = ?;"

  connection.query(sql, [product.name, product.price, product.new_price, product.ean, product.quantity, product.brand, product.design, product.description,
                         product.material, product.colour, product.length, product.width, product.height, product.volume, product.weight, product.id,
                         product.subcategory, product.category, product.section, product.id], (err, rows, fields) => {
      if(!err) {
          console.log("Product Updated!");
      } else {
          console.log(err);
          console.log("Product not updated!!");
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

      sql = "INSERT INTO image (name, path) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;


      for (var i = 0; i < imgarray.length; i++) {
        bigboss.push(imgarray[i]);
      }

      for (var i = 0; i < imgproduct.length; i++) {
        bigboss.push(imgproduct[i]);
      }


      const newboss = bigboss.flat(Infinity);

      connection.query(sql, newboss, (err, rows, fields) => {
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
});



module.exports = router;

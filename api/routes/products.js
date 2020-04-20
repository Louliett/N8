//"use strict"

const express = require('express');
const connection = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
//repeating variables
var sql;
var id;
var name;

var storage = multer.diskStorage({
  destination: './public/product_images/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage,
  limits: {fileSize: 1024 * 1024 * 10},
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);  }
});//.array('myImage', 5);

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


//create product [v]
router.post('/create-product', (req, res) => {
  let product = req.body;
  sql = "INSERT INTO product (name, price, new_price, ean, quantity, brand, design, " +
        "description, material, diameter, length, width, height, volume, weight, size) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); " +
        "SET @productID = LAST_INSERT_ID(); " +
        "INSERT INTO product_classification (product_id, subcategory_id, category_id, section_id) " +
        "VALUES (@productID, " +
        "(SELECT id FROM subcategory WHERE name = ?), " +
        "(SELECT id FROM category WHERE name = ?), " +
        "(SELECT id FROM section WHERE name = ?));";

  connection.query(sql, [product.name, product.price, product.new_price,
    product.ean, product.quantity, product.brand, product.design,
    product.description, product.material, product.diameter, product.length,
    product.width, product.height, product.volume, product.weight,
    product.size, product.subcategory, product.category, product.section],
    (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      var id = rows[0]["insertId"];
      id = id + "";
      console.log(id, typeof(id));
      res.send(id);
    }
  });
});



//upload images [v]
router.post('/upload-images', upload.array('myImage', 5), (req, res) => {
  let product = req.body;
  var colours = [];
  if(typeof(req.body.colour) === 'string') {
    colours.push(req.body.colour);
  } else {
    colours = req.body.colour;
  }

  console.log(req.files);
  console.log("Images uploaded to the server!!");
  var first = "";
  var second = "";
  var imgarray = [];
  var imgproduct = [];
  var bigboss = [];

  for (var i = 0; i < req.files.length; i++) {
    imgarray.push([req.files[i].filename, req.files[i].destination, colours[i]]);
    imgproduct.push([product.id, req.files[i].filename]);

    if(i !== req.files.length-1) {
      first = first + "(?, ?, ?),";
      second = second + "(?, (SELECT id FROM image WHERE name = ?)),";
    } else {
        first = first + "(?, ?, ?);";
        second = second + "(?, (SELECT id FROM image WHERE name = ?));";
    }
  }

  sql = "INSERT INTO image (name, path, colour) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;

  for (var j = 0; j < imgarray.length; j++) {
    bigboss.push(imgarray[j]);
  }
  for (var k = 0; k < imgproduct.length; k++) {
    bigboss.push(imgproduct[k]);
  }

  const newboss = bigboss.flat(Infinity);

  connection.query(sql, newboss, (err, rows, fields) => {
      if(err) {
        res.send(err);
        console.log(err);
        console.log("upload images to db failed!");
      } else {
        res.send({'status': 201});
        console.log("upload images to db success!");
      }
    });
});

router.put('/update-colour', (req, res) => {

  var fetched = req.body.colours;
  var train = [];
  var first = "";
  var second = "";
  var sqls = [];
  var final_sql = "";

  for (var i = 0; i < fetched.length; i++) {
    first = first + "UPDATE image SET colour = ? WHERE id IN";
    console.log(fetched[i]);
    train.push(fetched[i][0]);
    for (var j = 1; j < fetched[i].length; j++) {
      console.log(fetched[i][j]);
      console.log(fetched[i][j].length);
      if(fetched[i][j].length === 1) {
        second = "?";
        train.push(fetched[i][j][0]);
      } else {
        for (var k = 0; k < fetched[i][j].length; k++) {
          train.push(fetched[i][j][k]);
          if(k !== fetched[i][j].length - 1) {
            second = second + "?,";
          } else {
            second = second + "?";
          }
        }
      }
    }
    sqls.push(first + "(" + second + ");");
    first = "";
    second = "";
  }


  for (var l = 0; l < sqls.length; l++) {
    final_sql = final_sql + sqls[l];
  }

  console.log(final_sql);
  console.log(train);

  connection.query(final_sql, train, (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      console.log(sql);
      res.send("colours updated");
    }
  });
  console.log(connection.query);
});

//select products based on colour [v]
router.post('product-colour', (req, res) => {
  var colour = req.body.colour;
  sql = "SELECT pro.*, sub.name AS subcategory, cat.name AS category, " +
        "sec.name AS section, img.name AS image_name, img.path AS image_path, " +
        "img.colour AS image_colour " +
        "FROM product AS pro " +
        "LEFT JOIN product_classification AS pc " +
	      "ON pro.id = pc.product_id " +
        "LEFT JOIN subcategory AS sub " +
	      "ON pc.subcategory_id = sub.id " +
        "LEFT JOIN category AS cat " +
	      "ON pc.category_id = cat.id " +
        "LEFT JOIN section AS sec " +
	      "ON pc.section_id = sec.id " +
        "LEFT JOIN product_image AS pi " +
	      "ON pro.id = pi.product_id " +
        "LEFT JOIN image AS img " +
	      "ON pi.image_id = img.id " +
        "WHERE img.colour = ?;";

  connection.query(sql, [colour], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
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
        "WHERE product.name LIKE ?;";
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

//select all products
router.get('/', (req, res, next) => {
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
        "FROM product_classification " +
        "JOIN product ON product_id=product.id " +
        "JOIN subcategory ON subcategory_id=subcategory.id " +
        "JOIN category ON category_id=category.id " +
        "JOIN section ON section_id=section.id; ";
  connection.query(sql, (err, rows, fields) => {
    if(!err) {
      console.log(sql);
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select product and classifications based on product id
router.post('/id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
        "FROM product_classification " +
        "JOIN product ON product_id=product.id " +
        "JOIN subcategory ON subcategory_id=subcategory.id " +
        "JOIN category ON category_id=category.id " +
        "JOIN section ON section_id=section.id " +
        "WHERE product.id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if(!err) {
      console.log(sql);
      res.send(rows);
    } else {
      console.log(err);
    }
  });
});

//select from product table based on id
router.post('/product-id', (req, res) => {
  id = req.body.id;
  sql = "SELECT * FROM product WHERE id=?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});


//select product and classifications based on product id
router.post('/product-classifications-id', (req, res, next) => {
  var id = req.body.id;
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
        "FROM product_classification " +
        "JOIN product ON product_id=product.id " +
        "JOIN subcategory ON subcategory_id=subcategory.id " +
        "JOIN category ON category_id=category.id " +
        "JOIN section ON section_id=section.id " +
        "WHERE product.id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//select all images based on product ean
router.post('/product-images-id', (req, res, next) => {
  var id = req.body.id;
  sql = "SELECT image.* " +
        "FROM product_image " +
        "JOIN product on product_id = product.id " +
        "JOIN image on image_id = image.id " +
        "WHERE product.id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//updates a product and its classifications
router.put('/update-product', (req, res, next) => {
  var product = req.body;
  sql = "UPDATE product " +
        "SET name =?, price=?, new_price=?, ean=?, quantity=?, brand=?, design=?, description=?, material=?, diameter=?, length=?, width=?, height=?, volume=?, weight=? " +
        "WHERE id=?; " +
        "UPDATE product_classification " +
        "SET subcategory_id=(select id from subcategory where name=?), " +
        "category_id=(select id from category where name=?), " +
        "section_id=(select id from section where name=?) " +
        "WHERE product_id = ?;";

  connection.query(sql, [product.name, product.price, product.new_price, product.ean, product.quantity, product.brand, product.design, product.description,
                         product.material, product.diameter, product.length, product.width, product.height, product.volume, product.weight, product.id,
                         product.subcategory, product.category, product.section, product.id], (err, rows, fields) => {
      if(err) {
          res.send(err);
      } else {
          res.send("product updated!")
      }

  });
});

//get products for search bar
router.post('/search-product', (req, res) => {
  var criterias = "%" + req.body.criteria + "%";
  sql = "SELECT pro.*, sub.name AS subcategory, cat.name AS category, " +
        "sec.name AS section, img.name AS image_name, img.path AS image_path " +
        "FROM product AS pro " +
        "LEFT JOIN product_classification AS pc " +
        "ON pro.id = pc.product_id " +
        "LEFT JOIN subcategory AS sub " +
        "ON pc.subcategory_id = sub.id " +
        "LEFT JOIN category AS cat " +
        "ON pc.category_id = cat.id " +
        "LEFT JOIN section AS sec " +
        "ON pc.section_id = sec.id " +
        "LEFT JOIN product_image AS pi " +
        "ON pro.id = pi.product_id " +
        "LEFT JOIN image AS img " +
        "ON pi.image_id = img.id " +
        "WHERE pro.name LIKE ? " +
        "OR pro.brand LIKE ? " +
        "OR pro.design LIKE ? " +
        "OR pro.description LIKE ? " +
        "OR pro.material LIKE ? " +
        "OR img.colour LIKE ? " +
        "OR sub.name LIKE ? " +
        "OR cat.name LIKE ? " +
        "OR sec.name LIKE ?; "

  connection.query(sql, [criterias, criterias, criterias, criterias, criterias,
    criterias, criterias, criterias, criterias], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//get product based on subcategory
router.post('/subcategory', (req, res) => {
  name = req.body.name;
  sql = "SELECT product.* " +
        "FROM product_classification " +
        "JOIN product ON product_classification.product_id = product.id " +
        "JOIN subcategory ON product_classification.subcategory_id = subcategory.id " +
        "WHERE subcategory.name = ?;";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//get product based on category
router.post('/category', (req, res) => {
  name = req.body.name;
  sql = "SELECT product.* " +
        "FROM product_classification " +
        "JOIN product ON product_classification.product_id = product.id " +
        "JOIN category ON product_classification.category_id = category.id " +
        "WHERE category.name = ?;";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//get product based on section
router.post('/section', (req, res) => {
  name = req.body.name;
  sql = "SELECT product.* " +
        "FROM product_classification " +
        "JOIN product ON product_classification.product_id = product.id " +
        "JOIN section ON product_classification.section_id = section.id " +
        "WHERE section.name = ?;";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});


//method for card !!!! to be reviewved it complains
router.post("/products-images", (req, res) => {
  var ids = req.body.ids;
  var first = "WHERE pro.id = ? ";
  var default_query = "WHERE pro.id = ?; ";
  var end = ";";
  var first_arr = [];
  var default_arr = [];
  var final_arr = [];

  console.log(ids);
  console.log(ids.length);
  for (var i = 0; i < ids.length-1; i++) {

    if(i !== ids.length-2) {
      first = first + "OR pro.id =? ";

    } else {
        first = first + "OR pro.id =?; ";
    }
  }

  if(ids.length > 1) {
    end = first
  } else {
    end = default_query;
  }
  sql = "SELECT pro.*, sub.name AS subcategory, cat.name AS category, " +
        "sec.name AS section, img.name AS image_name, img.path AS image_path " +
        "FROM product AS pro " +
        "LEFT JOIN product_classification AS pc " +
        "ON pro.id = pc.product_id " +
        "LEFT JOIN subcategory AS sub " +
        "ON pc.subcategory_id = sub.id " +
        "LEFT JOIN category AS cat " +
        "ON pc.category_id = cat.id " +
        "LEFT JOIN section AS sec " +
        "ON pc.section_id = sec.id " +
        "LEFT JOIN product_image AS pi " +
        "ON pro.id = pi.product_id " +
        "LEFT JOIN image AS img " +
        "ON pi.image_id = img.id " +
        end;
  console.log(sql);
  connection.query(sql, ids, (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});


// delete everything related to a product based on product id
router.delete('/delete-product', (req, res, next) => {
  var id = req.body.id;
  var path = req.body.path;
  sql = "DELETE image, product_image, product_classification, product " +
        "FROM product " +
        "LEFT JOIN product_image ON product.id = product_image.product_id " +
        "LEFT JOIN image ON product_image.image_id = image.id " +
        "LEFT JOIN product_classification ON product.id = product_classification.product_id " +
        "WHERE product.id = ?";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send("product deleted!");
      try {
        for (var i = 0; i < path.length; i++) {
          fs.unlinkSync(path[i]);
        }
        console.log(path + " deleted from server");
      } catch(err) {
        console.error(err);
      }
    }
  });
});

//deletes an image based on id
router.delete('/delete-images', (req, res, next) => {
  var path = req.body.path;
  var id = req.body.id;
  sql = "DELETE image, product_image " +
        "FROM image " +
        "INNER JOIN product_image ON image.id = product_image.image_id " +
        "WHERE image.id = ?;";

  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      try {
        fs.unlinkSync("." + path);
        console.log(path + " deleted from server");
        res.send(path + " was deleted");
        //file removed
      } catch(err) {
        res.send(err);
      }
    }
  });
});

module.exports = router;

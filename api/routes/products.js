"use strict";

const express = require('express');
const connection = require('../../db');
const multer = require('multer');
const default_stripe_image = "http://192.168.0.107:3000/public/product_images/default.png";
const default_n8_image = "/public/product_images/default.png";
const path = require('path');
const fs = require('fs');
const {
  log,
  error
} = require('console');
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
//repeating variables
var sql;
var id;
var name;
var values;
var colour;


var storage = multer.diskStorage({
  destination: './public/product_images/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}); //.array('myImage', 5);

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb('Invalid file type');
  }
}


router.post('/create-product', upload.array('myImage', 5), (req, res) => {
  var sql2;
  var finalquery;
  var newboss = [];
  var finalboss = [];
  var first = "";
  var second = "";
  var imgarray = [];
  var imgproduct = [];
  var bigboss = [];
  let product = req.body;
  var colours = [];
  var stripeImage = "";
  var stripePrice;

  //for uploading an image on stripe
  if (req.files.length > 0) {
    stripeImage = "http://192.168.0.107:3000" + (req.files[0].destination + req.files[0].filename).substr(1);
  } else {
    stripeImage = default_stripe_image;
  }

  //we get the stripe object, then we can use stripe price id to save it in n8 db
  createStripeProduct(product.name, product.price, product.brand, product.description, stripeImage)
    .then((result) => {

      var values = [product.name, product.price, result.id, product.new_price,
        product.ean, product.availability, product.quantity, product.brand,
        product.design, product.description, product.material, product.diameter,
        product.length, product.width, product.height, product.volume, product.weight,
        product.size, product.subcategory, product.category, product.section,
        "default", default_n8_image
      ];

      sql = "INSERT INTO product (name, price, stripe_price, new_price, ean, availability, quantity, brand, design, " +
        "description, material, diameter, length, width, height, volume, weight, size) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); " +
        "SET @productID = LAST_INSERT_ID(); " +
        "INSERT INTO product_classification (product_id, subcategory_id, category_id, section_id) " +
        "VALUES (@productID, " +
        "(SELECT id FROM subcategory WHERE name = ?), " +
        "(SELECT id FROM category WHERE name = ?), " +
        "(SELECT id FROM section WHERE name = ?)); " +
        "INSERT INTO image (colour, url) VALUES (?, ?); " +
        "SET @imageID = LAST_INSERT_ID(); " +
        "INSERT INTO product_image (product_id, image_id) " +
        "VALUES (@productID, @imageID); ";

      //let's check if there are any files attached to the formdata
      if (req.files.length > 0) {

        stripeImage = "http://192.168.0.107:3000" + (req.files[0].destination + req.files[0].filename).substr(1);

        if (typeof (req.body.colour) === 'string') {
          colours.push(req.body.colour);
        } else {
          colours = req.body.colour;
        }

        for (var i = 0; i < req.files.length; i++) {

          if (colours[i] === "") {
            imgarray.push(["default", (req.files[i].destination + req.files[i].filename).substr(1)]);
          } else {
            imgarray.push([colours[i], (req.files[i].destination + req.files[i].filename).substr(1)]);
          }

          imgproduct.push([(req.files[i].destination + req.files[i].filename).substr(1)]);

          if (i !== req.files.length - 1) {
            first = first + "(?, ?),";
            second = second + "(@productID, (SELECT id FROM image WHERE url = ?)),";
          } else {
            first = first + "(?, ?);";
            second = second + "(@productID, (SELECT id FROM image WHERE url = ?));";
          }
        }

        sql2 = "INSERT INTO image (colour, url) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;

        for (var j = 0; j < imgarray.length; j++) {
          bigboss.push(imgarray[j]);
        }

        for (var k = 0; k < imgproduct.length; k++) {
          bigboss.push(imgproduct[k]);
        }

        //flatten all the image values into a 1D array
        newboss = bigboss.flat(Infinity);
        //concatinate the queries so that they contain txt + image
        finalquery = sql + sql2;
        //concatinate the text values and image values
        finalboss = values.concat(newboss);

      } else {
        finalquery = sql;
        finalboss = values;
        stripeImage = default_stripe_image;
      }

      connection.query(finalquery, finalboss, (err, rows, fields) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.send("Product Created!");
        }
      });

    }).catch(error => console.error(error));

});



//creates a stripe product and a price for that product
//returns the stripe price object
async function createStripeProduct(prod_name, prod_price, prod_brand, prod_descript, prod_image) {

  let stripeProduct = await stripe.products.create({
    name: prod_name,
    attributes: [prod_brand],
    description: prod_descript,
    images: [prod_image],
    type: "good"
  });

  let stripePrice = await stripe.prices.create({
    unit_amount: prod_price * 100,
    currency: 'bgn',
    product: stripeProduct.id
  });

  return stripePrice;
}


router.post('/get-stripe-product', (req, res) => {
  var product_id = req.body.productid;
  getStripeProduct(product_id).then((stripeProduct) => {
    res.send(stripeProduct);
  }).catch(error => console.error(error));
});

router.put('/update-stripe-product', (req, res) => {
  var product_id = req.body.productid;
  updateStripeProduct(product_id)
    .then((result) => {
      res.send(result);
    }).catch(error => console.error(error));
});


async function updateStripeProduct(prod_id) {
  let updatedStripeProduct = await stripe.products.update(
    prod_id, {
      active: false
    });
  return updatedStripeProduct;
}

async function getStripeProduct(prod_id) {
  let stripeProduct = await stripe.products.retrieve(prod_id);
  return stripeProduct;
}





router.post('/upload-images', upload.array('myImage', 5), (req, res) => {
  let product = req.body;
  var colours = [];

  if (typeof (req.body.colour) === 'string') {
    colours.push(req.body.colour);
  } else {
    colours = req.body.colour;
  }

  console.log(product, "received");


  if (colours[0] === "") {
    res.send("Please provide a colour!");
    //we delete all the images uploaded to the server because they don't have colours
    for (var i = 0; i < req.files.length; i++) {
      fs.unlinkSync(req.files[i].destination + req.files[i].filename);
    }
  } else {
    //console.log(req.files);
    //console.log("Images uploaded to the server!!");

    var first = "";
    var second = "";
    var imgarray = [];
    var imgproduct = [];
    var bigboss = [];

    for (var i = 0; i < req.files.length; i++) {
      imgarray.push([colours[i], (req.files[i].destination + req.files[i].filename).substr(1)]);
      imgproduct.push([product.id, (req.files[i].destination + req.files[i].filename).substr(1)]);

      if (i !== req.files.length - 1) {
        first = first + "(?, ?),";
        second = second + "(?, (SELECT id FROM image WHERE url = ?)),";
      } else {
        first = first + "(?, ?);";
        second = second + "(?, (SELECT id FROM image WHERE url = ?));";
      }
    }

    sql = "INSERT INTO image (colour, url) VALUES " + first + "INSERT INTO product_image (product_id, image_id) VALUES " + second;

    for (var j = 0; j < imgarray.length; j++) {
      bigboss.push(imgarray[j]);
    }
    for (var k = 0; k < imgproduct.length; k++) {
      bigboss.push(imgproduct[k]);
    }

    const newboss = bigboss.flat(Infinity);

    connection.query(sql, newboss, (err, rows, fields) => {
      if (err) {
        res.send(err);
        console.log(err);
        console.log("upload images to db failed!");
      } else {
        res.send({
          'status': 201
        });
        console.log("upload images to db success!");
      }
    });





  }

});


//update the colour string [v]
router.put('/update-colour', (req, res) => {

  var fetched = req.body.colours;
  var train = [];
  var first = "";
  var second = "";
  var sqls = [];
  var final_sql = "";

  //lets iterate through the array and find empty strings
  //we remove the empty strings because a colour cannot be empty
  for (let h = 0; h < fetched.length; h++) {
    if (fetched[h][0] === "") {
      fetched.splice(h, 1);
    }
  }

  for (var i = 0; i < fetched.length; i++) {
    first = first + "UPDATE image SET colour = ? WHERE id IN";

    train.push(fetched[i][0]);
    for (var j = 1; j < fetched[i].length; j++) {

      if (fetched[i][j].length === 1) {
        second = "?";
        train.push(fetched[i][j][0]);
      } else {
        for (var k = 0; k < fetched[i][j].length; k++) {
          train.push(fetched[i][j][k]);
          if (k !== fetched[i][j].length - 1) {
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

  connection.query(final_sql, train, (err, rows, fields) => {
    if (err) {
      //console.log(sql);
      res.send(err);
    } else {
      res.send("colours updated");
    }
  });
});

//select products based on colour [v]
// router.post('/product-colour', (req, res) => {
//   var colour = req.body.colour;
//   sql = "SELECT pro.*, sub.name AS subcategory, cat.name AS category, " +
//         "sec.name AS section, img.name AS image_name, img.path AS image_path, " +
//         "img.colour AS image_colour " +
//         "FROM product AS pro " +
//         "LEFT JOIN product_classification AS pc " +
// 	      "ON pro.id = pc.product_id " +
//         "LEFT JOIN subcategory AS sub " +
// 	      "ON pc.subcategory_id = sub.id " +
//         "LEFT JOIN category AS cat " +
// 	      "ON pc.category_id = cat.id " +
//         "LEFT JOIN section AS sec " +
// 	      "ON pc.section_id = sec.id " +
//         "LEFT JOIN product_image AS pi " +
// 	      "ON pro.id = pi.product_id " +
//         "LEFT JOIN image AS img " +
// 	      "ON pi.image_id = img.id " +
//         "WHERE img.colour = ?;";
//
//   connection.query(sql, [colour], (err, rows, fields) => {
//     if(err) {
//       res.send(err);
//     } else {
//       res.send(rows);
//     }
//   });
// });

//select all products based on name's first letter
router.post('/name', (req, res) => {
  var letter = req.body.letter + "%";
  var all;

  //default query for dealing with product's first letter
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
    "FROM product " +
    "LEFT JOIN product_classification ON product.id=product_classification.product_id " +
    "LEFT JOIN subcategory ON subcategory_id=subcategory.id " +
    "LEFT JOIN category ON category_id=category.id " +
    "LEFT JOIN section ON section_id=section.id " +
    "WHERE product.name LIKE ?;";

  //query for selecting all the products
  if (req.body.letter === "*") {
    sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
      "FROM product " +
      "LEFT JOIN product_classification ON product.id=product_classification.product_id " +
      "LEFT JOIN subcategory ON subcategory_id=subcategory.id " +
      "LEFT JOIN category ON category_id=category.id " +
      "LEFT JOIN section ON section_id=section.id; ";
  }


  connection.query(sql, [letter], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//select all products and their classifications
router.get('/', (req, res, next) => {
  sql = "SELECT product.*, subcategory.name as subcategory, category.name as category, section.name as section " +
    "FROM product " +
    "LEFT JOIN product_classification ON product.id=product_classification.product_id " +
    "LEFT JOIN subcategory ON subcategory_id=subcategory.id " +
    "LEFT JOIN category ON category_id=category.id " +
    "LEFT JOIN section ON section_id=section.id; ";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
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
    if (!err) {
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
    if (err) {
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
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//select all images based on product id
router.post('/product-images-id', (req, res, next) => {
  var id = req.body.id;
  sql = "SELECT image.* " +
    "FROM product_image " +
    "JOIN product on product_id = product.id " +
    "JOIN image on image_id = image.id " +
    "WHERE product.id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

router.post('/update-default-image', (req, res) => {

});

//updates a product and its classifications
router.put('/update-product', (req, res, next) => {
  var product = req.body;
  var values = [product.name, product.price, product.new_price, product.ean,
    product.availability, product.quantity, product.brand, product.design,
    product.description, product.material, product.diameter, product.length,
    product.width, product.height, product.volume, product.weight, product.size, product.id,
    product.subcategory, product.category, product.section, product.id
  ];

  sql = "UPDATE product " +
    "SET name =?, price=?, new_price=?, ean=?, availability=?, quantity=?, " +
    "brand=?, design=?, description=?, material=?, diameter=?, length=?, " +
    "width=?, height=?, volume=?, weight=?, size=? " +
    "WHERE id=?; " +
    "UPDATE product_classification " +
    "SET subcategory_id=(select id from subcategory where name=?), " +
    "category_id=(select id from category where name=?), " +
    "section_id=(select id from section where name=?) " +
    "WHERE product_id = ?;";

  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send("product updated!");
    }

  });
});

//get products for search bar
router.post('/search-product', (req, res) => {
  var criterias = "%" + req.body.criteria + "%";
  sql = "SELECT pro.*, sub.name AS subcategory, cat.name AS category, " +
    "sec.name AS section, img.url AS image_url " +
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
    "OR sec.name LIKE ?; ";

  connection.query(sql, [criterias, criterias, criterias, criterias, criterias,
    criterias, criterias, criterias, criterias
  ], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//returns products in subcategory in category in section
router.post('/pro-sub-cat-sec', (req, res) => {
  var obj = req.body;
  var values = [obj.subcategory, obj.category, obj.section];

  sql = "SELECT product.* " +
    "FROM product " +
    "LEFT JOIN product_classification ON product_classification.product_id = product.id " +
    "LEFT JOIN subcategory ON product_classification.subcategory_id = subcategory.id " +
    "LEFT JOIN category ON product_classification.category_id = category.id " +
    "LEFT JOIN section ON product_classification.section_id = section.id " +
    "WHERE subcategory.name = ? AND category.name = ? AND section.name = ?; ";

  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//get product based on subcategory
// router.post('/subcategory', (req, res) => {
//   name = req.body.name;
//   sql = "SELECT product.* " +
//         "FROM product_classification " +
//         "JOIN product ON product_classification.product_id = product.id " +
//         "JOIN subcategory ON product_classification.subcategory_id = subcategory.id " +
//         "WHERE subcategory.name = ?;";
//   connection.query(sql, [name], (err, rows, fields) => {
//     if(err) {
//       console.log(err);
//     } else {
//       res.send(rows);
//     }
//   });
// });
//
// //get product based on category
// router.post('/category', (req, res) => {
//   name = req.body.name;
//   sql = "SELECT product.* " +
//         "FROM product_classification " +
//         "JOIN product ON product_classification.product_id = product.id " +
//         "JOIN category ON product_classification.category_id = category.id " +
//         "WHERE category.name = ?;";
//   connection.query(sql, [name], (err, rows, fields) => {
//     if(err) {
//       console.log(err);
//     } else {
//       res.send(rows);
//     }
//   });
// });
//
// //get product based on section
// router.post('/section', (req, res) => {
//   name = req.body.name;
//   sql = "SELECT product.* " +
//         "FROM product_classification " +
//         "JOIN product ON product_classification.product_id = product.id " +
//         "JOIN section ON product_classification.section_id = section.id " +
//         "WHERE section.name = ?;";
//   connection.query(sql, [name], (err, rows, fields) => {
//     if(err) {
//       console.log(err);
//     } else {
//       res.send(rows);
//     }
//   });
// });


//method for cart!!!! to be reviewved it complains
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
  for (var i = 0; i < ids.length - 1; i++) {

    if (i !== ids.length - 2) {
      first = first + "OR pro.id =? ";

    } else {
      first = first + "OR pro.id =?; ";
    }
  }

  if (ids.length > 1) {
    end = first;
  } else {
    end = default_query;
  }
  sql = "SELECT pro.*, sub.name AS subcategory, cat.name AS category, " +
    "sec.name AS section, img.url AS image_url, img.colour AS image_colour " +
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
    "ON pi.image_id = img.id ";

  connection.query(sql, ids, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//select one picture per colour for a product in the basket
router.post('/single-images-basket', (req, res) => {
  id = req.body.id;
  colour = req.body.colour;
  values = [id, colour];

  sql = "SELECT product.name, product.price, image.url " +
    "FROM product " +
    "LEFT JOIN product_image ON product.id = product_image.product_id " +
    "LEFT JOIN image ON product_image.image_id = image.id " +
    "WHERE product.id = ? AND image.colour = ? " +
    "LIMIT 1; ";

  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
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
  sql = "DELETE product_image, image, product_classification " +
    "FROM product " +
    "LEFT JOIN product_image ON product.id = product_image.product_id " +
    "LEFT JOIN image ON product_image.image_id = image.id " +
    "LEFT JOIN product_classification ON product.id = product_classification.product_id " +
    "WHERE product.id = ?; " +
    "DELETE FROM product WHERE id = ?;";
  connection.query(sql, [id, id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      //res.send("product deleted!");
      try {
        for (var i = 0; i < path.length; i++) {
          if (path[i] !== default_n8_image) {
            fs.unlinkSync("." + path[i]);
          }
        }
        //console.log(path + " deleted from server");
      } catch (err) {
        console.error(err);
      }
      res.send("hej");
    }
  });
});

//deletes an image based on id
router.delete('/delete-images', (req, res, next) => {
  var url = "." + req.body.url;
  var id = req.body.id;
  sql = "DELETE image, product_image " +
    "FROM image " +
    "LEFT JOIN product_image ON image.id = product_image.image_id " +
    "WHERE image.id = ?;";

  connection.query(sql, [id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      try {
        res.send("deleted");
        if (url !== "." + default_n8_image) {
          fs.unlinkSync(url);
        }
      } catch (err) {
        res.send(err);
      }
    }
  });
});

module.exports = router;
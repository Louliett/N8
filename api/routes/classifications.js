"use strict";

const express = require('express');
const connection = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const default_image = "/public/class_images/default.png";
const router = express.Router();

var storage = multer.diskStorage({
  destination: './public/class_images/',
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

var sql;
var name;
var image;
var id;


//select all existing classifications
router.get('/', (req, res) => {
  sql = "SELECT name AS subcategory FROM subcategory; " +
        "SELECT name AS category FROM category; " +
        "SELECT name AS section FROM section;";

  connection.query(sql, (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//select subcategory based on id
router.post('/subcategory-id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT name FROM subcategory WHERE id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//select category based on id
router.post('/category-id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT name FROM category WHERE id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//select category based on id
router.post('/section-id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT name FROM section WHERE id = ?;";
  connection.query(sql, [id], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

///
router.post('/category-section', (req, res) => {
  name = req.body.name;
  sql = "SELECT DISTINCT category.name, category.image " +
        "FROM product_classification " +
        "JOIN category ON product_classification.category_id = category.id " +
        "JOIN section ON product_classification.section_id = section.id " +
        "WHERE section.name = ?; ";
  connection.query(sql, [name], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//
router.post('/subcategory-category', (req, res) => {
  var cat = req.body.category;
  var sec = req.body.section;
  sql = "SELECT DISTINCT subcategory.name, subcategory.image " +
        "FROM product_classification " +
        "JOIN subcategory ON product_classification.subcategory_id = subcategory.id " +
        "JOIN category ON product_classification.category_id = category.id " +
        "JOIN section ON product_classification.section_id = section.id " +
        "WHERE category.name = ? AND section.name = ?; ";
  connection.query(sql, [cat, sec], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});




//select all subcategories
router.get('/subcategory', (req, res, next) => {
  sql = "SELECT * FROM subcategory;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select all categories
router.get('/category', (req, res, next) => {
  sql = "SELECT * FROM category;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select all sections
router.get('/section', (req, res, next) => {
  sql = "SELECT * FROM section;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select groups of subs, cats and sects
router.get('/class-groups', (req, res) => {
  sql = "SELECT subcategory.name AS subcategory, subcategory.image AS sub_img, category.name AS category, category.image AS cat_img, section.name AS section, section.image AS sec_img " +
    "FROM product_classification " +
    "JOIN subcategory ON product_classification.subcategory_id = subcategory.id " +
    "JOIN category ON product_classification.category_id = category.id " +
    "JOIN section ON product_classification.section_id = section.id;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});


//select all existing subcateogries
router.get('/present-subcategory', (req, res, next) => {
  sql = "SELECT DISTINCT subcategory.name " +
    "FROM product_classification " +
    "JOIN subcategory ON product_classification.subcategory_id = subcategory.id;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select all existing categories
router.get('/present-category', (req, res, next) => {
  sql = "SELECT DISTINCT category.name " +
    "FROM product_classification " +
    "JOIN category ON product_classification.category_id = category.id;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select all existing sections
router.get('/present-section', (req, res, next) => {
  sql = "SELECT DISTINCT section.name " +
    "FROM product_classification " +
    "JOIN section ON product_classification.section_id = section.id;";
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//creates only subcategory name
router.post('/create-subcategory', (req, res) => {
  name = req.body.name;
  image = req.body.image;
  sql = "INSERT INTO subcategory (name, image) VALUES (?, ?);";
  connection.query(sql, [name, image], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//creates only category name
router.post('/create-category', (req, res) => {
  name = req.body.name;
  image = req.body.image;
  sql = "INSERT INTO category (name, image) VALUES (?, ?);";
  connection.query(sql, [name, image], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});

//creates only section name
router.post('/create-section', (req, res) => {
  name = req.body.name;
  image = req.body.image;
  sql = "INSERT INTO section (name, image) VALUES (?, ?);";
  connection.query(sql, [name, image], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(rows);
    }
  });
});



//create subcategory name + image
router.post('/create-subcategory-image', upload.single("subImage"), (req, res, next) => {
  name = req.body.name;
  var img = req.file;
  var url = img.destination + img.filename;
  url = url.substr(1);
  var values = [name, url];
  sql = "INSERT INTO subcategory (name, image) VALUES (?, ?);";
  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      console.log(name);
      res.send(err);
    } else {
      res.send(name + " was created!")
    }
  });
});

//create category name + image
router.post('/create-category-image', upload.single("catImage"), (req, res, next) => {
  name = req.body.name;
  var img = req.file;
  var url = img.destination + img.filename;
  url = url.substr(1);
  var values = [name, url];
  sql = "INSERT INTO category (name, image) VALUES (?, ?);";
  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(name + " was created!");
    }
  });
});

//create section name + image
router.post('/create-section-image', upload.single("secImage"), (req, res, next) => {
  name = req.body.name;
  var img = req.file;
  var url = img.destination + img.filename;
  url = url.substr(1);
  var values = [name, url];
  sql = "INSERT INTO section (name, image) VALUES (?, ?);";
  connection.query(sql, values, (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(name + " was created!");
    }
  });
});

//update subcategory
router.put('/update-subcategory', (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  sql = "UPDATE subcategory SET name = ? WHERE id = ?;";
  connection.query(sql, [name, id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(name);
      //res.send(rows);
    }
  });
});

//update category
router.put('/update-category', (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  sql = "UPDATE category SET name = ? WHERE id = ?;";
  connection.query(sql, [name, id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(name);
    }
  });
});

//update section
router.put('/update-section', (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  sql = "UPDATE section SET name = ? WHERE id = ?;";
  connection.query(sql, [name, id], (err, rows, fields) => {
    if (err) {
      res.send(err);
    } else {
      res.send(name);
    }
  });
});


//update subcategory name + image
router.put('/update-subcategory-image', upload.single("subImage"), (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  image = req.body.image;
  sql = "UPDATE subcategory SET name = ?, image = ? WHERE id = ?;";

  if (image === default_image) {
    var values = [name, image, id];
    connection.query(sql, values, (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  } else {
    var img = req.file;
    var url = img.destination + img.filename;
    url = url.substr(1);
    var values = [name, url, id];
    connection.query(sql, values, (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  }

});

//update category name + image
router.put('/update-category-image', upload.single("catImage"), (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  image = req.body.image;
  sql = "UPDATE category SET name = ?, image = ? WHERE id = ?;";

  if (image === default_image) {
    var values = [name, image, id];
    connection.query(sql, values, (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  } else {
    var img = req.file;
    var url = img.destination + img.filename;
    url = url.substr(1);
    var values = [name, url, id];
    connection.query(sql, values, (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  }

});

//update section name + image
router.put('/update-section-image', upload.single("secImage"), (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  image = req.body.image;
  sql = "UPDATE section SET name = ?, image = ? WHERE id = ?;";

  if (image === default_image) {
    var values = [name, image, id];
    connection.query(sql, values, (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  } else {
    var img = req.file;
    var url = img.destination + img.filename;
    url = url.substr(1);
    var values = [name, url, id];
    connection.query(sql, values, (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("updated");
      }
    });
  }

});


//check for name in subcategory
router.post('/subcategory-name', (req, res, next) => {
  name = req.body.name;
  sql = "SELECT * FROM subcategory WHERE name = ?;";
  connection.query(sql, [name], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//check for name in category
router.post('/category-name', (req, res, next) => {
  name = req.body.name;
  sql = "SELECT * FROM category WHERE name = ?;";
  connection.query(sql, [name], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//check for name in section
router.post('/section-name', (req, res, next) => {
  name = req.body.name;
  sql = "SELECT * FROM section WHERE name = ?;";
  connection.query(sql, [name], (err, rows, fields) => {
    if (err) {
      res.send(err);
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//delete subcategory image
router.put('/delete-subcategory-image', (req, res, next) => {
  id = req.body.id;
  var image = req.body.image;
  sql = "UPDATE subcategory SET image = '' WHERE id = ?";
  console.log(image);

  if (image === default_image) {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("done!");
      }
    });
  } else {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        image = "." + image;
        try {
          fs.unlinkSync(image);
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
});

//delete category image
router.put('/delete-category-image', (req, res, next) => {
  id = req.body.id;
  var image = req.body.image;
  sql = "UPDATE category SET image = '' WHERE id = ?";
  console.log(image);

  if (image === default_image) {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("done!");
      }
    });
  } else {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        image = "." + image;
        try {
          fs.unlinkSync(image);
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
});

//delete section name
router.put('/delete-section-image', (req, res, next) => {
  id = req.body.id;
  var image = req.body.image;
  sql = "UPDATE section SET image = '' WHERE id = ?";
  console.log(image);

  if (image === default_image) {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send("done!");
      }
    });
  } else {
    image = "." + image;
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        try {
          fs.unlinkSync(image);
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
});

//delete subcategory based on id
router.delete('/delete-subcategory', (req, res, next) => {
  id = req.body.id;
  image = req.body.image;
  sql = "DELETE FROM subcategory WHERE id = ?;";

  if (image === default_image) {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send({'status': 200});
      }
    });
  } else {
    image = "." + image;
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        try {
          fs.unlinkSync(image);
          res.send({'status': 200});
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
});

//delete category based on id
router.delete('/delete-category', (req, res, next) => {
  id = req.body.id;
  var image = "." + req.body.image;
  sql = "DELETE FROM category WHERE id = ?;";

  if (image === default_image) {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send({'status': 200});
      }
    });
  } else {
    image = "." + image;
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        try {
          fs.unlinkSync(image);
          res.send({'status': 200});
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
});

//delete section based on id
router.delete('/delete-section', (req, res, next) => {
  id = req.body.id;
  var image = "." + req.body.image;
  sql = "DELETE FROM section WHERE id = ?;";

  if (image === default_image) {
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        res.send({'status': 200});
      }
    });
  } else {
    image = "." + image;
    connection.query(sql, [id], (err, rows, fields) => {
      if (err) {
        res.send(err);
      } else {
        try {
          fs.unlinkSync(image);
          res.send({'status': 200});
        } catch (e) {
          res.send(e);
        }
      }
    });
  }
});


module.exports = router;

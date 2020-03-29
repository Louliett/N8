"use strict"

const express = require('express');
const connection = require('../../db');
const router = express.Router();
var sql;
var name;
var id;


//select subcategory based on id
router.post('/subcategory-id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT name FROM subcategory WHERE id = ?";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//select category based on id
router.post('/category-id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT name FROM category WHERE id = ?"
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//select category based on id
router.post('/section-id', (req, res, next) => {
  id = req.body.id;
  sql = "SELECT name FROM section WHERE id = ?"
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});


//select all subcategories
router.get('/subcategory', (req, res, next) => {
  sql = "SELECT * FROM subcategory";
  connection.query(sql, (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select all categories
router.get('/category', (req, res, next) => {
  sql = "SELECT * FROM category";
  connection.query(sql, (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//select all sections
router.get('/section', (req, res, next) => {
  sql = "SELECT * FROM section";
  connection.query(sql, (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });

});

//create subcategory
router.post('/create-subcategory', (req, res, next) => {
  name = req.body.name;
  sql = "INSERT INTO subcategory (name) VALUES (?)";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(name);
      res.send(err);
    } else {
      res.send(name + " was created!")
    }
  });
});

//create category
router.post('/create-category', (req, res, next) => {
  name = req.body.name;
  sql = "INSERT INTO category (name) VALUES (?)";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(name + " was created!")
    }
  });
});

//create section
router.post('/create-section', (req, res, next) => {
  name = req.body.name;
  sql = "INSERT INTO section (name) VALUES (?)";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(name + " was created!")
    }
  });
});

//update subcategory
router.put('/update-subcategory', (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  console.log(id);
  console.log(name);
  console.log(req.body);
  sql = "UPDATE subcategory SET name = ? WHERE id = ?";
  connection.query(sql, [name, id], (err, rows, fields) => {
    if(err) {
      console.log(err);
      res.send(err);
    } else {
      res.send("yellow");
      //res.send(rows);
    }
  });
});

//update category
router.put('/update-category', (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  sql = "UPDATE category SET name = ? WHERE id = ?";
  connection.query(sql, [name, id], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(id);
    }
  });
});

//update section
router.put('/update-section', (req, res, next) => {
  id = req.body.id;
  name = req.body.name;
  sql = "UPDATE section SET name = ? WHERE id = ?";
  connection.query(sql, [id, name], (err, rows, fields) => {
    if(err) {
      res.send(err);
    } else {
      res.send(name + " was updated!");
    }
  });
});

//check for name in subcategory
router.post('/subcategory-name', (req, res, next) => {
  name = req.body.name;
  sql = "SELECT * FROM subcategory WHERE name = ?";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//check for name in category
router.post('/category-name', (req, res, next) => {
  name = req.body.name;
  sql = "SELECT * FROM category WHERE name = ?";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//check for name in section
router.post('/section-name', (req, res, next) => {
  name = req.body.name;
  sql = "SELECT * FROM section WHERE name = ?";
  connection.query(sql, [name], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//delete subcategory based on id
router.delete('/delete-subcategory', (req, res, next) => {
  id = req.body.id;
  sql = "DELETE FROM subcategory WHERE id = ?";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//delete category based on id
router.delete('/delete-category', (req, res, next) => {
  id = req.body.id;
  sql = "DELETE FROM category WHERE id = ?";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

//delete section based on id
router.delete('/section-name', (req, res, next) => {
  id = req.body.id;
  sql = "DELETE FROM section WHERE id = ?";
  connection.query(sql, [id], (err, rows, fields) => {
    if(err) {
      console.log(err);
    } else {
      res.send(rows);
    }
  });
});

module.exports = router;

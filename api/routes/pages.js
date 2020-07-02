"use strict";

const express = require('express');
const connection = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    get
} = require('http');

const router = express.Router();

var storage = multer.diskStorage({
    destination: './public/page_images/',
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
});

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


router.get('/', (req, res) => {
    var sql = "SELECT * FROM page;";

    connection.query(sql, (err, rows, fields) => {
        if (err) {
            res.sendStatus(400);
            console.log(err);
        } else {
            res.send(rows);
        }
    });
});


router.delete('/delete-image', (req, res) => {
    var page_id = req.body.id;
    var image = req.body.image;
    image = "." + image;
    var sql = "UPDATE page SET image = '' WHERE id = ?;";

    connection.query(sql, [page_id], (err, rows, fields) => {
        if (err) {
            res.sendStatus(400);
            console.log(err);
        } else {
            try {
                fs.unlinkSync(image);
                res.sendStatus(200);
            } catch (e) {
                res.sendStatus(417);
                console.log(e);
            }
            
        }
    });
});

router.put('/update', upload.single("pageImage"), (req, res) => {
    var page_id = req.body.id;
    var img = req.file;
    var url = img.destination + img.filename;
    url = url.substr(1);
    var values = [url, page_id];
    var sql = "UPDATE page SET image = ? WHERE id = ?;";

    connection.query(sql, values, (err, rows, fields) => {
        if (err) {
            res.sendStatus(400);
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    });
});


module.exports = router;
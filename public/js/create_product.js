"use strict";


import {isItEmpty} from './utils.js';
import "./create_classification.js";

//textfields
var product_name_txt = document.getElementById('product_name');
var product_price_txt = document.getElementById('product_price');
var product_new_price_txt = document.getElementById('product_new_price');
var product_ean_txt = document.getElementById('product_ean');
var product_availability_txt = document.getElementById('product_availability');
var product_quantity_txt = document.getElementById('product_quantity');
var product_brand_txt = document.getElementById('product_brand');
var product_design_txt = document.getElementById('product_design');
var product_description_txt = document.getElementById('product_description');
var product_material_txt = document.getElementById('product_material');
var product_diameter_txt = document.getElementById('product_diameter');
var product_length_txt = document.getElementById('product_length');
var product_width_txt = document.getElementById('product_width');
var product_height_txt = document.getElementById('product_height');
var product_volume_txt = document.getElementById('product_volume');
var product_weight_txt = document.getElementById('product_weight');
var product_size_txt = document.getElementById('product_size');
//error label for the textfields
var text_error_txt = document.getElementById('text_error');
var class_error_txt = document.getElementById('class_error');
var image_error_txt = document.getElementById('image_error');
//selectors
var sub_slc = document.getElementById('product_subcategory');
var cat_slc = document.getElementById('product_category');
var sec_slc = document.getElementById('product_section');

var def_sub = document.getElementById('default_subcategory');
var def_cat = document.getElementById('default_category');
var def_sec = document.getElementById('default_section');

//upload images
var add_colour_row = document.getElementById('add_colour');
var images_table = document.getElementById('images_table');
var images_table_body = document.getElementById('images_table_body');
//buttons
var create_product_button = document.getElementById('create_product');
//reusable variables
var key = "myImage";
var formdata;
var headers;
var fileInput;
var product_colour_txt;


//fetches the classifications from DB into selectors
fetchStuff(sub_slc, cat_slc, sec_slc, null);

//dynamic input of images and colours
add_colour_row.addEventListener("click", () => {
  var row = images_table_body.insertRow(0);
  var row_count = images_table_body.rows.length;
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  cell1.innerHTML = '<input type="text" id="product_colour_' + row_count + '" >';
  cell2.innerHTML = '<input type="file" name="myImage" id="product_image_' + row_count + '" multiple="">';
});

create_product_button.addEventListener("click", () => {
  //initializing
  var product_name = product_name_txt.value;
  var product_price = product_price_txt.value;
  var product_new_price = product_new_price_txt.value;
  var product_ean = product_ean_txt.value;
  var product_availability = product_availability_txt.value;
  var product_quantity = product_quantity_txt.value;
  var product_brand = product_brand_txt.value;
  var product_design = product_design_txt.value;
  var product_description = product_description_txt.value;
  var product_material = product_material_txt.value;
  var product_diameter = product_diameter_txt.value;
  var product_length = product_length_txt.value;
  var product_width = product_width_txt.value;
  var product_height = product_height_txt.value;
  var product_volume = product_volume_txt.value;
  var product_weight = product_weight_txt.value;
  var product_size = product_size_txt.value;
  var product_subcategory = sub_slc.value;
  var product_category = cat_slc.value;
  var product_section = sec_slc.value;

  //check if the fields are empty
  var empty_fields = isItEmpty([product_name, product_price, product_new_price,
    product_ean, product_availability, product_quantity, product_brand, product_design,
    product_description, product_material, product_diameter, product_length,
    product_width, product_height, product_volume, product_weight, product_size,
    product_subcategory, product_category, product_section
  ]);


  var data = {
    'name': product_name,
    'price': product_price,
    'new_price': product_new_price,
    'ean': product_ean,
    'availability': product_availability,
    'quantity': product_quantity,
    'brand': product_brand,
    'design': product_design,
    'description': product_description,
    'material': product_material,
    'diameter': product_diameter,
    'length': product_length,
    'width': product_width,
    'height': product_height,
    'volume': product_volume,
    'weight': product_weight,
    'size': product_size,
    'subcategory': product_subcategory,
    'category': product_category,
    'section': product_section
  };

  if (empty_fields === true || product_ean === "") {
    text_error_txt.innerHTML = "Fields are empty!";
  } else {
    uploadImages(data);
  }

});

function uploadImages(data) {

  createProduct(data)
  .then((result) => {
    //image upload
    var body = images_table_body.rows.length;
    formdata = new FormData();
    headers = new Headers();

    for (var i = 1; i <= body; i++) {
      fileInput = document.getElementById('product_image_' + i);
      product_colour_txt = document.getElementById('product_colour_' + i);

      for (var j = 0; j < fileInput.files.length; j++) {
        formdata.append(key, fileInput.files[j], fileInput.value);
        formdata.append("colour", product_colour_txt.value);
      }
    }

    formdata.append("id", result);
    headers.append("Content-Type", "multipart/form-data");

    var uploadImagesRequest = {
      method: 'POST',
      header: headers,
      body: formdata
    };

    fetch("http://192.168.0.107:3000/products/upload-images", uploadImagesRequest)
      .then(response => response.json())
      .then((result) => {
        location.reload(true);
      }).catch(error => console.log('error', error));
  }).catch(error => console.log('error', error));

}

async function createProduct(data) {
  headers = new Headers();
  headers.append("Content-Type", "application/json");
  var raw = JSON.stringify(data);

  var createProductRequest = {
    method: 'POST',
    headers: headers,
    body: raw
  };

  let response = await fetch("http://192.168.0.107:3000/products/create-product", createProductRequest);
  let message = await response.json();
  return message;

}

export function fetchStuff(sub_slc, cat_slc, sec_slc) {

  console.log("I run");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

fetch("http://192.168.0.107:3000/classifications/", requestOptions)
  .then(response => response.json())
  .then((result) => {
    console.log("I run again");

    //the fetch returns array of 3 objects
    //we pass each array to a function to populate a specific selector
    populateSelector(result[0], sub_slc);
    populateSelector(result[1], cat_slc);
    populateSelector(result[2], sec_slc);

  }).catch(error => console.log('error', error));

}

function populateSelector(array, selector, option_value, default_option) {
  console.log("iruna in a function");
  
  //each array is contains objects[name:value]
  for (var i = 0; i < array.length; i++) {
    for (var item in array[i]) {
      var opt = array[i][item];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      selector.appendChild(el);
    }
  }

  // if(option_value !== null) {
  //   console.log("im not null");
    
  //   selector.value = option_value;
  // }
  
}

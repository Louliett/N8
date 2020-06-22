"use strict";

console.log("outrageous gems");

import {
  isItEmpty
} from './utils.js';

//textfields
var subcategory_name_txt = document.getElementById('subcategory_name');
var category_name_txt = document.getElementById('category_name');
var section_name_txt = document.getElementById('section_name');
//buttons
var subcategory_button = document.getElementById('subcategory_button');
var category_button = document.getElementById('category_button');
var section_button = document.getElementById('section_button');
//error labels
var sub_err = document.getElementById('subcategory_err');
var cat_err = document.getElementById('category_err');
var sec_err = document.getElementById('section_err');
//file inputs
var sub_input = document.getElementById('subcategory_image');
var cat_input = document.getElementById('category_image');
var sec_input = document.getElementById('section_image');
// fileInput keys
const sub_key = "subImage";
const cat_key = "catImage";
const sec_key = "secImage";
//flag to check if values match
var flag;
//url for the default image
const image = "/public/class_images/default.png";
//sql tables
var sub_table = "subcategory";
var cat_table = "category";
var sec_table = "section";
//create classifications
var create_sub = "create-subcategory";
var create_cat = "create-category";
var create_sec = "create-section";
var create_sub_img = "create-subcategory-image";
var create_cat_img = "create-category-image";
var create_sec_img = "create-section-image";
//arrays with data from database
var sub_array = [];
var cat_array = [];
var sec_array = [];
//reusable variables
var headers;
var formdata;

//fetch classifications and store them in arrays
fetchClassifications(sub_table, sub_array);
fetchClassifications(cat_table, cat_array);
fetchClassifications(sec_table, sec_array);

//create subcategory
subcategory_button.addEventListener("click", () => {
  createClassification(subcategory_name_txt, sub_array, create_sub, create_sub_img, sub_err, sub_input, sub_key);
});
//create category
category_button.addEventListener("click", () => {
  createClassification(category_name_txt, cat_array, create_cat, create_cat_img, cat_err, cat_input, cat_key);
});
//create section
section_button.addEventListener("click", () => {
  createClassification(section_name_txt, sec_array, create_sec, create_sec_img, sec_err, sec_input, sec_key);
});


export function createClassification(txtarea, array, create_class, create_class_img, error_label, fileInput, key) {
  //array for checking up on empty fields
  let fields = [];
  var image_name;
  var image_path;

  var class_name = txtarea.value;
  fields.push(class_name);


  if (isItEmpty(fields) == true) {
    error_label.innerHTML = "Field is empty!";
    txtarea.value = "";
  } else {

    if (array.length > 0) {
      flag = doesItMatch(class_name, array);
    } else {
      flag = false;
    }

    if (flag == true) {
      error_label.innerHTML = "This classification already exists!";
    } else {
      image_name = fileInput.files[0];
      image_path = fileInput.value;

      //in case the user did not attach an image to the classification
      if (image_name === undefined && image_path.length === 0) {

        headers = new Headers();
        headers.append("Content-Type", "application/json");

        const data = {
          "name": class_name,
          "image": image
        };

        var raw = JSON.stringify(data);

        var requestOptions1 = {
          method: 'POST',
          headers: headers,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://192.168.0.107:3000/classifications/" + create_class, requestOptions1)
          .then(response => response.text())
          .then(result => {
            error_label.innerHTML = result;
            location.reload(true);
            txtarea.value = "";
          }).catch(error => console.log('error', error));

      } else {
        formdata = new FormData();
        formdata.append("name", class_name);
        formdata.append(key, image_name, image_path);

        var requestOptions2 = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://192.168.0.107:3000/classifications/" + create_class_img, requestOptions2)
          .then(response => response.text())
          .then(result => {
            error_label.innerHTML = result;
            location.reload(true);
            txtarea.value = "";
          }).catch(error => console.log('error', error));
      }

    }
  }


}

function fetchClassifications(table, array) {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch('http://192.168.0.107:3000/classifications/' + table, requestOptions)
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        array.push(data[i].name);
      }
    }).catch(error => console.error(error));
}

function doesItMatch(name, name_arr) {
  for (var i = 0; i < name_arr.length; i++) {
    if (name === name_arr[i]) {
      return true;
    }
  }
  return false;
}
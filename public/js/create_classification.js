"use strict"

import { isItEmpty } from './utils.js';

//textfields
var subcategory_name_txt = document.getElementById('subcategory_name');
var category_name_txt = document.getElementById('category_name');
var section_name_txt = document.getElementById('section_name');
//buttons
var subcategory_button = document.getElementById('subcategory_button');
var category_button = document.getElementById('category_button');
var section_button = document.getElementById('section_button');
//flag to check if values match
var flag;
//classification name
var sub_name;
var cat_name;
var sec_name;
//sql tables
var sub_table = "subcategory";
var cat_table = "category";
var sec_table = "section";
//create classifications
var create_sub = "create-subcategory";
var create_cat = "create-category";
var create_sec = "create-section"
//arrays with data from database
var sub_array = [];
var cat_array = [];
var sec_array = [];

//fetch classifications and store them in arrays
fetchClassifications(sub_table, sub_array);
fetchClassifications(cat_table, cat_array);
fetchClassifications(sec_table, sec_array);

console.log(sub_array);
console.log(cat_array);
console.log(sec_array);

subcategory_button.addEventListener("click", () => {
  createClass(sub_name, subcategory_name_txt, sub_array, create_sub);
});
category_button.addEventListener("click",() => {
   createClass(cat_name, category_name_txt, cat_array, create_cat);
});
section_button.addEventListener("click", () => {
  createClass(sec_name, section_name_txt, sec_array, create_sec);
});

function fetchClassifications(table, array) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch('http://localhost:3000/classifications/' + table, requestOptions)
    .then(response => response.json())
    .then(data => {
      for(var i=0; i<data.length; i++) {
        array.push(data[i].name);
      }
    }).catch(error => console.error(error));
}

function createClass(class_name, txtarea, array, create_class) {
  //array for checking up on empty fields
  let fields = [];
  class_name = txtarea.value;
  fields.push(class_name);

  console.log(class_name, txtarea, array, create_class, fields);
  if(isItEmpty(fields) == true) {
    console.log("field is empty!");
    txtarea.value = "";
  } else {
      flag = doesItMatch(class_name, array);
      if(flag == true) {
        console.log("This section already exists!");
      } else {
          var myHeaders = new Headers();
          const data = {
            'name': class_name
          };
          var raw = JSON.stringify(data);
          myHeaders.append("Content-Type", "application/json");
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
          fetch("http://localhost:3000/classifications/" + create_class, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
            txtarea.value = "";
            window.location.reload();  
      }
    }

}

function doesItMatch(name, name_arr) {
  for (var i = 0; i < name_arr.length; i++) {
    if(name === name_arr[i]) {
      return true;
    }
  }
  return false;
}

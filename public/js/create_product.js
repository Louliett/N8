"use strict"

import { Product } from './product.js';
import { isItEmpty } from './utils.js';

var create_product_button = document.getElementById('create_product');
var product_subcategory_slc = document.getElementById('product_subcategory');
var product_category_slc = document.getElementById('product_category');
var product_section_slc = document.getElementById('product_section');
var subcategory = [];
var category = [];
var section = [];

(function() {

  fetch('http://localhost:3000/n8_api/subcategory')
    .then(response => response.json())
    .then(data => {

      for(var i=0; i<data.length; i++) {
        //console.log(data[i].name);
        subcategory.push(data[i].name);
      }

      for(var i = 0; i < subcategory.length; i++) {
        var opt = subcategory[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        product_subcategory_slc.appendChild(el);
      }

    }).catch(error =>
      console.error(error));

})();

(function() {

  fetch('http://localhost:3000/n8_api/category')
    .then(response => response.json())
    .then(data => {

      for(var i=0; i<data.length; i++) {
        //console.log(data[i].name);
        category.push(data[i].name);
      }

      for(var i = 0; i < category.length; i++) {
        var opt = category[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        product_category_slc.appendChild(el);
      }

    }).catch(error =>
      console.error(error));

})();

(function() {

  fetch('http://localhost:3000/n8_api/section')
    .then(response => response.json())
    .then(data => {

      for(var i=0; i<data.length; i++) {
        //console.log(data[i].name);
        section.push(data[i].name);
      }

      for(var i = 0; i < section.length; i++) {
        var opt = section[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        product_section_slc.appendChild(el);
      }

    }).catch(error =>
      console.error(error));

})();


create_product_button.addEventListener("click", function(){

  var product_name_txt = document.getElementById('product_name');
  var product_price_txt = document.getElementById('product_price');
  var product_new_price_txt = document.getElementById('product_new_price');
  var product_ean_txt = document.getElementById('product_ean');
  var product_quantity_txt = document.getElementById('product_quantity');
  var product_brand_txt = document.getElementById('product_brand');
  var product_design_txt = document.getElementById('product_design');
  var product_image_link_txt = document.getElementById('product_image_link');
  var product_description_txt = document.getElementById('product_description');
  var product_material_txt = document.getElementById('product_material');
  var product_colour_txt = document.getElementById('product_colour');
  var product_length_txt = document.getElementById('product_length');
  var product_width_txt = document.getElementById('product_width');
  var product_height_txt = document.getElementById('product_height');
  var product_volume_txt = document.getElementById('product_volume');
  var product_weight_txt = document.getElementById('product_weight');


  var product_name = product_name_txt.value;
  var product_price = product_price_txt.value;
  var product_new_price = product_new_price_txt.value;
  var product_ean = product_ean_txt.value;
  var product_quantity = product_quantity_txt.value;
  var product_brand = product_brand_txt.value;
  var product_design = product_design_txt.value;
  var product_image_link = product_image_link_txt.value;
  var product_description = product_description_txt.value;
  var product_material = product_material_txt.value;
  var product_colour = product_colour_txt.value;
  var product_length = product_length_txt.value;
  var product_width = product_width_txt.value;
  var product_height = product_height_txt.value;
  var product_volume = product_volume_txt.value;
  var product_weight = product_weight_txt.value;
  var product_subcategory = product_subcategory_slc.value;
  var product_category = product_category_slc.value;
  var product_section = product_section_slc.value;



  //var product = new Product(product_name, product_price, product_new_price, product_ean, product_quantity, product_brand, product_design, product_image_link, product_description, product_material, product_colour, product_length, product_width, product_height, product_volume, product_weight, product_subcategory, product_category, product_section);
  let fields = [];
  fields.push(product_name, product_price, product_new_price, product_ean, product_quantity, product_brand, product_design, product_image_link, product_description, product_material, product_colour, product_length, product_width, product_height, product_volume, product_weight, product_subcategory, product_category, product_section);

  //console.log(product);
  const product = {
    'name': product_name,
    'price': product_price,
    'new_price': product_new_price,
    'ean': product_ean,
    'quantity': product_quantity,
    'brand': product_brand,
    'design': product_design,
    'image_link': product_image_link,
    'description': product_description,
    'material': product_material,
    'colour': product_colour,
    'length': product_length,
    'width': product_width,
    'height': product_height,
    'volume': product_volume,
    'weight': product_weight,
    'subcategory': product_subcategory,
    'category': product_category,
    'section': product_section
   };

  if(isItEmpty(fields) === true || product_ean === "") {
    console.log("All fields are empty!!!");
  } else {

    const options = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    };

    fetch('http://localhost:3000/n8_api/create-product', options)

    product_name_txt.value = "";
    product_price_txt.value = "";
    product_new_price_txt.value = "";
    product_ean_txt.value = "";
    product_quantity_txt.value = "";
    product_brand_txt.value = "";
    product_design_txt.value = "";
    product_image_link_txt.value = "";
    product_description_txt.value = "";
    product_material_txt.value = "";
    product_colour_txt.value = "";
    product_length_txt.value = "";
    product_width_txt.value = "";
    product_height_txt.value = "";
    product_volume_txt.value = "";
    product_weight_txt.value = "";
    product_subcategory_slc.value = "";
    product_category_slc.value = "";
    product_section_slc.value = "";

  }

});

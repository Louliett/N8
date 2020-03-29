"use strict"


import { isItEmpty } from './utils.js';

var create_product_button = document.getElementById('create_product');
var product_subcategory_slc = document.getElementById('product_subcategory');
var product_category_slc = document.getElementById('product_category');
var product_section_slc = document.getElementById('product_section');
//sql tables
var sub_table = "subcategory";
var cat_table = "category";
var sec_table = "section";
//arrays with data from database
var sub_array = [];
var cat_array = [];
var sec_array = [];

//populates all the drop down menus
populateSelectors(sub_table, sub_array, product_subcategory_slc);
populateSelectors(cat_table, cat_array, product_category_slc);
populateSelectors(sec_table, sec_array, product_section_slc);

function populateSelectors(table, array, selector) {
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
      for(var i = 0; i < array.length; i++) {
        var opt = array[i];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selector.appendChild(el);
      }
    }).catch(error => console.error(error));

}



create_product_button.addEventListener("click", function() {

  var product_name_txt = document.getElementById('product_name');
  var product_price_txt = document.getElementById('product_price');
  var product_new_price_txt = document.getElementById('product_new_price');
  var product_ean_txt = document.getElementById('product_ean');
  var product_quantity_txt = document.getElementById('product_quantity');
  var product_brand_txt = document.getElementById('product_brand');
  var product_design_txt = document.getElementById('product_design');
  var product_description_txt = document.getElementById('product_description');
  var product_material_txt = document.getElementById('product_material');
  var product_colour_txt = document.getElementById('product_colour');
  var product_length_txt = document.getElementById('product_length');
  var product_width_txt = document.getElementById('product_width');
  var product_height_txt = document.getElementById('product_height');
  var product_volume_txt = document.getElementById('product_volume');
  var product_weight_txt = document.getElementById('product_weight');
  var product_size_txt = document.getElementById('product_size');
  var fileInput = document.getElementById('product_image');

  var product_name = product_name_txt.value;
  var product_price = product_price_txt.value;
  var product_new_price = product_new_price_txt.value;
  var product_ean = product_ean_txt.value;
  var product_quantity = product_quantity_txt.value;
  var product_brand = product_brand_txt.value;
  var product_design = product_design_txt.value;
  var product_description = product_description_txt.value;
  var product_material = product_material_txt.value;
  var product_colour = product_colour_txt.value;
  var product_length = product_length_txt.value;
  var product_width = product_width_txt.value;
  var product_height = product_height_txt.value;
  var product_volume = product_volume_txt.value;
  var product_weight = product_weight_txt.value;
  var product_size = product_size_txt.value;
  var product_subcategory = product_subcategory_slc.value;
  var product_category = product_category_slc.value;
  var product_section = product_section_slc.value;
  //imagage upload
  var key = fileInput.name;
  var theImage = fileInput.value;
  var images_number = fileInput.files.length;
  var formdata = new FormData();





  let fields = [];
  fields.push(product_name, product_price, product_new_price, product_ean,
    product_quantity, product_brand, product_design, product_description,
    product_material, product_colour, product_length, product_width,
    product_height, product_volume, product_weight, product_size,
    product_subcategory, product_category, product_section);

  for(var i = 0; i < fileInput.files.length; i++) {
    formdata.append(key, fileInput.files[i], theImage);
  }

  formdata.append("ean", product_ean);
  console.log(formdata.get("ean"));



  const data = {
    'name': product_name,
    'price': product_price,
    'new_price': product_new_price,
    'ean': product_ean,
    'quantity': product_quantity,
    'brand': product_brand,
    'design': product_design,
    'description': product_description,
    'material': product_material,
    'colour': product_colour,
    'length': product_length,
    'width': product_width,
    'height': product_height,
    'volume': product_volume,
    'weight': product_weight,
    'size': product_size,
    'subcategory': product_subcategory,
    'category': product_category,
    'section': product_section
  }



  if(isItEmpty(fields) === true || product_ean === "") {
    console.log("All fields are empty!!!");
  } else {

      var textheaders = new Headers();
      var imageheaders = new Headers();
      textheaders.append("Content-Type", "application/json");
      imageheaders.append("Content-Type", "multipart/form-data");

      //console.log(raw_text);

      var raw = JSON.stringify(data);

      var createProductRequest = {
        method: 'POST',
        headers: textheaders,
        body: raw
      };

      var uploadImagesRequest = {
        method: 'POST',
        header: imageheaders,
        body: formdata
      }

      fetch("http://localhost:3000/products/create-product", createProductRequest)
      .then(response => response.text())
      .then(result =>  console.log(result))
      .catch(error => console.log('error', error));


      if(images_number !== 0) {
        fetch("http://localhost:3000/products/upload-images-test", uploadImagesRequest)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      }




      product_name_txt.value = "";
      product_price_txt.value = "";
      product_new_price_txt.value = "";
      product_ean_txt.value = "";
      product_quantity_txt.value = "";
      product_brand_txt.value = "";
      product_design_txt.value = "";
      product_description_txt.value = "";
      product_material_txt.value = "";
      product_colour_txt.value = "";
      product_length_txt.value = "";
      product_width_txt.value = "";
      product_height_txt.value = "";
      product_volume_txt.value = "";
      product_weight_txt.value = "";
      product_size_txt.value = "";
      product_subcategory_slc.textContent = "";
      product_category_slc.textContent = "";
      product_section_slc.textContent = "";

  }

});

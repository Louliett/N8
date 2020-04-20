//"use strict"


import {isItEmpty} from './utils.js';

//textfields
var product_name_txt = document.getElementById('product_name');
var product_price_txt = document.getElementById('product_price');
var product_new_price_txt = document.getElementById('product_new_price');
var product_ean_txt = document.getElementById('product_ean');
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
//selectors
var product_subcategory_slc = document.getElementById('product_subcategory');
var product_category_slc = document.getElementById('product_category');
var product_section_slc = document.getElementById('product_section');
//upload images
var add_colour_row = document.getElementById('add_colour');
var images_table = document.getElementById('images_table');
var images_table_body = document.getElementById('images_table_body');
//buttons
var create_product_button = document.getElementById('create_product');
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
  console.log("button pressed");
  //initializing
  var product_name = product_name_txt.value;
  var product_price = product_price_txt.value;
  var product_new_price = product_new_price_txt.value;
  var product_ean = product_ean_txt.value;
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
  var product_subcategory = product_subcategory_slc.value;
  var product_category = product_category_slc.value;
  var product_section = product_section_slc.value;


  //check if the fields are empty
  var empty_fields = isItEmpty([product_name, product_price, product_new_price,
    product_ean, product_quantity, product_brand, product_design,
    product_description, product_material, product_diameter, product_length,
    product_width, product_height, product_volume, product_weight, product_size,
    product_subcategory, product_category, product_section
  ]);

  //visualize formdata
  // for (var pair of formdata.entries()) {
  //   console.log(pair[0]+ ', '+ pair[1]);
  // }

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
    console.log("All fields are empty!!!");
  } else {
    uploadImages(data);
    product_name_txt.value = "";
    product_price_txt.value = "";
    product_new_price_txt.value = "";
    product_ean_txt.value = "";
    product_quantity_txt.value = "";
    product_brand_txt.value = "";
    product_design_txt.value = "";
    product_description_txt.value = "";
    product_material_txt.value = "";
    product_diameter_txt.value = "";
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
  console.log("button finished");
});

function uploadImages(data) {

  createProduct(data)
  .then((result) => {
    //var id = result[0].insertId;
    //imagage upload
    var body = images_table_body.rows.length;
    var key = "myImage";
    var product_colour_txt;
    var fileInput;
    var formdata = new FormData();

    for (var i = 1; i <= body; i++) {
      fileInput = document.getElementById('product_image_' + i);
      product_colour_txt = document.getElementById('product_colour_' + i);

      for (var j = 0; j < fileInput.files.length; j++) {
        formdata.append(key, fileInput.files[j], fileInput.value);
        formdata.append("colour", product_colour_txt.value);
      }
    }

    console.log(result, "before");
    formdata.append("id", result);

    var imageheaders = new Headers();
    imageheaders.append("Content-Type", "multipart/form-data");
    var uploadImagesRequest = {
      method: 'POST',
      header: imageheaders,
      body: formdata
    };

    fetch("http://192.168.0.105:3000/products/upload-images", uploadImagesRequest)
      .then(response => response.json())
      .then((result) => {
        //console.log(result);
        //fileInput.value = "";
        //images_table_body.innerHTML = "";
        //product_colour_txt.value = "";
        location.reload(true);
      }).catch(error => console.log('error', error));
  }).catch(error => console.log('error', error));

}

async function createProduct(data) {
  var textheaders = new Headers();
  textheaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(data);
  var createProductRequest = {
    method: 'POST',
    headers: textheaders,
    body: raw
  };

  let response = await fetch("http://192.168.0.105:3000/products/create-product", createProductRequest);
  let message = await response.json();
  return message;

}


function populateSelectors(table, array, selector) {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch('http://192.168.0.105:3000/classifications/' + table, requestOptions)
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.length; i++) {
        array.push(data[i].name);
      }
      for (var j = 0; j < array.length; j++) {
        var opt = array[j];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selector.appendChild(el);
      }
    }).catch(error => console.error(error));
}

function cleanFields(fileInput, product_colour_txt) {
  product_name_txt.value = "";
  product_price_txt.value = "";
  product_new_price_txt.value = "";
  product_ean_txt.value = "";
  product_quantity_txt.value = "";
  product_brand_txt.value = "";
  product_design_txt.value = "";
  product_description_txt.value = "";
  product_material_txt.value = "";
  product_diameter_txt.value = "";
  product_length_txt.value = "";
  product_width_txt.value = "";
  product_height_txt.value = "";
  product_volume_txt.value = "";
  product_weight_txt.value = "";
  product_size_txt.value = "";
  product_subcategory_slc.textContent = "";
  product_category_slc.textContent = "";
  product_section_slc.textContent = "";
  fileInput.value = "";
  product_colour_txt.value = "";
}

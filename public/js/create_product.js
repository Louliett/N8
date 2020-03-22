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

  fetch('http://localhost:3000/products/subcategory')
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

  fetch('http://localhost:3000/products/category')
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

  fetch('http://localhost:3000/products/section')
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


// create_product_button.addEventListener("click", function(){
//
//
//   var product_name_txt = document.getElementById('product_name');
//   var product_price_txt = document.getElementById('product_price');
//   var product_new_price_txt = document.getElementById('product_new_price');
//   var product_ean_txt = document.getElementById('product_ean');
//   var product_quantity_txt = document.getElementById('product_quantity');
//   var product_brand_txt = document.getElementById('product_brand');
//   var product_design_txt = document.getElementById('product_design');
//   var product_description_txt = document.getElementById('product_description');
//   var product_material_txt = document.getElementById('product_material');
//   var product_colour_txt = document.getElementById('product_colour');
//   var product_length_txt = document.getElementById('product_length');
//   var product_width_txt = document.getElementById('product_width');
//   var product_height_txt = document.getElementById('product_height');
//   var product_volume_txt = document.getElementById('product_volume');
//   var product_weight_txt = document.getElementById('product_weight');
//   var fileInput = document.getElementById('product_image');
//
//   var product_name = product_name_txt.value;
//   var product_price = product_price_txt.value;
//   var product_new_price = product_new_price_txt.value;
//   var product_ean = product_ean_txt.value;
//   var product_quantity = product_quantity_txt.value;
//   var product_brand = product_brand_txt.value;
//   var product_design = product_design_txt.value;
//   var product_description = product_description_txt.value;
//   var product_material = product_material_txt.value;
//   var product_colour = product_colour_txt.value;
//   var product_length = product_length_txt.value;
//   var product_width = product_width_txt.value;
//   var product_height = product_height_txt.value;
//   var product_volume = product_volume_txt.value;
//   var product_weight = product_weight_txt.value;
//   var product_subcategory = product_subcategory_slc.value;
//   var product_category = product_category_slc.value;
//   var product_section = product_section_slc.value;
//   //imagage upload
//   var key = fileInput.name;
//   var theImage = fileInput.value;
//   var formdata = new FormData();
//
//
//
//
//   //var product = new Product(product_name, product_price, product_new_price, product_ean, product_quantity, product_brand, product_design, product_image_link, product_description, product_material, product_colour, product_length, product_width, product_height, product_volume, product_weight, product_subcategory, product_category, product_section);
//   let fields = [];
//   fields.push(product_name, product_price, product_new_price, product_ean, product_quantity, product_brand, product_design, product_description, product_material, product_colour, product_length, product_width, product_height, product_volume, product_weight, product_subcategory, product_category, product_section);
//
//   for(var i = 0; i < fileInput.files.length; i++) {
//     formdata.append(key, fileInput.files[i], theImage);
//   }
//   //need to append data to the body
//   formdata.append("name", product_name);
//   formdata.append("price", product_price);
//   formdata.append("new_price", product_new_price);
//   formdata.append("ean", product_ean);
//   formdata.append("quantity", product_quantity);
//   formdata.append("brand", product_brand);
//   formdata.append("design", product_design);
//   formdata.append("description", product_description);
//   formdata.append("material", product_material);
//   formdata.append("colour", product_colour);
//   formdata.append("length", product_length);
//   formdata.append("width", product_width);
//   formdata.append("height", product_height);
//   formdata.append("volume", product_volume);
//   formdata.append("weight", product_weight);
//   formdata.append("subcategory", product_subcategory);
//   formdata.append("category", product_category);
//   formdata.append("section", product_section);
//
//
//
//   // //console.log(product);
//   // const product = {
//   //   'name': product_name,
//   //   'price': product_price,
//   //   'new_price': product_new_price,
//   //   'ean': product_ean,
//   //   'quantity': product_quantity,
//   //   'brand': product_brand,
//   //   'design': product_design,
//   //   'description': product_description,
//   //   'material': product_material,
//   //   'colour': product_colour,
//   //   'length': product_length,
//   //   'width': product_width,
//   //   'height': product_height,
//   //   'volume': product_volume,
//   //   'weight': product_weight,
//   //   'subcategory': product_subcategory,
//   //   'category': product_category,
//   //   'section': product_section
//   //  };
//
//   if(isItEmpty(fields) === true || product_ean === "") {
//     console.log("All fields are empty!!!");
//   } else {
//
//
//     var requestOptions = {
//       method: 'POST',
//       body: formdata,
//       redirect: 'follow'
//     };
//
//     fetch("http://localhost:3000/products/test", requestOptions)
//     .then(response => response.text())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));
//
//     product_name_txt.value = "";
//     product_price_txt.value = "";
//     product_new_price_txt.value = "";
//     product_ean_txt.value = "";
//     product_quantity_txt.value = "";
//     product_brand_txt.value = "";
//     product_design_txt.value = "";
//     product_description_txt.value = "";
//     product_material_txt.value = "";
//     product_colour_txt.value = "";
//     product_length_txt.value = "";
//     product_width_txt.value = "";
//     product_height_txt.value = "";
//     product_volume_txt.value = "";
//     product_weight_txt.value = "";
//     product_subcategory_slc.value = "";
//     product_category_slc.value = "";
//     product_section_slc.value = "";
//
//   }
//
// });

create_product_button.addEventListener("click", function(event) {
  event.preventDefault();
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
  var product_subcategory = product_subcategory_slc.value;
  var product_category = product_category_slc.value;
  var product_section = product_section_slc.value;
  //imagage upload
  var key = fileInput.name;
  var theImage = fileInput.value;
  var formdata = new FormData();




  //var product = new Product(product_name, product_price, product_new_price, product_ean, product_quantity, product_brand, product_design, product_image_link, product_description, product_material, product_colour, product_length, product_width, product_height, product_volume, product_weight, product_subcategory, product_category, product_section);
  let fields = [];
  fields.push(product_name, product_price, product_new_price, product_ean, product_quantity, product_brand, product_design, product_description, product_material, product_colour, product_length, product_width, product_height, product_volume, product_weight, product_subcategory, product_category, product_section);

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
    'subcategory': product_subcategory,
    'category': product_category,
    'section': product_section
  }



  if(isItEmpty(fields) === true || product_ean === "") {
    console.log("All fields are empty!!!");
  } else {


      var texthead = new Headers();
      var imagehead = new Headers();
      texthead.append("Content-Type", "application/json");
      imagehead.append("Content-Type", "multipart/form-data");

      //console.log(raw_text);

      var raw_text = JSON.stringify(data);

      var createProductRequest = {
        method: 'POST',
        headers: texthead,
        body: raw_text
      };

      var uploadImagesRequest = {
        method: 'POST',
        header: imagehead,
        body: formdata
      }

      fetch("http://localhost:3000/products/create-product-test", createProductRequest)
      .then(response => response.text())
      .then((result, newfetch) => {
        console.log(result)


      })
      .catch(error => console.log('error', error));

      console.log(formdata.get("ean"));
      fetch("http://localhost:3000/products/upload-images-test", uploadImagesRequest)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));



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
      product_subcategory_slc.textContent = "";
      product_category_slc.textContent = "";
      product_section_slc.textContent = "";

  }

});

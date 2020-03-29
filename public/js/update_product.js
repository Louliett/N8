"use strict"

import { isItEmpty } from './utils.js';

var key = decodeURIComponent(window.location.search).replace("?", "");
//buttons
var update_product_button = document.getElementById('update_product');
var delete_product_button = document.getElementById('delete_product');
//drop down menus
var product_subcategory_slc = document.getElementById('product_subcategory');
var product_category_slc = document.getElementById('product_category');
var product_section_slc = document.getElementById('product_section');

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
var product_colour_txt = document.getElementById('product_colour');
var product_length_txt = document.getElementById('product_length');
var product_width_txt = document.getElementById('product_width');
var product_height_txt = document.getElementById('product_height');
var product_volume_txt = document.getElementById('product_volume');
var product_weight_txt = document.getElementById('product_weight');
var product_size_txt = document.getElementById('product_size');
//image input
var fileInput = document.getElementById('product_image');
var image_div = document.getElementById('image_div');
var images = [];
var id;
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


window.addEventListener("load", () => {

  var default_subcategory = document.getElementById('default_subcategory');
  var default_category = document.getElementById('default_category');
  var default_section = document.getElementById('default_section');

  const data = {
    ean: key
  };

  var raw = JSON.stringify(data);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://localhost:3000/products/ean-text', requestOptions)
    .then(response => response.json())
    .then(data => {
      product_name_txt.value = data[0].name;
      product_price_txt.value = data[0].price;
      product_new_price_txt.value = data[0].new_price;
      product_ean_txt.value = data[0].ean;
      product_quantity_txt.value = data[0].quantity;
      product_brand_txt.value = data[0].brand;
      product_design_txt.value = data[0].design;
      product_description_txt.value = data[0].description;
      product_material_txt.value = data[0].material;
      product_colour_txt.value = data[0].colour;
      product_length_txt.value = data[0].length;
      product_width_txt.value = data[0].width;
      product_height_txt.value = data[0].height;
      product_volume_txt.value = data[0].volume;
      product_weight_txt.value = data[0].weight;
      default_subcategory.textContent = data[0].subcategory;
      default_category.textContent = data[0].category;
      default_section.textContent = data[0].section;
      id = data[0].id;


    }).catch(error => console.error(error));

  fetch('http://localhost:3000/products/ean-img', requestOptions)
    .then(response => response.json())
    .then(data => {
       data.forEach((element, index, array) => {
       images.push("/public/images/" + element.name);
    });
       displayImages(image_div);
    }).catch(error => console.error(error));



});

function displayImages(div) {

  for (var i = 0; i < images.length; i++) {

    var image_container = document.createElement("img");
    image_container.setAttribute("src", images[i]);

    image_container.addEventListener("click", () => {
      var target = event.target;
      var path = event.target.getAttribute("src");
      var name = path.slice(15, path.length);
      console.log(path);
      deleteImages(name, path, target);
    });
    image_container.setAttribute("style", "height: 70px; width:70px; object-fit:cover; display: inline-block; padding: 5px 5px;");
    div.appendChild(image_container);
  }

}

function deleteImages(name, path, target) {

  const data = {
    name: name,
    path: path
  };

  var raw = JSON.stringify(data);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://localhost:3000/products/delete-images', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

     image_div.removeChild(target);

}


update_product_button.addEventListener("click", () => {
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


  let fields = [];//checks if fields are empty
  fields.push(product_name, product_price, product_new_price, product_ean,
    product_quantity, product_brand, product_design, product_description,
    product_material, product_colour, product_length, product_width,
    product_height, product_volume, product_weight, product_size,
    product_subcategory, product_category, product_section);

  //appends images to formdata
  for(var i = 0; i < fileInput.files.length; i++) {
    formdata.append(key, fileInput.files[i], theImage);
  }
  //appends text to formdata
  formdata.append("ean", product_ean);
  console.log(formdata.get("ean"));



  const data = {
    'id': id,
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

      var texthead = new Headers();
      var imagehead = new Headers();
      texthead.append("Content-Type", "application/json");
      imagehead.append("Content-Type", "multipart/form-data");

      //console.log(raw_text);

      var raw_text = JSON.stringify(data);

      var updateProductRequest = {
        method: 'PUT',
        headers: texthead,
        body: raw_text
      };

      var uploadImagesRequest = {
        method: 'POST',
        header: imagehead,
        body: formdata
      }

      fetch("http://localhost:3000/products/update-product", updateProductRequest)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));

      //runs only if there are images
      if(images_number !== 0) {
        fetch("http://localhost:3000/products/upload-images-test", uploadImagesRequest)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
      }

      //resets all the textfields
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


delete_product_button.addEventListener("click", (event) => {
   event.preventDefault();
   var myHeaders = new Headers();
   myHeaders.append("Content-Type", "application/json");

   var data = {
     'id': id,
     'path': images
   }
   var raw = JSON.stringify(data);

   var requestOptions = {
     method: 'DELETE',
     headers: myHeaders,
     body: raw,
     redirect: 'follow'
   };

   fetch("http://localhost:3000/products/delete-product", requestOptions)
     .then(response => response.text())
     .then(result => console.log(result))
     .catch(error => console.log('error', error));

   location.href = "http://127.0.0.1:3000/public/admin/view_products.html";
});

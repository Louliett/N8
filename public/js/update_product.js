"use strict";

import { isItEmpty, createClassification } from './utils.js';

var product_id = decodeURIComponent(window.location.search).replace("?", "");
//buttons
var update_product_button = document.getElementById('update_product');
var subcategory_button = document.getElementById('subcategory_button');
var category_button = document.getElementById('category_button');
var section_button = document.getElementById('section_button');
//selectors
var product_subcategory_slc = document.getElementById('product_subcategory');
var product_category_slc = document.getElementById('product_category');
var product_section_slc = document.getElementById('product_section');
//default options for selectors
var default_subcategory;
var default_category;
var default_section;
//product textfields
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
//classification textfields
var subcategory_name_txt = document.getElementById('subcategory_name');
var category_name_txt = document.getElementById('category_name');
var section_name_txt = document.getElementById('section_name');
//images table
var image_table_head = document.getElementById('image_table_head');
var images_table_body = document.getElementById('images_table_body');
var image_titles = document.getElementById('image_titles');
var add_colour_row = document.getElementById('add_colour');
var upload_images_div = document.getElementById('upload_images_div');
//image input
var fileInput = document.getElementById('product_image');
var image_div = document.getElementById('image_div');
var images = [];
var colours_images = [];
var images_to_delete = [];
//error labels
var text_label = document.getElementById('text_error');
var class_label = document.getElementById('class_error');
var image_label = document.getElementById('image_error');
//error labels
var sub_err = document.getElementById('subcategory_err');
var cat_err = document.getElementById('category_err');
var sec_err = document.getElementById('section_err');
//create classifications
var create_sub = "create-subcategory";
var create_cat = "create-category";
var create_sec = "create-section";
var create_sub_img = "create-subcategory-image";
var create_cat_img = "create-category-image";
var create_sec_img = "create-section-image";
//file inputs
var sub_input = document.getElementById('subcategory_image');
var cat_input = document.getElementById('category_image');
var sec_input = document.getElementById('section_image');
// fileInput keys
const sub_key = "subImage";
const cat_key = "catImage";
const sec_key = "secImage";
//sql tables
var sub_table = "subcategory";
var cat_table = "category";
var sec_table = "section";
//arrays with classification from database
var sub_array = [];
var cat_array = [];
var sec_array = [];
//reusable variables
var key = "myImage";
var formdata;
var fileInput;
var colour;
var headers;

//populates all the drop down menus
populateSelectors(sub_table, sub_array, product_subcategory_slc);
populateSelectors(cat_table, cat_array, product_category_slc);
populateSelectors(sec_table, sec_array, product_section_slc);


window.addEventListener("load", () => {

  default_subcategory = document.getElementById('default_subcategory');
  default_category = document.getElementById('default_category');
  default_section = document.getElementById('default_section');

  //displays product info in text fields and selectors
  populateSelectorsFields();

  //displays the images of a product
  displayProductImages();

});


//create subcategory
subcategory_button.addEventListener("click", () => {
  createClassification(subcategory_name_txt, sub_array, create_sub, create_sub_img, sub_err, sub_input, sub_key, "#product_subcategory");
});
//create category
category_button.addEventListener("click", () => {
  createClassification(category_name_txt, cat_array, create_cat, create_cat_img, cat_err, cat_input, cat_key, "#product_category");
});
//create section
section_button.addEventListener("click", () => {
  createClassification(section_name_txt, sec_array, create_sec, create_sec_img, sec_err, sec_input, sec_key, "#product_section");
});





//add new colour and new images button (plus sign)
add_colour_row.addEventListener("click", () => {

  var table_count = upload_images_div.childElementCount;

  document.getElementById('new_colours_images').innerHTML += '<table class="images_table" id="images_table"><thead id="images_table_head_' + (table_count + 1) + '" data-table-head="' + (table_count + 1) + '"></thead></table>';

  var table = document.getElementById('images_table_head_' + (table_count + 1));
  var new_row = table.insertRow(0);
  var new_cell = new_row.insertCell(0);
  new_cell.innerHTML = "Colour";

  //add new input for colour name
  var row = table.insertRow(1);
  row.classList.add("new_colour");
  var cell1 = row.insertCell(0);
  cell1.innerHTML = '<input type="text">';

  //add new file input for image upload
  cell1 = row.insertCell(1);
  cell1.innerHTML = '<input type="file" name="myImage" class="new_image" id="product_image_q" multiple/>';


  $('#product_image_q').change(() => {
    newImagesNewColours();
  });

  $(add_colour_row).hide();
});

function createArraysOfStuff(data) {

  images = [];
  var temp_arr = [];
  var unique_col = [];
  var image_id = [];

  data.forEach((element, index, array) => {
    var url = element.url;
    images_to_delete.push([url]);
    temp_arr.push([url, element.colour, element.id]);
    if (!unique_col.includes(element.colour)) {
      unique_col.push(element.colour);
    }
  });

  for (var i = 0; i < unique_col.length; i++) {
    images.push([unique_col[i],
      []
    ]);
    for (var j = 0; j < temp_arr.length; j++) {
      if (unique_col[i] === temp_arr[j][1]) {
        images[i][1].push([temp_arr[j][0], temp_arr[j][2]]);
      }
    }
  }
  populateTables();
}


function populateTables() {
  var tempp = "";

  document.getElementById('images_container').innerHTML = "";

  for (var i = 0; i < images.length; i++) {

    document.getElementById('images_container').innerHTML += '<table class="images_table" id="images_table"><thead id="images_table_head_' + i + '" data-table-head="' + i + '"></thead></table>';

    var table = document.getElementById('images_table_head_' + i);
    var new_row = table.insertRow(0);
    var new_cell = new_row.insertCell(0);
    new_cell.innerHTML = "Colour";

    //add new file input
    var row = table.insertRow(1);
    row.classList.add('updated_colour');
    var cell1 = row.insertCell(0);
    cell1.innerHTML = '<input type="text" data-product-colour="' + images[i][0] + '" class="unique_colour" >';

    //Images
    var row_count = 1;
    for (var j = 0; j < images[i][1].length; j++) {
      var cell2 = row.insertCell(row_count);
      new_cell = new_row.insertCell(row_count);
      new_cell.innerHTML = 'Image ' + (j + 1);
      cell2.innerHTML = "<img src='" + images[i][1][j][0] + "' class='images_size' " + "data-image-id=" + images[i][1][j][1] + ">" + '<svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 20 20" width="30" class="delete_image_svg" data-image-id="' + images[i][1][j][1] + '" data-image-url="' + images[i][1][j][0] + '"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
      row_count++;
    }

    //add new image
    var cell3 = row.insertCell(row_count);
    cell3.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="48px" height="48px" class="add_image_svg" data-row-id= "' + row_count + '"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';

  }

  //add
  var unique_colours = document.getElementsByClassName('unique_colour');
  for (var q = 0; q < unique_colours.length; q++) {
    unique_colours[q].value = unique_colours[q].dataset.productColour;
    $(unique_colours[q]).change(() => {
      updateProductColours();
    });
  }

  //adds new image to old colour
  var plus_signs = document.querySelectorAll('.add_image_svg');
  for (var k = 0; k < plus_signs.length; k++) {
    plus_signs[k].addEventListener("click", () => {
      var row = event.target.parentNode.parentNode;
      var cell_lgth = row.cells.length - 1;

      var row_titles = row.previousSibling;
      var new_title = row_titles.insertCell(cell_lgth);
      new_title.innerHTML = "Add";

      var add_new_image = row.insertCell(cell_lgth);
      add_new_image.innerHTML = '<input type="file" name="myImage" class="updated_new_image" id="product_image_' + cell_lgth + '" multiple="">';
      var fileInput_id = '#product_image_' + cell_lgth;

      //calls the fetch on file input triggered
      $(fileInput_id).change(() => {
        newImagesOldColours(fileInput_id);
      });

      //hides the plus sign after click
      $(event.target).hide();
    });
  }

  //deletes the current image for a colour
  var delete_signs = document.querySelectorAll('.delete_image_svg');
  for (var l = 0; l < delete_signs.length; l++) {
    delete_signs[l].addEventListener("click", () => {
      var image_id = event.target.dataset.imageId;
      var url = event.target.dataset.imageUrl;
      deleteImages(image_id, url);
    });
  }
}


function deleteImages(image_id, url) {

  var data = {
    id: image_id,
    url: url
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

  fetch('http://192.168.0.107:3000/products/delete-images', requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);
      $('#images_table').load(document.URL + " #images_table", () => {
        displayProductImages();
      });
    }).catch(error => console.log('error', error));

}


update_product_button.addEventListener("click", () => {
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
  var product_subcategory = product_subcategory_slc.value;
  var product_category = product_category_slc.value;
  var product_section = product_section_slc.value;

  //check if the fields are empty
  var empty_fields = isItEmpty([product_name, product_price, product_new_price,
    product_ean, product_availability, product_quantity, product_brand, product_design,
    product_description, product_material, product_diameter, product_length,
    product_width, product_height, product_volume, product_weight, product_size
  ]);

  var data = {
    'id': product_id,
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


  if (empty_fields) {
    text_label.innerHTML = "Text fields are empty!";
  } else {
    updateProductText(data);
  }

});

function updateProductText(data) {

  headers = new Headers();
  headers.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: headers,
    body: raw
  };

  fetch("http://192.168.0.107:3000/products/update-product", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);
      location.reload(true);
    }).catch(error => console.log('error', error));
}

function updateProductColours() {

  headers = new Headers();
  var updated_colours = document.querySelectorAll('.updated_colour');
  var product_ids = [];
  var product_colours = [];
  var unique_col = [];

  for (var i = 0; i < updated_colours.length; i++) {
    colour = updated_colours[i].cells[0];
    colour = colour.childNodes[0].value;
    product_ids = [];

    for (var j = 1; j < updated_colours[i].cells.length - 1; j++) {
      product_ids.push(updated_colours[i].cells[j].childNodes[0].dataset.imageId);

    }
    unique_col.push([colour, product_ids]);
  }

  const data = {
    'colours': unique_col
  };

  headers.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: headers,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/products/update-colour", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);

      $('#images_table').load(document.URL + ' #images_table', () => {
        displayProductImages();
      });

    }).catch(error => console.log('error', error));

}


//function to add new images to existing colours
function newImagesOldColours(fileInput_id) {

  var updated_new_images = $('.updated_new_image')[0];
  formdata = new FormData();
  headers = new Headers();

  colour = updated_new_images.parentNode.parentNode.cells[0].childNodes[0].value;
  fileInput = updated_new_images;

  for (var j = 0; j < fileInput.files.length; j++) {
    formdata.append(key, fileInput.files[j], fileInput.value);
    formdata.append("colour", colour);
  }

  formdata.append("id", product_id);
  headers.append("Content-Type", "multipart/form-data");

  var requestOptions = {
    method: 'POST',
    header: headers,
    body: formdata
  };

  fetch("http://192.168.0.107:3000/products/upload-images", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);

      $('#images_table').load(document.URL + ' #images_table', () => {
        displayProductImages();
      });

    }).catch(error => console.log('error', error));

}

//function to upload new images and new colours
function newImagesNewColours() {

  headers = new Headers();
  formdata = new FormData();
  var new_colours = $('.new_colour')[0];

  colour = new_colours.cells[0];
  colour = colour.childNodes[0].value;
  fileInput = new_colours.cells[1];
  fileInput = fileInput.childNodes[0];

  for (var j = 0; j < fileInput.files.length; j++) {
    formdata.append(key, fileInput.files[j], fileInput.value);
    formdata.append("colour", colour);
  }

  formdata.append("id", product_id);
  headers.append("Content-Type", "multipart/form-data");

  var requestOptions = {
    method: 'POST',
    header: headers,
    body: formdata
  };

  fetch("http://192.168.0.107:3000/products/upload-images", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log(result);

      $('#images_table').load(document.URL + ' #images_table', () => {
        document.getElementById('new_colours_images').innerHTML = "";
        displayProductImages();
        $(add_colour_row).show();
      });

    }).catch(error => console.log('error', error));

}

//function to populate the selectors with existing classifications from DB
function populateSelectors(table, array, selector) {

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

      for (var j = 0; j < array.length; j++) {
        var opt = array[j];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        selector.appendChild(el);
      }
    }).catch(error => console.error(error));
}

//function to load product images and colours from DB
function displayProductImages() {

  headers = new Headers();

  var data = {
    id: product_id
  };

  var raw = JSON.stringify(data);

  headers.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://192.168.0.107:3000/products/product-images-id', requestOptions)
    .then(response => response.json())
    .then(data => {
      createArraysOfStuff(data);
    }).catch(error => console.error(error));
}

//function to load product info from DB into text fields and dropdowns
function populateSelectorsFields() {

  headers = new Headers();

  var data = {
    id: product_id
  };

  var raw = JSON.stringify(data);

  headers.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: headers,
    body: raw,
    redirect: 'follow'
  };

  //populates the textfields and selectors with appropriate product info
  fetch('http://192.168.0.107:3000/products/product-classifications-id', requestOptions)
    .then(response => response.json())
    .then(data => {
      product_name_txt.value = data[0].name;
      product_price_txt.value = data[0].price;
      product_new_price_txt.value = data[0].new_price;
      product_ean_txt.value = data[0].ean;
      product_availability_txt.value = data[0].availability;
      product_quantity_txt.value = data[0].quantity;
      product_brand_txt.value = data[0].brand;
      product_design_txt.value = data[0].design;
      product_description_txt.value = data[0].description;
      product_material_txt.value = data[0].material;
      product_diameter_txt.value = data[0].diameter;
      product_length_txt.value = data[0].length;
      product_width_txt.value = data[0].width;
      product_height_txt.value = data[0].height;
      product_volume_txt.value = data[0].volume;
      product_weight_txt.value = data[0].weight;
      default_subcategory.textContent = data[0].subcategory;
      default_category.textContent = data[0].category;
      default_section.textContent = data[0].section;
    }).catch(error => console.error(error));
}

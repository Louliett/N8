"use strict"

import {
  isItEmpty
} from './utils.js';

var product_id = decodeURIComponent(window.location.search).replace("?", "");
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
var product_diameter_txt = document.getElementById('product_diameter');
var product_length_txt = document.getElementById('product_length');
var product_width_txt = document.getElementById('product_width');
var product_height_txt = document.getElementById('product_height');
var product_volume_txt = document.getElementById('product_volume');
var product_weight_txt = document.getElementById('product_weight');
var product_size_txt = document.getElementById('product_size');
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
//sql tables
var sub_table = "subcategory";
var cat_table = "category";
var sec_table = "section";
//arrays with data from database
var sub_array = [];
var cat_array = [];
var sec_array = [];

var formdata = new FormData();


//populates all the drop down menus
populateSelectors(sub_table, sub_array, product_subcategory_slc);
populateSelectors(cat_table, cat_array, product_category_slc);
populateSelectors(sec_table, sec_array, product_section_slc);

//add new colour
add_colour_row.addEventListener("click", () => {

  var table_count = upload_images_div.childElementCount;


  var table_div = document.createElement('div');
  table_div.innerHTML = '<table class="images_table"id="images_table"><thead id="images_table_head_' + (table_count + 1) + '" data-table-head="' + (table_count + 1) + '"></thead></table>';
  document.getElementById('upload_images_div').appendChild(table_div);

  var table = document.getElementById('images_table_head_' + (table_count + 1));
  var new_row = table.insertRow(0);
  var new_cell = new_row.insertCell(0);
  new_cell.innerHTML = "Colour";

  //colour
  var row = table.insertRow(1);
  row.classList.add("new_colour");
  var cell1 = row.insertCell(0);
  cell1.innerHTML = '<input type="text" id="product_colour_1">';



  //add new image
  cell1 = row.insertCell(1);
  cell1.innerHTML = '<input type="file" name="myImage" class="new_image" id="product_image_1" multiple/>';

});


window.addEventListener("load", () => {

  var default_subcategory = document.getElementById('default_subcategory');
  var default_category = document.getElementById('default_category');
  var default_section = document.getElementById('default_section');

  const data = {
    id: product_id
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

  //populates the textfields and selectors with appropriate product info
  fetch('http://192.168.0.105:3000/products/product-classifications-id', requestOptions)
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

  //displays the images of a product
  fetch('http://192.168.0.105:3000/products/product-images-id', requestOptions)
    .then(response => response.json())
    .then(data => {
      createArraysOfStuff(data);
    }).catch(error => console.error(error));



});

function createArraysOfStuff(data) {
  var temp_arr = [];
  var unique_col = [];
  var image_id = [];

  data.forEach((element, index, array) => {
    var path = element.path;
    images_to_delete.push([path + element.name]);
    path = path.replace(".", "");
    temp_arr.push([path + element.name, element.colour, element.id]);
    if (!unique_col.includes(element.colour)) {
      unique_col.push(element.colour);
    }
  });

  //console.log(unique_col, "before");

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

  //console.log(images, "imgs");
  populateTables();
}


function populateTables() {
  var tempp = "";
  var table_div;

  for (var i = 0; i < images.length; i++) {

    table_div = document.createElement('div');
    table_div.innerHTML = '<table class="images_table"id="images_table"><thead id="images_table_head_' + i + '" data-table-head="' + i + '"></thead></table>';
    document.getElementById('upload_images_div').appendChild(table_div);

    var table = document.getElementById('images_table_head_' + i);
    var new_row = table.insertRow(0);
    var new_cell = new_row.insertCell(0);
    new_cell.innerHTML = "Colour";

    //colour
    var row = table.insertRow(1);
    row.classList.add('updated_colour');
    var cell1 = row.insertCell(0);
    cell1.innerHTML = '<input type="text" id="product_colour_' + i + '" >';
    var product_colour_txt = document.getElementById('product_colour_' + i);
    product_colour_txt.value = images[i][0];
    product_colour_txt.addEventListener("input", () => {

    });


    //Images
    var row_count = 1;
    for (var j = 0; j < images[i][1].length; j++) {
      var cell2 = row.insertCell(row_count);
      new_cell = new_row.insertCell(row_count);
      new_cell.innerHTML = 'Image ' + (j + 1);
      cell2.innerHTML = "<img src='" + images[i][1][j][0] + "' class='images_size' " + "data-image-id=" + images[i][1][j][1] + ">" + '<svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 20 20" width="30" class="delete_image" data-image-id="' + images[i][1][j][1] + '" data-image-path="' + images[i][1][j][0] + '"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
      row_count++;
    }

    //add new image

    var cell3 = row.insertCell(row_count);
    cell3.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="48px" height="48px" id="add_image" data-row-id= "' + row_count + '"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';


  }

  var plus_signs = document.querySelectorAll('#add_image');
  for (var k = 0; k < plus_signs.length; k++) {
    plus_signs[k].addEventListener("click", () => {
      var row = event.target.parentNode.parentNode;
      var cell_lgth = row.cells.length - 1;

      var row_titles = row.previousSibling;
      var new_title = row_titles.insertCell(cell_lgth);
      new_title.innerHTML = "Add";

      var add_new_image = row.insertCell(cell_lgth);
      add_new_image.innerHTML = '<input type="file" name="myImage" class="updated_new_image" id="product_image_' + cell_lgth + '" multiple="">';
    });
  }

  var delete_signs = document.querySelectorAll('.delete_image');
  //console.log(delete_signs, "delete signs");
  for (var l = 0; l < delete_signs.length; l++) {
    delete_signs[l].addEventListener("click", () => {
      var image_id = event.target.dataset.imageId;
      var image_path = event.target.dataset.imagePath;
      console.log(image_id, image_path, "img, path");
      deleteImages(image_id, image_path);
    });
  }



}


function deleteImages(image_id, path) {

  const data = {
    id: image_id,
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

  fetch('http://192.168.0.105:3000/products/delete-images', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

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

  const data = {
    'id': product_id,
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


  if(empty_fields === true) {
    console.log("All fields are empty!!!");
  } else {

      //updates the text
      updateProduct(data);
      // //updates the colour for existing images
      // updateColours();
      // //uploads new images for existing colours
      // updatedNewImages();
      // //upload new images for new colours
      // uploadImages();
      // //clean fields
      // cleanFields();

  }

  //location.reload(true);
});

function updateProduct(data) {
  var texthead = new Headers();
  texthead.append("Content-Type", "application/json");
  var raw_text = JSON.stringify(data);
  var updateProductRequest = {
    method: 'PUT',
    headers: texthead,
    body: raw_text
  };
  fetch("http://192.168.0.105:3000/products/update-product", updateProductRequest)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
    updateColours();
}

function updateColours() {
  var updated_colours = document.querySelectorAll('.updated_colour');
  var colour;
  var product_ids = [];
  var product_colours = [];
  var unique_col = [];

  console.log(updated_colours, "updated");

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

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/products/update-colour", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  updatedNewImages();
}

function updatedNewImages() {

  //var image_colour = [];
  var updated_new_images = document.querySelectorAll('.updated_new_image');


  if (updated_new_images.length !== 0) {
    var colour;
    var file;
    var key = "myImage";

    for (var i = 0; i < updated_new_images.length; i++) {
      colour = updated_new_images[i].parentNode.parentNode.cells[0].childNodes[0].value;
      file = updated_new_images[i];

      for (var j = 0; j < file.files.length; j++) {
        formdata.append(key, file.files[j], file.value);
        formdata.append("colour", colour);
      }
    }
    formdata.append("id", product_id);

    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }


    var imagehead = new Headers();
    imagehead.append("Content-Type", "multipart/form-data");
    var uploadImagesRequest = {
      method: 'POST',
      header: imagehead,
      body: formdata
    };
    fetch("http://192.168.0.105:3000/products/upload-images", uploadImagesRequest)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  }
  uploadImages();
}

function uploadImages() {

  var new_colours = document.querySelectorAll('.new_colour');

  //if there are no new colours don't run
  if(new_colours.length !== 0) {

    var colour;
    var file;
    var key = "myImage";

    for (var i = 0; i < new_colours.length; i++) {
      colour = new_colours[i].cells[0];
      colour = colour.childNodes[0].value;
      file = new_colours[i].cells[1];
      file = file.childNodes[0];

      for (var j = 0; j < file.files.length; j++) {
        formdata.append(key, file.files[j], file.value);
        formdata.append("colour", colour);
      }
    }

    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    var imagehead = new Headers();
    imagehead.append("Content-Type", "multipart/form-data");
    var uploadImagesRequest = {
      method: 'POST',
      header: imagehead,
      body: formdata
    };
    fetch("http://192.168.0.105:3000/products/upload-images", uploadImagesRequest)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  }

}


delete_product_button.addEventListener("click", () => {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var data = {
    'id': product_id,
    'path': images_to_delete
  };

  //console.log(images_to_delete);
  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.105:3000/products/delete-product", requestOptions)
    .then(response => response.text())
    .then((result) => {
      location.href = "/public/admin/view_products.html";
    })
    .catch(error => console.log('error', error));


});

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

function cleanFields() {
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

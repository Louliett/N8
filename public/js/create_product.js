"use strict";


import {
  isItEmpty,
  isItEmptyStrict
} from './utils.js';

//textfields
var product_name_txt = document.getElementById('product_name');
var product_price_txt = document.getElementById('product_price');
var product_sku_txt = document.getElementById('product_sku');
var product_availability_txt = document.getElementById('product_availability');
var product_quantity_txt = document.getElementById('product_quantity');
var product_brand_txt = document.getElementById('product_brand');
var product_design_txt = document.getElementById('product_design');
var product_tag_txt = document.getElementById('product_tag');
var product_description_txt = document.getElementById('product_description');
var product_material_txt = document.getElementById('product_material');
var product_diameter_txt = document.getElementById('product_diameter');
var product_length_txt = document.getElementById('product_length');
var product_width_txt = document.getElementById('product_width');
var product_height_txt = document.getElementById('product_height');
var product_volume_txt = document.getElementById('product_volume');
var product_weight_txt = document.getElementById('product_weight');
var product_size_txt = document.getElementById('product_size');
var subcategory_name_txt = document.getElementById('subcategory_name');
var category_name_txt = document.getElementById('category_name');
var section_name_txt = document.getElementById('section_name');
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
var subcategory_button = document.getElementById('subcategory_button');
var category_button = document.getElementById('category_button');
var section_button = document.getElementById('section_button');
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
//arrays with data from database
var sub_array = [];
var cat_array = [];
var sec_array = [];

//reusable variables
var key = "myImage";
var formdata;
var headers;
var fileInput;
var product_colour_txt;

var notifier = $('.notifier');
notifier.click(function () {

  notifier.css('display', 'none');
  $('#main').removeClass('noscroll');


});



//fetches the classifications from DB into selectors
fetchClassifications(sub_slc, cat_slc, sec_slc, null);

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
  formdata = new FormData();
  headers = new Headers();


  //initializing
  var product_name = product_name_txt.value;
  var product_price = product_price_txt.value;
  var product_sku = product_sku_txt.value;
  var product_availability = product_availability_txt.value;
  var product_quantity = product_quantity_txt.value;
  var product_brand = product_brand_txt.value;
  var product_design = product_design_txt.value;
  var product_tag = product_tag_txt.value;
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
  var empty_fields = isItEmpty([product_name, product_price,
    product_sku, product_availability, product_quantity, product_brand, product_design,
    product_tag, product_description, product_material, product_diameter, product_length,
    product_width, product_height, product_volume, product_weight, product_size
  ]);
  //check if the classifications are strictly not empty
  var empty_classifications = isItEmptyStrict([product_subcategory, product_category, product_section]);

  var special_fields = isItEmptyStrict([product_name, product_price, product_brand, product_sku, product_description]);

  formdata.append("name", product_name);
  formdata.append("price", product_price);
  formdata.append("sku", product_sku);
  formdata.append("availability", product_availability);
  formdata.append("quantity", product_quantity);
  formdata.append("brand", product_brand);
  formdata.append("design", product_design);
  formdata.append("tag", product_tag);
  formdata.append("description", product_description);
  formdata.append("material", product_material);
  formdata.append("diameter", product_diameter);
  formdata.append("length", product_length);
  formdata.append("width", product_width);
  formdata.append("height", product_height);
  formdata.append("volume", product_volume);
  formdata.append("weight", product_weight);
  formdata.append("size", product_size);
  formdata.append("subcategory", product_subcategory);
  formdata.append("category", product_category);
  formdata.append("section", product_section);

  var body = images_table_body.rows.length;

  for (var i = 1; i <= body; i++) {
    fileInput = document.getElementById('product_image_' + i);
    product_colour_txt = document.getElementById('product_colour_' + i);

    for (var j = 0; j < fileInput.files.length; j++) {
      formdata.append(key, fileInput.files[j], fileInput.value);
      formdata.append("colour", product_colour_txt.value);
    }
  }
  
  for (var pair of formdata.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }


  if (empty_fields === true) {
    text_error_txt.innerHTML = "Fields are empty!";
  } else if (special_fields === true) {
    text_error_txt.innerHTML = "Name, Price, Brand or Description missing!";
  } else if (empty_classifications === true) {
    class_error_txt.innerHTML = "Please select classifications!";
  } else {

    headers.append("Content-Type", "multipart/form-data");

    var uploadImagesRequest = {
      method: 'POST',
      header: headers,
      body: formdata
    };

    fetch("http://192.168.0.108:3000/products/create-product", uploadImagesRequest)
      .then(response => response.text())
      .then((result) => {
        notifier.css('display', 'inline');
        $('#main').addClass('noscroll');
      }).catch(error => console.log('error', error));

  }

});

export function fetchClassifications(sub_slc, cat_slc, sec_slc) {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch("http://192.168.0.108:3000/classifications/", requestOptions)
    .then(response => response.json())
    .then((result) => {

      //we pass classifications to arrays to check if it already exists on create classification
      sub_array = result[0].map(x => x.subcategory);
      cat_array = (result[1]).map(x => x.category);
      sec_array = (result[2]).map(x => x.section);
      //the fetch returns array of 3 objects
      //we pass each array to a function to populate a specific selector
      populateSelector(result[0], sub_slc);
      populateSelector(result[1], cat_slc);
      populateSelector(result[2], sec_slc);

    }).catch(error => console.log('error', error));

}

function populateSelector(array, selector, option_value, default_option) {
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

function createClassification(txtarea, array, create_class, create_class_img, error_label, fileInput, key, selector_id) {
  //array for checking up on empty fields
  let fields = [];
  var image_name;
  var image_path;
  var flag;
  var headers;
  var formdata;
  const image = "/public/class_images/default.png";

  var class_name = txtarea.value;
  fields.push(class_name);


  if (isItEmpty(fields) == true) {
    error_label.innerHTML = "Field is empty!";
    txtarea.value = "";
  } else if (txtarea.value.includes(',')) {
    error_label.innerHTML = "Classification can not contain commas!";
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

        fetch("http://192.168.0.108:3000/classifications/" + create_class, requestOptions1)
          .then(response => response.text())
          .then(result => {
            console.log(result);

            $(selector_id).html = "";
            //to be changed, the drop down menu!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11
            $('#tity').load(document.URL + ' ' + '#tity', () => {
              // $('#product_subcategory').html('')
              // $('#product_category').html('')
              // $('#product_section').html('')
              fetchClassifications($('#product_subcategory')[0], $('#product_category')[0], $('#product_section')[0]);
              txtarea.value = "";
            });

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

        fetch("http://192.168.0.108:3000/classifications/" + create_class_img, requestOptions2)
          .then(response => response.text())
          .then(result => {
            error_label.innerHTML = result;

            $(selector_id).load(document.URL + ' ' + selector_id, () => {
              //  $('#product_subcategory').html('')
              // $('#product_category').html('')
              // $('#product_section').html('')
              fetchClassifications($('#product_subcategory')[0], $('#product_category')[0], $('#product_section')[0], class_name);
              //$(default_option).val(class_name);
              txtarea.value = "";
            });

          }).catch(error => console.log('error', error));
      }

    }
  }


}



function doesItMatch(name, name_arr) {
  for (var i = 0; i < name_arr.length; i++) {
    if (name === name_arr[i]) {
      return true;
    }
  }
  return false;
}
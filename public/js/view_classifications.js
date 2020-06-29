"use strict";


//default image
const default_image = "/public/class_images/default.png";
//html tables
var sub_table = document.getElementById('subcategory_table');
var cat_table = document.getElementById('category_table');
var sec_table = document.getElementById('section_table');
//sql tables
var sub = "subcategory";
var cat = "category";
var sec = "section";
//button class_images
var upd_sub = "update_sub_btn";
var upd_cat = "update_cat_btn";
var upd_sec = "update_sec_btn";
//update classification and image urls
var upd_sub_img = "update-subcategory-image";
var upd_cat_img = "update-category-image";
var upd_sec_img = "update-section-image";
// fileInput keys
const sub_key = "subImage";
const cat_key = "catImage";
const sec_key = "secImage";
//
var del_sub = "delete_sub_btn";
var del_cat = "delete_cat_btn";
var del_sec = "delete_sec_btn";
//
var del_sub_img = "delete_sub_img";
var del_cat_img = "delete_cat_img";
var del_sec_img = "delete_sec_img";

var counter = 0;
//reusable variables
var myHeaders;


populateTable(sub, sub_table, upd_sub, del_sub, del_sub_img, upd_sub_img, sub_key);
populateTable(cat, cat_table, upd_cat, del_cat, del_cat_img, upd_cat_img, cat_key);
populateTable(sec, sec_table, upd_sec, del_sec, del_sec_img, upd_sec_img, sec_key);


$("#popup_message").load("/public/admin/popup_message.html", () => {});

function populateTable(url, table, update_class, delete_class, delete_image, update_class_image, class_key) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  fetch('http://192.168.0.108:3000/classifications/' + url, requestOptions)
    .then(response => response.json())
    .then(data => {

      if (data.length > 0) {
        var tempp = "";
        var class_id;
        var image;

        data.forEach((u) => {
          tempp += "<tr>";
          tempp += "<td>" + "<input type='text' value='" + u.name + "'></input></td>";
          tempp += "<td id= " + u.id + "><img src= '" + u.image + "' style='width:100px;height:60px;'></img>" + "<button type='button' class= '" + delete_image + "' data-image= '" + u.image + "' data-class-id= '" + u.id + "'> Delete </button>" + "</td>";
          tempp += "<td>" + "<button type='button' class= " + update_class + " data-class-id= " + u.id + "> Update </button>" + "</td>";
          tempp += "<td>" + "<button type='button' class= " + delete_class + " data-class-id= '" + u.id + "' data-url='" + url + "' data-image= '" + u.image + "'> Delete </button>" + "</td>";
          tempp += "<tr>";
        });
        table.innerHTML = tempp;

        //if(counter == 2) {
        var upd_class_btn = document.getElementsByClassName(update_class);
        var del_class_btn = document.getElementsByClassName(delete_class);
        var del_img_btn = document.getElementsByClassName(delete_image);

        for (var i = 0; i < upd_class_btn.length; i++) {
          upd_class_btn[i].addEventListener("click", () => {
            var button_event = event.target;
            class_id = event.target.dataset.classId;
            updateClass(class_id, button_event, url, update_class_image, class_key);
          });
        }

        for (var j = 0; j < del_class_btn.length; j++) {
          del_class_btn[j].addEventListener("click", () => {
            var url = event.target.dataset.url;
            class_id = event.target.dataset.classId;
            image = event.target.dataset.image;
            deleteClass(class_id, url, image);
          });
        }

        for (var k = 0; k < del_img_btn.length; k++) {
          del_img_btn[k].addEventListener("click", () => {
            class_id = event.target.dataset.classId;
            var cell = event.target.parentNode;
            image = event.target.dataset.image;

            deleteImage(image, class_id, url);
            cell.innerHTML = '<input type="file" id="class_image"/>';
          });
        }
      }
      //}
      //counter ++;
    }).catch(error => console.error(error));

}


function updateClass(id, button_event, url, img_url, key) {
  var fileInput = button_event.parentNode.previousSibling.firstChild;
  var class_name = button_event.parentNode.previousSibling.previousSibling.firstChild;

  //if on button click there is no image, upload an image
  if (fileInput.tagName === "INPUT") {
    var image_name = fileInput.files[0];
    var image_path = fileInput.value;

    //if the file input is empty, upload name + default img, else upload the image as well
    if ((image_name === undefined && image_path.length === 0) || (image_name === undefined || image_path.length === 0)) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const data = {
        'id': id,
        'name': class_name.value,
        'image': default_image
      };
      var raw = JSON.stringify(data);

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://192.168.0.108:3000/classifications/" + img_url, requestOptions)
        .then(response => response.text())
        .then((result) => {
          class_name.value = result;
        }).catch(error => console.log('error', error));
    } else {
      var formdata = new FormData();
      formdata.append("id", id);
      formdata.append("name", class_name.value);
      formdata.append(key, image_name, image_path);

      var requestOptions = {
        method: 'PUT',
        body: formdata,
        redirect: 'follow'
      };

      fetch("http://192.168.0.108:3000/classifications/" + img_url, requestOptions)
        .then(response => response.text())
        .then(result => {
          location.reload(true);
        }).catch(error => console.log('error', error));
    }


  } else {
    //if on button click there is already an image, uplaod just the name

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = {
      'id': id,
      'name': class_name.value
    };
    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://192.168.0.108:3000/classifications/update-" + url, requestOptions)
      .then(response => response.text())
      .then((result) => {
        class_name.value = result;
      }).catch(error => console.log('error', error));
   }

}


function deleteClass(id, url, image) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const data = {
    'id': id,
    'image': image
  };
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.108:3000/classifications/delete-" + url, requestOptions)
    .then(response => response.json())
    .then((result) => {
      //console.log(result);
      if (result.errno === 1451) {
        var popup_modal_div = document.getElementById("popup_modal_div");
        var ok_button = document.getElementById("ok_button");
        popup_modal_div.style.display = "block";
        ok_button.addEventListener("click", () => {
          popup_modal_div.style.display = "none";
        });
      } else {
        location.reload(true);
      }
    }).catch(error => console.log('error', error));
}

function deleteImage(image, id, url) {

  if (image.length !== 0 && image !== "null") {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const data = {
      "id": id,
      "image": image
    };
    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://192.168.0.108:3000/classifications/delete-" + url + "-image", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
}

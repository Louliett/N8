"use strict"


var key = decodeURIComponent(window.location.search).replace("?", "");
var classification_name_txt = document.getElementById('classification_name');
var delete_classification_button = document.getElementById('delete_classification');
var update_classification_button = document.getElementById('update_classification');
key = key.split("&");
var name;
var id = key[0];
var table = key[1];
//get classifications based on id
var subcategoryID = "subcategory-id";
var categoryID = "category-id";
var sectionID = "section-id";
//update classifications
var upd_subcategory = "update-subcategory";
var upd_category = "update-category";
var upd_section = "update-section";
//delete classifications
var del_subcategory = "delete-subcategory";
var del_category = "delete-category";
var del_section = "delete-section";


//loading according text in the text area
if(table === "subcategory_table") {
  fetchClass(subcategoryID, id);
} else if(table === "category_table") {
  fetchClass(categoryID, id);
} else if(table === "section_table") {
  fetchClass(sectionID, id);
}


update_classification_button.addEventListener("click", () => {
  name = classification_name_txt.value;
  console.log(name);
  console.log(table);
  if(table === "subcategory_table") {
    updateClass(upd_subcategory, id, name);
  } else if(table === "category_table") {
    updateClass(upd_category, id, name);
  } else if(table === "section_table") {
    updateClass(upd_section, id, name);
  }
});


delete_classification_button.addEventListener("click", () => {
  if(table === "subcategory_table") {
    deleteClass(del_subcategory, id);
  } else if(table === "category_table") {
    deleteClass(del_category, id);
  } else if(table === "section_table") {
    deleteClass(del_section, id);
  }
});


function fetchClass(classification, id) {
  const data = {
    'id': id
  };
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  fetch('http://192.168.0.105:3000/classifications/' + classification, requestOptions)
    .then(response => response.json())
    .then(data => {
    classification_name_txt.value = data[0].name;
  }).catch(error => console.error(error));
}

function updateClass(classification, id, name) {
  const data = {
    'id': id,
    'name': name
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  fetch("http://192.168.0.105:3000/classifications/" + classification, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  classification_name_txt.value = "";
  location.href = "/public/admin/view_classifications.html";
}

function deleteClass(classification, id) {
  const data = {
    'id': id
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  console.log(requestOptions);
  fetch("http://192.168.0.105:3000/classifications/" + classification, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  location.href = "/public/admin/view_classifications.html";
}

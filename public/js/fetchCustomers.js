"use strict"

var myData;
var get_customers_button = document.getElementById('get_customers');
var get_name_by_id_button = document.getElementById('get_name_by_id');
var create_new_user_button = document.getElementById('create_user');
var change_name_by_id_button = document.getElementById('change_name_by_id');
var delete_user_by_id_button = document.getElementById('delete_name_by_id');


get_customers_button.addEventListener("click", function() {
  fetch('http://192.168.0.108:3000/api/customers')
    .then(response => response.json())
    .then(data => {
      myData = data;

      if (myData.length > 0) {
        var tempp = "";

        myData.forEach((u) => {
          tempp += "<tr>"
          tempp += "<td>" + u.id + "</td>";
          tempp += "<td>" + u.name + "</td>";
          tempp += "<tr>"
        });
        document.getElementById('customers_table').innerHTML = tempp;

      }

    }).catch(error =>
      console.error(error));
});


get_name_by_id_button.addEventListener("click", function() {
  var get_name_by_id_output = document.getElementById('name_by_id');
  var textField = document.getElementById('id');
  var id_value = textField.value;

  if (id_value == "") {
    console.log("Empty field!!");
  } else {
    fetch('http://192.168.0.108:3000/api/customers/' + id_value)
      .then(response => response.json())
      .then(data => {
        console.log("my id= " + id_value);
        var json_array = JSON.stringify(data);
        console.log(json_array);

        var json_data = JSON.parse(json_array);
        var object = json_data[0];

        if (object === undefined) {
          get_name_by_id_output.value = "no customer under such id!";
        } else {
          get_name_by_id_output.value = object.name;
        }



        textField.value = "";
      }).catch(error =>
        console.error(error));
  }

});


create_new_user_button.addEventListener("click", function() {
  var output = document.getElementById('output');
  var textField = document.getElementById('new_user');
  var new_user = textField.value;


  const data = {
    'name': new_user
  };
  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };


  fetch('http://192.168.0.108:3000/api/customers/', options)
    .then(response => response.json())
    .then(data => {

      var json_array = JSON.stringify(data);
      var json_data = JSON.parse(json_array);

      output.value = json_data.name + " was created!";

      textField.value = "";
    }).catch(error =>
      console.error(error));

});


change_name_by_id_button.addEventListener("click", function() {

  var id_text = document.getElementById('id_change');
  var name_text = document.getElementById('name_change');

  var the_id = id_text.value;
  var the_name = name_text.value;

  const data = {
    name: the_name,
    id: the_id
  };

  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch('http://192.168.0.108:3000/api/customers/', options);
  id_text.value = "";
  name_text.value = "";

});


delete_user_by_id_button.addEventListener("click", function() {
  var textField = document.getElementById('id_delete');
  var output = document.getElementById('delete_output');
  var id_value = textField.value;

  if (id_value == "") {
    console.log("Empty field!!");
  } else {

    const data = {
      id: id_value
    };

    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };

    fetch('http://192.168.0.108:3000/api/customers/', options)
      .then(response => response.json())
      .then(data => {

        var json_array = JSON.stringify(data);
        var json_data = JSON.parse(json_array);

        console.log(json_data.affectedRows);



        if (json_data.affectedRows == 0) {
          output.value = "no customer under such id!";
        } else {
          output.value = "was deleted";
        }

        textField.value = "";
        //output.value = "";
      }).catch(error =>
        console.error(error));

  }


});

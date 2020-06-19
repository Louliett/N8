//"use strict"

var customers_table = document.getElementById('customers_table');
var addresses_table = document.getElementById('addresses_table');

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("http://192.168.0.107:3000/users/get-customers", requestOptions)
  .then(response => response.json())
  .then(data => {
    if (data.length > 0) {
      var tempp = "";
      var customer_id;

      data.forEach((u) => {
        tempp += "<tr>";
        tempp += "<td>" + u.first_name + "</td>";
        tempp += "<td>" + u.last_name + "</td>";
        tempp += "<td data-customer-id= " + u.id + ">" + u.email + "</td>";
        tempp += "<td>" + "<button type='button' class='addr_table_button' data-customer-id= " + u.id + "> View </button>" + "</td>";
        tempp += "<td>" + "<button type='button' class='del_table_button' data-customer-id= " + u.id + "> Delete </button>" + "</td>";
        tempp += "</tr>";
      });
      customers_table.innerHTML = tempp;

      var view_addresses_btn = document.getElementsByClassName("addr_table_button");
      var delete_user_btn = document.getElementsByClassName("del_table_button");

      //view user addresses button
      for (var i = 0; i < view_addresses_btn.length; i++) {
        view_addresses_btn[i].addEventListener("click", () => {
          customer_id = event.target.dataset.customerId;
          displayAdresses(customer_id);
        });
      }

      //delete customer button
      for (var j = 0; j < delete_user_btn.length; j++) {
        delete_user_btn[j].addEventListener("click", () => {
          customer_id = event.target.dataset.customerId;
          console.log(customer_id);
          deleteCustomer(customer_id);
        });
      }


    }
  }).catch(error => console.log('error', error));


function displayAdresses(id) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': id
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/addresses/customer-address-id", requestOptions)
    .then(response => response.json())
    .then((data) => {
      if (data.length > 0) {
        var tempp = "";

        data.forEach((u) => {
          tempp += "<tr>";
          tempp += "<td>" + u.phone_number + "</td>";
          tempp += "<td>" + u.name + "</td>";
          tempp += "<td>" + u.second_name + "</td>";
          tempp += "<td>" + u.city + "</td>";
          tempp += "<td>" + u.postcode + "</td>";
          tempp += "</tr>";
        });
        addresses_table.innerHTML = tempp;
      }

    }).catch(error => console.log('error', error));
}


function deleteCustomer(id) {
  console.log("method got: ", id);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': id
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'DELETE',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/users/delete-customer", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);
      location.reload();
    }).catch(error => console.log('error', error));
}

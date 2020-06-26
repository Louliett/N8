"use strict"

var admins_table = document.getElementById('admins_table');

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch("http://192.168.0.108:3000/users/get-admins", requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if(data.length > 0) {
        var tempp = "";
        var customer_id;

        data.forEach((u) => {
            tempp += "<tr class = 'admin_row'>"
            tempp += "<td>" + u.first_name + "</td>";
            tempp += "<td>" + u.last_name + "</td>";
            tempp += "<td data-admin-id= " + u.id + ">" + u.email + "</td>";
            tempp += "<td>" + "<button type='button' class='del_table_button' data-admin-id= " + u.id + "> Delete </button>" + "</td>";
            tempp += "<tr>"
        });
        admins_table.innerHTML = tempp;

        var delete_admin_btn = document.getElementsByClassName("del_table_button");

        //delete user button
        for (var i = 0; i < delete_admin_btn.length; i++) {
          delete_admin_btn[i].addEventListener("click", () => {
            customer_id = event.target.dataset.adminId;
            console.log(customer_id);
            deleteAdmin(customer_id);
          });
        }
    }
  }).catch(error => console.log('error', error));




function deleteAdmin(id) {

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

    fetch("http://192.168.0.108:3000/users/delete-admin", requestOptions)
      .then(response => response.text())
      .then((result) => {
        console.log(result);
        location.reload();
      }).catch(error => console.log('error', error));
}

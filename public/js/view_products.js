"use strict"

var myData;

fetch('http://localhost:3000/n8_api/get-products')
  .then(response => response.json())
  .then(data => {

    myData = data;

      if(myData.length > 0) {
          var tempp = "";

          myData.forEach((u) => {
              tempp += "<tr>"
              tempp += "<td>" + u.name + "</td>";
              tempp += "<td>" + u.price + "</td>";
              tempp += "<td>" + u.new_price + "</td>";
              tempp += "<td>" + u.ean + "</td>";
              tempp += "<td>" + u.quantity + "</td>";
              tempp += "<td>" + u.brand + "</td>";
              tempp += "<td>" + u.design + "</td>";
              tempp += "<td>" + u.description + "</td>";
              tempp += "<td>" + u.material + "</td>";
              tempp += "<td>" + u.colour + "</td>";
              tempp += "<td>" + u.length + "</td>";
              tempp += "<td>" + u.width + "</td>";
              tempp += "<td>" + u.height + "</td>";
              tempp += "<td>" + u.volume + "</td>";
              tempp += "<td>" + u.weight + "</td>";
              tempp += "<td>" + u.subcategory + "</td>";
              tempp += "<td>" + u.category + "</td>";
              tempp += "<td>" + u.section + "</td>";
              tempp += "<tr>"
          });
          document.getElementById('product_table').innerHTML = tempp;

      }

  }).catch(error =>
    console.error(error));

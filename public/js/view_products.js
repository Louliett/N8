"use strict"

var button = document.getElementById('test');
var letters = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
letters = letters.split(",");
var container;

for (var i = 0; i < letters.length; i++) {
  container = document.createElement("a");
  container.setAttribute("id", letters[i]);
  container.setAttribute("href", "");
  container.setAttribute("style", "padding: 0px 3px")
  container.setAttribute("onclick", "return false;");
  container.innerHTML = letters[i];
  container.addEventListener("click", () => {
    var letter = event.target.innerHTML;
    getProducts(letter);
  });
  document.getElementById("letter_container").appendChild(container);
}


function getProducts(letter) {

  const data = {
    letter: letter
  }
  var raw = JSON.stringify(data);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://localhost:3000/products/name', requestOptions)
    .then(response => response.json())
    .then(data => {

        if(data.length > 0) {
            var tempp = "";

            data.forEach((u) => {
                tempp += "<tr class='updateProduct'>"
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
                tempp += "<td>" + u.size + "</td>";
                tempp += "<td>" + u.subcategory + "</td>";
                tempp += "<td>" + u.category + "</td>";
                tempp += "<td>" + u.section + "</td>";
                tempp += "<tr>"
              });

              document.getElementById('product_table').innerHTML = tempp;
              var row = document.getElementsByClassName('updateProduct');

              for (var i = 0; i < row.length; i++) {
                row[i].addEventListener("click", () => {
                  var key = event.target.parentNode.childNodes[3].innerHTML;
                  document.location.href = "update_product.html?" + key;
                  console.log(key);
                });
              }

        }
      }).catch(error => console.error(error));
}

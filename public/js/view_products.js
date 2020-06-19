//"use strict"

//var button = document.getElementById('test');
var products_table = document.getElementById('product_table');
var letters = "*,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
letters = letters.split(",");
var container;
//var bittitle= document.getElementById('bigtitle');

for (var i = 0; i < letters.length; i++) {
  container = document.createElement("a");
  container.setAttribute("id", letters[i]);
  container.setAttribute("class", 'product_link');
  container.setAttribute("href", "");
  container.setAttribute("onclick", "return false;");
  container.innerHTML = letters[i];

  container.addEventListener("click", () => {
    var letter = event.target.innerHTML;
    //bigtitle.innerHTML = letter;
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

  fetch('http://192.168.0.107:3000/products/name', requestOptions)
    .then(response => response.json())
    .then(data => {
        if(data.length > 0) {
            var tempp = "";
            var product_id;

            data.forEach((u) => {
                tempp += "<td data-product-id= " + u.id + ">" + u.name + "</td>";
                tempp += "<td>" + u.price + "</td>";
                tempp += "<td>" + u.new_price + "</td>";
                tempp += "<td>" + u.ean + "</td>";
                tempp += "<td>" + u.availability + "</td>";
                tempp += "<td>" + u.quantity + "</td>";
                tempp += "<td>" + u.brand + "</td>";
                tempp += "<td>" + u.design + "</td>";
                tempp += "<td>" + u.description + "</td>";
                tempp += "<td>" + u.material + "</td>";
                tempp += "<td>" + u.diameter + "</td>";
                tempp += "<td>" + u.length + "</td>";
                tempp += "<td>" + u.width + "</td>";
                tempp += "<td>" + u.height + "</td>";
                tempp += "<td>" + u.volume + "</td>";
                tempp += "<td>" + u.weight + "</td>";
                tempp += "<td>" + u.size + "</td>";
                tempp += "<td>" + u.subcategory + "</td>";
                tempp += "<td>" + u.category + "</td>";
                tempp += "<td>" + u.section + "</td>";
                tempp += "<td>" + "<button type='button' class='product_table_button' data-product-id= " + u.id + "> Update </button>" + "</td>";
                tempp += "<td>" + "<button type='button' class='delete_product_button' data-product-id= '" + u.id + "'> Delete </button>" + "</td>";
                tempp += "<tr>";
              });

              products_table.innerHTML = tempp;
              var update_product_btn = document.getElementsByClassName('product_table_button');
              var delete_product_btn = document.getElementsByClassName('delete_product_button');

              for(var i = 0; i < update_product_btn.length; i++) {
                update_product_btn[i].addEventListener('click', () => {
                  product_id = event.target.dataset.productId;
                  document.location.href = "update_product.html?" + product_id;
                });
              }

              for(var j = 0; j < delete_product_btn.length; j++) {
                delete_product_btn[j].addEventListener("click", () => {
                  var product_id = event.target.dataset.productId;
                  fetchImages(product_id);
                });
              }

        }

      }).catch(error => console.error(error));
}

function fetchImages(id) {
  var images = [];
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const data = {'id': id};
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://192.168.0.107:3000/products/product-images-id', requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data.forEach((e) => {
        images.push(e.url);
      });
      deleteProduct(id, images);
    }).catch(error => console.error(error));

}

function deleteProduct(product_id, images_to_delete) {
  console.log(product_id, "product");
  console.log(images_to_delete, "images");
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var data = {
      'id': product_id,
      'path': images_to_delete

    };
    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://192.168.0.107:3000/products/delete-product", requestOptions)
      .then(response => response.text())
      .then((result) => {
        //console.log(result);
        location.reload(true);
      }).catch(error => console.log('error', error));

}

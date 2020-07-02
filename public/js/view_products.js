"use strict";

//var button = document.getElementById('test');
var products_table = document.getElementById('product_table');
var letters = "*,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
letters = letters.split(",");
var container;
var clicked_letter = "";

$("#popup_message").load("/public/admin/delete_product_popup.html", () => {});

for (var i = 0; i < letters.length; i++) {
  container = document.createElement("a");
  container.setAttribute("id", letters[i]);
  container.setAttribute("class", 'product_link');
  container.setAttribute("href", "");
  container.setAttribute("onclick", "return false;");
  container.innerHTML = letters[i];

  container.addEventListener("click", () => {
    var letter = event.target.innerHTML;
    clicked_letter = letter;
    console.log(letter, "clicked");
    getProducts(letter)
      .then((result) => {

        console.log(result, result);

        populateTable(result);

        $('th').click((event) => {

          var column = $(event.target).data('column');
          var order = $(event.target).data('order');
          var text = $(event.target).html();
          text = text.substring(0, text.length - 1);
          console.log(column, order, " clicked");

          if (order === 'desc') {
            $(event.target).data('order', 'asc');
            //result = result.sort((a,b) => a[column] > b[column] ? 1 : -1);
            result.sort(compareValues(column, false));
            text += '&#9660';
          } else {
            $(event.target).data('order', 'desc');
            //result = result.sort((a, b) => a[column] < b[column] ? 1 : -1);
            result.sort(compareValues(column, true));
            text += '&#9650';
          }
          populateTable(result);
          $(event.target).html(text);

        });


      }).catch(error => console.error(error));
  });

  document.getElementById("letter_container").appendChild(container);
}

function compareValues(key, ascending) {
  return function (a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string') ?
      a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ?
      b[key].toUpperCase() : b[key];

    var array = convert(varA, varB);

    // equal items sort equally
    if (array[0] === array[1]) {
      return 0;
    }
    // nulls sort after anything else
    else if ((array[0]) === "") {
      return 1;
    } else if ((array[1] === "")) {
      return -1;
    }
    // otherwise, if we're ascending, lowest sorts first
    else if (ascending) {
      return array[0] < array[1] ? -1 : 1;
    }
    // if descending, highest sorts first
    else {
      return array[0] < array[1] ? 1 : -1;
    }

  };
}


function convert(a, b) {


  var first = parseFloat(a);
  var second = parseFloat(b);

  if (!isNaN(first)) {
    a = first;
  }

  if (!isNaN(second)) {
    b = second;
  }
  return [a, b];

}

function ascending(array, column) {

  // Use toUpperCase() to ignore character casing
  const bandA = array.column.toUpperCase();
  const bandB = array.column.toUpperCase();

  let comparison = 0;
  if (bandA > bandB) {
    comparison = 1;
  } else if (bandA < bandB) {
    comparison = -1;
  }
  return comparison;

}

function descending(array) {

  var dataSum = 0;

  for (var i = 0; i < array.length; i++) {
    var current = parseFloat(array[i]);
    dataSum += current;
    // to save back onto array
    array[i] = current;
  }


  array.sort(function (a, b) {
    return a - b;
  });

}


async function getProducts(letter) {

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  var message = await fetch('http://192.168.0.108:3000/products/first-letter/' + letter, requestOptions);
  var response = await message.json();
  return response;
}

function populateTable(data) {

  if (data.length > 0) {
    var tempp = "";
    var product_id;

    data.forEach((u) => {
      tempp += "<td data-product-id= " + u.id + ">" + u.name + "</td>";
      tempp += "<td>" + u.price + "</td>";
      tempp += "<td>" + u.old_price + "</td>";
      tempp += "<td>" + u.sku + "</td>";
      tempp += "<td>" + u.availability + "</td>";
      tempp += "<td>" + u.quantity + "</td>";
      tempp += "<td>" + u.brand + "</td>";
      tempp += "<td>" + u.design + "</td>";
      tempp += "<td>" + u.tag + "</td>";
      tempp += "<td>" + u.subcategory + "</td>";
      tempp += "<td>" + u.category + "</td>";
      tempp += "<td>" + u.section + "</td>";
      tempp += "<td>" + "<button type='button' class='product_table_button' data-product-id= " + u.id + "> Update </button>" + "</td>";
      tempp += "<td>" + "<button type='button' class='delete_product_button'data-stripe-id='" + u.stripe_id + "' data-product-id= '" + u.id + "'> Delete </button>" + "</td>";
      tempp += "<tr>";
    });


    products_table.innerHTML = tempp;
    var update_product_btn = document.getElementsByClassName('product_table_button');
    var delete_product_btn = document.getElementsByClassName('delete_product_button');

    for (var i = 0; i < update_product_btn.length; i++) {
      update_product_btn[i].addEventListener('click', () => {
        product_id = event.target.dataset.productId;
        document.location.href = "update_product.html?" + product_id;
      });
    }

    for (var j = 0; j < delete_product_btn.length; j++) {
      delete_product_btn[j].addEventListener("click", () => {
        var product_id = event.target.dataset.productId;
        var stripe_id = event.target.dataset.stripeId;
        fetchImages(product_id, stripe_id);
      });
    }

  } else {
    products_table.innerHTML = "";
  }

}

function fetchImages(id, stripe_id) {
  var images = [];
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

  fetch('http://192.168.0.108:3000/products/product-images-id', requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data.forEach((e) => {
        images.push(e.url);
      });
      deleteProduct(id, images, stripe_id);
    }).catch(error => console.error(error));

}

function deleteProduct(product_id, images_to_delete, stripe_id) {

  // //let's create a popup before deleting a product
  var popup_modal_div = document.getElementById("popup_modal_div");
  var yes_button = document.getElementById("yes_button");
  var no_button = document.getElementById("no_button");
  popup_modal_div.style.display = "block";

  //if no, hide the popup
  no_button.addEventListener("click", () => {
    popup_modal_div.style.display = "none";
  });

  //if yes, delete the product
  yes_button.addEventListener("click", () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var data = {
      'id': product_id,
      'path': images_to_delete,
      'stripe_id': stripe_id
    };
    var raw = JSON.stringify(data);

    var requestOptions = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("http://192.168.0.108:3000/products/delete-product", requestOptions)
      .then(response => response.text())
      .then((result) => {
        console.log(result);
        $('#product_table').load(document.URL + ' #product_table', () => {
          console.log(clicked_letter, "afterload");
          getProducts(clicked_letter);
        });
      }).catch(error => console.log('error', error));
    popup_modal_div.style.display = "none";
  });
}
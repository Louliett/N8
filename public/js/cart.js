var stringArray = [];

$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    console.log('loaded');
    start();

  });


  var searches = document.cookie;
  var id = read_cookie('id');
  stringArray = read_cookie('items');
  var objectArray = [];
  var product_ids = [];
  var unique_products = [];


  if (stringArray != null) {
    stringArray = stringArray.split(",");
    //console.log(stringArray);
    for (var iii = 0; iii < stringArray.length; iii++) {
      var smallArray = stringArray[iii].split(':');
      //console.log(smallArray);

      objectArray.push(smallArray);
      //console.log(objectArray);

    }
  } else {
    stringArray = [];
  }

  if (objectArray.length > 0) {
    for (var i = 0; i < objectArray.length; i++) {
      product_ids.push(parseInt(objectArray[i][0]));
    }
  }


  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const data = {
    'ids': product_ids
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.105:3000/products/products-images", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(product_ids);
      console.log(result);
      for (var i = 0; i < product_ids.length; i++) {
        for (var j = 0; j < result.length; j++) {
          console.log(typeof(result[j].id), typeof(product_ids[i]));

          if(result[j].id === product_ids[i]) {
            unique_products.push(result[j]);
            break;
          }
        }
      }
      console.log(unique_products);
      createCart(unique_products);

    }).catch(error => console.log('error', error));







function createCart(products) {

    var cardDiv;
    var product_id;

    for (var i = 0; i < products.length; i++) {
      product_id = products[i].id;

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "item");
      cardDiv.setAttribute("id", "item" + product_id);
      document.getElementById("items").appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "left");
      cardDiv.setAttribute("id", "left" + product_id);
      document.getElementById("item" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("img");
      cardDiv.setAttribute("class", "productimage");
      var path = products[i].image_path;
      path = path.replace(".", "");
      cardDiv.setAttribute("src", path + products[i].image_name);
      document.getElementById("left" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "right");
      cardDiv.setAttribute("id", "right" + product_id);
      document.getElementById("item" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "right");
      cardDiv.setAttribute("id", "right" + product_id);
      document.getElementById("item" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "leftinfo");
      cardDiv.setAttribute("id", "leftinfo" + product_id);
      document.getElementById("right" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "rightinfo");
      cardDiv.setAttribute("id", "rightinfo" + product_id);
      document.getElementById("right" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute("class", "title");
      cardDiv.innerHTML = products[i].name;
      document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.innerHTML = products[i].description;
      document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('class', 'removeItem');
      cardDiv.innerHTML = 'remove item';
      cardDiv.setAttribute('data-item-id', product_id);
      $(cardDiv).click(() => {
        removeItem(event.target.dataset.itemId);
      });
      document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("select");
      cardDiv.setAttribute("class", "quantity");
      cardDiv.setAttribute("id", "quantity" + product_id);
      cardDiv.addEventListener('input', () => {
        update(event.target.getAttribute('id'), event.target.value);
      });
      document.getElementById("rightinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('id', 'price' + product_id);
      cardDiv.innerHTML = products[i].price;
      document.getElementById("rightinfo" + product_id).appendChild(cardDiv);
    }

    price_manipulator();

}


function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}


function calculatePrice() {

  var vat = 20;
  var shipping = Math.floor(Math.random() * (20 - 4) + 4);
  var sum = 0;
  var temmpsum;
  var quantity;
  var price;

  console.log(objectArray);


  for (var i = 0; i < objectArray.length; i++) {

    quantity = document.getElementById('quantity' + objectArray[i][0]).value;

    price = $('#price' + objectArray[i][0]).html();

    price = parseFloat(price);


    temmpsum = quantity * price;
    sum += temmpsum;

  }


  $('.subtotal').text('Subtotal: ' + sum + '$');
  $('.shipping').text('Shipping: ' + 8 + '$');
  $('.vat').text('VAT: ' + 20 + '%');
  $('.total').text('Total: ' + (sum + (sum * 0.2) + shipping) + '$');


}


function removeItem(id) {



  for (var i = 0; i < objectArray.length; i++) {


    if (objectArray[i][0] === id) {
      objectArray.splice(i, 1);
    }
  }

  $("#item" + id).fadeOut("slow", function() {
    $(this).parentNode.removeChild(removeTarget);
  });
  calculatePrice();
  fixArray();




}


function fixArray() {
  var newStringArray = [];

  for (var i = 0; i < objectArray.length; i++) {
    newStringArray.push(objectArray[i][0] + ':' + objectArray[i][1]);
  }



  var now = new Date();
  now.setFullYear(now.getFullYear() + 2);
  document.cookie = "items=" + newStringArray + "; expires=" + now.toUTCString() + "; " + "path=/";
}


function update(a, b) {
  var quantity = b;
  var id = a.replace('quantity', '');
  //console.log(quantity + '' + id);
  var found = false;
  for (var o = 0; o < stringArray.length; o++) {
    //console.log(stringArray[o][0] + ' ' + a + ' ' + stringArray[o][1]);
    if (stringArray[o][0] === id) {
      found = true;
      stringArray[o][1] = +b;
      //console.log('fucking what?');
    }
  }

  calculatePrice();

  fixArray();

}

function price_manipulator() {


  var $select = $(".quantity");

  for (i = 1; i <= 100; i++) {
    $select.append($('<option></option>').val(i).html(i));
  }

  for (var i = 0; i < objectArray.length; i++) {
    $("#quantity" + objectArray[i][0]).val(objectArray[i][1]);
  }
  calculatePrice();
}


});

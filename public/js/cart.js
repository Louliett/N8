"use strict";

var stringArray = [];
var addressArray = [];
var selectedAddress;

var carousel = document.querySelector('.carousel');
var cells = carousel.querySelectorAll('.carousel__cell');
var cellCount = 4; // cellCount set from cells-range input value
var selectedIndex = 0;
var cellWidth = carousel.offsetWidth;
var cellHeight = carousel.offsetHeight;
var isHorizontal = false;
var rotateFn = 'rotateX';
var radius, theta;
var checkoutSequenceCounter = 0;
var product_ids = [{
  Test1: 'price_HLhvSREgp7XgDV'
}, {
  Test2: 'price_HM3NQJlxKNoMd4'
}, {
  Test3: 'price_HLhx2nQ0l8r0do'
}, {
  Test4: 'price_HM3OgGZyLcHtYS'
}, {
  Test5: 'price_HM3PiRwwN6OnU8'
}];

var searches = document.cookie;
var id = read_cookie('id');
var loggedin = read_cookie('loggedin');
var customerid = read_cookie('customer');
var tempCookieArray = [];

//reusable variables
var myHeaders;

function rotateCarousel() {
  var angle = theta * selectedIndex * -1;
  carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
    rotateFn + '(' + angle + 'deg)';
}

var prevButton = document.querySelector('.previous-button');
prevButton.addEventListener('click', function () {
  previousMenu();

});

var nextButton = document.querySelector('.next-button');
nextButton.addEventListener('click', function () {

  if (checkoutSequenceCounter === 0) {
    if (cartCheck()) {
      nextMenu();
    }
  } else if (checkoutSequenceCounter === 1) {

    if (addressCheck()) {
      nextMenu();
    }
  } else if (checkoutSequenceCounter === 2) {
    if (cardCheck()) {
      nextMenu();
      populateList();

    }
  } else if (checkoutSequenceCounter === 3) {

  }

});



function changeCarousel() {
  theta = 360 / cellCount;
  var cellSize = isHorizontal ? cellWidth : cellHeight;
  radius = Math.round((cellSize / 2) / Math.tan(Math.PI / cellCount));
  for (var i = 0; i < cells.length; i++) {
    var cell = cells[i];
    if (i < cellCount) {
      // visible cell
      cell.style.opacity = 1;
      var cellAngle = theta * i;
      cell.style.transform = rotateFn + '(' + cellAngle + 'deg) translateZ(' + radius + 'px)';
    } else {
      // hidden cell
      cell.style.opacity = 0;
      cell.style.transform = 'none';
    }
  }

  rotateCarousel();
}

function onOrientationChange() {
  changeCarousel();
}

// set initials
onOrientationChange();


var div1 = $('.partcart');
var div2 = $('.partaddress');
var div3 = $('.partcard');
var div4 = $('.partfinal');


$('#billing').change(function () {
  var c = this.checked;
  if (c === true) {
    $('.billingaddressold').removeAttr('hidden');
    $('.billingaddressdefault').attr('hidden', 'hidden');
  } else {
    $('.billingaddressold').attr('hidden', 'hidden');
    $('.billingaddressdefault').removeAttr('hidden');
  }
});


$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function () {
    start();
    setTitle('YOUR CART');


  });
  $("#includedFooter").load("/public/html/footer.html", () => {


    $.getScript("/public/js/footer.js", function () {
      startFooter();

    });
  });

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


function initializeCheckoutSequence() {


  var line = $('#line1');
  div1.click(() => {
    div1.attr('id', 'sequencepointactive');
    div1.children().text('cart');
    div2.attr('id', 'sequencepoint');
    div2.children().text('2');

    div3.attr('id', 'sequencepoint');
    div3.children().text('3');

    div4.attr('id', 'sequencepoint');
    div4.children().text('4');
    selectedIndex = checkoutSequenceCounter = 0;
    rotateCarousel();
    if (checkoutSequenceCounter > 0 && checkoutSequenceCounter < 3) {
      nextButton.style.display = '';
      prevButton.style.display = '';
    }
    if (checkoutSequenceCounter <= 0) {
      prevButton.style.display = 'none';
      nextButton.style.display = '';


    }
    if (checkoutSequenceCounter >= 3) {
      nextButton.style.display = 'none';
      prevButton.style.display = '';
    }

  });

  div2.click(() => {
    div2.attr('id', 'sequencepointactive');
    div2.children().text('address and shipping');
    div1.attr('id', 'sequencepoint');
    div1.children().text('1');

    div3.attr('id', 'sequencepoint');
    div3.children().text('3');

    div4.attr('id', 'sequencepoint');
    div4.children().text('4');
    selectedIndex = checkoutSequenceCounter = 1;
    rotateCarousel();

    if (checkoutSequenceCounter > 0 && checkoutSequenceCounter < 3) {
      nextButton.style.display = '';
      prevButton.style.display = '';
    }
    if (checkoutSequenceCounter <= 0) {
      prevButton.style.display = 'none';
      nextButton.style.display = '';
    }
    if (checkoutSequenceCounter >= 3) {
      nextButton.style.display = 'none';
      prevButton.style.display = '';
    }

  });

  div3.click(() => {
    div3.attr('id', 'sequencepointactive');
    div3.children().text('card details');

    div1.attr('id', 'sequencepoint');
    div1.children().text('1');

    div2.attr('id', 'sequencepoint');
    div2.children().text('2');

    div4.attr('id', 'sequencepoint');
    div4.children().text('4');
    selectedIndex = checkoutSequenceCounter = 2;
    rotateCarousel();
    if (checkoutSequenceCounter > 0 && checkoutSequenceCounter < 3) {
      nextButton.style.display = '';
      prevButton.style.display = '';
    }
    if (checkoutSequenceCounter <= 0) {
      prevButton.style.display = 'none';
      nextButton.style.display = '';
    }
    if (checkoutSequenceCounter >= 3) {
      nextButton.style.display = 'none';
      prevButton.style.display = '';
    }

  });

  div4.click(() => {
    div4.attr('id', 'sequencepointactive');
    div4.children().text('finalize');

    div1.attr('id', 'sequencepoint');
    div1.children().text('1');

    div2.attr('id', 'sequencepoint');
    div2.children().text('2');

    div3.attr('id', 'sequencepoint');
    div3.children().text('3');
    selectedIndex = checkoutSequenceCounter = 3;
    rotateCarousel();
    if (checkoutSequenceCounter > 0 && checkoutSequenceCounter < 3) {
      nextButton.style.display = '';
      prevButton.style.display = '';
    }
    if (checkoutSequenceCounter <= 0) {
      prevButton.style.display = 'none';
      nextButton.style.display = '';
    }
    if (checkoutSequenceCounter >= 3) {
      nextButton.style.display = 'none';
      prevButton.style.display = '';
    }

  });

  var x1 = div1.offset().left + (0);
  var y1 = div1.offset().top + (div1.outerHeight() / 2);
  var x2 = div4.offset().left + (0);
  var y2 = div4.offset().top + (div4.outerHeight() / 2);

  line.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);
}


function moveSequence() {
  if (checkoutSequenceCounter > 0) {
    prevButton.style.display = '';

  }
  if (checkoutSequenceCounter < 3) {
    nextButton.style.display = '';

  }
  if (checkoutSequenceCounter === 0) {
    div1.attr('id', 'sequencepointactive');
    div1.children().text('cart');
    div2.attr('id', 'sequencepoint');
    div2.children().text('2');

    div3.attr('id', 'sequencepoint');
    div3.children().text('3');

    div4.attr('id', 'sequencepoint');
    div4.children().text('4');

  } else if (checkoutSequenceCounter === 1) {

    div2.attr('id', 'sequencepointactive');
    div2.children().text('address and shipping');
    div1.attr('id', 'sequencepoint');
    div1.children().text('1');

    div3.attr('id', 'sequencepoint');
    div3.children().text('3');

    div4.attr('id', 'sequencepoint');
    div4.children().text('4');

  } else if (checkoutSequenceCounter === 2) {

    div3.attr('id', 'sequencepointactive');
    div3.children().text('payment details');

    div1.attr('id', 'sequencepoint');
    div1.children().text('1');

    div2.attr('id', 'sequencepoint');
    div2.children().text('2');

    div4.attr('id', 'sequencepoint');
    div4.children().text('4');

  } else if (checkoutSequenceCounter === 3) {

    div4.attr('id', 'sequencepointactive');
    div4.children().text('finalize');

    div1.attr('id', 'sequencepoint');
    div1.children().text('1');

    div2.attr('id', 'sequencepoint');
    div2.children().text('2');

    div3.attr('id', 'sequencepoint');
    div3.children().text('3');
  }
}
var requiredFields = $('.shipping_address');


function cartCheck() {
  var cartDoneIcon = $('#partCartDone');
  cartDoneIcon.removeAttr('hidden');
  return true;
}

function addressCheck() {
  var error = false;
  if (loggedin == 1) {
    if (selectedAddress !== undefined) {
      return true;
    } else {
      return false;
    }
  } else {
    for (var i = 0; i < requiredFields.length; i++) {
      if (requiredFields[i].value === '') {
        error = true;
        requiredFields[i].classList.add('error');

      }
    }
    var addressErrorIcon = $('#partAddressError');
    var addressDoneIcon = $('#partAddressDone');


    if (error) {
      addressErrorIcon.removeAttr('hidden');
      addressDoneIcon.attr('hidden', 'hidden');
      return false;

    } else if (!error) {

      addressDoneIcon.removeAttr('hidden');
      addressErrorIcon.attr('hidden', 'hidden');
      populateOld();
      return true;

    } else {

      addressErrorIcon.removeAttr('hidden');
      addressDoneIcon.attr('hidden', 'hidden');

      return false;
    }
  }

}

function cardCheck() {
  var card_details = $('.card_details');
  var isBilling = document.getElementById('billing');
  var c = isBilling.checked;
  var requiredFieldsBilling;
  var error = false;

  if (c) {
    requiredFieldsBilling = $('.auto.billing_address');
  } else {
    requiredFieldsBilling = $('.required.billing_address');

  }
  for (var i = 0; i < requiredFieldsBilling.length; i++) {
    if (requiredFieldsBilling[i].value === '') {
      error = true;
      requiredFieldsBilling[i].classList.add('error');
    }
  }
  for (var i = 0; i < card_details.length; i++) {
    if (card_details[i].value === '') {

      error = true;
      card_details[i].classList.add('error');

    }
  }
  var cardDoneIcon = $('#partCardDone');
  var cardErrorIcon = $('#partCardError');

  if (error) {
    cardDoneIcon.removeAttr('hidden');
    cardDoneIcon.attr('hidden', 'hidden');
    cardErrorIcon.removeAttr('hidden');
    return false;
  } else if (!error) {
    cardDoneIcon.removeAttr('hidden');


    cardErrorIcon.attr('hidden', 'hidden');
    return true;
  } else {
    cardDoneIcon.removeAttr('hidden');
    cardDoneIcon.attr('hidden', 'hidden');

    cardErrorIcon.removeAttr('hidden');
    return false;
  }

}

function nextMenu() {
  if (checkoutSequenceCounter < 3) {
    nextButton.style.display = '';

    selectedIndex++;
    rotateCarousel();
    prevButton.removeAttribute('hidden');

    checkoutSequenceCounter = (checkoutSequenceCounter + 1) % 4;


    moveSequence();
  } else {
    nextButton.style.display = 'none';

  }


}

function previousMenu() {
  if (checkoutSequenceCounter > 0) {
    selectedIndex--;
    rotateCarousel();

    checkoutSequenceCounter = (Math.abs(checkoutSequenceCounter - 1)) % 4;
    moveSequence();
  } else {
    prevButton.style.display = 'none';
  }


}

function populateOld() {
  var isBilling = document.getElementById('billing');
  var c = isBilling.checked;
  if (c === true) {
    $('.billingaddressold').removeAttr('hidden');
    $('.billingaddressdefault').attr('hidden', 'hidden');
    var requiredFieldsBilling = $('.auto.billing_address');
    for (var i = 0; i < requiredFieldsBilling.length; i++) {
      requiredFieldsBilling[i].innerHTML = requiredFields[i].value;

    }
  } else {
    $('.billingaddressold').attr('hidden', 'hidden');
    $('.billingaddressdefault').removeAttr('hidden');
  }
}


var required = $('.required');
var errorScript = function (event) {
  var e = event.target;
  if (e.value === '') {
    e.classList.add('error');
  } else {
    e.classList.remove('error');
  }
};

for (var i = 0; i < required.length; i++) {
  required[i].addEventListener('input', errorScript);

  required[i].addEventListener("focusout", errorScript);




}


function populateList() {
  /*  var table=document.getElementById('simple_body');
    var itemsList=$('.cart_item');
    for(var i=0;i<itemsList.length;i++){
        
        var row=table.insertRow(0);
        var cell=row.insertCell(0);
        cell.innerHTML='<p>'+itemsList[i].dataset.itemName+'</p>';
        cell=row.insertCell(1);
        cell.innerHTML='<p>'+itemsList[i].dataset.itemPrice+'</p>';
        cell=row.insertCell(2);
        cell.innerHTML='<p>'+itemsList[i].dataset.itemQuantity+'</p>';
        cell=row.insertCell(3);
        cell.innerHTML='<p>20%</p>';
        
        
    }
    var row=table.insertRow(table.rows.length);
    var cell=row.insertCell(0);
    cell=row.insertCell(1);
    cell=row.insertCell(2);
    cell=row.insertCell(3);
    cell=row.insertCell(4);
    cell.innerHTML='<p>'+$('.total').text()+'</p>';
    */

  var table = $('.shipping_address_checkout');
  var relevant = table.children('.auto');
  var old = $('.required.shipping_address');
  for (var i = 0; i < relevant.length; i++) {
    relevant[i].innerHTML = old[i].value;
  }


  var table = $('.billing_address_checkout');
  var relevant = table.children('.auto');

  var old;
  var isBilling = document.getElementById('billing');
  var c = isBilling.checked;
  if (c === true) {
    old = $('.auto.billing_address');
    for (var i = 0; i < relevant.length; i++) {
      relevant[i].innerHTML = old[i].innerHTML;
    }

  } else {
    old = $('.required.billing_address');
    for (var i = 0; i < relevant.length; i++) {
      relevant[i].innerHTML = old[i].value;
    }

  }

  /*   
     var table=$('.card_checkout');
     var relevant=table.children('.auto')
     var old=$('.card_details');
     for(var i=0; i<relevant.length;i++){
         relevant[i].innerHTML=old[i].value;
     }*/



}
/*var month_slc = document.getElementById('expiration_month');
var year_slc = document.getElementById('expiration_year');


  var months = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  for (var i = 0; i < months.length; i++) {
    var opt = months[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    month_slc.appendChild(el);
  }


  for (var i = 20; i < 51; i++) {
    var opt = i;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    year_slc.appendChild(el);
  }*/


var cities_slc = document.querySelectorAll('#bulgarian_cities');

var array = [];
fetch('/public/db/bg.json')
  .then(response => response.json())
  .then((data) => {
    for (var i = 0; i < data.length; i++) {
      array.push(data[i].city);
    }
    for (var j = 0; j < array.length; j++) {
      var opt = array[j];
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      cities_slc[0].appendChild(el);
      var el = document.createElement("option");
      el.textContent = opt;
      el.value = opt;
      cities_slc[1].appendChild(el);
    }
  });


// stripe code starts -----------------------------------------------------------------
var payment_button = $('.finalize');

payment_button.click(() => {
  purchase(tempCookieArray);
});

async function getSripePublicKey() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let message = await fetch("http://192.168.0.107:3000/transactions/get-public-key", requestOptions);
  let response = await message.text();
  return response;
}

function purchase(items_array) {

  getSripePublicKey()
    .then((publicKey) => {
        console.log(publicKey, "pk");
        
        var stripe = Stripe(publicKey);
        myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const data = {
          'items': items_array
        };

        var raw = JSON.stringify(data);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://192.168.0.107:3000/transactions/purchase", requestOptions)
          .then(response => response.json())
          .then((session) => {            
            stripe.redirectToCheckout({
              sessionId: session.id
            }).then(function (result) {
              console.log(result.error.message);
            });

          }).catch(error => console.log('error', error));
    }).catch(error => console.error(error));
}

//stripe code ends --------------------------------------------------------------------


// $('.finalize').click(() => {
//   var PUBLISHABLE_KEY = "pk_test_eJRfzu3ioOMkmqV5aue6PcGF00NIIx3yZ2";
//   // Replace with the domain you want your users to be redirected back to after payment
//   var DOMAIN = window.location.origin;

//   var stripe = Stripe(PUBLISHABLE_KEY);
//   var handleResult = function (result) {
//     if (result.error) {
//       var displayError = document.getElementById("error-message");
//       displayError.textContent = result.error.message;
//     }
//   };


//   var email = $('.email_checkout')

//   if (email.val() === '') {
//     email.addClass('error');
//   } else {
//     var itemsList = $('.cart_item');
//     var objectsList = [];

//     for (var i = 0; i < itemsList.length; i++) {
//       var iname = itemsList[i].dataset.itemName;
//       var iquantity = itemsList[i].dataset.itemQuantity;
//       for (var q = 0; q < product_ids.length; q++) {
//         if (iname in product_ids[q]) {
//           objectsList.push({
//             price: product_ids[q][iname],
//             quantity: parseInt(iquantity)
//           })
//         }
//       }

//     }

//     // Make the call to Stripe.js to redirect to the checkout page
//     // with the current quantity
//     stripe
//       .redirectToCheckout({
//         mode: 'payment',
//         lineItems: objectsList,
//         successUrl: DOMAIN + "/success.html?session_id={CHECKOUT_SESSION_ID}",
//         cancelUrl: DOMAIN + "/canceled.html"
//       })
//       .then(handleResult);


//   }


// })



function sendShit() {

  var table = $('.shipping_address_checkout');
  var relevant = table.children('.auto');
  var contentsShipping = [];
  for (var i = 0; i < relevant.length; i++) {
    contentsShipping.push(relevant[i].innerHTML);
  }


  var table = $('.billing_address_checkout');
  var relevant = table.children('.auto');
  var contentsBilling = [];
  for (var i = 0; i < relevant.length; i++) {
    contentsBilling.push(relevant[i].innerHTML);
  }

  var table = $('.card_checkout');
  var relevant = table.children('.auto')
  var contentCard = [];
  for (var i = 0; i < relevant.length; i++) {
    contentCard.push(relevant[i].innerHTML);
  }

  var contentItems = [];


  var itemsList = $('.cart_item');
  for (var i = 0; i < itemsList.length; i++) {

    contentItems.push(i);
    contentItems.push(itemsList[i].dataset.itemName);
    contentItems.push(itemsList[i].dataset.itemPrice);
    contentItems.push(itemsList[i].dataset.itemQuantity);


    var time = new Date();
    var randHex = function (len) {
      var maxlen = 8,
        min = Math.pow(16, Math.min(len, maxlen) - 1)
      max = Math.pow(16, Math.min(len, maxlen)) - 1,
        n = Math.floor(Math.random() * (max - min + 1)) + min,
        r = n.toString(16);
      while (r.length < len) {
        r = r + randHex(len - maxlen);
      }
      return r;
    };

    //  demo code
    function write(i) {
      $("<li />").text(i).appendTo("#x");
    }

    for (var j = 1; j < 50; j++) {}

    /*const data = {
    'code': randHex(99) ,
    'first_name': contentsShipping[0],
    'last_name': contentsShipping[1],
    'shipping_address': contentsShipping,
    'billing_address': contentsBilling,
    'card_details': contentCard,
    'total_amount': $('.total').text(),
    'items': contentItems,
    'email': $('.email_checkout').val(),
    'timestamp': time.getTime(),
    'type': 'purchase'*/
    const data = {
      'code': randHex(99),
      'first_name': contentsShipping[0],
      'last_name': contentsShipping[1],
      'shipping_address': contentsShipping.join(),
      'billing_address': contentsBilling.join(),
      'card_details': contentCard.join(),
      'total_amount': $('.total').text(),
      'items': contentItems.join(),
      'email': 'louliett@gmail.com', //$('.email_checkout').val(),
      'timestamp': time.getTime(),
      'type': 'purchase'
    };
    myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(data);
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    }

    fetch("http://192.168.0.107:3000/transactions/create-unregistered", requestOptions)
      .then(response => response.text())
      .then(result => setPage(result))
      .catch(error => console.log('error', error));

  }


}

// function setPage(result) {

//   var shit = window.open('about:blank', '', '_blank');

//   shit.document.write(result);


// }




function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}



function createCart(products) {
  $('#items').html('');

  var cardDiv;
  var product_id;

  for (var i = 0; i < products.length; i++) {
    product_id = products[i].id + products[i].color;
    tempCookieArray.push({
      id: products[i].id,
      quantity: products[i].quantity,
      color: products[i].color,
      stripe_price: products[i].stripe_price
    });

    cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "item");
    cardDiv.classList.add('cart_item');
    cardDiv.setAttribute('data-item-name', products[i].name);
    cardDiv.setAttribute('data-item-quantity', objectArray[i][1]);
    cardDiv.setAttribute('data-item-price', products[i].price);
    cardDiv.setAttribute("id", "item" + product_id);
    document.getElementById("items").appendChild(cardDiv);

    cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "left");
    cardDiv.setAttribute("id", "left" + product_id);
    document.getElementById("item" + product_id).appendChild(cardDiv);

    cardDiv = document.createElement("img");
    cardDiv.setAttribute("class", "productimage");
    cardDiv.setAttribute("data-redirect", products[i].id);
    if (products[i].image_name !== null) {
      cardDiv.setAttribute("src", 'http://192.168.0.107:3000' + products[i].image_url);
    } else {

    }

    $(cardDiv).on("error", function () {
      $(this).attr('src', 'http://192.168.0.107:3000/public/product_images/default.png');
    });
    cardDiv.addEventListener('click', function (e) {
      window.location.replace('/public/path/item.html?' + e.target.dataset.redirect)
    })
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
    cardDiv.innerHTML = 'Color/Material: ' + products[i].color;
    document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

    cardDiv = document.createElement("p");
    cardDiv.setAttribute('class', 'removeItem');
    cardDiv.innerHTML = 'remove item';
    cardDiv.setAttribute('data-item-id', products[i].id);
    cardDiv.setAttribute('data-item-color', products[i].color);
    cardDiv.setAttribute('data-item-quantity', products[i].quantity);
    $(cardDiv).click(() => {
      removeItem(event.target.dataset.itemId, event.target.dataset.itemQuantity, event.target.dataset.itemColor);
    });
    document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

    cardDiv = document.createElement("p");
    cardDiv.setAttribute('id', 'price' + product_id);
    cardDiv.innerHTML = 'Price: <span id="price' + product_id + 'span" >' + products[i].price + '</span>$';
    document.getElementById("rightinfo" + product_id).appendChild(cardDiv);


    cardDiv = document.createElement("select");
    cardDiv.setAttribute("class", "quantity");
    cardDiv.setAttribute("id", "quantity" + product_id);
    cardDiv.setAttribute("data-product", product_id);
    cardDiv.setAttribute('data-item-id', products[i].id);
    cardDiv.setAttribute('data-item-color', products[i].color);
    cardDiv.addEventListener('input', () => {
      //update(event.target.getAttribute('id'), event.target.value);
    });
    document.getElementById("rightinfo" + product_id).appendChild(cardDiv);
    var $dropdown = $('#quantity' + product_id);
    for (var q = 1; q < 30; q++) {
      $dropdown.append($("<option />").val(q).text('QTY: ' + q));
    }
    $dropdown.val(products[i].quantity);
    $dropdown.change(function (e) {

      $("#total" + e.target.dataset.product).html('Total: <span class="totalspan">' + ((+$("#price" + e.currentTarget.dataset.product + 'span').html()) * (+e.currentTarget.value)) + '</span>$');
      console.log(tempCookieArray)

      for (var iii = 0; iii < tempCookieArray.length; iii++) {
        if (tempCookieArray[iii].id == e.currentTarget.dataset.itemId && tempCookieArray[iii].color === e.currentTarget.dataset.itemColor) {

          tempCookieArray[iii].quantity = e.currentTarget.value;
          console.log(tempCookieArray[iii])

        }


      }
      fixArray();

    })


    cardDiv = document.createElement("p");
    cardDiv.setAttribute('id', 'total' + product_id);
    cardDiv.setAttribute('style', 'border-top: 1px solid #00000044; font-size: 18px; padding-top: 4px;');
    cardDiv.innerHTML = 'Total: <span class="totalspan">' + ((+products[i].price) * (+products[i].quantity)) + '</span>$';
    document.getElementById("rightinfo" + product_id).appendChild(cardDiv);



  }


  calculatePrice();




}



function removeItem(id, quantity, color) {



  for (var i = 0; i < tempCookieArray.length; i++) {


    if (tempCookieArray[i].id == id && tempCookieArray[i].color === color) {
      tempCookieArray.splice(i, 1);

    }
  }

  $("#item" + id + color).fadeOut("slow", function () {
    $(this).parentNode.removeChild(removeTarget);
  });
  fixArray();




}


function fixArray() {
  var newStringArray = [];

  for (var i = 0; i < tempCookieArray.length; i++) {
    newStringArray.push(tempCookieArray[i].id + ':' + tempCookieArray[i].quantity + ':' + tempCookieArray[i].color);
  }



  var now = new Date();
  now.setFullYear(now.getFullYear() + 2);
  document.cookie = "items=" + newStringArray + "; expires=" + now.toUTCString() + "; " + "path=/";

  tempCookieArray = [];
  Reload();
  calculatePrice();

}


function calculatePrice() {

  var vat = 20;
  var shipping = Math.floor(Math.random() * (20 - 4) + 4);
  var sum = 0;
  var temmpsum;
  var quantity;
  var price;
  var totals = $('.totalspan');

  for (var i = 0; i < totals.length; i++) {

    sum += (+totals[i].innerHTML);

  }





  $('.subtotal').text('Subtotal: ' + sum + '$');
  $('.shipping').text('Shipping: ' + 8 + '$');
  $('.vat').text('VAT: ' + 20 + '%');
  $('.total').html('Total: <span class="totaltotal">' + (sum + (sum * 0.2) + shipping) + '</span>$');

}
if (loggedin === '1') {
  fetchCustomer();
}

function fetchCustomer() {

  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': customerid
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/users/get-customer-by-id", requestOptions)
    .then(response => response.json())
    .then((result) => {
      fetchAddress(result);
    })
    .catch(error => console.log('error', error));


}


function fetchAddress(customer) {
  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': customerid
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
    .then((result) => {
      console.log(result, customer);
      addAddresses(result, customer);
    })
    .catch(error => console.log('error', error));
}


function addAddresses(addresses, customer) {

  var $shippingAddress = $('.shippingaddress');
  $shippingAddress.html('<h4>Select shipping address below</h4>');

  for (var i = 0; i < addresses.length; i++) {

    $shippingAddress.html($shippingAddress.html() + '<div class="oldaddress"><div class="selection"><p>click to select</p></div><p class="newcardtitle">Address line 1</p> <input readonly id="address1" class="required shipping_address1 oldinput" value="' + addresses[i].name + '"><p class="newcardtitle">Address line 2</p><input readonly id="address2" class="required shipping_address2 oldinput" value="' + addresses[i].second_name + '"><div class="citycode"><div class="citycity"><p class="newcardtitle">City</p> <p id="bulgarian_cities" class="required shipping_address city" style="width: 90px;">' + addresses[i].city + '</p></div><div class="citycity"><p class="newcardtitle">Post code</p> <input readonly id="shipping-postcode" class="required shipping_address_post_code oldinput" value="' + addresses[i].postcode + '"></div></div><div class="citycode"><div class="citycity"><p class="newcardtitle">First name</p> <input readonly id="first_name_old" class="required shipping_address oldinput" value="' + customer[0].first_name + '"></div><div class="citycity"><p class="newcardtitle">Last Name</p> <input readonly id="last_name_old" class="required shipping_address oldinput" value="' + customer[0].last_name + '"></div></div><p class="newcardtitle">Phone Number</p> <input readonly id="phone_number" class="required phonenumber oldinput" value="' + addresses[i].phone_number + '"></div>');

  }

  $shippingAddress.html($shippingAddress.html() + '<h3>Or add new address</h3><div class="shippingaddress"><p>This is also my billing address <input type="checkbox" id="billing"></p> <br><p class="newcardtitle">First name</p> <input id="phone_number" type="text" placeholder="First name" data-field-name="shippingphone" class="required shipping_address phone"><p class="newcardtitle">Last Name</p> <input id="phone_number" type="text" placeholder="First name" data-field-name="shippingphone" class="required shipping_address phone"><p class="newcardtitle">City</p> <select id="bulgarian_cities" class="required shipping_address city" style="width: 90px;" name="card_expirationYear" data-field-name="shippingcity"><option id="default_city"></option><option value="Sofia">Sofia</option><option value="Plovdiv">Plovdiv</option><option value="Varna">Varna</option><option value="Burgas">Burgas</option><option value="Ruse">Ruse</option><option value="Stara Zagora">Stara Zagora</option><option value="Pleven">Pleven</option><option value="Sliven">Sliven</option><option value="Dobrich">Dobrich</option><option value="Shumen">Shumen</option><option value="Pernik">Pernik</option><option value="Haskovo">Haskovo</option><option value="Vratsa">Vratsa</option><option value="Kyustendil">Kyustendil</option><option value="Montana">Montana</option><option value="Lovech">Lovech</option><option value="Razgrad">Razgrad</option><option value="Borino">Borino</option><option value="Madan">Madan</option><option value="Zlatograd">Zlatograd</option><option value="Pazardzhik">Pazardzhik</option><option value="Smolyan">Smolyan</option><option value="Blagoevgrad">Blagoevgrad</option><option value="Nedelino">Nedelino</option><option value="Rudozem">Rudozem</option><option value="Devin">Devin</option><option value="Veliko Tarnovo">Veliko Tarnovo</option><option value="Vidin">Vidin</option><option value="Kirkovo">Kirkovo</option><option value="Krumovgrad">Krumovgrad</option><option value="Dzhebel">Dzhebel</option><option value="Silistra">Silistra</option><option value="Sarnitsa">Sarnitsa</option><option value="Shiroka Laka">Shiroka Laka</option><option value="Yambol">Yambol</option><option value="Dospat">Dospat</option><option value="Kardzhali">Kardzhali</option><option value="Gabrovo">Gabrovo</option><option value="Targovishte">Targovishte</option></select><p class="newcardtitle">Phone Number</p> <input id="phone_number" type="text" placeholder="Phone Number" data-field-name="shippingphone" class="required shipping_address phone"><p class="newcardtitle">Address</p> <input id="address1" type="text" placeholder="Address Line 1" data-field-name="shippingaddress1" class="required shipping_address address1"><p class="newcardtitle">Address</p> <input id="address2" type="text" placeholder="Address Line 2" data-field-name="shippingaddress2" class="required shipping_address address2"><p class="newcardtitle">Post code</p> <input id="shippingpostcode" type="text" placeholder="Post Code" class="required shipping_address postcode"></div>');

  addressArray = $('.oldaddress');
  for (var j = 0; j < addressArray.length; j++) {
    addressArray[j].addEventListener('click', function () {
      event.target.classList.add('selected');
      event.target.childNodes[0].childNodes[0].innerHTML = 'SELECTED';

      if (selectedAddress !== undefined) {
        selectedAddress.childNodes[0].childNodes[0].innerHTML = 'Click to select';
        selectedAddress.classList.remove('selected');
      }
      selectedAddress = event.target;
    });
  }

  $('.billingaddressdefault').html('');

  $shippingAddress.clone().appendTo('.billingaddressdefault');

}
"use strict";


var stringArray = [];
var addressArray = [];
var selectedAddress;
var selectedBilling;
var selectedNewShipping = {
  delivery_postcode: "####",
  delivery_address1: "####",
  delivery_address2: "####",
  delivery_city: "####",
  names1: "####",
  names2: "####",
  phonenumber: "####"
};

var selectedNewBilling = {
  delivery_postcode: "####",
  delivery_address1: "####",
  delivery_address2: "####",
  delivery_city: "####",
  names1: "####",
  names2: "####",
  phonenumber: "####"
};

var sequenceActive = null;
var cellCount = 4; // cellCount set from cells-range input value
var selectedIndex = 0;
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
var product_idss = [{
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
var customer_email = "";
var stripe_customer = "";
var tempCookieArray = [];

function rotateCarousel() {
  var angle = theta * selectedIndex * -1;
  carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
    rotateFn + '(' + angle + 'deg)';
}


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
    $('<div class="sequence"><div class="sequencePointParent" data-id="one" data-name="Cart"><div class="partcart sequencepoint active" id="sequencepointactive"  data-id="1"><p class="sequenceText">Cart</p></div><div hidden class="hoverInfo" id="partCartDone"> <span class="hoverInfoText">Cart complete!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointDone one"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div hidden class="hoverInfo" id="partCartError"> <span class="hoverInfoText">Your cart is empty!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointWarning"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2.73 21h18.53c.77 0 1.25-.83.87-1.5l-9.27-16c-.39-.67-1.35-.67-1.73 0l-9.27 16c-.38.67.1 1.5.87 1.5zM13 18h-2v-2h2v2zm-1-4c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z"/></svg></div></div><div class="sequencePointParent" data-id="two" data-name="Shipping"><div class="partaddress sequencepoint" id="sequencepoint"  data-id="2"><p class="sequenceText">2</p></div><div hidden class="hoverInfo" id="partAddressDone"> <span class="hoverInfoText">Shipping information complete!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointDone two"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div hidden class="hoverInfo" id="partAddressError"> <span class="hoverInfoText">Problem with your shipping information!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointWarning"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2.73 21h18.53c.77 0 1.25-.83.87-1.5l-9.27-16c-.39-.67-1.35-.67-1.73 0l-9.27 16c-.38.67.1 1.5.87 1.5zM13 18h-2v-2h2v2zm-1-4c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z"/></svg></div></div><div class="sequencePointParent" data-id="three" data-name="Billing"><div   data-id="3" class="partcard sequencepoint" id="sequencepoint"><p class="sequenceText">3</p></div><div hidden class="hoverInfo" id="partCardDone"> <span class="hoverInfoText">Billing information complete!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointDone three"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div hidden class="hoverInfo" id="partCardError"> <span class="hoverInfoText">Problem with your billing information!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointWarning"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2.73 21h18.53c.77 0 1.25-.83.87-1.5l-9.27-16c-.39-.67-1.35-.67-1.73 0l-9.27 16c-.38.67.1 1.5.87 1.5zM13 18h-2v-2h2v2zm-1-4c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z"/></svg></div></div><div class="sequencePointParent" data-id="four" data-name="Summary"><div  data-id="4" class="partfinal sequencepoint" id="sequencepoint"><p class="sequenceText">4</p></div><div hidden class="hoverInfo"> <span class="hoverInfoText">Order ready!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointDone four"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div><div hidden class="hoverInfo"> <span class="hoverInfoText">Problem with your order!</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px" class="sequencePointWarning"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M2.73 21h18.53c.77 0 1.25-.83.87-1.5l-9.27-16c-.39-.67-1.35-.67-1.73 0l-9.27 16c-.38.67.1 1.5.87 1.5zM13 18h-2v-2h2v2zm-1-4c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1z"/></svg></div></div></div>').appendTo($('.free_real_estate'));

    var $sequence = $('.sequencePointParent');
    sequenceActive = $sequence[0].childNodes[0];

    $sequence.click(function (e) {

      if (sequenceActive != null) {


        sequenceActive.classList.remove('active');
        sequenceActive.childNodes[0].innerHTML = sequenceActive.dataset.id;
        sequenceActive = null;
      }


      e.target.childNodes[0].classList.add('active');
      sequenceActive = e.target.childNodes[0];
      e.target.childNodes[0].childNodes[0].innerHTML = e.currentTarget.dataset.name;
      $('html, body').animate({
        scrollTop: ($('.match_point.' + e.currentTarget.dataset.id).offset().top - $('.match_point.' + e.currentTarget.dataset.id).height() * 2 - 111)
      }, 800);
    });


    mapSequence($sequence);



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
    div1.addClass('active');
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


function cartCheck() {
  var cartDoneIcon = $('#partCartDone');
  var cartErrorIcon = $('#partCartError');
  if (tempCookieArray.length < 1) {


    cartDoneIcon.attr('hidden', 'hidden');
    cartErrorIcon.removeAttr('hidden');
    return false;
  } else {
    cartDoneIcon.removeAttr('hidden');
    cartErrorIcon.attr('hidden', 'hidden');

    return true;
  }
}

function addressCheck() {
  var addressErrorIcon = $('#partAddressError');
  var addressDoneIcon = $('#partAddressDone');
  var requiredFields = $('.required.shipping_address');
  var error = false;
  if (selectedAddress == undefined) {
    $('#error_shipping_address_general').html('Please select a shipping address.').removeAttr('hidden');
  }

  if (loggedin == 1 && (selectedAddress !== undefined) && selectedAddress.dataset.age === 'old') {

    if (error) {
      populateList();
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
  } else {
    for (var i = 0; i < requiredFields.length; i++) {
      if (requiredFields[i].classList.contains('empty') || requiredFields[i].value.length < 1) {
        error = true;
        requiredFields[i].classList.add('error');
        $(requiredFields[i].dataset.errorId).removeAttr('hidden');
        $(requiredFields[i].dataset.errorId).html('Field cannot be empty!');

      }
    }



    if (error) {
      drawLine();
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
  var cardDoneIcon = $('#partCardDone');
  var cardErrorIcon = $('#partCardError');
  var card_details = $('.card_details');
  //var isBilling=document.getElementById('billing');
  var c = false; //isBilling.checked;
  var requiredFields = $('.required.billing_address');
  var error = false;

  if (selectedBilling == undefined) {
    $('#error_billing_address_general').html('Please select a billing address.').removeAttr('hidden');
  }

  if (loggedin == 1 && (selectedBilling !== undefined) && selectedBilling.dataset.age === 'old') {
    if (error) {
      populateList();
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
  } else {


    for (var i = 0; i < requiredFields.length; i++) {
      if (requiredFields[i].classList.contains('empty') || requiredFields[i].value.length < 1) {
        error = true;
        requiredFields[i].classList.add('error');
        $(requiredFields[i].dataset.errorId).removeAttr('hidden');
        $(requiredFields[i].dataset.errorId).html('Field cannot be empty!');

      }
    }


    if (error) {
      drawLine();
      cardDoneIcon.removeAttr('hidden');
      cardDoneIcon.attr('hidden', 'hidden');
      cardErrorIcon.removeAttr('hidden');
      populateList();
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
  //var isBilling=document.getElementById('billing');
  var c = false; //isBilling.checked;
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
$('.finalize_top, .finalize_bottom').click(function () {

  console.log(cartCheck(), addressCheck(), cardCheck());


  if (cartCheck() && addressCheck() && cardCheck()) {
    purchase(tempCookieArray);
  }


  drawLine();
});


function purchase(items_array) {

  getSripePublicKey()
    .then((publicKey) => {

      var stripe = Stripe(publicKey);
      myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      console.log(stripe_customer, "stripe");

      const data = {
        'items': items_array,
        'stripe_id': stripe_customer,
      };

      var raw = JSON.stringify(data);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch("http://192.168.0.108:3000/transactions/purchase", requestOptions)
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

async function getSripePublicKey() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let message = await fetch("http://192.168.0.108:3000/transactions/get-public-key", requestOptions);
  let response = await message.text();
  return response;
}


function populateList() {
  console.log(selectedAddress);
  console.log(selectedBilling);

  if (selectedAddress != undefined) {

    if (selectedAddress.dataset.age === 'old') {


      var tempShipping = $(selectedAddress).clone();
      tempShipping.children('.shipping-cover').remove();
      $('.final-shipping').html('');
      tempShipping.appendTo($('.final-shipping'));
    }



    if (selectedAddress.dataset.age === 'new') {


      var tempShipping = $('<div class="shipping-new selected" data-age="new"  data-address="{&quot;delivery_postcode&quot;:&quot;' + selectedNewShipping.delivery_postcode + '&quot;,&quot;delivery_address1&quot;:&quot;' + selectedNewShipping.delivery_address1 + '&quot;,&quot;delivery_address2&quot;:&quot;' + selectedNewShipping.delivery_address2 + '&quot;,&quot;delivery_city&quot;:&quot;' + selectedNewShipping.delivery_city + '&quot;,&quot;names1&quot;:&quot;' + selectedNewShipping.names1 + '&quot;,&quot;names2&quot;:&quot;' + selectedNewShipping.names2 + '&quot;,&quot;phonenumber&quot;:&quot;' + selectedNewShipping.phonenumber + '&quot;}"><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name"> ' + selectedNewShipping.names1 + ' ' + selectedNewShipping.names2 + '</div><div class="shipping-address">' + selectedNewShipping.delivery_address1 + ' ' + selectedNewShipping.delivery_address2 + '</div><div class="shipping-address">' + selectedNewShipping.delivery_city + ', ' + selectedNewShipping.delivery_postcode + '</div><div class="shipping-address">' + selectedNewShipping.phonenumber + '</div></div> </div>');

      $('.final-shipping').html('');
      tempShipping.appendTo($('.final-shipping'));
    }
  }
  if (selectedBilling != undefined) {


    if (selectedBilling.dataset.age === 'old') {


      var tempBilling = $(selectedBilling).clone();
      tempBilling.children('.billing-cover').remove();
      $('.final-billing').html('');
      tempBilling.appendTo($('.final-billing'));
    }



    if (selectedBilling.dataset.age === 'new') {


      var tempBilling = $('<div class="billing-new selected" data-age="new"  data-address="{&quot;delivery_postcode&quot;:&quot;' + selectedNewBilling.delivery_postcode + '&quot;,&quot;delivery_address1&quot;:&quot;' + selectedNewBilling.delivery_address1 + '&quot;,&quot;delivery_address2&quot;:&quot;' + selectedNewBilling.delivery_address2 + '&quot;,&quot;delivery_city&quot;:&quot;' + selectedNewBilling.delivery_city + '&quot;,&quot;names1&quot;:&quot;' + selectedNewBilling.names1 + '&quot;,&quot;names2&quot;:&quot;' + selectedNewBilling.names2 + '&quot;,&quot;phonenumber&quot;:&quot;' + selectedNewBilling.phonenumber + '&quot;}"><div class="billing-button"></div><div class="billing-info"><div class="billing-name"> ' + selectedNewBilling.names1 + ' ' + selectedNewBilling.names2 + '</div><div class="billing-address">' + selectedNewBilling.delivery_address1 + ' ' + selectedNewBilling.delivery_address2 + '</div><div class="billing-address">' + selectedNewBilling.delivery_city + ', ' + selectedNewBilling.delivery_postcode + '</div><div class="billing-address">' + selectedNewBilling.phonenumber + '</div></div> </div>');

      $('.final-billing').html('');
      tempBilling.appendTo($('.final-billing'));
    }
  }



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
   
    
    var table=$('.shipping_address_checkout');
    var relevant=table.children('.auto')
    var old=$('.required.shipping_address');
    for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].value;
    }
    
     
    var table=$('.billing_address_checkout');
    var relevant=table.children('.auto')
    
    var old;
var isBilling=document.getElementById('billing');
    var c = isBilling.checked;
    if(c===true){
           old=$('.auto.billing_address');
        for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].innerHTML;
    }
 
    }
    else{
            old=$('.required.billing_address');
        for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].value;
    }

    }
     */

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

var time = new Date();
var randHex = function (len) {
  var maxlen = 8,
    min = Math.pow(16, Math.min(len, maxlen) - 1);
  max = Math.pow(16, Math.min(len, maxlen)) - 1,
    n = Math.floor(Math.random() * (max - min + 1)) + min,
    r = n.toString(16);
  while (r.length < len) {
    r = r + randHex(len - maxlen);
  }

  return r;
};



function setPage(result) {

  var shit = window.open('about:blank', '', '_blank');

  shit.document.write(result);


}




function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}



function createCart(products) {
  if (products == 0) {
    return;
  }
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
      cardDiv.setAttribute("src", 'http://192.168.0.108:3000' + products[i].image_url);
    } else {

    }

    $(cardDiv).on("error", function () {
      $(this).attr('src', 'http://192.168.0.108:3000/public/product_images/default.png');
    });
    cardDiv.addEventListener('click', function (e) {
      window.location.replace('/public/path/item.html?' + e.target.dataset.redirect);
    });

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
      console.log(tempCookieArray);

      for (var iii = 0; iii < tempCookieArray.length; iii++) {
        if (tempCookieArray[iii].id == e.currentTarget.dataset.itemId && tempCookieArray[iii].color === e.currentTarget.dataset.itemColor) {

          tempCookieArray[iii].quantity = e.currentTarget.value;
          console.log(tempCookieArray[iii]);

        }


      }
      fixArray();

    });


    cardDiv = document.createElement("p");
    cardDiv.setAttribute('id', 'total' + product_id);
    cardDiv.setAttribute('style', 'border-top: 1px solid #00000044; font-size: 18px; padding-top: 4px;');
    cardDiv.innerHTML = 'Total: <span class="totalspan">' + ((+products[i].price) * (+products[i].quantity)) + '</span>$';
    document.getElementById("rightinfo" + product_id).appendChild(cardDiv);



  }

  drawLine();

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
} else if (loggedin === '0') {
  fetchCustomerNew();
}

function fetchCustomer() {

  var myHeaders = new Headers();
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

  fetch("http://192.168.0.108:3000/users/get-customer-by-id", requestOptions)
    .then(response => response.json())
    .then((result) => {
      console.log(result, "result");

      customer_email = result[0].email;
      stripe_customer = result[0].stripe_id;
      fetchAddress(result);
    }).catch(error => console.log('error', error));


}


function fetchAddress(customer) {
  var myHeaders = new Headers();
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

  fetch("http://192.168.0.108:3000/addresses/customer-address-id", requestOptions)
    .then(response => response.json())
    .then((result) => {
      console.log(result, customer);
      addAddresses(result, customer);
    })
    .catch(error => console.log('error', error));
}


function addAddresses(addresses, customer) {

  var $shippingAddress = $('.shippingaddress');
  var $billingAddress = $('.billingaddressdefault');
  $shippingAddress.html('<h4>Select shipping address below</h4><p id="error_shipping_address_general" class="error_address general" hidden="">Error</p>');
  $billingAddress.html('<h4>Select billing address below</h4><p id="error_billing_address_general" class="error_address general" hidden="">Error</p>');
  var isShipping = false;

  for (var i = 0; i < addresses.length; i++) {
    isShipping = addresses[i].shipping ? true : false;
    var $tempdiv = $('<div class="shipping-old" data-age="old"  data-address="{&quot;delivery_postcode&quot;:&quot;' + addresses[i].postcode + '&quot;,&quot;delivery_address1&quot;:&quot;' + addresses[i].name + '&quot;,&quot;delivery_address2&quot;:&quot;' + addresses[i].second_name + '&quot;,&quot;delivery_city&quot;:&quot;' + addresses[i].city + '&quot;,&quot;names1&quot;:&quot;' + customer[0].first_name + '&quot;,&quot;names2&quot;:&quot;' + customer[0].last_name + '&quot;,&quot;phonenumber&quot;:&quot;' + addresses[i].phone_number + '&quot;}"><div class="shipping-cover"></div><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name"> ' + customer[0].first_name + ' ' + customer[0].last_name + '</div><div class="shipping-address">' + addresses[i].name + addresses[i].second_name + '</div><div class="shipping-address">' + addresses[i].city + ', ' + addresses[i].postcode + '</div><div class="shipping-address">' + addresses[i].phone_number + '</div></div> </div>').appendTo($shippingAddress);

    if (isShipping) {
      $tempdiv.addClass('selected');
      $tempdiv[0].childNodes[1].classList.add("feedback");
      selectedAddress = $tempdiv[0];
      isShipping = false;
    }






    $('<div class="billing-old" data-age="old"  data-address="{&quot;delivery_postcode&quot;:&quot;' + addresses[i].postcode + '&quot;,&quot;delivery_address1&quot;:&quot;' + addresses[i].name + '&quot;,&quot;delivery_address2&quot;:&quot;' + addresses[i].second_name + '&quot;,&quot;delivery_city&quot;:&quot;' + addresses[i].city + '&quot;,&quot;names1&quot;:&quot;' + customer[0].first_name + '&quot;,&quot;names2&quot;:&quot;' + customer[0].last_name + '&quot;,&quot;phonenumber&quot;:&quot;' + addresses[i].phone_number + '&quot;}"><div class="billing-cover"></div><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name"> ' + customer[0].first_name + ' ' + customer[0].last_name + '</div><div class="shipping-address">' + addresses[i].name + addresses[i].second_name + '</div><div class="shipping-address">' + addresses[i].city + ', ' + addresses[i].postcode + '</div><div class="shipping-address">' + addresses[i].phone_number + '</div></div> </div>').appendTo($billingAddress);



  }


  $('<div class="shipping-new" data-age="new"  data-address="{&quot;delivery_postcode&quot;:&quot;"####"&quot;,&quot;delivery_address1&quot;:&quot;"####"&quot;,&quot;delivery_address2&quot;:&quot;"####"&quot;,&quot;delivery_city&quot;:&quot;"####"&quot;,&quot;names1&quot;:&quot;"####"&quot;,&quot;names2&quot;:&quot;"####"&quot;,&quot;phonenumber&quot;:&quot;"####"&quot;}"><div class="shipping-cover"></div><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name">Use a different shipping address</div><div class="shipping-address"></div><div class="shipping-address"></div><div class="shipping-address"></div></div> </div>').appendTo($shippingAddress);


  $('<div class="billing-new" data-age="new"  data-address="{&quot;delivery_postcode&quot;:&quot;"####"&quot;,&quot;delivery_address1&quot;:&quot;"####"&quot;,&quot;delivery_address2&quot;:&quot;"####"&quot;,&quot;delivery_city&quot;:&quot;"####"&quot;,&quot;names1&quot;:&quot;"####"&quot;,&quot;names2&quot;:&quot;"####"&quot;,&quot;phonenumber&quot;:&quot;"####"&quot;}"><div class="billing-cover"></div><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name">Use a different billing address</div><div class="shipping-address"></div><div class="shipping-address"></div><div class="shipping-address"></div></div> </div>').appendTo($billingAddress);




  $('<div hidden class="shipping_new"><h3>New shipping address</h3><div class="shippingaddress"><div class="input"><p class="new_address_title">First name</p><p id="error_shipping_address_first_name" class="error_address first_name" hidden="">Error</p> <input class="required shipping_address first_name" type="text" placeholder="First name" data-relevance="names1" data-error-id="#error_shipping_address_first_name" /></div><div class="input"><p class="new_address_title">Last Name</p><p id="error_shipping_address_last_name" class="error_address last_name" hidden="">Error</p> <input class="required shipping_address last_name" type="text" placeholder="Last name" data-relevance="names2" data-error-id="#error_shipping_address_last_name" /></div><div class="input"><p class="new_address_title">City</p><p id="error_shipping_address_city" class="error_address city" hidden="">Error</p> <select id="bulgarian_cities" class="required shipping_address city" style="width: 90px;" data-relevance="delivery_city" data-error-id="#error_shipping_address_city"><option id="default_city"></option><option value="Sofia">Sofia</option><option value="Plovdiv">Plovdiv</option><option value="Varna">Varna</option><option value="Burgas">Burgas</option><option value="Ruse">Ruse</option><option value="Stara Zagora">Stara Zagora</option><option value="Pleven">Pleven</option><option value="Sliven">Sliven</option><option value="Dobrich">Dobrich</option><option value="Shumen">Shumen</option><option value="Pernik">Pernik</option><option value="Haskovo">Haskovo</option><option value="Vratsa">Vratsa</option><option value="Kyustendil">Kyustendil</option><option value="Montana">Montana</option><option value="Lovech">Lovech</option><option value="Razgrad">Razgrad</option><option value="Borino">Borino</option><option value="Madan">Madan</option><option value="Zlatograd">Zlatograd</option><option value="Pazardzhik">Pazardzhik</option><option value="Smolyan">Smolyan</option><option value="Blagoevgrad">Blagoevgrad</option><option value="Nedelino">Nedelino</option><option value="Rudozem">Rudozem</option><option value="Devin">Devin</option><option value="Veliko Tarnovo">Veliko Tarnovo</option><option value="Vidin">Vidin</option><option value="Kirkovo">Kirkovo</option><option value="Krumovgrad">Krumovgrad</option><option value="Dzhebel">Dzhebel</option><option value="Silistra">Silistra</option><option value="Sarnitsa">Sarnitsa</option><option value="Shiroka Laka">Shiroka Laka</option><option value="Yambol">Yambol</option><option value="Dospat">Dospat</option><option value="Kardzhali">Kardzhali</option><option value="Gabrovo">Gabrovo</option><option value="Targovishte">Targovishte</option> </select></div><div class="input"><p class="new_address_title">Phone number</p><p id="error_shipping_address_phone_number" class="error_address phone_number" hidden="">Error</p> <input class="required shipping_address phone_number" type="text" placeholder="+359 XXX XX XXX" data-relevance="phonenumber" data-error-id="#error_shipping_address_phone_number" /></div><div class="input"><p class="new_address_title">Address line 1</p><p id="error_shipping_address_address1" class="error_address address1" hidden="">Error</p> <input class="required shipping_address address1" type="text" placeholder="bul. Kliment Ohrisdski 65e" data-relevance="delivery_address1" data-error-id="#error_shipping_address_address1" /></div><div class="input"><p class="new_address_title">Address line 2</p><p id="error_shipping_address_address2" class="error_address address2" hidden="">Error</p> <input class="required shipping_address address2" type="text" placeholder="floor 2, ap. 3, brown door" data-relevance="delivery_address2" data-error-id="#error_shipping_address_address2" /></div><div class="input"><p class="new_address_title">Postcode</p><p id="error_shipping_address_postcode" class="error_address postcode" hidden="">Error</p> <input class="required shipping_address postcode" type="text" placeholder="1762" data-relevance="delivery_postcode" data-error-id="#error_shipping_address_postcode" /></div></div>').appendTo($shippingAddress);

  $('<div hidden class="billing_new" hidden=""><h3>New billing address</h3><div class="billingaddress"><div class="input"><p class="new_address_title">First name</p><p id="error_billing_address_first_name" class="error_address first_name" hidden="">Error</p> <input class="required billing_address first_name" type="text" placeholder="First name" data-relevance="names1" data-error-id="#error_billing_address_first_name" /></div><div class="input"><p class="new_address_title">Last Name</p><p id="error_billing_address_last_name" class="error_address last_name" hidden="">Error</p> <input class="required billing_address last_name" type="text" placeholder="Last name" data-relevance="names2" data-error-id="#error_billing_address_last_name" /></div><div class="input"><p class="new_address_title">City</p><p id="error_billing_address_city" class="error_address city" hidden="">Error</p> <select id="bulgarian_cities" class="required billing_address city" style="width: 90px;" data-relevance="delivery_city" data-error-id="#error_billing_address_city"><option id="default_city"></option><option value="Sofia">Sofia</option><option value="Plovdiv">Plovdiv</option><option value="Varna">Varna</option><option value="Burgas">Burgas</option><option value="Ruse">Ruse</option><option value="Stara Zagora">Stara Zagora</option><option value="Pleven">Pleven</option><option value="Sliven">Sliven</option><option value="Dobrich">Dobrich</option><option value="Shumen">Shumen</option><option value="Pernik">Pernik</option><option value="Haskovo">Haskovo</option><option value="Vratsa">Vratsa</option><option value="Kyustendil">Kyustendil</option><option value="Montana">Montana</option><option value="Lovech">Lovech</option><option value="Razgrad">Razgrad</option><option value="Borino">Borino</option><option value="Madan">Madan</option><option value="Zlatograd">Zlatograd</option><option value="Pazardzhik">Pazardzhik</option><option value="Smolyan">Smolyan</option><option value="Blagoevgrad">Blagoevgrad</option><option value="Nedelino">Nedelino</option><option value="Rudozem">Rudozem</option><option value="Devin">Devin</option><option value="Veliko Tarnovo">Veliko Tarnovo</option><option value="Vidin">Vidin</option><option value="Kirkovo">Kirkovo</option><option value="Krumovgrad">Krumovgrad</option><option value="Dzhebel">Dzhebel</option><option value="Silistra">Silistra</option><option value="Sarnitsa">Sarnitsa</option><option value="Shiroka Laka">Shiroka Laka</option><option value="Yambol">Yambol</option><option value="Dospat">Dospat</option><option value="Kardzhali">Kardzhali</option><option value="Gabrovo">Gabrovo</option><option value="Targovishte">Targovishte</option> </select></div><div class="input"><p class="new_address_title">Phone number</p><p id="error_billing_address_phone_number" class="error_address phone_number" hidden="">Error</p> <input class="required billing_address phone_number" type="text" placeholder="+359 XXX XX XXX" data-relevance="phonenumber" data-error-id="#error_billing_address_phone_number" /></div><div class="input"><p class="new_address_title">Address line 1</p><p id="error_billing_address_address1" class="error_address address1" hidden="">Error</p> <input class="required billing_address address1" type="text" placeholder="bul. Kliment Ohrisdski 65e" data-relevance="delivery_address1" data-error-id="#error_billing_address_address1" /></div><div class="input"><p class="new_address_title">Address line 2</p><p id="error_billing_address_address2" class="error_address address2" hidden="">Error</p> <input class="required billing_address address2" type="text" placeholder="floor 2, ap. 3, brown door" data-relevance="delivery_address2" data-error-id="#error_billing_address_address2" /></div><div class="input"><p class="new_address_title">Postcode</p><p id="error_billing_address_postcode" class="error_address postcode" hidden="">Error</p> <input class="required billing_address postcode" type="text" placeholder="1762" data-relevance="delivery_postcode" data-error-id="#error_billing_address_postcode" /></div></div>').appendTo($billingAddress);




  addressArray = $('.shipping-cover');
  for (var i = 0; i < addressArray.length; i++) {

    addressArray[i].addEventListener('click', function () {
      event.target.parentNode.classList.add('selected');
      event.target.parentNode.childNodes[1].classList.add('feedback');
      if (selectedAddress !== undefined) {

        selectedAddress.classList.remove('selected');
        selectedAddress.childNodes[1].classList.remove('feedback');
      }

      selectedAddress = event.target.parentNode;
      populateList();

      if (event.target.parentNode.dataset.age === 'new') {
        $('.shipping_new').removeAttr('hidden');
        drawLine();

      }
    });

  }



  addressArray = $('.billing-cover');
  for (var i = 0; i < addressArray.length; i++) {

    addressArray[i].addEventListener('click', function () {
      event.target.parentNode.classList.add('selected');
      event.target.parentNode.childNodes[1].classList.add('feedback');
      if (selectedBilling !== undefined) {

        selectedBilling.classList.remove('selected');
        selectedBilling.childNodes[1].classList.remove('feedback');
      }

      selectedBilling = event.target.parentNode;
      populateList();

      if (event.target.parentNode.dataset.age === 'new') {
        $('.billing_new').removeAttr('hidden');
        drawLine();

      }
    });

  }


  $('.required.shipping_address').change(function (e) {
    selectedNewShipping[e.target.dataset.relevance] = e.target.value;

  });
  $('.required.billing_address').change(function (e) {
    selectedNewBilling[e.target.dataset.relevance] = e.target.value;

  });



  drawLine();



}



function fetchCustomerNew() {
  var $shippingAddress = $('.shippingaddress');
  var $billingAddress = $('.billingaddressdefault');
  $shippingAddress.html('<h4>Select shipping address below</h4><p id="error_shipping_address_general" class="error_address general" hidden="">Error</p>');
  $billingAddress.html('<h4>Select billing address below</h4><p id="error_billing_address_general" class="error_address general" hidden="">Error</p>');


  var tempShipping = $('<div class="shipping-new selected" data-age="new"  data-address="{&quot;delivery_postcode&quot;:&quot;"####"&quot;,&quot;delivery_address1&quot;:&quot;"####"&quot;,&quot;delivery_address2&quot;:&quot;"####"&quot;,&quot;delivery_city&quot;:&quot;"####"&quot;,&quot;names1&quot;:&quot;"####"&quot;,&quot;names2&quot;:&quot;"####"&quot;,&quot;phonenumber&quot;:&quot;"####"&quot;}"><div class="shipping-cover"></div><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name">Use a different shipping address</div><div class="shipping-address"></div><div class="shipping-address"></div><div class="shipping-address"></div></div> </div>');
  tempShipping.appendTo($shippingAddress);

  selectedAddress = tempShipping[0];




  var tempBilling = $('<div class="billing-new selected" data-age="new"  data-address="{&quot;delivery_postcode&quot;:&quot;"####"&quot;,&quot;delivery_address1&quot;:&quot;"####"&quot;,&quot;delivery_address2&quot;:&quot;"####"&quot;,&quot;delivery_city&quot;:&quot;"####"&quot;,&quot;names1&quot;:&quot;"####"&quot;,&quot;names2&quot;:&quot;"####"&quot;,&quot;phonenumber&quot;:&quot;"####"&quot;}"><div class="billing-cover"></div><div class="shipping-button"></div><div class="shipping-info"><div class="shipping-name">Use a different billing address</div><div class="shipping-address"></div><div class="shipping-address"></div><div class="shipping-address"></div></div> </div>');
  tempBilling.appendTo($billingAddress);

  selectedBilling = tempBilling[0];





  $('<div class="shipping_new"><h3>New shipping address</h3><div class="shippingaddress"><div class="input"><p class="new_address_title">First name</p><p id="error_shipping_address_first_name" class="error_address first_name" hidden="">Error</p> <input class="required shipping_address first_name" type="text" placeholder="First name" data-relevance="names1" data-error-id="#error_shipping_address_first_name" /></div><div class="input"><p class="new_address_title">Last Name</p><p id="error_shipping_address_last_name" class="error_address last_name" hidden="">Error</p> <input class="required shipping_address last_name" type="text" placeholder="Last name" data-relevance="names2" data-error-id="#error_shipping_address_last_name" /></div><div class="input"><p class="new_address_title">City</p><p id="error_shipping_address_city" class="error_address city" hidden="">Error</p> <select id="bulgarian_cities" class="required shipping_address city" style="width: 90px;" data-relevance="delivery_city" data-error-id="#error_shipping_address_city"><option id="default_city"></option><option value="Sofia">Sofia</option><option value="Plovdiv">Plovdiv</option><option value="Varna">Varna</option><option value="Burgas">Burgas</option><option value="Ruse">Ruse</option><option value="Stara Zagora">Stara Zagora</option><option value="Pleven">Pleven</option><option value="Sliven">Sliven</option><option value="Dobrich">Dobrich</option><option value="Shumen">Shumen</option><option value="Pernik">Pernik</option><option value="Haskovo">Haskovo</option><option value="Vratsa">Vratsa</option><option value="Kyustendil">Kyustendil</option><option value="Montana">Montana</option><option value="Lovech">Lovech</option><option value="Razgrad">Razgrad</option><option value="Borino">Borino</option><option value="Madan">Madan</option><option value="Zlatograd">Zlatograd</option><option value="Pazardzhik">Pazardzhik</option><option value="Smolyan">Smolyan</option><option value="Blagoevgrad">Blagoevgrad</option><option value="Nedelino">Nedelino</option><option value="Rudozem">Rudozem</option><option value="Devin">Devin</option><option value="Veliko Tarnovo">Veliko Tarnovo</option><option value="Vidin">Vidin</option><option value="Kirkovo">Kirkovo</option><option value="Krumovgrad">Krumovgrad</option><option value="Dzhebel">Dzhebel</option><option value="Silistra">Silistra</option><option value="Sarnitsa">Sarnitsa</option><option value="Shiroka Laka">Shiroka Laka</option><option value="Yambol">Yambol</option><option value="Dospat">Dospat</option><option value="Kardzhali">Kardzhali</option><option value="Gabrovo">Gabrovo</option><option value="Targovishte">Targovishte</option> </select></div><div class="input"><p class="new_address_title">Phone number</p><p id="error_shipping_address_phone_number" class="error_address phone_number" hidden="">Error</p> <input class="required shipping_address phone_number" type="text" placeholder="+359 XXX XX XXX" data-relevance="phonenumber" data-error-id="#error_shipping_address_phone_number" /></div><div class="input"><p class="new_address_title">Address line 1</p><p id="error_shipping_address_address1" class="error_address address1" hidden="">Error</p> <input class="required shipping_address address1" type="text" placeholder="bul. Kliment Ohrisdski 65e" data-relevance="delivery_address1" data-error-id="#error_shipping_address_address1" /></div><div class="input"><p class="new_address_title">Address line 2</p><p id="error_shipping_address_address2" class="error_address address2" hidden="">Error</p> <input class="required shipping_address address2" type="text" placeholder="floor 2, ap. 3, brown door" data-relevance="delivery_address2" data-error-id="#error_shipping_address_address2" /></div><div class="input"><p class="new_address_title">Postcode</p><p id="error_shipping_address_postcode" class="error_address postcode" hidden="">Error</p> <input class="required shipping_address postcode" type="text" placeholder="1762" data-relevance="delivery_postcode" data-error-id="#error_shipping_address_postcode" /></div></div>').appendTo($shippingAddress);

  $('<div class="billing_new"><h3>New billing address</h3><div class="billingaddress"><div class="input"><p class="new_address_title">First name</p><p id="error_billing_address_first_name" class="error_address first_name" hidden="">Error</p> <input class="required billing_address first_name" type="text" placeholder="First name" data-relevance="names1" data-error-id="#error_billing_address_first_name" /></div><div class="input"><p class="new_address_title">Last Name</p><p id="error_billing_address_last_name" class="error_address last_name" hidden="">Error</p> <input class="required billing_address last_name" type="text" placeholder="Last name" data-relevance="names2" data-error-id="#error_billing_address_last_name" /></div><div class="input"><p class="new_address_title">City</p><p id="error_billing_address_city" class="error_address city" hidden="">Error</p> <select id="bulgarian_cities" class="required billing_address city" style="width: 90px;" data-relevance="delivery_city" data-error-id="#error_billing_address_city"><option id="default_city"></option><option value="Sofia">Sofia</option><option value="Plovdiv">Plovdiv</option><option value="Varna">Varna</option><option value="Burgas">Burgas</option><option value="Ruse">Ruse</option><option value="Stara Zagora">Stara Zagora</option><option value="Pleven">Pleven</option><option value="Sliven">Sliven</option><option value="Dobrich">Dobrich</option><option value="Shumen">Shumen</option><option value="Pernik">Pernik</option><option value="Haskovo">Haskovo</option><option value="Vratsa">Vratsa</option><option value="Kyustendil">Kyustendil</option><option value="Montana">Montana</option><option value="Lovech">Lovech</option><option value="Razgrad">Razgrad</option><option value="Borino">Borino</option><option value="Madan">Madan</option><option value="Zlatograd">Zlatograd</option><option value="Pazardzhik">Pazardzhik</option><option value="Smolyan">Smolyan</option><option value="Blagoevgrad">Blagoevgrad</option><option value="Nedelino">Nedelino</option><option value="Rudozem">Rudozem</option><option value="Devin">Devin</option><option value="Veliko Tarnovo">Veliko Tarnovo</option><option value="Vidin">Vidin</option><option value="Kirkovo">Kirkovo</option><option value="Krumovgrad">Krumovgrad</option><option value="Dzhebel">Dzhebel</option><option value="Silistra">Silistra</option><option value="Sarnitsa">Sarnitsa</option><option value="Shiroka Laka">Shiroka Laka</option><option value="Yambol">Yambol</option><option value="Dospat">Dospat</option><option value="Kardzhali">Kardzhali</option><option value="Gabrovo">Gabrovo</option><option value="Targovishte">Targovishte</option> </select></div><div class="input"><p class="new_address_title">Phone number</p><p id="error_billing_address_phone_number" class="error_address phone_number" hidden="">Error</p> <input class="required billing_address phone_number" type="text" placeholder="+359 XXX XX XXX" data-relevance="phonenumber" data-error-id="#error_billing_address_phone_number" /></div><div class="input"><p class="new_address_title">Address line 1</p><p id="error_billing_address_address1" class="error_address address1" hidden="">Error</p> <input class="required billing_address address1" type="text" placeholder="bul. Kliment Ohrisdski 65e" data-relevance="delivery_address1" data-error-id="#error_billing_address_address1" /></div><div class="input"><p class="new_address_title">Address line 2</p><p id="error_billing_address_address2" class="error_address address2" hidden="">Error</p> <input class="required billing_address address2" type="text" placeholder="floor 2, ap. 3, brown door" data-relevance="delivery_address2" data-error-id="#error_billing_address_address2" /></div><div class="input"><p class="new_address_title">Postcode</p><p id="error_billing_address_postcode" class="error_address postcode" hidden="">Error</p> <input class="required billing_address postcode" type="text" placeholder="1762" data-relevance="delivery_postcode" data-error-id="#error_billing_address_postcode" /></div></div>').appendTo($billingAddress);

  $('.required.shipping_address').change(function (e) {
    selectedNewShipping[e.target.dataset.relevance] = e.target.value;

  });
  $('.required.billing_address').change(function (e) {
    selectedNewBilling[e.target.dataset.relevance] = e.target.value;

  });
  drawLine();




}


function drawLine() {
  var line1 = $('.line1');
  var line2 = $('.line2');
  var line3 = $('.line3');
  var line4 = $('.line4');

  var x1 = line1.parent().width() / 2;
  var y1 = '60px';
  var x2 = x1;
  var y2 = line1.parent().height();


  line1.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);


  x1 = line2.parent().width() / 2;
  y1 = '60px';
  x2 = x1;
  y2 = line2.parent().height();


  line2.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);

  x1 = line3.parent().width() / 2;
  y1 = '60px';
  x2 = x1;
  y2 = line3.parent().height();


  line3.attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2);


  x1 = line4.parent().width() / 2;
  y1 = '60px';
  x2 = x1;
  y2 = line4.parent().height();


  //line4.attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2);





}
$(window).resize(function () {
  drawLine();
});





function mapSequence(sequence) {

  window.onscroll = function () {
    myFunction();
  };

  var matchPointTwo = $('.match_point_inner.two')[0].parentNode.parentNode;
  var matchPointThree = $('.match_point_inner.three')[0].parentNode.parentNode;
  var matchPointFour = $('.match_point_inner.four')[0].parentNode.parentNode;




  function myFunction() {

    var matchPointTwoOffset = matchPointTwo.offsetTop - 300;
    var matchPointThreeOffset = matchPointThree.offsetTop - 300;
    var matchPointFourOffset = matchPointFour.offsetTop - 300;



    if (window.pageYOffset >= matchPointTwoOffset) {
      cartCheck();
    }
    if (window.pageYOffset >= matchPointThreeOffset) {
      addressCheck();
    }
    if (window.pageYOffset >= matchPointFourOffset) {
      cardCheck();
    }
  }






}
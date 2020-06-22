var jsonInfo;
var jsonFile;
var selection;




var customers = read_cookie('customer');
var elements;
var customer;

var query = decodeURIComponent(window.location.search);
query = query.replace('?', '');





$("#includedContent").load("/public/html/header.html", () => {
  document.addEventListener('click', function() {
    console.log(event.target);
  })

 
  $("#address").load("/public/html/address.html", () => {
    $.getScript("/public/js/address.js", () => {});
  });
    
    $("#includedFooter").load("/public/html/footer.html", () => {
  $.getScript("/public/js/footer.js", function() {
    startFooter();

  });
     });

  $.getScript("/public/js/header.js", function() {
      start();
          $('.navbar').attr('class','navbarnew');
    $('.categorySpace').attr('class','categorySpacenew');
    $('.navbar2').attr('class','navbar2new');
        $('.logoImg').attr('class','logoImgnew');

    
var bigimage=$('.bigimage');
      bigimage.css('height','280px')
    $('.gradient').width(bigimage.width());
    $('.gradient').height(bigimage.height());

  });

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': customers
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
      customer = result[0];
      createMenu(customer);
    })
    .catch(error => console.log('error', error));


});

function createMenu(customer) {

  var options = document.getElementsByClassName('option');

  for (var ii = 0; ii < options.length; ii++) {

    options[ii].addEventListener('click', function() {
      var optionString = event.target.dataset.option;
      elements.setAttribute('class', 'option');

      var selected = event.target;
      selected.setAttribute('class', 'selected');
      elements = (selected);
      if (optionString === 'info') {
        info();
      } else if (optionString === 'edit') {
        edit();
      } else if (optionString === 'orders') {
        orders();
      }/* else if (optionString === 'cards') {
        cards();
      }*/ else if (optionString === 'address') {
        address();
      }
    });
  }
  if (query === '') {

    elements = (options[0]);


    options[0].setAttribute('class', 'selected');
    info();
  } else if (query === 'edit') {
    elements = (options[1]);


    options[1].setAttribute('class', 'selected');
    edit();
  } else if (query === 'order') {
    elements = (options[2]);


    options[2].setAttribute('class', 'selected');
    orders();
  } /*else if (query === 'wallet') {
    elements = (options[3]);


    options[3].setAttribute('class', 'selected');
    cards();
  }*/ else if (query === 'address') {
    elements = (options[3]);


    options[3].setAttribute('class', 'selected');
    address();
  }
}

function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}


var container = $('.content');



function info() {
  console.log(container);
  $('.content').empty();

  var cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", 'contentofcontent');
  cardDiv.setAttribute("id", 'contentofcontent');
  container.append(cardDiv);

  cardDiv = document.createElement("p");
  cardDiv.setAttribute('style', "padding-top: 20px;");
  cardDiv.innerHTML = 'Account Information';
  document.getElementById('contentofcontent').appendChild(cardDiv);

  for (var name in customer) {
    console.log(name);
    if (name !== 'password' && name !== 'id') {
      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", 'titlediv');
      cardDiv.setAttribute("id", 'titlediv');
      document.getElementById('contentofcontent').appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('class', 'notatitle');
      cardDiv.setAttribute('align', 'left');
      cardDiv.innerHTML = name;
      document.getElementById('titlediv').appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('class', 'notacontent');
      cardDiv.setAttribute('align', 'left');

      cardDiv.innerHTML = customer[name];
      document.getElementById('titlediv').appendChild(cardDiv);
    }
  }

}



function edit() {
  $('.content').empty();

  var cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", 'contentofcontent');
  cardDiv.setAttribute("id", 'contentofcontent');
  container.append(cardDiv);

  cardDiv = document.createElement("p");
  cardDiv.setAttribute('style', "padding-top: 20px;");
  cardDiv.innerHTML = 'Edit Information';
  document.getElementById('contentofcontent').appendChild(cardDiv);

  //3 blocks for first name
  var first_name_div = document.createElement("div");
  first_name_div.setAttribute("class", 'titlediv');
  first_name_div.setAttribute("id", 'titlediv' + name);
  document.getElementById('contentofcontent').appendChild(first_name_div);

  first_name_div = document.createElement("p");
  first_name_div.setAttribute('class', 'notatitle');
  first_name_div.setAttribute('align', 'left');
  first_name_div.innerHTML = "First Name";
  document.getElementById('titlediv' + name).appendChild(first_name_div);

  first_name_div = document.createElement("input");
  first_name_div.setAttribute('class', 'notaninput');
  first_name_div.setAttribute('type', 'text');
  first_name_div.setAttribute('id', 'first_name');
  first_name_div.defaultValue = customer.first_name;
  document.getElementById('titlediv' + name).appendChild(first_name_div);


  //3 blocks for last name
  var last_name_div = document.createElement("div");
  last_name_div.setAttribute("class", 'titlediv');
  last_name_div.setAttribute("id", 'titlediv' + name);
  document.getElementById('contentofcontent').appendChild(last_name_div);

  last_name_div = document.createElement("p");
  last_name_div.setAttribute('class', 'notatitle');
  last_name_div.setAttribute('align', 'left');
  last_name_div.innerHTML = "Last Name";
  document.getElementById('titlediv' + name).appendChild(last_name_div);

  last_name_div = document.createElement("input");
  last_name_div.setAttribute('class', 'notaninput');
  last_name_div.setAttribute('type', 'text');
  last_name_div.setAttribute('id', 'last_name');
  last_name_div.defaultValue = customer.last_name;
  document.getElementById('titlediv' + name).appendChild(last_name_div);



  //email and password
  cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", 'titlediv');
  cardDiv.setAttribute("id", 'titlediv');
  document.getElementById('contentofcontent').appendChild(cardDiv);

  cardDiv = document.createElement("div");
  cardDiv.setAttribute('class', 'emailpassword');
  cardDiv.innerHTML = 'change email';
  document.getElementById('titlediv').appendChild(cardDiv);

  cardDiv = document.createElement("div");
  cardDiv.setAttribute('class', 'emailpassword');
  cardDiv.innerHTML = 'change password';
  document.getElementById('titlediv').appendChild(cardDiv);


  cardDiv = document.createElement("button");
  cardDiv.setAttribute('class', 'save');
  cardDiv.innerHTML = 'Update';
  cardDiv.addEventListener('click', function() {
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    updateCustomer(first_name, last_name, customer.id);
  });
  document.getElementById('contentofcontent').appendChild(cardDiv);

}


function orders() {
  var orders;
  fetch('/public/db/orders.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {

      orders = myJson;

      $('.content').empty();

      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", 'contentofcontent');
      cardDiv.setAttribute("id", 'contentofcontent');
      container.append(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('style', "padding-top: 20px;");
      cardDiv.innerHTML = 'Order History';
      document.getElementById('contentofcontent').appendChild(cardDiv);

      for (var orderss in orders) {
        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'orderdiv');
        cardDiv.setAttribute("id", 'orderdiv' + orders[orderss]['id']);
        document.getElementById('contentofcontent').appendChild(cardDiv);

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'qrcodediv');
        cardDiv.setAttribute("id", 'qrcodediv' + orders[orderss]['id']);
        document.getElementById('orderdiv' + orders[orderss]['id']).appendChild(cardDiv);

        var qrcode = new QRCode('qrcodediv' + orders[orderss]['id'], {
          text: orders[orderss]['id'] + ',' + orders[orderss]['productid'] + ',' + orders[orderss]['userid'] + ',' + orders[orderss]['date'],
          width: 80,
          height: 80,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });


        for (var name in orders[orderss]) {
          if (name !== 'id' && name !== 'userid') {


            cardDiv = document.createElement("p");
            cardDiv.setAttribute('class', 'notatitle');
            cardDiv.setAttribute('align', 'left');
            cardDiv.innerHTML = name;
            document.getElementById('orderdiv' + orders[orderss]['id']).appendChild(cardDiv);

            cardDiv = document.createElement("p");
            cardDiv.setAttribute('class', 'notacontent');
            cardDiv.setAttribute('align', 'left');

            cardDiv.innerHTML = orders[orderss][name];
            document.getElementById('orderdiv' + orders[orderss]['id']).appendChild(cardDiv);

          }
        }
      }
    })








}




function cards() {
     $('.content').empty();
    /*
  var cards;
  fetch('/public/db/cards.json')
    .then((response) => {
      return response.json();
    })
    .then((myJson) => {

      cards = myJson;

     

      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", 'contentofcontent');
      cardDiv.setAttribute("id", 'contentofcontent');
      container.append(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('style', "padding-top: 20px;");
      cardDiv.innerHTML = 'Saved Cards';
      document.getElementById('contentofcontent').appendChild(cardDiv);

      for (var i = 0; i < cards.length; i++) {
        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'carddiv');
        cardDiv.setAttribute("id", 'carddiv' + i);
        document.getElementById('contentofcontent').appendChild(cardDiv);

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'cardchip');
        cardDiv.setAttribute("id", 'cardchip' + i);
        cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="48px" height="48px" class="cute"><circle cx="4.5" cy="9.5" r="2.5"/><circle cx="9" cy="5.5" r="2.5"/><circle cx="15" cy="5.5" r="2.5"/><circle cx="19.5" cy="9.5" r="2.5"/><path d="M17.34 14.86c-.87-1.02-1.6-1.89-2.48-2.91-.46-.54-1.05-1.08-1.75-1.32-.11-.04-.22-.07-.33-.09-.25-.04-.52-.04-.78-.04s-.53 0-.79.05c-.11.02-.22.05-.33.09-.7.24-1.28.78-1.75 1.32-.87 1.02-1.6 1.89-2.48 2.91-1.31 1.31-2.92 2.76-2.62 4.79.29 1.02 1.02 2.03 2.33 2.32.73.15 3.06-.44 5.54-.44h.18c2.48 0 4.81.58 5.54.44 1.31-.29 2.04-1.31 2.33-2.32.31-2.04-1.3-3.49-2.61-4.8z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        document.getElementById('carddiv' + i).appendChild(cardDiv);
        $('.cute').click(() => {
          for (var i = 0; i < 200; i++) {
            create(i);
          }
        })

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'carddelete');
        cardDiv.setAttribute("id", 'carddelete' + i);
        cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 20 20" width="30" class="closecard"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
        document.getElementById('carddiv' + i).appendChild(cardDiv);

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'cardnumber');
        cardDiv.setAttribute("id", 'cardnumber' + i);
        document.getElementById('carddiv' + i).appendChild(cardDiv);

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'cardexpdate');
        cardDiv.setAttribute("id", 'cardexpdate' + i);
        cardDiv.innerHTML = '<p class="cardtitle">Exp Date</p>'
        document.getElementById('carddiv' + i).appendChild(cardDiv);


        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'cardholder');
        cardDiv.setAttribute("id", 'cardholder' + i);
        cardDiv.innerHTML = '<p class="cardtitle">Name</p>'

        document.getElementById('carddiv' + i).appendChild(cardDiv);


        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", 'cardlogo');
        cardDiv.setAttribute("id", 'cardlogo' + i);
        document.getElementById('carddiv' + i).appendChild(cardDiv);






        cardDiv = document.createElement("p");
        cardDiv.setAttribute('class', 'cardcontentnumber');
        cardDiv.innerHTML = cards[i]['cardnumber'].substring(0, cards[i]['cardnumber'].length / 4) + ' ' + cards[i]['cardnumber'].substring(3, cards[i]['cardnumber'].length / 4 + 3) + ' ' + cards[i]['cardnumber'].substring(7, cards[i]['cardnumber'].length / 4 + 7) + ' ' + cards[i]['cardnumber'].substring(11, cards[i]['cardnumber'].length / 4 + 11);
        document.getElementById('cardnumber' + i).appendChild(cardDiv);

        cardDiv = document.createElement("p");
        cardDiv.setAttribute('class', 'cardinfo');

        cardDiv.innerHTML = cards[i]['expdate'];
        document.getElementById('cardexpdate' + i).appendChild(cardDiv);

        cardDiv = document.createElement("p");
        cardDiv.setAttribute('class', 'cardinfo');

        cardDiv.innerHTML = cards[i]['owner'];
        document.getElementById('cardholder' + i).appendChild(cardDiv);
      }
      cardDiv = document.createElement("div");
      cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="48px" height="48px" class="addcard"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
      cardDiv.addEventListener('click', () => {
        open();
      })
      document.getElementById('contentofcontent').appendChild(cardDiv);


    })

*/






}




function address() {

  console.log("pressesd");
  var addresses = [];

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': customer.id
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
      for (var j = 0; j < result.length; j++) {
        console.log(result[j], "eugh");
        addresses.push(result[j]);
      }

      $('.content').empty();

      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", 'contentofcontent');
      cardDiv.setAttribute("id", 'contentofcontent');
      container.append(cardDiv);
      cardDiv.innerHTML = '<p class=newcardtitle>Addresses</p>';

      if (addresses[0].id === null || addresses[0].id === undefined) {
        cardDiv = document.createElement("p");
        cardDiv.innerHTML = "No addresses declared!";
        document.getElementById('contentofcontent').appendChild(cardDiv);
      } else {
        for (var i = 0; i < addresses.length; i++) {

          cardDiv = document.createElement("div");
          cardDiv.setAttribute("class", 'addressdiv');
          cardDiv.setAttribute("id", 'addressdiv' + addresses[i].id);
          cardDiv.setAttribute("data-address_id", addresses[i].id);
          cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="24px" height="24px" class="editicon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
          document.getElementById('contentofcontent').appendChild(cardDiv);

          cardDiv = document.createElement("div");
          cardDiv.setAttribute("class", 'delete_address_div');
          cardDiv.setAttribute("id", 'delete_address' + i);
          cardDiv.setAttribute("data-address_id", addresses[i].id);
          cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 20 20" width="30" class="delete_icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);

          $('.editicon').click(function() {
            var address_id = $(this).parent().attr('data-address_id');
            var fields = $(this).parent().children('.addresstitle');
            console.log("edit button");
            updateAddress(fields, customer, address_id);
            console.log(address_id);
          });

          $('.delete_icon').click(function() {
            var address_id = $(this).parent().attr('data-address_id');
            console.log("delete button");
            deleteAddress(customer.id, address_id);
          });

          if (addresses[i].shipping === 1) {
            cardDiv = document.createElement("div");
            cardDiv.setAttribute("class", 'shippingdiv');
            cardDiv.setAttribute("id", 'shippingdiv');
            cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="black" width="18px" height="18px" class="shippingicon"><g><rect fill="none" height="24" width="24"/></g><g><path d="M19,9.3V4h-3v2.6L12,3L2,12h3v8h5v-6h4v6h5v-8h3L19,9.3z M10,10c0-1.1,0.9-2,2-2s2,0.9,2,2H10z"/></g></svg><p class=isshipping>Shipping Address</p>';
            document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);
          }

          cardDiv = document.createElement("p");
          cardDiv.setAttribute("class", 'addresstitle');
          cardDiv.innerHTML = addresses[i].name
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);

          cardDiv = document.createElement("p");
          cardDiv.setAttribute("class", 'addresstitle');
          cardDiv.innerHTML = addresses[i].second_name
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);

          cardDiv = document.createElement("p");
          cardDiv.setAttribute("class", 'addresstitle');
          cardDiv.innerHTML = addresses[i].city
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);

          cardDiv = document.createElement("p");
          cardDiv.setAttribute("class", 'addresstitle');
          cardDiv.innerHTML = addresses[i].postcode
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);

          cardDiv = document.createElement("p");
          cardDiv.setAttribute("class", 'addresstitle');
          cardDiv.innerHTML = addresses[i].phone_number
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);

          cardDiv = document.createElement("p");
          cardDiv.setAttribute("class", 'addresstitle');
          cardDiv.innerHTML = addresses[i].shipping;
          document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);


          if (addresses[i].shipping !== 1) {
            cardDiv = document.createElement("button");
            cardDiv.setAttribute("class", 'shippingbutton');
            cardDiv.innerHTML = 'Make shipping address';
            cardDiv.addEventListener('click', function() {
              console.log(event.target.parentNode)
              var address_id = $(this).parent().attr('data-address_id');
              updateShipping(customer.id, address_id);
            });
            document.getElementById('addressdiv' + addresses[i].id).appendChild(cardDiv);
          }


        }
      }



      var cardDiv = document.createElement("div");
      cardDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="48px" height="48px" class="create_address_class" id="create_address"><path d="M0 0h24v24H0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>';
      cardDiv.setAttribute("id", "create_addressID");
      document.getElementById('contentofcontent').appendChild(cardDiv);

      $('#create_address').click(() => {
        console.log("4");
        console.log("5");
        console.log("6");
        writeAddress(customer);
      });

    }).catch(error => console.log('error', error));


}

function updateCustomer(first_name, last_name, id) {
  console.log(first_name, " ", last_name, " ", id);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'first_name': first_name,
    'last_name': last_name,
    'id': id
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/users/update-customer", requestOptions)
    .then(response => response.text())
    .then((result) => {
      console.log(result);
      location.reload();
    }).catch(error => console.log('error', error));
}




function popup(a) {


  var cardDiv = document.createElement("div");
  cardDiv.setAttribute("class", 'popup');
  document.getElementById('main').appendChild(cardDiv);
  $('.profileinfo').css('filter', 'blur(4px)');

}




function create(i) {
  var width = Math.random() * 8;
  var height = width * 0.4;
  var colourIdx = Math.ceil(Math.random() * 3);
  var colour = "red";
  switch (colourIdx) {
    case 1:
      colour = "yellow";
      break;
    case 2:
      colour = "blue";
      break;
    default:
      colour = "red";
  }
  $('<div class="confetti-' + i + ' ' + colour + '"></div>').css({
    "width": width + "px",
    "height": height + "px",
    "top": -Math.random() * 20 + "%",
    "left": Math.random() * 100 + "%",
    "opacity": 1,
    "transform": "rotate(" + Math.random() * 360 + "deg)"
  }).appendTo('#main');

  drop(i);
}

function drop(x) {
  $('.confetti-' + x).animate({
    top: "200%",
  }, Math.random() * 3000 + 3000, function() {
    //reset(x);
  });
}

function reset(x) {
  $('.confetti-' + x).animate({
    "top": -Math.random() * 20 + "%",
    "left": "-=" + Math.random() * 15 + "%"
  }, 0, function() {
    drop(x);
  });
}

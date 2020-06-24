"use strict";


var final = [];
var itemsFile;
var usersFile;
var categoriesFile = [
  [],
  [],
  []
];
var bigboss = [];

var typeclassificationheader = '';
var sectionclassificationheader = '';
var categoryclassificationheader = '';
var subcaegoryclassificationheader = '';
var complextitle = '';
var stringArray;
var objectArray = [];
var product_ids = [];
var unique_products = [];
var myHeaders;

$('.dropbtn-cart').click(function () {
  window.location.replace('/public/path/cart.html');
});

function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}




function start() {


  var items = read_cookie('items');
  var loggedin = read_cookie('loggedin');
  var customer;

  SectionsStuff();
  PrepBasket();


  if (loggedin === '1') {
    customer = read_cookie('customer');

  }
  if (loggedin === null) {
    var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "loggedin=0; expires=" + now.toUTCString() + "; " + "path=/";
    loggedin = read_cookie('loggedin');

  }



  myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const cust_data = {
    'id': customer
  };

  var raw = JSON.stringify(cust_data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/users/get-customer-by-id", requestOptions)
    .then(response => response.json())
    .then((result) => {
      loadProfile(result[0]);
    })
    .catch(error => console.log('error', error));



  addSearch();
  $("#inputsearch").keyup(function (e) {
    var code = e.key; // recommended to use e.key, it's normalized across devices and languages
    if (code === "Enter") e.preventDefault();
    if (code === " " || code === "Enter" || code === "," || code === ";") {
      document.location.href = '/public/path/search.html?' + $(this).val();

    } // missing closing if brace
  });

  function loadProfile(customer) {
    if (loggedin === '0') {
      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "dropdown-content-profile");
      cardDiv.setAttribute("id", "dropdown-content-profile");
      document.getElementById("dropdown-profile").appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "shoppingtitle");
      cardDiv.setAttribute("id", "shoppingtitle");
      document.getElementById("dropdown-content-profile").appendChild(cardDiv);

      cardDiv = document.createElement("h4");
      cardDiv.innerHTML = 'New customer?';
      document.getElementById("shoppingtitle").appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.innerHTML = 'Register now for some reason.';
      document.getElementById("shoppingtitle").appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "signin");
      cardDiv.setAttribute("id", "signin");
      document.getElementById("dropdown-content-profile").appendChild(cardDiv);

      cardDiv = document.createElement("button");
      cardDiv.setAttribute("class", "profilebtn");
      cardDiv.innerHTML = 'Register/Sign in';
      document.getElementById('signin').appendChild(cardDiv);


      $(".dropbtn-profile, .profilebtn").click(function () {
        document.location.href = '/public/path/login.html';

      });



    } else if (loggedin === '1') {
      if (customer !== null) {

        var cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "dropdown-content-profile");
        cardDiv.setAttribute("id", "dropdown-content-profile");
        document.getElementById("dropdown-profile").appendChild(cardDiv);

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "shoppingtitle");
        cardDiv.setAttribute("id", "shoppingtitle");
        document.getElementById("dropdown-content-profile").appendChild(cardDiv);

        cardDiv = document.createElement("h4");
        cardDiv.innerHTML = customer.first_name + " " + customer.last_name;
        document.getElementById("shoppingtitle").appendChild(cardDiv);

        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "signin");
        cardDiv.setAttribute("id", "signin");
        document.getElementById("dropdown-content-profile").appendChild(cardDiv);

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "order");
        cardDiv.innerHTML = 'Order History';
        document.getElementById('signin').appendChild(cardDiv);
        $('#order').click(function () {
          document.location.href = '/public/path/profile.html?order';

        });

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "view");
        cardDiv.innerHTML = 'View Profile';
        document.getElementById('signin').appendChild(cardDiv);
        $('#view').click(function () {
          document.location.href = '/public/path/profile.html';

        });

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "edit");
        cardDiv.innerHTML = 'Edit Profile';
        document.getElementById('signin').appendChild(cardDiv);
        $('#edit').click(function () {
          document.location.href = '/public/path/profile.html?edit';

        });

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "addresses");
        cardDiv.innerHTML = 'Addresses';
        document.getElementById('signin').appendChild(cardDiv);
        $('#addresses').click(function () {
          document.location.href = '/public/path/profile.html?address';

        });


        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "signout");
        cardDiv.innerHTML = 'Sign Out';
        cardDiv.addEventListener('click', function () {
          signOut();
        });
        document.getElementById('signin').appendChild(cardDiv);

      }
    }

  }






  function loadCategories(final) {

    for (var key in final) {



      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "dropdown-subcategory");
      cardDiv.setAttribute("id", "dropdown-subcategory" + key);
      document.getElementById("navmenu").appendChild(cardDiv);

      cardDiv = document.createElement("a");
      cardDiv.setAttribute("class", "dropbtn-subcategory");
      cardDiv.setAttribute("id", "dropbtn-subcategory" + key);
      cardDiv.setAttribute("data-class", 'section');
      cardDiv.innerHTML = key;
      document.getElementById("dropdown-subcategory" + key).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "dropdown-content-subcategory");
      cardDiv.setAttribute("id", "dropdown-content-subcategory" + key);
      document.getElementById("dropdown-subcategory" + key).appendChild(cardDiv);

      for (var secondKey in final[key]) {


        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "category");
        cardDiv.setAttribute("id", "category" + secondKey + key);
        document.getElementById("dropdown-content-subcategory" + key).appendChild(cardDiv);


        cardDiv = document.createElement("ul");
        cardDiv.setAttribute("id", "ul" + secondKey + key);
        cardDiv.setAttribute("data-section", "" + key);
        cardDiv.setAttribute("data-category", "" + secondKey);
        document.getElementById("category" + secondKey + key).appendChild(cardDiv);

        cardDiv = document.createElement("li");
        cardDiv.setAttribute('class', 'categorytitle');
        cardDiv.setAttribute("id", secondKey);
        cardDiv.setAttribute("data-class", 'category');
        cardDiv.innerHTML = secondKey;
        document.getElementById("ul" + secondKey + key).appendChild(cardDiv);

        for (var thirdKey in final[key][secondKey]) {

          cardDiv = document.createElement("li");
          cardDiv.setAttribute('class', 'subcategorytitle');
          cardDiv.setAttribute("id", thirdKey);
          cardDiv.setAttribute("data-class", 'subcategory');
          cardDiv.innerHTML = thirdKey;

          document.getElementById("ul" + secondKey + key).appendChild(cardDiv);

        }

      }
      if ($(window).scrollTop() >= 12) {
        $('#navbar').attr('class', 'navbar');
        $('#categorySpace').attr('class', 'categorySpace');
        $('.logoImgnew').attr('class', 'logoImg');
        $('.dropbtn-subcategory').attr('class', 'dropbtn-subcategorynew');
        var icon = $('.dropbtn-profile.noscroll');
        icon.removeClass('noscroll');
        icon.addClass('scrolled');
        icon = $('.dropbtn-cart.noscroll');
        icon.removeClass('noscroll');
        icon.addClass('scrolled');
      } else {
        $('#navbar').attr('class', 'navbarnew');
        $('#categorySpace').attr('class', 'categorySpacenew');
        $('.logoImg').attr('class', 'logoImgnew');
        $('.dropbtn-subcategorynew').attr('class', 'dropbtn-subcategory');
        var icon = $('.dropbtn-profile.scrolled');
        icon.removeClass('scrolled');
        icon.addClass('noscroll');
        icon = $('.dropbtn-cart.scrolled');
        icon.removeClass('scrolled');
        icon.addClass('noscroll');

      }


    }

    var sectiontitles = [];
    var categorytitles = [];
    var subcategorytitles = [];
    sectiontitles = document.getElementsByClassName('dropbtn-subcategory');
    categorytitles = document.getElementsByClassName('categorytitle');
    subcategorytitles = document.getElementsByClassName('subcategorytitle');

    for (var i = 0; i < sectiontitles.length; i++) {
      sectiontitles[i].addEventListener('click', function () {
        document.location.href = '/public/path/selected.html?section&' + event.target.innerHTML.toLowerCase() + '&null&null';
      });
    }
    for (var i = 0; i < categorytitles.length; i++) {
      categorytitles[i].addEventListener('click', function () {
        document.location.href = '/public/path/selected.html?category&' + event.target.parentNode.dataset.section + '&' + event.target.innerHTML.toLowerCase() + '&null';
      });
    }
    for (var i = 0; i < subcategorytitles.length; i++) {
      subcategorytitles[i].addEventListener('click', function () {
        document.location.href = '/public/path/selected.html?subcategory&' + event.target.parentNode.dataset.section + '&' + event.target.parentNode.dataset.category + '&' + event.target.innerHTML.toLowerCase();
      });
    }

  }

  function signOut() {
    var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "loggedin=0; expires=" + now.toUTCString() + "; " + "path=/";
    document.cookie = "customer=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    location.href = "/public/path/login.html";
  }

  function addSearch() {

    $(".search").click(function () {
      $('.searchbar').attr('class', 'searchbaractive');

      $('.inputsearch').attr('class', 'inputsearchactive');

    });

    $(".closesearch").click(function () {
      $('.searchbaractive').attr('class', 'searchbar');

      $('.inputsearchactive').attr('class', 'inputsearch');

    });

    document.addEventListener('keydown', function (event) {
      if (event.keyCode == 13) {
        if ($(".inputsearch").is(":focus")) {
          var now = new Date();
          now.setFullYear(now.getFullYear() + 2);
          document.cookie = "query=" + $(".inputsearch").val() + ":" + $(".inputsearch").val() + "; expires=" + now.toUTCString() + "; " + "path=path/search.html";
          document.location.href = '/public/path/search.html?' + $(".inputsearch").val();

        }
      }
    });



  }








  function SectionsStuff() {

    myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");


    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://192.168.0.107:3000/classifications/class-groups", requestOptions)
      .then(response => response.json())
      .then((result) => {
        Order(result);
      })
      .catch(error => console.log('error', error));
  }

  function Order(data) {
    var unique_sections = [...new Set(data.map(x => x.section))];
    var uniqueBoss = {};

    for (var i = 0; i < data.length; i++) {
      uniqueBoss[data[i]['section']] = {};
      bigboss[data[i]['section']] = {
        sec_img: data[i]['sec_img']
      };
    }
    for (var i = 0; i < data.length; i++) {
      uniqueBoss[data[i]['section']][data[i]['category']] = {};
      bigboss[data[i]['section']][data[i]['category']] = {
        cat_img: data[i]['cat_img']
      };
    }
    for (var i = 0; i < data.length; i++) {
      uniqueBoss[data[i]['section']][data[i]['category']][data[i]['subcategory']] = null;
      bigboss[data[i]['section']][data[i]['category']][data[i]['subcategory']] = {
        sub_img: data[i]['sub_img']
      };
    }
    loadCategories(uniqueBoss);
    if (typeclassificationheader === 'section') {
      setCover1(sectionclassificationheader)
    } else if (typeclassificationheader === 'category') {
      setCover2(sectionclassificationheader, categoryclassificationheader);
    } else if (typeclassificationheader === 'subcategory') {
      setCover3(sectionclassificationheader, categoryclassificationheader, subcategoryclassificationheader);
    } else if (typeclassificationheader === 'item') {
      $('.bigimage').attr('hidden', 'hidden');
      setHeaderStyle();
    }

    setTitle2(complextitle);


  }


















} //WHAT

function setTitle(a) {
  $(".bigtitle").text(a);
}

function setTitle2(a) {
  $(".querytitle").text(a);
}

function setCover1(a) {
  if (a in bigboss) {
    $('.bigimageimage').attr('src', 'http://192.168.0.107:3000' + bigboss[a]['sec_img']);
  }
}

function setCover2(a, b) {
  if (a in bigboss) {
    $('.bigimageimage').attr('src', 'http://192.168.0.107:3000' + bigboss[a][b]['cat_img']);
  }
}

function setCover3(a, b, c) {
  if (a in bigboss) {
    $('.bigimageimage').attr('src', 'http://192.168.0.107:3000' + bigboss[a][b][c]['sub_img']);
  }
}


$(document).ready(function () {

});

$(window).scroll(function () {

  if ($(this).scrollTop() >= 12) {
    $('#navbar').attr('class', 'navbar');
    $('#categorySpace').attr('class', 'categorySpace');
    $('.logoImgnew').attr('class', 'logoImg');
    $('.dropbtn-subcategory').attr('class', 'dropbtn-subcategorynew');
    var icon = $('.dropbtn-profile.noscroll');
    icon.removeClass('noscroll');
    icon.addClass('scrolled');
    icon = $('.dropbtn-cart.noscroll');
    icon.removeClass('noscroll');
    icon.addClass('scrolled');

  } else {
    $('#navbar').attr('class', 'navbarnew');
    $('#categorySpace').attr('class', 'categorySpacenew');
    $('.logoImg').attr('class', 'logoImgnew');
    $('.dropbtn-subcategorynew').attr('class', 'dropbtn-subcategory');
    var icon = $('.dropbtn-profile.scrolled');
    icon.removeClass('scrolled');
    icon.addClass('noscroll');
    icon = $('.dropbtn-cart.scrolled');
    icon.removeClass('scrolled');
    icon.addClass('noscroll');


  }
});



function setHeaderStyle() {
  $('#navbar').attr('class', 'navbaritem');
  $('#navbar').attr('id', 'navbaritem');
}


function Reload() {
  $('#itemsdropdown').load(document.URL + ' #itemsdropdown', function () {
    PrepBasket();



  })

}


function PrepBasket() {
  stringArray = read_cookie('items');
  objectArray = [];
  product_ids = [];
  unique_products = [{
    id: -1,
    color: 'none',
    quantity: -1
  }];

  if (stringArray != null) {
    stringArray = stringArray.split(",");

    for (var iii = 0; iii < stringArray.length; iii++) {
      var smallArray = stringArray[iii].split(':');

      objectArray.push(smallArray);


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

  fetch("http://192.168.0.107:3000/products/products-images", requestOptions)
    .then(response => response.json())
    .then(result => {
      var tempArray = [];
      var lastColor = 'none';
      for (var i = 0; i < objectArray.length; i++) {
        lastColor = 'none'
        for (var q = 0; q < result.length; q++) {
          if (objectArray[i][0] === result[q]['id'].toString() && objectArray[i][2] === result[q]['image_colour']) {



            if (lastColor !== result[q]['image_colour']) {


              lastColor = result[q]['image_colour'];
              tempArray.push({
                id: result[q]['id'],
                quantity: objectArray[i][1],
                color: result[q]['image_colour'],
                image_url: result[q]['image_url'],
                name: result[q]['name'],
                price: result[q]['price'],
                stripe_price: result[q].stripe_price
              });
            }


          }

        }

      }
      /* var found2=false;
       for(var i=0; i<tempArray.length; i++){
        found2=false;
           for(var q=0; q<unique_products.length; q++){
               if(tempArray[i].color===unique_products[q].color){
                   found2=true;
               }
           }
           if(!found2){
           unique_products.push(tempArray[i]);

           }
           
       }
       unique_products.shift();*/
      unique_products = tempArray;
      if (typeof (createCart) != 'undefined') {
        createCart(tempArray)
      }

      loadBasket(tempArray);


    }).catch(error => console.log('error', error));
}


function loadBasket(products) {
  var cardDiv;
  var product_id;

  for (var i = 0; i < products.length; i++) {
    product_id = products[i].id + products[i].color;

    cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "basketitem");
    cardDiv.setAttribute("id", "basketitem" + product_id);
    document.getElementById("itemsdropdown").appendChild(cardDiv);

    cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "basketimage");
    cardDiv.setAttribute("id", "basketimage" + product_id);
    document.getElementById("basketitem" + product_id).appendChild(cardDiv);

    cardDiv = document.createElement("img");
    cardDiv.setAttribute("class", "image");
    if (products[i].image_url !== null) {
      cardDiv.setAttribute("src", 'http://192.168.0.107:3000' + products[i].image_url);


    } else {

      cardDiv.setAttribute("src", undefined);

    }

    $(cardDiv).on("error", function () {
      $(this).attr('src', 'http://192.168.0.107:3000/public/product_images/default.png');
    });
    document.getElementById("basketimage" + product_id).appendChild(cardDiv);



    cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "basketinfo");
    cardDiv.setAttribute("id", "basketinfo" + product_id);
    document.getElementById("basketitem" + product_id).appendChild(cardDiv);

    cardDiv = document.createElement("p");
    cardDiv.innerHTML = products[i].name;
    document.getElementById("basketinfo" + product_id).appendChild(cardDiv);


    cardDiv = document.createElement("p");
    cardDiv.innerHTML = "quantity: " + products[i].quantity;
    document.getElementById("basketinfo" + product_id).appendChild(cardDiv);

    cardDiv = document.createElement("p");
    cardDiv.innerHTML = "col/mat: " + products[i].color;
    document.getElementById("basketinfo" + product_id).appendChild(cardDiv);


    cardDiv = document.createElement("p");
    cardDiv.innerHTML = 'Price: ' + products[i].price + '$';
    document.getElementById("basketinfo" + product_id).appendChild(cardDiv);
    $('.actualbasketprice').html(+($('.actualbasketprice').html()) + ((+products[i].price) * (+products[i].quantity)))






  }
}

function newFetch(id, color) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const data = {
    'id': id,
    'colour': color
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://192.168.0.107:3000/products/single-images-basket", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result)

    });

}
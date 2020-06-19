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

function start() {


  var items = read_cookie('items');
  var loggedin = read_cookie('loggedin');
  var customer;
  var stringArray = read_cookie('items');
  var objectArray = [];
  var product_ids = [];
  var unique_products = [];
  SectionsStuff();

  if (stringArray != null) {
    stringArray = stringArray.split(",");

    for (var iii = 0; iii < stringArray.length; iii++) {
      var smallArray = stringArray[iii].split(':');


      objectArray.push(smallArray);


    }

  } else {
    stringArray = [];
  }

  if (loggedin === '1') {
    customer = read_cookie('customer');

  }
  if (loggedin === null) {
    var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "loggedin=0; expires=" + now.toUTCString() + "; " + "path=/";
    loggedin = read_cookie('loggedin');

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

      for (var i = 0; i < product_ids.length; i++) {
        for (var j = 0; j < result.length; j++) {



          if (result[j].id === product_ids[i]) {
            unique_products.push(result[j]);
            break;
          }
        }
      }

      loadBasket(unique_products);

    }).catch(error => console.log('error', error));


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
        cardDiv.setAttribute("id", "wallet");
        cardDiv.innerHTML = 'Wallet';
        document.getElementById('signin').appendChild(cardDiv);
        $('#wallet').click(function () {
          document.location.href = '/public/path/profile.html?wallet';

        });


        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "signout");
        cardDiv.innerHTML = 'Sign Out';
        cardDiv.addEventListener('click', function () {
          signOut()
        });
        document.getElementById('signin').appendChild(cardDiv);

      }
    }

  }

  function loadBasket(products) {
    var cardDiv;
    var product_id;

    for (var i = 0; i < products.length; i++) {
      product_id = products[i].id;

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

      for (var o = 0; o < objectArray.length; o++) {
        if (objectArray[o][0] == product_id) {
          cardDiv = document.createElement("p");
          cardDiv.innerHTML = "quantity: " + objectArray[o][1];
          document.getElementById("basketinfo" + product_id).appendChild(cardDiv);
        }
      }


      cardDiv = document.createElement("p");
      cardDiv.innerHTML = products[i].price;
      document.getElementById("basketinfo" + product_id).appendChild(cardDiv);
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


    }

    var sectiontitles = []
    var categorytitles = []
    var subcategorytitles = []
    sectiontitles = document.getElementsByClassName('dropbtn-subcategory');
    categorytitles = document.getElementsByClassName('categorytitle');
    subcategorytitles = document.getElementsByClassName('subcategorytitle');

    for (var i = 0; i < sectiontitles.length; i++) {
      sectiontitles[i].addEventListener('click', function () {
        document.location.href = '/public/path/selected.html?section&' + event.target.innerHTML.toLowerCase() + '&null&null'
      })
    }
    for (var i = 0; i < categorytitles.length; i++) {
      categorytitles[i].addEventListener('click', function () {
        document.location.href = '/public/path/selected.html?category&' + event.target.parentNode.dataset.section + '&' + event.target.innerHTML.toLowerCase() + '&null'
      })
    }
    for (var i = 0; i < subcategorytitles.length; i++) {
      subcategorytitles[i].addEventListener('click', function () {
        document.location.href = '/public/path/selected.html?subcategory&' + event.target.parentNode.dataset.section + '&' + event.target.parentNode.dataset.category + '&' + event.target.innerHTML.toLowerCase()
      })
    }

  }




  function read_cookie(key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
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
        Order(result)
      })
      .catch(error => console.log('error', error));
  }

  function Order(data) {

    var unique_sections = [...new Set(data.map(x => x.section))];
    var uniqueBoss = {};

    for (var i = 0; i < data.length; i++) {
      uniqueBoss[data[i]['section']] = {}
      bigboss[data[i]['section']] = {
        sec_img: data[i]['sec_img']
      }
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
      setCover2(sectionclassificationheader, categoryclassificationheader)
    } else if (typeclassificationheader === 'subcategory') {
      setCover3(sectionclassificationheader, categoryclassificationheader, subcategoryclassificationheader)
    } else if (typeclassificationheader === 'item') {
      $('.bigimage').attr('hidden', 'hidden');
      setHeaderStyle();
    }

    setTitle2(complextitle)


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
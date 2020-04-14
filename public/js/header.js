var itemsFile;
var usersFile;
var categoriesFile = [[], [], []];


function start() {

  var items = read_cookie('items');
  var loggedin = read_cookie('loggedin');
  var customer;
  var stringArray = read_cookie('items');
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

  fetch("http://192.168.0.105:3000/products/products-images", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(product_ids);
      console.log(result);
      for (var i = 0; i < product_ids.length; i++) {
        for (var j = 0; j < result.length; j++) {
          console.log(typeof(result[j].id), typeof(product_ids[i]));


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

    fetch("http://192.168.0.105:3000/users/get-customer-by-id", requestOptions)
      .then(response => response.json())
      .then((result) => {
        loadProfile(result[0]);
      })
      .catch(error => console.log('error', error));


  fetch('http://192.168.0.105:3000/classifications/section')
    .then(response => response.json())
    .then(data => {
      categoriesFile[0].push("section");
      for (var i = 0; i < data.length; i++) {
        categoriesFile[0].push(data[i]);
      }
    }).catch(error => console.error(error));

  fetch('http://192.168.0.105:3000/classifications/category')
    .then(response => response.json())
    .then(data => {
      categoriesFile[1].push("category");
      for (var i = 0; i < data.length; i++) {
        categoriesFile[1].push(data[i]);
      }
    }).catch(error => console.error(error));

  fetch('http://192.168.0.105:3000/classifications/subcategory')
    .then(response => response.json())
    .then(data => {
      categoriesFile[2].push("subcategory");
      for (var i = 0; i < data.length; i++) {
        categoriesFile[2].push(data[i]);
      }

      loadCategories();
    }).catch(error => console.error(error));


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


      $(".dropbtn-profile, .profilebtn").click(function() {
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
        $('#order').click(function() {
          document.location.href = '/public/path/profile.html?order';

        });

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "view");
        cardDiv.innerHTML = 'View Profile';
        document.getElementById('signin').appendChild(cardDiv);
        $('#view').click(function() {
          document.location.href = '/public/path/profile.html';

        });

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "edit");
        cardDiv.innerHTML = 'Edit Profile';
        document.getElementById('signin').appendChild(cardDiv);
        $('#edit').click(function() {
          document.location.href = '/public/path/profile.html?edit';

        });

        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "wallet");
        cardDiv.innerHTML = 'Wallet';
        document.getElementById('signin').appendChild(cardDiv);
        $('#wallet').click(function() {
          document.location.href = '/public/path/profile.html?wallet';

        });


        cardDiv = document.createElement("button");
        cardDiv.setAttribute("class", "profilebtn");
        cardDiv.setAttribute("id", "signout");
        cardDiv.innerHTML = 'Sign Out';
        cardDiv.addEventListener('click', function() {
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
      var path = products[i].image_path;
      path = path.replace(".", "");
      cardDiv.setAttribute("src", path + products[i].image_name);
      document.getElementById("basketimage" + product_id).appendChild(cardDiv);



      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "basketinfo");
      cardDiv.setAttribute("id", "basketinfo" + product_id);
      document.getElementById("basketitem" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.innerHTML = products[i].name;
      document.getElementById("basketinfo" + product_id).appendChild(cardDiv);

      for (var j = 0; j < objectArray.length; j++) {
        if (objectArray[j][0] == product_id) {
          cardDiv = document.createElement("p");
          cardDiv.innerHTML = "quantity: " + objectArray[j][1];
          cardDiv.setAttribute('id', 'quantity' + product_id);
          document.getElementById("basketinfo" + product_id).appendChild(cardDiv);
        }
      }

      cardDiv = document.createElement("p");
      cardDiv.innerHTML = products[i].price;
      document.getElementById("basketinfo" + product_id).appendChild(cardDiv);
    }
  }




  function loadCategories() {

    for (var i = 1; i < categoriesFile[0].length; i++) {



      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "dropdown-subcategory");
      cardDiv.setAttribute("id", "dropdown-subcategory" + categoriesFile[0][i]['name']);
      document.getElementById("navmenu").appendChild(cardDiv);

      cardDiv = document.createElement("a");
      cardDiv.setAttribute("class", "dropbtn-subcategory");
      cardDiv.setAttribute("id", "dropbtn-subcategory" + categoriesFile[0][i]['name']);
      cardDiv.setAttribute("data-class", categoriesFile[0][0]);
      cardDiv.innerHTML = categoriesFile[0][i]['name'];
      document.getElementById("dropdown-subcategory" + categoriesFile[0][i]['name']).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "dropdown-content-subcategory");
      cardDiv.setAttribute("id", "dropdown-content-subcategory" + categoriesFile[0][i]['name']);
      document.getElementById("dropdown-subcategory" + categoriesFile[0][i]['name']).appendChild(cardDiv);

      for (var ii = 1; ii < categoriesFile[1].length; ii++) {


        cardDiv = document.createElement("div");
        cardDiv.setAttribute("class", "category");
        cardDiv.setAttribute("id", "category" + categoriesFile[1][ii]['name'] + categoriesFile[0][i]['name']);
        document.getElementById("dropdown-content-subcategory" + categoriesFile[0][i]['name']).appendChild(cardDiv);


        cardDiv = document.createElement("ul");
        cardDiv.setAttribute("id", "ul" + categoriesFile[1][ii]['name'] + categoriesFile[0][i]['name']);
        document.getElementById("category" + categoriesFile[1][ii]['name'] + categoriesFile[0][i]['name']).appendChild(cardDiv);

        cardDiv = document.createElement("li");
        cardDiv.setAttribute('class', 'title');
        cardDiv.setAttribute("id", categoriesFile[1][ii]['name']);
        cardDiv.setAttribute("data-class", categoriesFile[1][0]);
        cardDiv.innerHTML = categoriesFile[1][ii]['name'];
        document.getElementById("ul" + categoriesFile[1][ii]['name'] + categoriesFile[0][i]['name']).appendChild(cardDiv);

        for (var iii = 1; iii < categoriesFile[(1 + 1)].length; iii++) {


          cardDiv = document.createElement("li");
          cardDiv.setAttribute('class', 'sub');
          cardDiv.setAttribute("id", categoriesFile[(1 + 1)][iii]['name']);
          cardDiv.setAttribute("data-class", categoriesFile[2][0]);
          cardDiv.innerHTML = categoriesFile[(1 + 1)][iii]['name'];

          document.getElementById("ul" + categoriesFile[1][ii]['name'] + categoriesFile[0][i]['name']).appendChild(cardDiv);

        }

      }


}

    var titles = []
    titles = titles.concat(document.getElementsByClassName('title'), document.getElementsByClassName('dropbtn-subcategory'), document.getElementsByClassName('sub'));
    //console.log(titles);
    //console.log(titles[0]);


    for (var o = 0; o < titles.length; o++) {
      for (var m = 0; m < titles[o].length; m++) {

        titles[o][m].addEventListener('click', () => {

          document.location.href = '/public/path/category.html?' + event.target.dataset.class + '&' + event.target.innerHTML.toLowerCase();






        });


      }
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

    $(".search").click(function() {

      $(".searchbar").css("width", "100%");
      $(".search").css("display", "none");
      $(".closesearch").css("display", "block");


    });

    $(".closesearch").click(function() {
      $(".searchbar").css("width", "0%");
      $(".search").css("display", "block");
      $(".closesearch").css("display", "none");

    });

    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 13) {
        if ($(".inputsearch").is(":focus")) {
          var now = new Date();
          now.setFullYear(now.getFullYear() + 2);
          document.cookie = "query=" + $(".inputsearch").val() + ":" + $(".inputsearch").val() + "; expires=" + now.toUTCString() + "; " + "path=path/search.html";
          document.location.href = '/public/path/search.html?' + $(".inputsearch").val();
          console.log(now);
          //console.log($(".inputsearch").val());
        }
      }
    });



  }


}

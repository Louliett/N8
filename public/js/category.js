var query;
var found = [];


$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    console.log('loaded');
    start();

  });

  query = decodeURIComponent(window.location.search);
  query = query.replace('?', '').toLowerCase();
  query = query.split("&");
  var table = query[0];
  var name = query[1];

  $(document).ready(function() {
    $(".query").text('"' + query + '"');
  });

  console.log(query + " --------------------------------------");

  var product_list;
  var jsonFile;
  var maxItemsDisplay = 0;
  var startValue = 0;


  $('.categorytitle').text(query);




  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'name': name
  }

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };


  fetch('http://localhost:3000/products/' + table, requestOptions)
    .then(response => response.json())
    .then(data => {
      product_list = data
      for (var i = 0; i < product_list.length; i++) {
        fetchImages(product_list[i].ean, i);
      }
    }).catch(error => console.error(error));



  function fetchImages(ean, index) {
    const data = {
      ean: ean
    };

    var raw = JSON.stringify(data);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch('http://localhost:3000/products/ean-img', requestOptions)
      .then(response => response.json())
      .then(data => {
        var images = [];
        data.forEach((element, index, array) => {
          images.push("/public/images/" + element.name);
        });
        fetchClassification(images, index);
      }).catch(error => console.error(error));


  }


  function fetchClassification(images, index) {


    var x = $(document).width();
    var y = screen.height;

    var navbar = document.getElementById("navbar");
    navbar.setAttribute("style", "width:100%; height:" + 32 + "px;");

    var height = navbar.offsetHeight;



    $(window).resize(function() {
      x = $(window).width();
      y = screen.height;
      navbar.setAttribute("style", "width:100%; height:" + 32 + "px;");
      var height = navbar.offsetHeight;
      var wrapper = document.getElementById("categorySpace");
      //wrapper.setAttribute("style", "margin-top:"+height+"px;");
    });



    $(window).resize(function() {


      var rows = document.getElementById("itemrow");

      var elements = rows.childNodes;

      var x = $(document).width();
      var xx = window.innerWidth;
      var y = screen.height;
      var ratio = window.devicePixelRatio || 1;
      var w = screen.width * ratio;
      var h = screen.height * ratio;
      for (var i = 0; i < elements.length; i++) {

        var item = document.getElementById(elements[i].getAttribute("id"));

        if (w > 740) {


          item.setAttribute("style", "width: " + Math.floor(x / 4) + "px; height: " + Math.floor(y * 0.8) + "px;");
        } else {
          item.setAttribute("style", "width: " + Math.floor(x / 2) + "px; height: " + Math.floor(h * 1.1) + "px; padding:4px;");

        }
      }


    });


    startValue++;
    var x = $("#main").width();
    var xx = window.innerWidth;
    var y = screen.height;
    var ratio = window.devicePixelRatio || 1;
    var w = screen.width * ratio;
    var h = screen.height * ratio;
    var cardDiv = document.createElement("div");
    var containerName = product_list[index].id;

    if (w > 740) {
      cardDiv.setAttribute("class", "productcontainer");
      cardDiv.setAttribute("id", containerName);
      cardDiv.setAttribute("style", "width: " + (Math.floor(x / 4)) + "px; height: " + Math.floor(y * 0.8) + "px;");
      document.getElementById("itemrow").appendChild(cardDiv);
    } else {

      cardDiv.setAttribute("class", "productcontainer");
      cardDiv.setAttribute("id", containerName);
      cardDiv.setAttribute("style", "width: " + Math.floor(x / 2) + "px; height: " + Math.floor(h * 1.1) + "px; padding:4px;");
      document.getElementById("itemrow").appendChild(cardDiv);

    }
    $(cardDiv).click(function() {
      var now = new Date();
      now.setFullYear(now.getFullYear() + 2);
      document.cookie = "id=" + $(this).attr('id') + "; expires=" + now.toUTCString() + "; " + "path=path/search.html";
      document.location.href = "/public/path/item.html?" + $(this).attr('id');
    });


    var cardImg = document.createElement("img");
    cardImg.setAttribute("class", "productimg");
    cardImg.setAttribute("src", images[0]);
    //cardImg.setAttribute("src", "img/loading.gif");
    document.getElementById(containerName).appendChild(cardImg);
    var ratio = cardImg.naturalWidth / cardImg.naturalHeight;
    var x = $(document).width();


    var cardDivInner = document.createElement("div");
    cardDivInner.setAttribute("class", "productdescription");
    cardDivInner.setAttribute("id", "productdescription" + containerName);

    document.getElementById(containerName).appendChild(cardDivInner);
    var x = $(document).width();
    // TODO: fix classification below line 205
    var cardTag = document.createElement("strong");
    cardTag.innerHTML = product_list[index].brand;
    document.getElementById("productdescription" + containerName).appendChild(cardTag);
    var x = $(document).width();

    var cardTitle = document.createElement("p");
    cardTitle.setAttribute("class", "producttitle");
    cardTitle.innerHTML = product_list[index].name;
    document.getElementById("productdescription" + containerName).appendChild(cardTitle);
    var x = $("#main").width();

    var ratio = window.devicePixelRatio || 1;
    var w = screen.width * ratio;
    var h = screen.height * ratio;


    var x = window.devicePixelRatio;




    var priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "price");
    priceDiv.setAttribute("id", "price" + index);
    priceDiv.innerHTML = product_list[index].price;
    document.getElementById(containerName).appendChild(priceDiv);








  }

});

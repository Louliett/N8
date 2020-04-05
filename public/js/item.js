
$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    console.log('loaded');
    start();

  });


  var searches = document.cookie;
  var query = decodeURIComponent(window.location.search);
  query = query.replace('?', '');
  var itemId = query;


  var product;
  var jsonFile;
  var basket_image;

  var stringArray = read_cookie('items');
  var objectArray = [];

  if (stringArray != null) {
    stringArray = stringArray.split(",");
    console.log(stringArray);
    for (var iii = 0; iii < stringArray.length; iii++) {
      var smallArray = stringArray[iii].split(':');
      console.log(smallArray);

      objectArray.push(smallArray);
      console.log(objectArray);

    }
  } else {
    stringArray = [];
  }



  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'id': itemId
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch('http://localhost:3000/products/id', requestOptions)
    .then(response => response.json())
    .then(data => {
      product = data[0];
      console.log(product);
      fetchImages(product.ean);
    }).catch(error => console.error(error));



  function fetchImages(ean) {
    console.log(ean + " from images");
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
        console.log(data);
        var images = [];
        data.forEach((element, index, array) => {
          images.push("/public/images/" + element.name);
        });
        basket_image = images[0];
        fetchProduct(images);
      }).catch(error => console.error(error));


  }





  function fetchProduct(images) {


    var x = $(document).width();
    var y = screen.height;

    var navbar = document.getElementById("navbar");
    navbar.setAttribute("style", "width:100%; height:" + 32 + "px;");

    var height = navbar.offsetHeight;
    console.log(x + " start");


    $(window).resize(function() {
      x = $(window).width();
      y = screen.height;
      navbar.setAttribute("style", "width:100%; height:" + 32 + "px;");
      var height = navbar.offsetHeight;
      var wrapper = document.getElementById("categorySpace");
      //wrapper.setAttribute("style", "margin-top:"+height+"px;");
    });
    createSlides(images);


    var slideIndex = 1;
    showSlides(slideIndex);

    // Next/previous controls
    function plusSlides(n) {
      showSlides(slideIndex += n);
    }

    // Thumbnail image controls
    function currentSlide(n) {
      showSlides(slideIndex = n);
    }

    function showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      var dots = document.getElementsByClassName("dot");
      if (n > slides.length) {
        slideIndex = 1
      }
      if (n < 1) {
        slideIndex = slides.length
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }

      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
    }


    var leftarrow = document.getElementById("leftarrow");
    var rightarrow = document.getElementById("rightarrow");
    var quantitynumber = document.getElementById("quantitynumber");

    leftarrow.addEventListener("click", () => {
      quantitynumber.innerHTML = quantitynumber.innerHTML - 1;
    })
    rightarrow.addEventListener("click", () => {
      quantitynumber.innerHTML = quantitynumber.innerHTML - 1 + 2;
    })



    $(".producttitle").text(product.name);
    $(".productcategory").text(product.section + "/" + product.category + "/" + product.subcategory);
    $(".productdescription").text(product.description);
    $(".productprice").text("Price: " + product.price);

    console.log(product);
    for (var name in product) {

      if (product[name] !== '' && product[name] !== null) {
        if (name !== 'id' && name !== 'description' && name !== 'price' && name !== 'subcategory' &&
        name !== 'category' && name !== 'section' && name !== 'url' && name !== 'quantity' && name !== 'new_price' && name !== 'name') {
          $('<p class="info-' + name + '">' + name + ': ' + product[name] + '</p>').css({}).appendTo('.actualinfo');
        }
      }
    }

    $(".displaymore").click(function() {
      if (this.id === 'open') {
        $('.actualinfo').attr('class', 'actualinfoactive');
        $('.displaymore').html('Dislay Less');
        $('.displaymore').attr('id', 'close');
      } else if (this.id === 'close') {
        $('.actualinfoactive').attr('class', 'actualinfo');
        $('.displaymore').html('Dislay More');
        $('.displaymore').attr('id', 'open');
      }
    })



    console.log(product.height);
    $(".prev").click(function() {
      plusSlides(-1)
    });
    $(".next").click(function() {
      plusSlides(1)
    });








  }



  function createSlides(images) {
    /*<div class="mySlides fade">
    <div class="numbertext">1 / 3</div>
    <img src="../img/img11.jpg" class="productimg">
  </div>*/
    console.log(images);
    for (var i = 0; i < images.length; i++) {
      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "mySlides fade");
      cardDiv.setAttribute("id", "container" + i);
      document.getElementById("slideshow-container").appendChild(cardDiv);

      var numberDiv = document.createElement("div");
      numberDiv.setAttribute("class", "numbertext");
      numberDiv.innerHTML = (i + 1) + "/" + images.length;
      document.getElementById("container" + i).appendChild(numberDiv);

      var cardImg = document.createElement("img");
      cardImg.setAttribute("class", "productimg");
      cardImg.setAttribute("src", images[i]);
      document.getElementById("container" + i).appendChild(cardImg);
    }
  }

  $(".buttontext").click(() => {
    var quantity = $('#quantitynumber').text();
    quantity = parseInt(quantity);
    addToBasket([itemId, quantity]);
  });



function addToBasket(item) {

    var found = false;
    var founItem;
    for (var o = 0; o < objectArray.length; o++) {
      if (objectArray[o][0] === item[0]) {

        objectArray[o][1] = parseInt(objectArray[o][1]) + item[1];
        founItem = objectArray[o];
        found = true;
        break;
      }
    }

    if (!found) {
      console.log(item);
      objectArray.push(item);
      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "basketitem");
      cardDiv.setAttribute("id", "basketitem" + item[0]);
      document.getElementById("itemsdropdown").appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "basketimage");
      cardDiv.setAttribute("id", "basketimage" + item[0]);
      document.getElementById("basketitem" + item[0]).appendChild(cardDiv);

      cardDiv = document.createElement("img");
      cardDiv.setAttribute("class", "image");
      cardDiv.setAttribute("src", basket_image);
      document.getElementById("basketimage" + item[0]).appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "basketinfo");
      cardDiv.setAttribute("id", "basketinfo" + item[0]);
      document.getElementById("basketitem" + item[0]).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.innerHTML = product.name;
      document.getElementById("basketinfo" + item[0]).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute("id", "quantity" + item[0]);
      cardDiv.innerHTML = "quantity: " + item[1];
      document.getElementById("basketinfo" + item[0]).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.innerHTML = product.price;
      document.getElementById("basketinfo" + item[0]).appendChild(cardDiv);
    } else {
      $('#quantity' + founItem[0]).html(founItem[1]);
      console.log("something we understand", founItem, $('#quantity' + founItem[0]).html());
    }

    fixArray();




  }

  function read_cookie(key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
  }


  function fixArray() {
    var newStringArray = [];
    console.log('*------------------------------------------------------*');
    console.log(stringArray);
    console.log(objectArray);
    console.log('*------------------------------------------------------*');
    for (var i = 0; i < objectArray.length; i++) {
      newStringArray.push(objectArray[i][0] + ':' + objectArray[i][1]);
    }
    console.log('*------------------------------------------------------*');
    console.log(stringArray);
    console.log('.............................................................');

    var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "items=" + newStringArray + "; expires=" + now.toUTCString() + "; " + "path=/";
  }
});

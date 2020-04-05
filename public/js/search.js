var maxItemsDisplay = 0;
var startValue = 0;
$("#includedContent").load("/public/html/header.html", () => {

  var unique_products = [];
  var product_ids = [];

  $.getScript("/public/js/header.js", function() {
    console.log('loaded');
    start();

  });

  var query = decodeURIComponent(window.location.search);
  query = query.replace('?', '');



  $(document).ready(function() {
    $(".query").text('"' + query + '"');
  });


  var searches = document.cookie;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'criteria': query
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("http://localhost:3000/products/search-product", requestOptions)
    .then(response => response.json())
    .then(result => {

        for (var i = 0; i < result.length; i++) {

          if(product_ids <= 0) {
            product_ids.push(result[i].id);
            unique_products.push(result[i]);
            continue;
          }

          for (var j = 0; j < product_ids.length; j++) {

          if (result[i].id == product_ids[j]) {
            break;
          } else {
            product_ids.push(result[i].id);
            unique_products.push(result[i]);
          }
        }

      }

      loadItems(unique_products);
      console.log(unique_products, product_ids);
    }).catch(error => console.log('error', error));




});



function loadItems(products) {

  $('.searchresult').text('found [' + products.length + '] items matching your query.');


  for (var ii = 0; ii < products.length; ii++) {
    var x = $("#main").width();
    var xx = window.innerWidth;
    var y = screen.height;
    var ratio = window.devicePixelRatio || 1;
    var w = screen.width * ratio;
    var h = screen.height * ratio;
    var cardDiv = document.createElement("div");
    var containerName = products[ii].id;

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
      console.log($(this), "---------------------------");
      document.location.href = "/public/path/item.html?" + $(this).attr('id');
    });


    var cardImg = document.createElement("img");
    cardImg.setAttribute("class", "productimg");
    cardImg.setAttribute("src", "/public/images/" + products[ii].image_name);
    //cardImg.setAttribute("src", "img/loading.gif");
    document.getElementById(containerName).appendChild(cardImg);
    var ratio = cardImg.naturalWidth / cardImg.naturalHeight;
    var x = $(document).width();


    var cardDivInner = document.createElement("div");
    cardDivInner.setAttribute("class", "productdescription");
    cardDivInner.setAttribute("id", "productdescription" + containerName);

    document.getElementById(containerName).appendChild(cardDivInner);
    var x = $(document).width();

    var cardTag = document.createElement("strong");
    cardTag.innerHTML = products[ii].subcategory;
    document.getElementById("productdescription" + containerName).appendChild(cardTag);
    var x = $(document).width();

    var cardTitle = document.createElement("p");
    cardTitle.setAttribute("class", "producttitle");
    cardTitle.innerHTML = products[ii].name;;
    document.getElementById("productdescription" + containerName).appendChild(cardTitle);
    var x = $("#main").width();

    var ratio = window.devicePixelRatio || 1;
    var w = screen.width * ratio;
    var h = screen.height * ratio;


    var x = window.devicePixelRatio;




    var priceDiv = document.createElement("div");
    priceDiv.setAttribute("class", "price");
    priceDiv.setAttribute("id", "price" + ii);
    priceDiv.innerHTML = products[ii].price;
    document.getElementById(containerName).appendChild(priceDiv);







    cardDiv.addEventListener("mouseover", function() {
      //var image=this.childNodes[1].setAttribute("style", "width:60%; height:120%;");
    })
  }







}

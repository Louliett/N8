var maxItemsDisplay = 0;
var startValue = 0;
var loaded_products=[];
 var x = $("#main").width();
    var xx = window.innerWidth;
    var y = screen.height;
    var ratio = window.devicePixelRatio || 1;
    var w = screen.width * ratio;
    var h = screen.height * ratio;
$("#includedContent").load("/public/html/header.html", () => {

  var unique_products = [];
  var product_ids = [];

  $.getScript("/public/js/header.js", function() {
    start();
      var query = decodeURIComponent(window.location.search);
  query = query.replace('?', '');
setTitle(query);
  });
    
    $("#includedFooter").load("/public/html/footer.html", () => {


  $.getScript("/public/js/footer.js", function() {
    console.log('loaded');
    startFooter();

  });
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

  fetch("http://192.168.0.108:3000/products/search-product", requestOptions)
    .then(response => response.json())
    .then(result => {
console.log(result, 'shit');
        for (var i = 0; i < result.length; i++) {

          if(product_ids <= 0) {
            product_ids.push(result[i].id);
            unique_products.push(result[i]);
            continue;
          }
          for (var j = 0; j < product_ids.length; j++) {
              var found=false;
          if (result[i].id === product_ids[j]) {
              found=true;
            break;
          }
        }
            if(found===false){
                product_ids.push(result[i].id);
            unique_products.push(result[i]);
            }

      }
      loadItems(unique_products);
      if(window.matchMedia("(max-width: 767px)").matches){
            for(var i=0; i<loaded_products.length;i++){
            var height=$('#itemrow').innerHeight();
            var width=$('#itemrow').innerWidth();
      loaded_products[i].setAttribute("style", "width: " + (Math.floor(width / (1+1))) + "px; height: " + Math.floor(y * 0.8) + "px;");
            }
        }else{
        for(var i=0; i<loaded_products.length;i++){
            var height=$('#itemrow').innerHeight();
            var width=$('#itemrow').innerWidth();
      loaded_products[i].setAttribute("style", "width: " + (Math.floor(width / 4)) + "px; height: " + Math.floor(y * 0.8) + "px;");
            }
            }
    }).catch(error => console.log('error', error));




});



function loadItems(products) {


  $('.searchresult').text('found [' + products.length + '] items matching your query.');


  for (var ii = 0; ii < products.length; ii++) {

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



    startValue++;
    var cardDiv = document.createElement("div");
    var containerName = products[ii].id;

   
      cardDiv.setAttribute("class", "productcontainer");
      cardDiv.setAttribute("id", containerName);
      cardDiv.setAttribute("style", "width: " + (Math.floor(x / 4)) + "px; height: " + Math.floor(y * 0.8) + "px;");
      document.getElementById("itemrow").appendChild(cardDiv);
    loaded_products.push(cardDiv);

    $(cardDiv).click(function() {
      document.location.href = "/public/path/item.html?" + $(this).attr('id');
    });


    cardDiv = document.createElement("img");
      cardDiv.setAttribute("class", "productimg");
       if(products[ii].image_url!==null){
    cardDiv.setAttribute("src", 'http://192.168.0.108:3000'+products[ii].image_url);
           
           
        }else{
            
                cardDiv.setAttribute("src", undefined);

        }

    $(cardDiv).on("error", function(){
        $(this).attr('src', 'http://192.168.0.108:3000/public/product_images/default.png');
    });
    document.getElementById(containerName).appendChild(cardDiv);


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

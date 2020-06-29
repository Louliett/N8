//"use strict";

var itemcolors = [];
var colorsobjects = {};
var received;
var currentslides = [];
var bigitem=$('.bigitem');
var $wrapper=$('.svg-wrapper');
var $no=$('.no');


let isEvent=false;


  var product;
  var jsonFile;
  var basket_image;

  var stringArray;

  var objectArray;
bigitem.click(function(){
    
    bigitem.css('display','none');
    $('#main').removeClass('noscroll');
    
    
})
var itemFetched = {
  id: 0,
  quantity: 0,
  color: 'none'
};
var cookieItems = [];
$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function () {
    typeclassificationheader = 'item';
    start();
      $('.bigimage').attr('height', '0');
      $('<div class="stock_notification"></div>').appendTo($('.free_real_estate'))

  });
  $("#includedFooter").load("/public/html/footer.html", () => {


    $.getScript("/public/js/footer.js", function () {
      startFooter();

    });
  });

});

  var searches = document.cookie;
  var query = decodeURIComponent(window.location.search);
  query = query.replace('?', '');
  var itemId = query;




  readArray();





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

  fetch('http://192.168.0.108:3000/products/id', requestOptions)
    .then(response => response.json())
    .then(data => {
           
          var $availability=$('.stock_notification');
      if(data[0].quantity<1){
          $availability.css('display', 'block');
          $availability.html('OUT OF STOCK');
                $('.svg-wrapper').remove();
          removeStuff();

          
      }else if(data[0].quantity<4 && data[0].quantity>0){
           $availability.css('display', 'block');
           $availability.css('background-color', '#FFB11A99');
          $availability.html('LIMITED STOCK');
                    enable();

          
      }else{
                    enable();

      }
      
      
      
      
      
      product = data[0];
      itemFetched.id = data[0].id;
      fetchImages();
    }).catch(error => console.error(error));



  function fetchImages() {
    const data = {
      id: itemId
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
           
    

    fetch('http://192.168.0.108:3000/products/product-images-id', requestOptions)
      .then(response => response.json())
      .then(data => {
        if(data.length>1){
            for(var i=0; i<data.length; i++){
                if(data[i].colour=='default'){
                data.splice(i, 1);
                }
                
            }
            
        }

        var images = [];
        received = data;
        itemcolors = [...new Set(data.map(x => x.colour))];
        data.forEach((element, index, array) => {
          images.push("http://192.168.0.108:3000" + element.url);
        });
        LoadColors();

        basket_image = images[0];
      }).catch(error => console.error(error));


  }





  function fetchProduct(images) {





    createSlides(images);






    var leftarrow = document.getElementById("leftarrow");
    var rightarrow = document.getElementById("rightarrow");
    var quantitynumber = document.getElementById("quantitynumber");

      if(product.quantity>0){
    leftarrow.addEventListener("click", () => {
        checkQuantity(quantitynumber, 'down', product.id).then((response)=>{
            
              quantitynumber.innerHTML = response;
            
        }).catch((error)=>{quantitynumber.innerHTML='Sold out!'})
    
        
        
    })
    rightarrow.addEventListener("click", () => {
       checkQuantity(quantitynumber, 'up', product.id).then((response)=>{
            
              quantitynumber.innerHTML = response;
            
        }).catch((error)=>{quantitynumber.innerHTML='Sold out!'})
    })

}else{
    
    
    quantitynumber.innerHTML='0';
    
}

    $(".bigtitle").text(product.name);
    $(".itemtitle").text(product.name);
    $(".itemcategory").text(product.section + "/" + product.category + "/" + product.subcategory);
    $(".itemdetails").text(product.description);
    $(".productprice").text("Price: " + product.price + ' лв.');

    for (var name in product) {

      if (product[name] !== '' && product[name] !== null) {
        if (name !== 'id' && name !== 'description' && name !== 'price' && name !== 'subcategory' &&
          name !== 'category' && name !== 'section' && name !== 'url' && name !== 'quantity' && name !== 'new_price' && name !== 'name') {
          $('<p class="info-' + name + '">' + name + ': ' + product[name] + '</p>').css({}).appendTo('.actualinfo');
        }
      }
    }

    $(".displaymore").click(function () {
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











  }



  function createSlides(images) {
    //    var images=colorsobjects[color];
    if (images.length < 2) {
      $('.prev').attr('hidden', 'hidden');
      $('.next').attr('hidden', 'hidden');
    } else {
      $('.prev').removeAttr('hidden');
      $('.next').removeAttr('hidden');
    }

    for (var i = 0; i < images.length; i++) {
      var cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "mySlides fade aslide");
      cardDiv.setAttribute("id", "container" + i);
      currentslides.push(cardDiv);
      document.getElementById("slideshow-container").appendChild(cardDiv);

      var numberDiv = document.createElement("div");
      numberDiv.setAttribute("class", "numbertext");
      numberDiv.innerHTML = (i + 1) + "/" + images.length;
      document.getElementById("container" + i).appendChild(numberDiv);

      var cardImg = document.createElement("img");
      cardImg.setAttribute("class", "slideimg");
      cardImg.setAttribute("src", images[i]);
        cardImg.addEventListener('click', function(e){
            bigitem.find('.bigitemimage').attr('src', e.target.src);
            bigitem.css('display', 'inline');
            $('#main').addClass('noscroll');
            
            
        })
      document.getElementById("container" + i).appendChild(cardImg);
    }


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


    $(".prev").click(function () {
      plusSlides(-1)
    });
    $(".next").click(function () {
      plusSlides(1)
    });


  }

 



  function LoadColors() {
        
    for (var i = 0; i < itemcolors.length; i++) {
      colorsobjects[itemcolors[i]] = [];
      for (var q = 0; q < received.length; q++) {
        if (itemcolors[i] === received[q]['colour']) {
          if (colorsobjects[itemcolors[i]]) {
            colorsobjects[itemcolors[i]].push("http://192.168.0.108:3000" + received[q]['url'])

          }
        }

      }

    }

    for (var i = 0; i < itemcolors.length; i++) {

      $("#itemcolor").append(new Option(itemcolors[i], itemcolors[i]));
    }
    fetchProduct(colorsobjects[$('#itemcolor').val()]);
    $('#itemcolor').change(function () {
      var aslide = $('.aslide').remove()
      createSlides(colorsobjects[$('#itemcolor').val()]);
    })


  }





function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}


async function  checkQuantity(field, direction, itemId){
    var top=0;
    var message=await quantityConfirm(itemId);
    var responce=await parseInt(message);
            top=responce;

        




    var quantityFromField=field.innerHTML;
    var quantityFromProduct=top;
    quantityFromField=parseInt(quantityFromField);
    quantityFromProduct=parseInt(quantityFromProduct);
    if(direction=='up'){
        if((quantityFromField+1)<=quantityFromProduct){
enable()
            return (quantityFromField+1);
        }else{
disable()
            return quantityFromField+1;
            
        }
    }else if(direction=='down'){
        
           if((quantityFromField-1)<=quantityFromProduct && (quantityFromField-1)>=1){
               enable();
            return (quantityFromField-1);
               
            }else if((quantityFromField-1)<1){
                 disable();
                 return (0);
                 }else{

                     disable()
                     return quantityFromField-1;
            
        }
       
    }

        
    
    
    
    
}

function  checkQuantityBasket(){
    
    
    return false;
    
}



async function  quantityConfirm(itemId){
    
var actualQuantity=0;

  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  
 
    
    var message=await fetch('http://192.168.0.108:3000/products/quantity/'+itemId, requestOptions);
    var responce=await message.json();
    if(responce.length>0){
        actualQuantity=responce[0].quantity}
    else{
        actualQuantity=0;
        removeStuff();
    }
    actualQuantity=parseInt(actualQuantity);
    return actualQuantity;
    
}

function  removeStuff(){
     $wrapper.remove();
    
    
}
function  disable(){
        $no.html('This quantity is not available!')
    $no.css('display', 'block');
    $wrapper.css('opacity', '0.4');
    $wrapper.off('click');
    isEvent=false;

    
    
}
function  enable(){
    $no.css('display', 'none');
        $wrapper.css('opacity', '1');
    if(!isEvent){
        isEvent=true;
    $wrapper.click(function(){
           var quantity = $('#quantitynumber').text();
    quantity = parseInt(quantity);
    itemFetched.quantity = quantity;
    itemFetched.color = $('#itemcolor').val();
    addToBasket();
        
        
        
    })
    }

    
    
    
    
}


  function addToBasket() {
      quantityConfirm(itemFetched.id).then((response)=>{
            
            var top=response;
       
    cookieItems = [];
    readArray();
    var found = false;
    var found1 = false;
    for (var i = 0; i < cookieItems.length; i++) {
      if (cookieItems[i].id == itemFetched.id) {
        found = true;
          var combined=(+cookieItems[i].quantity) + (+itemFetched.quantity);
            if(combined<=top){
                }else{
                   ruinEverything();
                    return;
                }
        if (cookieItems[i].color == itemFetched.color) {
          found1 = true;
            var combined=(+cookieItems[i].quantity) + (+itemFetched.quantity);
            if(combined<=top){
            (cookieItems[i].quantity) = combined;
                }else{
                   ruinEverything();
                    return;
                }
        }
      }
    }

    if (!found || !found1) {





      cookieItems.push(itemFetched);
    }




    fixArray();


 }).catch((error)=>{console.log(error)})

  }




  function fixArray() {
    var newStringArray = [];

    for (var i = 0; i < cookieItems.length; i++) {
      newStringArray.push(cookieItems[i].id + ':' + cookieItems[i].quantity + ':' + cookieItems[i].color);
    }


    var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "items=" + newStringArray + "; expires=" + now.toUTCString() + "; " + "path=/";


    Reload();




  }



function readArray() {
  stringArray = read_cookie('items');

  objectArray = [];

  if (stringArray != null) {
    stringArray = stringArray.split(",");

    for (var iii = 0; iii < stringArray.length; iii++) {
      var smallArray = stringArray[iii].split(':');
      cookieItems.push({
        id: smallArray[0],
        quantity: smallArray[1],
        color: smallArray[2]
      })

      objectArray.push(smallArray);

    }
  } else {
    stringArray = [];
  }




}
function  ruinEverything(){
    
    disable();
    $no.html('This + basket quantity not available!')
    
}

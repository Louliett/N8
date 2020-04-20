var stringArray = [];

var carousel = document.querySelector('.carousel');
var cells = carousel.querySelectorAll('.carousel__cell');
var cellCount=4; // cellCount set from cells-range input value
var selectedIndex = 0;
var cellWidth = carousel.offsetWidth;
var cellHeight = carousel.offsetHeight;
var isHorizontal = false;
var rotateFn = 'rotateX';
var radius, theta;
var checkoutSequenceCounter=0;
function rotateCarousel() {
  var angle = theta * selectedIndex * -1;
  carousel.style.transform = 'translateZ(' + -radius + 'px) ' +
    rotateFn + '(' + angle + 'deg)';
}

var prevButton = document.querySelector('.previous-button');
prevButton.addEventListener( 'click', function() {
    if(checkoutSequenceCounter>0){
  selectedIndex--;
  rotateCarousel();

            checkoutSequenceCounter=(Math.abs(checkoutSequenceCounter-1))%4;
moveSequence();
        }else{
            prevButton.style.display='none';
        }

});

var nextButton = document.querySelector('.next-button');
nextButton.addEventListener( 'click', function() {
    if(checkoutSequenceCounter<3){
                            nextButton.style.display='';

  selectedIndex++;
  rotateCarousel();
            checkoutSequenceCounter=(checkoutSequenceCounter+1)%4;

        moveSequence();
}else{
                nextButton.style.display='none';

}

});



function changeCarousel() {
  theta = 360 / cellCount;
  var cellSize = isHorizontal ? cellWidth : cellHeight;
  radius = Math.round( ( cellSize / 2) / Math.tan( Math.PI / cellCount ) );
  for ( var i=0; i < cells.length; i++ ) {
    var cell = cells[i];
    if ( i < cellCount ) {
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
onOrientationChange();


var div1 = $('.partcart');
var div2 = $('.partaddress');
var div3 = $('.partcard');
var div4 = $('.partfinal');


$('#billing').change(function(){
    var c = this.checked;
    if(c===true){
        $('.billingaddressold').removeAttr('hidden');
        $('.billingaddressdefault').attr('hidden');
    }else{
        $('.billingaddressold').attr('hidden');
        $('.billingaddressdefault').removeAttr('hidden');
    }
});






$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    console.log('loaded');
    start();
      setTitle('YOUR CART');

  });
    $("#includedFooter").load("/public/html/footer.html", () => {


  $.getScript("/public/js/footer.js", function() {
    console.log('loaded');
    startFooter();

  });
    });


  var searches = document.cookie;
  var id = read_cookie('id');
  stringArray = read_cookie('items');
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
    var cartShit=$('.checkoutmenu');
    var cover=$('.cover');
    var addrestab=$('.addresstab');
    var addresscover=$('.addresscover');
    $('.finalize').click( function(event) {
  if (cartShit.css('width') =='80px') {
    cartShit.css('width','900');
      cover.css('opacity','0');
  }else{
      /*
    cartShit.css('width','80px');
            cover.css('opacity','1');

      addrestab.css('width','900');
      addresscover.css('opacity','0');*/


      var div1 = $('.partcart');
var div2 = $('.partaddress');
        div2.attr('id','sequencepointactive');
        div2.children().text('address');
        div1.attr('id','sequencepoint');
        div1.children().text('1');


       var card = document.querySelector('.card');
        card.classList.toggle('is-flipped');









  }
}
                         );

  fetch("http://192.168.0.105:3000/products/products-images", requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(product_ids);
      console.log(result);
      for (var i = 0; i < product_ids.length; i++) {
        for (var j = 0; j < result.length; j++) {
          console.log(typeof(result[j].id), typeof(product_ids[i]));

          if(result[j].id === product_ids[i]) {
            unique_products.push(result[j]);
            break;
          }
        }
      }
      console.log(unique_products);
      createCart(unique_products);
      initializeCheckoutSequence();

    }).catch(error => console.log('error', error));


function createCart(products) {

    var cardDiv;
    var product_id;

    for (var i = 0; i < products.length; i++) {
      product_id = products[i].id;

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "item");
      cardDiv.setAttribute("id", "item" + product_id);
      document.getElementById("items").appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "left");
      cardDiv.setAttribute("id", "left" + product_id);
      document.getElementById("item" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("img");
      cardDiv.setAttribute("class", "productimage");
      if(products[i].image_name!==null){
    cardDiv.setAttribute("src", 'http://192.168.0.105:3000/'+products[i].image_name);

        }else{

        }

    $(cardDiv).on("error", function(){
        $(this).attr('src', 'http://192.168.0.105:3000/public/product_images/default.png');
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
      cardDiv.innerHTML = products[i].description;
      document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('class', 'removeItem');
      cardDiv.innerHTML = 'remove item';
      cardDiv.setAttribute('data-item-id', product_id);
      $(cardDiv).click(() => {
        removeItem(event.target.dataset.itemId);
      });
      document.getElementById("leftinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("select");
      cardDiv.setAttribute("class", "quantity");
      cardDiv.setAttribute("id", "quantity" + product_id);
      cardDiv.addEventListener('input', () => {
        update(event.target.getAttribute('id'), event.target.value);
      });
      document.getElementById("rightinfo" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("p");
      cardDiv.setAttribute('id', 'price' + product_id);
      cardDiv.innerHTML = products[i].price;
      document.getElementById("rightinfo" + product_id).appendChild(cardDiv);
    }

    price_manipulator();

}


function read_cookie(key) {
  var result;
  return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}


function calculatePrice() {

  var vat = 20;
  var shipping = Math.floor(Math.random() * (20 - 4) + 4);
  var sum = 0;
  var temmpsum;
  var quantity;
  var price;

  console.log(objectArray);


  for (var i = 0; i < objectArray.length; i++) {

    quantity = document.getElementById('quantity' + objectArray[i][0]).value;
      console.log(document.getElementById('quantity' + objectArray[i][0]))

    price = $('#price' + objectArray[i][0]).html();

    price = parseFloat(price);


    temmpsum = quantity * price;
    sum += temmpsum;

  }


  $('.subtotal').text('Subtotal: ' + sum + '$');
  $('.shipping').text('Shipping: ' + 8 + '$');
  $('.vat').text('VAT: ' + 20 + '%');
  $('.total').text('Total: ' + (sum + (sum * 0.2) + shipping) + '$');


}


function removeItem(id) {



  for (var i = 0; i < objectArray.length; i++) {


    if (objectArray[i][0] === id) {
      objectArray.splice(i, 1);
    }
  }

  $("#item" + id).fadeOut("slow", function() {
    $(this).parentNode.removeChild(removeTarget);
  });
  calculatePrice();
  fixArray();




}


function fixArray() {
  var newStringArray = [];

  for (var i = 0; i < objectArray.length; i++) {
    newStringArray.push(objectArray[i][0] + ':' + objectArray[i][1]);
  }



  var now = new Date();
  now.setFullYear(now.getFullYear() + 2);
  document.cookie = "items=" + newStringArray + "; expires=" + now.toUTCString() + "; " + "path=/";
}


function update(a, b) {
  var quantity = b;
  var id = a.replace('quantity', '');
  //console.log(quantity + '' + id);
  var found = false;
  for (var o = 0; o < stringArray.length; o++) {
    //console.log(stringArray[o][0] + ' ' + a + ' ' + stringArray[o][1]);
    if (stringArray[o][0] === id) {
      found = true;
      stringArray[o][1] = +b;
      //console.log('fucking what?');
    }
  }

  calculatePrice();

  fixArray();

}

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


function initializeCheckoutSequence(){


    var line = $('#line1');
     div1.click(()=>{
        div1.attr('id','sequencepointactive');
        div1.children().text('cart');
        div2.attr('id','sequencepoint');
                 div2.children().text('2');

        div3.attr('id','sequencepoint');
                          div3.children().text('3');

        div4.attr('id','sequencepoint');
                          div4.children().text('4');
         selectedIndex=checkoutSequenceCounter=0;
           rotateCarousel();
         if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';

    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';

    }


    })
    div2.click(()=>{
            if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';

    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';

    }
        div2.attr('id','sequencepointactive');
        div2.children().text('address and shipping');
        div1.attr('id','sequencepoint');
        div1.children().text('1');

        div3.attr('id','sequencepoint');
                div3.children().text('3');

        div4.attr('id','sequencepoint');
                div4.children().text('4');
         selectedIndex=checkoutSequenceCounter=1;
           rotateCarousel();

    })
     div3.click(()=>{
             if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';

    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';

    }
        div3.attr('id','sequencepointactive');
                 div3.children().text('card details');

        div1.attr('id','sequencepoint');
                 div1.children().text('1');

        div2.attr('id','sequencepoint');
                 div2.children().text('2');

        div4.attr('id','sequencepoint');
                 div4.children().text('4');
         selectedIndex=checkoutSequenceCounter=2;
           rotateCarousel();

    })
    div4.click(()=>{
            if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';

    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';

    }
        div4.attr('id','sequencepointactive');
                div4.children().text('finalize');

        div1.attr('id','sequencepoint');
                div1.children().text('1');

        div2.attr('id','sequencepoint');
                div2.children().text('2');

        div3.attr('id','sequencepoint');
                         div3.children().text('3');
         selectedIndex=checkoutSequenceCounter=3;
           rotateCarousel();

    })

var x1 = div1.offset().left + (0);
var y1 = div1.offset().top + (div1.outerHeight()/2);
var x2 = div4.offset().left + (0);
var y2 = div4.offset().top + (div4.outerHeight()/2);

line.attr('x1',x1).attr('y1',y1).attr('x2',x2).attr('y2',y2);
};


function moveSequence(){
    if(checkoutSequenceCounter>0){
                    prevButton.style.display='';

    }
    if(checkoutSequenceCounter<3){
                    nextButton.style.display='';

    }
    if(checkoutSequenceCounter===0){
        div1.attr('id','sequencepointactive');
        div1.children().text('cart');
        div2.attr('id','sequencepoint');
                 div2.children().text('2');

        div3.attr('id','sequencepoint');
                          div3.children().text('3');

        div4.attr('id','sequencepoint');
                          div4.children().text('4');
    }else if(checkoutSequenceCounter===1){
        div2.attr('id','sequencepointactive');
        div2.children().text('address and shipping');
        div1.attr('id','sequencepoint');
        div1.children().text('1');

        div3.attr('id','sequencepoint');
                div3.children().text('3');

        div4.attr('id','sequencepoint');
                div4.children().text('4');
    }else if(checkoutSequenceCounter===2){
        div3.attr('id','sequencepointactive');
                 div3.children().text('payment details');

        div1.attr('id','sequencepoint');
                 div1.children().text('1');

        div2.attr('id','sequencepoint');
                 div2.children().text('2');

        div4.attr('id','sequencepoint');
                 div4.children().text('4');

    }else if(checkoutSequenceCounter===3){
        div4.attr('id','sequencepointactive');
                div4.children().text('finalize');

        div1.attr('id','sequencepoint');
                div1.children().text('1');

        div2.attr('id','sequencepoint');
                div2.children().text('2');

        div3.attr('id','sequencepoint');
                         div3.children().text('3');
    }
}

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
    previousMenu();

});

var nextButton = document.querySelector('.next-button');
nextButton.addEventListener( 'click', function() {
    console.log(checkoutSequenceCounter);

    if(checkoutSequenceCounter===0){
        if(cartCheck()){
                nextMenu();
        }
    } else if(checkoutSequenceCounter===1){

        if(addressCheck()){
                nextMenu();
        }
     }else if(checkoutSequenceCounter===2){
         console.log(cardCheck())
    if(cardCheck()){
    nextMenu();
            populateList();

        }
     }else if(checkoutSequenceCounter===3){

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
        $('.billingaddressdefault').attr('hidden','hidden');
    }else{
        $('.billingaddressold').attr('hidden','hidden');
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
        cardDiv.classList.add('cart_item');
        cardDiv.setAttribute('data-item-name',products[i].name);
        cardDiv.setAttribute('data-item-quantity',objectArray[i][1]);
        cardDiv.setAttribute('data-item-price',products[i].price);
      cardDiv.setAttribute("id", "item" + product_id);
      document.getElementById("items").appendChild(cardDiv);

      cardDiv = document.createElement("div");
      cardDiv.setAttribute("class", "left");
      cardDiv.setAttribute("id", "left" + product_id);
      document.getElementById("item" + product_id).appendChild(cardDiv);

      cardDiv = document.createElement("img");
      cardDiv.setAttribute("class", "productimage");
      console.log(products[i].image_name, "imagename");
      if(products[i].image_name!==null){
        cardDiv.setAttribute("src", 'http://192.168.0.105:3000/public/product_images/' + products[i].image_name);

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
         if(checkoutSequenceCounter>0 && checkoutSequenceCounter<3){
                                              nextButton.style.display='';
                                         prevButton.style.display='';


         }
         if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';
                                 nextButton.style.display='';


    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';
                            prevButton.style.display='';


    }


    })
    div2.click(()=>{
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
        if(checkoutSequenceCounter>0 && checkoutSequenceCounter<3){
                                              nextButton.style.display='';
                                         prevButton.style.display='';


         }
        if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';
                                 nextButton.style.display='';


    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';
                            prevButton.style.display='';


    }

    })
     div3.click(()=>{
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
         if(checkoutSequenceCounter>0 && checkoutSequenceCounter<3){
                                              nextButton.style.display='';
                                         prevButton.style.display='';


         }
         if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';
                                 nextButton.style.display='';


    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';
                            prevButton.style.display='';


    }

    })
    div4.click(()=>{
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
        if(checkoutSequenceCounter>0 && checkoutSequenceCounter<3){
                                              nextButton.style.display='';
                                         prevButton.style.display='';


         }
        if(checkoutSequenceCounter<=0){
                    prevButton.style.display='none';
                                 nextButton.style.display='';


    }
    if(checkoutSequenceCounter>=3){
                    nextButton.style.display='none';
                            prevButton.style.display='';


    }

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
    var requiredFields=$('.shipping_address');


function cartCheck(){
    var cartDoneIcon=$('#partCartDone');
    cartDoneIcon.removeAttr('hidden');
    return true;
}
function addressCheck(){
    var error=false;
    for(var i=0; i<requiredFields.length;i++){
        if(requiredFields[i].value===''){
            error=true;
                        requiredFields[i].classList.add('error');

        }
    }
           var addressErrorIcon=$('#partAddressError');
        var addressDoneIcon=$('#partAddressDone');


    if(error){
    addressErrorIcon.removeAttr('hidden');
            addressDoneIcon.attr('hidden', 'hidden');

    return false;
    }else if(!error){
    addressDoneIcon.removeAttr('hidden');
    addressErrorIcon.attr('hidden', 'hidden');
        populateOld();
    return true;
        }
    else{
    addressErrorIcon.removeAttr('hidden');
                    addressDoneIcon.attr('hidden', 'hidden');

    return false;
    }

}
function cardCheck(){
    var card_details=$('.card_details');
    var isBilling=document.getElementById('billing');
    var c = isBilling.checked;
    var requiredFieldsBilling;
    var error=false;

    if(c){
             requiredFieldsBilling=$('.auto.billing_address');
        console.log(requiredFieldsBilling);
        }else{
                         requiredFieldsBilling=$('.required.billing_address');

        }
    for(var i=0; i<requiredFieldsBilling.length;i++){
        if(requiredFieldsBilling[i].value===''){
            console.log(requiredFieldsBilling[i]);
            error=true;
            requiredFieldsBilling[i].classList.add('error');
        }
    }
    for(var i=0; i<card_details.length;i++){
        if(card_details[i].value===''){
                        console.log(card_details[i]);

            error=true;
                        card_details[i].classList.add('error');

        }
    }
        var cardDoneIcon=$('#partCardDone');
           var cardErrorIcon=$('#partCardError');

    if(error){
        cardDoneIcon.removeAttr('hidden');
    cardDoneIcon.attr('hidden', 'hidden');
    cardErrorIcon.removeAttr('hidden');
    return false;
    }else if(!error){
    cardDoneIcon.removeAttr('hidden');


    cardErrorIcon.attr('hidden', 'hidden');
    return true;
        }
    else{
            cardDoneIcon.removeAttr('hidden');
    cardDoneIcon.attr('hidden', 'hidden');

    cardErrorIcon.removeAttr('hidden');
    return false;
    }

}
function nextMenu(){
     if(checkoutSequenceCounter<3){
                            nextButton.style.display='';

         selectedIndex++;
  rotateCarousel();
        prevButton.removeAttribute('hidden');
      console.log(checkoutSequenceCounter);

            checkoutSequenceCounter=(checkoutSequenceCounter+1)%4;
               console.log(checkoutSequenceCounter);


        moveSequence();
}else{
                nextButton.style.display='none';

}


}
function previousMenu(){
    if(checkoutSequenceCounter>0){
  selectedIndex--;
  rotateCarousel();

            checkoutSequenceCounter=(Math.abs(checkoutSequenceCounter-1))%4;
moveSequence();
        }else{
            prevButton.style.display='none';
        }


}
function populateOld(){
    var isBilling=document.getElementById('billing');
    var c = isBilling.checked;
    if(c===true){
        $('.billingaddressold').removeAttr('hidden');
        $('.billingaddressdefault').attr('hidden','hidden');
         var requiredFieldsBilling=$('.auto.billing_address');
        console.log(requiredFieldsBilling)
for(var i=0; i<requiredFieldsBilling.length; i++){
    requiredFieldsBilling[i].innerHTML=requiredFields[i].value;

}
    }else{
        $('.billingaddressold').attr('hidden','hidden');
        $('.billingaddressdefault').removeAttr('hidden');
    }
}


var required=$('.required');
var errorScript=function(event){
        var e=event.target;
        if(e.value===''){
            e.classList.add('error');
        }else{
            e.classList.remove('error');
        }
    }
for(var i=0;i<required.length; i++){
    required[i].addEventListener('input',errorScript)
     required[i].addEventListener("focusout", errorScript);




}


function  populateList(){
    var table=document.getElementById('simple_body');
    var itemsList=$('.cart_item');
    console.log(itemsList)
    for(var i=0;i<itemsList.length;i++){

        var row=table.insertRow(0);
        var cell=row.insertCell(0);
        cell.innerHTML='<p>'+itemsList[i].dataset.itemName+'</p>';
        cell=row.insertCell(1);
        cell.innerHTML='<p>'+itemsList[i].dataset.itemPrice+'</p>';
        cell=row.insertCell(2);
        cell.innerHTML='<p>'+itemsList[i].dataset.itemQuantity+'</p>';
        cell=row.insertCell(3);
        cell.innerHTML='<p>20%</p>';


    }
    var row=table.insertRow(table.rows.length);
    var cell=row.insertCell(0);
    cell=row.insertCell(1);
    cell=row.insertCell(2);
    cell=row.insertCell(3);
    cell=row.insertCell(4);
    cell.innerHTML='<p>'+$('.total').text()+'</p>';


    var table=$('.shipping_address_checkout');
    var relevant=table.children('.auto')
    var old=$('.required.shipping_address');
    for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].value;
    }


    var table=$('.billing_address_checkout');
    var relevant=table.children('.auto')

    var old;
var isBilling=document.getElementById('billing');
    var c = isBilling.checked;
    if(c===true){
           old=$('.auto.billing_address');
        for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].innerHTML;
    }

    }
    else{
            old=$('.required.billing_address');
        for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].value;
    }

    }


    var table=$('.card_checkout');
    var relevant=table.children('.auto')
    var old=$('.card_details');
    for(var i=0; i<relevant.length;i++){
        relevant[i].innerHTML=old[i].value;
    }



}
var month_slc = document.getElementById('expiration_month');
var year_slc = document.getElementById('expiration_year');


  var months = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  for (var i = 0; i < months.length; i++) {
    var opt = months[i];
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    month_slc.appendChild(el);
  }


  for (var i = 20; i < 51; i++) {
    var opt = i;
    var el = document.createElement("option");
    el.textContent = opt;
    el.value = opt;
    year_slc.appendChild(el);
  }


var cities_slc = document.querySelectorAll('#bulgarian_cities');
console.log(cities_slc)

var array=[];
  fetch('/public/db/bg.json')
    .then(response => response.json())
    .then((data) => {
      for (var i = 0; i < data.length; i++) {
        array.push(data[i].city);
      }
      for (var j = 0; j < array.length; j++) {
        var opt = array[j];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        cities_slc[0].appendChild(el);
          var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        cities_slc[1].appendChild(el);
      }
    });



$('.finalize').click(()=>{

    var email=$('.email_checkout')

    if(email.val()===''){
        email.addClass('error');
    }else{
sendShit();    }


})
/*setInterval(function(){ sendShit()
                      console.log('works');
                      }, 80);*/
function sendShit(){

    var table=$('.shipping_address_checkout');
    var relevant=table.children('.auto')
    var contentsShipping=[];
    for(var i=0; i<relevant.length;i++){
        contentsShipping.push(relevant[i].innerHTML);
    }


    var table=$('.billing_address_checkout');
    var relevant=table.children('.auto')
    var contentsBilling=[];
    for(var i=0; i<relevant.length;i++){
        contentsBilling.push(relevant[i].innerHTML);
    }

    var table=$('.card_checkout');
    var relevant=table.children('.auto')
    var contentCard=[];
    for(var i=0; i<relevant.length;i++){
        contentCard.push(relevant[i].innerHTML);
    }

    var contentItems=[];


     var itemsList=$('.cart_item');
    for(var i=0;i<itemsList.length;i++){

        contentItems.push(i);
        contentItems.push(itemsList[i].dataset.itemName);
        contentItems.push(itemsList[i].dataset.itemPrice);
        contentItems.push(itemsList[i].dataset.itemQuantity);


    var time= new Date();
var randHex = function(len) {
  var maxlen = 8,
      min = Math.pow(16,Math.min(len,maxlen)-1)
      max = Math.pow(16,Math.min(len,maxlen)) - 1,
      n   = Math.floor( Math.random() * (max-min+1) ) + min,
      r   = n.toString(16);
  while ( r.length < len ) {
     r = r + randHex( len - maxlen );
  }
  return r;
};

//  demo code
function write(i) {
 $("<li />").text(i).appendTo("#x");
}

for(var j = 1;j<50;j++) {
}

    /*const data = {
    'code': randHex(99) ,
    'first_name': contentsShipping[0],
    'last_name': contentsShipping[1],
    'shipping_address': contentsShipping,
    'billing_address': contentsBilling,
    'card_details': contentCard,
    'total_amount': $('.total').text(),
    'items': contentItems,
    'email': $('.email_checkout').val(),
    'timestamp': time.getTime(),
    'type': 'purchase'*/
        const data = {
    'code': randHex(99) ,
    'first_name': contentsShipping[0],
    'last_name': contentsShipping[1],
    'shipping_address': contentsShipping.join(),
    'billing_address': contentsBilling.join(),
    'card_details': contentCard.join(),
    'total_amount': $('.total').text(),
    'items': contentItems.join(),
    'email': 'louliett@gmail.com',//$('.email_checkout').val(),
    'timestamp': time.getTime(),
    'type': 'purchase'
  }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify(data);
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  }

  fetch("http://192.168.0.105:3000/transactions/create-unregistered", requestOptions)
    .then(response => response.text())
    .then(result => setPage(result))
    .catch(error => console.log('error', error));

}


}

function setPage(result){


    var shit=window.open('about:blank', '','_blank');

    shit.document.write(result);
    location.href = "/public";

}

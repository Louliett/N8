"use strict";

document.cookie = "items=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
var session_id = decodeURIComponent(window.location.search).replace("?", "").substr(11);
var purchased_products = [];
var purchased_products_ids = [];
var purchased_products_prices = [];
var purchased_products_simple = [];
var purchased_products_vat = 0;
var purchased_products_total = 0;
var $content = $('.contents');

$("#includedContent").load("/public/html/header.html", () => {
    $.getScript("/public/js/header.js", function () {
        typeclassificationheader = 'item';
        start();
        $('.bigimage').attr('height', '0');

    });

});

console.log(session_id, "this is session");

//let's register the order
createOrder(session_id);

getPurchasedItems(session_id)
    .then((items) => {

        for (let i = 0; i < items.data.length; i++) {
            purchased_products.push({
                stripe_id: items.data[i].price.id,
                quantity: items.data[i].quantity
            });
            purchased_products_ids.push(items.data[i].price.product)
        }

        sendPurchasedItems(purchased_products)
            .then((result) => {
                console.log(result);
            }).catch(error => console.error(error));

        getProductsMany(purchased_products_ids).then((response) => {
            console.log(response);
            purchased_products_simple = response;
            for (var i = 0; i < response.length; i++) {

                $('<div class="content_line"><div class="content_title">' + response[i].name + ' // ' + response[i].brand + ' // ' + response[i].colour + '</div><div class="content_amount">' + response[i].price + ' лв.</div></div>').appendTo($content);
                purchased_products_prices.push(parseFloat(response[i].price))

            }
            var total = purchased_products_prices.reduce(function (a, b) {
                return a + b;
            }, 0);
            total = total + 12.40;
            total = total + (total * 0.2);
            total = Number((total).toFixed(2));
            var vat = total * 0.2;
            vat = Number((vat).toFixed(2))
            purchased_products_vat = (total * 0.2);
            purchased_products_total = total;

            $('<div class="content_line"><div class="content_title">Shipping stuff</div><div class="content_amount">12.40 лв.</div></div>').appendTo($content);

            $('<div class="content_line"><div class="content_title">VAT</div><div class="content_amount">' + vat + ' лв.</div></div>').appendTo($content);


            $('.amount').html(total + ' .лв');

            generateCode()



        }).catch(error => console.error(error));



    }).catch(error => console.error(error));


var return_button = document.getElementById('return_button');

return_button.addEventListener("click", () => {
    location.replace("http://192.168.0.108:3000/public/");
});




async function getPurchasedItems(session_id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "sessionid": session_id
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let message = await fetch("http://192.168.0.108:3000/transactions/get-stripe-session-line-items", requestOptions);
    let response = await message.json();
    return response;
}

async function sendPurchasedItems(products) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "products": products
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let message = await fetch("http://192.168.0.108:3000/transactions/purchased-products", requestOptions);
    let response = await message.text();
    return response;
}


async function getProductsMany(itemIds) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
        'stripe_ids': itemIds
    };
    var raw = JSON.stringify(data);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    var message = await fetch('http://192.168.0.108:3000/products/stripe-id', requestOptions);
    var responce = await message.json();
    return responce;
}

function createOrder(session_id) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const data = {
        'sessionid': session_id
    };

    var raw = JSON.stringify(data);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://192.168.0.108:3000/transactions/create-order", requestOptions)
        .then(response => response.json())
        .then((result) => {
            console.log(result);
        }).catch(error => console.log('error', error));
}


function generateCode() {

    var qrcode = new QRCode('actual_code', {
        text: JSON.stringify(purchased_products_simple) + ' Vat:' + purchased_products_vat + ' лв.;' + ' Shipping:12.40 лв.; Total:' + purchased_products_total,
        width: 94,
        height: 94,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    $('.receipt_inner').css('margin-top', $('.navbaritem')[0].scrollHeight);


    $("#includedFooter").load("/public/html/footer.html", () => {


        $.getScript("/public/js/footer.js", function () {
            startFooter();
            $("#includedFooter").css('margin-top', ($('.navbaritem')[0].scrollHeight + $('.receipt_inner')[0].scrollHeight) + 40)

        });
    });
}
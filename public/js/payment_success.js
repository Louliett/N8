"use strict";

document.cookie = "items=0; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
var session_id = decodeURIComponent(window.location.search).replace("?", "").substr(11);
var purchased_products = [];


getPurchasedItems(session_id)
    .then((items) => {

        for (let i = 0; i < items.data.length; i++) {
            purchased_products.push({
                stripe_id: items.data[i].price.id,
                quantity: items.data[i].quantity
            });
        }

        sendPurchasedItems(purchased_products)
            .then((result) => {
                console.log(result);
        }).catch(error => console.error(error));

    }).catch(error => console.error(error));








var return_button = document.getElementById('return_button');

return_button.addEventListener("click", () => {
    location.replace("http://localhost:3000/public/");
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
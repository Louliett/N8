"use strict";

import * as check from './login_register_handler.js';

var errors = $('.error');
for (var i = 0; i < errors.length; i++) {
  errors[i].style.opacity = 0;
}

$('#register_button').hide();


var included_content_div = $("#includedContent");
//login field
var login_div = $(".login_div");
var login_input_div = $(".login_input_div");
var login_email_txt = $("#login_email");
var login_password_txt = $("#login_password");
var login_button = $(".login_button");
var transit_login_button = $(".transit_login_button");
var transit_login_button_div = $(".transit_login_button_div");

//registration field
var register_div = $(".register_div");
var register_input_div = $(".register_input_div");
var first_name_txt = $("#first_name");
var last_name_txt = $("#last_name");
var email_txt = $("#email");
var confirm_email_txt = $("#confirm_email");
var password_txt = $("#password");
var confirm_password_txt = $("#confirm_password");
var register_button = $(".register_button");
var transit_register_button = $(".transit_register_button");
var transit_register_button_div = $(".transit_register_button_div");

var text_fields = [];


$('#includedcontent').load("/public/html/header.html", function () {
  $.getScript("/public/js/header.js", function () {
    console.log('loaded');
    start();
  });
});


$(document).ready(function () {

  transit_login_button.css("opacity", "0");
  transit_login_button.css("display", "none");

  transit_register_button.click(function () {
    login_div.css("width", "8%");
    register_div.css("width", "60%");
    login_input_div.css("opacity", "0");
    register_input_div.css("display", "inline-block");
    register_input_div.css("opacity", "1");
    transit_register_button_div.css("opacity", "0");
    transit_register_button_div.css("display", "none");
    login_button.css("opacity", "0");
    login_button.css("display", "none");
    transit_login_button.css("opacity", "1");
    transit_login_button.css("display", "inline-block");
    $('#register_button').show();
    $('#transit_register_button').hide();
  });

  transit_login_button.click(function () {
    login_div.css("width", "48%");
    register_div.css("width", "30%");
    login_input_div.css("opacity", "1");
    register_input_div.css("opacity", "0");
    register_input_div.css("display", "none");
    transit_register_button_div.css("opacity", "1");
    transit_register_button_div.css("display", "");
    login_button.css("opacity", "1");
    login_button.css("display", "inline-block");
    transit_login_button.css("opacity", "0");
    transit_login_button.css("display", "none");
    $('#register_button').hide();
    $('#transit_register_button').show();
  });

  login_button.click(function () {
    var login_email = login_email_txt.val();
    var login_password = login_password_txt.val();

    text_fields.push(login_email_txt, login_password_txt);
    var checker = check.fields(text_fields);

    if (checker == true) {
      loginUser(login_email, login_password);
      login_email_txt.val("");
      login_password_txt.val("");
    }

  });

  register_button.click(function () {
    var first_name = first_name_txt.val();
    var last_name = last_name_txt.val();
    var email = email_txt.val();
    var confirm_email = confirm_email_txt.val();
    var password = password_txt.val();
    var confirm_password = confirm_password_txt.val();

    text_fields.push(first_name_txt, last_name_txt, email_txt,
      confirm_email_txt, password_txt, confirm_password_txt);


    var checker = check.validator(first_name_txt, last_name_txt, email_txt,
      confirm_email_txt, password_txt, confirm_password_txt, text_fields);

    if (checker == true) {
      registerUser(first_name, last_name, email, password);
      first_name_txt.val("");
      last_name_txt.val("");
      email_txt.val("");
      confirm_email_txt.val("");
      password_txt.val("");
      confirm_password_txt.val("");
    }

  });

});

function loginUser(login_email, login_password) {

  checkAccount(login_email, login_password)
    .then((result) => {
      if (result == 0) {
        document.getElementById('error_login').style.opacity = 1;
        document.getElementById('error_login').innerHTML = 'You dont exist';
        document.getElementById('login_email').style.backgroundColor = '#ff5964cc';
        document.getElementById('login_password').style.backgroundColor = '#ff5964cc';
      } else {
        var role = result[0].role;
        console.log(role);
        if (role === "admin") {
          createCookieAdmin(-1);
        } else {
          createCookie(result[0].id);
          location.href = "/public";
        }

      }
    }).catch(error => console.error(error));

}

function registerUser(first_name, last_name, email, password) {

  checkEmail(email)
    .then((result) => {

      console.log(result);
      if (result == true) {
        console.log(result);
        console.log("email matches");
      } else {

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const data = {
          'first_name': first_name,
          'last_name': last_name,
          'email': email,
          'password': password
        };
        var raw = JSON.stringify(data);

        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch("http://192.168.0.108:3000/users/register-customer", requestOptions)
          .then(response => response.text())
          .then(result => {
            console.log(result);
            location.href = "/public";
          })
          .catch(error => console.log('error', error));

      }
    }).catch(error => console.error(error));


}

async function checkEmail(email) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'email': email
  };

  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  let response = await fetch("http://192.168.0.108:3000/users/check-email", requestOptions);
  let message = await response.json();
  return message;
}


async function checkAccount(email, password) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const data = {
    'email': email,
    'password': password
  };
  var raw = JSON.stringify(data);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  let response = await fetch("http://192.168.0.108:3000/users/login-user", requestOptions);
  let message = await response.json();
  return message;
}

function createCookie(id) {
  var now = new Date();
  now.setFullYear(now.getFullYear() + 2);
  document.cookie = "loggedin=1; expires=" + now.toUTCString() + "; " + "path=/";
  document.cookie = "customer=" + id + "; expires=" + now.toUTCString() + "; " + "path=/";
  document.location.href = '/public/path/profile.html';
}


function createCookieAdmin(id) {
  Cookies.set('admin', '-1', {
    expires: 1,
    path: '/public/admin'
  });
  Cookies.set('sessionId', 'ask75934jri', {
    expires: 1,
    path: '/public/admin'
  });
  document.location.href = '/public/admin/home.html';
}
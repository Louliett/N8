"use strict"


import * as check from './login_register_handler.js';


//registration field
var first_name_txt = $("#first_name");
var last_name_txt = $("#last_name");
var email_txt = $("#email");
var confirm_email_txt = $("#confirm_email");
var password_txt = $("#password");
var confirm_password_txt = $("#confirm_password");
var register_button = $("#register_button");

var text_fields = [];


register_button.click(function() {
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

  if(checker == true) {
    registerUser(first_name, last_name, email, password);
    first_name_txt.val("");
    last_name_txt.val("");
    email_txt.val("");
    confirm_email_txt.val("");
    password_txt.val("");
    confirm_password_txt.val("");
  }

});

function registerUser(first_name, last_name, email, password) {

  checkEmail(email)
  .then((result) => {

    console.log(result);
    if(result == true) {
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

      fetch("http://192.168.0.108:3000/users/register-admin", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
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

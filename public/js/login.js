"use strict"

import * as check from './login_register_handler.js';

var login_div = $( ".login_div" );
var register_div = $(".register_div");
var login_input_div = $(".login_input_div");
var register_input_div = $(".register_input_div");
var button_div = $(".button_div");
var login_button = $(".login_button");
var register_button = $(".register_button");

var first_name_txt = $("#first_name");
var last_name_txt = $("#last_name");
var email_txt = $("#email");
var confirm_email_txt = $("#confirm_email");
var password_txt = $("#password");
var confirm_password_txt = $("#confirm_password");

var text_fields = [];
var text_values = [];




$(document).ready(function() {

  //logininput
  login_div.css("width", "30%");
  register_div.css("width", "50%");
  login_input_div.css("opacity", "1");
  register_input_div.css("opacity", "1");
  register_input_div.css("display", "block");
  button_div.css("opacity", "1");
  button_div.css("display", "");


  login_button.click(function() {



  });

  register_button.click(function() {
    var first_name = first_name_txt.val();
    var last_name = last_name_txt.val();
    var email = email_txt.val();
    var confirm_email = confirm_email_txt.val();
    var password = password_txt.val();
    var confirm_password = confirm_password_txt.val();

    text_fields.push(first_name_txt, last_name_txt, email_txt,
      confirm_email_txt, password_txt, confirm_password_txt);


    var cheker = check.verificator(first_name_txt, last_name_txt, email_txt,
      confirm_email_txt, password_txt, confirm_password_txt, text_fields);

    if(checker == true) {
      var data = {
        'first_name': first_name,
        'last_name': last_name,
        'email': email,
        'password': password
      }
    }


  });

});

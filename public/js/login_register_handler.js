"use strict"

export function validator(first_name_txt, last_name_txt, email_txt,
                            confirm_email_txt, password_txt,
                            confirm_password_txt, text_fields) {
  var firstNameFlag = false;
  var lastNameFlag = false;
  var emailFlag = false;
  var emailMatchFlag = false;
  var passwordFlag = false;
  var passwordMatchFlag = false;
  var fieldsFlag = false;

  //checking fields
  if(fields(text_fields) === true) {
    fieldsFlag = true;
  }

  //checking first name
  if(firstName(first_name_txt) === true) {
    firstNameFlag = true;
  }

  //checking last name
  if(lastName(last_name_txt) === true) {
    lastNameFlag = true;
  }

  //checking email
  if(email(email_txt) === true) {
    emailFlag = true;
  }

  //checking emails to match
  if(emailMatch(email_txt, confirm_email_txt) === true) {
    emailMatchFlag = true;
  }

  //checking password
  if(password(password_txt) === true) {
    passwordFlag = true;
  }

  //checking password
  if(passwordMatch(password_txt, confirm_password_txt) === true) {
    passwordMatchFlag = true;
  }

  //final response
  if(fieldsFlag == true && firstNameFlag == true && lastNameFlag == true &&
     emailFlag == true  && emailMatchFlag == true && passwordFlag == true &&
     passwordMatchFlag == true) {
    return true;
  } else {
    return false;
  }

}

function alerter(field) {
  return field.css("background-color", "#ff5964cc");
}

function neutralizer(field) {
  return field.css("background-color", "");
}


//non-strict field checker
export function fields(text_fields) {
  var checker = 0;
  for(var i = 0; i < text_fields.length; i++) {
    if(text_fields[i].val() === "") {
      alerter(text_fields[i]);
        var error= text_fields[i][0].ownerDocument.getElementById('error_login');     error.style.opacity=1;
error.innerHTML='WE CANT GUESS YOUR EMAIL/PASSWORD!';
      checker++;
    } else {
      neutralizer(text_fields[i]);
             var error= text_fields[i][0].ownerDocument.getElementById('error_login');     error.style.opacity=0;
error.innerHTML='Error';
    }
  }
  if(checker == 0) {
    return true;
  } else {
    return false;
  }
}

function firstName(first_name_txt) {
    if(first_name_txt.val()===''){
         alerter(first_name_txt);
      var error= first_name_txt[0].ownerDocument.getElementById('error_first_name');     error.style.opacity=1;
error.innerHTML='Please fill in the field';
            return false;

    }
  var name_format = /^[a-zA-Z]+$/;
  if(first_name_txt.val().match(name_format)) {
  var error= first_name_txt[0].ownerDocument.getElementById('error_first_name');     error.style.opacity=0;
error.innerHTML='Error';
    return true;
  } else {
    alerter(first_name_txt);
      var error= first_name_txt[0].ownerDocument.getElementById('error_first_name');     error.style.opacity=1;
error.innerHTML='What r u?';
    return false;
  }
}

function lastName(last_name_txt) {
  var name_format = /^[a-zA-Z]+$/;
        if(last_name_txt.val()===''){
         alerter(last_name_txt);
      var error= last_name_txt[0].ownerDocument.getElementById('error_last_name');     error.style.opacity=1;
error.innerHTML='Please fill in the field';
            return false;

    }
  if(last_name_txt.val().match(name_format)) {
        var error= last_name_txt[0].ownerDocument.getElementById('error_last_name');     error.style.opacity=0;
error.innerHTML='Error';
    return true;
  } else {
    alerter(last_name_txt);
var error= last_name_txt[0].ownerDocument.getElementById('error_last_name');     error.style.opacity=1;
error.innerHTML='Last Name is not good';
    return false;
  }
}

function email(email_txt) {
  var mail_format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(email_txt.val()===''){
         alerter(email_txt);
      var error= email_txt[0].ownerDocument.getElementById('error_email');     error.style.opacity=1;
error.innerHTML='Please fill in the field';
            return false;

    }
  if(email_txt.val().match(mail_format)) {
        var error= email_txt[0].ownerDocument.getElementById('error_email');     error.style.opacity=0;
error.innerHTML='Error';
    return true;
  } else {
    alerter(email_txt);
      var error= email_txt[0].ownerDocument.getElementById('error_email');     error.style.opacity=1;
error.innerHTML='Ur email sucks';
    return false;
  }
}


function emailMatch(email_txt, confirm_email_txt) {
        if(confirm_email_txt.val()===''){
         alerter(confirm_email_txt);
      var error= confirm_email_txt[0].ownerDocument.getElementById('error_confirm_email');     error.style.opacity=1;
error.innerHTML='Please fill in the field';
            return false;

    }
  if(email_txt.val() === confirm_email_txt.val()) {
        var error= confirm_email_txt[0].ownerDocument.getElementById('error_confirm_email');     error.style.opacity=0;
error.innerHTML='Error';
    return true;
  } else {
    alerter(confirm_email_txt);
      var error= confirm_email_txt[0].ownerDocument.getElementById('error_confirm_email');     error.style.opacity=1;
error.innerHTML='R u dislexic?';
    return false;
  }
}

function password(password_txt) {
  var password_format = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
        if(password_txt.val()===''){
         alerter(password_txt);
      var error= password_txt[0].ownerDocument.getElementById('error_password');     error.style.opacity=1;
error.innerHTML='Please fill in the field';
            return false;

    }
  if(password_txt.val().match(password_format)) {
        var error= password_txt[0].ownerDocument.getElementById('error_password');     error.style.opacity=0;
error.innerHTML='Error';
    return true;
  } else {
    alerter(password_txt);
      var error= password_txt[0].ownerDocument.getElementById('error_password');     error.style.opacity=1;
error.innerHTML='Have some self respect man';
    return false;
  }
}

function passwordMatch(password_txt, confirm_password_txt) {
        if(confirm_password_txt.val()===''){
         alerter(confirm_password_txt);
      var error= confirm_password_txt[0].ownerDocument.getElementById('error_confirm_password');     error.style.opacity=1;
error.innerHTML='Please fill in the field';
            return false;

    }
  if(password_txt.val() === confirm_password_txt.val()) {
        var error= confirm_password_txt[0].ownerDocument.getElementById('error_confirm_password');     error.style.opacity=0;
error.innerHTML='Error';
    return true;
  } else {
    alerter(confirm_password_txt);
      var error= confirm_password_txt[0].ownerDocument.getElementById('error_confirm_password');     error.style.opacity=1;
error.innerHTML='Check again hoe';
    return false;
  }
}

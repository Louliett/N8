"use strict"



var image_table = '<table class="images_table"id="images_table">  <thead id="images_table_head"><tr id="image_titles"><th> Colour </th><th> Add </th></tr></thead><tbody id="images_table_body"></tbody></table>';

//non-strict field checker
function isItEmpty(myArray) {
  var checker = 0;

  for(var i = 0; i < myArray.length; i++) {
    if(myArray[i] === "") {
      checker++;
    }
  }

  if(checker === myArray.length) {
    return true;
  } else {
    return false;
  }

}

//non-strict field checker
function isItEmptyStrict(myArray) {

  var checker = 0;

  for(var i = 0; i < myArray.length; i++) {
    if(myArray[i] === "") {
      checker++;
    }
  }

  if(checker === myArray.length) {
    return true;
  } else {
    return false;
  }

}


export { isItEmpty };

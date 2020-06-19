"use strict"

//var image_table = '<table class="images_table"id="images_table">  <thead id="images_table_head"><tr id="image_titles"><th> Colour </th><th> Add </th></tr></thead><tbody id="images_table_body"></tbody></table>';

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

//displays the contents of a formdata in humanly readable form
function readFormdata(formdata) {
  for (var pair of formdata.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }
}

export { isItEmpty };

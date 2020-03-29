"use strict"

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

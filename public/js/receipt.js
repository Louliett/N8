"use strict";

var return_button = document.getElementById('return');

return_button.addEventListener("click", () => {
    location.replace("http://localhost:3000/public/");
});
"use strict";


$("#includedContent").load("/public/html/header.html", () => {

  $.getScript("/public/js/header.js", function () {
    start();
  });

  $("#includedFooter").load("/public/html/footer.html", () => {

    $.getScript("/public/js/footer.js", function () {
      startFooter();
    });
  });

});
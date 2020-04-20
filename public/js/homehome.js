var loaded_products=[];
 var x = $("#main").width();
    var xx = window.innerWidth;
    var y = screen.height;
    var ratio = window.devicePixelRatio || 1;
    var w = screen.width * ratio;
    var h = screen.height * ratio;

$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    start();
      setTitle('HOME PAGE');

  });
    
    $("#includedFooter").load("/public/html/footer.html", () => {


  $.getScript("/public/js/footer.js", function() {
    startFooter();

  });
    });
});
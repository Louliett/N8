


$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    console.log('loaded');
    start();

  });


$("#includedFooter").load("/public/html/footer.html", () => {


  $.getScript("/public/js/footer.js", function() {
    console.log('loaded');
    startFooter();

  });
    });

});



$("#flip").click(function() {
    $($(this).siblings()[0]).slideToggle("slow")
})
      
$(document).ready(function(){
  $("#flip").click(function(){
    $("#panel").slideToggle("slow");
  });
});

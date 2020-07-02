
$("#includedContent").load("/public/html/header.html", () => {



  $.getScript("/public/js/header.js", function() {
    start();

      
      
     $('<div class="page_title">About us</div>').appendTo('.free_real_estate2');
      ok();
  });
    
});


function  ok(){
    
        
    $('.about_main').css('margin-top', 60);
    
    
    $("#includedFooter").load("/public/html/footer.html", () => {


    $.getScript("/public/js/footer.js", function () {
      startFooter();
    $("#includedFooter").css('margin-top', ($('.bigimage')[0].scrollHeight+$('.about_main')[0].scrollHeight)+40)
    
    
})
})
}

$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function() {
    start();
            $('<div class="page_title">Contact info/Location</div>').appendTo('.free_real_estate2');
      ok();

  });




});


function  ok(){
    
        
    $('.maincontent').css('margin-top', 60);
    
    
    $("#includedFooter").load("/public/html/footer.html", () => {


    $.getScript("/public/js/footer.js", function () {
      startFooter();
    $("#includedFooter").css('margin-top', ($('.bigimage')[0].scrollHeight+$('.maincontent')[0].scrollHeight)+40)
    
    
})
})
}

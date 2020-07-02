

$("#includedContent").load("/public/html/header.html", () => {


  $.getScript("/public/js/header.js", function () {
    start();
             $('<div class="page_title">Frequently Asked Questions</div>').appendTo('.free_real_estate2');
      ok()

  });
  

});


function  ok(){
    
        
    $('.question_wrapper').css('margin-top', $('.bigimage')[0].scrollHeight+40);
    
    
    $("#includedFooter").load("/public/html/footer.html", () => {


    $.getScript("/public/js/footer.js", function () {
      startFooter();
    $("#includedFooter").css('margin-top', ($('.bigimage')[0].scrollHeight+$('.question_wrapper')[0].scrollHeight)+40)
    
    
})
})
    
    
    $('.actual_question').click(function(e){
        if(!(e.target.nextSibling.classList.contains('open'))){
        e.target.nextSibling.classList.add('open');
        e.target.childNodes[1].classList.add('down');
        } else{
            e.target.nextSibling.classList.remove('open');
        e.target.childNodes[1].classList.remove('down');

        }       
        
    })
    $('.more_questions').click(function(){
        
                          document.location.href = '/public/path/location.html';

        
        
    })
    
}
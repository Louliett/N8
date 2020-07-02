
$("#includedContent").load("/public/html/header.html", () => {



  $.getScript("/public/js/header.js", function() {
    start();

      
      
     $('<div class="policy_title">Privacy & Cookies</div>').appendTo('.free_real_estate2');
  });
    
    $("#includedFooter").load("/public/html/footer.html", () => {


  $.getScript("/public/js/footer.js", function() {
    startFooter();

  });
    });
    });



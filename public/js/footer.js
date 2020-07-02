


function startFooter() {
    
    $('.cookie_ok').click(function(){
    $('.cookie_warning').removeClass('show');
         var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "viewed=1; expires=" + now.toUTCString() + "; " + "path=/";
          cookie_status='1';

    });
    $('.read_policy').click(function (){
    $('.cookie_warning').removeClass('show');
                  document.location.href = '/public/path/privacy.html';

 

    });
    
    

  var cookie_status = read_cookie_header('viewed');
    
    
      if (cookie_status == null) {
 var now = new Date();
    now.setFullYear(now.getFullYear() + 2);
    document.cookie = "viewed=0; expires=" + now.toUTCString() + "; " + "path=/";
          cookie_status='0';
  }
    
    
  if (cookie_status == '0') {
    $('.cookie_warning').css('display', 'block');
    $('.cookie_warning').addClass('show');

  }

}


$('#jinxlogo').click(()=>{
    
    
    jinx();
})


function jinxThem(){
        var random= Math.floor(Math.random() * Math.floor(5));
var arrayArray=['#3f4045','#5cf64a','#fe64a3','#afece7','#f6ae2d','#1b98e0'];
//var arrayArray=['#5cf64a','#fe64a3','#9dfff9','#ffd670'];
    return arrayArray[random];
}


function jinx(){
     var items=$('*');
    for(var i=0; i<items.length; i++){
    /*items[i].css('color', jinxThem());
    items[i].css('background-color', '#3f4045');
    items[i].css('border-color', jinxThem());
    items[i].css('fill', jinxThem());*/
        items[i].style.color= jinxThem();
        items[i].style.borderColor= jinxThem();
        items[i].style.fill= jinxThem();
        if(items[i].tagName=='IMG'){
            items[i].style.filter= 'hue-rotate('+Math.floor(Math.random() * Math.floor(360))+'deg)';

        }
    
        }
    setTimeout(function() { jinx(); }, 190);
}





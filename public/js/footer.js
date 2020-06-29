"use strict";


function startFooter() {

}


$('#jinxlogo').click(() => {

    jinx();
});


function jinxThem() {
    var random = Math.floor(Math.random() * Math.floor(5));
    var arrayArray = ['#3f4045', '#5cf64a', '#fe64a3', '#afece7', '#f6ae2d', '#1b98e0'];
    //var arrayArray=['#5cf64a','#fe64a3','#9dfff9','#ffd670'];
    return arrayArray[random];
}


function jinx() {
    var items = $('*');
    for (var i = 0; i < items.length; i++) {
        /*items[i].css('color', jinxThem());
        items[i].css('background-color', '#3f4045');
        items[i].css('border-color', jinxThem());
        items[i].css('fill', jinxThem());*/
        items[i].style.color = jinxThem();
        items[i].style.borderColor = jinxThem();
        items[i].style.fill = jinxThem();
        if (items[i].tagName == 'IMG') {
            items[i].style.filter = 'hue-rotate(' + Math.floor(Math.random() * Math.floor(360)) + 'deg)';

        }

    }
    setTimeout(function () {
        jinx();
    }, 190);
}
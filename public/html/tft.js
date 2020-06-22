var shit=[];
$('.additem').click(function(){
    var innerhtml;
    innerhtml=$('.container').html();
    innerhtml+='<input type="text" class="itemname"/>';
    $('.container').html(innerhtml);
    
})
$('.save').click(function(){
    
    var items=$('.itemname');
            var tinyshit={}

    for(var i=0; i<items.length; i++){
        tinyshit[i]=items[i].value;
    }
    shit.push(tinyshit);
})
$('.print').click(function(){
    
    console.log(shit)
    var strings=JSON.stringify(shit);
    function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
download(strings, 'json.txt', 'text/plain');

})
$('.reset').click(function(){$('.container').html('')})
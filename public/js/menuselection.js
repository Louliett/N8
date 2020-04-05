
$("#includedContent").load("/public/html/header.html", () =>{
    


//self.location=(decodeURIComponent(window.location)+''+'event.target.innerHTML');



var items=read_cookie('items');

    







var jsonInfo;
var jsonFile;
var maxItemsDisplay=3;
var startValue=0;

(function () {

fetch('db/items1.json') 
    .then((response) => {
            return response.json();
        })
        .then((myJson) => {
        jsonFile=myJson;

    
    
            jsonInfo=myJson;



var x=$(document).width();
var y=screen.height;

var navbar=document.getElementById("navbar");
navbar.setAttribute("style", "width:100%; height:"+32+"px;");

var height=navbar.offsetHeight;



$(window).resize(function() {
    x=$(window).width();
    y=screen.height;
    navbar.setAttribute("style", "width:100%; height:"+32+"px;");
var height=navbar.offsetHeight;
var wrapper=document.getElementById("categorySpace");
//wrapper.setAttribute("style", "margin-top:"+height+"px;");
});



$(window).resize(function() {


var rows=document.getElementById("itemrow");
    
    var elements=rows.childNodes; 
    
var x=$(document).width();
    var xx=window.innerWidth;
var y=screen.height;
    var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
    for(var i=0;i<elements.length;i++){
        
        var item=document.getElementById(elements[i].getAttribute("id"));
        
        if(w>740){
    
        
        item.setAttribute("style", "width: "+Math.floor(x/4)+"px; height: "+Math.floor(y*0.8)+"px;");
        }else{
            item.setAttribute("style", "width: "+Math.floor(x/2)+"px; height: "+Math.floor(h*1.1)+"px; padding:4px;");
            
        }
        }
    
 
    });

for(var ii=startValue; ii<jsonInfo.length-maxItemsDisplay; ii++){
 startValue++;   
var x=$("#main").width();
    var xx=window.innerWidth;
var y=screen.height;
    var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
var cardDiv = document.createElement("div");      
    var containerName=jsonInfo[ii].productid;

    if(w>740){    
        cardDiv.setAttribute("class", "productcontainer");
        cardDiv.setAttribute("id", containerName);
        cardDiv.setAttribute("style", "width: "+(Math.floor(x/4))+"px; height: "+Math.floor(y*0.8)+"px;");
        document.getElementById("itemrow").appendChild(cardDiv);
    }else{

        cardDiv.setAttribute("class", "productcontainer");
        cardDiv.setAttribute("id", containerName);
        cardDiv.setAttribute("style", "width: "+Math.floor(x/2)+"px; height: "+Math.floor(h*1.1)+"px; padding:4px;");
        document.getElementById("itemrow").appendChild(cardDiv);
        
    }
    $(cardDiv).click(function(){
        var now = new Date();
               now.setFullYear( now.getFullYear() + 2 );
            document.cookie="id="+$(this).attr('id')+"; expires=" + now.toUTCString() + "; " + "path=path/search.html";
        document.location.href="/public/path/item.html";
    });
    
    
    var cardImg = document.createElement("img");                 
        cardImg.setAttribute("class", "productimg");
        cardImg.setAttribute("src", "img/"+jsonInfo[ii].url[0]);
        //cardImg.setAttribute("src", "img/loading.gif");
        document.getElementById(containerName).appendChild(cardImg);
        var ratio=cardImg.naturalWidth/cardImg.naturalHeight;
    var x=$(document).width();
    
    
    var cardDivInner= document.createElement("div");
        cardDivInner.setAttribute("class", "productdescription");
        cardDivInner.setAttribute("id", "productdescription"+containerName);
        
        document.getElementById(containerName).appendChild(cardDivInner);
    var x=$(document).width();
    
    var cardTag= document.createElement("strong");
        cardTag.innerHTML=jsonInfo[ii].subcategory;
        document.getElementById("productdescription"+containerName).appendChild(cardTag);
    var x=$(document).width();
    
    var cardTitle= document.createElement("p");
        cardTitle.setAttribute("class", "producttitle");
        cardTitle.innerHTML=jsonInfo[ii].name;;
     document.getElementById("productdescription"+containerName).appendChild(cardTitle);
    var x=$("#main").width();

        var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
        
        
           var x=window.devicePixelRatio;


        
    
     var priceDiv = document.createElement("div");
        priceDiv.setAttribute("class", "price");
        priceDiv.setAttribute("id", "price"+ii);
        priceDiv.innerHTML=jsonInfo[ii].price;
        document.getElementById(containerName).appendChild(priceDiv);

        

        
    
    
    
    cardDiv.addEventListener("mouseover", function(){
        //var image=this.childNodes[1].setAttribute("style", "width:60%; height:120%;");
    })
    }

var list = document.getElementById("itemrow");
list.removeChild(list.childNodes[0]);   



var rows=document.getElementById("itemrow");
    
    var elements=rows.childNodes; 
    
var x=$(document).width();
    var xx=window.innerWidth;
var y=screen.height;
var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
    for(var i=0;i<elements.length;i++){
        
        var item=document.getElementById(elements[i].getAttribute("id"));
        
        if(w>740){
    
        
        item.setAttribute("style", "width: "+Math.floor(x/4)+"px; height: "+Math.floor(y*0.8)+"px;");
        }else{
            item.setAttribute("style", "width: "+Math.floor(x/2)+"px; height: "+Math.floor(h*1.1)+"px; padding:4px;");
         
            
            
        }
        }




$(document).ready(function(){
  $(".search").click(function(){
    
    $(".searchbar").css("width", "100%");
      $(".search").css("display", "none");
      $(".closesearch").css("display", "block");
      
      
  });
    
    $(".closesearch").click(function(){
        $(".searchbar").css("width", "0%");
      $(".search").css("display", "block");
      $(".closesearch").css("display", "none");

  });
    $(".dropbtn-cart").click(function(){
        /*var items=['eor3q9s:1', 'e8sry24o:2'];
     var now = new Date();
               now.setFullYear( now.getFullYear() + 2 );
            document.cookie="items="+items+"; expires=" + now.toUTCString() + "; " + "path=/";
            console.log(now);*/
                    document.location.href = '/public/path/cart.html'

        

  });
    $(".dropbtn-profile, .profilebtn").click(function(){
            document.location.href = '/public/path/login.html'
            console.log(now);
        

  });
});

document.addEventListener('keydown', function(event) {
    if(event.keyCode == 13) {
        if($(".inputsearch").is(":focus")){
            var now = new Date();
               now.setFullYear( now.getFullYear() + 2 );
            document.cookie="query="+$(".inputsearch").val()+":"+ $(".inputsearch").val()+"; expires=" + now.toUTCString() + "; " + "path=path/search.html";
            document.location.href = 'path/search.html?'+$(".inputsearch").val();
            console.log(now);
        //console.log($(".inputsearch").val());
        }
    }
});
    
    
    createBasket();
    
    
});
})();


function createBasket(){
    if(items!=null){
        items=items.split(",");
        for(var iii=0; iii<items.length; iii++){
            var smallArray=items[iii].split(':');
            items[iii]=smallArray;
        }    
    
    
    for(var i=0; i<items.length; i++){
        console.log(items[i]+" "+i+" "+items.length);        
        
        var jsonItem;
        
        for(var ii=0;ii<jsonFile.length;ii++){
    
            if(items[i][0]===jsonFile[ii].productid){
            jsonItem=jsonFile[ii];
            }
        }
        
        var cardDiv = document.createElement("div");                 
        cardDiv.setAttribute("class", "basketitem");
        cardDiv.setAttribute("id", items[i][0]);
        document.getElementById("itemsdropdown").appendChild(cardDiv);
        
        cardDiv = document.createElement("div");                 
        cardDiv.setAttribute("class", "basketimage");
        cardDiv.setAttribute("id", "basketimage"+items[i][0]);
        document.getElementById(items[i][0]).appendChild(cardDiv);
        
        cardDiv = document.createElement("img");                 
        cardDiv.setAttribute("class", "image");
        cardDiv.setAttribute("src","/public/img/"+jsonItem.url[0]);
        document.getElementById("basketimage"+items[i][0]).appendChild(cardDiv);
            
        cardDiv = document.createElement("div");                 
        cardDiv.setAttribute("class", "basketinfo");
        cardDiv.setAttribute("id", "basketinfo"+items[i][0]);
        document.getElementById(items[i][0]).appendChild(cardDiv);
            
        cardDiv = document.createElement("p");  
            cardDiv.innerHTML=jsonItem.name;
        document.getElementById("basketinfo"+items[i][0]).appendChild(cardDiv);
        
        cardDiv = document.createElement("p");  
            cardDiv.innerHTML="quantity: "+items[i][1];
        document.getElementById("basketinfo"+items[i][0]).appendChild(cardDiv);
        
        cardDiv = document.createElement("p");  
            cardDiv.innerHTML=jsonItem.price;
        document.getElementById("basketinfo"+items[i][0]).appendChild(cardDiv);
    }
    }
    
    
}

function read_cookie(key){
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}


$(".buttontext").click(()=>{
    maxItemsDisplay=0;
    
    updateItems();
    
    
});



function updateItems(){
    
    for(var ii=startValue; ii<jsonInfo.length-maxItemsDisplay; ii++){
 startValue++;   
var x=$("#main").width();
    var xx=window.innerWidth;
var y=screen.height;
    var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
var cardDiv = document.createElement("div");      
    var containerName=jsonInfo[ii].productid;

    if(w>740){    
        cardDiv.setAttribute("class", "productcontainer");
        cardDiv.setAttribute("id", containerName);
        cardDiv.setAttribute("style", "width: "+(Math.floor(x/4))+"px; height: "+Math.floor(y*0.8)+"px;");
        document.getElementById("itemrow").appendChild(cardDiv);
    }else{

        cardDiv.setAttribute("class", "productcontainer");
        cardDiv.setAttribute("id", containerName);
        cardDiv.setAttribute("style", "width: "+Math.floor(x/2)+"px; height: "+Math.floor(h*1.1)+"px; padding:4px;");
        document.getElementById("itemrow").appendChild(cardDiv);
        
    }
    $(cardDiv).click(function(){
        var now = new Date();
               now.setFullYear( now.getFullYear() + 2 );
            document.cookie="id="+$(this).attr('id')+"; expires=" + now.toUTCString() + "; " + "path=path/search.html";
        document.location.href="/public/path/item.html";
    });
    
    
    var cardImg = document.createElement("img");                 
        cardImg.setAttribute("class", "productimg");
        cardImg.setAttribute("src", "img/"+jsonInfo[ii].url[0]);
    console.log(jsonInfo[ii].url[0]);
        //cardImg.setAttribute("src", "img/loading.gif");
        document.getElementById(containerName).appendChild(cardImg);
        var ratio=cardImg.naturalWidth/cardImg.naturalHeight;
    var x=$(document).width();
    
    
    var cardDivInner= document.createElement("div");
        cardDivInner.setAttribute("class", "productdescription");
        cardDivInner.setAttribute("id", "productdescription"+containerName);
        
        document.getElementById(containerName).appendChild(cardDivInner);
    var x=$(document).width();
    
    var cardTag= document.createElement("strong");
        cardTag.innerHTML=jsonInfo[ii].subcategory;
        document.getElementById("productdescription"+containerName).appendChild(cardTag);
    var x=$(document).width();
    
    var cardTitle= document.createElement("p");
        cardTitle.setAttribute("class", "producttitle");
        cardTitle.innerHTML=jsonInfo[ii].name;;
     document.getElementById("productdescription"+containerName).appendChild(cardTitle);
    var x=$("#main").width();

        var ratio = window.devicePixelRatio || 1;
var w = screen.width * ratio;
var h = screen.height * ratio;
        
        
           var x=window.devicePixelRatio;


        
    
     var priceDiv = document.createElement("div");
        priceDiv.setAttribute("class", "price");
        priceDiv.setAttribute("id", "price"+ii);
        priceDiv.innerHTML=jsonInfo[ii].price;
        document.getElementById(containerName).appendChild(priceDiv);

        

        
    
    
    
    cardDiv.addEventListener("mouseover", function(){
        console.log(this);
        //var image=this.childNodes[1].setAttribute("style", "width:60%; height:120%;");
    })
    }
    
    
}



$(document).ready(()=>{
    
    var titles=[]
    titles=titles.concat(document.getElementsByClassName('title'),document.getElementsByClassName('dropbtn-subcategory'),document.getElementsByClassName('sub'));
console.log(titles);
console.log(titles[0]);


for(var o=0; o<titles.length; o++){
    for(var m=0; m<titles[o].length; m++){
    
    titles[o][m].addEventListener('click',() =>{
        
        console.log('fuck off');
var page=createPage();
var opened = window.open("");
opened.document.write("<html><head><title>MyTitle</title></head><body>test</body></html>");
        console.log('bullshit');
    

        
        
    })
    
    
}
}
    
    
})
    
    });



function createPage(){
    var page='<!doctype html><html lang="en"><head><!-- Required meta tags --><meta charset="utf-8"><!-- jQuery library --><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script><link href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap" rel="stylesheet"><link rel="stylesheet" href="css/mainpage.css"><link rel="stylesheet" href="css/header.css"><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></head><body id="main"><div id="includedContent"></div><div id="wrapper"></div><div id="itemrow"></div><div class="loadMore"> <div class="svg-wrapper"><svg height="60" width="320" xmlns="http://www.w3.org/2000/svg" class="parentshape"><rect class="shape" height="60" width="320" /></svg><div class="buttontext">load more</div></div></div><div class="footer"><h2 style="color:#ffffff;">Footer</h2><a>Link1</a><a>Link2</a></div><script src="/public/js/menuselection.js"></script></body></html>'
    
    
    return page;
    
}
    




   




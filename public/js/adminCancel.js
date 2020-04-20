var id=Cookies.get('admin');
var sessionId=Cookies.get('sessionId');




if(id!==null && id!==undefined){
    if(sessionId!==null && sessionId!==undefined){
        
    }else{
        window.stop();
location.replace('/public/admin/go_away.html')        
    }
}else{
    window.stop();
location.replace('/public/admin/go_away.html')        

}


document.addEventListener("DOMContentLoaded",function(e){
    
    console.log(e);
    document.getElementById('logout').addEventListener('click', ()=>{
    
        console.log('what')

    
    
      document.location.href = '/public/';
    document.cookie = "admin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/public/admin;";
    document.cookie = "sessionId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/public/admin;";

})
    })




    
    

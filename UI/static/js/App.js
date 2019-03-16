loadLocalHTML = function (uri){
    var htmlCode = '';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
        htmlCode = xmlhttp.responseText;
        document.getElementById('main-body').innerHTML = htmlCode;
        console.log(htmlCode);
        }
    };
    xmlhttp.open("GET",uri,true);
    xmlhttp.send();
}

setLiveTime = function(){
    var refresh=1000; 
    mytime=setTimeout('setCurrentTime()',refresh)
}
setCurrentTime = function () {
    var today = new Date();
    var date = today.getDate()+'-'+ (today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    setLiveTime()
    document.getElementById('time-date').innerHTML = dateTime;
};

App = function(){
    console.log('EPIC-MAIL system loaded')
    setCurrentTime();
}
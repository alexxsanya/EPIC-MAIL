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
    uri = "./components/"+uri;
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

loadMessage = function(caption){

    document.getElementById('main-body').innerHTML = "Loading...";

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
        var msgJson = xmlhttp.responseText;
        msgJson = JSON.parse(msgJson);
        var data = "<table>";
        if(isEmpty(msgJson)){
            data += "<caption> Currently No "+caption+" Messages</caption>";
        }else{
            data += "<caption>"+caption+" Messages</caption>";
            msgJson.forEach(msg => {
                data += "<tr>"+
                            "<td>"+msg.subj+"</td>"+
                            "<td class='msg-body'>"+msg.body+"</td>"+
                            "<td>"+ msg.date_time+
                            "</td>"+
                            "<td class='td-action'>[ del ]</td>"+
                            "<td class='td-action'>[ x ]</td>"+
                        "</tr>";           
                });    
        }
        data +="</table>";
        document.getElementById('main-body').innerHTML = data;
    }else if(xmlhttp.status == 404){
            console.log(xmlhttp.statusText)
            document.getElementById('main-body').innerHTML = "<error>Error Occured. Contact Support Team</error>";
        }
    };

    uri = "./static/js/"+caption+".json";
    xmlhttp.open("GET",uri,true);
    xmlhttp.send();

    function isEmpty(arg) {
        for (var item in arg) {
          return false;
        }
        return true;
      }
}

resetPassword = function(){
    var reset_btn = document.getElementById('reset-pass')
    var reset_value = document.getElementById('recover-to')

    reset_btn.setAttribute("disabled","disabled")

    reset_btn.addEventListener('click',function(){
        console.log(reset_value.value)
        reset_value.value = ""
        alert("Check Your Email or Phone SMS for Reset Link")

        document.getElementById('reset-pass-modal').style.display='none'

    })

    reset_value.addEventListener('keyup',function(){
        if(reset_value.value.length>12){
            console.log("You can now request for a request")
            reset_btn.removeAttribute("disabled")
        }
    })
}
App = function(){
    console.log('EPIC-MAIL system loaded')
    setCurrentTime();
}

LoginApp = function(){
    resetPassword()
}
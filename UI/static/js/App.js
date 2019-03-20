loadLocalHTML = function (uri){
    var htmlCode = '';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
        htmlCode = xmlhttp.responseText;
        document.getElementById('main-body').innerHTML = htmlCode;
        }
    };
    uri = "./components/"+uri;
    xmlhttp.open("GET",uri,true);
    xmlhttp.send();
}

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
                data += "<tr onclick='readMessage("+msg.id+")'>"+
                            "<td>"+msg.subj+"</td>"+
                            "<td class='msg-body'>"+msg.body+"</td>"+
                            "<td>"+ msg.date_time+
                            "</td>"+
                            "<td class='td-action'></td>"+
                            "<td class='td-action'></td>"+
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

readMessage = function(msg_id){
    loadLocalHTML('message.html')
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

addGroup = function(){ 
    var add_group = document.getElementById('create-group-container')
    var add_member =  document.getElementById('add-member-container')
    add_group.setAttribute('style','display:flex');
    add_member.setAttribute('style','display:none')
}

addMembertoGroup = function(){ 
    var add_group = document.getElementById('create-group-container')
    var add_member =  document.getElementById('add-member-container')  
    add_member.setAttribute('style','display:flex');
    add_group.setAttribute('style','display:none')
}

addContact = function(){
    var add_member =  document.getElementById('create-contact-container')  
    add_member.setAttribute('style','display:flex'); 
}
App = function(){
    console.log('EPIC-MAIL system loaded')
    setCurrentTime();
}

LoginApp = function(){
    resetPassword()
}
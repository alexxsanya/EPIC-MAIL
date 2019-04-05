APP_URL = 'https://api-epicmail-v2.herokuapp.com/api/v1/'
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

createUser = function(e){
    let signup_btn = document.getElementById('create-user-btn')
    signup_btn.innerText = "Loading..."
    e.preventDefault() 
    console.log(signup_is_valid)
    if(false in signup_is_valid){

        invalid_fields = []

        signup_is_valid.forEach((value,key)=>function(){
            if(value==false){
                invalid_fields.push(key)
            }
            console.log(invalid_fields)
        })
        signup_btn.innerText = "CREATE Account"

    }else{

        let signupForm = document.getElementById('signup-form')
        let formData = new FormData(signupForm)
        let userData = {}
    
        formData.set("email", formData.get('email')+'@epicmail.com');
    
        formData.forEach((value, key) => {userData[key] = value});
    
        url = APP_URL+"auth/signup"
        fetch(url, {
            method: 'POST', 
            mode:"cors",
            body: JSON.stringify(userData), 
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
          })
          .then(response => response.json())
          .then(data => {
            
            if(data.error == undefined){
                console.log(data)
            }else{
                alert(data.error)
            }
            signup_btn.innerText = "CREATE Account"
          }) 
          .catch(error => console.error(error))
    }
}

App = function(){
    console.log('EPIC-MAIL system loaded')
}

LoginApp = function(){
    resetPassword()
}
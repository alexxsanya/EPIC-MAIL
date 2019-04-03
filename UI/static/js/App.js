APP_URL = 'https://api-epicmail-v2.herokuapp.com/api/v1/'
//APP_URL = 'http://localhost:5000/api/v1/'
const TOKEN = sessionStorage.getItem('token')
loadLocalHTML = function (uri){
    var htmlCode = '';
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
    if(xmlhttp.status == 200 && xmlhttp.readyState == 4){
        htmlCode = xmlhttp.responseText;
        document.getElementById('main-body').innerHTML = htmlCode;

        if(uri == "./components/groups.html"){
            groups = document.getElementById('group-list')
            
            fetch(
                APP_URL+'groups', 
                {
                headers: new Headers({
                  'User-agent': 'Mozilla/4.0 Custom User Agent',
                  'Authorization':`Bearer ${TOKEN}`
                })
              })
              .then(response => response.json())
              .then(data => { 
                console.log(data.data[0])
                groupList = data.data

                groupHTML = `
                    <table style="min-width:400px !important;">
                    <caption>User Groups</caption>
                    `
                groupList.forEach(group => {
                    groupHTML += `
                        <tr>
                        <td>${group.name}</td>
                        <td>${group.role}</td>
                        <td class='td-action positive' onclick="sendGroupMessage(${group.id})">
                            <i class="far fa-paper-plane"></i>
                        </td>
                        <td class='td-action' onclick="deleteGroup(${group.id})">
                            <i class="far fa-trash-alt"></i>
                        </td>
                        </tr>
                    `
                }) 
                groupHTML += `</table>`

                groups.innerHTML = groupHTML
              })
              .catch(error => console.error(error))
            }
        }
    };
    uri = "./components/"+uri;
    xmlhttp.open("GET",uri,true);
    xmlhttp.send();
}

loadMessage = function(caption){

    document.getElementById('main-body').innerHTML = "Loading...";
    var url = APP_URL+'messages/'+caption
    sessionStorage.setItem('current_page',caption)
    url = {
        'inbox':'messages',
        'sent':'messages/sent',
        'draft':'messages/draft',
        'unread':'messages/unread'
    }
    fetch(
        APP_URL+url[caption], 
        {
            method: 'GET', 
            mode:"cors",
            headers: new Headers({
            'User-agent': 'Mozilla/4.0 Custom User Agent',
            'Authorization':`Bearer ${TOKEN}`
            })
      })
      .then(response => response.json())
      .then(data => { 
        if(data.msg == "Token has expired" ){
            alert("session expired")
            sessionStorage.removeItem('username')
            sessionStorage.removeItem('token')
            location.reload()
        }
        var ui_data = "<table>";
        if(isEmpty(data.data)){
            ui_data += `<caption> Currently No ${caption} Messages</caption>`;
        }else{
            ui_data += `<caption>${caption} Messages</caption>`;
            data.data.forEach(msg => {
                ui_data += `<tr>
                            <td onclick='readMessage(${msg.id})'> ${msg.subject}</td>
                            <td class='msg-body' onclick='readMessage(${msg.id})'> ${msg.msgbody} </td>
                            <td onclick='readMessage(${msg.id})'> ${msg.createdon}</td>
                            <td class='td-action' onclick="deleteMessage(${msg.id})"><i class="far fa-trash-alt"></i></td>
                            <td class='td-action'></td>
                        </tr>`;           
                });    
        }
        ui_data +="</table>";
        document.getElementById('main-body').innerHTML = ui_data;
      })
      .catch( error => {
        document.getElementById('main-body').innerHTML = `
            <error>Kindly contact epicmail support team</error>
            `;
        })
      
    function isEmpty(arg) {
        for (var item in arg) {
          return false;
        }
        return true;
      }
}

readMessage = function(msg_id){
    current_page = sessionStorage.getItem('current_page')
    fetch(
        APP_URL+'messages/'+msg_id, 
        {
        headers: new Headers({
          'User-agent': 'Mozilla/4.0 Custom User Agent',
          'Authorization':`Bearer ${TOKEN}`
        })
      })
      .then(response => response.json())
      .then(data => { 
        console.log(data)
        message = data.data[0]
        
        messageCode = `<div class="msg-container">
            <div class="msg-bar">
                <div class="back-btn"> 
                    <button onclick="loadMessage('${current_page}')">
                            Back
                    </div>
                <div class="msg-actions">
                    <div class="item">
                        Reply
                    </div>
                    <div class="item" onclick="deleteMessage(${message.id})">
                        Delete
                    </div>
                </div>
            </div>
            <div class="msg-display">
                <div class="msg-title">
                    <div class="subject"> ${message.subject}</div>
                    <div class="sender"> <from>from</from> ${message.sender}</div>
                    <div class="timedate"> ${message.createdon}</div>
                </div>
                <div class="msg-body">
                    ${message.msgbody}
                </div>

                <div class="msg-reply-form">
                    <textarea class="reply-msg-txtarea" placeholder="reply" 
                        id="reply-msg-body" parent_id="${message.id}"></textarea>
                    <button type="button" id="reply-msg-btn" class="reply-msg-btn">reply</button>
                </div>
            </div>

        </div>`
        document.getElementById('main-body').innerHTML = messageCode;
      })
      .catch(error => console.error(error))

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
    var create_group_btn = document.getElementById('create-group')
    add_group.setAttribute('style','display:flex');
    add_member.setAttribute('style','display:none')

    create_group_btn.addEventListener('click', function(){
        
        let name = document.getElementById('group-name').value
        let role = document.getElementById('group-description').value
        let status_label = document.getElementById('resp-status')
        status_label.innerHTML = 'processing...'
        group = {
            "name":name,
            "role":role
        }
        url = APP_URL+"groups"
        fetch(url, {
            method: 'POST', 
            mode:"cors",
            body: JSON.stringify(group), 
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TOKEN}`
            }),
          })
          .then(response => response.json())
          .then(data => {
            
            if(data.error == undefined){
                console.log(data.data)
                status_label.innerHTML = '<success>Group successfully created<success>'
                setTimeout(function(){
                    loadLocalHTML('groups.html')
                }, 5000)
            }else{
                alert(data.error)
            }
          }) 
          .catch(error => console.error(error))
    });
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
                console.log(data['data'][0].user)                    
                sessionStorage.setItem('token',data['data'][0].token)
                sessionStorage.setItem('username',data['data'][0].user.firstname)
                location.replace("./")
            }else{
                alert(data.error)
            }
            signup_btn.innerText = "CREATE Account"
          }) 
          .catch(error => console.error(error))
    }
}

sendMessage = function(action){

    msg_receiver = document.getElementById('msg-receiver').value
    msg_body = document.getElementById('msg-body').value
    msg_subject = document.getElementById('msg-subject').value
    send_message = document.getElementById('send_message')
    send_message.innerText = 'sending..'

    option = {
        'save':APP_URL+"messages/draft",
        'send':APP_URL+"messages"
    }

    if(msg_receiver.length>10 && msg_body.length>4){
        message = {
            "subject": msg_subject,
            "receiver": msg_receiver,
            "msgBody": msg_body
        }
        url = option[action]
        fetch(url, {
            method: 'POST', 
            mode:"cors",
            body: JSON.stringify(message), 
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TOKEN}`
            }),
          })
          .then(response => response.json())
          .then(data => {
            
            if(data.error == undefined){
                console.log(data.data.message)
                alert(data.data.message)
            }else{
                alert(data.error)
            }
            send_message.innerText = 'Send'
          }) 
          .catch(error => console.error(error))

    }else{
        alert('check, You have missing fields or with invalid data')
    }
    
}

deleteMessage = function(id){
    url = `${APP_URL}messages/${id}`;
    current_page = sessionStorage.getItem('current_page')
    fetch(url, {
        method: 'DELETE', 
        mode:"cors",
        headers: new Headers({
          'Authorization': `Bearer ${TOKEN}`
        }),
      })
      .then(response => response.json())
      .then(data => {
        
        if(data.error == undefined){
            console.log(data.data.message)
            alert(data.data.message)
            location.replace("./") 
        }else{
            console.log(data.error)
        }
      }) 
      .catch(error => console.error(error)) 
}

App = function(){
    console.log('EPIC-MAIL system loaded')
    token = sessionStorage.getItem('token')
    if(token === null || token.length<150){
        location.replace('./login.html')
    }
}

LoginApp = function(){
    resetPassword()
    login_btn = document.getElementById('login-btn')
    login_btn.preventDefault

    login_btn.onclick = function() { 
        username = document.getElementById('user-name').value
        pass = document.getElementById('user-pass').value
        login_btn.innerText = "Loading..."
        
        if(pass.length>6 && username.length>3){
            
            user = {
                'email':`${username}@epicmail.com`,
                'password':pass
            };
            url = APP_URL+"auth/login"
            fetch(url, {
                method: 'POST', 
                mode:"cors",
                body: JSON.stringify(user), 
                headers: new Headers({
                  'Content-Type': 'application/json'
                }),
              })
              .then(response => response.json())
              .then(data => {
                  
                if(data.error == undefined){
                    console.log(data['data'][0].user)
                    sessionStorage.setItem('token',data['data'][0].token)
                    sessionStorage.setItem('username',data['data'][0].user.firstname)
                    location.replace("./") 
                }else{
                    alert(data.error)  
                }  
                login_btn.innerText = "Login"  
              }) 
              .catch(error => {
                console.log(error)
                login_btn.innerText = "Login"  
              }) 
            
                    
        }


    }
}
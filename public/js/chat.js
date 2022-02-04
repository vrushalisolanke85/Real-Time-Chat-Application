// io()- initialize the connection

//to send event and receive event from bothe server and client
const socket=io()

socket.on('message',(msg)=>{
    console.log(msg)
})


const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $messageButton=document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//TEMPLATE
const messageTemplate = document.querySelector('#message-template').innerHTML
const messageLocationTemplate=document.querySelector('#Location-message-template').innerHTML

//option
const {username, room}= Qs.parse(location.search,{ignoreQueryPrefix:true})


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('messageLocation',(message)=>{
    //console.log(url)
    const html=Mustache.render(messageLocationTemplate,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

//client(emit)->server(receive)->sendMessage
$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disable button
    $messageFormButton.setAttribute('disabled','disabled')
    //const message=document.querySelector('input').value   //getting input by tag
    const message=e.target.elements.message.value //getting input by name of tag

    //enabled button
  
    socket.emit('sendMessage',message,(err)=>{
        $messageFormButton.removeAttribute('disabled')  
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(err){
            return console.log(err)
        }
        console.log('Message was delivered!!')
    })

})

$messageButton.addEventListener('click',()=>{
    
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser!!')
    }
    $messageButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        
        //$messageFormButton.removeAttribute('disabled')  
        console.log(position)

        socket.emit('sendLocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(message)=>{
            console.log('Location sent sccsessfully!!',message)
        })

        $messageButton.removeAttribute('disabled') 
    })

})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})



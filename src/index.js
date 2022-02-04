const path=require('path')
const http=require('http')
const express=require('express')
const socketio=require('socket.io')
const Filter=require('bad-words')
const {generateMessage,generateLocationMessages}=require('./utils/messages')
const {addUser,removeUser,getUser,getUserInRoom}=require('./utils/users')

const app=express()
const server=http.createServer(app) //this is done behind by default so here we do not change anythis just refactoring it
const io=socketio(server)//Now our server supports web socket

//initializing port address
const port=process.env.PORT||3000


//rendering the HTML file
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))




//print a message to terminal when client connect
//connection gets fired whenver socket io gets a new connection
//share a count to every connected client


//server (emit)->client(receive)-countUpdated
//client (emit)->server(receive)-increment


//let count=0;
io.on('connection',(socket)=>{
    console.log('New web socket connection!!')
    
    
    socket.on('join',(option,callback)=>{
        const {error,user}=addUser({id:socket.id,...option})
        if(error){
           return callback(error)
        }
        socket.join(user.room)

        socket.emit('message',generateMessage(user.username,'Welcome!!'))
        // let msg="Welcome!!"
        // socket.emit('message',msg)


        //all connected client get message when new user enter
        socket.broadcast.to(user.room).emit('message',generateMessage(`${user.username} has joined!`))//emit the message to all except socket

        callback()
    })
    
    socket.on('sendMessage',(message,callback)=>{
        const user=getUser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()
    })

    //all connected client get message that a user is disconnect
    //connect and disconnect are built in event no need to listen on client side
    socket.on('disconnect',()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMessage(`A ${user.username} has left!!!`))
        }
    })

    socket.on('sendLocation',(cords,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('messageLocation',generateLocationMessages(user.username,`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback('Location Shared!!')
    })

})





//Connecting to server
server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})
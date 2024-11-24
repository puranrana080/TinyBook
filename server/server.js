const {instrument} =require('@socket.io/admin-ui')

const io = require('socket.io')(3000,{
    cors:{
        origin:['http://localhost:8080','https://admin.socket.io'],
        credentials: true,
    },
})//3000 is port where socket.io gonna run
const users={}
io.on('connection', socket => {  //this gonna run every single time client connect to a server and give a socket instance for each on of the user 
    console.log(socket.id)


    socket.on('new-user',name=>{
        users[socket.id]=name
        socket.broadcast.emit('user-connected',name)
    })

    socket.on('send-message',(message,room)=>{
        if(room===''){
        socket.broadcast.emit('receive-message',{message,name:users[socket.id]})
        }
        else{
            socket.to(room).emit('receive-message',{message,name:users[socket.id]})
        }
    })


    socket.on('join-room',(room,cb)=>{
        socket.join(room)
        cb(`Joined ${room}`)
    })
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-disconnected',users[socket.id])
        delete users[socket.id]
    })
})

instrument(io,{auth:false})
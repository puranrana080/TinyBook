
import { io } from 'socket.io-client'


const JoinRoomButton = document.getElementById('room-button')
const messageInput = document.getElementById('message-input')

const roomInput = document.getElementById('room-input')
const form = document.getElementById('form')

const socket = io('http://localhost:3000')//here need to pass the url of server


socket.on('connect',()=>{
    const name = prompt('What is your name?')
    displayMessage(`You (${name}) connected with id ${socket.id}`)
    socket.emit('new-user',name)
})

socket.on('receive-message',data=>{
    displayMessage(`${data.name} : ${data.message}`)
})
socket.on('user-connected',name=>{
    displayMessage(`${name} connected`)
})

socket.on('user-disconnected',name=>{
    displayMessage(`${name} disconnected`)
})


form.addEventListener('submit', e => {
    e.preventDefault()
    const message = messageInput.value
    const room = roomInput.value
    
    if (message === "") return
    displayMessage(`You : ${message}`)
    socket.emit('send-message',message,room)

    messageInput.value = ""

})

JoinRoomButton.addEventListener("click", () => {
    const room = roomInput.value
    socket.emit('join-room',room,message=>{
        displayMessage(message)
    })

})



function displayMessage(message) {
    const div = document.createElement('div')
    div.textContent = message
    const messageContainer=document.getElementById('message-container')

    messageContainer.appendChild(div)

    messageContainer.scrollTop = messageContainer.scrollHeight

}
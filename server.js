const express = require('express')
const colors = require('colors')
const path = require('path');
const { createServer } = require('http')
const { readFileSync, writeFileSync } =  require('fs')
const { Server } = require('socket.io')
 

// express server init
const app = express();

// static 
app.use(express.static(path.join(__dirname, '')))

// create express server to row server
const httpServer = createServer(app)

// create soket io server
const io = new Server(httpServer)

// create a connection with  client
io.on('connection', (socket) => {
    console.log("a user connected");
     
    // get letest chat
     let letestChat = JSON.parse(readFileSync(path.join(__dirname, 'db/db.json').toString()))
     io.sockets.emit('letestChat', letestChat)

    socket.on('chat', ({ name, photo, msg }) => {
       
        // get old chat
        const oldChat = JSON.parse(readFileSync(path.join(__dirname, 'db/db.json').toString()))
        
        // add chat
        oldChat.push({ name, photo, msg })
    
        // send chat to database
        writeFileSync(path.join(__dirname, 'db/db.json'), JSON.stringify(oldChat))

       

    })

})

// load client
app.get('/', ( req, res ) => {
    res.sendFile(path.join(__dirname, 'client.html'))
});


// server listener
httpServer.listen( 5050, () =>  {
    console.log(`Server is runing on 5050 port`.bgMagenta.black);
});
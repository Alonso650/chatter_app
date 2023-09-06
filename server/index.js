const express = require("express");
const app = express()
const http = require('http');
const cors = require('cors');
const { Server } = require("socket.io")

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // which server would be making the calls
        origin: "http://localhost:3000",
        // can accept GET, POST etc requests
        methods: ["GET", "POST"],
    },
});

// waiting and listening for this specific event
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        // join connects to the front end to retrieve the data 
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`)
    })

    socket.on("send_message", (data) => {
        // This will emit/send message to the specific chatroom
        // that the user is in
        socket.to(data.chatRoom).emit("receive_message", data);
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});






server.listen(3001, () => {
    console.log("Server started");
}); 
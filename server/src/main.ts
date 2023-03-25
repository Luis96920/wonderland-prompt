// src/server.ts
import express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import cors from "cors"




const app = express();
app.set("port", process.env.PORT || 3000);

app.use(cors())

import http from "node:http";
let s = http.createServer(app);


let io = new socketio.Server(s, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]

  }
});

app.get("/", (req: any, res: any) => {
    res.sendFile(path.resolve("./client/index.html"));
});

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
let messages = []
io.on("connection", function (socket: any) {
    console.log("a user connected");
    io.emit("chat_messages", messages)
    socket.on("chat_message", (msg: any) => {
      console.log("message: " + msg)
       messages = [...messages, msg]
       messages = messages.slice(-100)
       console.log("Emitting messages: " + messages)
        io.emit("chat_message", msg)

    });
});

// start our simple server up on localhost:3000
const server = s.listen(3000, function () {

    console.log("listening on http://127.0.0.1:3000");
});
// src/server.ts
import * as express from "express";
import * as socketio from "socket.io";
import * as path from "path";

const app = express();
app.set("port", process.env.PORT || 3000);

// var http = require("http").Server(app);
import http from "node:http";
let s = http.createServer(app);

// set up socket.io and bind it to our
// http server.
let io = require("socket.io")(http);



// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function (socket: any) {
    console.log("a user connected");
});

// start our simple server up on localhost:3000
const server = s.listen(3000, function () {
    console.log("listening on *:3000");
});
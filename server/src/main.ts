// src/server.ts
import express from "express";
import * as socketio from "socket.io";
import * as path from "path";
import cors from "cors";
import fetch from "node-fetch";
import baseImg from "./baseImg";
import { getBaseArt } from "./base_imagev2";
let img = getBaseArt();
let loading = false;
let batchSize = 12;
let batch = 0;

const app = express();
app.set("port", process.env.PORT || 3000);

app.use(cors());

import http from "node:http";
import { appendFileSync } from "fs";
let s = http.createServer(app);

let io = new socketio.Server(s, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.get("/reset", (req: any, res: any) => {
  img = getBaseArt();
  loading = false;
  io.emit("ai_image", img);
  io.emit("loading", loading);

  res.send("Reset!");
});
// app.get("/art", (req: any, res: any) => {
//   res.send(art)
// });

export interface ChatMessage {
  prompt: string;
  profile: {
    name: string;
    avatar: string;
    userId: string;
  };
  timestamp: string;
}

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
let messages: ChatMessage[] = [];
io.on("connection", function (socket) {
  appendFileSync("iplog.txt", socket.handshake.address + "\n");

  console.log("a user connected");
  io.emit("chat_messages", messages);
  io.emit("ai_image", img);
  io.emit("loading", loading);

  socket.on("chat_message", (msg: any) => {
    console.log("message: " + msg);
    appendFileSync(
      "chatlog.csv",
      `${msg.prompt},${msg.profile.name},${msg.profile.avatar},${msg.profile.userId},${msg.timestamp}\n`
    );

    messages = [msg, ...messages];
    messages = messages.slice(0, 100);
    console.log("Emitting messages: " + messages);
    io.emit("chat_message", msg);
    if (batch > batchSize) {
      img = getBaseArt();
      io.emit("message", "Resetting image");
      io.emit("ai_image", img);
      batch = 0;
    }
    if (!loading) {
      loading = true;
      io.emit("loading", true);
      fetch("http://127.0.0.1:1978/iterate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: msg.prompt,
          img: img,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res;
          } else {
            throw new Error("Something went wrong ai side");
          }
        })
        .then((res) => res.text())
        .then((res) => {
          img = res;
          batch += 1;

          io.emit("ai_image", res);
          loading = false;
          io.emit("loading", false);
        })
        .catch((err) => {
          loading = false;
          io.emit("loading", false);
          console.log("ERR", err);
        });
    }
  });
});

// start our simple server up on localhost:3000
const server = s.listen(3000, function () {
  console.log("listening on http://127.0.0.1:3000");
});

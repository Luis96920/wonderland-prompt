// src/server.ts
import * as express from "express";

const app = express();
app.set("port", process.env.PORT || 3000);

// var http = require("http").Server(app);
import { http } from "node:http";

// let s =
// simple '/' endpoint sending a Hello World
// response
app.get("/", (req: any, res: any) => {
    res.send("hello world");
});

// start our simple server up on localhost:3000
const server = http.listen(3000, function () {
    console.log("listening on *:3000");
});
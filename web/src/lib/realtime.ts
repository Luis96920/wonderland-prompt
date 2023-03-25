// src/lib/realtime.js
import ioClient from "socket.io-client";
const ENDPOINT = "http://10.150.81.18:3000";

const socket = ioClient(ENDPOINT)

export const io = socket

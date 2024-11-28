import { Server } from "socket.io";
import { createServer} from "node:http";
import { Express } from "express";
import { rooms } from "../rooms";

export const setupSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Connected to " + socket.id);
    // receiving a request to join a specific share
    socket.on("join-share", (id) => {
      if (id in rooms) {
        socket.join(id);
        console.log(socket.id + " joined room " + id);
      }
    })
  })


  return server;
}
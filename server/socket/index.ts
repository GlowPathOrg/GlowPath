import { Server } from "socket.io";
import { createServer} from "node:http";
import { Express } from "express";

export const setupSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("Connected to " + socket.id);
  })

  return server;
}
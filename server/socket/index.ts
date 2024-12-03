import { Server } from "socket.io";
import { createServer } from "node:http";
import { Express } from "express";
import Share from "../models/Share"
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/User";
import dotenv from 'dotenv';
import bcrypt from "bcrypt";

dotenv.config();

export const setupSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173"
    }
  });

  io.use((socket, next) => {
    console.log("Logging socket: ", socket);
    next();
  });


  /* io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  }); */

  io.on("connection", (socket) => {
    console.log("Connected to " + socket.id);

    socket.on("host-share", async (id) => {
      if (!id) return console.log("no id");
      const sanitizedId = id.replace(/[$/(){}]/g, "");
      const token = socket.handshake.auth.token;
      if (!token) return console.log("no token");
      const JWT_SECRET = process.env.JWT_SECRET
      if (!JWT_SECRET) return console.log("no jwt secret");
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const { id: userId } = decoded;
      const user = await UserModel.findOne({ _id: userId });
      if (!user) return console.log("no user");
      const share = await Share.findOne({ _id: sanitizedId, owner: user });
      if (!share) return console.log("no share");
      socket.join(id);
      console.log(socket.id + " joined room " + id);
      // TODO: send some kind of error to client when this fails https://socket.io/docs/v4/listening-to-events/
      });

    socket.on("join-share", async (id, cb) => {
      if (!id) return console.log("no id");
      const sanitizedId = id.replace(/[$/(){}]/g, "");
      const password = socket.handshake.auth.password;
      if (!password) return console.log("no password");
      const share = await Share.findOne({_id: sanitizedId});
      if (!share) return console.log("no share");
      const matchingPasswords = await bcrypt.compare(password, share.password);
      if (!matchingPasswords) return console.log("wrong password");
      socket.join(id);
      console.log(socket.id + " joined room " + id);
      // TODO: send some kind of error to client when this fails https://socket.io/docs/v4/listening-to-events/
      cb("This event was received and processed");
    });

  });

  return server;
}
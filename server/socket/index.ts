import { Server } from "socket.io";
import { createServer } from "node:http";
import { Express } from "express";
import Share from "../models/Share";
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

dotenv.config();

export const setupSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err);
  });

  io.on("connection", (socket) => {
    console.log(`Connected to socket ${socket.id}`);

    if (socket.recovered) {
      console.log("Recovered session for socket:", socket.id);
    } else {
      console.log("New session for socket:", socket.id);
    }


    socket.on("host-share", async (id) => {
      try {
        const sanitizedId = sanitizeId(id);
        if (!sanitizedId) {
          console.error(`[${socket.id}] Invalid share ID.`);
          return;
        }

        const token = socket.handshake.auth.token;
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
          console.error(`[${socket.id}] Missing JWT secret.`);
          return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        const user = await UserModel.findOne({ _id: decoded._id });
        const share = await Share.findOne({ _id: sanitizedId, owner: user });

        if (!user || !share) {
          console.error(`[${socket.id}] Unauthorized.`);
          return;
        }
          // saving room id - this was why it wasn't connecting to the front end
        socket.data.room = sanitizedId;
        socket.join(sanitizedId);
        console.log(`[${socket.id}] Hosted and joined room: ${sanitizedId}`);
      } catch (err) {
        console.error(`[${socket.id}] Error in host-share:`, err);
      }
    });


    socket.on("join-share", async (id, cb) => {
      try {
        const sanitizedId = sanitizeId(id);
        if (!sanitizedId) {
          console.error(`[${socket.id}] Invalid share ID.`);
          return cb && cb("Invalid share ID.");
        }

        const password = socket.handshake.auth.password;
        const share = await Share.findOne({ _id: sanitizedId });
        const matchingPasswords = await bcrypt.compare(password, share?.password || "");

        if (!share || !matchingPasswords) {
          console.error(`[${socket.id}] Unauthorized.`);
          return cb && cb("Unauthorized.");
        }

        socket.data.room = sanitizedId;
        socket.join(sanitizedId);
        console.log(`[${socket.id}] Joined room: ${sanitizedId}`);
        cb && cb("Successfully joined the room.");
      } catch (err) {
        console.error(`[${socket.id}] Error in join-share:`, err);
        cb && cb("Server error.");
      }
    });


    socket.on("position", (position) => {
      const room = socket.data.room;
      if (!room) {
        console.error(`[${socket.id}] No room associated. Cannot emit position.`);
        return;
      }
      console.log(`[${socket.id}] Sending position to room ${room}:`, position);
      socket.to(room).emit("position", position);
    });

    /**
     * Helper function to sanitize IDs
     */
    const sanitizeId = (id: string): string | null => {
      const sanitizedId = id.replace(/[$/(){}]/g, "").trim();
      return mongoose.Types.ObjectId.isValid(sanitizedId) ? sanitizedId : null;
    };
  });

  return server;
};

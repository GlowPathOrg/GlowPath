"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const node_http_1 = require("node:http");
const setupSocket = (app) => {
    const server = (0, node_http_1.createServer)(app);
    const io = new socket_io_1.Server(server);
    io.on("connection", (socket) => {
        console.log("Connected to " + socket.id);
    });
    return server;
};
exports.setupSocket = setupSocket;

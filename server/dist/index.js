"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket"); // This is needed to setup socket.io
const dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const server = (0, socket_1.setupSocket)(app); // This is needed to setup socket.io
console.log(server);
// ...
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

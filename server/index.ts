import express from "express";
import { setupSocket } from "./socket" // This is needed to setup socket.io
import { configDotenv } from "dotenv";
configDotenv();
const app = express();
const SERVER_PORT = process.env.SERVER_PORT;
const CLIENT_PORT = process.env.CLIENT_PORT



const server = setupSocket(app); // This is needed to setup socket.io
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});
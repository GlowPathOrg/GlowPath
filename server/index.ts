import express from "express";
import { setupSocket } from "./socket" // This is needed to setup socket.io
const app = express();
const PORT = 3000;
const server = setupSocket(app); // This is needed to setup socket.io

// ...

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
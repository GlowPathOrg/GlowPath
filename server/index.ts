import express from "express";
import { setupSocket } from "./socket" // This is needed to setup socket.io
const app = express();
const PORT = 3000;
const server = setupSocket(app); // This is needed to setup socket.io
import { v4 as uuid } from 'uuid';

// ...

interface Room {
  user: string;
  route: string;
  password: string;
}

const rooms: {[key: string]: Room} = {};

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/journey", (req, res) => {
  res.sendFile(__dirname + "/sender.html");
})

app.get("/share/create", (req, res) => {
  const id = uuid();
  const room = {user: "Testuser", route: "Testroute", password: "Testpassword"};
  rooms[id] = room;
  res.json({...rooms[id], id})
});

app.get("/observe", (req, res) => {
  res.sendFile(__dirname + "/receiver.html");
})

app.get("/share/:id", (req, res) => {

});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
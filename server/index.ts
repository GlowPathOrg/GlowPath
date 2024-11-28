import express from "express";
import { setupSocket } from "./socket" // This is needed to setup socket.io
import { configDotenv } from "dotenv"; // to access .env
import cors, { CorsOptions } from "cors";
import authRoutes from "./routes/authRoutes";
import shareRoutes from "./routes/shareRoutes";
configDotenv();
const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3002;


const CLIENT_PORT = process.env.CLIENT_PORT;

// connection to database
DBConnect();


// cors
var whitelist = [`https://glowpathorg.github.io/`, `http://localhost:${CLIENT_PORT}` ] // cors whitelist
 var corsOptions: CorsOptions = {
  origin: function (origin, callback) {

      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error(origin + ' is not included in CORS policy.' + CLIENT_PORT))
      }

  },
   methods: 'GET,POST',
   allowedHeaders: 'Content-Type, Authorization',
   credentials: true
}
//websockets content
const server = setupSocket(app); // This is needed to setup socket.io

// TODO: remove the following block when no longer needed for testing websockets
app.get("/", cors(corsOptions), (req, res) => {
  // todo might need to change /index.html to '/public'
  res.sendFile(__dirname + "/index.html");
});

//server routes
app.use(express.json());
app.use('/auth', authRoutes);
app.use(shareRoutes);

server.listen(SERVER_PORT, () => {
  console.log(`GlowPath server listening on port ${SERVER_PORT}`);
});
import express from "express";
import { setupSocket } from "./socket" // This is needed to setup socket.io
import { configDotenv } from "dotenv"; // to access .env
import cors, { CorsOptions } from "cors";
import authRoutes from "./routes/authRoutes";
configDotenv();
const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3002;

// * FOR THE SERVER TO WORK, PLEASE ADD CLIENT_PORT WITH YOUR LOCAL CLIENT PORT TO YOUR server .ENV FILE, AND ADD SERVER PORT 3002 OR SO.
const CLIENT_PORT = process.env.CLIENT_PORT;




// cors
var whitelist = [`https://glowpathorg.github.io/`, `http://localhost/${CLIENT_PORT}` ] // cors whitelist
 var corsOptions: CorsOptions = {
  origin: function (origin, callback) {

      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('You seem to not be included in the CORS policy.'))
      }

  }
}
//websockets content
const server = setupSocket(app); // This is needed to setup socket.io
app.get("/", cors(corsOptions), (req, res) => {
  // todo might need to change /index.html to '/public'
  res.sendFile(__dirname + "/index.html");
});

//server routes
app.use(express.json());
app.use('/auth', authRoutes);

server.listen(SERVER_PORT, () => {
  console.log(`Server listening on port ${SERVER_PORT}`);
});
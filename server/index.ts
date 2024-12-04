import express from "express";
import { setupSocket } from "./socket/index.js";
import dotenv from "dotenv"; // to access .env
import cors, { CorsOptions } from "cors";
import authRoutes from "./routes/authRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import { mongooseConnect, DBConnect } from "./models/index.js";
import routeApiRouter from "./routes/routingRoutes.js";
import routingRoutes from "./routes/routingRoutes.js";


dotenv.config()
const app = express();
const PORT = process.env.PORT || 3002;

// hardcoded whitelist to reduce port variables.
const whitelist = [
  'https://glowpathorg.github.io', // prod
  'http://localhost:5173', // dev
];
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming request origin:', origin);
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      callback(new Error(origin + ' is not included in CORS policy.'));
    }
  },
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};


//websockets content
const server = setupSocket(app); // This is needed to setup socket.io

// TODO: remove the following block when no longer needed for testing websockets
app.get("/", cors(corsOptions), (req, res) => {
  // todo might need to change /index.html to "/public"
  res.sendFile(__dirname + "/index.html");
});

(async () => {
  await DBConnect();  // For native MongoDB driver
  await mongooseConnect();  // For Mongoose ORM
})();
//server routes
app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRoutes);
app.use(shareRoutes);
app.use("/route", routingRoutes);

server.listen(PORT, () => {
  console.log(`GlowPath CORS-enabled server listening on port ${PORT}`);
});
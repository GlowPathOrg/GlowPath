import express from "express";
import { setupSocket } from "./socket/index.js";
import dotenv from "dotenv"; // to access .env
import cors, { CorsOptions } from "cors";
import notifyRoutes from "./routes/notifyRoutes";
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
  'http://localhost:4173', // pre prod
];
console.log('server whitelist: ', whitelist)
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log('Incoming request origin:', origin);

    app.use((req, res, next) => {
      res.on('finish', () => {
        console.log('Response headers:', res.getHeaders());
      });
      next();
    });
    if (!origin) {
      console.warn('No origin in request. Allowing by default.');
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      console.log('CORS Allowed for:', origin);
      return callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      return callback(new Error(origin + ' is not included in CORS policy.'));
    }
  },
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true, // 🔥 Important
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

//websockets content
app.use(express.json());
const server = setupSocket(app); // This is needed to setup socket.io

/* // TODO: remove the following block when no longer needed for testing websockets
app.get("/", cors(corsOptions), (req, res) => {

  res.sendFile(__dirname + "/index.html");
}); */
app.get("/", (req, res) => {
  res.send("GlowPath server is running.");
});
(async () => {
  await DBConnect();  // For native MongoDB driver
  await mongooseConnect();  // For Mongoose ORM
})();


app.use("/auth", authRoutes);
app.use(shareRoutes);
app.use('/route', routingRoutes);
app.use("/notify-contacts", notifyRoutes);
app.use("/route", routingRoutes);

server.listen(PORT, () => {
  console.log(`GlowPath CORS-enabled server listening on port ${PORT}`);
});
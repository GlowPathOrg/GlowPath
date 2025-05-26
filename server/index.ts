import express from "express";
import { setupSocket } from "./socket/index.js";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import notifyRoutes from "./routes/notifyRoutes";
import authRoutes from "./routes/authRoutes.js";
import shareRoutes from "./routes/shareRoutes.js";
import { mongooseConnect, DBConnect } from "./models/index.js";
import routingRoutes from "./routes/routingRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

// ===== PROCESS-LEVEL ERROR HANDLERS =====
process.on('uncaughtException', (err) => {
  console.error('[server: uncaughtException] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[server: unhandledRejection] Unhandled Rejection at:', promise, 'reason:', reason);
});

// ===== REQUEST LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
  console.log(`[server: requestLogger] Incoming request: ${req.method} ${req.originalUrl}`);
  console.log('[server: requestLogger] Headers:', req.headers);
  console.log('[server: requestLogger] Body:', req.body);

  res.on('finish', () => {
    console.log(`[server: responseLogger] Response status: ${res.statusCode}`);
    console.log('[server: responseLogger] Response headers:', res.getHeaders());
  });

  next();
});

// ===== CORS SETUP =====
const whitelist = [
  'https://glowpathorg.github.io', // prod
  'http://localhost:5173',         // dev
  'http://localhost:4173',         // pre prod
];
console.log('[server: setup] Server whitelist:', whitelist);

const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    console.log('[server: cors] Incoming request origin:', origin);

    if (!origin) {
      console.warn('[server: cors] No origin in request. Allowing by default.');
      return callback(null, true);
    }

    if (whitelist.includes(origin)) {
      console.log('[server: cors] CORS Allowed for:', origin);
      return callback(null, true);
    } else {
      console.error('[server: cors] Blocked by CORS:', origin);
      return callback(new Error(`${origin} is not included in CORS policy.`));
    }
  },
  methods: 'GET,POST,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ===== BODY PARSING =====
app.use(express.json());

// ===== DATABASE CONNECTION =====
(async () => {
  try {
    await DBConnect();
    console.log('[server: dbConnect] Successfully connected to MongoDB via MongoClient.');

    await mongooseConnect();
    console.log('[server: mongooseConnect] Successfully connected to MongoDB via Mongoose.');
  } catch (err) {
    console.error('[server: dbConnect] Error connecting to MongoDB:', err);
  }
})();

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("GlowPath server is running.");
});
app.use("/auth", authRoutes);
app.use(shareRoutes);
app.use('/route', routingRoutes);
app.use("/notify-contacts", notifyRoutes);
app.use("/route", routingRoutes);

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error('[server: errorHandler] Express error handler caught:', err.stack);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// ===== START SERVER =====
const server = setupSocket(app);
server.listen(PORT, () => {
  console.log(`[server: start] GlowPath server listening on port ${PORT}`);
});

export const setupSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173", // Local development
        "https://glowpathorg.github.io", // Live client
      ],
      methods: ["GET", "POST"], // Allow necessary HTTP methods
      credentials: true, // Allow cookies if needed
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err);
  });

  io.on("connection", (socket) => {
    console.log(`Connected to socket ${socket.id}`);

    if (socket.recovered) {
      console.log("Recovered session for socket:", socket.id);
    } else {
      console.log("New session for socket:", socket.id);
    }

    // Add other event handlers here
  });

  return server;
};

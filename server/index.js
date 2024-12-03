"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var socket_1 = require("./socket"); // This is needed to setup socket.io
var dotenv_1 = require("dotenv"); // to access .env
var cors_1 = require("cors");
var authRoutes_1 = require("./routes/authRoutes");
var shareRoutes_1 = require("./routes/shareRoutes");
var models_1 = require("./models");
var routingRoutes_1 = require("./routes/routingRoutes");
(0, dotenv_1.configDotenv)();
var app = (0, express_1.default)();
var SERVER_PORT = process.env.SERVER_PORT || 3002;
var CLIENT_PORT = process.env.CLIENT_PORT;
// connection to database
(0, models_1.default)();
// cors
var whitelist = ["https://glowpathorg.github.io", "http://localhost:".concat(CLIENT_PORT), "http://localhost:".concat(SERVER_PORT)]; // cors whitelist
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error(origin + ' is not included in CORS policy.' + CLIENT_PORT));
        }
    },
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
};
//websockets content
var server = (0, socket_1.setupSocket)(app); // This is needed to setup socket.io
// TODO: remove the following block when no longer needed for testing websockets
app.get("/", (0, cors_1.default)(corsOptions), function (req, res) {
    // todo might need to change /index.html to '/public'
    res.sendFile(__dirname + "/index.html");
});
//server routes
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
app.use(shareRoutes_1.default);
app.use('/route', routingRoutes_1.default);
server.listen(SERVER_PORT, function () {
    console.log("GlowPath CORS-enabled server listening on port ".concat(SERVER_PORT));
});

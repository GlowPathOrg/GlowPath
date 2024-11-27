"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_1 = require("./socket"); // This is needed to setup socket.io
const dotenv_1 = require("dotenv"); // to access .env
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const SERVER_PORT = process.env.SERVER_PORT || 3002;
// * FOR THE SERVER TO WORK, PLEASE ADD CLIENT_PORT WITH YOUR LOCAL CLIENT PORT TO YOUR server .ENV FILE, AND ADD SERVER PORT 3002 OR SO.
const CLIENT_PORT = process.env.CLIENT_PORT;
// cors
var whitelist = [`https://glowpathorg.github.io/`, `http://localhost/${CLIENT_PORT}`]; // cors whitelist
var corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('You seem to not be included in the CORS policy.'));
        }
    }
};
//websockets content
const server = (0, socket_1.setupSocket)(app); // This is needed to setup socket.io
app.get("/", (0, cors_1.default)(corsOptions), (req, res) => {
    // todo might need to change /index.html to '/public'
    res.sendFile(__dirname + "/index.html");
});
//server routes
app.use(express_1.default.json());
app.use('/auth', authRoutes_1.default);
server.listen(SERVER_PORT, () => {
    console.log(`Server listening on port ${SERVER_PORT}`);
});

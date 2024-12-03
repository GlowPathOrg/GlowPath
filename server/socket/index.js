"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
var socket_io_1 = require("socket.io");
var node_http_1 = require("node:http");
var Share_1 = require("../models/Share");
var jsonwebtoken_1 = require("jsonwebtoken");
var User_1 = require("../models/User");
var dotenv_1 = require("dotenv");
var bcrypt_1 = require("bcrypt");
dotenv_1.default.config();
var setupSocket = function (app) {
    var server = (0, node_http_1.createServer)(app);
    var io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    });
    /*  io.use((socket, next) => {
       console.log("Logging socket: ", socket);
       next();
     });
    */
    /* io.engine.on("connection_error", (err) => {
      console.log(err.req);      // the request object
      console.log(err.code);     // the error code, for example 1
      console.log(err.message);  // the error message, for example "Session ID unknown"
      console.log(err.context);  // some additional error context
    }); */
    io.on("connection", function (socket) {
        console.log("Connected to " + socket.id);
        socket.on("host-share", function (id) { return __awaiter(void 0, void 0, void 0, function () {
            var sanitizedId, token, JWT_SECRET, decoded, userId, user, share;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id)
                            return [2 /*return*/, console.log("no id")];
                        sanitizedId = id.replace(/[$/(){}]/g, "");
                        token = socket.handshake.auth.token;
                        if (!token)
                            return [2 /*return*/, console.log("no token")];
                        JWT_SECRET = process.env.JWT_SECRET;
                        if (!JWT_SECRET)
                            return [2 /*return*/, console.log("no jwt secret")];
                        decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                        userId = decoded.id;
                        return [4 /*yield*/, User_1.default.findOne({ _id: userId })];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            return [2 /*return*/, console.log("no user")];
                        return [4 /*yield*/, Share_1.default.findOne({ _id: sanitizedId, owner: user })];
                    case 2:
                        share = _a.sent();
                        if (!share)
                            return [2 /*return*/, console.log("no share")];
                        socket.join(id);
                        console.log(socket.id + " joined room " + id);
                        return [2 /*return*/];
                }
            });
        }); });
        socket.on("join-share", function (id, cb) { return __awaiter(void 0, void 0, void 0, function () {
            var sanitizedId, password, share, matchingPasswords;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id)
                            return [2 /*return*/, console.log("no id")];
                        sanitizedId = id.replace(/[$/(){}]/g, "");
                        password = socket.handshake.auth.password;
                        if (!password)
                            return [2 /*return*/, console.log("no password")];
                        return [4 /*yield*/, Share_1.default.findOne({ _id: sanitizedId })];
                    case 1:
                        share = _a.sent();
                        if (!share)
                            return [2 /*return*/, console.log("no share")];
                        return [4 /*yield*/, bcrypt_1.default.compare(password, share.password)];
                    case 2:
                        matchingPasswords = _a.sent();
                        if (!matchingPasswords)
                            return [2 /*return*/, console.log("wrong password")];
                        socket.join(id);
                        console.log(socket.id + " joined room " + id);
                        // TODO: send some kind of error to client when this fails https://socket.io/docs/v4/listening-to-events/
                        cb("This event was received and processed");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    return server;
};
exports.setupSocket = setupSocket;

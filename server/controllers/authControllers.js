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
exports.loginController = exports.editController = exports.registerController = void 0;
var dotenv_1 = require("dotenv");
var jsonwebtoken_1 = require("jsonwebtoken");
var bcrypt_1 = require("bcrypt");
var User_1 = require("../models/User");
var crypto_1 = require("crypto");
dotenv_1.default.config();
var jwtSecret = process.env.JWT_SECRET || crypto_1.default.randomBytes(64).toString('hex');
var registerController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, firstName, lastName, telephone, existingUser, user, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, telephone = _a.telephone;
                if (!email || !password || !firstName || !lastName) {
                    throw new Error("Name, email, password are all required");
                }
                if (password.length < 8 /* || !/[A-Z]/.test(password) || !/[0-9]/.test(password) */) {
                    throw new Error("Password doesn't meet strength requirements");
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                if (existingUser) {
                    res.status(400);
                    throw new Error('User already exists');
                    ;
                }
                ;
                user = new User_1.default({ email: email, password: password, firstName: firstName, lastName: lastName, telephone: telephone });
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                token = jsonwebtoken_1.default.sign({
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    telephone: user.telephone,
                    password: '*****',
                    messages: [],
                    places: [],
                    contacts: [],
                    tripHistory: []
                }, jwtSecret, { expiresIn: '48h' });
                console.log("user ".concat(user.firstName, " ").concat(user.lastName, " registered"));
                res.status(201).json({
                    message: "".concat(user.email, " was successfully registered"),
                    token: token
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({ error: "Server error in register controller:" + error_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.registerController = registerController;
var editController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var toEdit, fieldToUpdate, filter, potentialUser, isMatch, update, updated, token, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                toEdit = req.body;
                console.log('to edit: ', toEdit);
                fieldToUpdate = Object.keys(toEdit).find(function (key) { return key !== 'password' && key !== '_id'; });
                if (!fieldToUpdate) {
                    res.status(400);
                    throw new Error('could not read field to update');
                }
                filter = { _id: toEdit._id };
                return [4 /*yield*/, User_1.default.findOne(filter)];
            case 1:
                potentialUser = _b.sent();
                if (!potentialUser) {
                    res.status(400);
                    throw new Error('no user found');
                }
                return [4 /*yield*/, bcrypt_1.default.compare(toEdit.password, potentialUser.password)];
            case 2:
                isMatch = _b.sent();
                if (!isMatch) {
                    res.status(401);
                    throw new Error('passwords did not match. could not edit information');
                }
                update = (_a = {}, _a[fieldToUpdate] = toEdit[fieldToUpdate], _a);
                return [4 /*yield*/, User_1.default.findOneAndUpdate(filter, update)];
            case 3:
                updated = _b.sent();
                if (updated) {
                    token = jsonwebtoken_1.default.sign({ id: updated._id, email: updated.email, firstName: updated.firstName, lastName: updated.lastName, telephone: updated.telephone }, jwtSecret, { expiresIn: '1d' });
                    res.status(200).json({
                        token: token,
                        updated: {
                            _id: updated._id,
                            email: updated.email,
                            firstName: updated.firstName,
                            lastName: updated.lastName,
                            telephone: updated.telephone,
                            password: '*******',
                            messages: [],
                            places: [],
                            contacts: [],
                            tripHistory: []
                        }
                    });
                }
                else {
                    res.status(400);
                    throw new Error('User info not found');
                }
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                res.status(500).json({ error: "Server error in register controller:" + error_2 });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.editController = editController;
var loginController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isMatch, token, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    res.status(400);
                    throw new Error('Missing email or password');
                }
                return [4 /*yield*/, User_1.default.findOne({ email: email })];
            case 1:
                user = _b.sent();
                if (!user) {
                    res.status(401);
                    throw new Error('No user found');
                }
                if (!!process.env.JWT_SECRET) return [3 /*break*/, 2];
                console.log("No JWT Secret Found!");
                res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
                ;
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
            case 3:
                isMatch = _b.sent();
                if (!isMatch) {
                    res.status(401).json({ error: 'Invalid credentials' });
                }
                token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, telephone: user.telephone }, jwtSecret, { expiresIn: '1d' });
                res.status(200).json({
                    token: token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        telephone: user.telephone,
                        password: '*******',
                        messages: [],
                        places: [],
                        contacts: [],
                        tripHistory: []
                    }
                });
                _b.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                error_3 = _b.sent();
                console.error('Error during login:', error_3);
                res.status(500).json({ error: 'Server error' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.loginController = loginController;

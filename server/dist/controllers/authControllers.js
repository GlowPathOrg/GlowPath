"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.registerController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtSecret = 'lsdkfjalsdkfj;a';
const users = [];
const registerController = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            throw new Error(`Email, password and role are all required`);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = { email, password: hashedPassword, role };
        console.log(user);
        // todo add logic to save to model
        // await user.save();
        users.push(user);
        console.log('User array updated: ', user);
        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ error: `Server error in register controller: body is ${req.body}` + error });
    }
};
exports.registerController = registerController;
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        // todo add model logic to controler
        // const user = await User.findOne({ email });
        const user = users.find((element) => element.email === email);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log('JWT_SECRET in function:', process.env.JWT_SECRET);
        // Generate JWT token
        if (typeof process.env.JWT_SECRET === undefined) {
            console.log("No JWT Secret Found!");
            res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1d' });
        res.status(200).json({ token, role: user.role });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
exports.loginController = loginController;

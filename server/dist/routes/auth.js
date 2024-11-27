"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes = express_1.default.Router();
// todo add controller functions
// register controller
const jwtSecret = 'lsdkfjalsdkfj;a';
const users = [];
//
/* export const registerController = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            throw new Error(`Email, password and role are all required`)
        }
        const user: UserI = {email, password, role}
        // await user.save();
        users.push(user);
        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, email: user.email, role: user.role }
        });
    }
    catch (error) {

        res.status(500).json({ error: `Server error in register controller: ` + error })

    }
} */
authRoutes.post('/register', async function registerController(req, res) {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            throw new Error(`Email, password and role are all required`);
        }
        const user = { email, password, role };
        console.log(user);
        // await user.save();
        users.push(user);
        console.log('current users are: ', users);
        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, email: user.email, role: user.role }
        });
    }
    catch (error) {
        res.status(500).json({ error: `Server error in register controller: body is ${req.body}` + error });
    }
});
// authRoutes.post('/login', login());
exports.default = authRoutes;

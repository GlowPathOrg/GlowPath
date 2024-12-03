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
exports.routeController = void 0;
var dotenv_1 = require("dotenv");
var axios_1 = require("axios");
dotenv_1.default.config();
// fetch a route from the HERE API
var routeController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, origin, destination, transportMode, _b, originLat, originLon, _c, destinationLat, destinationLon, url, apiKey, response, route, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!req.query) {
                    res.status(401).json({ message: 'no parameters sent' });
                    throw new Error('something wrong in request');
                }
                _a = req.query, origin = _a.origin, destination = _a.destination, transportMode = _a.transportMode;
                _b = origin.split(','), originLat = _b[0], originLon = _b[1];
                _c = destination.split(','), destinationLat = _c[0], destinationLon = _c[1];
                url = 'https://router.hereapi.com/v8/routes';
                apiKey = process.env.HERE_API_KEY;
                // Check if the API key is available (for debugging if needed)
                if (!apiKey) {
                    res.status(505);
                    console.error('API Key is undefined. Please check your environment configuration.');
                    throw new Error('API Key is missing');
                }
                _d.label = 1;
            case 1:
                _d.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get(url, {
                        params: {
                            apiKey: apiKey,
                            transportMode: transportMode,
                            origin: "".concat(originLat, ",").concat(originLon), // Origin location as a string
                            destination: "".concat(destinationLat, ",").concat(destinationLon), // Destination location as a string
                            return: 'polyline,summary,instructions,actions', // API response fields requested
                        },
                    })];
            case 2:
                response = _d.sent();
                // Check if the API response contains routes
                if (response.data.routes && response.data.routes.length > 0) {
                    route = response.data.routes[0].sections[0];
                    //console.log('Route:', route.summary);
                    // Return the polyline, summary, and instructions for the route
                    res.status(200).json({
                        polyline: route.polyline, // Encoded polyline for the route
                        summary: route.summary, // Summary details like duration and distance
                        instructions: route.instructions || [], // Turn-by-turn instructions
                    });
                }
                else {
                    res.status(400);
                    throw new Error('No route found in the API');
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _d.sent();
                res.status(403);
                throw new Error('Request failed. Ensure that your API key is valid and the parameters are correct.');
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.routeController = routeController;
//added Fri night:
// Fetch a rerouted path (same logic as fetchRoute, but named explicitly for clarity)
/* export const fetchReroute = async (
    currentPosition: [number, number], // Current position of the user
    destination: [number, number], // Destination coordinates
    transportMode: 'pedestrian' | 'publicTransport' | 'bicycle' // Transport mode for rerouting
) => {
    console.log('Rerouting from:', currentPosition, 'to:', destination, 'using mode:', transportMode);
    return await routeController(currentPosition, destination, transportMode);
}; */ 

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const dbConnect_1 = require("./lib/dbConnect");
const compilerRouter_1 = require("./routes/compilerRouter");
const userRouter_1 = require("./routes/userRouter");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const Code_1 = require("./models/Code");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173", process.env.CLIENT_URL],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
let loadCode = async (roomID) => {
    let existingCode;
    if (roomID === null) {
        existingCode = await Code_1.Code.findById("679115b5b0cb15c1c51e9c91");
    }
    else {
        existingCode = await Code_1.Code.findById(roomID);
    }
    return existingCode?.fullCode.javascript;
};
io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("join-room", async (roomID) => {
        socket.join(roomID);
        const initial_code = await loadCode(roomID);
        socket.emit("load-code", initial_code);
        socket.on("code-change", (code) => {
            socket.broadcast.to(roomID).emit("update-code", code);
        });
        socket.on("start-typing", ({ userID, userName }) => {
            socket.to(roomID).emit("user-typing", { userID, userName });
        });
        socket.on("stop-typing", ({ userID }) => {
            socket.to(roomID).emit("user-stopped-typing", { userID });
        });
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
}));
(0, dotenv_1.config)();
app.use("/compiler", compilerRouter_1.compilerRouter);
app.use("/user", userRouter_1.userRouter);
(0, dbConnect_1.dbConnect)();
server.listen(4000, () => {
    console.log("http://localhost:4000");
});

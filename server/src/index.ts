import express from "express";
import http from "http";
import cors from "cors";
import { config } from "dotenv";
import { dbConnect } from "./lib/dbConnect";
import { compilerRouter } from "./routes/compilerRouter";
import { userRouter } from "./routes/userRouter";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import job from "./cron/cron";
import { Code } from "./models/Code";

const app = express();
const server = http.createServer(app);
job.start();

const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.CLIENT_URL!],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let loadCode = async (roomID: string) => {
  let existingCode;
  if (roomID === null) {
    existingCode = await Code.findById("679115b5b0cb15c1c51e9c91");
  } else {
    existingCode = await Code.findById(roomID);
  }
  return existingCode?.fullCode.javascript;
};
io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("join-room", async (roomID) => {
    socket.join(roomID);
    const initial_code = await loadCode(roomID);
    socket.emit("load-code", initial_code);
    socket.on("code-change", (code: string) => {
      socket.broadcast.to(roomID).emit("update-code", code);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", process.env.CLIENT_URL!],
  })
);
config();

app.use("/compiler", compilerRouter);
app.use("/user", userRouter);

dbConnect();
server.listen(4000, () => {
  console.log("http://localhost:4000");
});

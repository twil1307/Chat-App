const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://172.24.80.1:3000"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data.roomPort);
    console.log(`User with ID: ${socket.id} joined ${data.roomPort}`);
    socket
      .to(data.roomPort)
      .emit("someone_joined", `${data.username} has joined`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.data.socketPort).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

app.use("/", (req, res, next) => res.send("hello"));

server.listen(3001, () => {
  console.log("SERVER IS RUNNING");
});

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const path = require("path");
const cors = require("cors");

app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    origin: 'https://code-connect-szdh.vercel.app/',
    methods: ['GET', 'POST'],
  },
});

app.get("/",(req,res)=>{
  res.send("Server is running")
})
const userSocketMap = {};


function getAllConnectedClients(id) {
  return Array.from(io.sockets.adapter.rooms.get(id) || []).map((socketId) => {
    return {
      socketId,
      user: userSocketMap[socketId],
    };
  });
}

io.on("connection", (socket) => {
  console.log("socket connected : ", socket.id);

  socket.on(ACTIONS.JOIN, ({ id, user }) => {
    userSocketMap[socket.id] = user;
    socket.join(id);
    const clients = getAllConnectedClients(id);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        user,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ id, code }) => {
    socket.in(id).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((id) => {
      socket.in(id).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        user: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
}
);

const PORT = process.env.PORT || 5000; // Use the provided port or default to 5000

// Listen on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


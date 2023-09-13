import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import userRouter from './routes/user.routes.js';
import propertyRouter from './routes/property.routes.js';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust the origin to match your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(
  cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.options('*', cors());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Yariga!',
  });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/properties', propertyRouter);

const users = {};

const socketToRoom = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on("join room", roomID => {
    if (users[roomID]) {
        const length = users[roomID].length;
        if (length === 2) {
            socket.emit("room full");
            return;
        }
        users[roomID].push(socket.id);
    } else {
        users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

    socket.emit("all users", usersInThisRoom);
});

socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
});

socket.on("returning signal", payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
});

socket.on('disconnect', () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
        room = room.filter(id => id !== socket.id);
        users[roomID] = room;
    }
});

  socket.on('joinChat', (chatId) => {
    // Join the chat room associated with the chatId
    socket.join(chatId);
  });

  socket.on('sendMessage', (message) => {
    // Handle receiving a new message and broadcast it to all clients in the chat room
    io.to(message.chatId).emit('newMessage', message);
  });

});

export { io };

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    server.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();








// import express from 'express';
// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import SimplePeer from 'simple-peer';
// import wrtc from 'wrtc'; // Import the wrtc library

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Adjust the origin to match your frontend URL
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// app.use(cors());
// app.use(express.json());

// const activeVideoChats = {};

// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('offer', ({ offer, room }) => {
//     console.log('Received offer:', offer);
//     // Create a new WebRTC peer using wrtc
//     const peer = new SimplePeer({ initiator: false, wrtc: wrtc });
    
//     // Store the peer in the active video chats
//     activeVideoChats[socket.id] = peer;

//     // Join the room associated with the video chat
//     socket.join(room);

//     // Listen for signals
//     socket.on('answer', (answer) => {
//       console.log('Received answer:', answer);
//       peer.signal(answer);
//     });

//     // Handle ICE candidates
//     socket.on('ice-candidate', (candidate) => {
//       console.log('Received ICE candidate:', candidate);
//       peer.signal(candidate);
//     });

//     // Forward the video and audio streams to the other user
//     peer.on('stream', (stream) => {
//       io.to(room).emit('user-connected', socket.id, stream);
//     });

//     // Handle peer disconnection
//     peer.on('close', () => {
//       io.to(room).emit('user-disconnected', socket.id);
//       delete activeVideoChats[socket.id];
//     });

//     // Send the offer to the other user
//     peer.signal(offer);
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     // Close any active video chats for this user
//     if (activeVideoChats[socket.id]) {
//       activeVideoChats[socket.id].destroy();
//       delete activeVideoChats[socket.id];
//     }
//   });
// });

// server.listen(8080, '0.0.0.0', () => {
//   console.log('Server started on port 8080');
// });


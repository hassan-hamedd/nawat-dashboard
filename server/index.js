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

io.on('connection', (socket) => {
  console.log('A user connected');

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

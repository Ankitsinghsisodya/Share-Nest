import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import http from 'http';
import { Server } from 'socket.io';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import chatRoutes from './routes/chat.routes.js';

import connectMongoDB from './db/connectMongoDB.js';

const __dirname = path.resolve();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

cloudinary.config({
  cloud_name: "AnkitSingh",
  api_key: "215539331846267",
  api_secret: "KF4lOcr9BeCUDRoSizC11yFmA3s",
});

const MONGO_URI = "mongodb+srv://AnkitSingh:ankit7667@cluster0.entty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const NODE_ENV = "production"

app.use(session({
  secret: "AnkitSingh" || 'defaultsecret', // Use a strong secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    secure: NODE_ENV === 'production', // Set to true if using https
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
}));

const PORT = 6000;

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/chats', chatRoutes);



// Inside the production check
if (NODE_ENV === 'production') {
    console.log('NODE_ENV is production');
    console.log('Serving static files from frontend/dist');
    const indexPath = path.resolve(__dirname, 'frontend', 'dist', 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('index.html found');
    } else {
      console.log('index.html not found');
    }
    app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
  
    app.get('*', (req, res) => {
      res.sendFile(indexPath);
    });
  } else {
    console.log('NODE_ENV is not production, current value:',NODE_ENV);
  }
  

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  connectMongoDB();
});

export default io;

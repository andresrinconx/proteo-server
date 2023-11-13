import express from 'express';
import 'dotenv/config';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import userRoutes from './src/routes/userRoutes';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());

// Firebase
initializeApp({
  credential: applicationDefault(),
  projectId: 'proteoapp',
});

// Routes
app.use('/api/user', userRoutes);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Working on port ${ port }`);
});

// Socket.io
const io = new Server(server, {
  pingTimeout: 60000,
});

io.on('connection', (socket) => {
  // Permissions
  socket.on('test', () => {
    console.log('test');
  });
});
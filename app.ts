import express from 'express';
import 'dotenv/config';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { Server } from 'socket.io';
import { user, permission, birthdays, payroll } from './src/routes';

const app = express();
app.use(express.json());

// Firebase
initializeApp({
  credential: applicationDefault(),
  projectId: 'proteo-erp',
});

// Routes
app.use('/api/user', user);
app.use('/api/permission', permission);
app.use('/api/birthdays', birthdays);
app.use('/api/payroll', payroll);

// Server
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Working on port ${ port }`);
});

// Sockets
const io = new Server(server, {
  pingTimeout: 60000,
});

io.on('connection', (socket) => {
  socket.on('test', () => {
    console.log('test');
  });
});
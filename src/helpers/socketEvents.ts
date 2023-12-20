import { Server, Socket } from 'socket.io';
import { PermissionToBoss } from '../types/permissions';

export const initSocketEvents = (io: Server) => {
  io.on('connection', (socket: Socket) => {

    socket.on('new permission', (permissionToBoss: PermissionToBoss) => {
      io.emit('permission to boss', permissionToBoss);
    });

    socket.on('response permission', (data: { id: string, status: string }) => {
      io.emit('permission to user', data);
    });

  });
};
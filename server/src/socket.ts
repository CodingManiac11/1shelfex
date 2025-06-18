import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/user.model';

interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

interface AuthenticatedSocket extends Socket {
  user?: { id: string; email: string; role: string };
}

export const setupSocketHandlers = (io: Server) => {
  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
      const user: any = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = { id: user._id.toString(), email: user.email, role: user.role };
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('User connected:', socket.user?.email);

    // Join user's personal room for notifications
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user?.email);
    });
  });
};

// Helper function to send notifications to a specific user
export const sendNotification = (io: Server, userId: string, notification: any) => {
  io.to(`user:${userId}`).emit('notification', notification);
}; 
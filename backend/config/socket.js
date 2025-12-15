const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware for WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        console.log("Socket auth failed")
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).populate('role');
      if (!user) {
        console.log("NO user for socket")
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      console.log("Socket failed")
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.fullName} (${socket.user._id})`);



    // Join user to their personal room
    socket.join(`user_${socket.user._id}`);
   
    // Join user to role-based room
    if (socket.user.role) {
      socket.join(`role_${socket.user.role.name}`);
    }

    // Handle joining incident room
    socket.on('join_incident', (incidentId) => {
      socket.join(`incident_${incidentId}`);
      console.log(`${socket.user.fullName} joined incident room: ${incidentId}`);
    });

    // Handle leaving incident room
    socket.on('leave_incident', (incidentId) => {
      socket.leave(`incident_${incidentId}`);
      console.log(`${socket.user.fullName} left incident room: ${incidentId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.fullName}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = { initializeSocket, getIO };
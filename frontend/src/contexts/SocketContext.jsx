import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();

  // 🔒 Single socket instance
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  /* =====================================================
     SOCKET LIFECYCLE
     ===================================================== */
  useEffect(() => {
    // ❌ No token → disconnect socket
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // 🔒 Prevent duplicate socket
    if (socketRef.current) return;

    console.log('🔌 Initializing socket connection...');

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    /* ---------------- Connection events ---------------- */
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);

      // ✅ JOIN ROOM (RẤT QUAN TRỌNG)
      socket.emit('join', {
        userId: user?._id || user?.id,
        role: user?.role,
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setIsConnected(false);
    });

    /* ---------------- Business events ---------------- */
    socket.on('new_incident', handleNotification);
    socket.on('incident_assigned', handleNotification);
    socket.on('incident_updated', handleNotification);

    socketRef.current = socket;

    // 🧹 Cleanup
    return () => {
      console.log('🔌 Cleaning up socket...');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, user?.id]);

  
  const handleNotification = (data) => {
    setNotifications((prev) => {
      // 🔒 Prevent duplicate notification
      if (
        data?._id &&
        prev.some((n) => n._id === data._id)
      ) {
        return prev;
      }

      return [
        {
          ...data,
          _id: data?._id || Date.now(), // fallback
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, read: true } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(
    (n) => !n.read
  ).length;

  /* =====================================================
     CONTEXT VALUE
     ===================================================== */
  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

/* =====================================================
   HOOK
   ===================================================== */
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      'useSocketContext must be used within a SocketProvider'
    );
  }
  return context;
};

export default SocketContext;

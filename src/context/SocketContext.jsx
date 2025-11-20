// File: src/context/SocketProvider.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SocketContext } from './SocketContextFile';
import {
  initSocket,
  disconnectSocket,
  joinCustomerRoom,
  isSocketConnected,
} from '../Service/SocketService';

const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // 1️⃣ Init socket chỉ 1 lần khi component mount
  useEffect(() => {
    const s = initSocket();
    if (!s) return;
    setSocket(s);

    const handleConnect = () => {
      setIsConnected(true);
      console.log('✅ Socket connected:', s.id);

      // Nếu user đã login, join room
      if (user?.id) {
        joinCustomerRoom(user.id);
        console.log('👤 Joined customer room:', user.id);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
    };

    // Lắng nghe event connect/disconnect
    s.on('connect', handleConnect);
    s.on('disconnect', handleDisconnect);

    // Cleanup khi unmount
    return () => {
      s.off('connect', handleConnect);
      s.off('disconnect', handleDisconnect);
      disconnectSocket();
    };
  }, [user?.id]);

  // 2️⃣ Khi user login hoặc logout thay đổi
  useEffect(() => {
    if (!socket) return;

    if (user?.id) {
      // Nếu socket đã connect, join room ngay
      if (socket.connected) {
        joinCustomerRoom(user.id);
        console.log('👤 Joined customer room after login:', user.id);
      } else {
        // Nếu chưa connect, sẽ join trong handleConnect
        console.log('⏳ Socket chưa connect, sẽ join room khi connect');
      }
    } else {
      // User logout => rời room
      if (isSocketConnected()) {
        console.log('👋 User logged out, disconnect socket');
        disconnectSocket();
        setIsConnected(false);
      }
    }
  }, [user?.id, socket]);

  return (
    <SocketContext.Provider value={{ isConnected, user, socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

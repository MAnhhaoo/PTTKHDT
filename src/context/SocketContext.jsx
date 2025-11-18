import React, { useEffect, useState } from 'react';
import { 
  initSocket, 
  disconnectSocket,
  joinCustomerRoom,
  isSocketConnected,
} from '../Service/SocketService';
import { useSelector } from 'react-redux';
import { SocketContext } from './SocketContextFile';

// 🔌 Socket Provider Component
const SocketProvider = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // ✅ Khởi tạo Socket khi component mount
    console.log('🔌 Initializing Socket...');
    const socket = initSocket();
    
    if (!socket) return;

    const handleConnect = () => {
      setIsConnected(true);
      console.log('✅ Socket đã kết nối, socket.id:', socket.id);
      
      // Nếu là khách hàng, join room với userId
      if (user?.id) {
        console.log('👤 Joining customer room with userId:', user.id);
        joinCustomerRoom(user.id);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('❌ Socket đã ngắt');
    };

    // Nếu socket đã kết nối sẵn rồi
    if (socket.connected) {
      handleConnect();
    } else {
      // Đảm bảo listeners được thêm
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
    }

    // ✅ Cleanup khi component unmount
    return () => {
      if (socket) {
        socket.removeListener('connect', handleConnect);
        socket.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [user?.id]);

  // Cleanup khi user logout
  useEffect(() => {
    if (!user?.id && isSocketConnected()) {
      console.log('👋 User logged out, disconnecting socket...');
      disconnectSocket();
      setIsConnected(false);
    }
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ isConnected, user }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

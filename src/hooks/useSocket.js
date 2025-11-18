import { useContext } from 'react';
import { SocketContext } from '../context/SocketContextFile';

// 🎣 Hook để sử dụng Socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return { isConnected: false, user: null };
  }
  return context;
};

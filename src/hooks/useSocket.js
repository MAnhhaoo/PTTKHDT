import { useContext } from 'react';
import { SocketContext } from '../context/SocketContextFile';
import { getSocket } from '../Service/SocketService';

// 🎣 Hook để sử dụng Socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  const socket = getSocket();
  
  if (!context) {
    return { isConnected: false, user: null, socket };
  }
  return { ...context, socket };
};

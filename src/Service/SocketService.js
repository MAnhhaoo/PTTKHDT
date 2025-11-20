// File: src/Service/SocketService.js

import io from 'socket.io-client';

let socket = null;
const EVENT_CUSTOMER_NOTIFY = 'customerNotify';

// 🔌 Init socket (Sử dụng Singleton pattern)
export const initSocket = (serverUrl = import.meta.env.VITE_API_URL_BACKEND) => {
 if (socket && socket.connected) {
        return socket; // Trả về instance đã có
    }
 if (!socket) {
  console.log(`🔌 Connecting to Socket.io: ${serverUrl}`);

  socket = io(serverUrl, {
   transports: ['websocket', 'polling'],
   reconnection: true,
   reconnectionDelay: 1000,
   reconnectionDelayMax: 5000,
   reconnectionAttempts: 5,
  });
    // Không đăng ký connect/disconnect ở đây, để SocketProvider quản lý
 }

 return socket;
};

// 📨 Lắng nghe event customerNotify (ĐÃ SỬA: TRẢ VỀ HÀM CLEANUP)
export const onCustomerNotify = (callback) => {
 if (socket) {
  const listener = data => {
   console.log('📨 Customer received notification:', data);
   if (typeof callback === 'function') callback(data);
  };
    
  socket.on(EVENT_CUSTOMER_NOTIFY, listener);
    
    // Trả về hàm cleanup
  return () => {
   socket.off(EVENT_CUSTOMER_NOTIFY, listener);
  };
 }
    // Nếu socket chưa có, trả về hàm rỗng
    return () => {}; 
};

// 🔑 Join room customer
export const joinCustomerRoom = (roomName) => {
 if (socket && socket.connected) {
  socket.emit('join_customer_room', roomName);
  console.log('✅ Joined room:', roomName);
 } else {
  console.warn('⚠️ Socket not ready, cannot join room yet.');
 }
};

// 🚪 Leave room
export const leaveCustomerRoom = (roomName) => {
 if (socket && socket.connected) {
  socket.emit('leave_customer_room', roomName);
  console.log('✅ Left room:', roomName);
 }
};

// ❌ Disconnect socket
export const disconnectSocket = () => {
 if (socket) {
  socket.disconnect();
  socket = null; // Reset singleton instance
  console.log('✅ Socket fully disconnected and reset');
 }
};

// 📊 Check connection
export const isSocketConnected = () => socket && socket.connected;

// 📊 Get socket instance
export const getSocket = () => socket;
// File: src/Service/SocketService.js

import io from 'socket.io-client';

let socket = null;
// ⭐ ĐÃ SỬA: Đồng bộ tên sự kiện lắng nghe từ Server với Backend Service
const EVENT_CUSTOMER_NOTIFY = 'customerNotify'; 
const EVENT_ORDER_STATUS_UPDATED = 'order_status_updated'; // Giữ nguyên nếu Front-end có dùng

// 🔌 Kết nối tới Socket.io server
export const initSocket = (serverUrl = import.meta.env.VITE_API_URL_BACKEND) => {
 if (!socket) {
  console.log(`🔌 Đang kết nối tới Socket.io: ${serverUrl}`);
  
  socket = io(serverUrl, {
   reconnection: true,
   reconnectionDelay: 1000,
   reconnectionDelayMax: 5000,
   reconnectionAttempts: 5,
   transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
   console.log('✅ Socket kết nối thành công:', socket.id);
  });

  socket.on('disconnect', () => {
   console.log('❌ Socket đã ngắt kết nối');
  });

  socket.on('connect_error', (error) => {
   console.error('❌ Socket lỗi kết nối:', error);
  });

  // ⭐ ĐÃ SỬA: Lắng nghe sự kiện thông báo chính xác từ Server
  socket.on(EVENT_CUSTOMER_NOTIFY, (data) => {
   console.log('📨 Nhận thông báo cập nhật đơn hàng từ server:', data);
  });
 }

 return socket;
};

// 📤 Phát sự kiện cập nhật trạng thái đơn hàng (Nếu Admin Frontend cần dùng)
export const emitOrderStatusUpdate = (orderId, status, userId) => {
 if (socket && socket.connected) {
  socket.emit(EVENT_ORDER_STATUS_UPDATED, {
   orderId,
   status,
   userId,
   timestamp: new Date(),
  });
  console.log(`📤 Phát sự kiện cập nhật đơn hàng:`, { orderId, status });
 } else {
  console.warn('⚠️ Socket chưa kết nối, không thể phát sự kiện');
 }
};

// 📨 Lắng nghe cập nhật trạng thái đơn hàng (Nếu Admin Frontend cần dùng)
export const onOrderStatusUpdate = (callback) => {
 if (socket) {
  socket.off(EVENT_ORDER_STATUS_UPDATED); // Cleanup
  socket.on(EVENT_ORDER_STATUS_UPDATED, (data) => {
   console.log('📨 Nhận sự kiện cập nhật đơn hàng:', data);
   callback(data);
  });
 }
};

// 🔑 Join một room cho khách hàng (theo userId)
export const joinCustomerRoom = (userId) => {
 if (socket && socket.connected) {
  // ⭐ ĐÃ SỬA: Truyền trực tiếp userId (String)
  socket.emit('join_customer_room', userId); 
  console.log(`✅ Tham gia room khách hàng: customer_${userId}`);
 } else {
  console.warn('⚠️ Socket chưa sẵn sàng, sẽ join room lại khi kết nối');
 }
};

// 🚪 Rời khỏi room
export const leaveCustomerRoom = (userId) => {
 if (socket && socket.connected) {
  // ⭐ ĐÃ SỬA: Truyền trực tiếp userId (String)
  socket.emit('leave_customer_room', userId); 
  console.log(`✅ Rời khỏi room khách hàng: customer_${userId}`);
 }
};

// 📨 Lắng nghe thông báo từ admin (cho Khách hàng)
export const onCustomerNotify = (callback) => {
 if (socket) {
  // Xóa listener cũ và thêm listener mới cho sự kiện 'customerNotify'
  socket.off(EVENT_CUSTOMER_NOTIFY); 
  socket.on(EVENT_CUSTOMER_NOTIFY, (data) => {
   console.log('📨 Khách hàng nhận được thông báo từ server:', data);
   if (typeof callback === 'function') {
    callback(data);
   }
  });
 }
};

// ❌ Ngắt kết nối
export const disconnectSocket = () => {
 if (socket) {
  socket.disconnect();
  socket = null;
  console.log('✅ Đã ngắt kết nối Socket');
 }
};

// 📊 Lấy socket instance
export const getSocket = () => socket;

// 📊 Kiểm tra xem socket có kết nối không
export const isSocketConnected = () => socket && socket.connected;

// ⭐ ĐÃ XÓA HÀM `emitToCustomer` vì Backend Service đã xử lý gửi thông báo sau khi update API REST
// Nếu bạn muốn Admin Frontend gửi trực tiếp thì cần điều chỉnh lại Backend để lắng nghe sự kiện này
# 🔌 Socket.io Real-Time Order Update - Hướng Dẫn Cấu Hình Backend

## 📋 Tổng Quan
Ứng dụng frontend đã được cấu hình để sử dụng Socket.io nhằm cập nhật trạng thái đơn hàng real-time. Khi admin cập nhật trạng thái đơn hàng, khách hàng sẽ nhận được thông báo ngay lập tức mà không cần refresh trang.

## 🛠️ Cài Đặt Backend (Node.js/Express)

### 1. Cài đặt thư viện Socket.io
```bash
npm install socket.io cors
```

### 2. Cấu Hình Server (trong file server.js hoặc app.js)

```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173", // URL của frontend
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// 🌍 Lưu io vào app để sử dụng trong routes
app.set('io', io);

// 🔌 Socket.io Event Handlers
const userRooms = new Map(); // Lưu userId -> socketId

io.on('connection', (socket) => {
  console.log(`✅ Người dùng kết nối: ${socket.id}`);

  // 📌 Tham gia room theo userId
  socket.on('join_customer_room', (data) => {
    const { userId } = data;
    socket.join(`customer_${userId}`);
    userRooms.set(userId, socket.id);
    console.log(`✅ Người dùng ${userId} tham gia room customer_${userId}`);
  });

  // 🚪 Rời khỏi room
  socket.on('leave_customer_room', (data) => {
    const { userId } = data;
    socket.leave(`customer_${userId}`);
    userRooms.delete(userId);
    console.log(`👋 Người dùng ${userId} rời khỏi room`);
  });

  // 📨 Lắng nghe cập nhật đơn hàng từ admin
  socket.on('notify_customer', (data) => {
    const { userId, orderId, status } = data;
    console.log(`📤 Gửi sự kiện cập nhật đơn hàng #${orderId} đến khách hàng ${userId}`);
    // Phát sự kiện đến room của khách hàng
    io.to(`customer_${userId}`).emit('notify_customer', {
      orderId,
      status,
      userId,
      timestamp: new Date()
    });
  });

  // ❌ Ngắt kết nối
  socket.on('disconnect', () => {
    console.log(`❌ Người dùng ngắt kết nối: ${socket.id}`);
  });
});

// Khởi động server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});

module.exports = { app, server, io };
```

### 3. Cấu Hình Route Cập Nhật Đơn Hàng

Trong route xử lý cập nhật đơn hàng (ví dụ: `routes/order.js`):

```javascript
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Route cập nhật trạng thái đơn hàng
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Cập nhật đơn hàng trong database
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
    }

    // 🔔 Phát sự kiện Socket.io đến khách hàng
    const io = req.app.get('io');
    io.to(`customer_${order.userId}`).emit('notify_customer', {
      orderId: order._id,
      status: order.status,
      userId: order.userId,
      timestamp: new Date()
    });

    console.log(`✅ Cập nhật trạng thái đơn hàng #${id} → ${status}`);
    console.log(`📤 Gửi thông báo đến khách hàng ${order.userId}`);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: order
    });
  } catch (error) {
    console.error('❌ Lỗi cập nhật đơn hàng:', error);
    res.status(500).json({ message: 'Lỗi cập nhật đơn hàng' });
  }
});

module.exports = router;
```

## 🎯 Quy Trình Hoạt Động

### Từ Frontend (Khách hàng):
1. Khi component mount → `joinCustomerRoom(userId)` 
2. Lắng nghe event `notify_customer`
3. Khi nhận được → cập nhật state trạng thái đơn hàng

### Từ Frontend (Admin):
1. Admin cập nhật trạng thái đơn hàng
2. Frontend emit `emitToCustomer(userId, orderId, status)`
3. Socket.io server gửi sự kiện đến khách hàng

### Từ Backend:
1. API nhận request cập nhật đơn hàng
2. Cập nhật database
3. Phát sự kiện `notify_customer` đến room của khách hàng
4. Khách hàng nhận sự kiện và cập nhật UI

## 🧪 Test Real-Time Update

1. **Mở 2 tab trình duyệt:**
   - Tab 1: Đăng nhập khách hàng, vào trang lịch sử đơn hàng
   - Tab 2: Đăng nhập admin, vào order management

2. **Cập nhật trạng thái đơn hàng ở Tab 2**

3. **Kiểm tra Tab 1 - Trạng thái phải cập nhật tự động mà không cần refresh**

## ⚠️ Troubleshooting

### Nếu không nhận được thông báo:

1. **Kiểm tra Server Console:**
   ```
   ✅ Người dùng kết nối: socket-id-123
   ✅ Người dùng 64abc123... tham gia room customer_64abc123...
   📤 Gửi sự kiện cập nhật đơn hàng #... đến khách hàng ...
   ```

2. **Kiểm tra Browser Console (F12):**
   - Tìm logs từ SocketService.js
   - Xem có message `📨 Nhận sự kiện cập nhật đơn hàng` không

3. **Kiểm tra Network (DevTools):**
   - Chọn tab `WS` (WebSocket)
   - Phải có kết nối `socket.io` 
   - Xem messages được gửi/nhận

### Kiểm tra cors:
Đảm bảo `origin` trong Socket.io matches với URL frontend của bạn

```javascript
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Middleware để lấy io
const setupSocketIO = (io) => {
  // Route cập nhật trạng thái đơn hàng
  router.put('/orders/:id/status', async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Cập nhật database
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Đơn hàng không tìm thấy' });
      }

      // 📤 Phát sự kiện Socket cho khách hàng
      io.to(`customer_${updatedOrder.userId}`).emit('notify_customer', {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        userId: updatedOrder.userId,
        timestamp: new Date()
      });

      res.json({
        message: 'Cập nhật trạng thái thành công',
        data: updatedOrder
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  return router;
};

module.exports = setupSocketIO;
```

Trong file server chính:
```javascript
const orderRoutes = require('./routes/order');
const setupOrderRoutes = orderRoutes(io);
app.use('/api/orders', setupOrderRoutes);
```

## 🔌 Cấu Hình Frontend (Đã Hoàn Tất)

### 1. Socket Service (`src/Service/SocketService.js`)
- Khởi tạo kết nối Socket.io
- Emit sự kiện cập nhật đơn hàng
- Lắng nghe thông báo từ server

### 2. Socket Context (`src/context/SocketContext.jsx`)
- Cung cấp `SocketProvider` wrapper
- Quản lý kết nối Socket và room
- Tự động join room theo userId

### 3. useSocket Hook (`src/hooks/useSocket.js`)
- Hook để sử dụng Socket context trong component

### 4. OrderDetail Component (Đã Cập Nhật)
- Lắng nghe cập nhật trạng thái đơn hàng real-time
- Hiển thị trạng thái cập nhật ngay lập tức

### 5. OrderManagement Component (Admin)
- Phát sự kiện khi cập nhật trạng thái
- Thông báo cho khách hàng thông qua Socket

## 📱 Cách Sử Dụng

### Trong Một Component
```javascript
import { useSocket } from '../hooks/useSocket';
import { onCustomerNotify } from '../Service/SocketService';

function MyComponent() {
  const { isConnected } = useSocket();

  useEffect(() => {
    // Lắng nghe thông báo
    onCustomerNotify((data) => {
      console.log('Cập nhật đơn hàng:', data);
      // Xử lý cập nhật UI
    });
  }, []);

  return (
    <div>
      {isConnected ? '🟢 Kết nối' : '🔴 Mất kết nối'}
    </div>
  );
}
```

## 🧪 Kiểm Tra Kết Nối

1. Mở Console (F12)
2. Kiểm tra các log:
   - `✅ Socket đã kết nối`
   - `✅ Tham gia room khách hàng: [userId]`
3. Admin cập nhật trạng thái đơn hàng
4. Khách hàng sẽ thấy trạng thái cập nhật ngay lập tức

## 🔧 Biến Môi Trường (.env)

```
VITE_API_URL_BACKEND=http://localhost:3002
```

## 🚨 Xử Lý Sự Cố

### Không nhận được thông báo?
1. Kiểm tra xem Socket đã kết nối (`isConnected`)
2. Kiểm tra userId trong Redux store
3. Xem console backend để kiểm tra sự kiện

### CORS Error?
- Đảm bảo origin trong `io.cors` khớp với URL frontend

### Kết nối bị ngắt?
- Socket.io sẽ tự động kết nối lại (reconnection: true)
- Kiểm tra connection string

## 📊 Sơ đồ Hoạt Động

```
Admin (OrderManagement)
    ↓
Cập nhật trạng thái đơn hàng
    ↓
Backend nhận request
    ↓
Backend phát sự kiện Socket: `notify_customer`
    ↓
Khách hàng nhận thông báo real-time
    ↓
OrderDetail component cập nhật UI
```

---

**Lưu ý**: Đảm bảo backend đã cấu hình CORS đúng và Socket.io server đang chạy trên port được chỉ định.

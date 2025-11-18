# 🐛 Debug Socket.io Real-Time Update

## 📋 Checklist Kiểm Tra

### 1. ✅ Frontend Đã Setup Đúng

- [ ] `SocketProvider` được wrap trong `main.jsx`
- [ ] `useSocket` hook trả về đúng context
- [ ] `OrderDetail.jsx` đang lắng nghe `onCustomerNotify`
- [ ] `OrderManagement.jsx` đang emit `emitToCustomer`

**Kiểm tra:**
```javascript
// Trong browser console, bạn sẽ thấy:
// ✅ Socket kết nối thành công: socket-id-xxx
// ✅ Tham gia room khách hàng: customer_user-id-xxx
```

### 2. ✅ Backend Đã Setup Đúng

**Kiểm tra các điều sau:**

a) **Server khởi động với Socket.io:**
```bash
npm install socket.io cors
```

b) **Server.js / app.js có Socket.io:**
```javascript
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST"]
  }
});
```

c) **Route cập nhật đơn hàng emit sự kiện:**
```javascript
// Trong route update order
const io = req.app.get('io');
io.to(`customer_${order.userId}`).emit('notify_customer', {...});
```

### 3. 🔍 Kiểm Tra Network

Mở **DevTools → Network → WS (WebSocket)**

Bạn sẽ thấy:
- Connection từ `socket.io/?EIO=...`
- Messages được gửi/nhận

### 4. 🧪 Test Real-Time Manual

**Phía Backend Console:**

```
✅ Người dùng kết nối: socket-abc123
✅ Người dùng 64abc123def456... tham gia room customer_64abc123def456
📤 Gửi sự kiện cập nhật đơn hàng #64xyz789... đến khách hàng 64abc123def456
```

**Phía Frontend Console (OrderHistory page):**

```
✅ Socket đã kết nối
✅ Tham gia room khách hàng: customer_64abc123def456
📨 Nhận sự kiện cập nhật đơn hàng: {orderId: "...", status: "...", ...}
✅ Cập nhật trạng thái đơn hàng: {id: "...", status: "..."}
```

## 🚀 Test Từng Bước

### Bước 1: Mở 2 tab Chrome
- **Tab 1:** http://localhost:5173/order (Khách hàng - đã đăng nhập)
- **Tab 2:** http://localhost:5173/admin (Admin - đã đăng nhập)

### Bước 2: Kiểm tra console Tab 1
```
F12 → Console → Xem logs từ SocketService
```

Phải thấy:
```
🔌 Đang kết nối tới Socket.io: http://localhost:3002
✅ Socket kết nối thành công: socket-xxx
✅ Tham gia room khách hàng: customer_user-id
```

### Bước 3: Admin cập nhật đơn hàng ở Tab 2

Nhấn nút update status → Chọn status mới → Nhấn Save

### Bước 4: Kiểm tra Tab 1

**Kỳ vọng:** 
- ✅ Trạng thái đơn hàng cập nhật ngay (không cần refresh)
- ✅ Console logs: `📨 Nhận sự kiện...`

## ⚠️ Nếu Không Hoạt Động

### Case 1: Socket không kết nối

**Symptoms:**
```
❌ Socket đã ngắt kết nối
❌ Socket lỗi kết nối: XHR error
```

**Fix:**
1. Kiểm tra Backend có chạy không (http://localhost:3002)
2. Kiểm tra `VITE_API_URL_BACKEND` trong `.env`
3. Kiểm tra CORS settings trong backend

### Case 2: Socket kết nối nhưng không nhận event

**Symptoms:**
```
✅ Socket kết nối thành công
✅ Tham gia room khách hàng
// Nhưng không thấy log 📨 Nhận sự kiện
```

**Fix:**
1. Kiểm tra Backend có emit đúng không:
   ```javascript
   io.to(`customer_${userId}`).emit('notify_customer', {...})
   ```
2. Kiểm tra userId có trùng không (admin gửi, khách hàng nhận)
3. Kiểm tra Event listener được setup đúng:
   ```javascript
   socket.on('notify_customer', (data) => {...})
   ```

### Case 3: Event được nhận nhưng UI không update

**Symptoms:**
```
📨 Nhận sự kiện cập nhật đơn hàng: {...}
// Nhưng trạng thái trên UI không thay đổi
```

**Fix:**
1. Kiểm tra callback trong `onCustomerNotify` được gọi đúng
2. Kiểm tra `setOrders` state được cập nhật:
   ```javascript
   setOrders((prevOrders) =>
     prevOrders.map((order) =>
       order._id === data.orderId 
         ? { ...order, status: data.status }
         : order
     )
   );
   ```
3. Kiểm tra `orderId` có trùng không (case-sensitive)

## 📲 Useful Commands

### Backend Logs
```bash
# Chạy server với logs verbose
NODE_DEBUG=* npm start
```

### Frontend Logs - Tất cả Socket events
```javascript
// Trong browser console
localStorage.debug = 'socket.io-client:*'
```

### Kiểm tra Socket kết nối
```javascript
// Trong browser console
import { getSocket } from './src/Service/SocketService.js'
const socket = getSocket()
console.log(socket) // Xem socket object
```

## 🎯 Kiểm Tra Cuối Cùng

```javascript
// Trong browser console của customer page
const socket = getSocket()
socket.emit('test_event', {message: 'test'}) // Phát event test
// Kiểm tra backend console có nhận được không
```

---

**Nếu vẫn không hoạt động, hãy gửi logs từ:**
- Browser Console (Customer page)
- Server Console (Backend)
- Network tab (WebSocket messages)

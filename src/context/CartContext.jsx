// File: src/context/CartContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useSelector((state) => state.user);
    const userId = user?._id || user?.id || 'guest';
    
    // Khởi tạo state giỏ hàng từ LocalStorage (lưu riêng cho mỗi user)
    const [cartItems, setCartItems] = useState(() => {
        try {
            const cartKey = `cart_${userId}`;
            const localData = localStorage.getItem(cartKey);
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("❌ Lỗi parse cart từ localStorage:", error);
            localStorage.removeItem(`cart_${userId}`);
            return [];
        }
    });

    // Đồng bộ state giỏ hàng với LocalStorage khi cartItems hoặc userId thay đổi
    useEffect(() => {
        const cartKey = `cart_${userId}`;
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }, [cartItems, userId]);

    // Khi user thay đổi (login/logout), tải giỏ hàng của user đó
    useEffect(() => {
        try {
            const cartKey = `cart_${userId}`;
            const localData = localStorage.getItem(cartKey);
            setCartItems(localData ? JSON.parse(localData) : []);
        } catch (error) {
            console.error("❌ Lỗi khi chuyển user:", error);
            setCartItems([]);
        }
    }, [userId]);
    
    // Thêm sản phẩm (Hàm gốc không thay đổi)
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const exists = prevItems.find(item => item._id === product._id);
            if (exists) {
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Cập nhật số lượng
    const updateQuantity = (_id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(_id);
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === _id ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };
    
    // Xóa sản phẩm
    const removeItem = (_id) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== _id));
    };

    // Xóa toàn bộ giỏ hàng
    const clearCart = () => {
        setCartItems([]);
    }

    // 🟢 HÀM MỚI: THÊM NHIỀU SẢN PHẨM CÙNG LÚC (Đã sửa đổi)
    const addMultipleItems = useCallback((newItems) => {
        setCartItems(prevItems => {
            let updatedItems = [...prevItems];

            newItems.forEach(newItem => {
                // newItem đã được chuẩn bị với cấu trúc: {_id, name, price, image, quantity}
                const productId = newItem._id; 
                const itemQty = newItem.quantity; 

                // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
                const existingItemIndex = updatedItems.findIndex(item => item._id === productId);

                if (existingItemIndex > -1) {
                    // Nếu đã có: Cập nhật tăng số lượng
                    updatedItems[existingItemIndex].quantity += itemQty;
                } else {
                    // Nếu chưa có: Thêm sản phẩm mới vào 
                    updatedItems.push(newItem);
                }
            });
            return updatedItems;
        });
    }, []); 

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart, addMultipleItems }}>
            {children}
        </CartContext.Provider>
    );
};
// File: src/context/CartContext.js

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CartContext = createContext();

// 🟢 EXPORT HOOK ĐỂ CÁC COMPONENT KHÁC GỌI
export const useCart = () => useContext(CartContext);

// 🟢 EXPORT PROVIDER
export const CartProvider = ({ children }) => {
    // Khởi tạo state giỏ hàng từ LocalStorage
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('cart');
        return localData ? JSON.parse(localData) : [];
    });

    // Đồng bộ state giỏ hàng với LocalStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);
    
    // Thêm sản phẩm
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

    // 🟢 HÀM MỚI: THÊM NHIỀU SẢN PHẨM CÙNG LÚC (Dành cho chức năng Mua lại)
    const addMultipleItems = useCallback((newItems) => {
        setCartItems(prevItems => {
            let updatedItems = [...prevItems];

            newItems.forEach(newItem => {
                // Đơn hàng cũ dùng 'product' làm ID và 'qty' làm số lượng
                const productId = newItem.product; 
                const itemQty = newItem.qty; 

                // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
                const existingItemIndex = updatedItems.findIndex(item => item._id === productId);

                if (existingItemIndex > -1) {
                    // Nếu đã có: Cập nhật tăng số lượng
                    updatedItems[existingItemIndex].quantity += itemQty;
                } else {
                    // Nếu chưa có: Thêm sản phẩm mới vào (với key _id là ID sản phẩm)
                    updatedItems.push({
                        _id: productId,
                        name: newItem.name,
                        price: newItem.price,
                        image: newItem.image, // Lưu đường dẫn ảnh từ đơn hàng cũ
                        quantity: itemQty,
                    });
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
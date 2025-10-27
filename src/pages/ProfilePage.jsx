import React, { useState, useEffect } from 'react'
import "./ProfilePage.css"
import * as UserService from "../Service/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../redux/userSlide'; // Đã sửa tên file slice cho đúng cú pháp (slide -> slice)

function ProfilePage() {
    const { user } = useSelector((state) => state.user);
    
    console.log("Dữ liệu User hiện tại:", user); 
    console.log("ID của User là:", user?.id); // Kiểm tra trường ID đúng là 'id'
    
    const [name , setName] = useState(user?.name || '')
    const [email , setEmail] = useState(user?.email || '')
    const [phone , setPhone] = useState(user?.phone || '')
    const [address , setAddress] = useState(user?.address || '')
    const dispatch = useDispatch();

    // 💡 Cập nhật state local khi user Redux thay đổi (để đồng bộ khi load/update)
    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
        }
    }, [user])
    
    // motation là để call API
    const mutation = useMutation({
        // Đã sửa để nhận ID và Data tách biệt
        mutationFn: ({ id, data }) => UserService.updateser(id, data),
        onSuccess: (data) => {
            // Server trả về user đã được cập nhật
            const updatedUser = data.data; 
            // 1. Cập nhật Redux state (Sẽ tự động trigger useEffect và cập nhật UI)
            dispatch(
                updateUser(updatedUser) // Truyền object user đã cập nhật
            );
            
           
            
            alert("Cập nhật thành công!");
        },
        onError: (error) => {
            console.error("Lỗi cập nhật:", error);
            alert("Lỗi cập nhật thông tin.");
        },
    })

    // Hàm chung để xử lý cập nhật cho TỪNG trường
    const handleUpdate = (field, value) => {
        const userId = user?.id; 

        if (!userId) { 
            alert("Không tìm thấy ID người dùng.");
            return;
        }

        const dataToUpdate = {
            [field]: value
        };

        mutation.mutate({
            id: userId,
            data: dataToUpdate
        });
    }

    return (
        <div>
            <div className='container'>
                <div>
                    <div className="user-info-box">
                        <h2 style={{fontSize: "25px"}}>Thông tin người dùng</h2>
                        <div className="content_user">
                            {/* Cập nhật Tên */}
                            <div className="user-field">
                                {/* 💡 Giữ nguyên: user?.name đã tự động cập nhật nhờ Redux và useEffect */}
                                <label>Tên {user?.name}</label> 
                                <div className="input-group">
                                    <input value={name} onChange={(e)=> setName(e.target.value)} type="text" placeholder="Nhập tên của bạn" />
                                    <button onClick={() => handleUpdate('name', name)}>Cập nhật</button>
                                </div>
                            </div>

                            {/* Cập nhật Email */}
                            <div className="user-field">
                                <label>Email {user?.email}</label>
                                <div className="input-group">
                                    <input value={email} onChange={(e)=> setEmail(e.target.value)} type="text" placeholder="Nhập email mới" />
                                    <button onClick={() => handleUpdate('email', email)}>Cập nhật</button>
                                </div>
                            </div>

                            {/* Cập nhật Số điện thoại */}
                            <div className="user-field">
                                <label>Số điện thoại {user?.phone}</label>
                                <div className="input-group">
                                    <input value={phone} onChange={(e)=> setPhone(e.target.value)} type="text" placeholder="Nhập số điện thoại" />
                                    <button onClick={() => handleUpdate('phone', phone)}>Cập nhật</button>
                                </div>
                            </div>

                            {/* Cập nhật Địa chỉ */}
                            <div className="user-field">
                                <label>Địa chỉ {user?.address}</label>
                                <div className="input-group">
                                    <input value={address} onChange={(e)=> setAddress(e.target.value)} type="text" placeholder="Nhập địa chỉ của bạn" />
                                    <button onClick={() => handleUpdate('address', address)}>Cập nhật</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
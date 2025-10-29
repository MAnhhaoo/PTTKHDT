import React, { useState } from 'react';
import "./ProfilePage.css";
import * as UserService from "../Service/UserService";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from '@tanstack/react-query';
import { updateUser } from '../redux/userSlide';

function ProfilePage() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Các input luôn bắt đầu trống
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const mutation = useMutation({
    mutationFn: ({ id, data }) => UserService.updateser(id, data),
    onSuccess: (data) => {
      const updatedUser = data.data;
      dispatch(updateUser(updatedUser));
      alert("Cập nhật thông tin thành công!");

      // ✅ Reset input về trống
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
    },
    onError: (error) => {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại!");
    },
  });

  const handleUpdateAll = () => {
    const userId = user?.id;
    if (!userId) return alert("Không tìm thấy ID người dùng.");

    const dataToUpdate = {};
    if (name.trim()) dataToUpdate.name = name.trim();
    if (email.trim()) dataToUpdate.email = email.trim();
    if (phone.trim()) dataToUpdate.phone = phone.trim();
    if (address.trim()) dataToUpdate.address = address.trim();

    if (Object.keys(dataToUpdate).length === 0)
      return alert("Vui lòng nhập ít nhất một thông tin cần cập nhật!");

    mutation.mutate({ id: userId, data: dataToUpdate });
  };

  return (
    
    <div className="profile-container">
      <div className="profile-box">
        <h2>Thông tin người dùng</h2>

        <div className="user-info-display">
          <p><strong>Tên:</strong> {user?.name || "Chưa có"}</p>
          <p><strong>Email:</strong> {user?.email || "Chưa có"}</p>
          <p><strong>Số điện thoại:</strong> {user?.phone || "Chưa có"}</p>
          <p><strong>Địa chỉ:</strong> {user?.address || "Chưa có"}</p>
        </div>

        <hr className="divider" />

        <div className="profile-field">
          <label>Tên </label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên " />
        </div>

        <div className="profile-field">
          <label>Email </label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email " />
        </div>

        <div className="profile-field">
          <label>Số điện thoại </label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại " />
        </div>

        <div className="profile-field">
          <label>Địa chỉ </label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ " />
        </div>

        <button className="update-btn" onClick={handleUpdateAll}>Cập nhật </button>
      </div>
    </div>
  );
}

export default ProfilePage;

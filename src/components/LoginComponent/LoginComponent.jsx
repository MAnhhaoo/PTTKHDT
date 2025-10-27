import React, { useState } from "react";
import "./login.css";
import h1 from "../../assets/img/123.png";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../Service/UserService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/userSlide";

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: (data) => UserService.loginUser(data),
    onSuccess: (data) => {
      console.log("Đăng nhập thành công:", data);

      // 🧩 Lưu access_token
      // localStorage.setItem("access_token", data.access_token);

      // 🧠 Cập nhật Redux store
      dispatch(
        setUser({
          user: data.user, // phải trả về từ API
          token: data.access_token,
        })
      );


      setMessage("✅ Đăng nhập thành công!");

      // ⏳ Chuyển trang
      setTimeout(() => {
        navigate("/");
      }, 1000);
    },

    onError: (error) => {
      console.log("Lỗi đăng nhập:", error);
      setMessage(
        error.response?.data?.message || "❌ Sai email hoặc mật khẩu!"
      );
    },
  });

  const { isPending } = mutation;

  const handleLogin = () => {
    if (!email || !password) {
      setMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setMessage("");
    mutation.mutate({ email, password });
  };

  return (
    <div style={{ backgroundColor: "#F5F5FA" }}>
      <div className="container1">
        <Row style={{ padding: "50px 0", borderRadius: "10px" }}>
          <Col
            span={12}
            style={{
              padding: "50px 60px",
              fontSize: "20px",
              backgroundColor: "white",
            }}
          >
            <h2>Xin chào</h2>
            <p>Đăng nhập</p>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                height: "25px",
                marginBottom: "20px",
              }}
              type="text"
              placeholder="Email"
            />

            <input
              value={password}
              onChange={(e) => setPass(e.target.value)}
              style={{
                width: "100%",
                height: "35px",
                paddingRight: "35px",
                boxSizing: "border-box",
              }}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "70px",
                top: "54%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
            >
              {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
            </span>

            <div style={{ minHeight: "25px", marginTop: "10px" }}>
              {message && (
                <p
                  style={{
                    color: message.startsWith("✅") ? "green" : "red",
                    margin: 0,
                  }}
                >
                  {message}
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              disabled={isPending}
              className="btn1"
            >
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <br />
            <span style={{ fontSize: "15px" }}>
              Bạn chưa có tài khoản?{" "}
              <a href="/signup" className="link">
                Đăng ký ngay
              </a>
            </span>
          </Col>

          <Col className="img_right" span={12}>
            <img
              style={{ margin: "60px 0 0 105px", borderRadius: "15px" }}
              width={"220px"}
              src={h1}
              alt=""
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginComponent;

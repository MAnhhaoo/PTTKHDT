import React, {  useState } from "react";
import h1 from "../../assets/img/123.png";
import "./signup.css";
import { Col,  Row } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import * as UserService from "../../Service/UserService";
import { useNavigate } from "react-router-dom";

const SignupComponent = () => {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [confirmPass, setComfirmPass] = useState("");
  const [mess, setMess] = useState("");

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data) => UserService.signupUser(data),
    onSuccess: (data) => {
      console.log("✅ Signup success:", data);
      setMess("✅ Đăng ký thành công!");
      // chuyển trang sau 1 giây để kịp hiển thị message
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    },
    onError: (error) => {
      console.log("❌ Signup error:", error);
      setMess(error.response?.data?.message || "Đăng ký không thành công!");
    },
  });

  const { isPending } = mutation;

  const handleSignup = () => {
    console.log("signup ", email, password, confirmPass);
    setMess("");

    // Kiểm tra định dạng email hợp lệ (regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMess("Email không hợp lệ! (Ví dụ: example@gmail.com)");
      return;
    }

    // Kiểm tra điền đủ trường
    if (!email || !password || !confirmPass) {
      setMess("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPass) {
      setMess("Mật khẩu nhập lại không khớp!");
      return;
    }

    // Gửi request nếu hợp lệ
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
              position: "relative",
            }}
          >
            <h2>Xin chào</h2>
            <p>Đăng ký</p>

            {/* Email */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                height: "35px",
                marginBottom: "20px",
              }}
              type="text"
              placeholder="Email"
            />

            {/* Password */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <input
                value={password}
                onChange={(e) => setPass(e.target.value)}
                style={{
                  width: "100%",
                  height: "35px",
                  paddingRight: "35px",
                  boxSizing: "border-box",
                }}
                type={showPass ? "text" : "password"}
                placeholder="Password"
              />
              <span
                onMouseDown={(e) => e.preventDefault()} // tránh nhảy layout
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                {/* Dùng icon cố định kích thước để tránh layout nhảy */}
                <span style={{ display: "inline-block", width: "20px" }}>
                  {showPass ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </span>
              </span>
            </div>

            {/* Confirm Password */}
            <div style={{ position: "relative" }}>
              <input
                value={confirmPass}
                onChange={(e) => setComfirmPass(e.target.value)}
                style={{
                  width: "100%",
                  height: "35px",
                  paddingRight: "35px",
                  boxSizing: "border-box",
                }}
                type={showPass ? "text" : "password"}
                placeholder="Confirm Password"
              />
              <span
                onMouseDown={(e) => e.preventDefault()} // tránh flicker layout
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "inline-block", width: "20px" }}>
                  {showPass ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                </span>
              </span>
            </div>

            {/* Giữ cố định vị trí thông báo */}
            <div style={{ minHeight: "25px", marginTop: "10px" }}>
              {mess && (
                <p
                  style={{
                    color: mess.startsWith("✅") ? "green" : "red",
                    margin: 0,
                  }}
                >
                  {mess}
                </p>
              )}
            </div>

            <button
              onClick={handleSignup}
              disabled={isPending}
              className="btn1"
            >
              {isPending ? "Đang đăng ký..." : "Đăng ký"}
            </button>
            <br />
            <span style={{ fontSize: "15px" }}>
              <a href="/login" className="link">
                Đăng nhập ngay
              </a>
            </span>
          </Col>

          <Col className="img_right" span={12}>
            <img
              style={{
                margin: "60px 0 0 105px",
                borderRadius: "15px",
              }}
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

export default SignupComponent;

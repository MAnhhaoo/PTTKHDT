import React from "react";
import { Col, Row, Dropdown } from "antd";
import h1 from "../../assets/img/logo.png";
import "../HeaderPage/header.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/userSlide";
import { DownOutlined } from "@ant-design/icons";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Xử lý khi chọn menu dropdown
  const handleMenuClick = ({ key }) => {
    if (key === "logout") {
      dispatch(logout());
      navigate("/login");
    } else if (key === "profile") {
      navigate("/profile");
    }
  };

  // Menu dropdown
  const items = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
    },
    {
      key: "logout",
      label: "Đăng xuất",
    },
  ];

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <Row
        style={{
          background: "black",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Col span={10} style={{ textAlign: "center" }}>
          <a href="/">
            <img
              style={{ maxHeight: "50px", margin: "26px" }}
              src={h1}
              alt="logo"
            />
          </a>
        </Col>

        <Col
          className="col_title"
          span={14}
          style={{
            display: "flex",
            justifyContent: "space-around",
            maxWidth: "920px",
            alignItems: "center",
          }}
        >
          <a href="/">
            <h2>Trang chủ</h2>
          </a>
          <a href="/profile">
            <h2>Giới thiệu</h2>
          </a>
          <a href="/contact">
            <h2>Liên hệ</h2>
          </a>

          {/* ✅ Nếu đã đăng nhập thì hiện dropdown */}
          {isAuthenticated ? (
            <Dropdown
              menu={{
                items,
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
            >
              <a
                onClick={(e) => e.preventDefault()}
                style={{ color: "white", cursor: "pointer" }}
              >
                <h2>
                  Xin chào {user?.name} <DownOutlined />
                </h2>
              </a>
            </Dropdown>
          ) : (
            <h2
              onClick={handleLogin}
              style={{ cursor: "pointer", color: "white" }}
            >
              Đăng nhập
            </h2>
          )}

          <div className="btn">
            <a href="#" style={{ backgroundColor: "#F37004" }}>
              <h2
                style={{
                  backgroundColor: "#F37004",
                  padding: "10px 28px",
                  borderRadius: "8px",
                  margin: "6px",
                }}
              >
                Đặt món
              </h2>
            </a>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Header;

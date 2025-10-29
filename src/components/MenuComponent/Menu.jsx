import React from "react";
import { Col, Row } from "antd";
import h1 from "../../assets/img/grande.jpg";
import h2 from "../../assets/img/img_home_main_order_right_2.png"
import "./menu.css";
import { useNavigate } from "react-router-dom";
function Menu() {
  const navigate = useNavigate()
  const handleSeeProduct = () => {
    navigate('/menu')
  }
  return (
    <div>
      <div className="IMG">
        <div className="container">
          <div>
            <Row>
              <Col span={12}>
                <div>
                  <h2 style={{ marginBottom: "25px" }}>
                    THỰC ĐƠN CỦA PIZZA & BIA
                  </h2>
                  <div className="menu_title">
                    <div className="menu_detail">
                      <a href="#">
                        <img src={h1} sizes="100px" alt="" />
                      </a>
                      <div style={{ marginLeft: "-225px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h2>SALAD BURRATA & TRÁI CÂY</h2>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              color: "red",
                            }}
                          >
                            253,800₫
                          </p>
                        </div>
                        <p style={{ fontSize: "20px" }}>
                          Rau xanh, tầm bóp, táo, cà chua ngọt, phô mai Burrata,{" "}
                          <br /> granola, sốt salad ăn kèm
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="menu_title" style={{ margin: "15px 0" }}>
                    <div className="menu_detail">
                      <a href="#">
                        <img src={h1} sizes="100px" alt="" />
                      </a>
                      <div style={{ marginLeft: "-225px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h2>SALAD BURRATA & TRÁI CÂY</h2>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              color: "red",
                            }}
                          >
                            253,800₫
                          </p>
                        </div>
                        <p style={{ fontSize: "20px" }}>
                          Rau xanh, tầm bóp, táo, cà chua ngọt, phô mai Burrata,{" "}
                          <br /> granola, sốt salad ăn kèm
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="menu_title" style={{ marginBottom: "15px" }}>
                    <div className="menu_detail">
                      <a href="#">
                        <img src={h1} sizes="100px" alt="" />
                      </a>
                      <div style={{ marginLeft: "-225px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h2>SALAD BURRATA & TRÁI CÂY</h2>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              color: "red",
                            }}
                          >
                            253,800₫
                          </p>
                        </div>
                        <p style={{ fontSize: "20px" }}>
                          Rau xanh, tầm bóp, táo, cà chua ngọt, phô mai Burrata,{" "}
                          <br /> granola, sốt salad ăn kèm
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="menu_title">
                    <div className="menu_detail">
                      <a href="#">
                        <img src={h1} sizes="100px" alt="" />
                      </a>
                      <div style={{ marginLeft: "-225px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <h2>SALAD BURRATA & TRÁI CÂY</h2>
                          <p
                            style={{
                              fontSize: "15px",
                              fontWeight: "500",
                              color: "red",
                            }}
                          >
                            253,800₫
                          </p>
                        </div>
                        <p style={{ fontSize: "20px" }}>
                          Rau xanh, tầm bóp, táo, cà chua ngọt, phô mai Burrata,{" "}
                          <br /> granola, sốt salad ăn kèm
                        </p>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSeeProduct} className="btn_view">Xem tất cả</button>
                </div>
              </Col>
              <Col span={12}>
                <div className="content_right">
                  <div>
                    <h2 style={{ marginBottom: "40px" , marginTop: "15px" }}>GỌI ĐẶT BÀN</h2>
                    <p style={{color: "#f37004"}}>ĐANG MỞ CỬA</p>
                  </div>
                  <div>
                    <h4>Pizza & Bia</h4>

                    <p>
                      Tại pizza & bia, chúng tôi nghĩ pizza và bia là một sự kết
                      hợp thú vị và tuyệt vời.
                    </p>
                    <p style={{margin: "30px 0"}}>
                      Thủ công mỹ nghệ kiểu Ý bắt đầu từ việc chuẩn bị bột bánh
                      pizza. Khi bột của chúng tôi đã sẵn sàng, chúng tôi sẽ
                      nhồi mở đế bánh pizza theo cách thủ công của chúng tôi và
                      topping được đặt lên mỗi chiếc bánh br pizza theo phong cách
                      New York, nguyên liệu được nhập khẩu với chất lượng cao.
                    </p>
                    <p style={{marginBottom: "55px"}}>
                      Những chiếc bánh pizza của chúng tôi thực đặc biệt, và
                      không còn gì tuyệt vời hơn khi thưởng thức chúng cùng một
                      ly bia tươi thủ công. Bia của chúng tôi được làm từ những
                      nhà máy sản xuất bia thủ công hàng đầu ở Việt Nam như East
                      West, Heart of Darkness, 7Bridges, Pasteur Street & Tê Tê.
                    </p>
                  </div>
                  <div style={{display: "flex" , justifyContent: "space-around" , alignItems : "center"}}>
                    <div style={{width: "80px" , height: "80px" , padding: "13px", backgroundColor: "white", borderRadius: "100%"}}>
                        <img style={{height: "auto" , maxWidth: "100%" , border: "none"}} sizes="50px" src={h2} alt="" />
                    </div>
                    <div style={{marginLeft: "20px"}}>
                        <h3 style={{fontSize: "17px" , color: "#f58223"}}>THỜI GIAN NHÀ HÀNG MỞ CỬA</h3>
                        <p>Thứ 2 đến thứ Chủ nhật</p>
                        <p>11:00 AM - 10:00 PM</p>
                    </div>
                    
                  </div>
                   <button className="btn_view2">Gọi đặt bàn</button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;

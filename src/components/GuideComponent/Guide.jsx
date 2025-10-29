import React from "react";
import "./guide.css";
import h1 from "../../assets/img/img_home_main_recipe_item_1.jpg";
import h2 from "../../assets/img/img_home_main_recipe_item_2.jpg";
import h3 from "../../assets/img/img_home_main_recipe_item_3.jpg";
import h4 from "../../assets/img/img_home_main_recipe_item_4.jpg"
import { Col, Row } from "antd";
const Guide = () => {
  return (
    <div>
      <div className="container">
        <Row>
          <Col span={12}>
            <div className="letf" style={{margin: "70px 30px 0 180px"}}>
              <div style={{marginBottom: "30px"}}>
                <h2>CÁCH HÂM NÓNG PIZZA TẠI NHÀ</h2>
                <p style={{ color: "#f37004" ,fontSize: "18px" ,fontWeight:"600" }}>GỒM 04 BƯỚC:</p>
              </div>
              <div>
                <img style={{ borderRadius: "20px" , width: "100%" }} sizes="420px" src={h1} alt="" />
              </div>
              <div>
                <img style={{ width: "100%" ,borderRadius: "20px" , marginTop: "50px" }} sizes="420px" src={h2} alt="" />
              </div>
            </div>
          </Col>
          <Col span={12}>
          <div style={{marginTop: "70px" , marginLeft: "20px" }}>
            <div><img sizes="420px" style={{width: "60%" ,  borderRadius: "20px"}} src={h3} alt="" /></div>
            <div><img sizes="420px" style={{width: "60%" , borderRadius: "20px" , marginTop: "50px"}} src={h4} alt="" /></div>
            <p style={{margin: "40px 0" , fontSize: "15px"}}>
                Chúng tôi tự hào về nhà hàng của mình với những sản phẩm chất <br /> lượng cao và cách phục vụ thân thiện. Luôn mang lại sự trải nghiệm <br /> tốt nhất cho khách hàng.
                <br /> <br />
                <a href="/menu" style={{color: "#F37004" , margin: "50px 0", textDecoration: "underline"}}>ĐẶT HÀNG NGAY</a>
            </p>
            
          </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Guide;

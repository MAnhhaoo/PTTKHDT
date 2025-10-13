import React from "react";
import "./login.css";
import h1 from "../../assets/img/123.png";
import { Col, Row } from 'antd';
const LoginComponent = () => {
  return (
    <div style={{backgroundColor : "#F5F5FA"}}>
      <div className="container1">
      
        <Row style={{padding: "50px 0 50px 0" , borderRadius: "10px"}}>
          <Col span={12} style={{padding: "50px 60px" , fontSize: "20px" , backgroundColor: "white"}} >
            <h2>Xin chào</h2>
            <p>Đăng nhập</p>
            <input style={{width : "100%" , height: "25px" , marginBottom: "20px"}} type="text" placeholder="Email" name="" id="" /> <br />
            <input style={{width : "100%" , height: "25px"}}  type="text" placeholder="Password" name="" id="" />
            <button  className="btn1" >Đăng nhập</button> <br />
            <span style={{fontSize: "15px"}}>Bạn chưa có tài khoản ? <a href="#" className="link" >Đăng ký ngay</a> </span>
          </Col>
          <Col className="img_right" span={12}>
            <img style={{margin: "60px 0 0 105px" , borderRadius: "15px"}} width={"220px"} src={h1} alt="" />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginComponent;

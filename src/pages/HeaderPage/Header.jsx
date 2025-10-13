import React from 'react'
import { Col, Row } from 'antd';
import h1 from "../../assets/img/logo.png"
import "../HeaderPage/header.css"

const Header = () => {
  return (
    <div>
      <Row style={{background : "black" , display : "flex" , alignItems : "center"}}>
      <Col span={10} style={{textAlign: 'center'}} >
     <a href="#">
       <img style={{maxHeight : "50px" , margin : '26px' }} src={h1} alt="" />
     </a>
     </Col>
      <Col className='col_title' span={14} style={{display: "flex" , justifyContent : "space-around" , maxWidth : "920px" }}>

        <a href="">
          <h2>Menu</h2>
        </a>
        <a href="">
          <h2>
            Trang chủ
          </h2>
        </a>
        <a href="">
          <h2>
            Giới thiệu 
          </h2>
        </a>
        <a href="">
          <h2>
            Liên hệ
          </h2>
        </a>
        <a href="">
          <h2>
            Đăng nhập
          </h2>
        </a>
        <div className='btn'>
          <a href="" style={{backgroundColor : "F37004"}}>
         <h2 style={{backgroundColor :" #F37004" , padding: "10px 28px" , borderRadius : "8px" , margin : "6px " }}>Đặt món</h2>
        </a>
        </div>
      </Col>
    </Row>
    </div>
  )
}

export default Header
import React from 'react'
import "./adbout.css"
import { Col, Row } from 'antd';
import h1 from "../../assets/img/page_banner.jpg"
function AboutComponent() {
  return (
    <div>
        <div className="Img_Bg2">

       <div className="container">
            <div style={{paddingTop: "90px"}}>
                <h2 style={{fontSize: "45px" , color: "white", textAlign: "center"}}>GIỚI THIỆU VỀ PIZZA & BIA</h2>
            </div>
       </div>

        </div>

        <div className="container">
            <Row>
      <Col span={6}>
      <div style={{margin: "33px 0 50px 0"}}>
        <div style={{border: "1px solid #e3e5ec" , borderRadius: "10px  "}}>
            <h2 style={{textAlign: "center"}}>DANH MỤC TRANG</h2>
            <hr style={{height: "2px", backgroundColor: "black"}}/>
            <div style={{marginLeft: "25px" , fontSize: "15px"}}>
                <p>
                <a href="">
                    Sản phẩm nổi bật
                </a>
            </p>
            <p>
                <a href="">
                    Tất cả sản phẩm
                </a>
            </p>
            </div>
        </div>
        <div className='img-wrapper' style={{margin: "10px 0"}}>
            <img className='img-hover' src={h1} width={"100%"} alt="" />
        </div>
      </div>
      </Col>
      <Col span={18} >
        <div style={{marginLeft: "60px"}}>
            <div>
            <h2 style={{fontSize: "30px"}}>
                GIỚI THIỆU VỀ PIZZA & BIA
            </h2>
        </div>
        <div style={{fontWeight: "500", fontSize: "14px"}}>
            <p>
                Pizza & Bia
                <br />
                <br />

Tại pizza & bia, chúng tôi nghĩ pizza và bia là một sự kết hợp thú vị và tuyệt vời.
<br /> <br />
Thủ công mỹ nghệ kiểu Ý bắt đầu từ việc chuẩn bị bột bánh pizza. Khi bột của chúng tôi đã sẵn sàng, chúng tôi sẽ nhồi mở đế bánh pizza theo cách thủ công của chúng tôi và topping được đặt lên mỗi chiếc bánh pizza theo phong cách New York, nguyên liệu được nhập khẩu với chất lượng cao. <br /> <br />

Những chiếc bánh pizza của chúng tôi thực đặc biệt, và không còn gì tuyệt vời hơn khi thưởng thức chúng cùng một ly bia tươi thủ công. Bia của chúng tôi được làm từ những nhà máy sản xuất bia thủ công hàng đầu ở Việt Nam như East West, Heart of Darkness, 7Bridges, Pasteur Street & Tê Tê.a
            </p>
        </div>
        </div>
      </Col>
    </Row>
        </div>
    </div>
  )
}

export default AboutComponent
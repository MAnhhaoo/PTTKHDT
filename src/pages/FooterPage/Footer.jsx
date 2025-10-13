import React from 'react'
import h1 from "../../assets/img/logo.png";
import  "./Footer.css";
import h2 from "../../assets/img/logo_bct_image.png"
const Footer = () => {
  return (
    <div style={{backgroundColor: "#1B1F28"}}>
        <div className='container' >
            
            <div style={{ display: "flex", color : "white" , fontSize:"15px" , justifyContent : "space-around" , alignItems : "center"}}>

          
            <div>
            <img style={{maxHeight : "50px", width :"175%" , margin : '26px -80px' }} src={h1} alt="" />
            
            </div>
        <div style={{marginLeft: "40px"}}>
            <h2>Pizza & Bia</h2>

           
        </div>
        <div style={{marginRight: "-64px"}}><h2>Chính sách</h2></div>
        <div>
            <h2>Kết nối với chúng tôi</h2>
        </div>
    </div>
    <div className='footer_content' style={{display: "flex" , alignItems: "center"}}>
        <div>
            <p className='p_title'>Bánh pizza tại Pizza & Bia là sự kết hợp giữa cách làm bánh <br /> thủ công kiểu Ý kết hợp với các loại topping phong phú kiểu <br /> New York. Đế bánh mỏng vừa, viền bánh phổng xốp giòn ăn <br /> rất ngon miệng. Không gian quán ấm cúng, cozy đậm chất <br /> New York Pizza-Bar tại Việt Nam.</p>
        </div>
        <div>
 <ul className='ul_footer' style={{fontSize : "20px" , listStyle: "none" }}>
                <li>
                    <a href="#">Giới thiệu</a>
                </li>
                <li> <a href="#">Liên hệ với chúng tôi</a></li>
                <li> <a href="#">Phạm vi hàng hóa & phí giao hàng</a></li>
            </ul>
        </div>
        <div>
            <ul style={{fontSize: "20px" ,listStyle: "none" , marginLeft: "18px"}}>
                <li>
                    <a href="">Chính sách bảo hộ</a>
                </li>
                <li>
                    <a href="">Chính sách đổi trả</a>
                </li>
                <li>
                    <a href="">Chính sách vận chuyển</a>
                </li>
                <li>
                    <a href="">Chính sách thanh toán</a>
                </li>
            </ul>
        </div>
        <div></div>
        
    </div>

            <div>
                <div style={{textAlign: "center" , color: "white" ,fontSize: "13px" , margin: "10px 0 0 0"}}> <img src={h2} width={"290px"} style={{margin: "10px 0"}} height={"114px"} alt="" />
                <h3>CÔNG TY TNHH NHÀ HÀNG PIZZA & BIA (PIZZA & BIA RESTAURANT Co., LTD)</h3>
                <h3>ĐKKD: 0314245836 Do Sở Kế Hoạch Và Đầu Tư TP. Hồ Chí Minh Cấp Ngày 27/02/2017.</h3>
                <h3>Địa chỉ: 24/4 Phạm Ngọc Thạch, Phường Võ Thị Sáu, Quận 3, TP. Hồ Chí Minh, Việt Nam.</h3>
                <h3>Hotline: 02838239398</h3>
                <h3>Email: pizzaandbia@gmail.com</h3>
                
                </div>
                <div style={{display: "flex" , justifyContent: "center" , fontSize: "15px"}}>
                    <p style={{color: "white"}}>Copyright © 2025 </p>
                    <p style={{color: "#EB5C2C"}}>Pizza & Bia. Powered by Haravan</p>
                </div>
            </div>
        </div>

        </div>

  )
}

export default Footer
import React from "react";
import { Col, Row } from "antd";
import "./story.css";
import h1 from "../../assets/img/img_home_main_about.jpg";
const Story = () => {
  return (
    <div>
      <div className="IMG_Story">
        <div className="container">
          <Row style={{ display: "flex", alignItems: "center" }}>
            <Col span={12}>
              <img
                style={{
                  height: "auto",
                  width: "70%",
                  marginTop: "30px",
                  borderRadius: "3%",
                }}
                sizes="570px"
                src={h1}
                alt=""
              />
            </Col>
            <Col span={12}>
              <h2 style={{ color: "#F37004", fontSize: "28px" }}>
                CÂU CHUYỆN CỦA PIZZA & BIA
              </h2>
              <p style={{ fontSize: "18px" }}>
                Mùa hè năm 2016, tôi bắt đầu một quá trình đào tạo học tập ở Ý
                để trở thành một Pizzaiola đủ tiêu chuẩn với mục đích đưa những
                kỹ năng mới của tôi về Việt Nam. Tôi đã đam mê nấu ăn từ rất nhỏ
                và tôi vẫn còn nhớ công việc yêu thích là giúp mẹ tôi nấu ăn cho
                gia đình. Sau khi du lịch đến Ý, được học tập và có cơ hội khám
                phá nền ẩm thực nơi đây, tôi đã nhìn thấy sự tương đồng giữa hai
                nền văn hoá Ý - Việt là luôn đánh giá cao giá trị gia đình và
                nền ẩm thực nước nhà. Và tôi đã yêu thích ẩm thực Ý, đặc biệt
                nhất là niềm đam mê với pizza. Sau khi hoàn thành khoá học và
                chuyến du ngoạn vòng quanh nước Ý, Tôi quyết tâm trở lại Việt
                Nam mở một tiệm pizza của riêng mình. Trong khi tôi phá vỡ một
                số luật lệ làm pizza của Ý để kết hợp với pizza mang phong cách
                New York, nhưng tôi luôn bám Theo các phương thức truyền thống
                căn bản tôi đã được học ở Ý, xung quanh tầm quan trọng của việc
                chuẩn bị bột pizza theo cách thủ công và sốt pizza đơn giản tươi
                ngon để tạo nên một chiếc bánh pizza tuyệt vời.
              </p>
              <h3 style={{ fontSize: "18px" }}>
                Vy Nguyen, Pizzaiola & chủ sở hữu, Pizza & Bia
              </h3>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Story;

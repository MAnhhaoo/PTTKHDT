import React from 'react'
import "./Contact.css"
import { Col, Row } from 'antd';

const ContractComponent = () => {
  return (
    <div>
      <div className="Img_Bg3">
        <div className="container">
          <div style={{ paddingTop: "90px", textAlign: "center", fontSize: "40px", color: "white" }}>
            <h2>Liên hệ cửa hàng</h2>
          </div>
        </div>
      </div>

      <div className="container">
        <Row gutter={20}>
          <Col span={12}>
            <div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.417390095206!2d106.68163577583846!3d10.779309559138923!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f2f38563351%3A0xe2afc7d527483b0e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4gLSBDxqEgU-G7nyAx!5e0!3m2!1svi!2s!4v1757840350159!5m2!1svi!2s"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          </Col>

          <Col span={12}>
            <div >
              <h3>Thông tin liên hệ</h3>
              <p>📍 Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
              <p>📞 Số điện thoại: 0909 123 456</p>
              <p>✉️ Email: contact@store.com</p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default ContractComponent

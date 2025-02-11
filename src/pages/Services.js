import React from "react";
import { Typography, Button, Space, Col, Row, Card } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

export default function Services() {
  return (
    <Space
      direction="vertical"
      size="large"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 25,
      }}
    >
      <Title level={2} style={{ margin: 0 }}>
        Services
      </Title>

      <Paragraph style={{ fontSize: 16 }}>
        We're excited to welcome you to our portal! It's designed to provide you
        with easy access to important services and information. As a guest, you
        can explore our website to learn more about local businesses and how to
        conveniently request barangay forms online. To unlock all features and
        get the most out of our services, please consider{" "}
        <Link to="/">logging in</Link> or{" "}
        <Link to="/create-account">creating an account</Link>. We look forward
        to serving you better!"
      </Paragraph>

      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={
              <img
                alt="Barangay Clearance"
                src={require("../assets/request-form.jpg")}
              />
            }
          >
            <Title level={3}>Request Forms</Title>
            <Paragraph>
              Easily request your forms on our barangay online. Save time and
              avoid the hassle of paperwork.
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            cover={
              <img
                alt="Businesses Locations"
                src={require("../assets/businesses-location.jpg")}
              />
            }
          >
            <Title level={3}>Business Locations</Title>
            <Paragraph>
              Discover businesses in your area. Support local businesses and
              find what you need close to home.
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* <Col style={{ backgroundColor: "red", height: 500, width: "100%" }} /> */}
    </Space>
  );
}

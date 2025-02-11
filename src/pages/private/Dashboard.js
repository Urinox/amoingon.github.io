import React from "react";
import { Typography, Button, Space, Col, Row, Card } from "antd";
import { Link } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const { isValidResident } = useUserStore();
  return (
    <div style={{ height: "88vh", overflow: "auto" }}>
      <Space
        direction="vertical"
        size="large"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Title level={2}>Welcome, Dear Resident!</Title>

        <Paragraph style={{ fontSize: 16 }}>
          We are thrilled to have you here. Our portal is designed to make it
          easy for you to access important services and information. Explore our
          website to find out more about local businesses and conveniently
          request barangay forms online.
        </Paragraph>

        <Row gutter={[16, 16]} justify="center">
          {isValidResident && (
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                cover={
                  <img
                    alt="Barangay Clearance"
                    src={require("../../assets/request-form.jpg")}
                  />
                }
              >
                <Title level={3}>Request Forms</Title>
                <Paragraph>
                  Easily request your forms on our barangay online. Save time
                  and avoid the hassle of paperwork.
                </Paragraph>
                <Link to="/requests">
                  <Button style={{ backgroundColor: "#003b7f" }} type="primary">
                    Request Forms
                  </Button>
                </Link>
              </Card>
            </Col>
          )}
          <Col xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <img
                  alt="Businesses Locations"
                  src={require("../../assets/businesses-location.jpg")}
                />
              }
            >
              <Title level={3}>Business Locations</Title>
              <Paragraph>
                Discover businesses in your area. Support local businesses and
                find what you need close to home.
              </Paragraph>
              <Link to="/businesses">
                <Button style={{ backgroundColor: "#003b7f" }} type="primary">
                  Find Businesses
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>

        {/* <Col style={{ backgroundColor: "red", height: 500, width: "100%" }} /> */}
      </Space>
    </div>
  );
}

import React from "react";
import { Typography, Divider, Card, Row, Col, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Meta } = Card;

const developers = [
  {
    name: "Mark Daniel Ponce",
    role: "Student",
    imageUrl: require("../assets/developers/dev-1.jpg"),
  },
  {
    name: "Brylle Ildefon Saez",
    role: "Student",
    imageUrl: require("../assets/developers/dev-2.jpg"),
  },
  {
    name: "Francis Dimailig",
    role: "Student",
    imageUrl: require("../assets/developers/dev-3.jpg"),
  },
  {
    name: "Christian Narvaez",
    role: "Student",
    imageUrl: require("../assets/developers/dev-4.jpg"),
  },
  // Add more developers as needed
];

export default function About() {
  return (
    <div style={{ padding: "2rem" }}>
      <Typography>
        <Title style={{ margin: 0, marginBottom: 10 }}>About</Title>
        <Paragraph>
          The Barangay Amoingon's Local Portal and Promotional Website was
          created to serve as a digital platform for our vibrant and thriving
          community. Our goal is to provide residents with easy access to
          important services, information, and amenities. This platform is a
          testament to our commitment to fostering a welcoming and inclusive
          environment for all.
        </Paragraph>
        <Paragraph>
          For any inquiries or further information, feel free to contact us at:
          <br />
          <Text strong>Email:</Text> nexuspoint.amoingonbarangayhub@gmail.com
          <br />
          <Text strong>Phone:</Text> +63966-820-6104
        </Paragraph>
        <Paragraph>
          <Text strong>Location:</Text> Amoingon, Boac, Marinduque, Philippines
        </Paragraph>

        <Divider />

        <Title level={2} style={{ margin: 0, marginBottom: 10 }}>
          About the Developers
        </Title>
        <Paragraph style={{ margin: "30px 0px" }}>
          This website was developed by NEXUS POINT Company with a love for
          community service. With a strong background in web development and a
          keen eye for design, they have created a user-friendly platform that
          serves the needs of the Amoingon Barangay community.
        </Paragraph>

        <Row gutter={[16, 16]} style={{ justifyContent: "space-around" }}>
          {developers.map((developer, index) => (
            <Col
              key={index}
              // xs={18}
              // sm={12}
              // md={6}
              // style={{ backgroundColor: "red" }}
            >
              <Card
                hoverable
                className="cardWithRoundedImage"
                style={{
                  width: 300,
                  marginBottom: 16,
                  borderRadius: "15px",
                }}
                cover={
                  <div
                    style={{
                      height: "200px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      alt="Developer"
                      src={developer.imageUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                }
              >
                <Meta
                  avatar={<UserOutlined />}
                  title={developer.name}
                  description={developer.role}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Typography>
    </div>
  );
}

import React, { useEffect } from "react";
import { Typography, Space, Card } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { adminStore } from "../../stores/adminStore";

const { Title, Paragraph } = Typography;

export default function AdminDashBoard() {
  // Fetch the data from your backend here
  const {
    fetchAdminDashboard,
    approvedRequestsCount,
    rejectedRequestsCount,
    pendingRequestsCount,
    residentsCount,
    nonResidentsCount,
    businessesCount,
  } = adminStore();

  useEffect(() => {
    fetchAdminDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const registeredUsers = 100; // Replace with actual data
  // const availableBusinesses = 0; // Replace with actual data
  // const pendingRequests = 30; // Replace with actual data
  // const rejectedRequests = 10; // Replace with actual data
  // const acceptedRequests = 60; // Replace with actual data
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
        <Title level={2}>Welcome back Admin!</Title>

        <Paragraph style={{ fontSize: 16 }}>
          In this dashboard, you'll find valuable insights into the community's
          engagement with our services. You can view the total number of
          registered users and track the status of form requests. Use this data
          to understand user needs and make informed decisions.
        </Paragraph>

        <Space direction="horizontal" size="large" wrap>
          <Card
            title={
              <>
                <UserOutlined style={{ color: "#FFF" }} />{" "}
                <span style={{ color: "#FFF" }}>Registered Residents</span>
              </>
            }
            style={{ width: 300 }}
            headStyle={{ backgroundColor: "#003b7f" }}
          >
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              {residentsCount}
            </Typography.Title>
          </Card>
          <Card
            title={
              <>
                <StopOutlined style={{ color: "#FFF" }} />{" "}
                <span style={{ color: "#FFF" }}>Registered Not Residents</span>
              </>
            }
            style={{ width: 300 }}
            headStyle={{ backgroundColor: "#003b7f" }}
          >
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              {nonResidentsCount}
            </Typography.Title>
          </Card>
          <Card
            title={
              <>
                <ShopOutlined style={{ color: "#FFF" }} />{" "}
                <span style={{ color: "#FFF" }}>Available Businesses</span>
              </>
            }
            style={{ width: 300 }}
            headStyle={{ backgroundColor: "#003b7f" }}
          >
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              {businessesCount}
            </Typography.Title>
          </Card>
          <Card
            title={
              <>
                <ClockCircleOutlined style={{ color: "#FFF" }} />{" "}
                <span style={{ color: "#FFF" }}>Pending Requests</span>
              </>
            }
            style={{ width: 300 }}
            headStyle={{ backgroundColor: "grey" }}
          >
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              {pendingRequestsCount}
            </Typography.Title>
          </Card>
          <Card
            title={
              <>
                <CloseCircleOutlined style={{ color: "#FFF" }} />{" "}
                <span style={{ color: "#FFF" }}>Rejected Requests</span>
              </>
            }
            style={{ width: 300 }}
            headStyle={{ backgroundColor: "#ff4d4f" }}
          >
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              {rejectedRequestsCount}
            </Typography.Title>
          </Card>
          <Card
            title={
              <>
                <CheckCircleOutlined style={{ color: "#FFF" }} />{" "}
                <span style={{ color: "#FFF" }}>Approved Requests</span>
              </>
            }
            style={{ width: 300 }}
            headStyle={{ backgroundColor: "#73d13d" }}
          >
            <Typography.Title level={1} style={{ textAlign: "center" }}>
              {approvedRequestsCount}
            </Typography.Title>
          </Card>
        </Space>
      </Space>
    </div>
  );
}

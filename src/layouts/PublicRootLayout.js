import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Typography, Layout, Space, Menu, Row, Avatar, Divider } from "antd";

const { Header, Content, Footer } = Layout;
const { Paragraph } = Typography;

const navigation = [
  { label: "Home", key: "/" },
  { label: "Services", key: "/services" },
  { label: "Find Businesses", key: "/businesses" },
  { label: "About", key: "/about" },
];

export default function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = ({ key }) => {
    if (key) {
      navigate(key);
    }
  };
  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          height: 90,
          alignItems: "center",
          backgroundColor: "#00264d",
          padding: "0 0",
        }}
      >
        <Row style={{ alignItems: "center", padding: "0 25px" }}>
          <Space size={10}>
            <Avatar alt="none" size={65} src={require("../assets/logo.png")} />
            <Typography.Text style={{ fontSize: 20, color: "white" }}>
            Barangay Amoingon's Local Portal and Promotional Website
            </Typography.Text>
          </Space>
        </Row>

        <Divider type="vertical" />

        <Menu
          className="menu"
          style={{ flex: 1, minWidth: 0, borderBottom: "none" }}
          mode="horizontal"
          selectedKeys={[location.pathname]}
          defaultSelectedKeys={[location.pathname]}
          items={navigation}
          onClick={handleMenuClick}
        />
      </Header>
      <Content style={{ backgroundColor: "#f5f5f5" }}>
        <Outlet />
      </Content>

      <Footer style={{ backgroundColor: "white" }}>
        <Paragraph style={{ textAlign: "center" }}>
          © 2024 NEXUS POINT COMPANY | Barangay Amoingon's Local Portal and Promotional Website | Brgy.
          Amoingon, Boac, Marinduque
        </Paragraph>
      </Footer>
    </Layout>
  );
}

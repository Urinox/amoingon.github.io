import { useState } from "react";
import {
  Flex,
  Typography,
  Col,
  Button,
  Form,
  Input,
  Card,
  Row,
  Divider,
  message,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import { logIn } from "../services/auth";
import { useUserStore } from "../stores/userStore";
import { getUserData } from "../services/user";

const { Title, Text, Paragraph } = Typography;

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { onLogin } = useUserStore();

  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const user = await logIn(values.email, values.password);
      const userData = await getUserData(user.uid);
      await onLogin(userData);

      console.log("Success:", values);
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Spin size="large" spinning={isLoading} tip="Logging in...">
      <Flex style={{ padding: 20, justifyContent: "space-around" }}>
        <Flex style={{ flex: 1.5, paddingLeft: 20, paddingRight: 20 }}>
          {contextHolder}
          <Col style={{ padding: 10, justifyContent: "flex-start" }}>
            <Title level={4}>
              Welcome to Barangay Amoingon's Local Portal - Your One-Stop Destination for
              Community Services!
            </Title>
            <Paragraph style={{ fontSize: 16 }}>
              Where crystal-clear waters meet warm hospitality, inviting you to
              discover the essence of island living.
            </Paragraph>
            <img
              alt="location"
              src={require("../assets/marinduque-beach.jpg")}
              style={{ borderRadius: 25 }}
              width={"100%"}
              height={500}
            />
          </Col>
        </Flex>

        <Flex
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 20,
            padding: 40,
            flex: 1,
          }}
        >
          <Card style={{ borderRadius: 25 }}>
            <Col>
              <Title level={3} style={{ paddingBottom: 10 }}>
                Member Login:
              </Title>
              <Form
                name="login"
                style={{
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={(error) => console.log("Failed:", error)}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Please input your email!",
                    },
                  ]}
                >
                  <Input placeholder="Email" size="large" />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Password" size="large" />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ width: "100%", backgroundColor: "#003b7f" }}
                  >
                    Log In
                  </Button>
                </Form.Item>
              </Form>

              <Divider />

              <Row>
                <Text>
                  Are you an Amoingon resident? Join our hub now for convenient
                  online barangay services!
                </Text>
              </Row>
              <Flex
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Button
                  type="primary"
                  onClick={() => navigate("create-account")}
                  style={{
                    backgroundColor: "orange",
                    marginTop: 10,
                  }}
                >
                  Create Account
                </Button>
              </Flex>
            </Col>
          </Card>
        </Flex>
      </Flex>
    </Spin>
  );
}

export default Home;

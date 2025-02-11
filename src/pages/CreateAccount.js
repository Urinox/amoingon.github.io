import React, { useState } from "react";
import { signUp } from "../services/auth";
import { signUpForm } from "../services/user";
import {
  Flex,
  Typography,
  Button,
  Form,
  Input,
  Card,
  Divider,
  DatePicker,
  Spin,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function CreateAccount() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      const birthdate = new Date(values.birthdate);
      const residencyDate = new Date(values.startDateOfResidency);
      const birthdateTimestamp = birthdate.getTime();
      const residencyDateTimestamp = residencyDate.getTime();
      setIsLoading(true);
      const user = await signUp(values.email, values.password);
      console.log(user, "usersrer");
      const userData = {
        ...values,
        birthdate: birthdateTimestamp,
        startDateOfResidency: residencyDateTimestamp,
      };

      await signUpForm(user.uid, userData);

      navigate("/");
      window.location.reload();

      console.log("Success:", values);
    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const compareToFirstPassword = (_, value) => {
    const { password } = form.getFieldsValue(true); // Use "true" to get the latest form values
    if (value && value !== password) {
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    }
    return Promise.resolve(true);
  };

  const validateToNextPassword = async (_, value) => {
    if (value && form.getFieldValue("password") !== value) {
      return Promise.reject(
        new Error("The two passwords that you entered do not match!")
      );
    }
    return Promise.resolve(true);
  };

  return (
    <Spin size="large" spinning={isLoading} tip="Creating Account">
      <Flex
        vertical
        style={{
          padding: 20,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        {contextHolder}
        <Title level={3} underline>
          Create Account Form
        </Title>
        <Text style={{ paddingBottom: 5 }}>
          Please fill out your account information accurately
        </Text>

        <Card style={{ borderRadius: 25, width: 500 }}>
          <Form
            form={form}
            name="register"
            style={{
              width: "100%",
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={(error) => console.log("Failed:", error)}
            autoComplete="off"
          >
            <Text style={{ paddingBottom: 20 }}>Personal Info:</Text>
            <Form.Item
              name="fullname"
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
              ]}
              style={{ marginTop: 10 }}
            >
              <Input placeholder="Full Name" size="large" />
            </Form.Item>

            <Form.Item
              name="birthdate"
              rules={[{ required: true, message: "This field is required!" }]}
            >
              <DatePicker
                size="large"
                placeholder="Birth date"
                style={{ width: "50%" }}
              />
            </Form.Item>

            <Form.Item
              name="birthplace"
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
              ]}
            >
              <Input placeholder="Birth Place" size="large" />
            </Form.Item>

            <Form.Item
              name="startDateOfResidency"
              rules={[{ required: true, message: "This field is required!" }]}
            >
              <DatePicker
                size="large"
                placeholder="Start date of residency"
                style={{ width: "50%" }}
              />
            </Form.Item>

            <Divider />

            <Text>Login Info:</Text>

            <Form.Item
              name={"email"}
              rules={[
                { type: "email" },
                { required: true, message: "This field is required!" },
              ]}
            >
              <Input
                size="large"
                placeholder="Email"
                style={{ marginTop: 10 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
                {
                  validator: validateToNextPassword,
                },
              ]}
            >
              <Input.Password placeholder="Set Password" size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
                {
                  validator: compareToFirstPassword,
                },
              ]}
            >
              <Input.Password
                placeholder="Confirm Password"
                size="large"
                onBlur={handleConfirmBlur}
              />
            </Form.Item>

            <Form.Item>
              <Button
                loading={isLoading}
                type="primary"
                htmlType="submit"
                size="large"
                style={{ width: "100%", backgroundColor: "#003b7f" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Flex>
    </Spin>
  );
}

import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Table,
  Typography,
  Button,
  Modal,
  Card,
  message,
  Tag,
  Form,
  Input,
} from "antd";
import {
  CheckCircleTwoTone,
  EnvironmentTwoTone,
  ShopTwoTone,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { createRequest } from "../../services/form-request";
import { useUserStore } from "../../stores/userStore";
import { usePageLoaderStore } from "../../stores/pageLoaderStore";
import { useRequestsStore } from "../../stores/requestsStore";

const { Title, Paragraph, Text } = Typography;

const columns = [
  {
    title: "Request ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Form Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Date Requested",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (timestamp) => {
      const dateObject = new Date(timestamp); // if timestamp is a JavaScript timestamp
      return dateObject.toLocaleDateString();
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let color;
      switch (status) {
        case "pending":
          color = "gray";
          break;
        case "approved":
          color = "green";
          break;
        case "rejected":
          color = "red";
          break;
        default:
          color = "gray";
      }
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
];

const cards = [
  {
    icon: (
      <CheckCircleTwoTone
        twoToneColor={"#003b7f"}
        style={{ fontSize: "48px" }}
      />
    ),
    type: "brgy-clearance",
    title: "Barangay Clearance",
    description:
      "This is to certify that the individual is a resident of this Barangay and has lived here for approximately (number of years).",
    validity: "1 year",
    cost: "100 PHP",
  },
  {
    icon: (
      <EnvironmentTwoTone
        twoToneColor={"#003b7f"}
        style={{ fontSize: "48px" }}
      />
    ),
    type: "brgy-conformance",
    title: "Barangay Conformance",
    description:
      "This is to certify that the individual is a resident of this Barangay and complies with all the local government unit's laws and regulations.",
    validity: "1 year",
    cost: "100 PHP",
  },
  {
    icon: <ShopTwoTone twoToneColor={"#003b7f"} style={{ fontSize: "48px" }} />,
    type: "brgy-business-clearance",
    title: "Barangay Business Clearance",
    description:
      "This is to certify that the business has obtained the necessary approval from the local community and has complied with all the Barangay's rules and regulations.",
    validity: "1 year",
    cost: "100 PHP",
  },
];

export default function Requests() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBusinessFormModalVisible, setIsBusinessFormModalVisible] =
    useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { id, isValidResident } = useUserStore();
  const { setPageLoading } = usePageLoaderStore();
  const { requests, fetchRequests, addNewRequest } = useRequestsStore();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchRequests(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOnRequest = async (type, businessData) => {
    try {
      setPageLoading(true);
      setIsModalVisible(false);
      let response;

      switch (type) {
        case "brgy-clearance":
        case "brgy-conformance":
          response = await createRequest({
            type,
            userId: id,
          });

          break;
        case "brgy-business-clearance":
          if (!businessData) {
            messageApi.error("Please provide business details.");
            return;
          }
          response = await createRequest({
            type,
            userId: id,
            businessData: businessData,
          });
          break;
        default:
          break;
      }
      if (response) {
        addNewRequest(response);
      }
      openSuccessModal();
      //   messageApi.success("Request has been created.");
    } catch (error) {
      messageApi.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const showBusinessFormModal = () => {
    setIsBusinessFormModalVisible(true);
  };

  const closeBusinessFormModal = () => {
    setIsBusinessFormModalVisible(false);
  };

  const openSuccessModal = () => {
    setIsSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  const onFinishBusinessForm = async (values) => {
    setPageLoading(true);
    const businessData = {
      businessName: values.businessName,
      businessOwner: values.businessOwner,
      location: values.location,
      ownerAddress: values.ownerAddress,
    };
    handleOnRequest("brgy-business-clearance", businessData);
    closeBusinessFormModal();
  };

  if (!isValidResident) {
    return;
  }

  return (
    <Col style={{ padding: 20 }}>
      {contextHolder}
      <Row
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>Requests</Title>
        {requests.length > 0 && (
          <Button
            onClick={showModal}
            style={{
              backgroundColor: "#003b7f",
              height: 50,
              borderRadius: 25,
              fontSize: 15,
              fontWeight: "bold",
            }}
            type="primary"
          >
            Create Request +
          </Button>
        )}
      </Row>

      <Modal
        title=""
        open={isSuccessModalVisible}
        onCancel={closeSuccessModal}
        onOk={closeSuccessModal}
        footer={null}
      >
        <Row style={{ alignItems: "center", marginBottom: 15 }}>
          <CheckCircleOutlined
            style={{
              color: "green",
              fontSize: "2em",
              display: "block",
              textAlign: "center",
              paddingRight: 10,
            }}
          />
          <Text level={4} strong style={{ fontSize: 20, fontWeight: "600" }}>
            Request Submitted
          </Text>
        </Row>

        <Paragraph>
          Your request will be processed within 1 - 2 business days. We will
          notify you via email once the document is processed. Thank you for
          your patience.
        </Paragraph>
        <div style={{ textAlign: "right" }}>
          <Button type="primary" onClick={closeSuccessModal}>
            Okay
          </Button>
        </div>
      </Modal>
      <Modal
        footer={null}
        title="Barangay Business Clearance Form"
        open={isBusinessFormModalVisible}
        onCancel={closeBusinessFormModal}
      >
        <Form
          onFinish={onFinishBusinessForm}
          onFinishFailed={(error) => console.log("Failed:", error)}
        >
          <Form.Item
            name="businessName"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Business Name" size="large" />
          </Form.Item>

          <Form.Item
            name="businessOwner"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Business Owner" size="large" />
          </Form.Item>

          <Form.Item
            name="location"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Location" size="large" />
          </Form.Item>

          <Form.Item
            name="ownerAddress"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Address of Owner" size="large" />
          </Form.Item>

          {/* Add more Form.Item components for each field in your form */}

          <Form.Item style={{ textAlign: "right" }}>
            <Button type="primary" htmlType="submit">
              Submit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Select Form to request"
        open={isModalVisible}
        width={1100}
        onCancel={handleCancel}
        footer={null}
      >
        <Card bordered={false}>
          <Row gutter={16}>
            {cards.map((card) => (
              <Col key={card.type} span={8}>
                <Card.Grid
                  style={{
                    width: "100%",
                    height: "450px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    {card.icon}
                    <Title level={4}>{card.title}</Title>
                    <Paragraph>{card.description}</Paragraph>
                  </div>
                  <Col>
                    <Paragraph>
                      <strong>Validity:</strong> {card.validity}
                    </Paragraph>
                    <Paragraph>
                      <strong>Cost:</strong> {card.cost}
                    </Paragraph>
                    <Button
                      onClick={() =>
                        card.type === "brgy-business-clearance"
                          ? showBusinessFormModal()
                          : handleOnRequest(card.type)
                      }
                      style={{ width: "100%", height: 40 }}
                      type="primary"
                    >
                      Request Now
                    </Button>
                  </Col>
                </Card.Grid>
              </Col>
            ))}
          </Row>
        </Card>
      </Modal>

      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        locale={{
          emptyText: (
            <div>
              <h2>Create your first request!</h2>
              <p>
                It seems like you haven't created any requests yet. Creating a
                request allows you to get the help you need quickly and
                efficiently.
              </p>
              <p>
                Click the button below to create your first request. You'll need
                to provide some details about what you need, so we can match you
                with the right resources.
              </p>
              <Button
                onClick={showModal}
                style={{
                  backgroundColor: "#003b7f",
                  height: 50,
                  borderRadius: 25,
                  fontSize: 15,
                  fontWeight: "bold",
                }}
                type="primary"
              >
                Create Request +
              </Button>
            </div>
          ),
        }}
      />
    </Col>
  );
}

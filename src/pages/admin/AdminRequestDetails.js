import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Descriptions,
  Breadcrumb,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useRequestsStore } from "../../stores/requestsStore";
import { useEffect, useState } from "react";
import { getUserData } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { usePageLoaderStore } from "../../stores/pageLoaderStore";
import { sendEmailStatus } from "../../services/email";

const { Text, Paragraph } = Typography;

function AdminRequestDetails() {
  const { id } = useParams();
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const { setPageLoading } = usePageLoaderStore();
  const request = useRequestsStore((state) =>
    state.requests.find((r) => r.id === id)
  );
  const [form] = Form.useForm();
  const { updateRequest } = useRequestsStore();
  const [user, setUser] = useState({
    fullname: "",
    birthdate: null,
    birthplace: "",
    startDateOfResidency: null,
    email: "",
  });
  const navigate = useNavigate();

  const fetchUser = async () => {
    const userData = await getUserData(request.userId);
    setUser(userData);
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request.userId]);

  const handleBreadcrumbClick = () => {
    navigate(-1);
  };

  const openSuccessModal = () => {
    setIsSuccessModalVisible(true);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalVisible(false);
    navigate(-1);
  };

  const showRejectModal = () => {
    setIsRejectModalVisible(true);
  };

  const closeRejectModal = () => {
    setIsRejectModalVisible(false);
  };

  function getFormName(type) {
    let formName;
    switch (type) {
      case "brgy-clearance":
        formName = "Barangay Clearance";
        break;
      case "brgy-conformance":
        formName = "Barangay Conformance";
        break;
      case "brgy-business-clearance":
        formName = "Barangay Business Clearance";
        break;
      default:
        break;
    }
    return formName;
  }

  const handleApprove = async () => {
    try {
      setPageLoading(true);
      const copyRequest = { ...request };
      copyRequest.status = "approved";
      await sendEmailStatus({
        email: user.email,
        name: user.fullname,
        status: "approved",
        formName: getFormName(request.type),
      });

      await updateRequest(copyRequest);
      openSuccessModal();
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleReject = async (values) => {
    try {
      setPageLoading(true);
      setIsRejectModalVisible(false);
      const copyRequest = { ...request };
      copyRequest.status = "rejected";
      await sendEmailStatus({
        email: user.email,
        name: user.fullname,
        status: "rejected",
        formName: getFormName(request.type),
        reason: values.reason,
      });

      await updateRequest(copyRequest);
      openSuccessModal();
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  return (
    <div style={{ height: "88vh", overflow: "auto", padding: 30 }}>
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
            Request Status Updated Successfully!
          </Text>
          <Paragraph style={{ marginTop: 10 }}>
            The user has been notified about the status update via email.
          </Paragraph>
        </Row>
        <div style={{ textAlign: "right" }}>
          <Button type="primary" onClick={closeSuccessModal}>
            Okay
          </Button>
        </div>
      </Modal>

      <Modal title="Reject Request" open={isRejectModalVisible} footer={null}>
        <Form form={form} onFinish={handleReject}>
          <Form.Item label="Reason" name="reason">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <div style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                Submit Reject
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Breadcrumb style={{ margin: "12px 0" }} onClick={handleBreadcrumbClick}>
        <Breadcrumb.Item>Request</Breadcrumb.Item>
        <Breadcrumb.Item>{id}</Breadcrumb.Item>
      </Breadcrumb>
      <Card style={{ maxWidth: 800, margin: "0 auto", padding: 10 }}>
        <h2>Request Details</h2>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Request ID">{request.id}</Descriptions.Item>
          <Descriptions.Item label="Form Type">
            {request.type}
          </Descriptions.Item>
          <Descriptions.Item label="Date Requested">
            {new Date(request.createdAt).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag
              color={
                request.status === "approved"
                  ? "green"
                  : request.status === "rejected"
                  ? "red"
                  : "grey"
              }
            >
              {request.status.toUpperCase()}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        {user && (
          <>
            <h2 style={{ marginTop: 24 }}>User Details</h2>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Full Name">
                {user.fullname}
              </Descriptions.Item>
              <Descriptions.Item label="Birthdate">
                {user.birthdate &&
                  new Date(user.birthdate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Birthplace">
                {user.birthplace}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date of Residency">
                {user.startDateOfResidency &&
                  new Date(user.startDateOfResidency).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            </Descriptions>
          </>
        )}
        {request.businessData && (
          <>
            <h2 style={{ marginTop: 24 }}>Business Details</h2>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Business Name">
                {request.businessData.businessName}
              </Descriptions.Item>
              <Descriptions.Item label="Business Owner">
                {request.businessData.businessOwner}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {request.businessData.location}
              </Descriptions.Item>
              <Descriptions.Item label="Owner Address">
                {request.businessData.ownerAddress}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}

        {request.status === "pending" && (
          <Row justify="end" style={{ marginTop: 24 }}>
            <Col>
              <Space>
                <Button
                  onClick={showRejectModal}
                  danger
                  style={{
                    height: 60,
                    width: 150,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  type="primary"
                  style={{
                    backgroundColor: "#003b7f",
                    height: 60,
                    width: 150,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Approve
                </Button>
              </Space>
            </Col>
          </Row>
        )}
      </Card>
    </div>
  );
}

export default AdminRequestDetails;

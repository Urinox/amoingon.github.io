import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Col,
  Row,
  Typography,
  Button,
  Form,
  Modal,
  Input,
  Descriptions,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useBusinessesStore } from "../../stores/businessesStore";
import { usePageLoaderStore } from "../../stores/pageLoaderStore";

const { Title, Text } = Typography;

const containerStyle = {
  width: "100%",
  height: "500px",
};

// amoingon coordinates
const center = {
  lat: 13.406151553640656,
  lng: 121.84764862060547,
};

const Businesses = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA7h5K_56tuHTBH7pP1bpE56yWWFWH4wzg",
  });
  const [form] = Form.useForm();

  // const [businesses, setBusinesses] = useState([]);
  const { businesses, fetchBusinesses, addNewBusiness, deleteBusiness } =
    useBusinessesStore();
  const [isBusinessFormModalVisible, setIsBusinessFormModalVisible] =
    useState(false);
  const [isMapSelectionVisible, setIsMapSelectionVisible] = useState(false);
  const [markerPosition, setMarkerPosition] = useState(center);
  const { setPageLoading } = usePageLoaderStore();
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isBusinessDetailsModalVisible, setIsBusinessDetailsModalVisible] =
    useState(false);

  const showBusinessFormModal = () => {
    setIsBusinessFormModalVisible(true);
  };

  const showDetails = (record) => {
    setSelectedBusiness(record);
    setIsBusinessDetailsModalVisible(true);
    if (marker) {
      marker.setPosition(record.coordinates);
    }
  };

  const handleDelete = async (id) => {
    try {
      setPageLoading(true);
      await deleteBusiness(id);
    } catch (error) {
      console.log("handleDelete error: ", error);
    } finally {
      setPageLoading(false);
    }
  };

  const columns = [
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
      sorter: (a, b) => a.businessName.localeCompare(b.businessName),
    },
    {
      title: "Business Owner Name",
      dataIndex: "businessOwner",
      key: "businessOwner",
      sorter: (a, b) => a.businessOwner.localeCompare(b.businessOwner),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => showDetails(record)}>View Details</Button>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <DeleteOutlined
          onClick={() => handleDelete(record.id)}
          style={{ color: "red", cursor: "pointer", fontSize: "20px" }}
        />
      ),
    },
  ];

  const closeBusinessFormModal = () => {
    form.resetFields();
    setMarkerPosition(center);
    setIsBusinessFormModalVisible(false);
  };

  const showMapSelection = () => {
    setIsMapSelectionVisible(true);
  };

  const closeMapSelection = () => {
    setIsMapSelectionVisible(false);
    form.setFieldsValue({
      coordinates: markerPosition,
      coordinatesString: `${markerPosition.lat}, ${markerPosition.lng}`,
    });
    if (marker) {
      setTimeout(() => {
        marker.setPosition(center);
        setMarkerPosition(center);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
    if (marker) {
      marker.setPosition({ lat, lng });
    }
  };

  const onFinishBusinessForm = async (values) => {
    try {
      setPageLoading(true);
      closeBusinessFormModal();
      const businessData = {
        businessName: values.businessName,
        businessOwner: values.businessOwner,
        location: values.location,
        ownerAddress: values.ownerAddress,
        coordinates: values.coordinates,
        businessDescription: values.businessDescription,
        contactNumber: values.contactNumber,
        email: values.email,
        link: values.link,
      };
      await addNewBusiness(businessData);
    } catch (error) {
      console.log("onFinishBusinessForm error: ", error);
    } finally {
      setPageLoading(false);
    }
  };

  const onLoad = useCallback(function callback(map) {
    const marker = new window.google.maps.Marker({
      position: center,
      map: map,
    });

    setMarker(marker);
    setMap(map);

    map.addListener("click", (event) => {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      marker.setPosition(newPosition); // Update marker position
    });
  }, []);

  const onLoadMapBusinessDetails = useCallback(function callback(
    map,
    coordinates
  ) {
    const marker = new window.google.maps.Marker({
      position: coordinates,
      map: map,
    });

    setMarker(marker);
    setMap(map);
  },
  []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
    setMarker(null);
  }, []);

  return (
    <Col style={{ padding: 20 }}>
      <Row
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title level={2}>Businesses</Title>

        <Button
          onClick={showBusinessFormModal}
          style={{
            backgroundColor: "#003b7f",
            height: 50,
            borderRadius: 25,
            fontSize: 15,
            fontWeight: "bold",
          }}
          type="primary"
        >
          Add Business +
        </Button>
      </Row>

      <Modal
        footer={null}
        title="New Business"
        open={isBusinessFormModalVisible}
        onCancel={closeBusinessFormModal}
        width={700}
      >
        <Form
          form={form}
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
            name="businessDescription"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Business Description" size="large" />
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

          <Form.Item
            name="contactNumber"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Contact Number" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
              {
                type: "email",
                message: "The input is not a valid email!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="link"
            rules={[
              {
                required: false,
                pattern: new RegExp(
                  "^(https?:\\/\\/)?" + // protocol
                    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name and extension
                    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                    "(\\:\\d+)?" + // port
                    "(\\/[-a-z\\d%_.~+]*)*" + // path
                    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                    "(\\#[-a-z\\d_]*)?$",
                  "i"
                ),
                message: "The input is not a valid URL!",
              },
            ]}
            style={{ marginTop: 10 }}
          >
            <Input placeholder="Link (Optional)" size="large" />
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
            name="coordinatesString"
            rules={[
              {
                required: true,
                message: "This field is required!",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Click to select coordinates"
              style={{ color: "gray" }}
              onClick={showMapSelection}
              readOnly
            />
          </Form.Item>

          <Form.Item name="coordinates" hidden>
            <input defaultValue="" />
          </Form.Item>

          {/* Add more Form.Item components for each field in your form */}

          <Form.Item style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                height: 50,
                borderRadius: 25,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Add New Business
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Select Location"
        open={isMapSelectionVisible}
        footer={null}
        onCancel={closeMapSelection}
        width={700}
      >
        <>
          <Text
            align="center"
            style={{ display: "block", marginTop: 5, marginBottom: 5 }}
          >
            (Click map to select a location)
          </Text>
          {isLoaded && (
            <GoogleMap
              id="map-selection"
              mapContainerStyle={containerStyle}
              center={center}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleClick}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          )}

          {markerPosition && (
            <Text align="center" style={{ display: "block", marginTop: 15 }}>
              Selected Coordinates: Lat {markerPosition.lat}, Lng{" "}
              {markerPosition.lng}
            </Text>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Button
              onClick={closeMapSelection}
              type="primary"
              htmlType="submit"
              style={{
                width: "50%",
                height: 50,
                borderRadius: 25,
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Select This coordinates
            </Button>
          </div>
        </>
      </Modal>

      <Table
        columns={columns}
        pagination={{ pageSize: 6 }}
        dataSource={businesses}
        rowKey="businessName"
      />

      <Modal
        title="Business Details"
        open={isBusinessDetailsModalVisible}
        onCancel={() => setIsBusinessDetailsModalVisible(false)}
        footer={null}
      >
        {selectedBusiness && (
          <div>
            <Descriptions
              title={selectedBusiness.businessName}
              layout="horizontal"
              column={1}
            >
              <Descriptions.Item label="Owner">
                {selectedBusiness.businessOwner}
              </Descriptions.Item>
              <Descriptions.Item label="Address">
                {selectedBusiness.ownerAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedBusiness.location}
              </Descriptions.Item>
              <Descriptions.Item label="Business Description">
                {selectedBusiness.businessDescription || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Number">
                {selectedBusiness.contactNumber || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedBusiness.email || "None"}
              </Descriptions.Item>
              <Descriptions.Item label="Link">
                {selectedBusiness.link || "None"}
              </Descriptions.Item>
            </Descriptions>
            {isLoaded && (
              <GoogleMap
                id="business-details-map"
                mapContainerStyle={containerStyle}
                center={selectedBusiness.coordinates}
                zoom={13}
                onLoad={(map) =>
                  onLoadMapBusinessDetails(map, selectedBusiness.coordinates)
                }
                options={{
                  disableDefaultUI: true,
                  zoomControl: false,
                  draggable: false,
                  scrollwheel: false,
                  disableDoubleClickZoom: true,
                }}
              >
                {selectedBusiness && (
                  <Marker position={selectedBusiness.coordinates} />
                )}
              </GoogleMap>
            )}
          </div>
        )}
      </Modal>
    </Col>
  );
};

export default Businesses;

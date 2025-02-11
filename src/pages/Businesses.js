import { useCallback, useEffect, useState } from "react";
import {
  List,
  Row,
  Col,
  Typography,
  Divider,
  Descriptions,
  Button,
  Spin,
} from "antd";
import { ShopOutlined } from "@ant-design/icons"; // Import the ShopOutlined icon
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useBusinessesStore } from "../stores/businessesStore";

const { Title, Paragraph } = Typography;

const defaultCoordinates = {
  lat: 13.406151553640656,
  lng: 121.84764862060547,
};

export default function Businesses() {
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const { businesses, fetchBusinesses } = useBusinessesStore();
  const [currentLocation, setCurrenLocation] = useState(defaultCoordinates);
  const [isInitLoading, setIsInitLoading] = useState(true);

  const [tabKey, setTabKey] = useState("directions");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyA7h5K_56tuHTBH7pP1bpE56yWWFWH4wzg",
  });

  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [directionsService, setDirectionService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  const initialFetch = useCallback(async () => {
    try {
      setIsInitLoading(true);
      await fetchBusinesses();
    } catch (error) {
      console.error("Error fetching businesses", error);
    } finally {
      setIsInitLoading(false);
    }
  }, [fetchBusinesses]);

  const onLoadMap = useCallback(function callback(map) {
    const marker = new window.google.maps.Marker({
      map: map,
    });

    const _directionsService = new window.google.maps.DirectionsService();
    const _directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });

    _directionsRenderer.setMap(map);
    setDirectionsRenderer(_directionsRenderer);
    setDirectionService(_directionsService);
    setMarker(marker);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
    setMarker(null);
    setDirectionService(null);
    setDirectionsRenderer(null);
  }, []);

  const handleBusinessClick = (business) => {
    if (!business) return;
    setSelectedBusiness(business);
    if (!directionsService && !marker && !directionsRenderer) return;
    console.log(currentLocation, business.coordinates, "currentLocation");
    marker.setPosition(business.coordinates);
    directionsService.route(
      {
        origin: currentLocation,
        destination: business.coordinates,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error(`Error fetching directions ${result}`);
        }
      }
    );
  };

  useEffect(() => {
    if (businesses.length > 0) {
      setSelectedBusiness(businesses[0]);
      handleBusinessClick(selectedBusiness);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses, directionsService]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position, "position");
          setCurrenLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error(`Error getting location ${error}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    initialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (key) => {
    setTabKey(key);
    if (key === "directions") {
      setTimeout(() => {
        handleBusinessClick(selectedBusiness);
      }, 100);
    }
  };

  if (isInitLoading && businesses.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip={"Loading Businesses"} />
      </div>
    );
  }

  return (
    <div style={{ padding: 10 }}>
      <Row gutter={16}>
        <Col
          span={14}
          style={{ borderRight: "2px solid #f0f0f0", padding: 20 }}
        >
          {selectedBusiness && (
            <div>
              <Title level={2} style={{ margin: "10px 0px" }}>
                Find Businesses
              </Title>
              <Paragraph>
                Discover and explore businesses located right in your barangay
                area. Our directory includes a wide range of businesses to
                ensure you can find exactly what you're looking for.
              </Paragraph>
              <Divider style={{ marginBottom: 0 }} />
              <Row
                style={{
                  display: "flex",
                  height: 70,
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  margin: 0,
                }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {selectedBusiness.businessName}
                </Title>
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    type={tabKey === "directions" ? "primary" : "default"}
                    onClick={() => handleTabChange("directions")}
                  >
                    Directions
                  </Button>
                  <Button
                    type={tabKey === "full-details" ? "primary" : "default"}
                    onClick={() => handleTabChange("full-details")}
                  >
                    Full Details
                  </Button>
                </div>
              </Row>

              <>
                {isLoaded && tabKey === "directions" && (
                  <GoogleMap
                    id="map-info"
                    onLoad={onLoadMap}
                    onUnmount={onUnmount}
                    mapContainerStyle={{ width: "100%", height: "55vh" }}
                    center={selectedBusiness.coordinates}
                    zoom={13}
                  ></GoogleMap>
                )}
              </>

              {tabKey === "full-details" && !!selectedBusiness && (
                <div style={{ position: "absolute", zIndex: 1 }}>
                  <Descriptions title="Business Details" column={1}>
                    <Descriptions.Item label="Business Name">
                      {selectedBusiness.businessName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Business Description">
                      {selectedBusiness.businessDescription || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Business Owner">
                      {selectedBusiness.businessOwner}
                    </Descriptions.Item>
                    <Descriptions.Item label="Owner Address">
                      {selectedBusiness.ownerAddress}
                    </Descriptions.Item>
                    <Descriptions.Item label="Location">
                      {selectedBusiness.location || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Contact Number">
                      {selectedBusiness.contactNumber || "N/A"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {selectedBusiness.email || "N/A"}
                    </Descriptions.Item>
                    {selectedBusiness.link && (
                      <Descriptions.Item label="Link">
                        <a
                          href={selectedBusiness.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedBusiness.link}
                        </a>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </div>
              )}
            </div>
          )}
        </Col>
        <Col span={10}>
          <div style={{ overflow: "auto", height: "86vh" }}>
            <List
              itemLayout="horizontal"
              dataSource={businesses}
              style={{ padding: 10, paddingRight: 20 }}
              renderItem={(business) => (
                <List.Item
                  onClick={() => handleBusinessClick(business)}
                  actions={[
                    <ShopOutlined
                      style={{
                        fontSize: "30px",
                        color: "#003b7f",
                        paddingRight: 5,
                      }}
                    />,
                  ]}
                  style={
                    business === selectedBusiness
                      ? { backgroundColor: "#ffffe0" }
                      : {}
                  }
                >
                  <List.Item.Meta
                    style={{ padding: 10 }}
                    title={
                      <Title level={5} style={{ margin: 0 }}>
                        {business.businessName}
                      </Title>
                    }
                    description={business.location}
                  />
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

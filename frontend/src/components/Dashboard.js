import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipments, createShipment } from '../redux/actions';
import {
  Container,
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  Modal,
  Spinner,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import {
  FaShippingFast,
  FaPlus,
  FaMapMarkedAlt,
  FaSatelliteDish,
  FaClock
} from 'react-icons/fa';
import ShipmentMap from './ShipmentMap';
import TrackShipment from './TrackShipment';
import useShipmentETAs from '../hooks/useShipmentETAs';

const Dashboard = () => {
  const dispatch = useDispatch();
  const shipments = useSelector((state) => state.shipment.shipments);

  const [showModal, setShowModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [trackingShipmentId, setTrackingShipmentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [containerFilter, setContainerFilter] = useState('');

  const [form, setForm] = useState({
    shipmentId: '',
    containerId: '',
    route: '',
    currentLocation: '',
  });

  const { etaMap, loading: loadingEta } = useShipmentETAs(shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  const handleClose = () => {
    setShowModal(false);
    setForm({
      shipmentId: '',
      containerId: '',
      route: '',
      currentLocation: '',
    });
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    const coords = form.route
      .split(',')
      .map((v) => parseFloat(v.trim()))
      .reduce((acc, val, i, arr) => {
        if (i % 2 === 0) acc.push(`${val},${arr[i + 1]}`);
        return acc;
      }, []);

    const payload = {
      shipmentId: form.shipmentId,
      containerId: form.containerId,
      route: coords,
      currentLocation: form.currentLocation.trim(),
      status: 'In Transit',
    };

    dispatch(createShipment(payload));
    handleClose();
  };

  const handleUseMyLocation = () => {
  if (!navigator.geolocation) return alert('Geolocation not supported');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const coords = `${pos.coords.latitude.toFixed(6)},${pos.coords.longitude.toFixed(6)}`;
      setForm({ ...form, currentLocation: coords });
    },
    () => alert('Unable to access your location')
  );
};


  return (
    <Container className="my-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h3 className="mb-3">
            <FaShippingFast className="me-2" />
            Shipment Dashboard
          </h3>
          <Button variant="primary" onClick={handleShow}>
            <FaPlus className="me-2" />
            Add New Shipment
          </Button>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <h4 className="mb-3">All Shipments</h4>

          <Form className="mb-4">
  <Row className="gy-2 gx-3 align-items-center">
    <Col xs={12} md={4}>
      <Form.Label className="mb-0">Shipment ID</Form.Label>
      <Form.Control
        type="text"
        placeholder="Search by Shipment ID..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </Col>
    <Col xs={12} md={4}>
      <Form.Label className="mb-0">Container ID</Form.Label>
      <Form.Control
        type="text"
        placeholder="Search by Container ID..."
        value={containerFilter}
        onChange={(e) => setContainerFilter(e.target.value)}
      />
    </Col>
    <Col xs={12} md={4}>
      <Form.Label className="mb-0">Status</Form.Label>
      <Form.Select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All</option>
        <option value="In Transit">In Transit</option>
        <option value="Delivered">Delivered</option>
      </Form.Select>
    </Col>
  </Row>
</Form>

          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Shipment ID</th>
                <th>Container ID</th>
                <th>Current Location</th>
                <th>Status</th>
                <th><FaClock /> ETA</th>
                <th>Map</th>
                <th>Track</th>
              </tr>
            </thead>
            <tbody>
              {shipments.filter((s) =>
                s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) &&
                s.containerId.toLowerCase().includes(containerFilter.toLowerCase()) &&
                (statusFilter === '' || s.status === statusFilter)
              ).length > 0 ? (
                shipments.filter((s) =>
                  s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) &&
                  s.containerId.toLowerCase().includes(containerFilter.toLowerCase()) &&
                  (statusFilter === '' || s.status === statusFilter)
                ).map((s) => (
                  <tr key={s._id}>
                    <td>{s.shipmentId}</td>
                    <td>{s.containerId}</td>
                    <td>{s.currentLocation || 'Not updated'}</td>
                    <td>
                      <span className={`badge ${
                        s.status === 'Delivered'
                          ? 'bg-success'
                          : 'bg-warning text-dark'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Estimated Time of Arrival</Tooltip>}
                    >
                      <td>
                        {loadingEta ? (
                          <Spinner size="sm" animation="border" />
                        ) : etaMap[s._id] ? (
                          new Date(etaMap[s._id]).toLocaleString()
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </OverlayTrigger>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => setSelectedShipment(s)}
                      >
                        <FaMapMarkedAlt />
                      </Button>
                    </td>
                    <td>
                      {trackingShipmentId === s._id ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setTrackingShipmentId(null)}
                        >
                          Stop
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => setTrackingShipmentId(s._id)}
                        >
                          <FaSatelliteDish />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    {searchQuery ? 'No matching shipments found.' : 'No shipments found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {selectedShipment && (
        <Card className="mt-4 shadow-sm">
          <Card.Body>
            <h5>Map View - {selectedShipment.shipmentId}</h5>
            <div style={{ height: '400px' }}>
              <ShipmentMap shipment={selectedShipment} />
            </div>
            <Button className="mt-2" variant="secondary" onClick={() => setSelectedShipment(null)}>
              Close Map
            </Button>
          </Card.Body>
        </Card>
      )}

      {trackingShipmentId && (
        <Card className="mt-4 shadow-sm">
          <Card.Body>
            <h5>Live Tracking</h5>
            <div style={{ height: '400px' }}>
              <TrackShipment shipmentId={trackingShipmentId} />
            </div>
          </Card.Body>
        </Card>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Shipment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Shipment ID</Form.Label>
              <Form.Control
                value={form.shipmentId}
                onChange={(e) => setForm({ ...form, shipmentId: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Container ID</Form.Label>
              <Form.Control
                value={form.containerId}
                onChange={(e) => setForm({ ...form, containerId: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Route (comma-separated lat,lng)</Form.Label>
              <Form.Control
                value={form.route}
                onChange={(e) => setForm({ ...form, route: e.target.value })}
                required
                placeholder="e.g. 28.6139,77.2090, 27.1767,78.0081"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Current Location (lat,lng)</Form.Label>
              <Row>
                <Col xs={8}>
                  <Form.Control
                    value={form.currentLocation}
                    onChange={(e) =>
                      setForm({ ...form, currentLocation: e.target.value })
                    }
                    required
                    placeholder="e.g. 28.6139,77.2090"
                  />
                </Col>
                <Col>
                  <Button variant="outline-primary" onClick={handleUseMyLocation}>
                    Use My Location
                  </Button>
                </Col>
              </Row>
            </Form.Group>

            <div className="d-grid">
              <Button variant="success" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Dashboard;

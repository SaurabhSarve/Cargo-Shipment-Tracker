import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const parseCoord = (coordStr) => {
  if (!coordStr) return null;
  const parts = coordStr.split(',').map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) return null;
  return [parts[0], parts[1]];
};

const ShipmentMap = ({ shipment }) => {
  if (!shipment) return <p>No shipment selected.</p>;

  const routeCoords = Array.isArray(shipment.route)
    ? shipment.route.map(parseCoord).filter(Boolean)
    : [];

  const currentCoord = parseCoord(shipment.currentLocation);

  const mapCenter = currentCoord || routeCoords[0] || [20.5937, 78.9629]; // Default to India

  return (
    <MapContainer center={mapCenter} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {currentCoord && (
        <Marker position={currentCoord}>
          <Popup>
            Current Location<br />
            {currentCoord.join(', ')}
          </Popup>
        </Marker>
      )}

      {routeCoords.length > 1 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
};

export default ShipmentMap;



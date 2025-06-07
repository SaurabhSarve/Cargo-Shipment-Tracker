import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';

const TrackShipment = ({ shipmentId }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!shipmentId) return;

    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        const newLoc = `${lat},${lng}`;
        setLocation([lat, lng]);

        // Send location to backend
        await axios.post(`http://localhost:5000/api/shipment/${shipmentId}/update-location`, {
          currentLocation: newLoc,
        });
      },
      (error) => {
        console.error('Location error:', error);
        alert('Unable to track location. Please allow location permission.');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [shipmentId]);

  if (!location) return <p>Tracking in progress...</p>;

  return (
    <MapContainer center={location} zoom={14} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={location}>
        <Popup>Live Location: {location.join(', ')}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default TrackShipment;

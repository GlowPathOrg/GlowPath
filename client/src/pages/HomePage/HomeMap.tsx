import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/HomeMap.css'; // Add custom styles if needed
import { usePosition } from '../../hooks/usePosition'; // Custom hook for live location
import L from "leaflet";
import SosButton from "../journeyPage/SosButton"
const HomeMap: React.FC = () => {
  const { latitude, longitude, error: geolocationError } = usePosition(); // Get user's live location
  const [currentPosition, setCurrentPosition] = useState<LatLngExpression | null>(null);

  // Update the map position whenever the user's location changes
  useEffect(() => {
    if (latitude && longitude) {
      setCurrentPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  return (
    <div className="live-location-map">
      {currentPosition ? (
        <MapContainer
          center={currentPosition}
          zoom={15}
          scrollWheelZoom={false}
          style={{ height: '85vh', width: '100%' }}
        >
              <SosButton/>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentPosition}
          icon={L.icon({
            iconUrl: "https://img.icons8.com/?size=100&id=ziC1TV1ikKi9&format=png&color=FFFFFF",
            iconSize: [35, 35],
            iconAnchor: [15, 15],
          })}>
            <Popup>You are here!</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>{geolocationError || 'Loading your location...'}</p>
      )}
    </div>
  );
};

export default HomeMap;
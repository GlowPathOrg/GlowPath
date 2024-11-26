import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
  const [searchParams] = useSearchParams(); // query parameters
  const [position, setPosition] = useState<LatLngTuple>([52.4771, 13.4310]); // this is the default location
  const [address, setAddress] = useState<string>('Default Location'); // address on the popup

  useEffect(() => {
    const lat = parseFloat(searchParams.get('lat') || '52.4771'); 
    const lon = parseFloat(searchParams.get('lon') || '13.4310'); 
    const addr = searchParams.get('address') || 'Default Location'; 

    // Update map position and address
    setPosition([lat, lon]);
    setAddress(addr);
  }, [searchParams]);



  const mapStyle = { height: '80vh', width: '90vw' };

  return (
    <div className="map-component">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={mapStyle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {address} <br />
            Coordinates: {position[0].toFixed(4)}, {position[1].toFixed(4)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
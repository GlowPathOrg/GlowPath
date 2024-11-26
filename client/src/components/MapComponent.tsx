import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent: React.FC = () => {
  const [searchParams] = useSearchParams(); // query parameters that have been genegrated in the search input in whereto page 
  const [position, setPosition] = useState<LatLngTuple>([52.4771, 13.4310]); // default location
  const [address, setAddress] = useState<string>('Default Location'); // address on the popup
  const [theme, setTheme] = useState<string>('standard'); // default theme

  // map themes
  const themes: { [key: string]: string } = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

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
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="theme-select" style={{ marginRight: '10px' }}>Select Map Theme:</label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="standard">Standard</option>
          <option value="dark">Dark</option>
          <option value="satellite">Satellite</option>
        </select>
      </div>

      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={mapStyle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={themes[theme]} // dynamic URL based on selected theme
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
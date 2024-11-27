import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet';
import { latLng, LatLng, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchRoute } from '../services/RoutingService';
import { decode } from '@here/flexpolyline';
import '../styles/MapComponent.css';

const MapComponent: React.FC = () => {
  const [searchParams] = useSearchParams(); // Extract query parameters from the URL

  // State variables
  const [origin, setOrigin] = useState<LatLng>(latLng(52.4771, 13.4310)); // Default origin location
  const [destination, setDestination] = useState<LatLng | null>(null); // Destination location
  const [address, setAddress] = useState<string>('Default Location'); // Address to display in the destination marker
  const [theme, setTheme] = useState<string>('standard'); // Map theme (standard, dark, satellite)
  const [route, setRoute] = useState<LatLngTuple[]>([]); // Decoded route polyline
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle'>('pedestrian'); // Transport mode

  // Map themes
  const themes = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', // Standard theme
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', // Dark theme
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // Satellite theme
  };

  // Parse query parameters to set origin, destination, and address
  useEffect(() => {
    const lat = parseFloat(searchParams.get('destinationLat') || '52.4771'); // Latitude of the destination
    const lon = parseFloat(searchParams.get('destinationLon') || '13.4310'); // Longitude of the destination
    const addr = searchParams.get('address') || 'Default Location'; // Destination address

    console.log('Destination Coordinates:', { lat, lon, addr });

    // Set origin, destination, and address state variables
    setOrigin(latLng(52.4771, 13.4310)); // Static origin (e.g., Berlin)
    setDestination(latLng(lat, lon)); // Dynamic destination
    setAddress(addr); // Address to display in the popup
  }, [searchParams]);

  // Fetch and decode the route whenever destination or transport mode changes
  useEffect(() => {
    const fetchRouteData = async () => {
      if (!destination) return; // No destination, skip fetching

      try {
        // Fetch route data from the RoutingService
        const { polyline } = await fetchRoute(
          [origin.lat, origin.lng], // Origin coordinates
          [destination.lat, destination.lng], // Destination coordinates
          transportMode // Selected transport mode
        );

        console.log('Polyline response:', polyline);

        // Decode the polyline into coordinates
        const decoded = decode(polyline);
        console.log('Decoded result:', decoded);

        // Check if the decoded polyline is valid and set the route
        if (decoded && Array.isArray(decoded.polyline)) {
          const routeCoordinates = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple);
          setRoute(routeCoordinates); // Update state with decoded route
        } else {
          console.error('Decoded polyline is not a valid array:', decoded);
        }
      } catch (error) {
        console.error('Error fetching route:', error); // Log any errors
      }
    };

    fetchRouteData(); // Trigger route fetching
  }, [origin, destination, transportMode]); // Dependencies for re-fetching the route

  // Component to adjust the map bounds to fit both origin and destination
  const FitBounds: React.FC<{ origin: LatLng; destination: LatLng | null }> = ({ origin, destination }) => {
    const map = useMap(); // Access the Leaflet map instance

    useEffect(() => {
      if (destination) {
        const bounds = [origin, destination]; // Create bounds for the map
        map.fitBounds(bounds, { padding: [50, 50] }); // Adjust map to fit the bounds
      }
    }, [origin, destination, map]);

    return null; // No rendering needed
  };

  const mapStyle = { height: '80vh', width: '90vw' }; // Map container styling

  return (
    <div className="map-component">
      {/* Transport Mode Selector */}
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="transport-mode" style={{ marginRight: '10px' }}>
          Select Transport Mode:
        </label>
        <select
          id="transport-mode"
          value={transportMode}
          onChange={(e) => setTransportMode(e.target.value as typeof transportMode)}
          style={{ padding: '5px', marginRight: '15px' }}
        >
          <option value="pedestrian">Walking</option>
          <option value="publicTransport">Public Transport</option>
          <option value="bicycle">Bicycle</option>
        </select>

        {/* Map Theme Selector */}
        <label htmlFor="theme-select" style={{ marginRight: '10px' }}>
          Select Map Theme:
        </label>
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

      {/* Map Container */}
      <MapContainer center={origin} zoom={13} scrollWheelZoom={false} style={mapStyle}>
        {/* Tile Layer */}
        <TileLayer attribution='&copy; OpenStreetMap contributors' url={themes[theme]} />
        {/* Adjust map view */}
        <FitBounds origin={origin} destination={destination} />
        {/* Origin Marker */}
        <Marker position={origin}>
          <Popup>Origin</Popup>
        </Marker>
        {/* Destination Marker */}
        {destination && (
          <Marker position={destination}>
            <Popup>
              {address} <br />
              Coordinates: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
        {/* Polyline for the route */}
        {route.length > 0 && <Polyline positions={route} pathOptions={{ className: 'glowing-polyline' }} />}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
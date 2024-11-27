import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook 
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet'; 
import { latLng, LatLng, LatLngTuple } from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; //this is default style
import { fetchRoute } from '../services/RoutingService'; // Custom service for fetching routes
import { decode } from '@here/flexpolyline'; // Polyline decoding function from npm 
import '../styles/MapComponent.css';

const MapComponent: React.FC = () => {
  const [searchParams] = useSearchParams(); // Access query parameters from the whereToPage url
  const [origin, setOrigin] = useState<LatLng | null>(null); // Origin state
  const [destination, setDestination] = useState<LatLng | null>(null); // Destination state
  const [address, setAddress] = useState<string>('Destination'); // Destination address for popup
  const [theme, setTheme] = useState<string>('standard'); // Map theme state
  const [route, setRoute] = useState<LatLngTuple[]>([]); // Route polyline state
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle'>('pedestrian'); // Transport mode state

  const mapStyle = { height: '80vh', width: '90vw' }; 

  // map themes with corresponding tile URLs
  const themes = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
  };

  // Parse query parameters and set states accordingly
  useEffect(() => {
    const originLat = parseFloat(searchParams.get('originLat') || '52.4771'); // Default origin latitude
    const originLon = parseFloat(searchParams.get('originLon') || '13.4310'); // Default origin longitude
    const destinationLat = parseFloat(searchParams.get('destinationLat') || '52.4771'); // Default destination latitude
    const destinationLon = parseFloat(searchParams.get('destinationLon') || '13.4310'); // Default destination longitude
    const addr = searchParams.get('address') || 'Destination'; // Destination address
    const mode = searchParams.get('transportMode') as typeof transportMode; // Transport mode from query parameters
    const themeParam = searchParams.get('theme') || 'standard'; // Map theme from query parameters

    setOrigin(latLng(originLat, originLon)); // Set origin
    setDestination(latLng(destinationLat, destinationLon)); // Set destination
    setAddress(addr); // Set address
    setTransportMode(mode || 'pedestrian'); // Set transport mode
    setTheme(themeParam || 'standard'); // Set theme
  }, [searchParams]);

  // Fetch route data whenever origin, destination, or transport mode changes
  useEffect(() => {
    const fetchRouteData = async () => {
      if (!origin || !destination) return; // ignore if origin or destination is missing

      try {
        // Fetch route data from the RoutingService
        const { polyline } = await fetchRoute(
          [origin.lat, origin.lng], // Origin coordinates
          [destination.lat, destination.lng], // Destination coordinates
          transportMode // Transport mode
        );

        // Decode the polyline into coordinates
        const decoded = decode(polyline);
        if (decoded && Array.isArray(decoded.polyline)) {
          const routeCoordinates = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple); // Map coordinates
          
          // Log the route coordinates for you Mellissa 
        console.log('Decoded Route Coordinates:', routeCoordinates);

          setRoute(routeCoordinates); // Update route state
        } else {
          console.error('Decoded polyline is not a valid array:', decoded); 
        }
      } catch (error) {
        console.error('Error fetching route:', error); 
      }
    };

    fetchRouteData();
  }, [origin, destination, transportMode]);

  // adjust map view to fit both origin and destination markers
  const FitBounds: React.FC<{ origin: LatLng; destination: LatLng | null }> = ({ origin, destination }) => {
    const map = useMap(); // useMap from leaflet

    useEffect(() => {
      if (origin && destination) {
        const bounds = [origin, destination]; // Create bounds for the map view
        map.fitBounds(bounds, { padding: [50, 50] }); // Adjust map to fit bounds
      }
    }, [origin, destination, map]);

    return null; 
  };

  return (
    <div className="map-component">
      {/* Map Container */}
      <MapContainer center={origin || latLng(52.4771, 13.4310)} zoom={13} scrollWheelZoom={false} style={mapStyle}>
        <TileLayer attribution='&copy; OpenStreetMap contributors' url={themes[theme]} /> 
        {origin && destination && <FitBounds origin={origin} destination={destination} />} 
        {origin && (
          <Marker position={origin}> 
            <Popup>Your Location</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination}> 
            <Popup>
              {address} <br />
              Coordinates: {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}
        {route.length > 0 && <Polyline positions={route} pathOptions={{ className: 'glowing-polyline' }} />} {/* Route polyline */}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
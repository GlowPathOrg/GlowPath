import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom'; // Hook for accessing query parameters
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet'; 
import { latLng, LatLng, LatLngTuple } from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; // Default Leaflet styling
import { fetchRoute } from '../services/RoutingService'; // Service for fetching routes
import { decode } from '@here/flexpolyline'; // Polyline decoding function from npm 
import '../styles/MapComponent.css'; // Custom styling
import { Amenity, fetchAmenities } from '../services/amenitiesService'; // Fetch amenities service
import { usePosition } from '../hooks/usePosition'; // Custom hook for user geolocation

const MapComponent: React.FC = () => {
  const [searchParams] = useSearchParams(); // Access query parameters from URL
  const { latitude, longitude, error: geolocationError } = usePosition(); // User's current geolocation
  const [origin, setOrigin] = useState<LatLng | null>(null); // Origin state
  const [destination, setDestination] = useState<LatLng | null>(null); // Destination state
  const [address, setAddress] = useState<string>('Destination'); // Destination address for popup
  const [theme, setTheme] = useState<string>('standard'); // Map theme state
  const [route, setRoute] = useState<LatLngTuple[]>([]); // Route polyline state
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle'>('pedestrian'); // Transport mode state
  const [amenities, setAmenities] = useState<Amenity[]>([]); // Amenities state

  const mapStyle = { height: '80vh', width: '90vw' }; // Map container style

  // Map themes with corresponding tile URLs
  const themes: Record<'standard' | 'dark' | 'satellite', string> = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  // Parse query parameters and set states accordingly
  useEffect(() => {
    const originLat = parseFloat(searchParams.get('originLat') || latitude?.toString() || '52.4771'); // Default to user's latitude or Berlin
    const originLon = parseFloat(searchParams.get('originLon') || longitude?.toString() || '13.4310'); // Default to user's longitude or Berlin
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
  }, [searchParams, latitude, longitude]);

  // Fetch route data whenever origin, destination, or transport mode changes
  useEffect(() => {
    const fetchRouteData = async () => {
      if (!origin || !destination) return; // Ignore if origin or destination is missing

      try {
        const { polyline } = await fetchRoute(
          [origin.lat, origin.lng], // Origin coordinates
          [destination.lat, destination.lng], // Destination coordinates
          transportMode // Transport mode
        );

        // Decode the polyline into coordinates
        const decoded = decode(polyline);
        if (decoded && Array.isArray(decoded.polyline)) {
          const routeCoordinates = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple); // Map coordinates
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

  // Fetch nearby amenities
  useEffect(() => {
    const fetchData = async () => {
      if (!origin) return; // Ensure origin is defined
      try {
        const data = await fetchAmenities(500, { lat: origin.lat, lon: origin.lng }); // Pass origin coordinates
        if (data && Array.isArray(data)) {
          setAmenities(data); // Update amenities state
        } else {
          throw new Error('Invalid response received or no amenities found.');
        }
      } catch (error) {
        console.error('Error fetching amenities:', error);
      }
    };

    fetchData();
  }, [origin]);

  // Adjust map view to fit both origin and destination markers
  const FitBounds: React.FC<{ origin: LatLng; destination: LatLng | null }> = ({ origin, destination }) => {
    const map = useMap(); // useMap from Leaflet

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
        {amenities.map((amenity: Amenity, index: number) => {
          const { lat, lon, tags } = amenity;
          const name = tags.name || 'Unnamed Amenity';
          return (
            <Marker key={index} position={latLng(lat, lon)}>
              <Popup>
                {name} <br />
                {tags.public_transport || ''} <br />
                {tags.lit ? 'Lit space' : ''}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {geolocationError && <p style={{ color: 'red' }}>Geolocation Error: {geolocationError}</p>}
    </div>
  );
};

export default MapComponent;
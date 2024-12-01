import  { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom'; // Hook for accessing query parameters
import { MapContainer, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet';
import { latLng, LatLng, LatLngTuple,latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Default Leaflet styling
import { fetchRoute } from '../services/RoutingService'; // Service for fetching routes
import { decode } from '@here/flexpolyline'; // Polyline decoding function from npm
import '../styles/MapComponent.css'; // Custom styling
import { Amenity, fetchAmenities } from '../services/amenitiesService'; // Fetch amenities service


//this is added to define the types of the props
//I added this after removing usePosition to the JourneyPage
interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  geolocationError: string | null;
}


const MapComponent: React.FC<MapComponentProps> = ({ latitude, longitude, geolocationError }) => {
  const [searchParams] = useSearchParams(); // Access query parameters from URL
  const [origin, setOrigin] = useState<LatLng | null>(null); // Origin state
  const [destination, setDestination] = useState<LatLng | null>(null); // Destination state
  const [address, setAddress] = useState<string>('Destination'); // Destination address for popup
  const [theme, setTheme] = useState<string>('standard'); // Map theme state
  const [route, setRoute] = useState<LatLngTuple[]>([]); // Route polyline state
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle'>('pedestrian'); // Transport mode state
  const [amenities, setAmenities] = useState<Amenity[]>([]); // Amenities state
  const [instructions, setInstructions] = useState<any[]>([]); // Array to store turn-by-turn instructions
  const [summary, setSummary] = useState<{ distance: number; duration: number } | null>(null); // Summary state
  const mapStyle = { height: '80vh', width: '90vw' }; // Map container style

  // Map themes with corresponding tile URLs
  const themes: {[key: string]: string} = {
    standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  };

  // Action type to icon mapping for better instruction representation
  const actionIcons: Record<string, string> = {
    depart: '🏁', // Departure flag
    arrive: '🏁', // Arrival flag
    left: '⬅️', // Left arrow
    right: '➡️', // Right arrow
    straight: '⬆️', // Straight arrow
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
      if (!origin || !destination) return;

      try {
        const { polyline, instructions, summary } = await fetchRoute(
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
          transportMode
        );

        //this for you guys to check the data
        console.log('API Route Response:', { polyline, instructions, summary });

        const decoded = decode(polyline);
        if (decoded && Array.isArray(decoded.polyline)) {
          const routeCoordinates = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple);
          setRoute(routeCoordinates);
        }

        //these for you to check the data
        console.log('Instructions Data:', instructions);
        console.log('Route Summary:', summary);
        setInstructions(instructions); // Store instructions
        setSummary({ distance: summary.length, duration: summary.duration }); // Set the summary state
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
        const bounds = latLngBounds([origin, destination]);// Create bounds for the map view
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
          <Marker position={origin} >
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
        {instructions.map((instruction, index) => {
          const {instruction: text, action, length } = instruction; // Geometry and action for the step
          const icon = actionIcons[action] || '➡️'; // Fallback to generic arrow
          return (
            <li key={index}>
              <strong>{icon} {action}:</strong> {text} <br />
              <em>Distance: {length || 0} m</em>
            </li>
          );
        })}
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

       {/*  summary */}
       <div className="summary">
  <h3>Route Summary</h3>
  {summary ? (
    <div>
      <p><strong>Distance:</strong> {summary.distance / 1000} km</p>
      <p><strong>Duration:</strong> {Math.ceil(summary.duration / 60)} minutes</p>
    </div>
  ) : (
    <p>Loading route summary...</p>
  )}
</div>

     {/*  instruction part */}
     <div className="instructions">
  <h3>Turn-by-Turn Instructions</h3>
  <ul>
    {instructions.map((instruction, index) => {
      const { instruction: text, action, length, duration, geometry } = instruction;
      const icon = actionIcons[action] || '➡️'; // Fallback to generic arrow

      return (
        <li key={index}>
          <strong>{icon} {action}:</strong> {text} <br />
          <em>Distance: {length || 'Unknown'} m</em><br />
          <em>Duration: {duration ? `${Math.ceil(duration / 60)} min` : 'Unknown'}</em>
          {geometry && geometry.length > 0 && (
            <Polyline
              positions={geometry.map(([lat, lon]: [number, number]) => [lat, lon] as LatLngTuple)}
              pathOptions={{
                color: index === 0 ? 'red' : 'blue', // Highlight current or upcoming segment
                weight: 5,
                opacity: 0.8,
              }}
            />
          )}
        </li>
      );
    })}
  </ul>
</div>

    </div>
  );
};

export default MapComponent;

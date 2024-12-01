import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { geocodeAddress } from '../services/geocodingService';
import { fetchRoute } from '../services/RoutingService'; // Import fetchRoute service
import { usePosition } from '../hooks/usePosition';
import { LatLngTuple, latLng } from 'leaflet'; // Import LatLngTuple and latLng from Leaflet
import { decode } from '@here/flexpolyline'; // Polyline decoding function from npm
import MapComponent from '../components/MapComponent/MapComponent';
import { InstructionsI } from '../Types/Route';

const WhereToPage: React.FC = () => {
  const navigate = useNavigate();
  const { latitude, longitude, error: geoError } = usePosition();
  const [originCoords, setOriginCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [route, setRoute] = useState<LatLngTuple[]>([]); // Route coordinates
  const [summary, setSummary] = useState<{ distance: number; duration: number } | null>(null);
  const [instructions, setInstructions] = useState<InstructionsI[]>([]);
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle'>('pedestrian');
  const [mapTheme, setMapTheme] = useState<string>('standard');
  const [error, setError] = useState<string | null>(null);

  // Update origin coordinates when geolocation updates
  useEffect(() => {
    if (latitude && longitude) {
      setOriginCoords({ lat: latitude, lon: longitude });
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!originCoords) {
      setError('Unable to fetch your current location. Please try again.');
      return;
    }

    try {
      // Geocode the destination
      const destinationCoords = await geocodeAddress(destination);

      // Fetch the route using the same logic as MapComponent
      const routeResponse = await fetchRoute(
        [originCoords.lat, originCoords.lon],
        [destinationCoords.lat, destinationCoords.lon],
        transportMode
      );

      const { polyline, instructions: routeInstructions, summary: routeSummary } = routeResponse;

      const decoded = decode(polyline);
      let routeCoordinates: LatLngTuple[] = []; // Initialize routeCoordinates

      if (decoded && Array.isArray(decoded.polyline)) {
        routeCoordinates = decoded.polyline.map(
          ([lat, lon]) => [lat, lon] as LatLngTuple
        );
        setRoute(routeCoordinates);
      }

      setSummary({ distance: routeSummary.length, duration: routeSummary.duration });
      setInstructions(routeInstructions);


      // Navigate to the JourneyPage with data passed as state
      navigate('/journey', {
        state: {
          originCoords: latLng(originCoords.lat, originCoords.lon), // Fixed latLng import
          destinationCoords: latLng(destinationCoords.lat, destinationCoords.lon), // Fixed latLng import
          route: routeCoordinates,
          summary: { distance: routeSummary.length, duration: routeSummary.duration },
          instructions: routeInstructions,
          theme: mapTheme,
        },
      });
    } catch (err) {
      console.error('Error during geocoding or fetching route:', err);
      setError('Failed to find the location or route. Please try again.');
    }
  };

  return (
   <>
      <div className="where-to-page">
        <h1>Where to?</h1>

        {/* Current Location */}
        <div>
          <p>
            <strong>Your Current Location:</strong>{' '}
            {originCoords ? `${originCoords.lat.toFixed(4)}, ${originCoords.lon.toFixed(4)}` : 'Fetching your location...'}
          </p>
          {geoError && <p style={{ color: 'red' }}>Geolocation Error: {geoError}</p>}
        </div>

        {/* Destination Input */}
        <div>
          <label htmlFor="destination">Destination:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
          />
        </div>

        {/* Transport Mode Selector */}
        <div>
          <label htmlFor="transport-mode">Transport Mode:</label>
          <select
            id="transport-mode"
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value as typeof transportMode)}
          >
            <option value="pedestrian">Walking</option>
            <option value="publicTransport">Public Transport</option>
            <option value="bicycle">Bicycle</option>
          </select>
        </div>

        {/* Map Theme Selector */}
        <div>
          <label htmlFor="map-theme">Map Theme:</label>
          <select id="map-theme" value={mapTheme} onChange={(e) => setMapTheme(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="dark">Dark</option>
            <option value="satellite">Satellite</option>
          </select>
        </div>

        {/* Search Button */}
        <button onClick={handleSearch} disabled={!originCoords}>
          Search
        </button>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Map Display */}
        {route.length > 0 && (
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            geolocationError={geoError || null}
            route={route}
            summary={summary}
            instructions={instructions}
            originCoords={latLng(originCoords!.lat, originCoords!.lon)}
            destinationCoords={latLng(route[route.length - 1][0], route[route.length - 1][1])}
            theme={mapTheme}
          />
        )}
      </div>
   </>
  );
};

export default WhereToPage;
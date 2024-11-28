import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { geocodeAddress } from '../services/geocodingService';
import { usePosition } from '../hooks/usePosition'; // Import the geolocation hook from Jonas's code

const WhereToPage: React.FC = () => {
  const navigate = useNavigate();
  const { latitude, longitude, error: geoError } = usePosition(); // Get the user's live location
  const [originCoords, setOriginCoords] = useState<{ lat: number; lon: number } | null>(null); // Origin coordinates
  const [destination, setDestination] = useState<string>(''); // Destination address
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle'>('pedestrian'); // Default transport mode
  const [mapTheme, setMapTheme] = useState<string>('standard'); // Default map theme
  const [error, setError] = useState<string | null>(null);

  // Update the origin coordinates based on the user's location
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
      // Geocode the destination address
      const destinationCoords = await geocodeAddress(destination);

      setError(null);

      // Navigate to the JourneyPage with query parameters
      navigate(
        `/journey?originLat=${originCoords.lat}&originLon=${originCoords.lon}&destinationLat=${destinationCoords.lat}&destinationLon=${destinationCoords.lon}&transportMode=${transportMode}&theme=${mapTheme}`
      );
    } catch (err) {
      console.error('Error during geocoding:', err);
      setError('Failed to find the location. Please try again.');
      return err
    }
  };

  return (
    <div className="where-to-page">
      <div>  <Navbar /></div>
      <h1>Where to?</h1>

      {/* Display live location */}
      <div>
        <p>
          <strong>Your Current Location:</strong>{' '}
          {originCoords
            ? `${originCoords.lat.toFixed(4)}, ${originCoords.lon.toFixed(4)}`
            : 'Fetching your location...'}
        </p>
        {geoError && <p style={{ color: 'red' }}>Geolocation Error: {geoError}</p>}
      </div>

      {/* Destination input */}
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
        <select
          id="map-theme"
          value={mapTheme}
          onChange={(e) => setMapTheme(e.target.value)}
        >
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
    </div>
  );
};

export default WhereToPage;
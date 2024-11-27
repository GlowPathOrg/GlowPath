import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geocodeAddress } from '../services/geocodingService';

const WhereToPage: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState<string>('Berlin, Germany'); // Default origin
  const [destination, setDestination] = useState<string>(''); // User-entered destination
  const [transportMode, setTransportMode] = useState<'pedestrian' | 'publicTransport' | 'bicycle' | 'scooter'>(
    'pedestrian'
  ); // Default transport mode
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      // Geocode the origin and destination addresses
      const originCoords = await geocodeAddress(origin);
      const destinationCoords = await geocodeAddress(destination);

      setError(null);

      // Navigate to the JourneyPage with query parameters
      navigate(
        `/journey?originLat=${originCoords.lat}&originLon=${originCoords.lon}&destinationLat=${destinationCoords.lat}&destinationLon=${destinationCoords.lon}&transportMode=${transportMode}`
      );
    } catch (err) {
      console.error('Error during geocoding:', err);
      setError('Failed to find the location. Please try again.');
    }
  };

  return (
    <div className="where-to-page">
      <h1>Where to?</h1>

      {/* Origin input */}
      <div>
        <label htmlFor="origin">Origin:</label>
        <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="Enter origin"
        />
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

      {/* Search Button */}
      <button onClick={handleSearch}>Search</button>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default WhereToPage;
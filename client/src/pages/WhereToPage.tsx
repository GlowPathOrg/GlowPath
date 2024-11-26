import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { geocodeAddress } from '../services/geocodingService';
import AddressSearch from '../components/AddressSearch';

const WhereToPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (address: string) => {
    try {
      const { lat, lon } = await geocodeAddress(address); // Geocode the address
      setError(null);

      // Navigate to the MapComponent with lat/lon and address in query params
      navigate(`/journey?lat=${lat}&lon=${lon}&address=${encodeURIComponent(address)}`);
    } catch (err) {
      setError('Failed to find the location. Please try again.');
    }
  };

  return (
    <div className="where-to-page">
      <h1>Where to?</h1>
      <AddressSearch onSearch={handleSearch} />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default WhereToPage;
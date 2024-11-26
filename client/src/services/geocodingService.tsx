import axios from 'axios';

export const geocodeAddress = async (address: string) => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: address,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
    });

    
    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    } else {
      throw new Error('Address not found');
    }
  } catch (error) {
    console.error('Error geocoding address:', error);
    throw error;
  }
};
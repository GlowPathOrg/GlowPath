import axios from 'axios';
import { decode } from '@here/flexpolyline'; // Import the decoding function

export const fetchRoute = async (
  origin: [number, number],
  destination: [number, number],
  transportMode: 'pedestrian' | 'publicTransport' | 'bicycle' | 'car'
) => {
  const [originLat, originLon] = origin;
  const [destinationLat, destinationLon] = destination;

  const url = 'https://router.hereapi.com/v8/routes';

  try {
    console.log('Request Parameters:', {
      apiKey: 'Td0D7cZ_SXDeE-9FCx_8o2BA47tlOjvMXlnDo8maJcM',
      transportMode,
      origin: `${originLat},${originLon}`,
      destination: `${destinationLat},${destinationLon}`,
      return: 'polyline,summary,instructions',
    });

    const response = await axios.get(url, {
      params: {
        apiKey: 'Td0D7cZ_SXDeE-9FCx_8o2BA47tlOjvMXlnDo8maJcM',
        transportMode,
        origin: `${originLat},${originLon}`,
        destination: `${destinationLat},${destinationLon}`,
        return: 'polyline,summary,instructions,actions',
      },
    });

    if (response.data.routes.length > 0) {
      const route = response.data.routes[0].sections[0];
      return {
        polyline: route.polyline,
        summary: route.summary,
        instructions: route.actions || [],
      };
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('Error fetching route:', error);
    throw error;
  }
};
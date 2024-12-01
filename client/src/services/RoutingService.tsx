import axios from 'axios';

// fetch a route from the HERE API
export const fetchRoute = async (
  origin: [number, number], // Origin coordinates as [latitude, longitude]
  destination: [number, number], // Destination coordinates as [latitude, longitude]
  transportMode: 'pedestrian' | 'publicTransport' | 'bicycle' | 'car' // Transport mode for the route
) => {
  // Destructure origin and destination coordinates for API parameters
  const [originLat, originLon] = origin;
  const [destinationLat, destinationLon] = destination;

  // HERE Routing API url
  const url = 'https://router.hereapi.com/v8/routes';

  // API key loaded from .env
  const apiKey = import.meta.env.VITE_HERE_API_KEY;

  // Check if the API key is available (for debugging if needed)
  if (!apiKey) {
    console.error('API Key is undefined. Please check your environment configuration.');
    throw new Error('API Key is missing');
  }

  try {
    // Log the parameters being sent to the API for debugging purposes
    /* console.log('Request Parameters:', {
      apiKey,
      transportMode,
      origin: `${originLat},${originLon}`,
      destination: `${destinationLat},${destinationLon}`,
      return: 'polyline,summary,instructions,actions',
    }); */

    // Send a GET request to the HERE API with the specified parameters
    const response = await axios.get(url, {
      params: {
        apiKey, 
        transportMode, 
        origin: `${originLat},${originLon}`, // Origin location as a string
        destination: `${destinationLat},${destinationLon}`, // Destination location as a string
        return: 'polyline,summary,instructions,actions', // API response fields requested
      },
    });

    // Check if the API response contains routes
    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0].sections[0]; // Extract the first route section this might be changed later
      console.log('Route Summary:', route.summary);
      // Return the polyline, summary, and instructions for the route
      console.log('Actions:', route.actions);
      return {
        polyline: route.polyline, // Encoded polyline for the route
        summary: route.summary, // Summary details like duration and distance
        instructions: route.actions || [], // Turn-by-turn instructions
      };
    } else {
      
      throw new Error('No route found in the API response');
    }
  } catch (error) {
    
    console.error('Request failed. Ensure that your API key is valid and the parameters are correct.');
    throw error; 
  }
};

//added Fri night:
// Fetch a rerouted path (same logic as fetchRoute, but named explicitly for clarity)
export const fetchReroute = async (
  currentPosition: [number, number], // Current position of the user
  destination: [number, number], // Destination coordinates
  transportMode: 'pedestrian' | 'publicTransport' | 'bicycle' // Transport mode for rerouting
) => {
  console.log('Rerouting from:', currentPosition, 'to:', destination, 'using mode:', transportMode);
  return await fetchRoute(currentPosition, destination, transportMode);
};
import axios from 'axios';
import { RouteRequestI } from '../Types/Route';



// fetch a route from the HERE API
export const fetchRoute = async (
  RouteReqItem: RouteRequestI
) => {
  const { transportMode, destination, origin } = RouteReqItem;
  // Destructure origin and destination coordinates for API parameters
  const [originLat, originLon] = origin;
  const [destinationLat, destinationLon] = destination;

  // Changed from api url to backend url
  const url = import.meta.env.BACKEND_URL ||'http://localhost:3002';
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
    const params: RouteRequestI = {
      transportMode,
      origin: `${originLat},${originLon}`, // Origin location as a string
      destination: `${destinationLat},${destinationLon}`, // Destination location as a string
      return: 'polyline,summary,instructions,actions',
    }

    const response = await axios.get(`${url}/route/fetch`, { params });
    const data = response.data;
    console.log('here is data', data)
    // Check if the API response contains routes
    if (data) {
      return data
    } else throw new Error('error in awaiting controller from route service')

  } catch (error) {

    console.error('Request failed:' + error);
    throw error;
  }
};

//added Fri night:
// Fetch a rerouted path (same logic as fetchRoute, but named explicitly for clarity)
export const fetchReroute = async (ReRouteReqItem: RouteRequestI, currentPosition: number[]) => {

  const { transportMode, destination } = ReRouteReqItem;
  const newRequest = {
    origin: currentPosition,
    destination: destination,
    transportMode: transportMode
  }
  console.log('Rerouting from:', currentPosition, 'to:', destination, 'using mode:', transportMode);
  return await fetchRoute(newRequest);
};
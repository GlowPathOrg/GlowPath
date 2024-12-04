import axios from "axios";
import { decode } from "@here/flexpolyline";
import {
  fetchInfrastructureData,
  processInfrastructureData,
} from "../services/overpassService";
import { RouteRequestI } from '../Types/Route';
export const fetchRoute = async (
  RouteReqItem: RouteRequestI
) => {
  const { transportMode, destination, origin } = RouteReqItem;
  // Destructure origin and destination coordinates for API parameters
  const [originLat, originLon] = origin;
  const [destinationLat, destinationLon] = destination;

  // Changed from api url to backend url
  const url = import.meta.env.VITE_BACKEND_URL || "https://glowpath-a7681fe09c29.herokuapp.com";
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
    const route = response.data;
    console.log('here is data', route)
    // Check if the API response contains routes
    if (route) {
           const decodedPolyline = decode(route.polyline).polyline;

      const latitudes = decodedPolyline.map(([lat]) => lat);
      const longitudes = decodedPolyline.map(([, lon]) => lon);
      const southWest: [number, number] = [
        Math.min(...latitudes),
        Math.min(...longitudes),
      ];
      const northEast: [number, number] = [
        Math.max(...latitudes),
        Math.max(...longitudes),
      ];

      const rawInfrastructureData = await fetchInfrastructureData(
        southWest,
        northEast
      );

      const {
        litStreets = [],
        sidewalks = [],
        policeStations = [],
        hospitals = [],
      } = processInfrastructureData(rawInfrastructureData);

      // Dummy safety data for demonstration purposes
      const safetyData = decodedPolyline.map(([lat, lon]) => ({
        lat,
        lon,
        level: Math.random() * 10, // Random safety level between 0 and 10
    }));

      return {
        polyline: route.polyline,
        summary: route.summary,
        instructions: route.actions || [],
        litStreets,
        sidewalks,
        policeStations,
        hospitals,
        safetyData, // Include safety data
      };
    } else {
      throw new Error("No route found in the API response");
    }
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
import axios from "axios";
import { decode } from "@here/flexpolyline";
import {
  fetchInfrastructureData,
  processInfrastructureData,
} from "../services/overpassService";

export const fetchRoute = async (
  origin: [number, number],
  destination: [number, number],
  transportMode: "pedestrian" | "publicTransport" | "bicycle" | "car"
) => {
  const [originLat, originLon] = origin;
  const [destinationLat, destinationLon] = destination;

  const apiKey = import.meta.env.VITE_HERE_API_KEY;
  const url = "https://router.hereapi.com/v8/routes";

  if (!apiKey) throw new Error("API Key is missing");

  try {
    const response = await axios.get(url, {
      params: {
        apiKey,
        transportMode,
        origin: `${originLat},${originLon}`,
        destination: `${destinationLat},${destinationLon}`,
        return: "polyline,summary,instructions,actions",
      },
    });

    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0].sections[0];
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
    console.error("Error fetching route:", error);
    throw error;
  }
};
import axios from "axios";
import { decode } from "@here/flexpolyline";
import { fetchInfrastructureData, processInfrastructureData } from "../services/overpassService";

export const fetchRoute = async (
  origin: [number, number],
  destination: [number, number],
  transportMode: "pedestrian" | "publicTransport" | "bicycle" | "car"
) => {
  // Destructure origin and destination coordinates
  const [originLat, originLon] = origin;
  const [destinationLat, destinationLon] = destination;

  // API key and URL for HERE Routing API
  const apiKey = import.meta.env.VITE_HERE_API_KEY;
  const url = "https://router.hereapi.com/v8/routes";

  if (!apiKey) throw new Error("API Key is missing");

  try {
    // Fetch route data from HERE API
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
      const route = response.data.routes[0].sections[0]; // First route section
      const decodedPolyline = decode(route.polyline).polyline;

      // Calculate bounding box for the route
      const latitudes = decodedPolyline.map(([lat]) => lat);
      const longitudes = decodedPolyline.map(([, lon]) => lon);
      const southWest: [number, number] = [Math.min(...latitudes), Math.min(...longitudes)];
      const northEast: [number, number] = [Math.max(...latitudes), Math.max(...longitudes)];

      // Fetch infrastructure data using Overpass API
      const rawInfrastructureData = await fetchInfrastructureData(southWest, northEast);

      // Process the raw data to extract lit streets, sidewalks, police stations, and hospitals
      const {
        litStreets = [],
        sidewalks = [],
        policeStations = [],
        hospitals = [],
      } = processInfrastructureData(rawInfrastructureData);

      // Return all relevant data
      return {
        polyline: route.polyline, // Encoded polyline
        summary: route.summary, // Route summary (distance, duration)
        instructions: route.actions || [], // Turn-by-turn instructions
        litStreets, // Lit streets from Overpass API
        sidewalks, // Sidewalks from Overpass API
        policeStations, // Police stations from Overpass API
        hospitals, // Hospitals from Overpass API
      };
    } else {
      throw new Error("No route found in the API response");
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
};
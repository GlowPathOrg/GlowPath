import axios from "axios";

const SAFE_PLACES_API_URL = "https://api.safeplaces.com/data"; // Replace with the actual endpoint
const SAFE_PLACES_API_KEY = import.meta.env.VITE_SAFE_PLACES_API_KEY;

/**
 * Fetch safety data from Safe Places API for a given location.
 * @param latitude Latitude of the location.
 * @param longitude Longitude of the location.
 * @returns Safety data including crime rates, safety scores, etc.
 */
export const fetchSafetyData = async (latitude: number, longitude: number) => {
  try {
    const response = await axios.get(SAFE_PLACES_API_URL, {
      headers: {
        Authorization: `Bearer ${SAFE_PLACES_API_KEY}`, 
      },
      params: {
        lat: latitude,
        lon: longitude,
        radius: 1000, // Radius in meters
      },
    });

    return response.data; // Adjust based on API response structure
  } catch (error) {
    console.error("Error fetching safety data:", error);
    throw new Error("Failed to fetch safety data.");
  }
};
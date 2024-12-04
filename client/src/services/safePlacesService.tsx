import axios from 'axios';

const AMADEUS_API_BASE_URL = 'https://test.api.amadeus.com/v1/';
let accessToken: string | null = null;

/**
 * Fetch an access token from Amadeus API.
 * @throws {Error} If the token cannot be fetched.
 */
const fetchAccessToken = async (): Promise<void> => {
  try {
    const response = await axios.post(
      `${AMADEUS_API_BASE_URL}security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: import.meta.env.VITE_SAFE_PLACES_API_KEY,
        client_secret: import.meta.env.VITE_SAFE_PLACES_API_SECRETE,
      })
    );
    accessToken = response.data.access_token;
  } catch (error: unknown) {
    console.error('Error fetching Amadeus access token:', error);
    throw new Error('Failed to fetch access token.');
  }
};

/**
 * Fetch safety-rated locations for a given latitude and longitude.
 * @param lat Latitude of the location.
 * @param lon Longitude of the location.
 * @returns Safety data for the provided coordinates.
 * @throws {Error} If the safety data cannot be fetched.
 */
export const fetchSafetyData = async (
  lat: number,
  lon: number
): Promise<any[]> => {
  if (!accessToken) {
    await fetchAccessToken();
  }

  try {
    const response = await axios.get(
      `${AMADEUS_API_BASE_URL}reference-data/locations/safety-rated-locations`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          latitude: lat,
          longitude: lon,
        },
      }
    );

    if (response.data?.data) {
      return response.data.data;
    } else {
      console.warn('No safety data available for the provided location.');
      return [];
    }
  } catch (error: unknown) {
    // Handle errors explicitly and refresh token if needed
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('Access token expired, refreshing...');
      await fetchAccessToken();
      return fetchSafetyData(lat, lon);
    }

    console.error('Error fetching safety data:', error);
    throw new Error('Failed to fetch safety data.');
  }
};
import axios from "axios";

export interface InfrastructureDataI {
  type: "node" | "way";
  lat?: number;  // Only present if type is 'node'
  lon?: number;  // Only present if type is 'node'
  geometry?: { lat: number; lon: number }[];  // Only present if type is 'way'
  tags: DataTagsI;
}

export interface DataTagsI {
  amenity?: "police" | "hospital";  // Only interested in 'police' and 'hospital'
  lit?: "yes";  // Only interested if lit is 'yes'
  sidewalk?: { geometry?: { lat: number; lon: number }[] };  // Corrected type for sidewalks
}

/**
 * Fetch data from Overpass API.
 * @param query The Overpass query string.
 * @returns Parsed JSON response from Overpass API.
 */
export const fetchOverpassData = async (query: string) => {
  const url = "https://overpass-api.de/api/interpreter";

  try {
    const response = await axios.post(url, query, {
      headers: { "Content-Type": "text/plain" },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Overpass data:", error);
    throw new Error("Failed to fetch infrastructure data");
  }
};

/**
 * Fetch lit streets, sidewalks, police stations, and hospitals in a bounding box.
 * @param southWest [latitude, longitude] of the southwest corner of the bounding box.
 * @param northEast [latitude, longitude] of the northeast corner of the bounding box.
 */
export const fetchInfrastructureData = async (
  southWest: [number, number],
  northEast: [number, number]
) => {
  const [south, west] = southWest;
  const [north, east] = northEast;

  const query = `
    [out:json];
    (
      node["lit"="yes"](${south},${west},${north},${east});
      way["lit"="yes"](${south},${west},${north},${east});
      way["sidewalk"](${south},${west},${north},${east});
      node["amenity"="police"](${south},${west},${north},${east});
      node["amenity"="hospital"](${south},${west},${north},${east});
    );
    out center;
  `;

  return await fetchOverpassData(query);
};

/**
 * Process fetched data to segregate lit streets, sidewalks, police stations, and hospitals.
 * @param data Raw Overpass API data.
 * @returns An object containing segregated data.
 */
export const processInfrastructureData = (data: { elements: InfrastructureDataI[] }) => {
  const litStreets: { lat: number; lon: number }[] = [];
  const sidewalks: { geometry: { lat: number; lon: number }[] }[] = [];
  const policeStations: { lat: number; lon: number }[] = [];
  const hospitals: { lat: number; lon: number }[] = [];

  data.elements.forEach((element) => {
    if (element.tags) {
      if (element.tags.lit === "yes") {
        if (element.type === "node" && element.lat !== undefined && element.lon !== undefined) {
          litStreets.push({ lat: element.lat, lon: element.lon });
        } else if (element.type === "way" && element.geometry) {
          sidewalks.push({
            geometry: element.geometry
              .filter((node) => node.lat !== undefined && node.lon !== undefined)
              .map((node) => ({
                lat: node.lat,
                lon: node.lon,
              })),
          });
        }
      }

      if (element.tags.amenity === "police" && element.lat !== undefined && element.lon !== undefined) {
        policeStations.push({ lat: element.lat, lon: element.lon });
      }

      if (element.tags.amenity === "hospital" && element.lat !== undefined && element.lon !== undefined) {
        hospitals.push({ lat: element.lat, lon: element.lon });
      }
    }
  });

  return { litStreets, sidewalks, policeStations, hospitals };
};

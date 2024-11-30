import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  Circle,
} from "react-leaflet";
import { latLng, LatLng, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css"; // Default Leaflet styling
import "../../styles/MapComponent.css"; // Custom styling
import { Amenity, fetchAmenities } from "../../services/amenitiesService"; // Fetch amenities service
import mapThemes, { getDefaultTheme, isValidTheme } from "./MapThemes";
import FitBounds from "./FitBounds";

interface MapComponentProps {
  latitude: number | undefined;
  longitude: number | undefined;
  geolocationError: string | null;
  route: LatLngTuple[]; // Route polyline
  summary: { distance: number; duration: number } | null; // Route summary
  instructions: any[]; // Turn-by-turn instructions
  originCoords: LatLng | null; // Origin coordinates
  destinationCoords: LatLng | null; // Destination coordinates
  theme: string; // Map theme
}

const MapComponent: React.FC<MapComponentProps> = ({
  latitude,
  longitude,
  geolocationError,
  route,
  summary,
  instructions,
  originCoords,
  destinationCoords,
  theme,
}) => {
  const [amenities, setAmenities] = useState<Amenity[]>([]); // Amenities state
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(false);

  // Validate and set map theme
  const validatedTheme = isValidTheme(theme) ? theme : getDefaultTheme();

  // Define geofence parameters
  const fenceCenter =
    latitude && longitude ? latLng(latitude, longitude) : null; // Dynamically set the center
  const fenceRadius = 100; // Geofence radius in meters

  const actionIcons: Record<string, string> = {
    depart: "🏁", // Departure flag
    arrive: "🏁", // Arrival flag
    left: "⬅️", // Left arrow
    right: "➡️", // Right arrow
    straight: "⬆️", // Straight arrow
  };

  // Monitor user position and determine if inside geofence
  useEffect(() => {
    if (originCoords && fenceCenter) {
      const distance = fenceCenter.distanceTo(originCoords); // Calculate distance from user's location to origin
      const isInside = distance <= fenceRadius; // Check if inside geofence
      setIsInsideGeofence(isInside);

      console.log(
        "Geofencing Status:",
        isInside ? "Inside" : "Outside",
        "Distance:",
        distance
      );
    }
  }, [originCoords, fenceCenter, fenceRadius]);

  // Fetch nearby amenities
  useEffect(() => {
    const fetchData = async () => {
      if (!originCoords) return; // Ensure origin is defined
      try {
        const data = await fetchAmenities(500, {
          lat: originCoords.lat,
          lon: originCoords.lng,
        }); // Pass origin coordinates
        if (data && Array.isArray(data)) {
          setAmenities(data); // Update amenities state
        } else {
          throw new Error("Invalid response received or no amenities found.");
        }
      } catch (error) {
        console.error("Error fetching amenities:", error);
      }
    };

    fetchData();
  }, [originCoords]);

  return (
    <div className="map-component">
      {/* Map Container */}
      <MapContainer
        className="map-container"
        center={originCoords || latLng(52.4771, 13.431)}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '80vh', width: '100%' }}
      >
        {/* Tile Layer for Map Theme */}
        {mapThemes[validatedTheme] ? (
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url={mapThemes[validatedTheme]}
          />
        ) : (
          <p style={{ color: "red" }}>Invalid map theme URL</p>
        )}

        {/* Fit map bounds to origin and destination */}
        {originCoords && destinationCoords && (
          <FitBounds origin={originCoords} destination={destinationCoords} />
        )}

        {/* Origin Marker */}
        {originCoords && (
          <Marker position={originCoords}>
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationCoords && (
          <Marker position={destinationCoords}>
            <Popup>
              Destination <br />
              Coordinates: {destinationCoords.lat.toFixed(4)},{" "}
              {destinationCoords.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ className: "glowing-polyline" }}
          />
        )}

        {/* Amenities Markers */}
        {amenities.map((amenity: Amenity, index: number) => {
          const { lat, lon, tags } = amenity;
          const name = tags.name || "Unnamed Amenity";
          return (
            <Marker key={index} position={latLng(lat, lon)}>
              <Popup>
                {name} <br />
                {tags.public_transport || ""} <br />
                {tags.lit ? "Lit space" : ""}
              </Popup>
            </Marker>
          );
        })}

        {/* Geofence Circle */}
        {fenceCenter && (
          <Circle
            center={fenceCenter}
            radius={fenceRadius}
            color="blue"
            fillColor="rgba(0, 0, 255, 0.2)"
          />
        )}
      </MapContainer>

      {/* Geolocation Error */}
      {geolocationError && (
        <p style={{ color: "red" }}>Geolocation Error: {geolocationError}</p>
      )}

      {/* Geofence Status */}
      <div className="geofence-status">
        <p>
          {isInsideGeofence
            ? "You are inside the geofence."
            : "You are outside the geofence."}
        </p>
      </div>

      {/* Route Summary */}
      <div className="summary">
        <h3>Route Summary</h3>
        {summary ? (
          <div>
            <p>
              <strong>Distance:</strong> {summary.distance / 1000} km
            </p>
            <p>
              <strong>Duration:</strong> {Math.ceil(summary.duration / 60)}{" "}
              minutes
            </p>
          </div>
        ) : (
          <p>Loading route summary...</p>
        )}
      </div>

      {/* Turn-by-Turn Instructions */}
      <div className="instructions">
        <h3>Turn-by-Turn Instructions</h3>
        <ul>
          {instructions.map((instruction, index) => {
            const { instruction: text, action, length, duration } = instruction;
            const icon = actionIcons[action] || "➡️"; // Fallback to generic arrow

            return (
              <li key={index}>
                <strong>
                  {icon} {action}:
                </strong>{" "}
                {text} <br />
                <em>Distance: {length || "Unknown"} m</em>
                <br />
                <em>
                  Duration:{" "}
                  {duration ? `${Math.ceil(duration / 60)} min` : "Unknown"}
                </em>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MapComponent;
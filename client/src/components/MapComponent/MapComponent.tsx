import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Circle,
  Popup,
  Marker,
} from "react-leaflet";
import L from "leaflet"; // for map manipulation
import "leaflet-rotatedmarker"; // plugin for rotated markers
import { latLng, LatLng, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../styles/MapComponent.css";
import mapThemes, { getDefaultTheme, isValidTheme } from "./MapThemes";
import FitBounds from "./FitBounds";
import { InstructionsI, SummaryI } from "../../Types/Route";

interface MapComponentProps {
  latitude: number | null; // User's latitude
  longitude: number | null; // User's longitude
  geolocationError: string | null; // Geolocation error message
  route: LatLngTuple[]; // Route polyline coordinates
  summary: SummaryI | null; // Route summary
  instructions: InstructionsI[]; // Turn-by-turn instructions
  originCoords: LatLng | null; // Origin coordinates
  destinationCoords: LatLng | null; // Destination coordinates
  theme: string; // Map theme
  heading: number | null; // Heading for the rotated marker
  litStreets: LatLngTuple[]; // Array of lit street coordinates
  sidewalks: { geometry: LatLngTuple[] }[]; // Array of sidewalk geometries
  policeStations: LatLngTuple[]; // Police station locations
  hospitals: LatLngTuple[]; // Hospital locations

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
  heading,
  litStreets = [],
  sidewalks = [],
  policeStations = [],
  hospitals = [],

}) => {
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean>(false); // state for geofence status

  // validate and set the map theme
  const validatedTheme = isValidTheme(theme) ? theme : getDefaultTheme();

  // define geofence parameters
  const fenceCenter = latitude && longitude ? latLng(latitude, longitude) : null;
  const fenceRadius = 100; // Geofence radius in meters
  const fenceCenter = latitude && longitude ? latLng(latitude, longitude) : null;
  const fenceRadius = 100;

  const actionIcons: Record<string, string> = {
    depart: "🏁",
    arrive: "🏁",
    left: "⬅️",
    straight: "⬆️",
  };

  useEffect(() => {
    if (originCoords && fenceCenter) {
      const distance = fenceCenter.distanceTo(originCoords);
      const isInside = distance <= fenceRadius;
      setIsInsideGeofence(isInside);

      console.log(
        "Geofencing Status:",
        isInside ? "Inside" : "Outside",
        "Distance:",
        distance
      );
    }
  }, [originCoords, fenceCenter, fenceRadius]);

  // fetch nearby amenities

  return (
    <div className="map-component">

      {/* Map Container */}
      <MapContainer
        className="map-container"
        center={originCoords || latLng(52.4771, 13.431)}
        zoom={18}
        scrollWheelZoom={false}
        style={{ height: "80vh", width: "100%" }}
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


        {/* Lit Streets */}
        {litStreets.map(([lat, lon], index) => (
          <Circle key={`lit-${index}`} center={latLng(lat, lon)} radius={10} color="yellow" />
        ))}

        {/* Sidewalks */}
        {sidewalks.map((sidewalk, index) => (
          <Polyline
            key={`sidewalk-${index}`}
            positions={sidewalk.geometry.map(([lat, lon]: LatLngTuple) => latLng(lat, lon))}
            color="green"
          />
        ))}

        {/* Police Stations */}
        {policeStations.map(([lat, lon], index) => (
          <Marker
            key={`police-${index}`}
            position={latLng(lat, lon)}
            icon={L.icon({
              iconUrl: "https://img.icons8.com/?size=100&id=R8s6gQ1oAQPH&format=png&color=000000",
              iconSize: [25, 25],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>Police Station</Popup>
          </Marker>
        ))}

        {/* Hospitals */}
        {hospitals.map(([lat, lon], index) => (
          <Marker
            key={`hospital-${index}`}
            position={latLng(lat, lon)}
            icon={L.icon({
              iconUrl: "https://img.icons8.com/?size=100&id=rBh1fuOC6Bjx&format=png&color=000000",
              iconSize: [25, 25],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>Hospital</Popup>
          </Marker>
        ))}

        {/* Fit map bounds to origin and destination */}
        {originCoords && destinationCoords && (
          <FitBounds origin={originCoords} destination={destinationCoords} />
        )}

        {/* Rotated Marker for User's Current Location */}
        {latitude && longitude && (
          <Marker
            position={[latitude, longitude]}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
            rotationAngle={heading || 0}
            rotationOrigin="center"
          >
            <Popup>Current Position</Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationCoords && (
          <Marker
            position={[destinationCoords.lat, destinationCoords.lng]}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              Destination <br />
              Coordinates: {destinationCoords.lat.toFixed(4)}, {destinationCoords.lng.toFixed(4)}
            </Popup>
          </Marker>
        )}

        {/* Route Polyline */}
        {route.length > 0 && (
          <Polyline positions={route} pathOptions={{ className: "glowing-polyline" }} />
        )}


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
              <strong>Distance:</strong> {summary.length / 1000} km
            </p>
            <p>
              <strong>Duration:</strong> {Math.ceil(summary.duration / 60)} minutes
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
            const { instruction: text, actions, length, duration } = instruction;
            const actionIconssString = actions
              .map((action) => actionIcons[action.instruction] || "➡️");

            return (
              <li key={index}>
                <strong>
                  {actionIconssString} {text}:
                </strong>{" "}
                {text} <br />
                <em>Distance: {length || "Unknown"} m</em>
                <br />
                <em>
                  Duration: {duration ? `${Math.ceil(duration / 60)} min` : "Unknown"}
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
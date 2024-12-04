import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "../styles/NavigationPage.css";
import Footer from "../components/Footer"

const NavigationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state from the previous navigation or default values
  const {
    route = [], // Array of coordinates for the route
    summary = { distance: 0, duration: 0 }, // Distance and duration of the route
    instructions = [], // Turn-by-turn instructions
    theme = "standard", // Selected map theme
    transportMode = "pedestrian", // Transport mode (e.g., pedestrian)
  } = location.state || {};

  const [currentInstruction, setCurrentInstruction] = useState<string>(""); // Current turn-by-turn instruction

  // Set the initial instruction when instructions change
  useEffect(() => {
    if (instructions.length > 0) {
      setCurrentInstruction(instructions[0]?.instruction || "");
    }
  }, [instructions]);

  // Component to automatically follow and fit the map bounds to the route
  const AutoFollowMap = () => {
    const map = useMap();

    useEffect(() => {
      if (route.length > 0) {
        map.fitBounds(route);
      }
    }, [map]);

    return null;
  };

  // Define tile layer URLs for different themes
  const tileLayerThemes: Record<string, string> = {
    standard: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  };

  // Handle the "Start Journey" button click
  const handleStartJourney = () => {
    navigate("/journey", {
      state: {
        route, // Pass route data to the journey page
        summary, // Pass summary data
        instructions, // Pass instructions
        theme, // Pass selected theme
        transportMode, // Pass transport mode
      },
    });
  };

  return (
    <div className="navigation-page">
      {route.length > 0 ? (
        <MapContainer
          center={route[0]} // Center the map on the start of the route
          zoom={15}
          style={{ height: "60vh" }}
        >
          {/* Add the selected tile layer theme */}
          <TileLayer
            url={tileLayerThemes[theme] || tileLayerThemes["standard"]}
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Draw the route on the map */}
          <Polyline
  positions={route}
  pathOptions={{
    color: "pink",
    weight: 6,
    lineCap: "square", // Sharp ends
    lineJoin: "miter", // Sharp corners
  }}
  weight={6} 
/> 
          {/* Marker for the start point */}
          <Marker position={route[0]} 
          />

          {/* Marker for the end point */}
          <Marker position={route[route.length - 1]} />
          {/* Automatically follow the route */}
          <AutoFollowMap />
        </MapContainer>
      ) : (
        <p>Loading map...</p> // Display a fallback message while the map is loading
      )}

<div className="navigation-info">
<div className="route-details">
    <div className="route-step">
      <span className="route-step-icon">📍</span>
      <span>Current Location</span>
    </div>
    <div className="route-step">
      <span className="route-step-icon">🏁</span>
      <span>{location.state?.destinationName || "Destination"}</span>
    </div>
  </div>
  <p>{summary.length / 1000} km • {Math.ceil(summary.duration / 60)} min</p>
  <div className="button-group">
    <button className="start-button" onClick={handleStartJourney}>
      Start Journey
    </button>
    <button className="exit-button" onClick={() => navigate("/")}>
      Exit
    </button>
  </div>
</div>
<Footer/>
    </div>
  );
};

export default NavigationPage;
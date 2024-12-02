import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import "../styles/NavigationPage.css";

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

  // component to automatically follow and fit the map bounds to the route (needs testing)
  const AutoFollowMap = () => {
    const map = useMap();

    // Center the map on the route
    useEffect(() => {
      if (route.length > 0) {
        map.fitBounds(route);
      }
    }, [map, route]);

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
        <MapContainer center={route[0]} zoom={15} style={{ height: "60vh" }}>
          {/* Add the selected tile layer theme */}
          <TileLayer
            url={tileLayerThemes[theme] || tileLayerThemes["standard"]}
            attribution="&copy; OpenStreetMap contributors"
          />
          {/* Draw the route on the map */}
          <Polyline positions={route} color="blue" weight={6} />
          {/* Marker for the start point */}
          <Marker position={route[0]} />
          {/* Marker for the end point */}
          <Marker position={route[route.length - 1]} />
          {/* Automatically follow the route */}
          <AutoFollowMap />
        </MapContainer>
      ) : (
        <p>Loading map...</p>
      )}
      <div className="navigation-info">
        {/* Display the current instruction */}
        <h3>{currentInstruction}</h3>
        {/* Display the next instruction or a default message */}
        <p>Towards: {instructions?.[1]?.instruction || "Destination"}</p>
        {/* Display route distance and duration */}
        <p>
          {summary.length / 1000} km • {Math.ceil(summary.duration / 60)} min
        </p>

        <button className="start-button" onClick={handleStartJourney}>
          Start Journey
        </button>

        <button className="exit-button" onClick={() => navigate("/")}>
          Exit
        </button>
      </div>
    </div>
  );
};

export default NavigationPage;
// Import necessary modules and components
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapComponent from "../../components/MapComponent/MapComponent";
import ProgressBar from "./ProgressBar";
import SosButton from "./SosButton";
import AlarmButton from "./AlarmButton";
import WeatherInfo from "./WeatherInfo";
import { usePosition } from "../../hooks/usePosition";
import { fetchRoute } from "../../services/RoutingService";
import { latLng } from "leaflet";
import { decode } from "@here/flexpolyline";
import { LatLngTuple } from "leaflet";
import "../../styles/JourneyPage.css";
import { useSocket } from "../../hooks/useSocket";
import { createShare } from "../../services/shareService";

const JourneyPage: React.FC = () => {
  // React router hooks to access location state and navigate
  const location = useLocation();
  const navigate = useNavigate();

  // Getting user's current location and heading from the usePosition hook
  const position = usePosition();
  const { latitude, longitude, heading = 0, error: geoError } = position;

  // Destructure initial states passed through the route
  const {
    route: initialRoute = [],
    summary: initialSummary = { distance: 0, duration: 0 },
    instructions: initialInstructions = [],
    theme = "standard",
    transportMode = "pedestrian",
    destinationCoords = null,
  } = location.state || {};

  // All state variables used
  const [currentRoute, setCurrentRoute] = useState<LatLngTuple[]>(initialRoute); // Active route
  const [currentSummary, setCurrentSummary] = useState(initialSummary); // Route summary
  const [currentInstructions, setCurrentInstructions] = useState(initialInstructions); // Instructions
  const [userDeviationDetected, setUserDeviationDetected] = useState(false); // Track route deviation
  const [rerouted, setRerouted] = useState(false); // Track if rerouting occurred

  // Detect if the user deviates from the route
  useEffect(() => {
    if (latitude && longitude && currentRoute.length > 0) {
      const userLocation = latLng(latitude, longitude);

      // Check if the user is close to any point on the route
      const isOnRoute = currentRoute.some(([lat, lon]: LatLngTuple) => {
        const point = latLng(lat, lon);
        return userLocation.distanceTo(point) <= 50; // Deviation threshold in meters
      });

      setUserDeviationDetected(!isOnRoute); // Update deviation state
    }
  }, [latitude, longitude, currentRoute]);

  // Handle rerouting if the user deviates from the route
  const handleReroute = async () => {
    if (!latitude || !longitude || currentRoute.length === 0) return;

    try {
      // Get the last point in the route as the destination
      const destination = currentRoute[currentRoute.length - 1];
      const [destLat, destLon] = destination;


      // Fetch new route, summary, and instructions from the routing service
      const { polyline, summary, instructions } = await fetchRoute(
        [latitude, longitude],
        [destLat, destLon],
        transportMode
      );

      // Decode the polyline into LatLng tuples
      const decoded = decode(polyline);
      if (decoded && Array.isArray(decoded.polyline)) {
        const newRoute: LatLngTuple[] = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple);
        setCurrentRoute(newRoute); // Update the route
        setCurrentSummary(summary); // Update summary
        setCurrentInstructions(instructions); // Update instructions
        setRerouted(true); // Mark rerouting as done
      }
    } catch (error) {
      console.error("Error during rerouting:", error); // Log rerouting errors
    }
  };

  // Trigger rerouting when deviation is detected
  useEffect(() => {
    if (userDeviationDetected) handleReroute();
  }, [userDeviationDetected]);

  // Announce turn-by-turn instructions using audio
  const announceTurn = (instruction: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(instruction);
    synth.speak(utterance); // Use Web Speech API to speak the instruction
  };

  // Announce the next turn instruction when it changes
  useEffect(() => {
    if (currentInstructions.length > 0) {
      const nextInstruction = currentInstructions[0];
      announceTurn(nextInstruction.instruction);
    }
  }, [currentInstructions]);

  // Socket-related hooks and functions
  const { error: socketError, connectSocket, hostShare, sendPosition } = useSocket({});

  async function handleShare() {
    try {
      // Convert LatLng to string
      const originCoords = `${currentRoute[0][0]},${currentRoute[0][1]}`;
      const destinationCoordsFormatted =
        destinationCoords || `${currentRoute[currentRoute.length - 1][0]},${currentRoute[currentRoute.length - 1][1]}`;
  
      const result = await createShare({ origin: originCoords, destination: destinationCoordsFormatted });
  
      if (result.id) {
        connectSocket();
        if (!socketError) hostShare(result.id);
      }
    } catch (err) {
      console.error("Error during sharing:", err);
    }
  }

  useEffect(() => {
    if (socketError) {
      console.error("Socket error:", socketError);
    } else {
      sendPosition(position);
    }
  }, [position]);

  // Rendering
  return (
    <div className="journey-page">
      {/* Render the map component if the route is available */}
      {currentRoute.length > 0 ? (
        <MapComponent
          latitude={latitude}
          longitude={longitude}
          heading={heading}
          geolocationError={geoError || null}
          route={currentRoute}
          summary={currentSummary}
          instructions={currentInstructions}
          originCoords={latLng(currentRoute[0][0], currentRoute[0][1])}
          destinationCoords={
            destinationCoords ||
            latLng(currentRoute[currentRoute.length - 1][0], currentRoute[currentRoute.length - 1][1])
          }
          theme={theme}
        />
      ) : (
        <p>Loading route...</p>
      )}

      {/* Display the next turn instruction */}
      <div className="alert-container">
        <h3>Next Turn:</h3>
        <p>{currentInstructions[0]?.instruction || "Continue straight"}</p>
      </div>

      {/* Progress Bar Section */}
      <ProgressBar progress={rerouted ? 75 : 50} />

      {/* Buttons and Features Section */}
      <div className="features-container">
        <SosButton />
        <AlarmButton />
        <button className="feature-button" onClick={handleShare}>
          Share
        </button>
        <button className="feature-button" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button className="feature-button">
          chat
        </button>
      </div>

      {/* Display weather information */}
      <WeatherInfo />
    </div>
  );
};

export default JourneyPage;
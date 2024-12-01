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
import "../../styles/JourneyPage.css"



const JourneyPage: React.FC = () => {
  // react router hooks to access location state and navigate
  const location = useLocation();
  const navigate = useNavigate();

  // getting user's current location and heading from the UsePosition hook (heading is related to the movement of the marker)
  const { latitude, longitude, heading = 0, error: geoError } = usePosition();

  // destructure initial states passed through the route
  const {
    route: initialRoute = [], 
    summary: initialSummary = { distance: 0, duration: 0 }, 
    instructions: initialInstructions = [], 
    theme = "standard", 
    transportMode = "pedestrian", 
    destinationCoords = null, 
  } = location.state || {};


  // all state variables used :
  const [currentRoute, setCurrentRoute] = useState<LatLngTuple[]>(initialRoute); // active route/current one before any deviations 
  const [currentSummary, setCurrentSummary] = useState(initialSummary); // route summary
  const [currentInstructions, setCurrentInstructions] = useState(initialInstructions); // instructions
  const [userDeviationDetected, setUserDeviationDetected] = useState(false); // track route deviation
  const [rerouted, setRerouted] = useState(false); // track if rerouting occurred

  // detect if the user deviates from the route
  useEffect(() => {
    if (latitude && longitude && currentRoute.length > 0) {
      const userLocation = latLng(latitude, longitude);

      // Check if the user is close to any point on the route
      const isOnRoute = currentRoute.some(([lat, lon]: LatLngTuple) => {
        const point = latLng(lat, lon);
        return userLocation.distanceTo(point) <= 50; // deviation threshold in meters
      });

      setUserDeviationDetected(!isOnRoute); // update deviation state
    }
  }, [latitude, longitude, currentRoute]);

  // handle rerouting if the user deviates from the route
  const handleReroute = async () => {
    if (!latitude || !longitude || currentRoute.length === 0) return;

    try {
      // get the last point in the route as the destination
      const destination = currentRoute[currentRoute.length - 1];
      const [destLat, destLon] = destination;

      // fetch new route, summary, and instructions from the routing service
      const { polyline, summary, instructions } = await fetchRoute(
        [latitude, longitude],
        [destLat, destLon],
        transportMode
      );

      // decode the polyline into LatLng tuples
      const decoded = decode(polyline);
      if (decoded && Array.isArray(decoded.polyline)) {
        const newRoute: LatLngTuple[] = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple);
        setCurrentRoute(newRoute); // update the route
        setCurrentSummary(summary); // update summary
        setCurrentInstructions(instructions); // update instructions
        setRerouted(true); // mark rerouting as done
      }
    } catch (error) {
      console.error("Error during rerouting:", error); // Log rerouting errors
    }
  };


  // trigger rerouting when deviation is detected
  useEffect(() => {
    if (userDeviationDetected) handleReroute();
  }, [userDeviationDetected]);

  // function to announce turn-by-turn instructions using audio using speechSynthesis
  const announceTurn = (instruction: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(instruction);
    synth.speak(utterance); // Use Web Speech API to speak the instruction
  };

  // announce the next turn instruction when it changes
  useEffect(() => {
    if (currentInstructions.length > 0) {
      const nextInstruction = currentInstructions[0];
      announceTurn(nextInstruction.instruction);
    }
  }, [currentInstructions]);

  // rendering
  return (
    <div className="journey-page">
      {/* Render the map component if the route is available */}
      {currentRoute.length > 0 ? (
        <MapComponent
          latitude={latitude} // Current user latitude
          longitude={longitude} // Current user longitude
          heading={heading} // User heading for rotated marker
          geolocationError={geoError || null} // Pass geolocation errors
          route={currentRoute} // Current route polyline
          summary={currentSummary} // Route summary
          instructions={currentInstructions} // Turn-by-turn instructions
          originCoords={latLng(currentRoute[0][0], currentRoute[0][1])} // Origin coordinates
          destinationCoords={
            destinationCoords ||
            latLng(currentRoute[currentRoute.length - 1][0], currentRoute[currentRoute.length - 1][1])
          } // Destination coordinates
          theme={theme} // Map theme
        />
      ) : (
        <p>Loading route...</p> // Show loading message if route is unavailable
      )}

      {/* Display the next turn instruction */}
      <div className="alert-container">
        <h3>Next Turn:</h3>
        <p>{currentInstructions[0]?.instruction || "Continue straight"}</p>
      </div>


      {/* Journey info section */}
      <div className="journey-info">
        {/* Progress bar */}
        <ProgressBar progress={rerouted ? 75 : 50} />

        {/* Feature buttons */}
        <div className="feature-button">
          <SosButton />
          <AlarmButton />
          <button onClick={() => navigate("/")} className="feature-button">
            Cancel
          </button>
        </div>
        <button className="feature-button">Share</button>
        <button className="feature-button">Chat</button>
      </div>

      {/* Display weather information */}
      <WeatherInfo />
    </div>
  );
};

export default JourneyPage;
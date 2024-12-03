import { useCallback, useEffect, useState } from "react";
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
import { RouteI, RouteRequestI } from "../../Types/Route";

const JourneyPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const position = usePosition();
  const { latitude, longitude, heading = 0, error: geoError } = position;

  const {
    route: initialRoute = [],
    summary: initialSummary = { distance: 0, duration: 0 },
    instructions: initialInstructions = [],
    theme: initialTheme = "standard",
    transportMode = "pedestrian",
    destinationCoords = null,
    safetyData: initialSafetyData = [],
  } = location.state || {};

  const [currentRoute, setCurrentRoute] = useState<LatLngTuple[]>(initialRoute);
  const [currentSummary, setCurrentSummary] = useState(initialSummary);
  const [currentInstructions, setCurrentInstructions] = useState(initialInstructions);
  const [userDeviationDetected, setUserDeviationDetected] = useState(false);
  const [rerouted, setRerouted] = useState(false);
  const [litStreets, setLitStreets] = useState<LatLngTuple[]>([]);
  const [sidewalks, setSidewalks] = useState<any[]>([]);
  const [policeStations, setPoliceStations] = useState<LatLngTuple[]>([]);
  const [hospitals, setHospitals] = useState<LatLngTuple[]>([]);

  const [mapTheme, setMapTheme] = useState<string>(initialTheme);

  const { error: socketError, connectSocket, hostShare, sendPosition } = useSocket({});

  const handleThemeChange = (newTheme: string) => setMapTheme(newTheme);

  useEffect(() => {
    if (latitude && longitude) {
      const southWest: [number, number] = [latitude - 0.01, longitude - 0.01];
      const northEast: [number, number] = [latitude + 0.01, longitude + 0.01];

      fetchInfrastructureData(southWest, northEast)
        .then((data) => {
          const { litStreets, sidewalks, policeStations, hospitals } = processInfrastructureData(data);
          setLitStreets(litStreets.map(({ lat, lon }) => [lat, lon] as LatLngTuple));
          setSidewalks(sidewalks);
          setPoliceStations(policeStations.map(({ lat, lon }) => [lat, lon] as LatLngTuple));
          setHospitals(hospitals.map(({ lat, lon }) => [lat, lon] as LatLngTuple));
        })
        .catch((err) => console.error("Error fetching infrastructure data:", err));
    }
  }, [latitude, longitude]);

  // All state variables used
  const [currentRoute, setCurrentRoute] = useState<LatLngTuple[]>(initialRoute); // Active route
  const [currentSummary, setCurrentSummary] = useState(initialSummary); // Route summary
  const [currentInstructions, setCurrentInstructions] = useState(initialInstructions); // Instructions
  const [userDeviationDetected, setUserDeviationDetected] = useState(false); // Track route deviation
  const [rerouted, setRerouted] = useState(false); // Track if rerouting occurred
  const [shareId, setShareId] = useState("");

  // Detect if the user deviates from the route
  useEffect(() => {
    if (latitude && longitude && currentRoute.length > 0) {
      const userLocation = latLng(latitude, longitude);

      const isOnRoute = currentRoute.some(([lat, lon]: LatLngTuple) => {
        const point = latLng(lat, lon);
        return userLocation.distanceTo(point) <= 50;
      });

      setUserDeviationDetected(!isOnRoute);
    }
  }, [latitude, longitude, currentRoute]);

 const handleReroute = useCallback(async () => {

     if (!latitude || !longitude || currentRoute.length === 0) return;

     try {
        const destination = currentRoute[currentRoute.length - 1];
       const [destLat, destLon] = destination;

       const request: RouteRequestI = {
         origin: [latitude, longitude],
         destination: [destLat, destLon],
         transportMode
       }


       // Fetch new route, summary, and instructions from the routing service
       const { polyline, summary, instructions } = await fetchRoute(
         request
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

 }, [latitude, longitude, currentRoute, transportMode])

  // Trigger rerouting when deviation is detected
/*  useEffect(() => {
  const rerouteIfNeeded = async () => {
    if (userDeviationDetected) {
      await handleReroute(); // Ensure this function is awaited if it's asynchronous
    }
  };

  rerouteIfNeeded(); // Call the function within the useEffect

}, [userDeviationDetected, handleReroute]); */

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
  const { isConnected, connectSocket, hostShare, sendPosition } = useSocket({});

  async function handleShare() {
    try {
      console.log('trying to share')
      const route: RouteI = {polyline: currentRoute, instructions: currentInstructions, summary: currentSummary};
      console.log('here is the route', route)
      const result = await createShare(route);
      console.log('the returned result', result);

      if (result.data.id) {
        console.log("Trying to connect to socket");
        setShareId(result.data.id);
        connectSocket();
      }
    } catch (err) {
      console.error("Error during sharing:", err);
    }
  }

  useEffect(() => {
    if (isConnected) {
      console.log("Trying to connect to share " + shareId);
      console.log("isConnected: ", isConnected);
      hostShare(shareId);
    }
  },[isConnected, shareId]);

  useEffect(() => {
    if (isConnected) {
      console.log("Trying to send position to share");
      sendPosition(position);
    }
  }, [isConnected, position]);

  // Rendering
  return (
    <div className="journey-page">
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
          litStreets={litStreets}
          sidewalks={sidewalks}
          policeStations={policeStations}
          hospitals={hospitals}
          destinationCoords={
            destinationCoords ||
            latLng(currentRoute[currentRoute.length - 1][0], currentRoute[currentRoute.length - 1][1])
          }
          theme={mapTheme}
        />
      ) : (
        <p>Loading route...</p>
      )}

      <div className="alert-container">
        <h3>Next Turn:</h3>
        <p>{currentInstructions[0]?.instruction || "Continue straight"}</p>
      </div>

      <ProgressBar progress={rerouted ? 75 : 50} />

      <div className="features-container">
      <SosButton onSOSActivated={handleSOSActivated} />
        <AlarmButton />
        <button className="feature-button" onClick={handleShare}>
          Share
        </button>
        <button className="feature-button" onClick={() => navigate("/")}>
          Cancel
        </button>
        <div className="theme-selector">
          <label htmlFor="map-theme">Map Theme:</label>
          <select
            id="map-theme"
            value={mapTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            {Object.keys(mapThemes).map((themeKey) => (
              <option key={themeKey} value={themeKey}>
                {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <WeatherInfo />
    </div>
  );
};

export default JourneyPage;
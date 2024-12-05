// my file
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MapComponent from "../../components/MapComponent/MapComponent";
import ProgressBar from "./ProgressBar";

import AlarmButton from "./AlarmButton";
import WeatherInfo from "./WeatherInfo";
import { PositionI, usePosition } from "../../hooks/usePosition";
import { fetchRoute } from "../../services/RoutingService";
import { latLng, LatLngTuple } from "leaflet";
import { decode } from "@here/flexpolyline";
import "../../styles/JourneyPage.css";
import { createShare } from "../../services/shareService";
import { RouteI, RouteRequestI } from "../../Types/Route";
import { fetchInfrastructureData, processInfrastructureData } from "../../services/overpassService";
import mapThemes from "../../components/MapComponent/MapThemes";
import { useSocket } from "../../hooks/useSocket";
import { TbNavigationCancel } from "react-icons/tb";
import Footer from "../../components/Footer"
import { MdEmergencyShare } from "react-icons/md";
import { MdOutlineAltRoute } from "react-icons/md";




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
    theme: initialTheme = "dark",
    transportMode = "pedestrian",
    destinationCoords = null,
  } = location.state || {};

  // All state variables used
  const [currentRoute, setCurrentRoute] = useState<LatLngTuple[]>(initialRoute); // Active route
  const [currentSummary, setCurrentSummary] = useState(initialSummary); // Route summary
  const [currentInstructions, setCurrentInstructions] = useState(initialInstructions); // Instructions
  const [userDeviationDetected, setUserDeviationDetected] = useState(false); // Track route deviation
  const [rerouted, setRerouted] = useState(false); // Track if rerouting occurred
  const [shareId, setShareId] = useState((localStorage.getItem("shareId") || ""));
  const [litStreets, setLitStreets] = useState<LatLngTuple[]>([]);
  const [sidewalks, setSidewalks] = useState<{ geometry: { lat: number; lon: number }[] }[]>([]);
  const [policeStations, setPoliceStations] = useState<LatLngTuple[]>([]);
  const [hospitals, setHospitals] = useState<LatLngTuple[]>([]);
  const [mapTheme, setMapTheme] = useState<string>(initialTheme);
  const {
    isConnected,
    sendPosition,
    connectSocket,
    hostShare,
  } = useSocket({});

  useEffect(() => {
    connectSocket();
    // don't include in dev dependencies!
  }, []);

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


  const handleThemeChange = (newTheme: string) => setMapTheme(newTheme);
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
  const handleReroute = useCallback(async () => {

    if (!latitude || !longitude || currentRoute.length === 0) return;

    try {
      // Get the last point in the route as the destination
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
useEffect(() => {
     const handleDeviation = () => {
    if (userDeviationDetected) console.log('user deviation detected"')
  }
  handleDeviation();
  }, [userDeviationDetected])

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

  async function handleShare () {
    try {
      if (shareId) {
        alert("Active share already in progress");
        return;
      }
      const route: RouteI = {polyline: currentRoute, instructions: currentInstructions, summary: currentSummary};
      console.log('sharing' , route)
      const result = await createShare(route);
      console.log(`UPDATED PAGE:  ${import.meta.env.BASE_URL}/observe/${result.data.id}?password=${result.data.password}`)
      setShareId(result.data.id);
      const data = {
        title: "Shared Location",
        text: "Please follow the link to access the shared location",
        url: import.meta.env.BASE_URL + "/share/" + result.data.id + "?password=" + result.data.password
      };
      if ("share" in navigator) {
        await navigator.share(data);
      } else {
        alert("data");
      }
    } catch (err) {
      console.error("Error during sharing: ", err);
    }
  }

/*  function handleCancel () {
    localStorage.removeItem("shareId");
    navigate("/");
  } */





  useEffect(() => {
    console.log('connected?', isConnected)
    if (isConnected && shareId) {
      hostShare(shareId);
    }
  }, [isConnected, shareId, hostShare]);
  useEffect(() => {
    console.log("Updated position:", position);
  }, [position]);

  useEffect(() => {
    if (isConnected) {
      console.log("Trying to send position to share");
      const typedPosition: PositionI = position;
      console.log('my typed position', typedPosition);
      sendPosition(typedPosition);
      console.log('this may have been sent.')
    }
  }, [isConnected, position, sendPosition, shareId]);

  // Rendering
  return (
    <div className="journey-page" >
      {
        currentRoute.length > 0 ? (
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            heading={heading}
            geolocationError={geoError || null
            }
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

      <div className="alert-container" >
        <h3>Next Turn: </h3>
        < p > {currentInstructions[0]?.instruction || "Continue straight"} </p>
      </div>

      < ProgressBar progress={rerouted ? 75 : 50} />

      <div className="features-container" >
       
        < AlarmButton />
        <MdEmergencyShare
          onClick={handleShare}
          style={{
            fontSize: "40px",
            color: "#EBEBEB",
            cursor: "pointer",
            transition: "transform 0.2s ease",
          }}
          title="Share Journey"
        />
        <TbNavigationCancel onClick={() => navigate("/")} style={{
          fontSize: "40px",
          color: "#EBEBEB",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }} title="Cancel Journey" />

        <div className="theme-selector">
          <img
            src="https://img.icons8.com/?size=100&id=37073&format=png&color=EBEBEB"
            alt="Map Theme Icon"
            className="icon"
          />
          < select
            id="map-theme"
            value={mapTheme}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            {
              Object.keys(mapThemes).map((themeKey) => (
                <option key={themeKey} value={themeKey} >
                  {themeKey.charAt(0).toUpperCase() + themeKey.slice(1)}
                </option>
              ))
            }
          </select>
        </div>
        <MdOutlineAltRoute className="reroute" onClick={handleReroute} style={{
          fontSize: "40px",
          color: "#EBEBEB",
          cursor: "pointer",
          transition: "transform 0.2s ease",
        }} title="Cancel Journey" />
      </div>

      < WeatherInfo />
      <Footer/>
    </div>
  );
};

export default JourneyPage;
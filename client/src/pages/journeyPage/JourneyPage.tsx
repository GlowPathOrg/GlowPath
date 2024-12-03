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
import { fetchInfrastructureData, processInfrastructureData } from "../../services/overpassService";
import mapThemes from "../../components/MapComponent/MapThemes";

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

  const handleReroute = async () => {
    if (!latitude || !longitude || currentRoute.length === 0) return;

    try {
      const destination = currentRoute[currentRoute.length - 1];
      const [destLat, destLon] = destination;

      const { polyline, summary, instructions, safetyData: reroutedSafetyData } = await fetchRoute(
        [latitude, longitude],
        [destLat, destLon],
        transportMode
      );

      const decoded = decode(polyline);
      if (decoded && Array.isArray(decoded.polyline)) {
        const newRoute: LatLngTuple[] = decoded.polyline.map(([lat, lon]) => [lat, lon] as LatLngTuple);
        setCurrentRoute(newRoute);
        setCurrentSummary(summary);
        setCurrentInstructions(instructions);
       
        setRerouted(true);
      }
    } catch (error) {
      console.error("Error during rerouting:", error);
    }
  };

  useEffect(() => {
    if (userDeviationDetected) handleReroute();
  }, [userDeviationDetected]);

  const handleShare = async () => {
    try {
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
  };

  useEffect(() => {
    if (socketError) {
      console.error("Socket error:", socketError);
    } else {
      sendPosition(position);
    }
  }, [position]);


  const handleSOSActivated = () => {
    console.log('SOS button activated on Journey Page!');
    
  };

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
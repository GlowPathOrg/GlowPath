import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { geocodeAddress } from "../services/geocodingService";
import { fetchRoute } from "../services/RoutingService";
import { usePosition } from "../hooks/usePosition";
import { LatLngTuple, latLng } from "leaflet";
import { decode } from "@here/flexpolyline";
import MapComponent from "../components/MapComponent/MapComponent";
import { InstructionsI, RouteRequestI, SummaryI } from "../Types/Route";

const WhereToPage: React.FC = () => {
  const navigate = useNavigate();
  const { latitude, longitude, error: geoError } = usePosition();
  const [originCoords, setOriginCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [destination, setDestination] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]); // Added state for search history
  const [route, setRoute] = useState<LatLngTuple[]>([]);
  const [summary, setSummary] = useState<SummaryI | null>(null);
  const [instructions, setInstructions] = useState<InstructionsI[]>([]);
  const [transportMode, setTransportMode] = useState<"pedestrian" | "publicTransport" | "bicycle" | "car">("pedestrian");
  const [error, setError] = useState<string | null>(null);

  const heading = 0; // Default heading

  useEffect(() => {
    if (latitude && longitude) {
      setOriginCoords({ lat: latitude, lon: longitude });
    }

    // Load search history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    setSearchHistory(savedHistory);
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!originCoords) {
      setError("Unable to fetch your current location. Please try again.");
      return;
    }

    try {
      const destinationCoords = await geocodeAddress(destination);
      const routeRequest: RouteRequestI = {
        origin: [originCoords.lat, originCoords.lon],
        destination: [destinationCoords.lat, destinationCoords.lon],
        transportMode: transportMode,
      }
      const routeResponse = await fetchRoute(
        routeRequest
      );


      const {
        polyline,
        instructions: routeInstructions,
        summary: routeSummary,
        litStreets,
        sidewalks,
        policeStations,
        hospitals,
      } = routeResponse;

      const decoded = decode(polyline);
      const routeCoordinates: LatLngTuple[] = decoded.polyline.map(([lat, lon]) => [lat, lon]);

      setRoute(routeCoordinates);
      setSummary({ length: routeSummary.length, duration: routeSummary.duration });
      setInstructions(routeInstructions);

      // Update search history
      const updatedHistory = [destination, ...searchHistory.filter((item) => item !== destination)].slice(0, 10); // Limit to 10 items
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));

      navigate("/navigation", {
        state: {
          originCoords: latLng(originCoords.lat, originCoords.lon),
          destinationCoords: latLng(destinationCoords.lat, destinationCoords.lon),
          route: routeCoordinates,
          summary: { length: routeSummary.length, duration: routeSummary.duration },
          instructions: routeInstructions,
          litStreets: litStreets.map(({ lat, lon }: { lat: number; lon: number }) => [lat, lon] as LatLngTuple),
          sidewalks,
          policeStations: policeStations.map(({ lat, lon }: { lat: number; lon: number }) => [lat, lon] as LatLngTuple),
          hospitals: hospitals.map(({ lat, lon }: { lat: number; lon: number }) => [lat, lon] as LatLngTuple),
          theme: "standard", // Default theme passed; can be changed in JourneyPage
        },
      });
    } catch (err) {
      console.error("Error during geocoding or fetching route:", err);
      setError("Failed to find the location or route. Please try again.");
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const handleHistoryClick = (item: string) => {
    setDestination(item);
  };

  return (
    <div className="where-to-page">
      <h1>Where to?</h1>

      {/* Current Location */}
      <div>
        <p>
          <strong>Your Current Location:</strong>{" "}
          {originCoords ? `${originCoords.lat.toFixed(4)}, ${originCoords.lon.toFixed(4)}` : "Fetching your location..."}
        </p>
        {geoError && <p style={{ color: "red" }}>Geolocation Error: {geoError}</p>}
      </div>

      {/* Destination Input */}
      <div>
        <label htmlFor="destination">Destination:</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Enter destination"
        />
      </div>

      {/* Transport Mode Selector */}
      <div>
        <label htmlFor="transport-mode">Transport Mode:</label>
        <select
          id="transport-mode"
          value={transportMode}
          onChange={(e) => setTransportMode(e.target.value as typeof transportMode)}
        >
          <option value="pedestrian">Walking</option>
          <option value="publicTransport">Public Transport</option>
          <option value="bicycle">Bicycle</option>
        </select>
      </div>

      {/* Search Button */}
      <button onClick={handleSearch} disabled={!originCoords}>
        Search
      </button>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="search-history">
          <h2>Search History</h2>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={index}>
                <button onClick={() => handleHistoryClick(item)}>{item}</button>
              </li>
            ))}
          </ul>
          <button onClick={clearHistory}>Clear History</button>
        </div>
      )}

      {/* Map Display */}
      {route.length > 0 && (
        <MapComponent
          latitude={latitude}
          longitude={longitude}
          heading={heading}
          geolocationError={geoError || null}
          route={route}
          summary={summary}
          instructions={instructions}
          originCoords={latLng(originCoords!.lat, originCoords!.lon)}
          destinationCoords={latLng(route[route.length - 1][0], route[route.length - 1][1])}
          theme="standard" // Default theme
          litStreets={[]} // Placeholder; detailed data handled in JourneyPage
          sidewalks={[]}
          policeStations={[]}
          hospitals={[]}

        />
      )}
    </div>
  );
};

export default WhereToPage;
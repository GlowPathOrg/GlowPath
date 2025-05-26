  import { useState, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { geocodeAddress } from "../services/geocodingService";
  import { fetchRoute } from "../services/RoutingService";
  import { usePosition } from "../hooks/usePosition";
  import { LatLngTuple, latLng } from "leaflet";
  import { decode } from "@here/flexpolyline";
  import MapComponent from "../components/MapComponent/MapComponent";
  import { InstructionsI, RouteRequestI, SummaryI } from "../Types/Route";
  import "../styles/WhereToPage.css"
  import { format } from "date-fns";
  import { FaHeart, FaRegHeart } from "react-icons/fa";
  import { useUser } from "../hooks/useUser";




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
    const [favoritePlaces, setFavoritePlaces] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<"history" | "favorites">("history");

    const { user, updateUser } = useUser();




    const heading = 0; // Default heading

    useEffect(() => {
      if (latitude && longitude) {
        setOriginCoords({ lat: latitude, lon: longitude });
      }

      // Load search history from localStorage
      const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
      setSearchHistory(savedHistory);
    }, [latitude, longitude]);


      useEffect(() => {
            if (user && user.places) {
              setFavoritePlaces(user.places)
            }
        }, [user]);

    const toggleFavorite = (place: string) => {
      let updatedFavorites;
      if (favoritePlaces.includes(place)) {
        updatedFavorites = favoritePlaces.filter((item) => item !== place);
      } else {
        updatedFavorites = [...favoritePlaces, place];

      }
      setFavoritePlaces(updatedFavorites);
      localStorage.setItem("favoritePlaces", JSON.stringify(updatedFavorites));
      submitFavorite(updatedFavorites)
    };

    const submitFavorite = async(newPlaces: string[]) => {
      if (!user) {
        console.warn(`[submitFavorite]: no user found`)
        return;
      }
      try {
        await updateUser({places: newPlaces})
      }
      catch (e) {
        console.error(`[submitFavorite]: Server error: ${e}`)
      }
    }

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
        setSummary({
          length: routeSummary.length,
          duration: routeSummary.duration,
          date: format(new Date(), "yyyy_MM_dd"),
        });
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
            summary: {
              length: routeSummary.length,
              duration: routeSummary.duration,
              date: format(new Date(), "yyyy_MM_dd"),
            },
            instructions: routeInstructions,
            litStreets: litStreets.map(({ lat, lon }: { lat: number; lon: number }) => [lat, lon] as LatLngTuple),
            sidewalks,
            policeStations: policeStations.map(({ lat, lon }: { lat: number; lon: number }) => [lat, lon] as LatLngTuple),
            hospitals: hospitals.map(({ lat, lon }: { lat: number; lon: number }) => [lat, lon] as LatLngTuple),
            theme: "standard", // Default theme passed; can be changed in JourneyPage
            destinationName: destination,
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
        {/* Destination Input */}
        <div className="destination-input">
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search here"
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

        {/* Tabs for Search History and Favorites */}
        <div className="history-tabs">
          <button
            className={activeTab === "history" ? "active-tab" : ""}
            onClick={() => setActiveTab("history")}
          >
            Search History
          </button>
          <button
            className={activeTab === "favorites" ? "active-tab" : ""}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "history" && searchHistory.length > 0 && (
            <div className="search-history">
              <ul>
                {searchHistory.map((item, index) => {
                  const isFavoritedItem = favoritePlaces.includes(item);
                  return (
                    <li key={index}>
                      <button
                        className="history-btn"
                        onClick={() => handleHistoryClick(item)}
                        style={{ flexGrow: 1 }}
                      >
                        {item}
                      </button>
                      <button
                        className="favorite-icon-button"
                        onClick={()=>{toggleFavorite(item)}}
                      >
                        {isFavoritedItem ? <FaHeart color="grey" /> : <FaRegHeart color="white" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <button id="history-btn" onClick={clearHistory}>
                Clear History
              </button>
            </div>
          )}

          {activeTab === "favorites" && favoritePlaces.length > 0 && (
            <div className="favorites-list">
              <ul>
                {favoritePlaces.map((item, index) => (
                  <li key={index}>
                    <button
                      className="favorite-btn"
                      onClick={() => handleHistoryClick(item)}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Map Display */}
        {route.length > 0 && (
          <div className="map-container">
            <MapComponent
              latitude={latitude}
              longitude={longitude}
              heading={heading}
              geolocationError={geoError || null}
              polyline={route}
              summary={summary}
              instructions={instructions}
              originCoords={latLng(originCoords!.lat, originCoords!.lon)}
              destinationCoords={latLng(route[route.length - 1][0], route[route.length - 1][1])}
              theme="standard"
              litStreets={[]}
              sidewalks={[]}
              policeStations={[]}
              hospitals={[]}
            />
          </div>
        )}
      </div>
    );
  };

  export default WhereToPage;
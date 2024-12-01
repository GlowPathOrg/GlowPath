
import { useLocation } from 'react-router-dom'; // Import useLocation to retrieve navigation state
import ProgressBar from './ProgressBar'; // Import ProgressBar component for journey progress
import SosButton from './SosButton'; // Import SosButton component for emergency
import WeatherInfo from './WeatherInfo'; // Import WeatherInfo component for weather alerts
import MapComponent from '../../components/MapComponent/MapComponent'; // Import MapComponent to render the map
import '../../styles/JourneyPage.css'; // Import CSS for styling
import AlarmButton from './AlarmButton'; // Import AlarmButton component for alarms



const JourneyPage: React.FC = () => {
  // Retrieve the navigation state passed via useNavigate
  const location = useLocation();
  const {
    originCoords,         // Starting coordinates of the journey
    destinationCoords,    // Ending coordinates of the journey
    route,                // Route polyline data
    summary,              // Summary data (distance, duration)
    instructions,         // Turn-by-turn navigation instructions
    theme,                // Map theme
  } = location.state || {}; // Destructure state and provide fallbacks in case data is undefined


  return (
    <div className="journey-page">
      {/* Map Section */}
      <MapComponent
        latitude={originCoords?.lat || 0} // Pass the latitude of the origin; fallback to 0 if undefined
        longitude={originCoords?.lng || 0} // Pass the longitude of the origin; fallback to 0 if undefined
        geolocationError={null} // No geolocation error for this case
        route={route || []} // Pass the route polyline; fallback to an empty array
        summary={summary || { distance: 0, duration: 0 }} // Pass the journey summary; fallback to default values
        instructions={instructions || []} // Pass the navigation instructions; fallback to an empty array
        originCoords={originCoords || null} // Pass the origin coordinates; fallback to null
        destinationCoords={destinationCoords || null} // Pass the destination coordinates; fallback to null
        theme={theme || 'standard'} // Pass the map theme; fallback to 'standard'
      />

      {/* Progress Bar Section */}
      <ProgressBar progress={0} /> {/* Display a progress bar for the journey; default progress is 0 */}

      {/* Buttons and Features Section */}
      <div className="features-container">
        <SosButton /> {/* Emergency button for sending SOS alerts */}
        <AlarmButton /> {/* Alarm button for safety purposes */}
        <button className="feature-button">Chat</button> {/* Button to access chat functionality */}
        <button className="feature-button">Share</button> {/* Button to share journey details */}
        <button className="feature-button">Report</button> {/* Button to report issues or incidents */}
      </div>

      {/* Weather Alerts Section */}
      <WeatherInfo /> {/* Display weather information or alerts */}
    </div>
  );
};

export default JourneyPage;
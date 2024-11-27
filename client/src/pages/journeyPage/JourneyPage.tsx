import ProgressBar from './ProgressBar';
import SosButton from './SosButton';
import WeatherInfo from './WeatherInfo';
import MapComponent from '../../components/MapComponent';
import '../../styles/JourneyPage.css';
import AlarmButton from './AlarmButton';


const JourneyPage: React.FC = () => {
 
  return (
    <div className="journey-page">
      {/* Map Section :The MapComponent now receives origin, destination, and transportMode as props to fetch and render the route.*/}
      <MapComponent />

      {/* Progress Bar */}
      <ProgressBar />

      {/* Buttons and Features */}
      <div className="features-container">
        <SosButton />
        <AlarmButton />
        <button className="feature-button">Chat</button>
        <button className="feature-button">Share</button>
        <button className="feature-button">Report</button>
      </div>

      {/* Weather Alerts */}
      <WeatherInfo />
    </div>
  );
};

export default JourneyPage;
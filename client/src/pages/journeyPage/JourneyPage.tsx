import ProgressBar from './ProgressBar';
import SosButton from './SosButton';
import WeatherInfo from './WeatherInfo';
import MapComponent from '../../components/MapComponent';
import '../../styles/JourneyPage.css';
import AlarmButton from './AlarmButton';
import { usePosition } from '../../hooks/usePosition';
import Navbar from '../../components/Navbar';


const JourneyPage: React.FC = () => {

  const { latitude, longitude, error } = usePosition();
  return (
    <div className="journey-page">
      <Navbar/>
      {/* Map Section :The MapComponent receives origin, destination, and transportMode as props to fetch and render the route.*/}
      <MapComponent
      latitude={latitude}
      longitude={longitude}
      geolocationError={error || null}/>

      {/* Progress Bar */}
      <ProgressBar progress={0}/>

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

import ProgressBar from './ProgressBar'
import SosButton from './SosButton';
import WeatherInfo from './WeatherInfo';
import MapComponent from '../../components/MapComponent'
import '../../styles/JourneyPage.css';
import AlarmButton from './AlarmButton';
import Navbar from '../../components/Navbar';



const JourneyPage: React.FC = () => {
  return (
    <div className="journey-page">
      <div>  <Navbar /></div>
      {/* Map Section here*/}
  <MapComponent/>

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
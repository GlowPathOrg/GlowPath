
import ProgressBar from './progressBar'
import SosButton from './SosButton';
import WeatherInfo from './WeatherInfo';


const JourneyPage: React.FC = () => {
  return (
    <div className="journey-page">
      {/* Map Section here*/}
  

      {/* Progress Bar */}
      <ProgressBar />

      {/* Buttons and Features */}
      <div className="features-container">
        <SosButton />
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
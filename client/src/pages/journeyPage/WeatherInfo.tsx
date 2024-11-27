
const WeatherInfo: React.FC = () => {
  const weather = 'Clear skies'; // we need to replace with real weather data from the API

  return (
    <div className="weather-info">
      <p>Weather: {weather}</p>
    </div>
  );
};

export default WeatherInfo;
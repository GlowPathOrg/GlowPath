import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePosition } from '../../hooks/usePosition';
import "../../styles/WeatherInfo.css"

const WeatherInfo: React.FC = () => {
  const { latitude, longitude, error: geoError } = usePosition(); // using geolocation to get coordinates
  const [weather, setWeather] = useState<string>('Fetching weather...');
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null); //for weather icon
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!latitude || !longitude) return; 

    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
        
        const response = await axios.get(url);
        const { weather, main } = response.data;

        setWeather(weather[0].description);
        setTemperature(main.temp);
        setWeatherIcon(weather[0].icon); 
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Failed to fetch weather data.');
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  //from the API docs
  const iconUrl = weatherIcon
    ? `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    : null; 

  return (
    <div className="weather-info">
      {geoError && <p style={{ color: 'red' }}>Geolocation Error: {geoError}</p>}
      {error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {iconUrl && <img src={iconUrl} alt="Weather icon" width={50} />}
          <p>
            Weather: {weather} {temperature !== null && `(${temperature}°C)`}
          </p>
        </div>
      )}
    </div>
  );
};

export default WeatherInfo;
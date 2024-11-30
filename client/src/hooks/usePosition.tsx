import { useState, useEffect } from 'react';

interface Position {
  timestamp: number;
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  error?: string;
}

export const usePosition = () => {
  const [position, setPosition] = useState<Position>({});
  const [error, setError] = useState("");

  function handleSuccess (position: GeolocationPosition) {
    setPosition({
      timestamp: position.timestamp,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed
    });
  }

  function handleError (error: GeolocationPositionError) {
    setError(error.message);
  }

  useEffect(() => {
    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 60000
      }
      navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    } else {
      setError("Navigator doesn't support geolocation");
    }
  }, [])
  return {...position, error} as Position;
}
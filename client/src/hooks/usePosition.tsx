import { useState, useEffect, useRef } from 'react';

export interface PositionI {
  timestamp: number | null;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  error?: string;
}

const initialPosition = {
  timestamp: null,
  latitude: null,
  longitude: null,
  accuracy: null,
  heading: null,
  speed: null,
  error: ""
};

export const usePosition = () => {
  const [position, setPosition] = useState<PositionI>(initialPosition);
  const [error, setError] = useState("");
  const watchIdRef = useRef<number | null>(null); // Use a ref to store the watcher ID

  function handleSuccess (position: GeolocationPosition) {
    setPosition({
      timestamp: position.timestamp,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      heading: position.coords.heading,
      speed: position.coords.speed,
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
        timeout: 600000,
      };
      console.log("Initializing watcher on geolocation");
      watchIdRef.current = navigator.geolocation.watchPosition(handleSuccess, handleError, options);
    } else {
      setError("Navigator doesn't support geolocation");
    }
    return () => {
      console.log("Clearing watcher on geolocation because component is about to unmount");
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []); // Dependencies remain empty since `watchIdRef` is a ref
  console.log('my position', position.latitude)
  return { ...position, error } as PositionI;
};

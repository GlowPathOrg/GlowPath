import { useEffect } from "react";
import { LatLng, latLngBounds } from "leaflet";
import {useMap} from "react-leaflet"

interface FitBoundsProps {
  origin: LatLng;
  destination: LatLng | null;
}

// Adjust map view to fit both origin and destination markers
const FitBounds: React.FC<FitBoundsProps> = ({ origin, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (origin && destination) {
      const bounds = latLngBounds([origin, destination]); // Create bounds
      map.fitBounds(bounds, { padding: [50, 50] }); // Fit map to bounds with padding
    }
  }, [origin, destination, map]);

  return null;
};

export default FitBounds;
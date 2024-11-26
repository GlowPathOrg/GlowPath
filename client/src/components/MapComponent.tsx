import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { latLng, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Amenity, fetchAmenities } from '../services/amenitiesService';



const MapComponent: React.FC = () => {
  const [searchParams] = useSearchParams(); // query parameters
  const [position, setPosition] = useState<LatLng>(latLng(52.4771, 13.4310)); // this is the default location
  const [address, setAddress] = useState<string>('Default Location'); // address on the popup
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const mapStyle = { height: '80vh', width: '90vw' }; // might move later?


  // setting user's location
  useEffect(() => {
    const lat = parseFloat(searchParams.get('lat') || '52.4771');
    const lon = parseFloat(searchParams.get('lon') || '13.4310');
    const addr = searchParams.get('address') || 'Default Location';

    // Update map position and address
    setPosition(latLng(lat, lon));
    setAddress(addr);
  }, [searchParams]);

    // setting safe place markers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAmenities(500, position);

        if (data && Array.isArray(data)) {
          console.log('found: ', data)
          setAmenities(data)

        }
        else throw new Error ('Invalid Response received or no amenities found.')
      }
      catch (error) {
        console.log('error with fetchAmenities function on load: ', error);

      }
    };
    fetchData();
  }, [position]);



  return (
    <div className="map-component">
      <MapContainer center={position} zoom={14} scrollWheelZoom={false} style={mapStyle}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            {address} <br />
            Coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </Popup>
        </Marker>
        {amenities && amenities.map((amenity: Amenity, index: number) => {
          let { lat, lon } = amenity;
          const {tags, type} = amenity;


          if (!lat || !lon || !tags) {
            if (type === 'way' && Array.isArray(amenity.geometry) && amenity.geometry) {
            /*   lat = amenity.geometry[0].lat.toFixed(4);
              lon = amenity.geometry[0].lon.toFixed(4); */
            } else {
            console.error(`Missing data for amenity at index ${index}`, 'Lat: ', amenity.lat, amenity.tags, amenity.lon);
            return null;}
          }


          const name = tags.name || 'Unnamed Amenity';
          return (
            <Marker key={index} position={latLng(lat, lon)}>
              <Popup>
                {name} <br />
                {tags.public_transport ? tags.public_transport : ``} <br />
                {tags.lit ? `Lit space` : ``} <br />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
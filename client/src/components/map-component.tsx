import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './map-component.css'
import { useState } from 'react';

// note this will eventually be a prop, should look like this!


const MapComponent: React.FC = () => {
    const mockLocation = [52.4771, 13.4310];
    const [isDarkMode, setDarkMode] = useState(true);

    const toggleDarkMode = () => {
        console.log('dark mode is: ', isDarkMode);
        setDarkMode(!isDarkMode)
    }
    console.log('dark mode is now: ', isDarkMode);



    return (
        <MapContainer key={isDarkMode ? 'dark' : 'light'}
            center={mockLocation}
            zoom={13}
            scrollWheelZoom={false}
            className={isDarkMode ? 'dark' : 'light'}>
            <div className='map-controls'>
                <input
                    placeholder='search...'></input>
                <button>Go</button>
                <button onClick={toggleDarkMode}>{isDarkMode ? 'Go Light' : 'Go Dark'}</button>

            </div>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mockLocation}>
                <Popup>
                    Here you are!
                </Popup>
            </Marker>
        </MapContainer>

    )
}

export default MapComponent
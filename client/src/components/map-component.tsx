import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

// note this will eventually be a prop, should look like this!


const MapComponent: React.FC = () => {
    const mockLocation = [52.4771, 13.4310];
    const homeMapClass = { height: "80vh", width: "90vw" };


    return (
        <MapContainer center={mockLocation} zoom={13} scrollWheelZoom={false}
        style={homeMapClass}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mockLocation}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>

    )
}

export default MapComponent
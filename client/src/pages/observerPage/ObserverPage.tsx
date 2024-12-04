import { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket.js';
import { latLng } from 'leaflet';
import MapComponent from '../../components/MapComponent/MapComponent.js';



const ObserverPage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const password = searchParams.get("password") || "";


  const {
    isConnected,
    connectSocket,
    position,
    error,
    joinShare,
  } = useSocket({ password });

  useEffect(() => { if (!position) { console.log('not receiving position yet') } else console.log('position in observer page is ', position.latitude) }, [position])

  useEffect(() => {
    connectSocket();
    if (id) joinShare(id);
  }, [connectSocket, id, joinShare]);

  useEffect(() => {
    if (id && isConnected) {
      console.log("You are connected and have an id!" + id);

      //  joinShare(id);
    }
  }, [id, isConnected]);

  return (
    <div>
      <h1>Observer Page</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>
      {error && <p className="error">Error: {error}</p>}
      <p>
        Current Position:{" "}
        {position ? (
          <>
            Latitude: {position.latitude}, Longitude: {position.longitude}
          </>
        ) : (
          "Waiting for position updates..."
        )}

      </p>
      {position &&  (
      <>
        <MapComponent
          latitude={position.latitude}
            longitude={position.longitude}
            heading={position.heading}
          geolocationError={null  }
          route={currentRoute}
          summary={currentSummary}
          instructions={currentInstructions}
          originCoords={latLng(currentRoute[0][0], currentRoute[0][1])}
          litStreets={litStreets}
          sidewalks={sidewalks}
          policeStations={policeStations}
          hospitals={hospitals}
          destinationCoords={
          destinationCoords ||
          latLng(currentRoute[currentRoute.length - 1][0], currentRoute[currentRoute.length - 1][1])
        }

        /></>
)}
    </div>
  );
}

export default ObserverPage;
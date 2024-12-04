import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket.js';
import { latLng } from 'leaflet';
import MapComponent from '../../components/MapComponent/MapComponent.js';
import { accessShare } from '../../services/shareService.js';
import { RouteI } from '../../Types/Route.js';

const ObserverPage = () => {
  const [route, setRoute] = useState<RouteI>({polyline: [], instructions: [], summary: {duration: 0, length: 0}});
  const [searchParams] = useSearchParams();
  const { id } = useParams() || "";
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

  async function getShareOnLoad () {
    const result: any = await accessShare(id as string, password);
    if (result.data) {
      setRoute(result.data.route);
      console.log("Set route to result of API request");
      console.log(result.data);
    }
  }

  useEffect(() => {
    if (id && password) {
      getShareOnLoad();
    }
  },[])

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
     {position && route ? (
      <>
        <MapComponent
          latitude={position.latitude}
          longitude={position.longitude}
          heading={position.heading}
          geolocationError={null}
          route={route?.polyline}
          summary={route?.summary}
          instructions={route?.instructions}
          litStreets={[]}
          sidewalks={[]}
          policeStations={[]}
          hospitals={[]}
          originCoords={latLng(route?.polyline[0][0], route?.polyline[0][1])}
          destinationCoords={latLng(route?.polyline[route.polyline.length - 1][0], route?.polyline[route.polyline.length - 1][1])}
          theme={"standard"}
          />
      </>
) : "No position or route available"
}
    </div>
  );
}

export default ObserverPage;
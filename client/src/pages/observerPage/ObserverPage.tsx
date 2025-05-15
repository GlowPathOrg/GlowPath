import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket.js';
import { latLng } from 'leaflet';
import MapComponent from '../../components/MapComponent/MapComponent.js';
import { accessShare } from '../../services/shareService.js';
import { RouteI } from '../../Types/Route.js';
import "../../styles/ObserverPage.css";
import { ShareI } from '../../Types/Share.js';
import { AxiosResponse } from 'axios';

const ObserverPage = () => {
  const [route, setRoute] = useState<RouteI>({polyline: [], instructions: [], summary: {duration: 0, length: 0, date: ""}});
  const [sharerName, setSharerName] = useState("");
  const [searchParams] = useSearchParams();
  const { id } = useParams() || "";
  const password = searchParams.get("password") || "";

  const { isConnected, connectSocket, position, error, joinShare } = useSocket({
    password,
  });

  // Fetch shared route on component load
 /*  useEffect(() => {
    const fetchRoute = async () => {
      if (!id || !password) return;
      try {
        const result: PartialShare = await accessShare(id as string, password);
        if (result?.data?.route) {
          console.log("Fetched route from API:", result.data.route);
          setRoute(result.data.route);
        }
      } catch (err) {
        console.error("Error fetching route:", err);
      }
    };

    fetchRoute();
  }, [id, password]); */

  // Connect to WebSocket and join the share room
  useEffect(() => {
    connectSocket();
    if (id) joinShare(id);
  }, [connectSocket, id, joinShare]);

  // Log WebSocket connection status and position updates
  useEffect(() => {
    if (isConnected) {
      console.log(`Connected to WebSocket with ID: ${id}`);
    }
  }, [id, isConnected]);

  async function getShareOnLoad () {
    const result: AxiosResponse<ShareI> = await accessShare(id as string, password);
    if (result.data) {
      setRoute(result.data.route);
      setSharerName(result.data.owner.firstName);
      console.log("Set route to result of API request");
      console.log(result.data);
    }
  }

  useEffect(() => {
    if (id && password) {
      getShareOnLoad();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <div className="observer-sharer"><span>{sharerName}</span> has shared their position with you:</div>
      {error && <div className="observer-error">Error: {error}</div>}
     {position && route ? (
      <>
        <MapComponent
          latitude={position.latitude}
          longitude={position.longitude}
          heading={position.heading}
          geolocationError={null}
          polyline={route.polyline}
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
) : <div className="observer-wait">Waiting to receive position...</div>
}
    </div>
  );
};

export default ObserverPage

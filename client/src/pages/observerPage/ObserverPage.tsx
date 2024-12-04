import {  useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../../hooks/useSocket.js';


const ObserverPage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const password = searchParams.get("password") || "";


  const {
    isConnected,
    position,
    error,
    joinShare,
  } = useSocket({ password });




  useEffect(() => {
    if (id && isConnected) {
      console.log("Socket connecting to room " + id);
      joinShare(id);
    }
  },[id, isConnected, joinShare]);

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
    </div>
  );
}

export default ObserverPage;
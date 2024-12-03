import { io } from "socket.io-client";
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
const socketServer = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

const ObserverPage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const password = searchParams.get("password") || "";
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");

  const socket = io(socketServer, {
    auth: { password }
  });

  function joinShare (id: string) {
    console.log("joinShare is called with id " + id);
    console.log("isConnected: ", isConnected);
    if (isConnected) {
      socket.emit("join-share", id, (response: string) => {
        console.log(response);
      });
    }
  }

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
      setError(error.message);
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      console.log("Socket about to get disconnected");
    })

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      console.log("Removed all event listeners because component is about to dismount");
    }

  },[]);

  useEffect(() => {
    if (id && isConnected) {
      console.log("Trying to join share " + id);
      joinShare(id);
    }
  },[id, isConnected]);

  return (
  <>
    <h1>{isConnected}</h1>
  </>
  );

}

export default ObserverPage;
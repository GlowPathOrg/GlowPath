import { io } from "socket.io-client";
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
const socketServer = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

const ObserverPage = () => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const password = searchParams.get("password") || "";
  const [isConnected, setIsConnected] = useState(false);
  const [position, setPosition] = useState(false);

  const socket = io(socketServer, {
    auth: { password }
  });

  function joinShare (id: string) {
    if (isConnected) {
      socket.emit("join-share", id, (response: string) => {
        console.log(response);
      });
    }
  }

  useEffect(() => {

    socket.on("connect", () => {
      console.log("Socket connected with id " + socket.id);
      setIsConnected(true);
    });

    socket.on("connect_error", (error) => {
      console.log(error.message);
      setIsConnected(false);
    });

    socket.on("disconnect", () => {
      console.log("Socket about to get disconnected");
    })

    socket.on("position", (position) => {
      console.log(position);
      setPosition(position);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("position");
      console.log("Removed all event listeners because component is about to dismount");
    }

  },[]);

  useEffect(() => {
    if (id && isConnected) {
      console.log("Socket connecting to room " + id);
      joinShare(id);
    }
  },[id, isConnected]);

  return (
  <>
    <h1>{position}</h1>
  </>
  );

}

export default ObserverPage;
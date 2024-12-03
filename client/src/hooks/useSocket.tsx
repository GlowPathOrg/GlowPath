import { io } from "socket.io-client";
import { useState, useEffect } from 'react';
import { getToken } from "../utilities/token";
import { PositionI } from "./usePosition";
const socketServer = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

interface MessageI {
  text: string;
}

interface AlarmI {
  text: string;
}

export const useSocket = ({ password }: {password?: string}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [position, setPosition] = useState<PositionI | null>();
  const [messages, setMessages] = useState<MessageI[] | []>([]);
  const [alarms, setAlarms] = useState<AlarmI[] | []>([]);
  const [error, setError] = useState("");

  const socket = io(socketServer, {
    autoConnect: false,
    auth: (cb) => {
      cb(password ? {password} : {token: getToken()}) // pass credential to socket server
    }
  });

  function connectSocket () {
    console.log("socket.connect() was called");
    console.log("isConnected: ", isConnected);
    if (!isConnected) socket.connect();
  }

  function hostShare (id: string) {
    if (isConnected) socket.emit("host-share", id);
  }

  function joinShare (id: string) {
    console.log("joinShare is called with id " + id);
    console.log("isConnected: ", isConnected);
    if (isConnected) {
      socket.emit("join-share", id, (response: string) => {
        console.log(response);
      });
    }
  }

  function sendPosition (position: PositionI) {
    if (isConnected) socket.emit("position", position);
  }

  function sendMessage (message: MessageI) {
    if (isConnected) socket.emit("message", message);
  }

  function sendAlarm (alarm: AlarmI) {
    if (isConnected) socket.emit("alarm", alarm);
  }

  useEffect(() => {

    console.log("useEffect is in action");

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

    socket.on("location", (newPosition) => {
      setPosition(newPosition);
    });

    socket.on("message", (newMessage) => {
      setMessages(previous => [...previous, newMessage]);
    });

    socket.on("alarm", (newAlarm) => {
      setAlarms(previous => [...previous, newAlarm]);
    })

    return () => {
      console.log("Socket will get disconnected because component gets unmounted");
      setIsConnected(false);
      socket.disconnect();
    }

  },[]);

  return { isConnected, position, messages, alarms, error, sendPosition, sendMessage, sendAlarm, hostShare, joinShare, connectSocket };
}
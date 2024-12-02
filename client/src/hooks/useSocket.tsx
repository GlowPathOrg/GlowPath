import { io } from "socket.io-client";
import { useState, useEffect } from 'react';
import { getToken } from "../utilities/token";
import { PositionI } from "./usePosition";
const socketServer = import.meta.env.BACKEND_URL;

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
    auth: cb => cb(
      () => {
        if (password) {
          return {password};
        } else {
          return {token: getToken()}
        }
      }
    )
  });

  function connectSocket () {
    if (!isConnected) socket.connect();
  }

  function hostShare (id: string) {
    if (isConnected) socket.emit("host-share", id);
  }

  function joinShare (id: string) {
    if (isConnected) socket.emit("join-share", id);
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

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket.on("connect_error", (error) => {
      console.log("Socket error: " + error);
      setError(error.message);
      setIsConnected(false);
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
      socket.disconnect();
    }

  },[]);

  return { position, messages, alarms, error, sendPosition, sendMessage, sendAlarm, hostShare, joinShare, connectSocket };
}
import { io, Socket } from "socket.io-client";
import { useState, useEffect, useRef } from 'react';
import { getToken } from "../utilities/token";
import { PositionI } from "./usePosition";
const socketServer = import.meta.env.VITE_BACKEND_URL || "http://localhost:3002";

interface MessageI {
  text: string;
}

interface AlarmI {
  text: string;
}
let socket: Socket | null;

export const useSocket = ({ password }: {password?: string}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [position, setPosition] = useState<PositionI | null>();
  const [messages, setMessages] = useState<MessageI[] | []>([]);
  const [alarms, setAlarms] = useState<AlarmI[] | []>([]);
  const [error, setError] = useState("");

  const initialized = useRef(false);
  if (!socket) {
    socket = io(socketServer, {
      auth: (cb) => {
        cb(password ? { password } : { token: getToken() }); // Pass credentials to the socket server
      },
      autoConnect: false, // Prevent auto-connect on initialization
    });
  }

  const connectSocket = () => {
    if (!isConnected) {
      console.log("socket.connect() was called");
      socket?.connect();
    }
  };

  function hostShare (id: string) {
    if (isConnected && socket) socket.emit("host-share", id);
  }

  function joinShare (id: string) {
    console.log("joinShare is called with id " + id);
    console.log("isConnected: ", isConnected);
    if (isConnected && socket) {
      socket.emit("join-share", id, (response: string) => {
        console.log(response);
      });
    }
  }

  function sendPosition (position: PositionI) {
    if (isConnected && socket) socket.emit("position", position);
  }

  function sendMessage (message: MessageI) {
    if (isConnected && socket) socket.emit("message", message);
  }

  function sendAlarm (alarm: AlarmI) {
    if (isConnected && socket) socket.emit("alarm", alarm);
  }

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    console.log("Socket useEffect is in action");

    socket?.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    socket?.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setError(error.message);
      setIsConnected(false);
    });

    socket?.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socket?.on("location", (newPosition: PositionI) => {
      setPosition(newPosition);
    });

    socket?.on("message", (newMessage: MessageI) => {
      setMessages((previous) => [...previous, newMessage]);
    });

    socket?.on("alarm", (newAlarm: AlarmI) => {
      setAlarms((previous) => [...previous, newAlarm]);
    });


    return () => {
      console.log("Socket will disconnect because component gets unmounted");
      socket?.off("connect");
      socket?.off("connect_error");
      socket?.off("disconnect");
      socket?.off("location");
      socket?.off("message");
      socket?.off("alarm");
      socket?.disconnect();
    };
  }, []);

  return { isConnected, position, messages, alarms, error, sendPosition, sendMessage, sendAlarm, hostShare, joinShare, connectSocket };
}
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
    } else console.log('am i connected in hook?', isConnected)
  };

  function hostShare (id: string) {
    if (isConnected && socket) socket.emit("host-share", id);
  }

  function joinShare (id: string) {
    console.log("joinShare is called with id " + id);
    console.log("isConnected: ", isConnected);
    if (isConnected && socket) {
      socket.emit("join-share", id, (response: string) => {
        console.log('here is the response: ', response);
      });
    }
  }

  function sendPosition (position: PositionI) {
    if (!position) {
      console.warn("can't find position!");
      return;
    }
    if (isConnected && socket) {
      console.log("Sending position to room:", position);
      socket.emit("position", position);
    }
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
      console.log("setting position:", newPosition);
      setPosition(newPosition);
    });

    socket?.on("message", (newMessage: MessageI) => {
      console.log('message received!')
      setMessages((previous) => [...previous, newMessage]);
    });

    socket?.on("alarm", (newAlarm: AlarmI) => {
      console.log('alarm received')
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
    // by no means add useConnect to dev dependencies! it messes everything up.
  }, []);

  return { isConnected, position, messages, alarms, error, sendPosition, sendMessage, sendAlarm, hostShare, joinShare, connectSocket };
}
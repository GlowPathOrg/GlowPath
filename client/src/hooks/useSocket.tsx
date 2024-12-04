import { io, Socket } from "socket.io-client";
import { useState, useEffect, useRef } from 'react';
import { getToken } from "../utilities/token";
import { PositionI } from "./usePosition";
const socketServer = import.meta.env.VITE_BACKEND_URL || "https://glowpath-a7681fe09c29.herokuapp.com";

interface MessageI {
  text: string;
}

interface AlarmI {
  text: string;
}
let socket: Socket | null;

export const useSocket = ({ password }: { password?: string }) => {
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
      socket?.connect();
    } else console.log('am i connected in hook?', isConnected)
  };

  function hostShare (id: string) {
    if (isConnected && socket) socket.emit("host-share", id);
  }

  function joinShare (id: string) {
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
    if (!socket) {
      console.log('cannot find')
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
      console.log("Socket connected in useSocket");
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


    socket?.on("position", (newPosition) => {
      console.log("Client: Received position update from server:", newPosition);
      if (!newPosition) {
        console.error("Client: Received empty position data.");
        return;
      }
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
      socket?.off("message");
      socket?.off("alarm");
      socket?.disconnect();
    };
    // by no means add useConnect to dev dependencies! it messes everything up.
  }, []);

  return { isConnected, position, messages, alarms, error, sendPosition, sendMessage, sendAlarm, hostShare, joinShare, connectSocket };
}
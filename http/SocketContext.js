import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { api_end_point } from "../constants/colors";

const SocketContext = createContext();

export const SocketProvider = ({ children, authToken }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const headers = authToken
      ? {
          Authorization: authToken.includes("Bearer ")
            ? authToken
            : `Bearer ${authToken}`,
        }
      : {};
    const newSocket = io.connect(api_end_point, { extraHeaders: headers });

    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [authToken]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

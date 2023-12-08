"use client";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { BACKEND_URL } from "@/lib/constants";

let socket: Socket | null = null;

const SocketContext = createContext<Socket | null>(socket);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if (typeof window !== undefined) {
      if (!socket) socket = io(BACKEND_URL);
      socket.on(
        "taskFinished",
        ({
          message,
          ok,
          output,
        }: {
          message: string;
          ok: boolean;
          output: Object;
        }) => {
          console.log("taskFinished: ", message, ok, output);
        }
      );

      return () => {
        socket?.disconnect();
      };
    }
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  const _socket = useContext(SocketContext);
  return _socket;
};

export { SocketContext, SocketProvider, useSocket };

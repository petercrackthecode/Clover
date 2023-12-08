"use client";
import { Socket, io } from "socket.io-client";
import { useEffect } from "react";
import { BACKEND_URL } from "@/lib/constants";

let socket: Socket;

export function useSocket() {
  useEffect(() => {
    if (!socket) socket = io(BACKEND_URL);

    return () => {
      socket.disconnect();
    };
  }, []);

  return socket;
}

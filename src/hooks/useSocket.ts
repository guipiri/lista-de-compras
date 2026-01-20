"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(listId?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Inicializa a conexão Socket.io
    fetch("/api/socket/io");

    const socketInstance = io({
      path: "/api/socket/io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to socket server:", socketInstance.id);
      
      // Fazer join na room da lista se houver listId
      if (listId) {
        socketInstance.emit("join:list", listId);
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", reason);
    });

    setSocket(socketInstance);

    // Cleanup function para deixar a room ao desmontar
    return () => {
      if (listId) {
        socketInstance.emit("leave:list", listId);
      }
      socketInstance.disconnect();
    };
  }, [listId]);

  return socket;
}

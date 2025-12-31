import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  if (!io) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
      },
      transports: ["websocket", "polling"],
    });

    setupSocketHandlers(io);
  }

  return io;
}

function setupSocketHandlers(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("item:create", (data) => {
      console.log("📝 Item created event:", data);
      socket.broadcast.emit("item:created", data);
    });

    socket.on("item:update", (data) => {
      console.log("✏️ Item updated event:", data);
      socket.broadcast.emit("item:updated", data);
    });

    socket.on("item:delete", (data) => {
      console.log("🗑️ Item deleted event:", data);
      socket.broadcast.emit("item:deleted", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
  });
}

export function getSocketIO(): SocketIOServer | null {
  return io;
}

export function broadcastItemCreated(item: any) {
  if (io) {
    io.emit("item:created", item);
  }
}

export function broadcastItemUpdated(item: any) {
  if (io) {
    io.emit("item:updated", item);
  }
}

export function broadcastItemDeleted(itemId: string) {
  if (io) {
    io.emit("item:deleted", itemId);
  }
}

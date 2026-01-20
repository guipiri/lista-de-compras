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

    // Evento para entrar em uma room específica da lista
    socket.on("join:list", (listId: string) => {
      console.log(`📍 Client ${socket.id} joining list room: ${listId}`);
      socket.join(`list:${listId}`);
      socket.data.currentListId = listId;
    });

    // Evento para sair de uma room da lista
    socket.on("leave:list", (listId: string) => {
      console.log(`📍 Client ${socket.id} leaving list room: ${listId}`);
      socket.leave(`list:${listId}`);
    });

    socket.on("item:create", (data) => {
      console.log("📝 Item created event:", data);
      const listId = data.listId;
      if (listId) {
        // Apenas emitir para clientes na mesma lista
        io!.to(`list:${listId}`).emit("item:created", data);
      }
    });

    socket.on("item:update", (data) => {
      console.log("✏️ Item updated event:", data);
      const listId = data.listId;
      if (listId) {
        // Apenas emitir para clientes na mesma lista
        io!.to(`list:${listId}`).emit("item:updated", data);
      }
    });

    socket.on("item:delete", (data) => {
      console.log("🗑️ Item deleted event:", data);
      const listId = data.listId;
      if (listId) {
        // Apenas emitir para clientes na mesma lista
        io!.to(`list:${listId}`).emit("item:deleted", data);
      }
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
    const listId = item.listId;
    if (listId) {
      io.to(`list:${listId}`).emit("item:created", item);
    }
  }
}

export function broadcastItemUpdated(item: any) {
  if (io) {
    const listId = item.listId;
    if (listId) {
      io.to(`list:${listId}`).emit("item:updated", item);
    }
  }
}

export function broadcastItemDeleted(itemId: string, listId: string) {
  if (io) {
    io.to(`list:${listId}`).emit("item:deleted", itemId);
  }
}

import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types/socket";

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket.io already running");
  } else {
    console.log("Socket.io is initializing...");
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);

      socket.on("item:create", (data) => {
        console.log("📝 Broadcasting item created:", data);
        socket.broadcast.emit("item:created", data);
      });

      socket.on("item:update", (data) => {
        console.log("✏️ Broadcasting item updated:", data);
        socket.broadcast.emit("item:updated", data);
      });

      socket.on("item:delete", (data) => {
        console.log("🗑️ Broadcasting item deleted:", data);
        socket.broadcast.emit("item:deleted", data);
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;

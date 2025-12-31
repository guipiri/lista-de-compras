import { initializeSocket } from "./lib/socketServer";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("Initializing Socket.io");
    // Socket.io will be initialized when the app starts
  }
}

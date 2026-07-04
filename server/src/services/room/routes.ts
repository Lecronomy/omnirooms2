import { Hono } from "hono";
import { upgradeWebSocket } from "hono/deno";
import { WSContext } from "hono/ws";

import { verifyToken } from "./utils.ts";

const rooms = new Map<string, Set<WSContext>>();
const socketUsers = new Map<WSContext, string>(); // Replace string with actual user type when available if needed

const roomRouter = new Hono();

// WebSockets engine for room communication
roomRouter.get(
  "/:roomName/ws",
  upgradeWebSocket((c) => {
    const roomName = c.req.param("roomName");

    return {
      onOpen: (_event, ws) => {
        if (!roomName) {
          // Invalid room name, close the connection
          ws.close();
          return;
        }

        if (!rooms.has(roomName)) {
          rooms.set(roomName, new Set());
        }
        rooms.get(roomName)?.add(ws);
      },
      onMessage: async (event, ws) => {
        if (!roomName || typeof event.data !== "string") {
          // Only accept text messages and valid room names
          return;
        }

        // Parse the incoming message
        const message = JSON.parse(event.data);

        if (message.type === "auth") {
          // Handle authentication message

          const token = message.token;
          if (!token) {
            ws.send(JSON.stringify({ error: "No token provided" }));
            return;
          }

          try {
            const payload = await verifyToken(token);
            socketUsers.set(ws, payload.username as string); // Assuming the payload has a username field
          } catch (_error) {
            // TODO: Handle error
            return;
          }
        } else {
          // Handle non-auth messages (assumed to be chat messages)

          const username = socketUsers.get(ws);
          if (!username) {
            // If the user is not authenticated, ignore the message
            return;
          }

          message.user = username;
          message.date = Date.now();

          // Broadcast the message to all clients in the room
          const roomSockets = rooms.get(roomName);
          if (roomSockets) {
            for (const socket of roomSockets) {
              socket.send(JSON.stringify(message));
            }
          }
        }
      },
      onClose: (_event, ws) => {
        if (roomName) {
          rooms.get(roomName)?.delete(ws);
        }
        socketUsers.delete(ws);
        ws.close();
      },
      onError: (_event, ws) => {
        // TODO: Handle error appropriately
        // For now, just clean up the socket and close it
        if (roomName) {
          rooms.get(roomName)?.delete(ws);
        }
        socketUsers.delete(ws);
        ws.close();
      },
    };
  }),
);

export { roomRouter };

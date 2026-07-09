import { Hono } from "hono";
import { upgradeWebSocket } from "hono/deno";
import { WSContext } from "hono/ws";

import { verifyToken } from "./utils.ts";

interface RoomUser {
  id: string; // Should always be a number normally, but using string just in case the JWT payload is not typed correctly
  username: string;
}

const rooms = new Map<string, Set<WSContext>>();
const socketNames = new Map<WSContext, RoomUser>();

const roomRouter = new Hono();

const closeConnection = (ws: WSContext, roomName?: string) => {
  if (roomName) {
    rooms.get(roomName)?.delete(ws);

    // Send leave message to all clients in the room
    const user = socketNames.get(ws);
    if (user) {
      const leaveMessage = { type: "leave", user };

      const roomSockets = rooms.get(roomName);
      if (roomSockets) {
        for (const socket of roomSockets) {
          socket.send(JSON.stringify(leaveMessage));
        }
      }
    }
  }
  socketNames.delete(ws);
  ws.close();
};

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

        // Send presence list to the newly connected client
        const presenceList = Array.from(socketNames.values());
        ws.send(JSON.stringify({ type: "presence", users: presenceList }));

        // Add the new socket to the room's set of sockets
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

        switch (message.type) {
          case "auth": {
            // Handle authentication message

            const token = message.token;
            if (!token) {
              ws.send(JSON.stringify({ error: "No token provided" }));
              return;
            }

            try {
              const payload = await verifyToken(token);
              const user: RoomUser = {
                id: payload.id as string,
                username: payload.username as string,
              };
              socketNames.set(ws, user);

              // Send join message to all clients in the room
              const joinMessage = { type: "join", user };

              const roomSockets = rooms.get(roomName);
              if (roomSockets) {
                for (const socket of roomSockets) {
                  socket.send(JSON.stringify(joinMessage));
                }
              }
            } catch (_error) {
              // TODO: Handle error
              return;
            }
            break;
          }
          case "message": {
            // Handle incoming chat message

            const user = socketNames.get(ws);
            if (!user) {
              // If the user is not authenticated, ignore the message
              return;
            }

            message.user = user;
            message.date = Date.now();

            // Broadcast the message to all clients in the room
            const roomSockets = rooms.get(roomName);
            if (roomSockets) {
              for (const socket of roomSockets) {
                socket.send(JSON.stringify(message));
              }
            }
            break;
          }
          default: {
            // Unknown message type, ignore
            return;
          }
        }
      },
      onClose: (_event, ws) => {
        closeConnection(ws, roomName);
      },
      onError: (_event, ws) => {
        // TODO: Handle error appropriately
        // For now, just clean up the socket and close it
        closeConnection(ws, roomName);
      },
    };
  }),
);

export { roomRouter };

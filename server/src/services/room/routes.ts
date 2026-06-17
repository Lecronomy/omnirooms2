import { Hono } from "hono";
import { upgradeWebSocket } from "hono/deno";
import { WSContext } from "hono/ws";

const rooms = new Map<string, Set<WSContext>>();
const socketUsers = new Map<WSContext, string>(); // Replace string with actual user type when available

const router = new Hono();

// Some of this could maybe be moved to a separate service file if it gets more complex, but for now it's simple enough to keep here
router.get(
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

        // TODO: Use actual user info when available
        // For now, just assign a random username for demonstration purposes
        const username = `User${Math.floor(Math.random() * 1000)}`;
        socketUsers.set(ws, username);
      },
      onMessage: (event, ws) => {
        if (!roomName) {
          // Invalid room name, ignore the message
          return;
        }

        if (typeof event.data !== "string") {
          // Only handle text messages for now
          return;
        }

        const message = JSON.parse(event.data);
        message.user = socketUsers.get(ws) || "Unknown User";
        message.date = Date.now();

        // Broadcast the message to all clients in the room
        const roomSockets = rooms.get(roomName);
        if (roomSockets) {
          for (const socket of roomSockets) {
            socket.send(JSON.stringify(message));
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

export { router };

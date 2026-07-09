import { SvelteDate } from 'svelte/reactivity';

import { PUBLIC_API_URL } from '$env/static/public';
import { useAuthState } from './authState.svelte';

// This has to match the RoomUser interface in the server code, otherwise the presence list will be wrong
// TODO: Use Zod to make this less flimsy
interface RoomUser {
	id: string;
	username: string;
}

interface MessageFeed {
	id: number;
	user: RoomUser;
	timestamp: string;
	message: string;
}

let messageFeed: MessageFeed[] = $state([]);
let presenceState: RoomUser[] = $state([]);

// WebSocket connection
let connection: WebSocket;

const reconnect = (roomName: string) => {
	setTimeout(() => {
		connection.close();
		openConnection(roomName);
	}, 500);
};

export const openConnection = async (roomName: string) => {
	connection = new WebSocket(`${PUBLIC_API_URL}/room/${roomName}/ws`);

	connection.onopen = () => {
		// Authenticate the connection if a token is available
		const authState = useAuthState();

		if (authState.token !== '') {
			connection.send(JSON.stringify({ type: 'auth', token: authState.token }));
		}
	};

	connection.onmessage = (event) => {
		// Parse incoming message
		const data = JSON.parse(event.data);

		switch (data.type) {
			case 'presence': {
				// Update the presence state with the list of users in the room
				presenceState = data.users as RoomUser[]; // Scary, should use Zod to validate this
				break;
			}
			case 'join': {
				// Add the new user to the presence state
				const newUser: RoomUser = {
					id: data.user.id,
					username: data.user.username
				};
				presenceState = [...presenceState, newUser];
				break;
			}
			case 'leave':
				// Remove the user from the presence state
				presenceState = presenceState.filter((user) => user.id !== data.user.id);
				break;
			case 'message': {
				// Handle incoming chat message

				// Turn timestamp into string
				const date: SvelteDate = new SvelteDate(data.date);
				// TODO: This is currently hardcoded to en-US, change to use user's locale
				const timestampString = date.toLocaleString('en-US', {
					hour: 'numeric',
					minute: 'numeric',
					hour12: true
				});
				const newMessage = {
					id: messageFeed.length,
					user: data.user,
					timestamp: timestampString,
					message: data.message
				};
				// Update the message feed
				messageFeed = [...messageFeed, newMessage];
				break;
			}
			default:
				console.warn('Unknown message type received:', data.type);
				break;
		}
	};

	connection.onclose = (event) => {
		console.log('WebSocket connection closed', event);
		reconnect(roomName);
	};

	connection.onerror = (error) => {
		console.error('WebSocket error', error);
		reconnect(roomName);
	};
};

export const useMessageFeed = () => {
	return {
		get messages() {
			return messageFeed;
		},
		sendMessage: (message: string) => {
			if (connection && connection.readyState === WebSocket.OPEN) {
				connection.send(JSON.stringify({ type: 'message', message }));
			} else {
				console.error('WebSocket is not open. Unable to send message.');
			}
		}
	};
};

export const usePresenceState = () => {
	return {
		get users() {
			return presenceState;
		}
	};
};

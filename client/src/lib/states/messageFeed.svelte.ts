import { SvelteDate } from 'svelte/reactivity';

import { PUBLIC_API_URL } from '$env/static/public';
import { useAuthState } from './authState.svelte';

interface MessageFeed {
	id: number;
	name: string;
	timestamp: string;
	message: string;
}

let messageFeed: MessageFeed[] = $state([]);

// WebSocket connection
let connection: WebSocket;

const reconnect = (roomName: string) => {
	setTimeout(() => {
		connection.close();
		openConnection(roomName);
	}, 500);
};

const openConnection = async (roomName: string) => {
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
			name: data.user,
			timestamp: timestampString,
			message: data.message
		};
		// Update the message feed
		messageFeed = [...messageFeed, newMessage];
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

const useMessageFeed = () => {
	return {
		get messages() {
			return messageFeed;
		},
		sendMessage: (message: string) => {
			if (connection && connection.readyState === WebSocket.OPEN) {
				connection.send(JSON.stringify({ message }));
			} else {
				console.error('WebSocket is not open. Unable to send message.');
			}
		}
	};
};

export { useMessageFeed, openConnection };

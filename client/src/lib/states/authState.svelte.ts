import { browser } from '$app/environment';
import * as authApi from '$lib/apis/authApi.js';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

interface UserInfo {
	id: number;
	username: string;
	email: string;
}

let user: UserInfo | null = $state(null);
let token = $state('');

if (browser) {
	const storedUser = localStorage.getItem(USER_KEY);
	const storedToken = localStorage.getItem(TOKEN_KEY);

	if (storedUser) {
		user = JSON.parse(storedUser);
	}
	if (storedToken) {
		token = storedToken;
	}
}

const useAuthState = () => {
	return {
		get user() {
			return user;
		},
		get token() {
			return token;
		},
		login: async (username: string, password: string) => {
			const response = await authApi.login({ username, password });

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Login failed');
			}

			const data = await response.json();
			user = data.user;
			token = data.token;

			localStorage.setItem('user', JSON.stringify(data.user));
			localStorage.setItem('token', data.token);

			return data;
		},
		register: async (username: string, email: string, password: string) => {
			const response = await authApi.register({ username, email, password });

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Registration failed');
			}

			return await response.json();
		},
		logout: () => {
			user = null;
			token = '';

			localStorage.removeItem('user');
			localStorage.removeItem('token');
		}
	};
};

export { useAuthState };

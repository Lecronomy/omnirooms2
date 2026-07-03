import { PUBLIC_API_URL } from '$env/static/public';

interface UserLogin {
	username: string;
	password: string;
}

interface UserCreate extends UserLogin {
	email: string;
}

const login = async (credentials: UserLogin) => {
	return await fetch(`${PUBLIC_API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(credentials)
	});
};

const register = async (user: UserCreate) => {
	return await fetch(`${PUBLIC_API_URL}/auth/register`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(user)
	});
};

export { login, register };

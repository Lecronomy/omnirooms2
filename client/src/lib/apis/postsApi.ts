import { PUBLIC_API_URL } from '$env/static/public';

interface PostCreate {
	content: string;
}

export const getUserPosts = async (username: string) => {
	return await fetch(`${PUBLIC_API_URL}/posts/user/${username}`);
};

export const getMyPosts = async (token: string) => {
	return await fetch(`${PUBLIC_API_URL}/posts/me`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
};

export const createPost = async (token: string, post: PostCreate) => {
	return await fetch(`${PUBLIC_API_URL}/posts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify(post)
	});
};

export const deletePost = async (token: string, postId: number) => {
	return await fetch(`${PUBLIC_API_URL}/posts/${postId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
};

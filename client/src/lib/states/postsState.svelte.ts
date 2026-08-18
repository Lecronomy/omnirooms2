import { SvelteDate } from 'svelte/reactivity';

import * as postsApi from '$lib/apis/postsApi';
import { useAuthState } from './authState.svelte';

const authState = useAuthState();

interface Post {
	id: number;
	content: string;
	createdAt: SvelteDate;
}

let posts: Post[] = $state([]);
let loading: boolean = $state(false);

// Tentative validation function to get Post objects from API responses. Could probably be replaced with Zod.
interface PostResponse {
	id: number;
	content: string;
	created_at: string; // ISO 8601 date string
}
const getPostsFromResponse = async (response: Response): Promise<Post[]> => {
	if (!response.ok) {
		throw new Error('Failed to fetch posts');
	}

	const data = await response.json();
	return data.map((post: PostResponse) => ({
		...post,
		createdAt: new SvelteDate(post.created_at)
	}));
};

export const usePostsState = () => {
	return {
		get posts() {
			return posts;
		},
		get loading() {
			return loading;
		},
		fetchUserPosts: async (username: string) => {
			loading = true;
			const response = await postsApi.getUserPosts(username);
			if (response.ok) {
				posts = await getPostsFromResponse(response);
			} else {
				console.error('Failed to fetch user posts');
			}
			loading = false;
		},
		fetchMyPosts: async () => {
			const token = authState.token;
			if (!token) {
				console.error('No token available for fetching my posts');
				return;
			}

			loading = true;
			const response = await postsApi.getMyPosts(token);
			if (response.ok) {
				posts = await getPostsFromResponse(response);
			} else {
				console.error('Failed to fetch my posts');
			}
			loading = false;
		},
		createPost: async (content: string) => {
			const token = authState.token;
			if (!token) {
				console.error('No token available for creating a post');
				return;
			}

			loading = true;
			const response = await postsApi.createPost(token, { content });
			if (response.ok) {
				const newPost = await response.json();
				posts = [newPost, ...posts];
			} else {
				console.error('Failed to create post');
			}
			loading = false;
		},
		deletePost: async (postId: number) => {
			const token = authState.token;
			if (!token) {
				console.error('No token available for deleting a post');
				return;
			}

			loading = true;
			const response = await postsApi.deletePost(token, postId);
			if (response.ok) {
				posts = posts.filter((post) => post.id !== postId);
			} else {
				console.error('Failed to delete post');
			}
			loading = false;
		}
	};
};

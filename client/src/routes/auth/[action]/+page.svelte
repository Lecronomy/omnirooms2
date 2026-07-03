<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { useAuthState } from '$lib/states/authState.svelte';

	let message = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);

	const authState = useAuthState();

	const handleForm = async (e: SubmitEvent) => {
		e.preventDefault();
		errorMessage = '';
		message = '';
		isLoading = true;

		const formData = new FormData(e.target as HTMLFormElement);
		const formEntries = Object.fromEntries(formData);

		try {
			if (page.params.action === 'login') {
				const username = formEntries.username.toString();
				const password = formEntries.password.toString();

				await authState.login(username, password);
				message = 'Login successful! Redirecting...';
				setTimeout(() => goto(resolve('/')), 1000);
			} else {
				const username = formEntries.username.toString();
				const email = formEntries.email.toString();
				const password = formEntries.password.toString();

				await authState.register(username, email, password);
				message = 'Registration successful! You can now log in.';
				setTimeout(() => goto(resolve('/auth/login')), 2000);
			}
		} catch (error) {
			if (error instanceof Error) {
				errorMessage = error.message;
			}
		} finally {
			isLoading = false;
		}
	};
</script>

<h2 class="h2">
	{page.params.action === 'login' ? 'Login' : 'Register'}
</h2>

{#if message}
	<div>
		<p>{message}</p>
	</div>
{/if}

{#if errorMessage}
	<div>
		<p class="text-red-600">{errorMessage}</p>
	</div>
{/if}

<form class="w-full max-w-md space-y-4 p-4" onsubmit={handleForm}>
	<fieldset class="space-y-4">
		<label class="label">
			<span class="label-text">Username</span>
			<input
				class="input"
				id="username"
				name="username"
				type="text"
				placeholder="Enter your username"
				required
			/>
		</label>
		{#if page.params.action === 'register'}
			<label class="label">
				<span class="label-text">Email</span>
				<input
					class="input"
					id="email"
					name="email"
					type="email"
					placeholder="user@example.com"
					required
				/>
			</label>
		{/if}
		<label class="label">
			<span class="label-text">Password</span>
			<input
				class="input"
				id="password"
				name="password"
				type="password"
				placeholder="Enter your password"
				required
			/>
		</label>
	</fieldset>

	<fieldset class="flex justify-end">
		<button type="submit" class="btn preset-outlined-surface-300-700" disabled={isLoading}>
			{isLoading ? 'Please wait...' : page.params.action === 'login' ? 'Login' : 'Register'}
		</button>
	</fieldset>
</form>

{#if page.params.action === 'login'}
	<p>
		Don't have an account? <a class="anchor" href={resolve('/auth/register')}>Register here</a>
	</p>
{:else}
	<p>
		Already have an account? <a class="anchor" href={resolve('/auth/login')}>Login here</a>
	</p>
{/if}

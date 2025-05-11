<script lang="ts">
	import type { Cathegory } from '../../cathegories';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import type { Shot, User } from '$lib/client';
	import Camera from './camera.svelte';
	import { number } from 'zod';
	import { ChevronLeft } from 'lucide-svelte';

	let { data }: PageProps = $props();
	let user = $state<User | null>(null);
	const cathegory: Cathegory = $derived(data.cathegory);
	let pictures: Shot[] = $state([]);

	onMount(async () => {
		const response = await fetch('/api/getUser');
		user = await response.json();

		if (data.hasShot) {
			const response = await fetch('/api/getShots');
			const shots = (await response.json()) as Shot[];
			pictures = shots.filter((shot) => shot.cathegoryId === parseInt(data.cathegory.id));
			pictures = pictures.filter((shot) => shot.imageUrl !== '');
		}
	});

	async function handleSubmit(photoURL: string) {
		const response = await fetch('/api/createShot', {
			method: 'POST',
			body: JSON.stringify({
				imageUrl: photoURL,
				userId: user?.id,
				cathegoryId: data.cathegory.id
			})
		});
		if (response.ok) {
			window.location.reload();
		}
	}
</script>

{#if !data.hasShot}
	<div class="h-screen w-screen">
		<Camera onSubmit={handleSubmit}></Camera>
	</div>
{:else}
	<div class="flex h-screen w-screen flex-col">
		<div class="flex h-16 w-full flex-row bg-purple-200">
			<button
				class="rounded-md bg-purple-200 p-2"
				onclick={() => {
					window.location.href = '/';
				}}
			>
				<ChevronLeft></ChevronLeft>
			</button>
			<h1 class="mt-2 p-2 text-2xl font-bold">{data.cathegory.name}</h1>
		</div>
		{#each pictures as picture}
			<img src={picture.imageUrl} alt="The shot" class="mx-10 mt-5 rounded-lg object-cover" />
		{/each}
	</div>
{/if}

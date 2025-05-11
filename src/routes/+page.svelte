<script lang="ts">
	import { onMount } from 'svelte';
	import { cathegories } from './cathegories';

	let completed = $state(0);

	onMount(async () => {
		const user = await fetch('/api/getUser');
		const userData = await user.json();
		completed = userData.completed;
	});
</script>

<div class="h-screen w-screen">
	<nav
		class="fixed flex h-14 w-full flex-row items-center justify-between bg-purple-100/50 backdrop-blur-md"
	>
		<h1 class="ml-4 text-2xl font-bold">LOGO</h1>
		<h1 class="mr-4 text-gray-500">{completed}/10</h1>
	</nav>
	<div class="flex flex-col items-center pt-20">
		{#each cathegories as cathegory}
			<button
				class="mb-3 w-96 rounded-2xl bg-purple-300 p-4 font-bold shadow-md transition-colors active:bg-purple-200"
				onclick={() => {
					window.location.href = `/cath/${cathegory.id}`;
				}}>{cathegory.name}</button
			>
		{/each}
		<button
			onclick={() => {
				fetch('/api/fillOn');
			}}
			class="mb-3 w-96 rounded-2xl bg-red-300 p-4 font-bold shadow-md transition-colors active:bg-red-200"
		>
			Omplir i espectar el joc
		</button>
	</div>
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { cathegories } from './cathegories';

	let completed = $state(0);
	let showPopup = $state(false);

	function openPopup() {
		showPopup = true;
	}

	function choose(option: string) {
		if (option === 'hai') {
			fetch('/api/fillOn');
			showPopup = false;
		} else {
			showPopup = false;
		}
	}

	onMount(async () => {
		const user = await fetch('/api/getUser');
		if (!user.ok) {
			console.error('Error fetching user');
			return;
		}
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
		{#if showPopup}
			<div class="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
				<div class="p- display flex flex-col items-center justify-center rounded-xl bg-white p-5">
					<p>Vols abandonar el joc?</p>
					<div>
						<button
							onclick={() => choose('hai')}
							class="mx-2 mt-2 rounded-md bg-gray-200 p-2 px-4 font-bold">Sí</button
						>
						<button
							onclick={() => choose('iie')}
							class="mx-2 rounded-md bg-gray-200 p-2 px-4 font-bold">No</button
						>
					</div>
				</div>
			</div>
		{/if}
		{#each cathegories as cathegory}
			{#if cathegory.id !== '99'}
				<button
					class="mb-3 w-96 rounded-2xl bg-purple-300 p-4 font-bold shadow-md transition-colors active:bg-purple-200"
					onclick={() => {
						window.location.href = `/cath/${cathegory.id}`;
					}}>{cathegory.name}</button
				>
			{/if}
		{/each}
		<button
			onclick={() => {
				window.location.href = `/cath/99`;
			}}
			class="mb-3 w-96 rounded-2xl bg-blue-300 p-4 font-bold shadow-md transition-colors active:bg-red-200"
		>
			Fotos aleatòries
		</button>
		<button
			onclick={() => {
				showPopup = true;
			}}
			class="mb-3 w-96 rounded-2xl bg-red-300 p-4 font-bold shadow-md transition-colors active:bg-red-200"
		>
			Em rendeixo!
		</button>
	</div>
</div>

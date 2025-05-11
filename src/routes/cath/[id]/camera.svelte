<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	let videoElement: HTMLVideoElement | null = $state(null);
	let canvasElement: HTMLCanvasElement | null = null;
	let stream: MediaStream | null = null;
	let photoURL: string | null = $state(null);
	let cameraFacingMode: string = 'user';
	let errorMessage = $state('');

	let { onSubmit }: { onSubmit: (photoURL: string) => Promise<void> } = $props();

	onMount(async () => {
		await startCamera();
	});

	onDestroy(() => {
		stopCamera();
	});

	async function startCamera() {
		try {
			errorMessage = '';

			stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: cameraFacingMode
				},
				audio: false
			});

			if (videoElement) {
				videoElement.srcObject = stream;
				await videoElement.play();
			}
		} catch (err: any) {
			console.error('Error accessing camera:', err);
			errorMessage = `Camera error: ${err.message}`;
		}
	}

	function stopCamera() {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;

			if (videoElement) {
				videoElement.srcObject = null;
			}
		}
	}

	function takePhoto() {
		if (!videoElement || !canvasElement) return;

		canvasElement.width = videoElement.videoWidth;
		canvasElement.height = videoElement.videoHeight;

		const context = canvasElement.getContext('2d');
		context?.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

		photoURL = canvasElement.toDataURL('image/jpeg');
	}

	function retake() {
		photoURL = null;
		startCamera();
	}

	async function downloadPhoto() {
		if (!photoURL) return;

		await onSubmit(photoURL);
	}

	function toggleCamera() {
		cameraFacingMode = cameraFacingMode === 'user' ? 'enviorment' : 'user';
		stopCamera();
		startCamera();
	}
</script>

<div class="h-screen w-screen">
	{#if errorMessage}
		<div class="error-message">
			{errorMessage}
		</div>
	{/if}

	{#if photoURL === null}
		<div class="video-container">
			<video bind:this={videoElement} autoplay playsinline class="h-screen w-screen object-cover"
			></video>
			<div
				class="fixed bottom-0 flex w-full justify-center gap-4 bg-white/50 p-4 backdrop-blur-2xl"
			>
				<button onclick={takePhoto} class="rounded-md bg-purple-200 p-2">Fes la foto</button>
				<button onclick={toggleCamera} class="rounded-md bg-purple-200 p-2">
					Canviar càmeres
				</button>
				<button
					onclick={() => {
						window.location.href = '/';
					}}
					class="rounded-md bg-purple-200 p-2"
				>
					Enrere
				</button>
			</div>
		</div>
	{:else}
		<div class="photo-container">
			<img src={photoURL} alt="Captured" class="h-screen w-screen object-cover" />
			<div
				class="fixed bottom-0 flex w-full justify-center gap-4 bg-white/50 p-4 backdrop-blur-2xl"
			>
				<button onclick={retake} class="rounded-md bg-purple-200 p-2">Torna</button>
				<button onclick={downloadPhoto} class="rounded-md bg-purple-200 p-2">Publicar</button>
			</div>
		</div>
	{/if}

	<canvas bind:this={canvasElement} style="display: none;"></canvas>
</div>

<script lang="ts">
	import { CopyToClipboard } from '@undp-data/svelte-copy-to-clipboard';
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let map: Map;
	export let isShareModalShown: boolean;

	let url: URL;
	let urlText = '';

	onMount(() => {
		url = new URL(window.location.href);
	});

	$: if (isShareModalShown === true) {
		setPageUrl();
	}

	export let customiseUrl = (url: string): string => {
		return url;
	};

	const setPageUrl = () => {
		if (!map || !url) return '';
		const baseUrl = `${url.protocol}//${url.host}`;
		const zoom = `#${map.getZoom().toFixed(2)}`;
		const lat = `/${map.getCenter().lat.toFixed(6)}`;
		const lng = `/${map.getCenter().lng.toFixed(6)}`;
		const bearing = map.getBearing() !== 0 ? `/${map.getBearing().toFixed(1)}` : '';
		const pitch = map.getPitch() !== 0 ? `/${map.getPitch().toFixed()}` : '';
		urlText = customiseUrl(`${baseUrl}${zoom}${lat}${lng}${bearing}${pitch}`);
	};

	const handleClose = () => {
		isShareModalShown = false;
	};

	const handleEnterKey = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			e.target.click();
		}
	};
</script>

<div class="modal {isShareModalShown ? 'is-active' : ''}" transition:fade|global>
	<div class="modal-background" role="none" on:click={handleClose} on:keydown={handleEnterKey} />

	<div class="modal-card">
		<section class="modal-card-body">
			<button class="delete is-large" aria-label="close" title="Close" on:click={handleClose} />
			<p class="title is-5">URL to share</p>

			<CopyToClipboard
				bind:value={urlText}
				placeholder="Copy to clipboard"
				textCopy="Copy"
				textCopied="Copied"
				width="100%"
				timeout={5000}
				isMultiline={false}
			/>
		</section>
	</div>
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';

	.modal {
		z-index: 99;

		.modal-background {
			cursor: pointer;
		}

		.modal-card {
			.modal-card-body {
				.delete {
					position: absolute;
					top: 1rem;
					right: 1rem;
				}
			}
		}
	}
</style>

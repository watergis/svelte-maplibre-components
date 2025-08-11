<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { onMount, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import CopyToClipboard from './CopyToClipboard.svelte';

	let url: URL;
	let urlText = $state('');

	onMount(() => {
		url = new URL(window.location.href);
	});

	interface Props {
		map: Map;
		isShareModalShown: boolean;
		customiseUrl?: (url: string) => string;
	}

	let {
		map = $bindable(),
		isShareModalShown = $bindable(),
		customiseUrl = (url: string): string => {
			return url;
		}
	}: Props = $props();

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
	$effect(() => {
		if (isShareModalShown === true) {
			untrack(() => {
				setPageUrl();
			});
		}
	});
</script>

<div class="modal {isShareModalShown ? 'is-active' : ''}" transition:fade|global>
	<div class="modal-background" role="none" onclick={handleClose} onkeydown={handleEnterKey}></div>

	<div class="modal-card">
		<section class="modal-card-body">
			<button class="delete is-large" aria-label="close" title="Close" onclick={handleClose}
			></button>
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

<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';
	import type { Map } from 'maplibre-gl';

	export let map: Map;
	export let isShareModalShown: boolean;

	let url = '';

	let textCopyButton = 'Copy';

	const handleCopy = () => {
		textCopyButton = 'copied';
		setTimeout(() => {
			textCopyButton = 'Copy';
		}, 2000);
	};

	$: if (isShareModalShown === true) {
		setPageUrl();
	}

	export let customiseUrl = (url: string): string => {
		return url;
	};

	const setPageUrl = () => {
		if (!map) return '';
		const baseUrl = `${$page.url.protocol}//${$page.url.host}`;
		const zoom = `#${map.getZoom().toFixed(2)}`;
		const lat = `/${map.getCenter().lat.toFixed(6)}`;
		const lng = `/${map.getCenter().lng.toFixed(6)}`;
		const bearing = map.getBearing() !== 0 ? `/${map.getBearing().toFixed(1)}` : '';
		const pitch = map.getPitch() !== 0 ? `/${map.getPitch().toFixed()}` : '';
		url = customiseUrl(`${baseUrl}${zoom}${lat}${lng}${bearing}${pitch}`);
	};

	const handleClose = () => {
		isShareModalShown = false;
	};
</script>

<div class="modal {`${isShareModalShown ? 'is-active' : ''}`}">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-background" on:click={handleClose} />
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">URL to share</p>
			<button class="delete" aria-label="close" on:click={handleClose} />
		</header>
		<section class="modal-card-body">
			<div class="copy-control">
				<input
					class="input is-success"
					type="text"
					placeholder="URL to share"
					bind:value={url}
					readonly
				/>
				<button class="button is-success ml-1" use:copy={url} on:click={handleCopy}>
					<span class="icon">
						<i class="fas fa-copy" />
					</span>
					<span>{textCopyButton}</span>
				</button>
			</div>
		</section>
		<footer class="modal-card-foot">
			<button class="button" on:click={handleClose}>
				<span class="icon">
					<i class="fas fa-xmark" />
				</span>
				<span>Cancel</span>
			</button>
		</footer>
	</div>
</div>

<style lang="scss">
	.copy-control {
		display: flex;
	}
</style>

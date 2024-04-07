<script lang="ts">
	import { faCopy, faXmark } from '@fortawesome/free-solid-svg-icons';
	import type { Map } from 'maplibre-gl';
	import { onMount } from 'svelte';
	import { copy } from 'svelte-copy';
	import Fa from 'svelte-fa';

	export let map: Map;
	export let isShareModalShown: boolean;

	let url: URL;
	let urlText = '';

	let textCopyButton = 'Copy';

	onMount(() => {
		url = new URL(window.location.href);
	});

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

<div class="modal {`${isShareModalShown ? 'is-active' : ''}`}">
	<div
		class="modal-background"
		role="button"
		tabindex="-1"
		on:click={handleClose}
		on:keydown={handleEnterKey}
	/>
	<div class="modal-card">
		<header class="modal-card-head">
			<p class="modal-card-title">URL to share</p>
			<button class="delete" aria-label="close" on:click={handleClose} />
		</header>
		<section class="modal-card-body">
			<div class="copy-control">
				<input
					class="input is-success is-small pm-0"
					type="text"
					placeholder="URL to share"
					style="cursor:pointer;"
					bind:value={urlText}
					use:copy={urlText}
					on:click={handleCopy}
					readonly
				/>
				<button class="button is-success is-small pm-0" use:copy={urlText} on:click={handleCopy}>
					<span class="icon">
						<Fa icon={faCopy} />
					</span>
					<span>{textCopyButton}</span>
				</button>
			</div>
		</section>
		<footer class="modal-card-foot">
			<button class="button" on:click={handleClose}>
				<span class="icon">
					<Fa icon={faXmark} />
				</span>
				<span>Cancel</span>
			</button>
		</footer>
	</div>
</div>

<style lang="scss">
	@import 'bulma/css/bulma.css';
	.copy-control {
		display: flex;
	}
</style>

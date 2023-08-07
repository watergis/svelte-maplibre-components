<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import type { Map, ControlPosition } from 'maplibre-gl';
	import '@sjmc11/tourguidejs/src/scss/tour.scss'; // Styles
	import { TourGuideClient, type TourGuideOptions } from '@sjmc11/tourguidejs';

	export let map: Map;
	export let position: ControlPosition = 'top-right';
	// see the documentation of TourGuide JS
	// https://tourguidejs.com/docs/options.html
	export let tourguideOptions: TourGuideOptions;
	// change LocalStorageKey for your app.
	export let localStorageKey = 'tourGuideFinished';

	// if true, tour will be shown when users visit for the first time
	export let showTourAsDefault = true
	export let addDefaultLastStep = true;
	export let finishTitle = 'Done!';
	export let finishDescription = `The tour has been completed now. Click Finish button to start using it! Thank you for taking your time to use this tutorial!<br><br>You can always come back to this tour by clicking this button.`;

	// configulation of localstorage to store the state of tour completion
	const initialValue = browser
		? window.localStorage.getItem(localStorageKey) === 'true'
			? true
			: false
		: false;
	const tourGuideFinished = writable<boolean>(initialValue);
	tourGuideFinished.subscribe((value) => {
		if (browser) {
			window.localStorage.setItem(localStorageKey, value ? 'true' : 'false');
		}
	});

	const tourguide = writable<TourGuideClient>(null);

	export const getTourguide = () => {
		return $tourguide
	}

	const initialiseTourguide = () => {
		if (!(tourguideOptions?.steps?.length > 0)) return;

		if (addDefaultLastStep) {
			const lastStep = tourguideOptions.steps[tourguideOptions.steps.length - 1];
			if (lastStep.target === '.maplibre-tour-icon') {
				lastStep.title = finishTitle;
				lastStep.content = finishDescription;
			} else {
				tourguideOptions.steps.push({
					title: finishTitle,
					content: finishDescription,
					target: '.maplibre-tour-icon',
					order: tourguideOptions.steps.length + 1
				});
			}
		}

		if (!$tourguide) {
			const tg = new TourGuideClient(tourguideOptions);
			tourguide.update(() => tg);
		} else {
			$tourguide.setOptions(tourguideOptions);
		}
	};

	// eslint-disable-next-line
	function TourControl() {}

	TourControl.prototype.onAdd = function (map: Map) {
		this.map = map;

		this.controlContainer = document.createElement('div');
		this.controlContainer.className = 'maplibregl-ctrl maplibregl-ctrl-group';
		this.button = document.createElement('button');
		this.button.className = 'maplibre-tour-icon';
		this.button.type = 'button';
		this.button.addEventListener('click', () => {
			this.tourStart();
		});
		this.controlContainer.appendChild(this.button);

		initialiseTourguide();

		if (showTourAsDefault && !$tourGuideFinished && tourguideOptions?.steps?.length > 0) {
			setTimeout(() => {
				this.button.dispatchEvent(new Event('click'));
			}, 100);
		}

		return this.controlContainer;
	};

	TourControl.prototype.onRemove = function () {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map || !this.button) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map = undefined;
	};

	TourControl.prototype.tourStart = () => {
		$tourguide?.start();

		$tourguide?.onFinish(() => {
			$tourGuideFinished = true;
		});
	};

	/*global TourControl */
	/*eslint no-undef: "error"*/
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	let tourControl: TourControl = null;

	onMount(() => {
		if (map) {
			if (!(tourControl && map.hasControl(tourControl))) {
				tourControl = new TourControl();
				map.addControl(tourControl, position);
			}
		}
	});

	onDestroy(() => {
		if (map) {
			if (tourControl && map.hasControl(tourControl)) {
				map.removeControl(tourControl);
			}
		}
	});
</script>

<style lang="scss">
	:global(.maplibre-tour-icon) {
		background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>');
		background-position: center;
		background-repeat: no-repeat;
		background-size: 70%;
	}

	:global(button.tg-dialog-btn) {
		cursor: pointer;
	}
</style>

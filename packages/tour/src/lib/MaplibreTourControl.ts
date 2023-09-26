import type { ControlPosition, IControl, Map as MaplibreMap } from 'maplibre-gl';
import { TourGuideClient, type TourGuideOptions } from '@sjmc11/tourguidejs';

export interface Options {
	localStorageKey?: string;
	showTourAsDefault?: boolean;
	addDefaultLastStep?: boolean;
	finishTitle?: string;
	finishDescription?: string;
}

export class MaplibreTourControl implements IControl {
	private controlContainer?: HTMLElement;
	private map?: MaplibreMap;
	private button?: HTMLButtonElement;

	private tourguide: TourGuideClient;

	private tourguideOptions: TourGuideOptions = {
		rememberStep: true
	};
	private options: Options = {
		localStorageKey: 'tourGuideFinished',
		showTourAsDefault: true,
		addDefaultLastStep: true,
		finishTitle: 'Done!',
		finishDescription:
			'The tour has been completed now. Click Finish button to start using it! Thank you for taking your time to use this tutorial!<br><br>You can always come back to this tour by clicking this button.'
	};

	constructor(tourguideOptions: TourGuideOptions, options: Options) {
		this.tourguideOptions = Object.assign(this.tourguideOptions, tourguideOptions);
		if (options) {
			this.options = Object.assign(this.options, options);
		}
	}

	public getDefaultPosition(): ControlPosition {
		const defaultPosition = 'top-right';
		return defaultPosition;
	}

	public onAdd(map: MaplibreMap): HTMLElement {
		this.map = map;
		this.controlContainer = document.createElement('div');
		this.controlContainer.classList.add('maplibregl-ctrl');
		this.controlContainer.classList.add('maplibregl-ctrl-group');

		this.button = document.createElement('button');
		this.button.classList.add('maplibregl-ctrl-icon');
		this.button.classList.add('maplibre-tour-control');
		this.button.type = 'button';
		this.button.addEventListener('click', this.tourStart.bind(this));
		this.controlContainer.appendChild(this.button);

		this.initialiseTourguide();

		const key = this.options.localStorageKey as string;
		const tourGuideFinished = window.localStorage.getItem(key) === 'true' ? true : false;

		if (
			this.options.showTourAsDefault &&
			!tourGuideFinished &&
			this.tourguideOptions?.steps?.length > 0
		) {
			setTimeout(this.tourStart.bind(this), 100);
		}

		return this.controlContainer;
	}

	public onRemove(): void {
		if (!this.controlContainer || !this.controlContainer.parentNode || !this.map) {
			return;
		}
		this.controlContainer.parentNode.removeChild(this.controlContainer);
		this.map = undefined;
	}

	private tourStart() {
		if (this.tourguide.isVisible) return;
		this.tourguide?.start();
	}

	private initialiseTourguide() {
		if (!(this.tourguideOptions.steps?.length > 0)) return;

		if (this.options.addDefaultLastStep) {
			const lastStep = this.tourguideOptions.steps[this.tourguideOptions.steps.length - 1];
			if (lastStep.target === '.maplibre-tour-icon') {
				lastStep.title = this.options.finishTitle;
				lastStep.content = this.options.finishDescription;
			} else {
				this.tourguideOptions.steps.push({
					title: this.options.finishTitle,
					content: this.options.finishDescription,
					target: '.maplibre-tour-icon',
					order: this.tourguideOptions.steps.length + 1
				});
			}
		}

		if (!this.tourguide) {
			this.tourguide = new TourGuideClient(this.tourguideOptions);
			this.tourguide.onFinish(() => {
				const key = this.options.localStorageKey as string;
				if (window) {
					window.localStorage.setItem(key, 'true');
				}
			});
		} else {
			this.tourguide.setOptions(this.tourguideOptions);
		}
	}
}

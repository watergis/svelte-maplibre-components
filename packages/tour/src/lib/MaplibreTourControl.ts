import type { ControlPosition, IControl, Map as MaplibreMap } from 'maplibre-gl';
import { TourGuideClient, type TourGuideOptions } from '@sjmc11/tourguidejs';

/**
 * maplibre-gl-tour control options
 */
export interface MaplibreTourControlOptions {
	/**
	 * The name used for local storage key.
	 * The tour control will save a flag with this key if the tour finished.
	 * So, the tour will not be shown again in the same browser.
	 */
	localStorageKey?: string;
	/**
	 * If true, the control will show the tour as default.
	 * Default value is set to True.
	 */
	showTourAsDefault?: boolean;
	/**
	 * If true, the control will add the final step automatically.
	 * Default value is set to True.
	 */
	addDefaultLastStep?: boolean;
	/**
	 * The title of the final step
	 * Default value is 'Done!'
	 */
	finishTitle?: string;
	/**
	 * The description of the final step
	 */
	finishDescription?: string;
}

/**
 * Maplibre GL Tour control class
 */
export class MaplibreTourControl implements IControl {
	private controlContainer?: HTMLElement;
	private map?: MaplibreMap;
	private button?: HTMLButtonElement;

	private tourguide: TourGuideClient;

	private tourguideOptions: TourGuideOptions = {
		rememberStep: true
	};
	private options: MaplibreTourControlOptions = {
		localStorageKey: 'tourGuideFinished',
		showTourAsDefault: true,
		addDefaultLastStep: true,
		finishTitle: 'Done!',
		finishDescription:
			'The tour has been completed now. Click Finish button to start using it! Thank you for taking your time to use this tutorial!<br><br>You can always come back to this tour by clicking this button.'
	};

	/**
	 * Constructor
	 * @param tourguideOptions TourGuideOptions instance. See the official documentation at https://tourguidejs.com/docs/options.html
	 * @param options MaplibreTourControl options
	 */
	constructor(tourguideOptions: TourGuideOptions, options: MaplibreTourControlOptions) {
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
			if (lastStep.target === this.button) {
				lastStep.title = this.options.finishTitle;
				lastStep.content = this.options.finishDescription;
			} else {
				this.tourguideOptions.steps.push({
					title: this.options.finishTitle,
					content: this.options.finishDescription,
					target: this.button,
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

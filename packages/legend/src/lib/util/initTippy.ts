import { createTippy, type TippyProps } from 'svelte-tippy';
import type { Instance } from 'tippy.js';

/**
 * Create Tippy object
 * see available options here.
 * https://atomiks.github.io/tippyjs/v6/all-props/
 * @param options TippyProps
 * @returns Tippy object
 */
export const initTippy = (options?: TippyProps | { trigger: string }) => {
	let props: TippyProps = {
		arrow: true,
		theme: 'light',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		trigger: 'click',
		hideOnClick: 'toggle',
		interactive: true,
		onShow(instance: Instance) {
			instance.popper.querySelector('.close')?.addEventListener('click', () => {
				instance.hide();
			});
		},
		onHide(instance: Instance) {
			instance.popper.querySelector('.close')?.removeEventListener('click', () => {
				instance.hide();
			});
		},
		onClickOutside(instance: Instance) {
			instance.hide();
		}
	};

	if (options) {
		props = Object.assign(props, options);
	}

	const tippy = createTippy(props);
	return tippy;
};

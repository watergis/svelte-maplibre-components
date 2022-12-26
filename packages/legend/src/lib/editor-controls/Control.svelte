<script lang="ts">
	import type { PropertyType } from '$lib/interfaces';
	import type { Map, LayerSpecification } from 'maplibre-gl';

	export let map: Map;
	export let layer: LayerSpecification;
	export let type: PropertyType;
	export let property: string;
	export let defaultValue: string | number | string[];
	export let value: string | number | string[];

	$: if (map) {
		value = getValue() as string | number | string[];
	}

	const getValue = () => {
		let _value: unknown;
		if (type === 'paint') {
			_value = map.getPaintProperty(layer.id, property);
		} else {
			_value = map.getLayoutProperty(layer.id, property);
		}

		if (!_value) {
			_value = defaultValue;
		}
		return _value;
	};

	$: value, setValue();

	const setValue = () => {
		if (type === 'paint') {
			map?.setPaintProperty(layer.id, property, value);
		} else {
			map?.setLayoutProperty(layer.id, property, value);
		}
	};
</script>

<slot />

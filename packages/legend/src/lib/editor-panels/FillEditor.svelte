<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
</script>

<FieldControl title="Opacity" help={{ type: 'paint', layerType: 'fill', property: 'fill-opacity' }}>
	<Opacity />
</FieldControl>

<FieldControl
	title="Fill color"
	help={{ type: 'paint', layerType: 'fill', property: 'fill-color' }}
>
	<ColorControl propertyName="fill-color" />
</FieldControl>

<FieldControl
	title="Fill outline color"
	help={{ type: 'paint', layerType: 'fill', property: 'fill-outline-color' }}
>
	<ColorControl propertyName="fill-outline-color" />
</FieldControl>

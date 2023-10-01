<script lang="ts">
	import ColorControl from '$lib/editor-controls/ColorControl.svelte';
	import Opacity from '$lib/editor-controls/Opacity.svelte';
	import FieldControl from '$lib/util/FieldControl.svelte';
</script>

<FieldControl
	title="Opacity"
	help={{ type: 'paint', layerType: 'background', property: 'background-opacity' }}
>
	<Opacity />
</FieldControl>

<FieldControl
	title="Background color"
	help={{ type: 'paint', layerType: 'background', property: 'background-color' }}
>
	<ColorControl propertyName="background-color" />
</FieldControl>

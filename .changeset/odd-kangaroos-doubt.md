---
"@watergis/svelte-maplibre-menu": patch
---

feat: added on:changed event to enable tracking changes of splitted containers' size.

You can track changes for containers' size by following code.

```svelte
<script>
	const onChange = (e) => {
		const { percent, primarySize, splitterSize, secondarySize, dragging } = event.detail
	};
</script>

<MenuControl
	on:changed={onChange}>
```

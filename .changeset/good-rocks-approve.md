---
"@watergis/svelte-maplibre-menu": minor
---

[breaking change] Added option of sidebarOnLeft to select sidebar poisiton either left or right

slot names were changed from `primary/secondary` to `sidebar/map` due to implementing sidebarOnLeft option.

```svelte
<MenuControl bind:map position={'top-left'} isMenuShown={false} sidebarOnLeft={true}>
    <div slot="sidebar">content</div>
    <div slot="map">
        <div class="map" bind:this={mapContainer} />
    </div>
</MenuControl>
```

Furthermore, following props names were changed

- initialPrimaryWidth > initialSidebarWidth
- minPrimaryWidth > minSidebarWidth
- minSecondaryWidth > minMapWidth

# @watergis/svelte-maplibre-menu

## 3.0.1

### Patch Changes

- f15cf03: chore: updated all dependencies

## 3.0.0

### Major Changes

- 91a4fa0: feat: upgrade sveltekit to v2, upgrade maplibre to v4

## 2.1.2

### Patch Changes

- 3df9f92: feat: Now moved xmark button to inside sidebar container. In addition, added `showMenuButtonOnMap` variable in the component to enable to hide menu button from the map.

## 2.1.1

### Patch Changes

- 8cf922a: fix: use module of splitter from dist instead of src

## 2.1.0

### Minor Changes

- e1b1a96: fix: removed svelte-fa and use fontawesome CDN as dependency due to the error when it is used in SSR

## 2.0.5

### Patch Changes

- 0da5eeb: fix: bug of opening mobile menu even when isMenuShown is false

## 2.0.4

### Patch Changes

- 0ff6f04: fix: wait for creating menuButton until map object is ready

## 2.0.3

### Patch Changes

- 4c49068: fix: recreate maplibre control object once map object is available

## 2.0.2

### Patch Changes

- 570b43c: fix: added classname for maplibre control button

## 2.0.1

### Patch Changes

- cfd5091: Upgraded prettier and eslint versions

  - chore(deps): update typescript-eslint monorepo to v6 (major) (#284)
  - chore(deps): update dependency prettier-plugin-svelte to v3 (#289)

  Also, there are several maintenances by renovate. See commit logs.

## 2.0.0

### Major Changes

- ba763ad: chore: update dependency svelte to v4, migrate eslint-plugin-svelte3 to eslint-plugin-svelte.

## 1.0.2

### Patch Changes

- 6303c40: feat: added on:changed event to enable tracking changes of splitted containers' size.

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

## 1.0.1

### Patch Changes

- 6e4275e: fix: bug of customised close icon for mobile in menu control
- 6e4275e: fix: bug of position of close icon when holizontally splitted and sidebarOnLeft is false

## 1.0.0

### Major Changes

- 9add035: chore(deps): update dependency maplibre-gl to v3

### Patch Changes

- 9add035: fix: css class name of 'mapboxgl-ctrl' to 'maplibregl-ctrl'

## 0.3.0

### Minor Changes

- f62e97b: feat: added `faIcon` and `faIconSize` props to enable to change menu icon to any other fontawesome icons and sizes
- f62e97b: feat: added `isHorizontal` option to split menu as horizontally

## 0.2.1

### Patch Changes

- beca6aa: chore: updated npm packages

## 0.2.0

### Minor Changes

- 17633f0: [breaking change] Added option of sidebarOnLeft to select sidebar poisiton either left or right

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

## 0.1.18

### Patch Changes

- e0ecf37: Updated svelte-package to v2. packaging folder was changed from package to dist

## 0.1.17

### Patch Changes

- 8572d28: Changed close icon on mobile to circleXmark. fixed some behaviour of initial openning in mobile

## 0.1.16

### Patch Changes

- 3cb5f7e: fixed CI to deploy

## 0.1.15

### Patch Changes

- facfff4: fixed turbo.json for build

## 0.1.14

### Patch Changes

- cf428fe: fixed turbo.json for build

## 0.1.13

### Patch Changes

- 634ef3a: Upgraded sveltekit to v1.0.0

## 0.1.12

### Patch Changes

- 0a32d84: updated dependencies

## 0.1.11

### Patch Changes

- 56b1069: fixed close icon in mobile

## 0.1.10

### Patch Changes

- e0f96f3: Use svelte-fa instead

## 0.1.9

### Patch Changes

- 988211c: exported width and height in menu control

## 0.1.8

### Patch Changes

- 99a37d3: fixed 100vh issue in menu control

## 0.1.7

### Patch Changes

- 447741a: updated all devDependencies in packages

## 0.1.6

### Patch Changes

- 265a243: changed css import method

## 0.1.5

### Patch Changes

- 754aa25: fixed fa icon css path

## 0.1.4

### Patch Changes

- b0bdb7e: removed uncessessary code on menu component

## 0.1.3

### Patch Changes

- 9989674: fixed isMobile setting on menu

## 0.1.2

### Patch Changes

- 41a4834: updated style of menu

## 0.1.1

### Patch Changes

- 2b9a4a1: removed scroll from menu

## 0.1.0

### Minor Changes

- 585ac61: first release of svelte-maplibre-menu

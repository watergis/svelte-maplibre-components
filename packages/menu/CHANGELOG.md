# @watergis/svelte-maplibre-menu

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

# @watergis/svelte-maplibre-legend

## 0.1.20

### Patch Changes

- f0a84a2: - [breaking change] deleted `style` parameter to be exported in order to fix the bug of style editor after switching to different style

  - [breaking change] watch `style:change` custom event of maplibre map object to recreate legend panel.

  When you changed map style.json, please fire `style:change` event like the following source code.

  ```
  map.on('style:change')
  ```

## 0.1.19

### Patch Changes

- 3e2c0c6: fixed bug of closing popup immediately after changing style anything.
- 52a4f0f: add help button to open maplibre spec page
- 829369b: add manual style editor

## 0.1.18

### Patch Changes

- 85dbeea: show heatmap and hillshade layers as rendered or related layers. fixed various bugs

## 0.1.17

### Patch Changes

- 1443de4: - Check whether icon-image is SFD icon in order to disable icon color editor
  - Added several new properties for symbol editor
  - Added raster editor properties
- 2919fde: create heatmap from symbol or line layer
- fb7897e: support additional layer type of heatmap, fill-extrusion, raster and heatmap, and background to show appropriate icon in legend
- 6e19de2: - refactor: created FieldControl
  - refactor: created folder for each layer type
  - refactor: changed close icon
  - feat: added LineBlur, LineDashArray, RasterResampling

## 0.1.16

### Patch Changes

- cc07946: improved color picker control for legend
- 6ba8ab3: - Added slider components
  - Added several components to edit circle, fill extrusion, hillshade and line
- ee99ba4: add color control in style editor
- a859a84: add palette button to show popup to edit layer style.

  - Opacity slider is added except hillshade type.
  - Hillshade exaggeration slider is added for hillshade layer.

## 0.1.15

### Patch Changes

- 3cb5f7e: fixed CI to deploy

## 0.1.14

### Patch Changes

- facfff4: fixed turbo.json for build

## 0.1.13

### Patch Changes

- cf428fe: fixed turbo.json for build

## 0.1.12

### Patch Changes

- 634ef3a: Upgraded sveltekit to v1.0.0

## 0.1.11

### Patch Changes

- f710381: there is an issue of touchevent in mobile. Disabled drag n' drop feature of layer ordering in mobile. only support drag n' drop in Desktop PC.

## 0.1.10

### Patch Changes

- 8e1c2ee: enable drag and drop to change layer ordering in legend control

## 0.1.9

### Patch Changes

- 0a32d84: updated dependencies
- e0e2eb8: fixed bug of layer order. Improved GUI
- 77c9bc0: added the feature changing layer ordering by drag and drop in legend plugin

## 0.1.8

### Patch Changes

- e0f96f3: Use svelte-fa instead

## 0.1.7

### Patch Changes

- 3a33b83: updated watergis/legend-symbol. Now linedasharray is supported.

## 0.1.6

### Patch Changes

- 74d94ad: deleted bulma dependency from legend control

## 0.1.5

### Patch Changes

- 47bb80f: Use bulma.sass instead of CDN

## 0.1.4

### Patch Changes

- 447741a: updated all devDependencies in packages

## 0.1.3

### Patch Changes

- 265a243: changed css import method

## 0.1.2

### Patch Changes

- 754aa25: fixed fa icon css path

## 0.1.1

### Patch Changes

- 7d4ce1d: fixed fa icon file path

## 0.1.0

### Minor Changes

- 910aab9: separated legend header as a different component to enable to set height of contents flexiblely

## 0.0.17

### Patch Changes

- 7443333: fixed legend css

## 0.0.16

### Patch Changes

- 00f4865: fixed scroll of legend component

## 0.0.15

### Patch Changes

- 3347475: added files in package.json

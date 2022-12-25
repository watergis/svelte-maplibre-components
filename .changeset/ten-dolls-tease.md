---
"@watergis/svelte-maplibre-legend": patch
---

- [breaking change] deleted `style` parameter to be exported in order to fix the bug of style editor after switching to different style
- [breaking change] watch `style:change` custom event of maplibre map object to recreate legend panel.

When you changed map style.json, please fire `style:change` event like the following source code.

```
map.on('style:change')
```

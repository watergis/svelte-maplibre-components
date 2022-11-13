# svelte-maplibre-components

[![build](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml/badge.svg)](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/5e6fddd2-c161-4aa8-9de8-61002eac3e21/deploy-status)](https://app.netlify.com/sites/svelte-maplibre-components/deploys)

This repository to manage packages of svelte maplibre components for water application.

## Packages to be managed in this repo

The following packages are used in [watergis/sveltekit-watergis-template](https://github.com/watergis/sveltekit-watergis-template).

- components for svelte with maplbre
  - `@watergis/svelte-maplibre-attribute-popup` (see [here](./packages/attribute-popup))
  - `@watergis/svelte-maplibre-export` (see [here](./packages/export))
  - `@watergis/svelte-maplibre-legend` (see [here](./packages/legend))
  - `@watergis/svelte-maplibre-measure` (see [here](./packages/measure))
  - `@watergis/svelte-maplibre-menu` (see [here](./packages/menu))
  - `@watergis/svelte-maplibre-search` (see [here](./packages/search))
  - `@watergis/svelte-maplibre-share` (see [here](./packages/share))
  - `@watergis/svelte-maplibre-style-switcher` (see [here](./packages/style-switcher))
  - `@watergis/svelte-maplibre-valhalla` (see [here](./packages/valhalla))
  - `@watergis/maplibre-center-icon` (see [here](./packages/center/))

- components for svelte
  - `@watergis/svelte-collapsible-panel` (see [here](./packages/collapsible-panel))

Please visit the documentation on [svelte.water-gis.com](https://svelte.water-gis.com).

## Install

```zsh
pnpm --filter <package_name> install
```

## Development

```zsh
pnpm --filter <package_name> add <installed_package>
pnpm --filter <package_name> dev
pnpm --filter <package_name> build
```

If you want to operate for all pacakges,

```bash
pnpm --filter="./packages/*" update
pnpm --filter="./packages/*" lint
pnpm --filter="./packages/*" format
pnpm --filter="./packages/*" build
```

## Release packages

Please create changeset log for every your work.

```zsh
pnpm changeset
```

Once, the PR is merged into main with changeset log created, the package will be released by Github Actions with changeset automatically.

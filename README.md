# svelte-maplibre-components

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![GitHub repo size](https://img.shields.io/github/repo-size/watergis/svelte-maplibre-components)
[![build](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml/badge.svg)](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/7340fe3a-71a8-4ef8-92b8-fdb4ef95f124/deploy-status)](https://app.netlify.com/sites/svelte-maplibre/deploys)

This repository to manage packages of svelte maplibre components for water application.

## Packages

The following packages are managed in this monorepo.

| Package                                                               | Changelog                                            | version                                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| [@watergis/svelte-maplibre-attribute-popup](packages/attribute-popup) | [Changelog](packages/attribute-popup/CHANGELOG.md)   | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-attribute-popup) |
| [@watergis/svelte-maplibre-attribute-table](packages/attribute-table) | [Changelog](packages/attribute-table/CHANGELOG.md)   | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-attribute-table) |
| [@watergis/maplibre-center-icon](packages/center)                     | [Changelog](packages/center/CHANGELOG.md)            | ![npm](https://img.shields.io/npm/v/@watergis/maplibre-center-icon)            |
| [@watergis/collapsible-panel](packages/collapsible-panel)             | [Changelog](packages/collapsible-panel/CHANGELOG.md) | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-attribute-popup) |
| [@watergis/svelte-maplibre-export](packages/export)                   | [Changelog](packages/export/CHANGELOG.md)            | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-export)          |
| [@watergis/svelte-maplibre-legend](packages/legend)                   | [Changelog](packages/legend/CHANGELOG.md)            | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-legend)          |
| [@watergis/svelte-maplibre-measure](packages/measure)                 | [Changelog](packages/measure/CHANGELOG.md)           | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-measure)         |
| [@watergis/svelte-maplibre-menu](packages/menu)                       | [Changelog](packages/menu/CHANGELOG.md)              | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-menu)            |
| [@watergis/svelte-maplibre-search](packages/search)                   | [Changelog](packages/search/CHANGELOG.md)            | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-search)          |
| [@watergis/svelte-maplibre-share](packages/share)                     | [Changelog](packages/share/CHANGELOG.md)             | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-share)           |
| [@watergis/svelte-maplibre-style-switcher](packages/style-switcher)   | [Changelog](packages/style-switcher/CHANGELOG.md)    | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-style-switcher)  |
| [@watergis/svelte-maplibre-tour](packages/tour)                       | [Changelog](packages/tour/CHANGELOG.md)              | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-tour)            |
| [@watergis/svelte-maplibre-valhalla](packages/valhalla)               | [Changelog](packages/valhalla/CHANGELOG.md)          | ![npm](https://img.shields.io/npm/v/@watergis/svelte-maplibre-valhalla)        |

## Documentation

Please visit the documentation on [svelte-maplibre.water-gis.com](https://svelte-maplibre.water-gis.com).

## Install

If you have not used [pnpm](https://pnpm.io/) before, please install it first.

```zsh
npm i -g pnpm
```

```zsh
pnpm install
```

When you clone it from Github first time, please install [lefthook](https://github.com/evilmartians/lefthook) by the following command.

```zsh
pnpm lefthook install
```

## Development

```bash
pnpm lint
pnpm format
pnpm build
```

## Release packages

Releasing packages is handled by [changeset](https://github.com/changesets/changesets). Please create changeset log for every your work.

```zsh
pnpm changeset
```

Once, the PR is merged into main with changeset log created, the package will be released by Github Actions with changeset automatically.

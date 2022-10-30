# svelte-maplibre-components

This repository to manage packages of svelte maplibre components for water application.

## Packages to be managed in this repo

The following packages are used in [watergis/sveltekit-watergis-template](https://github.com/watergis/sveltekit-watergis-template).

- `@watergis/svelte-maplibre-attribute-popup` (see [here](./packages/attribute-popup))
- `@watergis/svelte-maplibre-export` (see [here](./packages/export))
- `@watergis/svelte-maplibre-legend` (see [here](./packages/legend))
- `@watergis/svelte-maplibre-measure` (see [here](./packages/measure))
- `@watergis/svelte-maplibre-menu` (see [here](./packages/menu))
- `@watergis/svelte-maplibre-search` (see [here](./packages/search))
- `@watergis/svelte-maplibre-share` (see [here](./packages/share))
- `@watergis/svelte-maplibre-style-switcher` (see [here](./packages/style-switcher))
- `@watergis/svelte-maplibre-valhalla` (see [here](./packages/valhalla))

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

## Release packages

Please create changeset log for every your work.

```zsh
pnpm changeset
```

Once, the PR is merged into main with changeset log created, the package will be released by Github Actions with changeset automatically.

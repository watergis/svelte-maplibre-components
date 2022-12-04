# svelte-maplibre-components

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![GitHub repo size](https://img.shields.io/github/repo-size/watergis/svelte-maplibre-components)
[![build](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml/badge.svg)](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml)


This repository to manage packages of svelte maplibre components for water application.

## Documentation

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

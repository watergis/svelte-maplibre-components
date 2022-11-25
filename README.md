# svelte-maplibre-components

![GitHub](https://img.shields.io/github/license/watergis/svelte-maplibre-components)
![GitHub repo size](https://img.shields.io/github/repo-size/watergis/svelte-maplibre-components)
[![build](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml/badge.svg)](https://github.com/watergis/svelte-maplibre-components/actions/workflows/build.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/5e6fddd2-c161-4aa8-9de8-61002eac3e21/deploy-status)](https://app.netlify.com/sites/svelte-maplibre-components/deploys)

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

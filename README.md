# svelte-maplibre-components

This repository to manage packages of svelte maplibre components for water application.

## Packages to be managed in this repo

The following packages are used in [watergis/sveltekit-watergis-template](https://github.com/watergis/sveltekit-watergis-template).

- `@watergis/svelte-maplibre-legend`
- `@watergis/svelte-maplibre-attribute-popup`

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

```zsh
cd packages/<pacjage_name>
pnpm version patch
cd ../..
git add .
git commit -m "v0.0.X for <package_name>"
```

The package will be released by Github Actions with changeset automatically.

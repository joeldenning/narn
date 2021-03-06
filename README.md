# narn

Never have to switch between yarn, npm, and pnpm commands ever again.

`narn` is a CLI that detects whether your current npm package is using npm, yarn, or pnpm. It then spawns the correct one with the correct arguments. The arguments to narn itself are exactly the same as if you're using yarn. The command will be converted to npm or pnpm's syntax if the current package is managed by npm / pnpm.

## Installation

```sh
npm i -g narn

yarn global add narn

pnpm i -g narn
```

### Extras

If you run `narn upgrade-interactive` on a project managed by npm, you'll need to globally install [`ncu`](https://github.com/tjunnone/npm-check-updates).

If you run `narn publish` on a project managed by npm, you'll need to globally install [`np`](https://github.com/sindresorhus/np).

## Usage

```sh
# To install from package.json
narn # or narn install

# To add new package
narn add react

# To remove a package
narn remove react

# Add a dev dependency
narn add --dev webpack
narn add -D webpack

# Run a script from the package.json
narn test
narn build

# Publish with interactive UI
narn publish

# Upgrade dependencies with interactive ui
narn upgrade-interactive
narn upgrade-interactive --latest

# Install global library. All global libs are installed with yarn (since the most important thing is just that you consistently use the same package manager for global libs)
narn global add @vue/cli

# yarn create single-spa is similar to npm init single-spa
narn create single-spa

# View the installed versions of narn and yarn/npm
narn -v
narn --version

# global commands are supported too
narnx global add http-server
narnx global remove http-server

# Run npx / pnpx
narnx create-single-spa
```

For more usage, see the [Yarn CLI docs](https://yarnpkg.com/lang/en/docs/cli/) - `narn`'s cli is meant to behave exactly the same.

## Default Package Manager

To set the default package manager that's used in projects that don't have a yarn.lock, pnpm-lock.yaml, or package-lock.json, set the `NARN_DEFAULT_PM` environment variable. You can also add this to your bashrc (or equivalent) to ensure the variable is always there.

```sh
export NARN_DEFAULT_PM=pnpm
narn
```

## Publish behavior

By default, narn uses [`np`](https://github.com/sindresorhus/np) on npm and pnpm projects. However, [`np` doesn't support pnpm](https://github.com/sindresorhus/np/issues/251). Because of that, it might be desireable to turn off `np` as the handler for `npm publish`. To disable `np`, set the following environment variable:

```js
export NARN_PUBLISH=passthrough
narn publish
```

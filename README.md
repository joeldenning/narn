# narn

Never have to switch between yarn, npm, and pnpm commands ever again.

`narn` is a CLI that detects whether your current npm package is using npm, yarn, or pnpm. It then spawns the correct one with the correct arguments. The arguments to narn itself are exactly the same as if you're using yarn. The command will be converted to npm or pnpm's syntax if the current package is managed by npm / pnpm.

## Installation

```sh
npm i -g narn

# Or
yarn global add narn
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

# View the installed versions of narn and yarn/npm
narn -v
narn --version
```

For more usage, see the [Yarn CLI docs](https://yarnpkg.com/lang/en/docs/cli/) - `narn`'s cli is meant to behave exactly the same.

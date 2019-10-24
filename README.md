# narn

Never have to switch between npm and yarn commands ever again.

`narn` is a CLI that detects whether your current npm package is using npm or yarn. It then spawns the correct one with the correct arguments. The arguments to narn itself are exactly the same as if you're using yarn. The command will be converted to npm's syntax if the current package is managed by npm.

## Installation

```sh
npm i -g narn

# Or
yarn global add narn
```

## Usage

```sh
# To install from package.json
narn # or narn install

# To add new package
narn add react

# To remove a package
narn remove react

# Run a script from the package.json
narn test
narn build
```

For more usage, see the [Yarn CLI docs](https://yarnpkg.com/lang/en/docs/cli/) - `narn`'s cli is meant to behave exactly the same.

const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const validateNpmPackageName = require("validate-npm-package-name");

exports.detectPnpm = function detectPnpm(args) {
  if (args && args.length > 0 && args[0] === "global") {
    // all global commands go through yarn
    return Promise.resolve(false);
  } else {
    return new Promise((resolve, reject) => {
      fs.access(
        path.resolve(process.cwd(), "pnpm-lock.yaml"),
        fs.constants.F_OK,
        noPackageLock => {
          resolve(!Boolean(noPackageLock));
        }
      );
    });
  }
};

exports.detectNpm = function detectNpm(args) {
  if (args && args.length > 0 && args[0] === "global") {
    // all global commands go through yarn
    return Promise.resolve(false);
  } else {
    return new Promise((resolve, reject) => {
      fs.access(
        path.resolve(process.cwd(), "package-lock.json"),
        fs.constants.F_OK,
        noPackageLock => {
          resolve(!Boolean(noPackageLock));
        }
      );
    });
  }
};

exports.getYarnArgs = narnArgs => narnArgs;

exports.getNpmArgs = (narnArgs, isPnpm = false) => {
  const yarnArgs = minimist(narnArgs, {
    boolean: ["dev", "D"],
    alias: {
      D: "dev"
    }
  });
  const yarnCommands = yarnArgs._;
  const yarnTarget = yarnCommands.length > 0 ? yarnCommands[0] : "install";
  const yarnSubCommands = yarnCommands.slice(1);
  const narnSubArgs = narnArgs.slice(1);

  let npmTarget;
  let npmArgs;
  let result;
  switch (yarnTarget) {
    case "install":
      npmTarget = "install";
      npmArgs = narnSubArgs;
      break;
    case "add":
      npmTarget = "install";
      const packages = yarnSubCommands.map(transformNarnPackageString);
      const saveType = yarnArgs.dev ? "--save-dev" : "--save";
      npmArgs = [saveType, ...packages];
      break;
    case "remove":
      npmTarget = "uninstall";
      npmArgs = narnSubArgs;
      break;
    case "init":
      npmTarget = "init";
      npmArgs = narnSubArgs;
      break;
    case "update":
    case "upgrade":
      npmTarget = "update";
      npmArgs = narnSubArgs;
      break;
    case "list":
    case "prune":
    case "version":
      // commands that don't need further changes
      npmTarget = yarnTarget;
      npmArgs = narnSubArgs;
      break;
    case "upgrade-interactive":
      if (isPnpm) {
        result = ["-i", ...narnSubArgs];
        result.command = "pnpm";
      } else {
        result = ["-iu", "&&", "narn", "install"];
        result.command = "ncu";
      }
      return result;
    case "publish":
      result = narnSubArgs;
      result.command = "np";
      return result;
    default:
      npmTarget = "run";
      if (narnArgs.length > 1) {
        npmArgs = [narnArgs[0], "--", ...narnSubArgs];
      } else {
        npmArgs = narnArgs;
      }
      break;
  }

  return result || [npmTarget, ...npmArgs];
};

function transformNarnPackageString(packageToAdd) {
  packageToAdd = packageToAdd.replace("file:", "");
  const packageNameWithoutVersion = packageToAdd.slice(
    0,
    packageToAdd.indexOf("@") > 0
      ? packageToAdd.lastIndexOf("@")
      : packageToAdd.length + 1
  );
  const isValidPackageName = validateNpmPackageName(packageNameWithoutVersion)
    .validForNewPackages;
  if (isValidPackageName && packageNameWithoutVersion === packageToAdd) {
    return `${packageToAdd}@latest`;
  } else {
    return packageToAdd;
  }
}

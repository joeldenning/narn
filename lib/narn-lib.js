const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const validateNpmPackageName = require("validate-npm-package-name");

exports.detectYarn = function detectYarn(args) {
  if (args && args.length > 0 && args[0] === "global") {
    // all global commands go through yarn
    return Promise.resolve(true);
  } else {
    return new Promise((resolve, reject) => {
      fs.access(
        path.resolve(process.cwd(), "package-lock.json"),
        fs.constants.F_OK,
        noPackageLock => {
          resolve(Boolean(noPackageLock));
        }
      );
    });
  }
};

exports.getYarnArgs = narnArgs => narnArgs;

exports.getNpmArgs = narnArgs => {
  const yarnArgs = minimist(narnArgs, { boolean: ["dev", "D"] });
  const yarnCommands = yarnArgs._;
  const yarnTarget = yarnCommands.length > 0 ? yarnCommands[0] : "install";
  const yarnSubCommands = yarnCommands.slice(1);
  let npmTarget;
  let npmArgs;
  switch (yarnTarget) {
    case "install":
      npmTarget = "install";
      npmArgs = [];
      break;
    case "add":
      npmTarget = "install";
      const packages = yarnSubCommands.map(transformNarnPackageString);
      const saveType = yarnArgs.dev || yarnArgs.D ? "--save-dev" : "--save";
      npmArgs = [saveType, ...packages];
      break;
    case "remove":
      npmTarget = "uninstall";
      npmArgs = yarnSubCommands;
      break;
    case "init":
      npmTarget = "init";
      npmArgs = [];
      break;
    case "upgrade-interactive":
      if (yarnArgs.latest) {
        return ["ncu", "-iu", "&&", "npm", "install"];
      } else {
        npmTarget = "update";
        npmArgs = yarnSubCommands;
      }
      break;
    default:
      npmTarget = "run";
      if (narnArgs.length > 1) {
        npmArgs = [narnArgs[0], "--", ...narnArgs.slice(1)];
      } else {
        npmArgs = narnArgs;
      }
      break;
  }

  return [npmTarget, ...npmArgs];
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

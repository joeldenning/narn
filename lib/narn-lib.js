const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const validateNpmPackageName = require("validate-npm-package-name");

exports.detectPnpm = function detectNpm(args) {
  if (args && args.length > 0 && args[0] === "global") {
    // all global commands go through yarn
    return Promise.resolve(false);
  } else {
    return new Promise((resolve, reject) => {
      fs.access(
        path.resolve(process.cwd(), "pnpm-lock.yaml"),
        fs.constants.F_OK,
        (noPnpmLock) => {
          resolve(!Boolean(noPnpmLock));
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
        (noPackageLock) => {
          resolve(!Boolean(noPackageLock));
        }
      );
    });
  }
};

exports.getYarnArgs = (narnArgs) => narnArgs;

exports.getNpmArgs = (narnArgs, isPnpm = false) => {
  const yarnArgs = minimist(narnArgs, {
    boolean: ["dev", "D", "latest", "frozen-lockfile"],
  });
  const yarnCommands = yarnArgs._;
  const yarnTarget = yarnCommands.length > 0 ? yarnCommands[0] : "install";
  const yarnSubCommands = yarnCommands.slice(1);
  let npmTarget;
  let npmArgs;
  let result;
  switch (yarnTarget) {
    case "install":
      npmTarget = "install";
      npmArgs = [];
      if (yarnArgs["frozen-lockfile"]) {
        if (isPnpm) {
          npmArgs.push("--frozen-lockfile");
        } else {
          npmTarget = "ci";
        }
      }
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
    case "link":
      npmTarget = "link";
      npmArgs = yarnSubCommands;
      break;
    case "unlink":
      npmTarget = "unlink";
      npmArgs = yarnSubCommands;
      break;
    case "upgrade-interactive":
      if (isPnpm) {
        npmTarget = "update";
        npmArgs = ["--interactive"];
        if (yarnArgs.latest) {
          npmArgs.push("--latest");
        }
        break;
      } else {
        result = ["-iu", "&&", "npm", "install"];
        result.command = "ncu";
        return result;
      }
    case "create":
      npmTarget = "init";
      npmArgs = yarnSubCommands;
      break;
    case "publish":
      result = [];
      result.command = "np";
      return result;
    default:
      npmTarget = "run";
      if (narnArgs.length > 1) {
        npmArgs = [narnArgs[0], "--", ...narnArgs.slice(1)];
      } else if (narnArgs.length === 1 && narnArgs[0] === "run") {
        npmArgs = [];
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

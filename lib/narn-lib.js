const fs = require("fs");
const path = require("path");
const minimist = require("minimist");
const validateNpmPackageName = require("validate-npm-package-name");

exports.detectYarn = function detectYarn(args) {
  if (args && args.length > 0 && args[0] === "global") {
    // all global commands go through default PM
    return Promise.resolve(false);
  } else {
    return new Promise((resolve, reject) => {
      fs.access(
        path.resolve(process.cwd(), "yarn.lock"),
        fs.constants.F_OK,
        (noYarnLock) => {
          resolve(!Boolean(noYarnLock));
        }
      );
    });
  }
};

exports.detectPnpm = function detectNpm(args) {
  if (args && args.length > 0 && args[0] === "global") {
    // all global commands go through default PM
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
    // all global commands go through default PM
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
  let yarnCommands = yarnArgs._;
  let isGlobal = false;
  if (yarnCommands.length > 0 && yarnCommands[0] === "global") {
    isGlobal = true;
    yarnCommands = yarnCommands.slice(1);
  }
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

      if (isGlobal) {
        npmArgs = npmArgs.slice(1);
      }

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
      if (process.env.NARN_PUBLISH === "passthrough") {
        return narnArgs;
      } else {
        result = [];
        result.command = "np";
        return result;
      }
    case "version":
      npmTarget = "version";
      npmArgs = yarnSubCommands;
      if (yarnArgs.preid) {
        npmArgs.unshift("--preid", yarnArgs.preid);
      }
      const versionFlags = [
        "patch",
        "minor",
        "major",
        "premajor",
        "prepatch",
        "preminor",
        "prerelease",
      ];
      versionFlags.forEach((f) => {
        if (yarnArgs[f]) {
          npmArgs.unshift(f);
        }
      });
      break;
    case "info":
      npmTarget = "info";
      npmArgs = narnArgs.slice(1);
      break;
    case "exec":
      npmTarget = "exec";
      npmArgs = narnArgs.slice(1);
      break;
    default:
      npmTarget = "run";
      // Don't end up with a: <cmd> run run [optScript]
      if (narnArgs[0] === "run") {
        narnArgs.shift();
      }
      if (narnArgs.length > 1) {
        // https://github.com/pnpm/pnpm/discussions/4678
        const doubleDashArgs = isPnpm ? [] : ["--"];

        npmArgs = [narnArgs[0], ...doubleDashArgs, ...narnArgs.slice(1)];
      } else {
        npmArgs = narnArgs;
      }
      break;
  }

  if (isGlobal) {
    npmArgs.unshift("--global");
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
  const isValidPackageName = validateNpmPackageName(
    packageNameWithoutVersion
  ).validForNewPackages;
  if (isValidPackageName && packageNameWithoutVersion === packageToAdd) {
    return `${packageToAdd}@latest`;
  } else {
    return packageToAdd;
  }
}

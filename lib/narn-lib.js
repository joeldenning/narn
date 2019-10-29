const fs = require("fs");
const path = require("path");
const minimist = require("minimist");

exports.detectYarn = function detectYarn() {
  return new Promise((resolve, reject) => {
    fs.access(
      path.resolve(process.cwd(), "package-lock.json"),
      fs.constants.F_OK,
      noPackageLock => {
        resolve(Boolean(noPackageLock));
      }
    );
  });
};

exports.getYarnArgs = narnArgs => narnArgs;

exports.getNpmArgs = narnArgs => {
  const yarnArgs = minimist(narnArgs, { boolean: ["dev", "D"] });
  const yarnCommands = yarnArgs._;
  let yarnTarget = yarnCommands.length > 0 ? yarnCommands[0] : "install";
  let yarnSubCommands = yarnCommands.slice(1);
  const targetSpaceIndex = yarnTarget.indexOf(" ");
  if (targetSpaceIndex >= 0) {
    yarnSubCommands = [
      yarnTarget.slice(targetSpaceIndex).trim(),
      ...yarnSubCommands
    ];
    yarnTarget = yarnTarget.slice(0, targetSpaceIndex);
  }
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
    default:
      npmTarget = "run";
      npmArgs = [yarnTarget];
      if (yarnSubCommands.length > 0) {
        npmArgs.push("--", ...yarnSubCommands);
      }
      break;
  }

  return [npmTarget, ...npmArgs];
};

function transformNarnPackageString(packageToAdd) {
  return packageToAdd.lastIndexOf("@") > 0
    ? packageToAdd
    : `${packageToAdd}@latest`;
}

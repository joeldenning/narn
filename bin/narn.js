#!/usr/bin/env node
const { spawn } = require("child_process");
const {
  detectYarn,
  detectNpm,
  detectPnpm,
  getYarnArgs,
  getNpmArgs,
} = require("../lib/narn-lib.js");
const fs = require("fs");
const path = require("path");

const narnPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"))
);

async function runPackageManager() {
  const narnArgs = process.argv.slice(2);
  const [isNpm, isPnpm, isYarn] = await Promise.all([
    detectNpm(narnArgs),
    detectPnpm(narnArgs),
    detectYarn(narnArgs),
  ]);

  let command;

  if (isPnpm) {
    command = "pnpm";
  } else if (isNpm) {
    command = "npm";
  } else if (isYarn) {
    command = "yarn";
  } else if (process.env.NARN_DEFAULT_PM === "pnpm") {
    command = "pnpm";
  } else if (process.env.NARN_DEFAULT_PM === "npm") {
    command = "npm";
  } else {
    command = "yarn";
  }

  let commandArgs;

  const firstArg = narnArgs.length > 0 ? narnArgs[0] : null;
  if (firstArg === "--version" || firstArg === "-v") {
    console.info(`narn version ${narnPackageJson.version}`);
    commandArgs = narnArgs;
  } else {
    commandArgs =
      command === "yarn" ? getYarnArgs(narnArgs) : getNpmArgs(narnArgs, isPnpm);
  }

  command = commandArgs.command || command;

  console.info(`${command} ${commandArgs.join(" ")}`);
  spawn(command, commandArgs, { stdio: "inherit", shell: true });
}

runPackageManager().catch((err) => {
  console.error(err);
  process.exit(1);
});

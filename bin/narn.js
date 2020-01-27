#!/usr/bin/env node
const { spawn } = require("child_process");
const { detectYarn, getYarnArgs, getNpmArgs } = require("../lib/narn-lib.js");
const fs = require("fs");
const path = require("path");

const narnPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"))
);

async function runPackageManager() {
  const narnArgs = process.argv.slice(2);
  const isYarn = await detectYarn(narnArgs);
  let command = isYarn ? "yarn" : "npm";
  let commandArgs;

  const firstArg = narnArgs.length > 0 ? narnArgs[0] : null;
  if (firstArg === "--version" || firstArg === "-v") {
    console.info(`narn version ${narnPackageJson.version}`);
    commandArgs = narnArgs;
  } else {
    commandArgs = isYarn ? getYarnArgs(narnArgs) : getNpmArgs(narnArgs);
  }

  command = commandArgs.command || command;

  console.info(`${command} ${commandArgs.join(" ")}`);
  spawn(command, commandArgs, { stdio: "inherit", shell: true });
}

runPackageManager().catch(err => {
  console.error(err);
  process.exit(1);
});

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
  const command = isYarn ? "yarn" : "npm";
  let commandArgs;

  const firstArg = narnArgs.length > 0 ? narnArgs[0] : null;
  if (firstArg === "--version" || firstArg === "-v") {
    console.info(`narn version ${narnPackageJson.version}`);
    commandArgs = narnArgs;
  } else {
    commandArgs = isYarn ? getYarnArgs(narnArgs) : getNpmArgs(narnArgs);
  }

  console.info(`${command} ${commandArgs.join(" ")}`);
  spawn(command, commandArgs, { stdio: "inherit" });
}

runPackageManager().catch(err => {
  console.error(err);
  process.exit(1);
});

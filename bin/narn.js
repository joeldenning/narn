#!/usr/bin/env node
const { spawn } = require("child_process");
const { detectYarn, getYarnArgs, getNpmArgs } = require("../lib/narn-lib.js");

async function runPackageManager() {
  const isYarn = await detectYarn();
  const narnArgs = process.argv.slice(2);

  const command = isYarn ? "yarn" : "npm";
  const commandArgs = isYarn ? getYarnArgs(narnArgs) : getNpmArgs(narnArgs);

  console.info(`${command} ${commandArgs.join(" ")}`);

  spawn(command, commandArgs, { stdio: "inherit" });
}

runPackageManager().catch(err => {
  console.error(err);
  process.exit(1);
});

#!/usr/bin/env node
const { spawn } = require("child_process");
const { detectYarn, getYarnArgs, getNpmArgs } = require("../lib/narn-lib.js");
const fs = require("fs");
const path = require("path");

const narnPackageJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../package.json"))
);

async function runPackageManager() {
  const isYarn = await detectYarn();
  const narnArgs = process.argv.slice(2);

  const command = isYarn ? "yarn" : "npm";
  const commandArgs = isYarn ? getYarnArgs(narnArgs) : getNpmArgs(narnArgs);

  if (narnArgs.includes("--version")) {
    console.info(`narn version ${narnPackageJson.version}`);
  }
  console.info(`${command} ${commandArgs.join(" ")}`);

  spawn(command, commandArgs, { stdio: "inherit" });
}

runPackageManager().catch(err => {
  console.error(err);
  process.exit(1);
});

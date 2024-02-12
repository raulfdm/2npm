#!/usr/bin/env node
const { execSync } = require("node:child_process");

// Get the arguments passed to the script
const args = process.argv.slice(2);

// Execute the Go binary with the arguments
//
// The stdio: "inherit" option is used to pass the standard
// input/output/error of the current process to the child process
execSync(`./dist/go-demo-cli ${args.join(" ")}`, { stdio: "inherit" });

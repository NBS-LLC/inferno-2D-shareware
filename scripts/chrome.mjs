#!/usr/bin/env node

import { exec } from "child_process";

const platform = process.platform;
const url = process.argv[2];

let command = "";
switch (platform) {
  case "darwin":
    command = `open -a 'Google Chrome' ${url}`;
    break;

  case "linux":
    command = `google-chrome ${url}`;
    break;

  case "win32":
    command = `start chrome ${url}`;
    break;

  default:
    throw new Error("Unsupported platform.");
}

exec(command);

#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { log, writeTypesToDisc } from "./plugin";

const existsSync = (f: string): boolean => {
  try {
    fs.accessSync(f, fs.constants.F_OK);
    return true;
  } catch (_) {
    return false;
  }
};

function findDir(dir: string, name: "pages" | "app"): string | null {
  // prioritize ./${name} over ./src/${name}
  let curDir = path.join(dir, name);
  if (existsSync(curDir)) return curDir;

  curDir = path.join(dir, "src", name);
  if (existsSync(curDir)) return curDir;

  return null;
}

const pagesDir = findDir("./", "pages");
const appDir = findDir("./", "app");
if (pagesDir || appDir) {
  writeTypesToDisc({
    pagesRouterDir: pagesDir ? path.resolve(pagesDir) : undefined,
    appRouterDir: appDir ? path.resolve(appDir) : undefined,
  });
} else {
  log("no router directory found");
}

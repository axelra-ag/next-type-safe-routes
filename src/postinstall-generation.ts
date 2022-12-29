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
if (pagesDir) {
  writeTypesToDisc(path.resolve(pagesDir));
} else {
  log("no pages directory found");
}

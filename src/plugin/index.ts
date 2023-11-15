import generateTypeScriptFile from "./generateTypeScriptFile";

import fs from "fs";
import chokidar from "chokidar";
import path from "path";
import { RouterDirectories } from "./generateTypeScriptFile/types";

const packageName = "next-type-safe-routes";
const filename = "utils.d.ts";

export const log = (message: string) => {
  console.log(`\x1b[36m${packageName}\x1b[0m: ${message}`);
};

export const writeTypesToDisc = (dirs: RouterDirectories) => {
  // we assume the src directory is the directory containing the pages directory
  const srcDir = path.dirname(__dirname);
  const typeScriptFile = generateTypeScriptFile(dirs);

  fs.writeFileSync(path.join(srcDir, filename), typeScriptFile);

  log(`types written to ${path.join(packageName, "dist", filename)}`);
};

const run = (nextConfig: any = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const appRouterDir = fs.existsSync(__dirname + "/app")
        ? __dirname + "/app"
        : fs.existsSync(__dirname + "/src/app")
        ? __dirname + "/src/app"
        : undefined;
      const pagesRouterDir = fs.existsSync(__dirname + "/pages")
        ? __dirname + "/pages"
        : fs.existsSync(__dirname + "/src/pages")
        ? __dirname + "/src/pages"
        : undefined;

      const dirs: RouterDirectories = {
        pagesRouterDir,
        appRouterDir,
      };
      // Generate the types file when the app is being compiled
      writeTypesToDisc(dirs);
      // Generate the types file again when page files are added/removed
      const watcher = chokidar.watch(
        Object.values(dirs).filter((value) => value !== undefined),
        { ignoreInitial: true }
      );
      watcher.on("add", () => writeTypesToDisc(dirs));
      watcher.on("unlink", () => writeTypesToDisc(dirs));

      // if other webpack customizations exist, run them
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      // Return the un-modified config
      return config;
    },
  });
};

export default run;

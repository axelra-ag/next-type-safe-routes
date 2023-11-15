import walkSync from "walk-sync";

import getFileContent from "./getFileContent";
import getPagesRouterRoutes from "./getPagesRouterRoutes";
import getAppRouterPagesRoutes from "./getAppRouterPagesRoutes";
import getAppRouterApiRoutes from "./getAppRouterApiRoutes";

const ignorePagesRoutes = ["_app", "_document"];
const shouldIncludePagesRouterPageEntry = (route: string) =>
  route.match(".tsx") &&
  !ignorePagesRoutes.includes(route.replace(/(\.[^.]+)+$/, ""));
const removeAppRouterLayoutGroups = (route: string) =>
  route.replace(/\([^)]+\)\//, "");
const shouldIncludeAppRouterPageEntry = (route: string) =>
  route.endsWith("page.tsx");
const shouldIncludePagesRouterApiRouteEntry = (endpoint: string) =>
  endpoint.match(".ts");
const shouldIncludeAppRouterApiRouteEntry = (route: string) =>
  route.match(/route\.(js|ts|tsx)$/);
const getApiRouteFiles = (pagesDir: string) => {
  try {
    return walkSync(`${pagesDir}/api`, {
      directories: false,
    });
  } catch (err) {
    // api routes are not required
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
};

const generateTypeScriptFile = ({
  pagesRouterDir,
  appRouterDir,
}: {
  pagesRouterDir?: string;
  appRouterDir?: string;
}) => {
  const pagesRouterPagesFiles = pagesRouterDir
    ? walkSync(pagesRouterDir, {
        directories: false,
        ignore: ["api"],
      })
    : [];
  const appRouterPagesFiles = appRouterDir
    ? walkSync(appRouterDir, {
        directories: false,
      })
    : [];
  const pagesRouterApiRouteFiles = pagesRouterDir
    ? getApiRouteFiles(pagesRouterDir)
    : [];

  const relevantPagesRouterPages = pagesRouterPagesFiles.filter(
    shouldIncludePagesRouterPageEntry
  );
  const relevantAppRouterPages = appRouterPagesFiles
    .map(removeAppRouterLayoutGroups)
    .filter(shouldIncludeAppRouterPageEntry);

  const pages = [
    ...getPagesRouterRoutes(relevantPagesRouterPages.map((page) => `/${page}`)),
    ...getAppRouterPagesRoutes(
      relevantAppRouterPages.map((page) => `/${page}`)
    ),
  ];

  const relevantApiRoutes = pagesRouterApiRouteFiles.filter(
    shouldIncludePagesRouterApiRouteEntry
  );
  const relevantAppRouterApiRoutes = appRouterPagesFiles
    .map(removeAppRouterLayoutGroups)
    .filter(shouldIncludeAppRouterApiRouteEntry);
  const apiRoutes = [
    ...getPagesRouterRoutes(relevantApiRoutes.map((route) => `/api/${route}`)),
    ...getAppRouterApiRoutes(
      relevantAppRouterApiRoutes.map((route) => `/${route}`)
    ),
  ];

  const fileContent = getFileContent({ pages, apiRoutes });

  return fileContent;
};

export default generateTypeScriptFile;

import { getIsCatchAllRoute, getIsOptionalCatchAllRoute } from "./utils";

const getNextAppRouterPageRoute = (fileName: string) => {
  if (getIsOptionalCatchAllRoute(fileName)) {
    return fileName.split("/[[...")[0];
  } else if (getIsCatchAllRoute(fileName)) {
    return fileName.split("/[...")[0];
  }

  const route = fileName
    // remove the file extension
    .replace(/(\.[^.]+)+$/, "")
    // index pages don't need the "/index" when used as hrefs
    .replace("/route", "");

  // if this is the root index file, return "/"" instead of ""
  return route === "" ? "/" : route;
};

export default getNextAppRouterPageRoute;

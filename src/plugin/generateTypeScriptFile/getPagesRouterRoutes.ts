import getNextPagesRouterPageRoute from "./getNextPagesRouterPageRoute";
import getNextRouteUrlParams from "./getNextRouteUrlParams";
import { Page } from "./types";
import { getIsCatchAllRoute, getIsOptionalCatchAllRoute } from "./utils";

const getPagesRouterRoutes = (fileNames: string[]): Page[] => {
  return fileNames.map((fileName) => {
    return {
      route: getNextPagesRouterPageRoute(fileName),
      params: getNextRouteUrlParams(fileName),
      isCatchAllRoute: getIsCatchAllRoute(fileName),
      isOptionalCatchAllRoute: getIsOptionalCatchAllRoute(fileName),
    };
  });
};

export default getPagesRouterRoutes;

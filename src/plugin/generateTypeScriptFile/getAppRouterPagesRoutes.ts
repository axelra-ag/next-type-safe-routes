import getNextRouteUrlParams from "./getNextRouteUrlParams";
import { Page } from "./types";
import { getIsCatchAllRoute, getIsOptionalCatchAllRoute } from "./utils";
import getNextAppRouterPageRoute from "./getNextAppRouterPageRoute";

const getAppRouterPagesRoutes = (fileNames: string[]): Page[] => {
  return fileNames.map((fileName) => {
    return {
      route: getNextAppRouterPageRoute(fileName),
      params: getNextRouteUrlParams(fileName),
      isCatchAllRoute: getIsCatchAllRoute(fileName),
      isOptionalCatchAllRoute: getIsOptionalCatchAllRoute(fileName),
    };
  });
};

export default getAppRouterPagesRoutes;

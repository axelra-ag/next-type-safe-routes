import { ApiRoute, Page } from "./types";

const getParam = (param: string) => `"${param}": string | number`;

const getTypeSafeRoute = ({
  route,
  params,
  isCatchAllRoute,
  isOptionalCatchAllRoute,
}: ApiRoute) => {
  if (!params?.length) {
    if (isOptionalCatchAllRoute) {
      return `"${route}" | { route: "${route}", path?: string, query?: Query }`;
    } else if (isCatchAllRoute) {
      return `{ route: "${route}", path: string, query?: Query }`;
    } else {
      return `"${route}" | { route: "${route}", query?: Query }`;
    }
  } else {
    const paramsString = params.map(getParam).join(",");
    if (isOptionalCatchAllRoute) {
      return `"${route}" | { route: "${route}", path?: string, params: { ${paramsString} }, query?: Query }`;
    } else if (isCatchAllRoute) {
      return `{ route: "${route}", path: string, params: { ${paramsString} }, query?: Query }`;
    } else {
      return `{ route: "${route}", params: { ${paramsString} }, query?: Query }`;
    }
  }
};

type Args = {
  apiRoutes: ApiRoute[];
  pages: Page[];
};

const getFileContent = ({
  apiRoutes,
  pages,
}: Args) => `// IMPORTANT! This file is autogenerated by the \`type-safe-next-routes\` 
// package. You should _not_ update these types manually...

declare module "next-type-safe-routes" {
  type Query = { [key: string]: any };
  export type TypeSafePage = ${pages.map(getTypeSafeRoute).join(" | ")};
  ${
    apiRoutes.length > 0
      ? `export type TypeSafeApiRoute = ${apiRoutes
          .map(getTypeSafeRoute)
          .join(" | ")};`
      : ""
  }
  export const getPathname = (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
  export const getRoute = (typeSafeUrl: TypeSafePage | TypeSafeApiRoute) => string;
}
`;

export default getFileContent;

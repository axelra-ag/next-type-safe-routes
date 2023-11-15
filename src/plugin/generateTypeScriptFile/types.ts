export type Page = {
  route: string;
  params?: string[];
  isCatchAllRoute: boolean;
  isOptionalCatchAllRoute: boolean;
};

export type ApiRoute = Page;

export type RouterDirectories = {
  pagesRouterDir?: string;
  appRouterDir?: string;
};

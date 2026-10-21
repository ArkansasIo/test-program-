import { RAILWAY_MODULES } from './railwayModules';

export interface RailwayRouteDefinition {
  routeId: string;
  menuId: string;
  moduleId: string;
  pageId: string;
  path: string;
  title: string;
}

export const RAILWAY_ROUTES: RailwayRouteDefinition[] = RAILWAY_MODULES.flatMap((module) =>
  module.subModules.map((page) => ({
    routeId: page.pageId,
    menuId: module.menuId,
    moduleId: module.id,
    pageId: page.id,
    path: `/railway/${module.id}/${page.id}`,
    title: page.pageTitle,
  })),
);

export const RAILWAY_ROUTE_MAP = Object.fromEntries(RAILWAY_ROUTES.map((route) => [route.routeId, route]));

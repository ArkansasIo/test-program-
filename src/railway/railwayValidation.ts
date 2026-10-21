import { RAILWAY_MODULES } from './railwayModules';
import { RAILWAY_ROUTES } from './railwayRoutes';

export interface RailwayValidationIssue { severity: 'error' | 'warning'; code: string; message: string; }

export function validateRailwayConfiguration(): RailwayValidationIssue[] {
  const issues: RailwayValidationIssue[] = [];
  const pageIds = RAILWAY_MODULES.flatMap((module) => module.subModules.map((page) => page.pageId));
  const actionIds = RAILWAY_MODULES.flatMap((module) => module.subModules.flatMap((page) => page.actions.map((action) => action.id)));
  if (RAILWAY_MODULES.length !== 11) issues.push({ severity: 'error', code: 'MODULE_COUNT', message: `Expected 11 modules; found ${RAILWAY_MODULES.length}.` });
  if (pageIds.length !== 44) issues.push({ severity: 'error', code: 'PAGE_COUNT', message: `Expected 44 pages; found ${pageIds.length}.` });
  if (RAILWAY_ROUTES.length !== pageIds.length) issues.push({ severity: 'error', code: 'ROUTE_COUNT', message: 'Every railway page must have one generated route.' });
  const duplicate = (values: string[]) => values.filter((value, index) => values.indexOf(value) !== index);
  duplicate(pageIds).forEach((id) => issues.push({ severity: 'error', code: 'DUPLICATE_PAGE_ID', message: `Duplicate page ID: ${id}` }));
  duplicate(actionIds).forEach((id) => issues.push({ severity: 'warning', code: 'DUPLICATE_ACTION_ID', message: `Action ID is reused: ${id}` }));
  for (const module of RAILWAY_MODULES) {
    if (!module.menuId.startsWith('railway.')) issues.push({ severity: 'error', code: 'MENU_ID', message: `${module.id} has invalid menu ID.` });
    for (const page of module.subModules) {
      if (page.pageId !== `railway.page.${page.id}`) issues.push({ severity: 'error', code: 'PAGE_ID', message: `${page.id} has invalid page ID.` });
      if (page.actions.length === 0) issues.push({ severity: 'warning', code: 'NO_ACTIONS', message: `${page.pageId} has no actions.` });
    }
  }
  return issues;
}

export function assertRailwayConfiguration(): void {
  const errors = validateRailwayConfiguration().filter((issue) => issue.severity === 'error');
  if (errors.length) throw new Error(errors.map((issue) => `${issue.code}: ${issue.message}`).join('\n'));
}

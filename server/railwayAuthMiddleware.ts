import type { NextFunction, Request, Response } from 'express';
import { hasPermission, type RailwayPermission, type RailwayPrincipal, type RailwayRole } from '../src/railway/railwayAuth';

export function principalFromRequest(req: Request): RailwayPrincipal {
  const id = req.header('x-railway-user') || 'anonymous';
  const username = req.header('x-railway-username') || id;
  const rawRoles = (req.header('x-railway-role') || 'viewer').split(',').map((value) => value.trim()) as RailwayRole[];
  const allowed: RailwayRole[] = ['administrator', 'dispatcher', 'station-controller', 'maintenance-controller', 'crew-controller', 'safety-manager', 'analyst', 'viewer'];
  const roles = rawRoles.filter((role) => allowed.includes(role));
  return { id, username, roles: roles.length ? roles : ['viewer'], enabled: true };
}

export function requireRailwayPermission(permission: RailwayPermission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const principal = principalFromRequest(req);
    if (!hasPermission(principal, permission)) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: `Permission ${permission} is required.` } });
      return;
    }
    next();
  };
}

export function requireRailwayRole(role: RailwayRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const principal = principalFromRequest(req);
    if (!principal.roles.includes(role) && !principal.roles.includes('administrator')) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: `Role ${role} is required.` } });
      return;
    }
    next();
  };
}

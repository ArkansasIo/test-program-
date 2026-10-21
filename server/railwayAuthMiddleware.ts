import type { NextFunction, Request, Response } from 'express';

export type RailwayRole = 'viewer' | 'dispatcher' | 'maintenance' | 'safety' | 'administrator';

export interface RailwayPrincipal {
  id: string;
  role: RailwayRole;
}

const roleRank: Record<RailwayRole, number> = {
  viewer: 10,
  dispatcher: 20,
  maintenance: 20,
  safety: 30,
  administrator: 40,
};

export function principalFromRequest(req: Request): RailwayPrincipal {
  const id = req.header('x-railway-user') || 'anonymous';
  const role = (req.header('x-railway-role') || 'viewer') as RailwayRole;
  return { id, role: role in roleRank ? role : 'viewer' };
}

export function requireRailwayRole(minimumRole: RailwayRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const principal = principalFromRequest(req);
    if (roleRank[principal.role] < roleRank[minimumRole]) {
      res.status(403).json({ error: { code: 'FORBIDDEN', message: `Role ${minimumRole} or higher is required.` } });
      return;
    }
    next();
  };
}

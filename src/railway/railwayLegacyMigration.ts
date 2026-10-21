/**
 * Legacy-game migration boundary.
 *
 * The repository previously contained a space-strategy game domain. The active
 * application is now Railway Operations Control. This module provides a small
 * explicit boundary for tooling that needs to identify legacy concepts without
 * importing them into the railway runtime.
 */

export const LEGACY_SOURCE_FILES = [
  'src/types.ts',
  'src/gameData.ts',
  'src/ogameData.ts',
  'src/mmorpgOgameData.ts',
  'src/hyperspaceData.ts',
  'src/stargateNpcRacesData.ts',
  'src/accountProfilesData.ts',
  'src/adminData.ts',
  'src/storeBattlePassData.ts',
  'src/stellarEncyclopediaData.ts',
  'src/cronData.ts',
] as const;

export interface RailwayReplacementDomain {
  legacyConcept: string;
  railwayDomain: string;
  replacementStatus: 'implemented' | 'planned';
}

export const LEGACY_REPLACEMENT_MAP: RailwayReplacementDomain[] = [
  { legacyConcept: 'planet / colony', railwayDomain: 'station / location', replacementStatus: 'implemented' },
  { legacyConcept: 'fleet', railwayDomain: 'train fleet / consist', replacementStatus: 'implemented' },
  { legacyConcept: 'shipyard', railwayDomain: 'fleet maintenance / depot', replacementStatus: 'implemented' },
  { legacyConcept: 'galaxy map', railwayDomain: 'network map', replacementStatus: 'implemented' },
  { legacyConcept: 'fleet movement', railwayDomain: 'train movement / telemetry', replacementStatus: 'implemented' },
  { legacyConcept: 'research tree', railwayDomain: 'engineering standards / configuration', replacementStatus: 'planned' },
  { legacyConcept: 'combat event', railwayDomain: 'safety incident', replacementStatus: 'implemented' },
  { legacyConcept: 'resource economy', railwayDomain: 'operations KPI / capacity model', replacementStatus: 'implemented' },
  { legacyConcept: 'alliance / empire', railwayDomain: 'operator organization / access domain', replacementStatus: 'implemented' },
];

export function isLegacySource(path: string): boolean {
  return (LEGACY_SOURCE_FILES as readonly string[]).includes(path);
}

export function railwayReplacementFor(legacyConcept: string): RailwayReplacementDomain | undefined {
  return LEGACY_REPLACEMENT_MAP.find((item) => item.legacyConcept === legacyConcept);
}

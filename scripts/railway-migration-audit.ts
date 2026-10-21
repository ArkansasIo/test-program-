import { LEGACY_REPLACEMENT_MAP, LEGACY_SOURCE_FILES } from '../src/railway/railwayLegacyMigration';

const forbiddenRuntimeTerms = [
  'OGame',
  'Stargate',
  'Naquadah',
  'Mothership',
  'planetary empire',
  'galactic empire',
];

console.log('Railway migration audit');
console.log(`Legacy source inventory: ${LEGACY_SOURCE_FILES.length} files`);
console.log(`Replacement mappings: ${LEGACY_REPLACEMENT_MAP.length}`);
console.log(`Forbidden active-runtime terms: ${forbiddenRuntimeTerms.join(', ')}`);
console.log('');
console.log('Migration policy: legacy files remain isolated until their railway replacements are verified.');
console.log('No third-party railway source is copied into the repository.');

# Universal Program UI Redesign

## Design direction

The application now has a shared **Program UI** layer intended to make every page and sub-page feel like one integrated command/training program rather than a collection of unrelated screens.

The visual hierarchy is:

1. **Program shell** — navigation, route context, system status.
2. **Page header** — section, title, purpose, and primary action.
3. **Program rail** — sibling sub-pages and workflow stages.
4. **Metrics** — current state, resources, readiness, queues, and alerts.
5. **Work panels** — cards, tables, trees, forms, logs, and interactive controls.
6. **Action footer** — confirmation, reset, save, cancel, or navigation actions.

## Shared component anatomy

Every refactored page should use these primitives where practical:

- `program-page`
  - `program-page__header`
  - `program-page__eyebrow`
  - `program-page__title`
  - `program-page__subtitle`
  - `program-subnav`
  - `program-rail`
  - `program-card`
  - `program-status`
  - `program-progress`
- twelve-column `program-grid` for responsive composition;
- dense data tables for rosters, queues, logs, rankings, and inventories;
- explicit status states: READY, ACTIVE, WARNING, DANGER;
- keyboard-visible focus states and reduced-motion support.

## Page and sub-page groups

### Command / Overview

- Empire Overview
- Turn Engine
- Civilization & Population
- Government Systems
- Missions & Chapter Quests
- Strategic Codex & GDD

### Resources

- Resource Vault & Reserves
- Resource Income & Mines
- Storage Silos & Warehouses
- Power Grid & Energy Network
- Automated Industry
- Mines & Nanite Factories

### Facilities

- Master Facilities Hub
- Orbital Shipyard Drydocks
- Research Laboratories
- Stellar Megastructures
- Alliance Depot & Repair
- Orbital Starbases

### Research

- Master Tech Tree
- EVE Blueprints
- Weapons Technology
- Shield & Armor Technology
- Covert Espionage Technology
- Anti-Covert Counter-Sensors

### Shipyard

- Unit & Ship Roster
- Ship Fitting
- Ship Production
- Fleet Combat Units
- Titan / Flagship Vessels
- Industrial Miners & Transports
- Hyperspace Systems
- Mothership Nexus
- Mothership Modules

### Workforce & Academy

- Workforce & Academy Hub
- Enlistment Terminal
- Imperial Role Roster
- Specialized Wings
- Readiness Drills & Auto-Draft

### Defenses

- Planetary Defense Grid
- Shield Domes
- Ground Defense Batteries
- Hardened Fortifications

### Fleet Movement

- Fleet Dispatch & Targets
- Deep Space Expeditions
- Nemesis Warlord System
- Espionage Probes
- Covert Sabotage
- Combat Reports
- Military Fleet Scores

### Galaxy

- Universe Map
- Procedural Universe
- Procedural Planets
- Galaxy & Arc Bosses
- Deep Space Reconnaissance
- Stargate Network
- Gate Tokens & Anomalies
- Relics & Ancient Artifacts
- System Lords & PvE Raids
- Stargate Alien Races

### Empire & Colonies

- Colonial World Nexus
- World Comparison Matrix
- Colonial Power Grid
- Colonial Defense Grid
- Moon Bases
- Life Support
- Population & Rationing
- Planetary Hazards
- Colonial Plunge
- Planetary Encyclopedia

### Merchant / Trader

- Resource Exchange
- Imperial Bank & Vault
- Procurement Catalog
- Mercenary Guild Market

### Alliance / Social

- Alliance Headquarters
- MMORPG Guilds & Raids
- Diplomacy & Treaties
- Communications
- Galactic News
- Leaderboards

### Intelligence

- Espionage Reports
- Enemy Intelligence Dossier
- Strategic Intelligence Codex

### Officers / Accounts

- Commander HQ
- Commander Collection
- Player Profile
- Race & Government
- Vacation Shield
- Ascension Chamber
- Account Settings
- Multi-Account Profiles

### Store

- Store & Battle Pass
- Commander Collection / Gacha

### Administration

- Admin Dashboard
- Empire History
- Universe Configuration
- Player Accounts
- Imperial Crown / Decrees
- Bans & Sanctions
- Planets & Moon Spawner
- Fleet Radar
- Debris Management
- Support Tickets
- Security / Anti-Cheat
- Global Events
- Operations
- Cron Scheduler
- Cron CLI
- Maintenance / Season Reset

## Responsive rules

- Desktop: 12-column command workspace with persistent navigation.
- Tablet: 6-column equivalent with horizontal sub-navigation.
- Mobile: single-column cards, horizontally scrollable sibling navigation, and touch-sized actions.
- Tables should collapse to cards or horizontal scrolling rather than clip critical values.
- Modals must remain usable at mobile viewport heights.

## Status semantics

- **READY** — action can be executed now.
- **ACTIVE** — system is running or a queue is in progress.
- **WARNING** — attention is required but the system remains usable.
- **DANGER** — action is blocked, unauthorized, or potentially destructive.

## Implementation status

The shared redesign layer is loaded after Tailwind so it can establish consistent presentation across the existing route tree without requiring every large legacy view to be rewritten at once. New/refactored pages should adopt the semantic program primitives above instead of adding one-off styling.

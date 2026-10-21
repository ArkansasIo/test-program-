-- Railway Operations Control Platform schema extension
-- Completes the domain tables consumed by server/railwayMysqlRepository.ts.
-- Reference/prototype schema only; not a certified railway safety database.

CREATE TABLE IF NOT EXISTS railway_services (
  id VARCHAR(64) PRIMARY KEY,
  service_number VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  origin VARCHAR(64) NOT NULL,
  destination VARCHAR(64) NOT NULL,
  pattern_json JSON NOT NULL,
  state VARCHAR(32) NOT NULL,
  planned_departure VARCHAR(16) NOT NULL,
  planned_arrival VARCHAR(16) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS railway_timetables (
  id VARCHAR(64) PRIMARY KEY,
  version VARCHAR(32) NOT NULL,
  service_date DATE NOT NULL,
  state VARCHAR(32) NOT NULL,
  services_json JSON NOT NULL,
  published_at TIMESTAMP NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS railway_routes (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  origin VARCHAR(64) NOT NULL,
  destination VARCHAR(64) NOT NULL,
  sections_json JSON NOT NULL,
  direction VARCHAR(24) NOT NULL,
  state VARCHAR(32) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS railway_platforms (
  id VARCHAR(64) PRIMARY KEY,
  station_id VARCHAR(64) NOT NULL,
  name VARCHAR(100) NOT NULL,
  length_m INT NOT NULL,
  state VARCHAR(32) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_platform_station (station_id)
);

CREATE TABLE IF NOT EXISTS railway_consists (
  id VARCHAR(64) PRIMARY KEY,
  service_id VARCHAR(64),
  vehicles_json JSON NOT NULL,
  formation_state VARCHAR(32) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS railway_duties (
  id VARCHAR(64) PRIMARY KEY,
  crew_member_id VARCHAR(64) NOT NULL,
  start_time VARCHAR(32) NOT NULL,
  end_time VARCHAR(32) NOT NULL,
  services_json JSON NOT NULL,
  state VARCHAR(32) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS railway_integrations (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  integration_type VARCHAR(40) NOT NULL,
  state VARCHAR(32) NOT NULL,
  last_heartbeat_at TIMESTAMP NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Added to the existing railway_crew_members table from railway_schema.sql.
ALTER TABLE railway_crew_members
  ADD COLUMN IF NOT EXISTS qualification_ids_json JSON NOT NULL DEFAULT (JSON_ARRAY());

CREATE INDEX idx_service_state ON railway_services(state);
CREATE INDEX idx_timetable_date ON railway_timetables(service_date);
CREATE INDEX idx_route_state ON railway_routes(state);
CREATE INDEX idx_duty_crew ON railway_duties(crew_member_id);
CREATE INDEX idx_integration_state ON railway_integrations(state);

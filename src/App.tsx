import React from 'react';
import { RailwayOperationsApp } from './components/railway/RailwayOperationsApp';
import './styles/railway-control.css';
import './styles/railway-modules.css';
import './styles/railway-platform.css';

/**
 * Railway Operations Software application entry point.
 *
 * The former space-strategy/game shell has been removed from the active
 * application path. RailwayOperationsApp owns the railway menu hierarchy,
 * operational pages, controllers and control-room GUI.
 */
export default function App() {
  return <RailwayOperationsApp />;
}

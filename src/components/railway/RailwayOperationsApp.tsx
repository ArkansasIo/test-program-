import React, { useMemo, useState } from 'react';
import { Activity, AlertTriangle, CheckCircle2, ChevronRight, Command, Map, Play, ShieldCheck, Square, TrainFront, Users, Wrench, Pause } from 'lucide-react';
import { RAILWAY_MODULES, type RailwayControlType } from '../../railway/railwayModules';
import { createRailwayControllerState, executeRailwayCommand, type RailwayCommand } from '../../railway/railwayController';

const controlLabels: Record<RailwayControlType, string> = {
  dashboard: 'Dashboard', map: 'Network Map', table: 'Data Table', timeline: 'Timeline', form: 'Control Form', inspector: 'Inspector', chart: 'Analytics', console: 'Command Console', workflow: 'Workflow', settings: 'Settings',
};

const icons: Record<string, React.ElementType> = {
  'control-center': TrainFront, 'timetable-service': Activity, 'network-infrastructure': Map, 'train-fleet': TrainFront,
  'stations-terminals': Command, 'signaling-systems': ShieldCheck, 'maintenance-assets': Wrench, 'crew-operations': Users,
  'safety-emergency': AlertTriangle, 'performance-intelligence': Activity, 'administration-security': ShieldCheck,
};

export const RailwayOperationsApp: React.FC = () => {
  const [state, setState] = useState(createRailwayControllerState);
  const [moduleId, setModuleId] = useState('control-center');
  const [pageId, setPageId] = useState('train-control');
  const [selectedTrain, setSelectedTrain] = useState('TRN-0401');

  const module = useMemo(() => RAILWAY_MODULES.find((item) => item.id === moduleId) ?? RAILWAY_MODULES[0], [moduleId]);
  const page = useMemo(() => module.subModules.find((item) => item.id === pageId) ?? module.subModules[0], [module, pageId]);

  const selectModule = (id: string) => {
    const next = RAILWAY_MODULES.find((item) => item.id === id) ?? RAILWAY_MODULES[0];
    setModuleId(next.id);
    setPageId(next.subModules[0].id);
  };

  const runCommand = (command: RailwayCommand) => {
    setState((current) => executeRailwayCommand(current, selectedTrain, command));
  };

  return (
    <div className="railway-platform">
      <header className="railway-platform__topbar">
        <div className="railway-platform__brand">
          <div className="railway-platform__brand-mark"><TrainFront size={22} /></div>
          <div><div className="railway-platform__eyebrow">RAILWAY OPERATIONS SOFTWARE</div><h1>Integrated Railway Control Center</h1></div>
        </div>
        <div className="railway-platform__top-actions">
          <span className="railway-chip railway-chip--ok"><Activity size={12} /> CONTROL LINK ONLINE</span>
          <span className="railway-chip"><ShieldCheck size={12} /> SAFETY SUPERVISED</span>
        </div>
      </header>

      <div className="railway-platform__body">
        <aside className="railway-platform__modules">
          <div className="railway-pane-title">MAIN MENUS</div>
          {RAILWAY_MODULES.map((item) => {
            const Icon = icons[item.id] ?? Command;
            return <button key={item.id} className={`railway-module-button ${moduleId === item.id ? 'is-active' : ''}`} onClick={() => selectModule(item.id)}><Icon size={16}/><span>{item.menuTitle}</span><ChevronRight size={13}/></button>;
          })}
          <div className="railway-module-footer"><div><span className="railway-status-dot"/> CORE SERVICES</div><div><span className="railway-status-dot railway-status-dot--amber"/> {state.alerts.filter((a) => !a.acknowledged).length} ACTIVE ALERTS</div></div>
        </aside>

        <aside className="railway-platform__submodules">
          <div className="railway-pane-title">{module.label}</div>
          <p className="railway-pane-description">{module.description}</p>
          {module.subModules.map((item) => <button key={item.id} className={`railway-submodule-button ${page.id === item.id ? 'is-active' : ''}`} onClick={() => setPageId(item.id)}><span>{item.label}</span><small>{item.pageId}</small></button>)}
        </aside>

        <main className="railway-platform__workspace">
          <div className="railway-workspace-header"><div><div className="railway-breadcrumb">{module.menuTitle} <ChevronRight size={12}/> {page.pageTitle}</div><h2>{page.pageTitle}</h2><p>{page.description}</p></div><div className="railway-control-type">{controlLabels[page.control]} · {page.pageId}</div></div>

          <div className="railway-commandbar">
            {page.actions.map((action) => <button key={action.id} onClick={() => ['dispatch','hold','stop','reroute','acknowledge'].includes(action.id) ? runCommand(action.id as RailwayCommand) : undefined}><Command size={14}/> {action.label}</button>)}
          </div>

          <div className="railway-metrics">
            <div><span>ACTIVE TRAINS</span><strong>{state.kpis.activeTrains}</strong><small>Network live</small></div>
            <div><span>ON-TIME</span><strong>{state.kpis.onTimePercent}%</strong><small>Target 95%</small></div>
            <div><span>RESTRICTED</span><strong>{state.kpis.restrictedSections}</strong><small>Track sections</small></div>
            <div><span>ALERTS</span><strong>{state.kpis.activeAlerts}</strong><small>Unacknowledged</small></div>
          </div>

          <div className="railway-data-panel">
            <div className="railway-panel-toolbar"><strong>RAILWAY OPERATIONAL DATA</strong><span>{state.lastCommand}</span></div>
            <div className="railway-table-wrap"><table><thead><tr><th>TRAIN ID</th><th>SERVICE</th><th>ROUTE</th><th>LOCATION</th><th>STATE</th><th>NEXT EVENT</th></tr></thead><tbody>{state.trains.map((train) => <tr key={train.id} className={selectedTrain === train.id ? 'is-selected' : ''} onClick={() => setSelectedTrain(train.id)}><td>{train.id}</td><td>{train.serviceName}</td><td>{train.origin} → {train.destination}</td><td>{train.currentLocation}</td><td><span className="railway-table-status">{train.state.toUpperCase()}</span></td><td>{train.nextEvent}{train.delayMinutes ? ` (+${train.delayMinutes}m)` : ''}</td></tr>)}</tbody></table></div>
            <div className="railway-timeline"><div className="railway-timeline-line"/>{state.trains.map((train) => <div className="railway-timeline-event" key={train.id}><span>{train.nextEvent}</span><strong>{train.id}</strong><small>{train.currentLocation}</small></div>)}</div>
          </div>
        </main>

        <aside className="railway-platform__inspector"><div className="railway-pane-title">INSPECTOR</div><div className="railway-inspector-card"><span>SELECTED TRAIN</span><strong>{selectedTrain}</strong><small>{state.trains.find((train) => train.id === selectedTrain)?.serviceName ?? 'Unknown service'}</small></div><div className="railway-inspector-section"><span>PAGE ID</span><strong>{page.pageId}</strong><small>{module.menuId}</small></div><div className="railway-inspector-section"><span>SAFETY</span><strong className="text-ok">SUPERVISED</strong><small>No direct safety-system certification implied</small></div><button className="railway-inspector-action" onClick={() => runCommand('acknowledge')}><CheckCircle2 size={14}/> ACKNOWLEDGE ALERTS</button></aside>
      </div>
      <footer className="railway-platform__statusbar"><div><span className="railway-status-dot"/> {state.lastCommand}</div><div>RAILWAY SOFTWARE · OPERATIONS MODE · SAFETY INTERLOCKS SUPERVISED</div></footer>
    </div>
  );
};

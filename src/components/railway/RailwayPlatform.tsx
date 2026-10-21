import React, { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  Clock3,
  Command,
  Database,
  Map,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Square,
  TrainFront,
  Wrench,
  X,
} from 'lucide-react';
import { RAILWAY_MODULES, RAILWAY_SUBMODULE_MAP, RailwayControlType } from '../../railway/railwayModules';
import { railwayApi } from '../../railway/railwayApi';

const iconMap: Record<string, React.ElementType> = {
  operations: TrainFront,
  network: Map,
  rolling-stock: Wrench,
  stations: Radio,
  maintenance: Settings2,
  signals: ShieldCheck,
  crew: Activity,
  safety: AlertTriangle,
  analytics: BarChart3,
  administration: Database,
};

const controlLabels: Record<RailwayControlType, string> = {
  dashboard: 'Dashboard',
  map: 'Network Map',
  table: 'Data Table',
  timeline: 'Timeline',
  form: 'Control Form',
  inspector: 'Inspector',
  chart: 'Analytics',
  console: 'Command Console',
  workflow: 'Workflow',
  settings: 'Settings',
};

const sampleRows = [
  ['R-401', 'Northstar', 'NTH → CEN', '08:42', 'ON TIME'],
  ['R-118', 'Lakeshore', 'LKS → CEN', '08:46', '2 MIN LATE'],
  ['R-772', 'Express', 'CEN → WST', '08:51', 'BOARDING'],
  ['R-221', 'Regional', 'CEN → STH', '09:03', 'READY'],
];

export const RailwayPlatform: React.FC = () => {
  const [moduleId, setModuleId] = useState('operations');
  const [subModuleId, setSubModuleId] = useState('live-dispatch');
  const [selectedTrain, setSelectedTrain] = useState('R-401');
  const [notice, setNotice] = useState('CONTROL LINK ONLINE');
  const [busy, setBusy] = useState(false);
  const [showInspector, setShowInspector] = useState(true);

  const module = useMemo(() => RAILWAY_MODULES.find((item) => item.id === moduleId) ?? RAILWAY_MODULES[0], [moduleId]);
  const subModule = useMemo(
    () => RAILWAY_SUBMODULE_MAP[subModuleId] ?? module.subModules[0],
    [subModuleId, module]
  );

  const selectModule = (id: string) => {
    const next = RAILWAY_MODULES.find((item) => item.id === id) ?? RAILWAY_MODULES[0];
    setModuleId(next.id);
    setSubModuleId(next.subModules[0]?.id ?? '');
    setNotice(`MODULE ONLINE: ${next.label.toUpperCase()}`);
  };

  const runCommand = async (action: string) => {
    setBusy(true);
    setNotice(`EXECUTING: ${action.toUpperCase()}`);
    try {
      if (moduleId === 'operations' && ['Dispatch', 'Hold', 'Reroute', 'Stop'].includes(action)) {
        const command = action.toLowerCase() as 'dispatch' | 'hold' | 'reroute' | 'stop';
        const response = await railwayApi.dispatch({ trainId: selectedTrain, command, reason: 'Operator console command' });
        setNotice(response.ok ? `COMMAND ACCEPTED: ${action.toUpperCase()}` : `COMMAND REJECTED: ${response.error ?? 'API ERROR'}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 350));
        setNotice(`ACTION COMPLETE: ${action.toUpperCase()}`);
      }
    } catch (error) {
      setNotice(`CONTROL ERROR: ${error instanceof Error ? error.message : 'UNKNOWN ERROR'}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="railway-platform">
      <header className="railway-platform__topbar">
        <div className="railway-platform__brand">
          <div className="railway-platform__brand-mark"><TrainFront size={22} /></div>
          <div>
            <div className="railway-platform__eyebrow">RAILWAY OPERATIONS PLATFORM</div>
            <h1>Integrated Control Center</h1>
          </div>
        </div>
        <div className="railway-platform__top-actions">
          <span className="railway-chip railway-chip--ok"><Activity size={12} /> NETWORK LIVE</span>
          <button className="railway-icon-button" onClick={() => setNotice('SYSTEM REFRESH REQUESTED')} title="Refresh"><RefreshCw size={15} /></button>
          <button className="railway-icon-button" onClick={() => setShowInspector((value) => !value)} title="Toggle inspector"><CircleGauge size={15} /></button>
        </div>
      </header>

      <div className="railway-platform__body">
        <aside className="railway-platform__modules">
          <div className="railway-pane-title">MODULES</div>
          {RAILWAY_MODULES.map((item) => {
            const Icon = iconMap[item.id] ?? Command;
            return (
              <button key={item.id} className={`railway-module-button ${moduleId === item.id ? 'is-active' : ''}`} onClick={() => selectModule(item.id)}>
                <Icon size={16} />
                <span>{item.label}</span>
                <ChevronRight size={13} />
              </button>
            );
          })}
          <div className="railway-module-footer">
            <div><span className="railway-status-dot" /> CORE SERVICES</div>
            <div><span className="railway-status-dot railway-status-dot--amber" /> 2 WARNINGS</div>
          </div>
        </aside>

        <aside className="railway-platform__submodules">
          <div className="railway-pane-title">{module.label}</div>
          <p className="railway-pane-description">{module.description}</p>
          {module.subModules.map((item) => (
            <button key={item.id} className={`railway-submodule-button ${subModuleId === item.id ? 'is-active' : ''}`} onClick={() => { setSubModuleId(item.id); setNotice(`VIEW: ${item.label.toUpperCase()}`); }}>
              <span>{item.label}</span>
              <small>{controlLabels[item.control]}</small>
            </button>
          ))}
        </aside>

        <main className="railway-platform__workspace">
          <div className="railway-workspace-header">
            <div>
              <div className="railway-breadcrumb">{module.label} <ChevronRight size={12} /> {subModule.label}</div>
              <h2>{subModule.label}</h2>
              <p>{subModule.description}</p>
            </div>
            <div className="railway-control-type">{controlLabels[subModule.control]}</div>
          </div>

          <div className="railway-commandbar">
            <button onClick={() => runCommand('Dispatch')} disabled={busy}><Play size={14} /> Dispatch</button>
            <button onClick={() => runCommand('Hold')} disabled={busy}><Pause size={14} /> Hold</button>
            <button onClick={() => runCommand('Reroute')} disabled={busy}><ArrowRight size={14} /> Reroute</button>
            <button onClick={() => runCommand('Stop')} disabled={busy}><Square size={13} /> Stop</button>
            <span className="railway-commandbar__spacer" />
            <button className="railway-commandbar__secondary" onClick={() => setNotice('WORKFLOW BUILDER OPENED')}><Command size={14} /> Workflow</button>
          </div>

          <div className="railway-metrics">
            <div><span>ACTIVE TRAINS</span><strong>42</strong><small>+3 vs hour</small></div>
            <div><span>ON-TIME</span><strong>94.8%</strong><small>Target 95%</small></div>
            <div><span>BLOCKS</span><strong>118</strong><small>6 restricted</small></div>
            <div><span>ALERTS</span><strong>02</strong><small>1 requires action</small></div>
          </div>

          {subModule.control === 'map' ? (
            <div className="railway-map-panel">
              <div className="railway-map-grid" />
              <div className="railway-map-line railway-map-line--a" />
              <div className="railway-map-line railway-map-line--b" />
              <div className="railway-map-node node-a">NTH</div>
              <div className="railway-map-node node-b">CEN</div>
              <div className="railway-map-node node-c">STH</div>
              <div className="railway-map-train train-a">R-401</div>
              <div className="railway-map-train train-b">R-772</div>
              <div className="railway-map-legend"><span /> Mainline <span /> Restricted <span /> Train</div>
            </div>
          ) : (
            <div className="railway-data-panel">
              <div className="railway-panel-toolbar">
                <div className="railway-toolbar-title"><Database size={15} /> LIVE CONTROL DATA</div>
                <div className="railway-toolbar-actions">
                  <button onClick={() => setNotice('FILTERS APPLIED')}>FILTER</button>
                  <button onClick={() => setNotice('EXPORT QUEUED')}>EXPORT</button>
                </div>
              </div>
              <div className="railway-table-wrap">
                <table>
                  <thead><tr><th>TRAIN</th><th>SERVICE</th><th>ROUTE</th><th>NEXT EVENT</th><th>STATUS</th></tr></thead>
                  <tbody>{sampleRows.map((row) => <tr key={row[0]} className={selectedTrain === row[0] ? 'is-selected' : ''} onClick={() => { setSelectedTrain(row[0]); setNotice(`SELECTED ${row[0]}`); }}>
                    {row.map((cell, index) => <td key={`${row[0]}-${index}`}>{index === 4 ? <span className="railway-table-status">{cell}</span> : cell}</td>)}
                  </tr>)}</tbody>
                </table>
              </div>
              <div className="railway-timeline">
                <div className="railway-timeline-line" />
                {[['08:42', 'R-401', 'CEN'], ['08:46', 'R-118', 'LKS'], ['08:51', 'R-772', 'WST'], ['09:03', 'R-221', 'STH']].map(([time, train, place]) => (
                  <div className="railway-timeline-event" key={train}><span>{time}</span><strong>{train}</strong><small>{place}</small></div>
                ))}
              </div>
            </div>
          )}
        </main>

        {showInspector && (
          <aside className="railway-platform__inspector">
            <div className="railway-pane-title">INSPECTOR</div>
            <div className="railway-inspector-card">
              <span>SELECTED OBJECT</span>
              <strong>{selectedTrain}</strong>
              <small>Northstar service</small>
            </div>
            <div className="railway-inspector-section"><span>LOCATION</span><strong>Block CEN-04</strong><small>Control Zone 1</small></div>
            <div className="railway-inspector-section"><span>SIGNAL</span><strong className="text-ok">CLEAR</strong><small>Automatic block mode</small></div>
            <div className="railway-inspector-section"><span>NEXT EVENT</span><strong>08:42:30</strong><small>Platform 4 arrival</small></div>
            <button className="railway-inspector-action" onClick={() => runCommand('Open Detail')}>OPEN DETAIL</button>
          </aside>
        )}
      </div>

      <footer className="railway-platform__statusbar">
        <div><span className="railway-status-dot" /> {notice}</div>
        <div><Clock3 size={12} /> SHIFT 07:00–15:00 <span className="divider" /> <CheckCircle2 size={12} /> SAFETY INTERLOCKS ARMED</div>
      </footer>
    </section>
  );
};

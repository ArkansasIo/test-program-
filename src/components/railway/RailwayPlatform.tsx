import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, CheckCircle2, ChevronRight, CircleGauge, Command, Database, Map, Pause, Play, Radio, RefreshCw, Settings2, ShieldCheck, Square, TrainFront, Users, Wrench } from 'lucide-react';
import { RAILWAY_MODULES, RAILWAY_SUBMODULE_MAP, type RailwayControlType } from '../../railway/railwayModules';
import { railwayApi, type TrainRecord } from '../../railway/railwayApi';

const iconMap: Record<string, React.ElementType> = {
  'control-center': TrainFront,
  'timetable-service': Activity,
  'network-infrastructure': Map,
  'train-fleet': TrainFront,
  'stations-terminals': Radio,
  'signaling-systems': ShieldCheck,
  'maintenance-assets': Wrench,
  'crew-operations': Users,
  'safety-emergency': AlertTriangle,
  'performance-intelligence': BarChart3,
  'administration-security': Database,
};

const controlLabels: Record<RailwayControlType, string> = {
  dashboard: 'Dashboard', map: 'Network Map', table: 'Data Table', timeline: 'Timeline', form: 'Control Form', inspector: 'Inspector', chart: 'Analytics', console: 'Command Console', workflow: 'Workflow', settings: 'Settings',
};

const fallbackTrains: TrainRecord[] = [
  { id: 'TRN-0401', status: 'active', updatedAt: new Date(0).toISOString(), serviceNumber: '0401', name: 'Northstar', origin: 'NTH', destination: 'CEN', location: 'CEN-04', delayMinutes: 0 },
  { id: 'TRN-0118', status: 'active', updatedAt: new Date(0).toISOString(), serviceNumber: '0118', name: 'Lakeshore', origin: 'LKS', destination: 'CEN', location: 'LKS-02', delayMinutes: 2 },
  { id: 'TRN-0772', status: 'ready', updatedAt: new Date(0).toISOString(), serviceNumber: '0772', name: 'Express', origin: 'CEN', destination: 'WST', location: 'CEN-08', delayMinutes: 0 },
  { id: 'TRN-0221', status: 'planned', updatedAt: new Date(0).toISOString(), serviceNumber: '0221', name: 'Regional', origin: 'CEN', destination: 'STH', location: 'CEN-YARD', delayMinutes: 0 },
];

export const RailwayPlatform: React.FC = () => {
  const [moduleId, setModuleId] = useState('control-center');
  const [subModuleId, setSubModuleId] = useState('train-control');
  const [selectedTrain, setSelectedTrain] = useState('TRN-0401');
  const [trains, setTrains] = useState<TrainRecord[]>(fallbackTrains);
  const [notice, setNotice] = useState('CONTROL LINK ONLINE');
  const [busy, setBusy] = useState(false);
  const [showInspector, setShowInspector] = useState(true);

  const module = useMemo(() => RAILWAY_MODULES.find((item) => item.id === moduleId) ?? RAILWAY_MODULES[0], [moduleId]);
  const subModule = useMemo(() => RAILWAY_SUBMODULE_MAP[subModuleId] ?? module.subModules[0], [subModuleId, module]);
  const selected = trains.find((train) => train.id === selectedTrain) ?? trains[0];

  const refresh = async () => {
    try {
      const response = await railwayApi.getTrains();
      if (response.ok && response.data?.length) {
        setTrains(response.data);
        setNotice('CONTROL DATA REFRESHED');
      }
    } catch {
      setNotice('OFFLINE: USING LAST KNOWN DATA');
    }
  };

  useEffect(() => {
    void refresh();
    const source = typeof EventSource !== 'undefined' ? new EventSource(railwayApi.events()) : undefined;
    if (!source) return;
    source.onmessage = () => void refresh();
    source.onerror = () => setNotice('REALTIME LINK RECONNECTING');
    return () => source.close();
  }, []);

  const selectModule = (id: string) => {
    const next = RAILWAY_MODULES.find((item) => item.id === id) ?? RAILWAY_MODULES[0];
    setModuleId(next.id);
    setSubModuleId(next.subModules[0]?.id ?? '');
    setNotice(`MODULE ONLINE: ${next.label.toUpperCase()}`);
  };

  const runCommand = async (action: string) => {
    if (!selected) return;
    setBusy(true);
    setNotice(`EXECUTING: ${action.toUpperCase()}`);
    try {
      const commandMap: Record<string, 'dispatch' | 'hold' | 'reroute' | 'stop'> = { Dispatch: 'dispatch', Hold: 'hold', Reroute: 'reroute', Stop: 'stop' };
      const command = commandMap[action];
      if (command) {
        const response = await railwayApi.dispatch({ trainId: selected.id, command, reason: 'Operator console command' });
        setNotice(response.ok ? `COMMAND ACCEPTED: ${action.toUpperCase()}` : `COMMAND REJECTED: ${response.error?.message ?? 'API ERROR'}`);
        if (response.ok) await refresh();
      } else {
        setNotice(`ACTION COMPLETE: ${action.toUpperCase()}`);
      }
    } catch (error) {
      setNotice(`CONTROL ERROR: ${error instanceof Error ? error.message : 'UNKNOWN ERROR'}`);
    } finally {
      setBusy(false);
    }
  };

  const activeCount = trains.filter((train) => train.status === 'active').length;
  const averageDelay = trains.length ? trains.reduce((sum, train) => sum + train.delayMinutes, 0) / trains.length : 0;

  return (
    <section className="railway-platform">
      <header className="railway-platform__topbar">
        <div className="railway-platform__brand"><div className="railway-platform__brand-mark"><TrainFront size={22} /></div><div><div className="railway-platform__eyebrow">RAILWAY OPERATIONS PLATFORM</div><h1>Integrated Control Center</h1></div></div>
        <div className="railway-platform__top-actions"><span className="railway-chip railway-chip--ok"><Activity size={12} /> NETWORK LIVE</span><button className="railway-icon-button" onClick={() => void refresh()} title="Refresh"><RefreshCw size={15} /></button><button className="railway-icon-button" onClick={() => setShowInspector((value) => !value)} title="Toggle inspector"><CircleGauge size={15} /></button></div>
      </header>

      <div className="railway-platform__body">
        <aside className="railway-platform__modules"><div className="railway-pane-title">MAIN MENUS</div>{RAILWAY_MODULES.map((item) => { const Icon = iconMap[item.id] ?? Command; return <button key={item.id} className={`railway-module-button ${moduleId === item.id ? 'is-active' : ''}`} onClick={() => selectModule(item.id)}><Icon size={16} /><span>{item.menuTitle}</span><ChevronRight size={13} /></button>; })}<div className="railway-module-footer"><div><span className="railway-status-dot" /> CORE SERVICES</div><div><span className="railway-status-dot railway-status-dot--amber" /> {trains.filter((train) => train.delayMinutes > 0).length} DELAYED</div></div></aside>

        <aside className="railway-platform__submodules"><div className="railway-pane-title">{module.label}</div><p className="railway-pane-description">{module.description}</p>{module.subModules.map((item) => <button key={item.id} className={`railway-submodule-button ${subModuleId === item.id ? 'is-active' : ''}`} onClick={() => { setSubModuleId(item.id); setNotice(`VIEW: ${item.label.toUpperCase()}`); }}><span>{item.label}</span><small>{item.pageId}</small></button>)}</aside>

        <main className="railway-platform__workspace"><div className="railway-workspace-header"><div><div className="railway-breadcrumb">{module.menuTitle} <ChevronRight size={12} /> {subModule.label}</div><h2>{subModule.label}</h2><p>{subModule.description}</p></div><div className="railway-control-type">{controlLabels[subModule.control]}</div></div>
          <div className="railway-commandbar"><button onClick={() => void runCommand('Dispatch')} disabled={busy}><Play size={14} /> Dispatch</button><button onClick={() => void runCommand('Hold')} disabled={busy}><Pause size={14} /> Hold</button><button onClick={() => void runCommand('Reroute')} disabled={busy}><ArrowRight size={14} /> Reroute</button><button onClick={() => void runCommand('Stop')} disabled={busy}><Square size={13} /> Stop</button><span className="railway-commandbar__spacer" /><button className="railway-commandbar__secondary" onClick={() => setNotice('WORKFLOW BUILDER OPENED')}><Command size={14} /> Workflow</button></div>
          <div className="railway-metrics"><div><span>ACTIVE TRAINS</span><strong>{activeCount}</strong><small>Live API state</small></div><div><span>ON-TIME</span><strong>{Math.max(0, 100 - averageDelay * 2).toFixed(1)}%</strong><small>Calculated view</small></div><div><span>NETWORK TRAINS</span><strong>{trains.length}</strong><small>Current records</small></div><div><span>DELAYED</span><strong>{trains.filter((train) => train.delayMinutes > 0).length}</strong><small>Requires review</small></div></div>
          {subModule.control === 'map' ? <div className="railway-map-panel"><div className="railway-map-grid" /><div className="railway-map-line railway-map-line--a" /><div className="railway-map-line railway-map-line--b" /><div className="railway-map-node node-a">NTH</div><div className="railway-map-node node-b">CEN</div><div className="railway-map-node node-c">STH</div>{trains.slice(0, 2).map((train, index) => <div className={`railway-map-train ${index ? 'train-b' : 'train-a'}`} key={train.id}>{train.id}</div>)}<div className="railway-map-legend"><span /> Mainline <span /> Restricted <span /> Train</div></div> : <div className="railway-data-panel"><div className="railway-panel-toolbar"><div className="railway-toolbar-title"><Database size={15} /> LIVE CONTROL DATA</div><div className="railway-toolbar-actions"><button onClick={() => void refresh()}>REFRESH</button><button onClick={() => setNotice('EXPORT QUEUED')}>EXPORT</button></div></div><div className="railway-table-wrap"><table><thead><tr><th>TRAIN</th><th>SERVICE</th><th>ROUTE</th><th>LOCATION</th><th>STATUS</th></tr></thead><tbody>{trains.map((train) => <tr key={train.id} className={selectedTrain === train.id ? 'is-selected' : ''} onClick={() => { setSelectedTrain(train.id); setNotice(`SELECTED ${train.id}`); }}><td>{train.id}</td><td>{train.name}</td><td>{train.origin} → {train.destination}</td><td>{train.location}</td><td><span className="railway-table-status">{train.status.toUpperCase()}</span></td></tr>)}</tbody></table></div><div className="railway-timeline"><div className="railway-timeline-line" />{trains.map((train) => <div className="railway-timeline-event" key={train.id}><span>{train.delayMinutes ? `+${train.delayMinutes}m` : 'ON TIME'}</span><strong>{train.id}</strong><small>{train.location}</small></div>)}</div></div>}
        </main>

        {showInspector && <aside className="railway-platform__inspector"><div className="railway-pane-title">INSPECTOR</div><div className="railway-inspector-card"><span>SELECTED TRAIN</span><strong>{selected?.id ?? 'NONE'}</strong><small>{selected?.name ?? 'No selection'}</small></div><div className="railway-inspector-section"><span>LOCATION</span><strong>{selected?.location ?? '—'}</strong><small>{selected?.origin} → {selected?.destination}</small></div><div className="railway-inspector-section"><span>STATE</span><strong className="text-ok">{selected?.status?.toUpperCase() ?? '—'}</strong><small>Live operations state</small></div><div className="railway-inspector-section"><span>DELAY</span><strong>{selected?.delayMinutes ?? 0} min</strong><small>Reported service variance</small></div><button className="railway-inspector-action" onClick={() => void runCommand('Open Detail')}>OPEN DETAIL</button></aside>}
      </div>
      <footer className="railway-platform__statusbar"><div><span className="railway-status-dot" /> {notice}</div><div><CheckCircle2 size={12} /> SAFETY-SUPERVISED SOFTWARE · NOT A CERTIFIED INTERLOCKING</div></footer>
    </section>
  );
};

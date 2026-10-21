import React, { useMemo, useState } from 'react';
import { RAILWAY_MODULES, RAILWAY_SUBMODULE_MAP } from '../../railway/railwayModules';
import { railwayApi } from '../../railway/railwayApi';

export interface RailwayModuleWorkspaceProps {
  initialModuleId?: string;
  initialSubModuleId?: string;
}

export function RailwayModuleWorkspace({ initialModuleId = 'operations', initialSubModuleId = 'live-dispatch' }: RailwayModuleWorkspaceProps) {
  const [moduleId, setModuleId] = useState(initialModuleId);
  const [subModuleId, setSubModuleId] = useState(initialSubModuleId);
  const [message, setMessage] = useState('SYSTEM READY');
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const module = RAILWAY_MODULES.find((item) => item.id === moduleId) ?? RAILWAY_MODULES[0];
  const current = RAILWAY_SUBMODULE_MAP[subModuleId]?.subModule ?? module.subModules[0];

  const selectSubModule = (id: string) => {
    setSubModuleId(id);
    setSelectedAction(null);
    setMessage(`OPENED ${id.toUpperCase()}`);
  };

  const runAction = async (action: string) => {
    setSelectedAction(action);
    setMessage(`${action.toUpperCase()} REQUESTED`);
    if (current.id === 'live-dispatch' && ['Dispatch', 'Hold', 'Reroute'].includes(action)) {
      setLoading(true);
      try {
        await railwayApi.dispatch({ trainId: 'selected', command: action.toLowerCase() as 'dispatch' | 'hold' | 'reroute' });
        setMessage(`${action.toUpperCase()} COMMAND ACCEPTED`);
      } catch {
        setMessage(`${action.toUpperCase()} COMMAND QUEUED OFFLINE`);
      } finally {
        setLoading(false);
      }
    }
  };

  const moduleStats = useMemo(() => ({ modules: RAILWAY_MODULES.length, subModules: RAILWAY_MODULES.reduce((n, m) => n + m.subModules.length, 0), controls: RAILWAY_MODULES.reduce((n, m) => n + m.subModules.reduce((a, s) => a + s.actions.length, 0), 0) }), []);

  return (
    <section className="railway-workspace" aria-label="Railway operations module workspace">
      <header className="railway-workspace__header">
        <div>
          <span className="railway-eyebrow">RAILWAY OPERATIONS PLATFORM</span>
          <h1>{module.label}</h1>
          <p>{module.description}</p>
        </div>
        <div className="railway-workspace__metrics">
          <span><b>{moduleStats.modules}</b> MODULES</span>
          <span><b>{moduleStats.subModules}</b> SUBMODULES</span>
          <span><b>{moduleStats.controls}</b> CONTROLS</span>
        </div>
      </header>

      <div className="railway-workspace__body">
        <nav className="railway-module-rail" aria-label="Railway modules">
          {RAILWAY_MODULES.map((item) => (
            <button key={item.id} type="button" data-active={item.id === moduleId} onClick={() => { setModuleId(item.id); selectSubModule(item.subModules[0].id); }}>
              <span className="railway-module-rail__icon">{item.icon.slice(0, 2).toUpperCase()}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <aside className="railway-submodule-pane" aria-label={`${module.label} submodules`}>
          <div className="railway-pane-title">{module.label}</div>
          {module.subModules.map((item) => (
            <button key={item.id} type="button" data-active={item.id === current.id} onClick={() => selectSubModule(item.id)}>
              <span>{item.label}</span><small>{item.control}</small>
            </button>
          ))}
        </aside>

        <main className="railway-command-pane">
          <div className="railway-command-pane__toolbar">
            <div><span className="railway-status-dot" /> ONLINE / {current.control.toUpperCase()}</div>
            <div>{message}</div>
          </div>
          <div className="railway-command-pane__content">
            <span className="railway-eyebrow">SUBMODULE</span>
            <h2>{current.label}</h2>
            <p>{current.description}</p>

            <div className="railway-control-grid">
              {current.actions.map((action) => (
                <button key={action} type="button" className="railway-command-button" data-selected={selectedAction === action} disabled={loading} onClick={() => runAction(action)}>
                  <strong>{action}</strong>
                  <small>{action.toUpperCase()} COMMAND</small>
                </button>
              ))}
            </div>

            <div className="railway-system-panel">
              <div><span>CONTROL TYPE</span><b>{current.control}</b></div>
              <div><span>MODULE</span><b>{module.id}</b></div>
              <div><span>SUBMODULE</span><b>{current.id}</b></div>
              <div><span>API STATUS</span><b>{loading ? 'PROCESSING' : 'READY'}</b></div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

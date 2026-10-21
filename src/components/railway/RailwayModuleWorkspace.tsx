import React, { useMemo, useState } from 'react';
import { RAILWAY_MODULES, RAILWAY_SUBMODULE_MAP } from '../../railway/railwayModules';
import { railwayApi } from '../../railway/railwayApi';

export interface RailwayModuleWorkspaceProps {
  initialModuleId?: string;
  initialSubModuleId?: string;
}

export function RailwayModuleWorkspace({ initialModuleId = 'control-center', initialSubModuleId = 'train-control' }: RailwayModuleWorkspaceProps) {
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
    const selected = RAILWAY_SUBMODULE_MAP[id]?.subModule;
    setMessage(selected ? `OPENED ${selected.pageId.toUpperCase()}` : `OPENED ${id.toUpperCase()}`);
  };

  const runAction = async (selected: { id: string; label: string }) => {
    setSelectedAction(selected.id);
    setMessage(`${selected.label.toUpperCase()} REQUESTED`);
    if (current.id === 'train-control' && ['dispatch', 'hold'].includes(selected.id)) {
      setLoading(true);
      try {
        await railwayApi.dispatch({ trainId: 'selected', command: selected.id as 'dispatch' | 'hold' });
        setMessage(`${selected.label.toUpperCase()} COMMAND ACCEPTED`);
      } catch {
        setMessage(`${selected.label.toUpperCase()} COMMAND QUEUED OFFLINE`);
      } finally {
        setLoading(false);
      }
    }
  };

  const moduleStats = useMemo(() => ({
    modules: RAILWAY_MODULES.length,
    pages: RAILWAY_MODULES.reduce((n, m) => n + m.subModules.length, 0),
    controls: RAILWAY_MODULES.reduce((n, m) => n + m.subModules.reduce((a, s) => a + s.actions.length, 0), 0),
  }), []);

  return (
    <section className="railway-workspace" aria-label="Railway operations software workspace">
      <header className="railway-workspace__header">
        <div>
          <span className="railway-eyebrow">RAILWAY OPERATIONS SOFTWARE</span>
          <h1>{module.menuTitle}</h1>
          <p>{module.description}</p>
        </div>
        <div className="railway-workspace__metrics">
          <span><b>{moduleStats.modules}</b> MENUS</span>
          <span><b>{moduleStats.pages}</b> PAGES</span>
          <span><b>{moduleStats.controls}</b> CONTROLS</span>
        </div>
      </header>

      <div className="railway-workspace__body">
        <nav className="railway-module-rail" aria-label="Railway main menus">
          {RAILWAY_MODULES.map((item) => (
            <button key={item.id} type="button" data-active={item.id === moduleId} onClick={() => { setModuleId(item.id); selectSubModule(item.subModules[0].id); }}>
              <span className="railway-module-rail__icon">{item.icon.slice(0, 2).toUpperCase()}</span>
              <span>{item.menuTitle}</span>
            </button>
          ))}
        </nav>

        <aside className="railway-submodule-pane" aria-label={`${module.menuTitle} pages`}>
          <div className="railway-pane-title">{module.menuTitle}</div>
          {module.subModules.map((item) => (
            <button key={item.id} type="button" data-active={item.id === current.id} onClick={() => selectSubModule(item.id)}>
              <span><b>{item.label}</b><small>{item.pageId}</small></span>
              <small>{item.control}</small>
            </button>
          ))}
        </aside>

        <main className="railway-command-pane">
          <div className="railway-command-pane__toolbar">
            <div><span className="railway-status-dot" /> ONLINE / {current.control.toUpperCase()}</div>
            <div>{message}</div>
          </div>
          <div className="railway-command-pane__content">
            <span className="railway-eyebrow">PAGE ID: {current.pageId}</span>
            <h2>{current.pageTitle}</h2>
            <p>{current.description}</p>

            <div className="railway-control-grid">
              {current.actions.map((item) => (
                <button key={item.id} type="button" className="railway-command-button" data-selected={selectedAction === item.id} disabled={loading} onClick={() => runAction(item)} title={item.description}>
                  <strong>{item.label}</strong>
                  <small>{item.id.toUpperCase()} COMMAND</small>
                </button>
              ))}
            </div>

            <div className="railway-system-panel">
              <div><span>MENU ID</span><b>{module.menuId}</b></div>
              <div><span>MODULE ID</span><b>{module.id}</b></div>
              <div><span>PAGE ID</span><b>{current.pageId}</b></div>
              <div><span>API STATUS</span><b>{loading ? 'PROCESSING' : 'READY'}</b></div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
}

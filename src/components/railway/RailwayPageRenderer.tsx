import React from 'react';
import { Activity, BarChart3, ClipboardList, Gauge, Map, Settings2, Table2, Wrench } from 'lucide-react';
import { RailwaySubModule } from '../../railway/railwayModules';
import { RailwayKpis, RailwayTrain } from '../../railway/railwayModels';

interface RailwayPageRendererProps {
  page: RailwaySubModule;
  trains: RailwayTrain[];
  kpis: RailwayKpis;
  onSelectTrain: (train: RailwayTrain) => void;
}

const controlIcon: Record<RailwaySubModule['control'], React.ReactNode> = {
  dashboard: <Gauge size={18} />,
  map: <Map size={18} />,
  table: <Table2 size={18} />,
  timeline: <Activity size={18} />,
  form: <ClipboardList size={18} />,
  inspector: <Wrench size={18} />,
  chart: <BarChart3 size={18} />,
  console: <Settings2 size={18} />,
  workflow: <ClipboardList size={18} />,
  settings: <Settings2 size={18} />,
};

export const RailwayPageRenderer: React.FC<RailwayPageRendererProps> = ({
  page,
  trains,
  kpis,
  onSelectTrain,
}) => (
  <section className="railway-page-renderer" aria-label={page.pageTitle}>
    <header className="railway-page-header">
      <div>
        <div className="railway-eyebrow">{page.control.toUpperCase()} · {page.pageId}</div>
        <h2>{page.pageTitle}</h2>
        <p>{page.description}</p>
      </div>
      <div className="railway-page-type">{controlIcon[page.control]} {page.control}</div>
    </header>

    {page.control === 'dashboard' && (
      <div className="railway-dashboard-grid">
        <Metric label="Active Trains" value={kpis.activeTrains} />
        <Metric label="On Time" value={`${kpis.onTimePercent.toFixed(1)}%`} />
        <Metric label="Restricted Sections" value={kpis.restrictedSections} />
        <Metric label="Active Alerts" value={kpis.activeAlerts} />
      </div>
    )}

    {(page.control === 'table' || page.control === 'timeline' || page.control === 'map' || page.control === 'inspector') && (
      <div className="railway-data-panel">
        <div className="railway-panel-title">Operational Train Feed</div>
        <div className="railway-table-wrap">
          <table>
            <thead><tr><th>Train</th><th>Service</th><th>Location</th><th>State</th><th>Delay</th></tr></thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train.id} onClick={() => onSelectTrain(train)} tabIndex={0}>
                  <td>{train.id}</td><td>{train.serviceName}</td><td>{train.currentLocation}</td>
                  <td><span className={`railway-state railway-state-${train.state}`}>{train.state}</span></td>
                  <td>{train.delayMinutes > 0 ? `+${train.delayMinutes} min` : 'On time'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}

    {(page.control === 'chart' || page.control === 'workflow' || page.control === 'form' || page.control === 'console' || page.control === 'settings') && (
      <div className="railway-workspace-card">
        <div className="railway-panel-title">{page.pageTitle} Workspace</div>
        <p>This railway workflow is driven by the shared platform model and is ready for connection to the corresponding API domain.</p>
        <div className="railway-action-grid">
          {page.actions.map((action) => <button key={action.id} type="button" title={action.description}>{action.label}</button>)}
        </div>
      </div>
    )}
  </section>
);

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="railway-metric-card"><span>{label}</span><strong>{value}</strong></div>
);

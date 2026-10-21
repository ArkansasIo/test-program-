import React, { useMemo, useState } from 'react';
import { Activity, Bell, CalendarDays, ChevronDown, CircleGauge, Clock3, Cpu, Database, Gauge, Map, Radio, Route, Settings2, ShieldCheck, TrainFront, TriangleAlert, Users, Wrench, Zap } from 'lucide-react';

export type RailwayPage = 'dispatch' | 'network' | 'trains' | 'stations' | 'maintenance' | 'signals' | 'crew' | 'incidents' | 'analytics' | 'administration';

const pages: Array<{id: RailwayPage; label: string; icon: React.ElementType; subs: string[]}> = [
  {id:'dispatch',label:'Operations Control',icon:CircleGauge,subs:['Live Dispatch','Timetable','Movement Board','Headways']},
  {id:'network',label:'Network & Routes',icon:Route,subs:['Network Map','Corridors','Track Blocks','Possessions']},
  {id:'trains',label:'Rolling Stock',icon:TrainFront,subs:['Fleet Overview','Train Builder','Consists','Cab Signals']},
  {id:'stations',label:'Stations & Yards',icon:Map,subs:['Station Board','Platforms','Yard Control','Passenger Flow']},
  {id:'maintenance',label:'Maintenance',icon:Wrench,subs:['Work Orders','Track & Signals','Rolling Stock','Inspection Calendar']},
  {id:'signals',label:'Signals & Interlocking',icon:Radio,subs:['Signal Desk','Interlockings','Grade Crossings','Fail-Safe Events']},
  {id:'crew',label:'Crew & Resources',icon:Users,subs:['Crew Board','Assignments','Hours & Compliance','Training']},
  {id:'incidents',label:'Safety & Incidents',icon:ShieldCheck,subs:['Incident Desk','Alerts','Investigations','Emergency Plans']},
  {id:'analytics',label:'Analytics & Reports',icon:Activity,subs:['KPIs','On-Time Performance','Capacity','Reports']},
  {id:'administration',label:'System Administration',icon:Settings2,subs:['Users & Roles','Configuration','Audit Log','Integrations']},
];

const trains = [
  ['T-401','Northstar Express','Block C-17','08:42','124 km/h','ON TIME'],
  ['T-217','Metro Regional','Block B-04','08:45','86 km/h','ON TIME'],
  ['F-908','Freight North','Yard N-2','08:49','32 km/h','CAUTION'],
  ['T-552','Airport Connector','Block A-12','08:53','102 km/h','ON TIME'],
];

export function RailwayControlCenter(){
  const [page,setPage] = useState<RailwayPage>('dispatch');
  const [sub,setSub] = useState('Live Dispatch');
  const [tab,setTab] = useState('Overview');
  const [selectedTrain,setSelectedTrain] = useState('T-401');
  const [compact,setCompact] = useState(false);
  const active = pages.find(p=>p.id===page)!;
  const metrics = useMemo(()=>[
    ['ACTIVE TRAINS','42','good'],['NETWORK HEALTH','99.7%','good'],['ON-TIME','94.8%','good'],['HEADWAY','06:12','good'],['OPEN INCIDENTS','3','warn'],['POWER LOAD','71%','good']
  ],[]);

  return <div className={`railway-app ${compact?'compact':''}`}>
    <header className="railway-topbar">
      <TrainFront size={18} /> <span className="railway-brand">RAILWAY OPERATIONS PLATFORM</span>
      <span className="railway-status">CONTROL REGION 01 / LIVE</span>
      <span style={{marginLeft:'auto'}} className="railway-actions">
        <button className="railway-button"><Bell size={12}/> Alerts <span className="railway-pill amber">3</span></button>
        <button className="railway-button" onClick={()=>setCompact(v=>!v)}><ChevronDown size={12}/> Layout</button>
      </span>
    </header>

    <div className="railway-workspace">
      <nav className="railway-nav" aria-label="Railway pages">
        <div className="railway-section"><div className="railway-section-title">MAIN PROGRAM</div>
          {pages.map(p=>{const Icon=p.icon;return <React.Fragment key={p.id}>
            <button className={`railway-navitem ${page===p.id?'active':''}`} onClick={()=>{setPage(p.id);setSub(p.subs[0]);}}><span style={{display:'flex',gap:8,alignItems:'center'}}><Icon size={13}/>{p.label}</span><span>›</span></button>
            {page===p.id&&<div className="railway-subnav">{p.subs.map(s=><button key={s} className={`railway-navitem ${sub===s?'active':''}`} onClick={()=>setSub(s)}>{s}</button>)}</div>}
          </React.Fragment>})}
        </div>
      </nav>

      <main className="railway-main">
        <div className="railway-content">
          <div className="railway-pagehead">
            <div><div className="railway-eyebrow">{active.label.toUpperCase()} / {sub.toUpperCase()}</div><h1 className="railway-title">Railway Control Center</h1><div className="railway-subtitle">Integrated dispatch, infrastructure, rolling stock, safety, crew and maintenance workspace.</div></div>
            <div className="railway-actions"><button className="railway-button primary"><Zap size={12}/> Dispatch Command</button><button className="railway-button success"><ShieldCheck size={12}/> Safe State</button><button className="railway-button warning"><TriangleAlert size={12}/> Incident Mode</button></div>
          </div>

          <div className="railway-tabs">{['Overview','Live Map','Schedule','Capacity','Alerts','Reports'].map(t=><button key={t} className={`railway-tab ${tab===t?'active':''}`} onClick={()=>setTab(t)}>{t}</button>)}</div>

          <div className="railway-metrics">{metrics.map(([l,v,c])=><div className="railway-metric" key={l}><div className="railway-metric__label">{l}</div><div className={`railway-metric__value ${c}`}>{v}</div></div>)}</div>

          <section className="railway-grid">
            <div className="railway-pane" style={{gridColumn:'span 8'}}><Pane title="LIVE MOVEMENT BOARD" icon={<TrainFront size={13}/>} action="Open Board">
              <div className="railway-row head"><span>TRAIN</span><span>LOCATION</span><span>TIME</span><span>SPEED</span><span>STATUS</span></div>
              {trains.map(t=><button key={t[0]} className="railway-row" style={{width:'100%',background:'transparent',borderTop:0,borderLeft:0,borderRight:0,color:'inherit',textAlign:'left'}} onClick={()=>setSelectedTrain(t[0])}><span><b>{t[0]}</b> {t[1]}</span><span>{t[2]}</span><span>{t[3]}</span><span>{t[4]}</span><span className={`railway-pill ${t[5]==='ON TIME'?'green':'amber'}`}>{t[5]}</span></button>)}
            </Pane></div>
            <div className="railway-pane" style={{gridColumn:'span 4'}}><Pane title="NETWORK HEALTH" icon={<Gauge size={13}/>}><HealthBlock/></Pane></div>
            <div className="railway-pane third"><Pane title="DISPATCH COMMANDS" icon={<Cpu size={13}/>}><div className="railway-actions"><button className="railway-button primary">Route Train</button><button className="railway-button">Hold Signal</button><button className="railway-button">Set Headway</button><button className="railway-button">Issue Notice</button><button className="railway-button warning">Speed Restriction</button><button className="railway-button danger">Emergency Stop</button></div></Pane></div>
            <div className="railway-pane third"><Pane title="SELECTED TRAIN" icon={<TrainFront size={13}/>}><div className="railway-kv"><span>Train</span><b>{selectedTrain}</b><span>Service</span><b>North Corridor</b><span>Driver</span><b>J. Martin</b><span>Consist</span><b>8 cars / 512 seats</b><span>Next stop</span><b>Central Station</b></div><div style={{marginTop:10}} className="railway-track"><span style={{width:'68%'}}/></div></Pane></div>
            <div className="railway-pane third"><Pane title="ACTIVE WORK ORDERS" icon={<Wrench size={13}/>}><WorkOrders/></Pane></div>
            <div className="railway-pane full"><Pane title="OPERATIONS TIMELINE" icon={<Clock3 size={13}/>} action="Open Timetable"><Timeline/></Pane></div>
          </section>
        </div>
      </main>

      <aside className="railway-inspector">
        <div className="railway-section"><div className="railway-section-title">SYSTEM INSPECTOR</div><h3 style={{margin:'0 0 6px'}}>Control Context</h3><p>Use this pane for selected train, route, signal, station or work-order details. Every command is permission-gated and audit logged.</p></div>
        <div className="railway-section"><div className="railway-section-title">SELECTED OBJECT</div><div className="railway-kv"><span>Object</span><b>{selectedTrain}</b><span>State</span><b className="railway-pill green">RUNNING</b><span>Authority</span><b>DISPATCH</b><span>Signal</span><b>GREEN</b><span>Next checkpoint</span><b>09:04</b></div></div>
        <div className="railway-section"><div className="railway-section-title">SUB-PANELS</div>{['Details','Route Authority','Passenger Load','Telemetry','Maintenance','Audit Trail'].map(x=><button className="railway-navitem" key={x}>{x}<span>›</span></button>)}</div>
      </aside>
    </div>
    <footer className="railway-footer"><span>RAIL OPS CORE 1.0 · FAIL-SAFE CONTROL ENABLED</span><span><Database size={10}/> DATA SYNC 08:53:12 · <Radio size={10}/> SIGNAL BUS ONLINE</span></footer>
  </div>
}

function Pane({title,icon,children,action}:{title:string;icon:React.ReactNode;children:React.ReactNode;action?:string}){return <><div className="railway-pane__head"><span style={{display:'flex',alignItems:'center',gap:7}}>{icon}<span className="railway-pane__title">{title}</span></span>{action&&<button className="railway-button">{action}</button>}</div><div className="railway-pane__body">{children}</div></>}
function HealthBlock(){return <><div style={{display:'grid',gap:10}}>{[['Track circuits','99.9%'],['Signals','100%'],['Power','98.7%'],['Communications','99.8%']].map(([a,b])=><div key={a}><div style={{display:'flex',justifyContent:'space-between',fontSize:10}}><span>{a}</span><b>{b}</b></div><div className="railway-track"><span style={{width:b}}/></div></div>)}</div></>}
function WorkOrders(){return <div style={{display:'grid',gap:7}}>{[['WO-219','Signal relay inspection','HIGH'],['WO-221','Platform lighting','MED'],['WO-225','Brake telemetry','LOW']].map(([a,b,c])=><div key={a} style={{fontSize:10,display:'grid',gridTemplateColumns:'50px 1fr auto',gap:5}}><b>{a}</b><span>{b}</span><span className={`railway-pill ${c==='HIGH'?'red':c==='MED'?'amber':'green'}`}>{c}</span></div>)}</div>}
function Timeline(){return <div className="railway-row head"><span>TIME</span><span>SERVICE</span><span>LOCATION</span><span>EVENT</span><span>STATE</span></div>}

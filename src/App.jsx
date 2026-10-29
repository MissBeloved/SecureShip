import React, { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck, LayoutDashboard, FolderGit2, ScanLine, Container, Activity,
  Settings, Search, Bell, ChevronDown, ArrowUpRight, CircleCheck, CircleAlert,
  Clock3, Play, RefreshCw, ExternalLink, ShieldAlert, GitBranch, Server,
  FileCode2, KeyRound, Bug, Menu, X
} from 'lucide-react';

const initialProjects = [
  { id: 'PRJ-1042', name: 'customer-api', repo: 'acme/customer-api', branch: 'main', status: 'Protected', updated: '12 min ago', score: 94, scans: 18 },
  { id: 'PRJ-1038', name: 'billing-service', repo: 'acme/billing-service', branch: 'release', status: 'Review needed', updated: '38 min ago', score: 71, scans: 12 },
  { id: 'PRJ-1021', name: 'web-portal', repo: 'acme/web-portal', branch: 'main', status: 'Protected', updated: '2 hours ago', score: 98, scans: 26 }
];
const findings = [
  { severity: 'High', title: 'Outdated dependency detected', detail: 'billing-service · package-lock.json', type: 'Dependency', time: '38 min ago', status: 'Open' },
  { severity: 'Medium', title: 'Container running as root', detail: 'billing-service · Dockerfile', type: 'Container', time: '1 hour ago', status: 'Open' },
  { severity: 'Medium', title: 'Missing security header', detail: 'web-portal · HTTP response', type: 'Application', time: '2 hours ago', status: 'Resolved' },
  { severity: 'Low', title: 'Broad file permission', detail: 'customer-api · deployment.yaml', type: 'Configuration', time: 'Yesterday', status: 'Open' }
];
const nav = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Projects', icon: FolderGit2 },
  { label: 'Security scans', icon: ScanLine },
  { label: 'Containers', icon: Container },
  { label: 'Monitoring', icon: Activity }
];
function App() {
  const [active, setActive] = useState('Overview');
  const [projects, setProjects] = useState(initialProjects);
  const [scanRunning, setScanRunning] = useState(false);
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [apiStatus, setApiStatus] = useState('Checking API');
  useEffect(() => { fetch('/api/health').then(r => r.json()).then(d => setApiStatus(d.status === 'ok' ? 'API connected' : 'API unavailable')).catch(() => setApiStatus('Demo mode')); }, []);
  const visibleProjects = useMemo(() => projects.filter(p => `${p.name} ${p.repo} ${p.status}`.toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const runScan = async () => {
    setScanRunning(true); setNotice('');
    try {
      const res = await fetch('/api/scan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project: 'customer-api' }) });
      const data = await res.json();
      setNotice(data.message || 'Scan request completed.');
    } catch {
      setNotice('Could not reach the API. Start the app with npm run dev.');
    } finally { setScanRunning(false); }
  };
  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><ShieldCheck size={22} /></div><span>secure<span className="brand-accent">ship</span></span><button className="mobile-close" onClick={() => setMobileNav(false)}><X size={18} /></button></div>
      <div className="workspace-label">WORKSPACE</div>
      <button className="workspace">
        <div className="workspace-icon">A</div>
        <span><b>Acme Engineering</b><small>Free workspace</small></span><ChevronDown size={15} />
      </button>
      <div className="nav-label">PLATFORM</div>
      <nav>{nav.map(item => <button key={item.label} className={`nav-item ${active === item.label ? 'selected' : ''}`} onClick={() => { setActive(item.label); setMobileNav(false); }}><item.icon size={18} /><span>{item.label}</span>{item.label === 'Security scans' && <span className="nav-count">4</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="plan-card"><div className="plan-icon"><ShieldCheck size={18} /></div><b>Security posture</b><p>You're making progress. Keep your critical findings at zero.</p><div className="plan-progress"><span /></div><small>82% baseline complete</small></div><button className="nav-item"><Settings size={18} /><span>Settings</span></button><div className="profile"><div className="avatar">JD</div><div><b>Jamie Developer</b><small>Developer account</small></div><ChevronDown size={15} /></div></div>
    </aside>
    {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation" />}
    <main className="main">
      <header className="topbar"><button className="menu-button" onClick={() => setMobileNav(true)}><Menu size={20} /></button><div className="breadcrumbs">Workspace <span>/</span> <b>{active}</b></div><div className="top-actions"><div className="api-pill"><span className="green-dot" />{apiStatus}</div><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-avatar">JD</div></div></header>
      <div className="content">
        <section className="page-heading"><div><div className="eyebrow"><span className="green-dot" /> DEVSECOPS WORKSPACE</div><h1>{active === 'Overview' ? 'Security overview' : active}</h1><p>Ship confidently. Find risks early. Keep your software safer.</p></div><div className="heading-actions"><button className="btn btn-secondary" onClick={() => { setProjects(initialProjects); setNotice('Dashboard data refreshed. Sample records restored.') }}><RefreshCw size={16} /> Refresh</button><button className="btn btn-primary" onClick={runScan} disabled={scanRunning}>{scanRunning ? <RefreshCw className="spin" size={16} /> : <Play size={16} />} {scanRunning ? 'Starting scan…' : 'Run security check'}</button></div></section>
        {notice && <div className="notice"><CircleCheck size={17} /><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X size={16} /></button></div>}
        <section className="stats-grid">
          <Stat icon={ShieldCheck} label="Security score" value="82/100" change="+6 this week" color="mint" foot="Across 3 projects" />
          <Stat icon={Bug} label="Open findings" value="12" change="3 high priority" color="rose" foot="4 new this week" />
          <Stat icon={GitBranch} label="Pipelines passed" value="94.2%" change="+2.4%" color="blue" foot="Last 30 days" />
          <Stat icon={Container} label="Images scanned" value="28" change="100% scanned" color="violet" foot="Across environments" />
        </section>
        <section className="middle-grid">
          <div className="panel posture-panel"><div className="panel-heading"><div><h2>Security posture</h2><p>Policy checks across your workspace</p></div><button className="more-button">Last 7 days <ChevronDown size={14} /></button></div><div className="posture-content"><div className="score-ring"><div><strong>82</strong><span>/ 100</span></div></div><div className="posture-copy"><div className="status-line"><span className="legend-dot good" /><div><b>Passing checks</b><small>42 policies met</small></div><strong>84%</strong></div><div className="status-line"><span className="legend-dot warn" /><div><b>Needs attention</b><small>6 policies flagged</small></div><strong>12%</strong></div><div className="status-line"><span className="legend-dot bad" /><div><b>Critical gaps</b><small>2 policies failed</small></div><strong>4%</strong></div></div></div><div className="panel-footer"><span><CircleCheck size={15} /> Baseline checks enabled</span><button onClick={() => setActive('Security scans')}>View all checks <ArrowUpRight size={14} /></button></div></div>
          <div className="panel pipeline-panel"><div className="panel-heading"><div><h2>Latest pipeline</h2><p>customer-api · #build-184</p></div><span className="status-badge success"><CircleCheck size={13} /> Passed</span></div><div className="pipeline-meta"><span><GitBranch size={14} /> main</span><span><Clock3 size={14} /> 2m 18s</span><span>Today, 10:42 AM</span></div><div className="pipeline-steps"><PipelineStep name="Source checkout" state="Passed" time="4s" /><PipelineStep name="Unit tests" state="Passed" time="32s" /><PipelineStep name="Security scans" state="Passed" time="1m 04s" /><PipelineStep name="Build container" state="Passed" time="38s" /></div><button className="text-link" onClick={() => setNotice('Pipeline details are sample dashboard data. Connect a real GitHub Actions workflow to populate live results.')}>View pipeline details <ArrowUpRight size={14} /></button></div>
        </section>
        <section className="panel projects-panel"><div className="panel-heading project-heading"><div><h2>Your projects</h2><p>Monitor repositories connected to SecureShip</p></div><div className="table-actions"><div className="search-input"><Search size={15} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search projects…" /></div><button className="btn btn-secondary small-btn" onClick={() => setNotice('Project connection is a planned integration. Add GitHub OAuth/webhooks to connect live repositories.')}>+ Connect project</button></div></div><div className="table-wrap"><table><thead><tr><th>PROJECT</th><th>SECURITY SCORE</th><th>STATUS</th><th>LAST SCAN</th><th>SCANS</th><th /></tr></thead><tbody>{visibleProjects.map(p => <tr key={p.id}><td><div className="project-cell"><div className="repo-icon"><FileCode2 size={17} /></div><div><b>{p.name}</b><small>{p.repo} <span>· {p.branch}</span></small></div></div></td><td><div className="score-cell"><div className="mini-bar"><span style={{ width: `${p.score}%` }} /></div><b>{p.score}</b></div></td><td><span className={`status-badge ${p.status === 'Protected' ? 'success' : 'warning'}`}><span className="tiny-dot" />{p.status}</span></td><td className="muted-cell">{p.updated}</td><td className="muted-cell">{p.scans}</td><td><button className="row-more" onClick={() => setNotice(`${p.name}: sample project record. Configure repository integration for live scan data.`)}>···</button></td></tr>)}</tbody></table>{visibleProjects.length === 0 && <div className="empty-state">No projects match “{query}”.</div>}</div><div className="table-bottom"><span>Showing {visibleProjects.length} of {projects.length} projects</span><button onClick={() => setActive('Projects')}>View all projects <ArrowUpRight size={14} /></button></div></section>
        <section className="panel findings-panel"><div className="panel-heading"><div><h2>Recent security findings</h2><p>Issues worth reviewing across your projects</p></div><button className="text-link" onClick={() => setActive('Security scans')}>All findings <ArrowUpRight size={14} /></button></div><div className="findings-list">{findings.slice(0, 3).map((f, i) => <div className="finding-row" key={f.title}><div className={`finding-icon ${f.severity.toLowerCase()}`}>{f.severity === 'High' ? <ShieldAlert size={17} /> : f.type === 'Container' ? <Container size={17} /> : <KeyRound size={17} />}</div><div className="finding-main"><b>{f.title}</b><small>{f.detail}</small></div><span className={`severity ${f.severity.toLowerCase()}`}>{f.severity}</span><span className="finding-time">{f.time}</span><button className="row-more" onClick={() => setNotice(`${f.title}: sample finding. Run Trivy/Semgrep or another scanner to validate actual issues.`)}>···</button></div>)}</div><div className="panel-footer"><span><CircleAlert size={15} /> Sample findings shown for demonstration</span><button onClick={() => setNotice('Connect a scanner and persist its JSON output before treating findings as real.')}>How findings work <ExternalLink size={14} /></button></div></section>
        <footer><span>© 2026 SecureShip · Portfolio MVP</span><span><span className="green-dot" /> Built for safer delivery</span></footer>
      </div>
    </main>
  </div>;
}
function Stat({ icon: Icon, label, value, change, color, foot }) { return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={19} /></div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-change">{change}</div><div className="stat-foot">{foot}</div></div>; }
function PipelineStep({ name, state, time }) { return <div className="pipeline-step"><span className="step-check"><CircleCheck size={15} /></span><span className="step-name">{name}</span><span className="step-state">{state}</span><small>{time}</small></div>; }
export default App;
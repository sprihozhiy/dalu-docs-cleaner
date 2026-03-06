const navItems = [
  { label: "Dashboard", active: true },
  { label: "Documents", active: false },
  { label: "Context Sources", active: false },
  { label: "AI Models", active: false },
  { label: "Settings", active: false },
  { label: "Help", active: false },
];

export default function Home() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#1a1a1a" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">DALU CLI</h2>
        <nav>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={`sidebar-nav-link${item.active ? " active" : ""}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div style={{ flexGrow: 1, padding: "30px" }}>
        {/* Header */}
        <header className="page-header">
          <h1>Dashboard Overview</h1>
          <div className="search-bar-wrapper">
            <span className="search-bar-icon">🔎</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search documentation or commands..."
            />
          </div>
        </header>

        {/* Card grid */}
        <div className="card-grid">
          <section className="dashboard-card">
            <h3 className="card-title">AI Context Generation Status</h3>
            <p>
              Monitoring the real-time processing and generation of context for AI models
              across all integrated documentation sources.
            </p>
            <div className="card-status">
              <strong>Status:</strong>{" "}
              <span style={{ color: "#66FF66" }}>Online &amp; Active</span>
              <br />
              <strong>Last Update:</strong> 2026-03-05 10:30:00
            </div>
          </section>

          <section className="dashboard-card">
            <h3 className="card-title">Document Ingestion Queue</h3>
            <p>
              Overview of pending and processed documents awaiting contextualization for
              AI consumption.
            </p>
            <div className="card-status">
              <strong>Pending:</strong> 12 documents
              <br />
              <strong>Processed (last 24h):</strong> 485 documents
            </div>
          </section>

          <section className="dashboard-card">
            <h3 className="card-title">Model Performance Insights</h3>
            <p>
              Key metrics on how AI models are leveraging generated documentation context
              for enhanced responses.
            </p>
            <div className="card-status">
              <strong>Context Hit Rate:</strong> 92.5%
              <br />
              <strong>Avg. Response Time:</strong> 150ms
            </div>
          </section>
        </div>

        {/* Code viewer */}
        <section className="code-viewer">
          <h3 className="code-viewer-title">
            Latest System Logs{" "}
            <span className="code-viewer-subtitle">[tail -f /var/log/daludocs.log]</span>
          </h3>
          <pre className="code-pre">
            <code className="code-content">
              <span className="log-comment"># Dalu Docs Cleaner System Log - 2026-03-05</span>
              {"\n"}
              <span className="log-keyword">INFO</span>
              {"    "}[10:30:01]{" "}
              <span className="log-function">ContextEngine</span>: Initializing{" "}
              <span className="log-variable">AI_Context_Processor</span>...
              {"\n"}
              <span className="log-keyword">DEBUG</span>
              {"   "}[10:30:02]{" "}
              <span className="log-function">DocIngestor</span>: Processing document{" "}
              <span className="log-string">&quot;API_Reference_v2.md&quot;</span> (
              <span className="log-number">1/12</span>)
              {"\n"}
              <span className="log-keyword">INFO</span>
              {"    "}[10:30:05]{" "}
              <span className="log-function">ContextEngine</span>: Context generated for{" "}
              <span className="log-string">&quot;API_Reference_v2.md&quot;</span>.
              {"\n"}
              <span className="log-keyword">SUCCESS</span>
              {" "}[10:30:07]{" "}
              <span className="log-function">ModelAdapter</span>: Context provided to{" "}
              <span className="log-variable">GPT-4_Agent</span>. Score:{" "}
              <span className="log-number">0.98</span>
              {"\n"}
              <span className="log-keyword">INFO</span>
              {"    "}[10:30:10]{" "}
              <span className="log-function">DocIngestor</span>: Processing document{" "}
              <span className="log-string">&quot;User_Guide_CLI.pdf&quot;</span> (
              <span className="log-number">2/12</span>)
              {"\n"}
              <span className="log-keyword">WARN</span>
              {"    "}[10:30:12]{" "}
              <span className="log-function">ContextEngine</span>: Detected{" "}
              <span className="log-number">3</span> minor inconsistencies in{" "}
              <span className="log-string">&quot;User_Guide_CLI.pdf&quot;</span>. Automatic
              reconciliation initiated.
              {"\n"}
              <span className="log-keyword">DEBUG</span>
              {"   "}[10:30:15]{" "}
              <span className="log-function">CacheManager</span>: Cache hit for{" "}
              <span className="log-string">&quot;/docs/common/auth&quot;</span>.
              {"\n"}
              <span className="log-keyword">INFO</span>
              {"    "}[10:30:18]{" "}
              <span className="log-function">SystemMonitor</span>: CPU utilization:{" "}
              <span className="log-number">25%</span>, Memory:{" "}
              <span className="log-number">3.2GB</span>/
              <span className="log-number">8GB</span>.
              {"\n"}
              <span className="log-keyword">INFO</span>
              {"    "}[10:30:20]{" "}
              <span className="log-function">ContextEngine</span>: Context generated for{" "}
              <span className="log-string">&quot;User_Guide_CLI.pdf&quot;</span>.
              {"\n"}
              <span className="log-keyword">INFO</span>
              {"    "}[10:30:22]{" "}
              <span className="log-function">DocIngestor</span>: Document{" "}
              <span className="log-string">&quot;Release_Notes_v1.1.docx&quot;</span> added to
              queue.
            </code>
          </pre>
        </section>
      </div>
    </div>
  );
}

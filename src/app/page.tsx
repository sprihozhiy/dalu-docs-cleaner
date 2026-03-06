export default function Home() {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">DALU CLI</h2>
        <nav>
          <ul className="nav-list">
            <li><a href="#" className="nav-link active">Dashboard</a></li>
            <li><a href="#" className="nav-link">Documents</a></li>
            <li><a href="#" className="nav-link">Context Sources</a></li>
            <li><a href="#" className="nav-link">AI Models</a></li>
            <li><a href="#" className="nav-link">Settings</a></li>
            <li><a href="#" className="nav-link">Help</a></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content-area">
        {/* Header */}
        <header className="page-header">
          <h1 className="page-title">Dashboard Overview</h1>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search documentation or commands..."
              className="search-input"
            />
          </div>
        </header>

        {/* Card Grid */}
        <div className="card-grid">
          <section className="dashboard-card">
            <h3>AI Context Generation Status</h3>
            <p>Monitoring the real-time processing and generation of context for AI models across all integrated documentation sources.</p>
            <div className="card-status">
              <strong>Status:</strong>{" "}
              <span style={{ color: "#66ff66" }}>Online &amp; Active</span>
              <br />
              <strong>Last Update:</strong> 2026-03-05 10:30:00
            </div>
          </section>

          <section className="dashboard-card">
            <h3>Document Ingestion Queue</h3>
            <p>Overview of pending and processed documents awaiting contextualization for AI consumption.</p>
            <div className="card-status">
              <strong>Pending:</strong> 12 documents
              <br />
              <strong>Processed (last 24h):</strong> 485 documents
            </div>
          </section>

          <section className="dashboard-card">
            <h3>Model Performance Insights</h3>
            <p>Key metrics on how AI models are leveraging generated documentation context for enhanced responses.</p>
            <div className="card-status">
              <strong>Context Hit Rate:</strong> 92.5%
              <br />
              <strong>Avg. Response Time:</strong> 150ms
            </div>
          </section>
        </div>

        {/* Code Viewer */}
        <section className="code-viewer">
          <h3>
            Latest System Logs{" "}
            <span style={{ color: "#777777", fontStyle: "normal" }}>
              [tail -f /var/log/daludocs.log]
            </span>
          </h3>
          <pre>
            <code
              dangerouslySetInnerHTML={{
                __html: `
<span class="comment"># Dalu Docs Cleaner System Log - 2026-03-05</span>
<span class="keyword">INFO</span>    [10:30:01] <span class="function">ContextEngine</span>: Initializing <span class="variable">AI_Context_Processor</span>...
<span class="keyword">DEBUG</span>   [10:30:02] <span class="function">DocIngestor</span>: Processing document <span class="string">&quot;API_Reference_v2.md&quot;</span> (<span class="number">1/12</span>)
<span class="keyword">INFO</span>    [10:30:05] <span class="function">ContextEngine</span>: Context generated for <span class="string">&quot;API_Reference_v2.md&quot;</span>.
<span class="keyword">SUCCESS</span> [10:30:07] <span class="function">ModelAdapter</span>: Context provided to <span class="variable">GPT-4_Agent</span>. Score: <span class="number">0.98</span>
<span class="keyword">INFO</span>    [10:30:10] <span class="function">DocIngestor</span>: Processing document <span class="string">&quot;User_Guide_CLI.pdf&quot;</span> (<span class="number">2/12</span>)
<span class="keyword">WARN</span>    [10:30:12] <span class="function">ContextEngine</span>: Detected <span class="number">3</span> minor inconsistencies in <span class="string">&quot;User_Guide_CLI.pdf&quot;</span>. Automatic reconciliation initiated.
<span class="keyword">DEBUG</span>   [10:30:15] <span class="function">CacheManager</span>: Cache hit for <span class="string">&quot;/docs/common/auth&quot;</span>.
<span class="keyword">INFO</span>    [10:30:18] <span class="function">SystemMonitor</span>: CPU utilization: <span class="number">25%</span>, Memory: <span class="number">3.2GB</span>/<span class="number">8GB</span>.
<span class="keyword">INFO</span>    [10:30:20] <span class="function">ContextEngine</span>: Context generated for <span class="string">&quot;User_Guide_CLI.pdf&quot;</span>.
<span class="keyword">INFO</span>    [10:30:22] <span class="function">DocIngestor</span>: Document <span class="string">&quot;Release_Notes_v1.1.docx&quot;</span> added to queue.
`,
              }}
            />
          </pre>
        </section>
      </div>
    </div>
  );
}

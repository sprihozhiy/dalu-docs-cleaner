const navItems = [
  { label: "Dashboard", active: true },
  { label: "Documents", active: false },
  { label: "Context Sources", active: false },
  { label: "AI Models", active: false },
  { label: "Settings", active: false },
  { label: "Help", active: false },
];

const cards = [
  {
    title: "AI Context Generation Status",
    description:
      "Monitoring the real-time processing and generation of context for AI models across all integrated documentation sources.",
    status: (
      <>
        <strong className="text-[#00e5e5]">Status:</strong>{" "}
        <span style={{ color: "#66FF66" }}>Online &amp; Active</span>
        <br />
        <strong className="text-[#00e5e5]">Last Update:</strong> 2026-03-05 10:30:00
      </>
    ),
  },
  {
    title: "Document Ingestion Queue",
    description:
      "Overview of pending and processed documents awaiting contextualization for AI consumption.",
    status: (
      <>
        <strong className="text-[#00e5e5]">Pending:</strong> 12 documents
        <br />
        <strong className="text-[#00e5e5]">Processed (last 24h):</strong> 485 documents
      </>
    ),
  },
  {
    title: "Model Performance Insights",
    description:
      "Key metrics on how AI models are leveraging generated documentation context for enhanced responses.",
    status: (
      <>
        <strong className="text-[#00e5e5]">Context Hit Rate:</strong> 92.5%
        <br />
        <strong className="text-[#00e5e5]">Avg. Response Time:</strong> 150ms
      </>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      {/* Sidebar */}
      <aside
        className="w-[220px] shrink-0 bg-[#111111] border-r border-[#444444] p-5"
        style={{ boxShadow: "2px 0 5px rgba(0,0,0,0.2)" }}
      >
        <h2
          className="font-mono text-[#00e5e5] text-center mb-[30px] text-[1.3em] tracking-[1px]"
        >
          DALU CLI
        </h2>
        <nav>
          <ul className="list-none p-0 m-0">
            {navItems.map((item) => (
              <li key={item.label} className="mb-[10px]">
                <a
                  href="#"
                  className={[
                    "block font-mono text-[0.9em] px-[15px] py-[10px] rounded-[5px] no-underline transition-all duration-200",
                    item.active
                      ? "bg-[rgba(0,229,229,0.1)] text-[#00e5e5] shadow-[0_0_8px_rgba(0,229,229,0.3)]"
                      : "text-[#777777] hover:bg-[rgba(0,229,229,0.1)] hover:text-[#00e5e5] hover:shadow-[0_0_8px_rgba(0,229,229,0.3)]",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 p-[30px]">
        {/* Header */}
        <header className="flex justify-between items-center pb-5 mb-[30px] border-b border-[#444444]">
          <h1 className="font-mono text-[#00e5e5] text-[1.8em] tracking-[1px] m-0">
            Dashboard Overview
          </h1>
          <div className="relative w-[300px]">
            <span className="absolute left-[15px] top-1/2 -translate-y-1/2 text-[#777777] text-[1em] pointer-events-none">
              🔎
            </span>
            <input
              type="text"
              placeholder="Search documentation or commands..."
              className="w-full py-[10px] pr-[15px] pl-[40px] border border-[#444444] bg-[#252525] text-[#00e5e5] rounded-[5px] font-mono text-[0.9em] outline-none transition-all duration-200 placeholder:text-[#777777] focus:border-[#00e5e5] focus:shadow-[0_0_10px_rgba(0,229,229,0.5)]"
            />
          </div>
        </header>

        {/* Card grid */}
        <div
          className="grid gap-[25px] mb-[30px]"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
        >
          {cards.map((card) => (
            <section
              key={card.title}
              className="bg-[#111111] border border-[#444444] rounded-[8px] p-[25px] shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all duration-200 hover:-translate-y-[5px] hover:shadow-[0_8px_20px_rgba(0,229,229,0.2)]"
            >
              <h3 className="font-mono text-[#00e5e5] mt-0 mb-[15px] text-[1.2em] tracking-[0.5px] flex items-center before:content-['>_'] before:text-[#00e5e5] before:mr-2">
                {card.title}
              </h3>
              <p className="text-[0.9em] leading-[1.6] text-[#bbbbbb]">
                {card.description}
              </p>
              <div className="font-mono text-[0.85em] text-[#777777] mt-[15px] pt-[15px] border-t border-dashed border-[#444444]">
                {card.status}
              </div>
            </section>
          ))}
        </div>

        {/* Code viewer */}
        <section
          className="bg-[#0a0a0a] border border-[#444444] rounded-[8px] p-5 shadow-[0_4px_15px_rgba(0,0,0,0.3)]"
        >
          <h3 className="font-mono text-[#00e5e5] mt-0 mb-[15px] text-[1.2em] flex items-center before:content-['$_'] before:text-[#00e5e5] before:mr-2">
            Latest System Logs{" "}
            <span className="text-[#777777] not-italic ml-2 font-normal">
              [tail -f /var/log/daludocs.log]
            </span>
          </h3>
          <pre className="bg-[#050505] p-[15px] rounded-[5px] overflow-x-auto border border-[#222222] m-0">
            <code className="font-mono text-[#e0e0e0] leading-[1.5] text-[0.85em] block">
              <span className="code-comment"># Dalu Docs Cleaner System Log - 2026-03-05</span>{"\n"}
              <span className="code-keyword">INFO</span>{"    "}[10:30:01]{" "}
              <span className="code-function">ContextEngine</span>: Initializing{" "}
              <span className="code-variable">AI_Context_Processor</span>...{"\n"}
              <span className="code-keyword">DEBUG</span>{"   "}[10:30:02]{" "}
              <span className="code-function">DocIngestor</span>: Processing document{" "}
              <span className="code-string">&quot;API_Reference_v2.md&quot;</span> (
              <span className="code-number">1/12</span>){"\n"}
              <span className="code-keyword">INFO</span>{"    "}[10:30:05]{" "}
              <span className="code-function">ContextEngine</span>: Context generated for{" "}
              <span className="code-string">&quot;API_Reference_v2.md&quot;</span>.{"\n"}
              <span className="code-keyword">SUCCESS</span>{" "}[10:30:07]{" "}
              <span className="code-function">ModelAdapter</span>: Context provided to{" "}
              <span className="code-variable">GPT-4_Agent</span>. Score:{" "}
              <span className="code-number">0.98</span>{"\n"}
              <span className="code-keyword">INFO</span>{"    "}[10:30:10]{" "}
              <span className="code-function">DocIngestor</span>: Processing document{" "}
              <span className="code-string">&quot;User_Guide_CLI.pdf&quot;</span> (
              <span className="code-number">2/12</span>){"\n"}
              <span className="code-keyword">WARN</span>{"    "}[10:30:12]{" "}
              <span className="code-function">ContextEngine</span>: Detected{" "}
              <span className="code-number">3</span> minor inconsistencies in{" "}
              <span className="code-string">&quot;User_Guide_CLI.pdf&quot;</span>. Automatic
              reconciliation initiated.{"\n"}
              <span className="code-keyword">DEBUG</span>{"   "}[10:30:15]{" "}
              <span className="code-function">CacheManager</span>: Cache hit for{" "}
              <span className="code-string">&quot;/docs/common/auth&quot;</span>.{"\n"}
              <span className="code-keyword">INFO</span>{"    "}[10:30:18]{" "}
              <span className="code-function">SystemMonitor</span>: CPU utilization:{" "}
              <span className="code-number">25%</span>, Memory:{" "}
              <span className="code-number">3.2GB</span>/
              <span className="code-number">8GB</span>.{"\n"}
              <span className="code-keyword">INFO</span>{"    "}[10:30:20]{" "}
              <span className="code-function">ContextEngine</span>: Context generated for{" "}
              <span className="code-string">&quot;User_Guide_CLI.pdf&quot;</span>.{"\n"}
              <span className="code-keyword">INFO</span>{"    "}[10:30:22]{" "}
              <span className="code-function">DocIngestor</span>: Document{" "}
              <span className="code-string">&quot;Release_Notes_v1.1.docx&quot;</span> added to
              queue.
            </code>
          </pre>
        </section>
      </div>
    </div>
  );
}

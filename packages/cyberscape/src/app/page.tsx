import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { Terminal } from "@/components/terminal/Terminal";

type ParityStatus = "implemented" | "partial" | "context target" | "research target" | "defer" | "do not clone literally";

interface ParityItem {
  id: string;
  category: string;
  baselineCapability: string;
  cyberscapeTarget: string;
  status: ParityStatus;
  nextAction: string;
}

interface ParityInventory {
  items: ParityItem[];
}

const statusLabels: Array<{ status: ParityStatus; label: string }> = [
  { status: "implemented", label: "online" },
  { status: "partial", label: "wired, shallow" },
  { status: "context target", label: "next spec" },
  { status: "research target", label: "needs proof" },
  { status: "defer", label: "later daemon" },
];

function loadParityInventory(): ParityInventory {
  const candidates = [
    path.join(process.cwd(), "data/cyberscape-parity-inventory.json"),
    path.join(process.cwd(), "../../data/cyberscape-parity-inventory.json"),
  ];
  const inventoryPath = candidates.find((candidate) => existsSync(candidate));

  if (!inventoryPath) {
    return { items: [] };
  }

  return JSON.parse(readFileSync(inventoryPath, "utf8")) as ParityInventory;
}

export default function Home() {
  const inventory = loadParityInventory();
  const implementedCount = inventory.items.filter((item) => item.status === "implemented").length;
  const activeCount = inventory.items.filter((item) => item.status === "partial" || item.status === "context target").length;
  const categories = Array.from(new Set(inventory.items.map((item) => item.category)));
  const statusCounts = statusLabels.map(({ status, label }) => ({
    status,
    label,
    count: inventory.items.filter((item) => item.status === status).length,
  }));
  const nextSlices = inventory.items
    .filter((item) => item.status === "partial" || item.status === "context target" || item.status === "research target")
    .slice(0, 5);

  return (
    <main className="cyberscape-page">
      <div className="cyberscape-lab-shell">
        <aside className="cyberscape-lab-rail" aria-label="Cyberscape parity dossier">
          <div className="cyberscape-dossier-tab">XP connection desk</div>
          <div className="cyberscape-rail-header">
            <p className="cyberscape-kicker">Goal: pre-Wi-Fi network world</p>
            <h1>Cyberscape is a connection archaeology game, not a landing page.</h1>
            <p>
              The Windows XP shell is the front door. The actual target is a durable world of phone books,
              acoustic couplers, dial-up BBSes, UUCP routes, telnet sessions, files, progression, and hidden systems.
            </p>
          </div>

          <div className="cyberscape-scorecard" aria-label="Parity scorecard">
            <div>
              <span>{implementedCount}</span>
              <small>implemented</small>
            </div>
            <div>
              <span>{activeCount}</span>
              <small>active targets</small>
            </div>
            <div>
              <span>{categories.length}</span>
              <small>systems tracked</small>
            </div>
          </div>

          <section className="cyberscape-ledger" aria-labelledby="parity-ledger-title">
            <h2 id="parity-ledger-title">Parity ledger</h2>
            {statusCounts.map((entry) => (
              <div className="cyberscape-ledger-row" data-status={entry.status} key={entry.status}>
                <span>{entry.label}</span>
                <strong>{entry.count}</strong>
              </div>
            ))}
          </section>

          <section className="cyberscape-next-slices" aria-labelledby="next-slices-title">
            <h2 id="next-slices-title">Next systems to deepen</h2>
            {nextSlices.map((item) => (
              <article key={item.id}>
                <div>
                  <strong>{item.id}</strong>
                  <span>{item.status}</span>
                </div>
                <p>{item.nextAction}</p>
              </article>
            ))}
          </section>

          <div className="cyberscape-category-strip" aria-label="Tracked parity categories">
            {categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>

          <p className="cyberscape-stamp">No fake Wi-Fi. No emulator cosplay. Ship the connection loop first.</p>
        </aside>

        <section className="cyberscape-terminal-stage" aria-label="Cyberscape desktop shell">
          <Terminal />
        </section>

        <noscript>
          <div className="cyberscape-noscript">
            <p>JavaScript is unavailable on this browser.</p>
            <form action="/api/shell/plain" method="post" className="mt-3 flex gap-2">
              <input name="line" autoComplete="off" className="min-w-0 flex-1 border border-zinc-500 px-2 py-1" />
              <button type="submit" className="border border-zinc-700 px-3 py-1">Enter</button>
            </form>
          </div>
        </noscript>
      </div>
    </main>
  );
}

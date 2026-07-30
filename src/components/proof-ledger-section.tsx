import { config } from "@/lib/config";

export function ProofLedgerSection() {
  if (config.HOME_LEDGER_ROWS.length === 0) return null;

  return (
    <section
      className="border-b border-[rgba(102,217,255,0.14)]"
      id="proof-ledger"
    >
      <div className="command-desk-section max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="command-desk-section-heading mb-8">
          <p className="command-desk-kicker">{config.HOME_LEDGER_SUBTITLE}</p>
          <h2>{config.HOME_LEDGER_TITLE}</h2>
        </div>
        <div className="overflow-x-auto rounded-lg border border-[rgba(102,217,255,0.14)] bg-[var(--desk-panel)] backdrop-blur-[18px]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(102,217,255,0.14)] text-left">
                <th className="px-4 py-3 font-medium text-[var(--desk-cyan)] uppercase text-xs tracking-wide">
                  Thread
                </th>
                <th className="px-4 py-3 font-medium text-[var(--desk-cyan)] uppercase text-xs tracking-wide">
                  What exists
                </th>
                <th className="px-4 py-3 font-medium text-[var(--desk-cyan)] uppercase text-xs tracking-wide">
                  Why it matters
                </th>
                <th className="px-4 py-3 font-medium text-[var(--desk-cyan)] uppercase text-xs tracking-wide">
                  Route
                </th>
              </tr>
            </thead>
            <tbody>
              {config.HOME_LEDGER_ROWS.map((row) => (
                <tr
                  key={row.thread}
                  className="border-b border-[rgba(102,217,255,0.14)] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-[var(--desk-ink)] whitespace-nowrap align-top"
                  >
                    {row.thread}
                  </th>
                  <td className="px-4 py-3 text-[var(--desk-muted)] align-top">
                    {row.whatExists}
                  </td>
                  <td className="px-4 py-3 text-[var(--desk-muted)] align-top">
                    {row.whyItMatters}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <a
                      href={row.routeHref}
                      className="text-[var(--desk-green)] hover:text-[var(--desk-cyan)] transition-colors whitespace-nowrap"
                    >
                      {row.routeLabel}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

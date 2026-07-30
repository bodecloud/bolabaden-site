import { config } from "@/lib/config";

export function ProofLedgerSection() {
  if (config.HOME_LEDGER_ROWS.length === 0) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="proof-ledger">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
          {config.HOME_LEDGER_SUBTITLE}
        </p>
        <h2 className="text-2xl font-semibold text-white mb-8 max-w-2xl">
          {config.HOME_LEDGER_TITLE}
        </h2>
        <div className="overflow-x-auto rounded-lg border border-[#1f1f1f]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1f1f1f] text-left">
                <th className="px-4 py-3 font-medium text-zinc-500 uppercase text-xs tracking-wide">
                  Thread
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 uppercase text-xs tracking-wide">
                  What exists
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 uppercase text-xs tracking-wide">
                  Why it matters
                </th>
                <th className="px-4 py-3 font-medium text-zinc-500 uppercase text-xs tracking-wide">
                  Route
                </th>
              </tr>
            </thead>
            <tbody>
              {config.HOME_LEDGER_ROWS.map((row) => (
                <tr
                  key={row.thread}
                  className="border-b border-[#1f1f1f] last:border-b-0"
                >
                  <th
                    scope="row"
                    className="px-4 py-3 font-medium text-white whitespace-nowrap align-top"
                  >
                    {row.thread}
                  </th>
                  <td className="px-4 py-3 text-zinc-400 align-top">
                    {row.whatExists}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 align-top">
                    {row.whyItMatters}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <a
                      href={row.routeHref}
                      className="text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
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

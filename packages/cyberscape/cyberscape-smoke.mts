import { eq } from 'drizzle-orm';
import { executeLine } from './src/lib/shell/engine';
import { initialShellState } from './src/lib/shell/types';
import { db } from './src/lib/db';
import { shellSessions } from './src/lib/db/schema';

const state = initialShellState();
const username = `smoke-${Date.now()}`;
let res = await executeLine(state, `newuser ${username} password`);
console.log('newuser-ok', /Welcome/.test(res.output.join('\n')));

res = await executeLine(state, 'tunnel mirror');
console.log('indirect-reject', /direct path required/.test(res.output.join('\n')));

await executeLine(state, 'ssh relay');
res = await executeLine(state, 'tunnel apcihq');
console.log('tunnel-ok', /established/.test(res.output.join('\n')));

res = await executeLine(state, 'tunnel apcipdx');
console.log('re-route-blocked', /unavailable/.test(res.output.join('\n')));

res = await executeLine(state, 'camp');
console.log('camp-on', /Camp set/.test(res.output.join('\n')));

res = await executeLine(state, 'camp /off');
console.log('camp-off', /Camp cleared/.test(res.output.join('\n')));

res = await executeLine(state, 'tunnel /off');
console.log('tunnel-off', /collapsed/.test(res.output.join('\n')));

const row = db.select().from(shellSessions).where(eq(shellSessions.id, state.sessionId!)).get();
console.log('has-db-row', !!row);

await new Promise((r) => setTimeout(r, 10));

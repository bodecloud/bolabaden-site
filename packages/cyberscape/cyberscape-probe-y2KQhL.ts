import { initialShellState } from './src/lib/shell/types';
import { executeLine } from './src/lib/shell/engine';
(async () => {
  const state = initialShellState();
  const r = await executeLine(state, 'rot13 cyberscape');
  console.log(r.output.join(' | '));
})();

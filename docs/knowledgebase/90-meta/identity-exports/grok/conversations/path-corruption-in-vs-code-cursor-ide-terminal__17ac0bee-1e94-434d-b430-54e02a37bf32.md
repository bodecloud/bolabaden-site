---
source_url: "https://grok.com/c/17ac0bee-1e94-434d-b430-54e02a37bf32"
conversation_id: "17ac0bee-1e94-434d-b430-54e02a37bf32"
title: "PATH Corruption in VS Code/Cursor IDE Terminal"
extracted_at: "2026-06-29T16:07:30.452Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# PATH Corruption in VS Code/Cursor IDE Terminal

Source: [Grok conversation](https://grok.com/c/17ac0bee-1e94-434d-b430-54e02a37bf32)

## User

_Time: 2026-06-29T00:48:46.436Z_

```
/usr/libexec/grepconf.sh: line 5: grep: command not found
/usr/libexec/grepconf.sh: line 5: grep: command not found
/usr/libexec/grepconf.sh: line 5: grep: command not found
bash: tty: command not found
bash: id: command not found
bash: uname: command not found
bash: [: =: unary operator expected
bash: [: syntax error: `-eq' unexpected
bash: readlink: command not found...
Packages providing this file are:
'coreutils'
'coreutils-single'
bash: basename: command not found...
source /home/brunner56/Workspaces/rhythm-vibe-mcp/.venv/bin/activate
Packages providing this file are:
'coreutils'
'coreutils-single'
Install package 'which' to provide command 'which'? [N/y] 
```

how to fix this bizarre issue in vs code/cursor ide when trying to create a terminal inside the ide on linux? didn't use to happen. cannot reproduce inside of the factory default terminal fedora ships with.

## Assistant

_Time: 2026-06-29T00:49:13.255Z_

**This is a classic PATH environment variable corruption issue** in the VS Code/Cursor integrated terminal. Basic core utilities (`grep`, `tty`, `id`, `uname`, `readlink`, `basename`, etc.) live in `/usr/bin` (and symlinks in `/bin`), but they're not in `$PATH` when the terminal spawns inside the IDE. The external Fedora terminal works because it sources full login/profile scripts properly.<grok:render card_id="9acd2e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">20</argument></grok:render>

It started happening recently (common after config changes, updates, or env tweaks) and often ties to `.venv` activation, shell profiles, or global env files.

### Quick Diagnosis (do this in the broken IDE terminal if possible, or external terminal)
If you can run anything:

```bash
echo $PATH
which bash
env | grep -E 'PATH|ENV|SHELL'
```

If `echo` itself fails, the PATH is completely broken in that session.

### Most Common Fixes (in order)

**1. Check/fix /etc/environment (very frequent culprit on Fedora)**
This file should **not** contain a full `PATH=` line that overwrites everything. Bad example that breaks things:

```env
PATH="/some/custom/path"   # ← This is wrong if it doesn't preserve original
```

**Fix:**
- Open it safely from external terminal: `sudo nano /etc/environment`
- It should look something like this (or have no PATH at all):

```env
PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
```

- Or simply remove any `PATH=` line you added (e.g., for Java, Node, etc.).
- Log out/in or reboot after editing.<grok:render card_id="00fa25" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">13</argument></grok:render>

**2. VS Code / Cursor Settings – Force proper environment inheritance**
Open Command Palette (`Ctrl+Shift+P`) → **Preferences: Open Settings (JSON)** and add/update these:

```json
{
  "terminal.integrated.inheritEnv": true,
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.profiles.linux": {
    "bash": {
      "path": "/usr/bin/bash",
      "args": ["--login"]   // or "-l" for login shell
    }
  },
  // Optional: explicitly set a sane PATH if needed
  // "terminal.integrated.env.linux": {
  //   "PATH": "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:${env:PATH}"
  // }
}
```

Restart VS Code/Cursor and try a new terminal.<grok:render card_id="b5b3b9" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">22</argument></grok:render>

**3. Shell config files (common with Python venvs, conda, etc.)**
The output shows it tried to `source` a `.venv/bin/activate`. Venv activation scripts can mess up PATH if they assume a certain environment.

- Check `~/.bashrc`, `~/.bash_profile`, `~/.profile` for anything that sets `PATH=` **without** preserving the old value (should use `PATH=...:${PATH}` or `export PATH=...`).
- Look for lines like `export PATH=...` that were added for tools, SDKs, etc.
- Temporarily comment them out and test.

**4. Other quick checks**
- **Flatpak version?** If you installed VS Code/Cursor via Flatpak, it can have sandboxing issues with host PATH. Prefer the official `.rpm` from code.visualstudio.com or Cursor's site.<grok:render card_id="b382a3" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">48</argument></grok:render>
- Disable shell integration temporarily: Search settings for `terminal.integrated.shellIntegration.enabled` → set to `false`.
- Workspace-specific settings: Check `.vscode/settings.json` in your project for `terminal.integrated.*` overrides.
- Python venv: Try deactivating any auto-activation (`"python.terminal.activateEnvironment": false` in settings) and see if it helps.

**5. Nuclear option (reset terminal config)**
- Command Palette → **Terminal: Reset Terminal Settings** or just delete relevant lines from `settings.json` and restart.

### Why it happens in IDE but not system terminal
VS Code/Cursor launches the shell with a more controlled environment (often non-login or with specific env vars injected). If your global configs have a subtle bug (e.g., `PATH` set too early or absolutely), it manifests only there. System terminals usually source more files by default.<grok:render card_id="aa8100" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">27</argument></grok:render>

After applying the main fix (usually `/etc/environment` or settings.json), open a fresh terminal in Cursor. If it persists, share the output of `echo $PATH` (from external terminal) and contents of `/etc/environment` + relevant parts of `~/.bashrc` for more targeted help.

This should get you back to a working state quickly—it's a very common gotcha on Fedora with IDEs.

## User

_Time: 2026-06-29T00:55:38Z_

/usr/share/lmod/lmod/init/bash: line 23: id: command not found
/usr/share/lmod/lmod/init/bash: line 24: uname: command not found
/usr/share/lmod/lmod/init/bash: line 26: [: =: unary operator expected
/usr/share/lmod/lmod/init/bash: line 30: [: syntax error: `-eq' unexpected
+ [[ 1 -eq 0 ]]
+ case "$1" in
+ grep -qsi '^COLOR.*none' /etc/GREP_COLORS
/usr/libexec/grepconf.sh: line 16: grep: command not found
/usr/share/lmod/lmod/init/bash: line 23: id: command not found
/usr/share/lmod/lmod/init/bash: line 24: uname: command not found
/usr/share/lmod/lmod/init/bash: line 26: [: =: unary operator expected
/usr/share/lmod/lmod/init/bash: line 30: [: syntax error: `-eq' unexpected
+ [[ 1 -eq 0 ]]
+ case "$1" in
+ grep -qsi '^COLOR.*none' /etc/GREP_COLORS
/usr/libexec/grepconf.sh: line 16: grep: command not found
/usr/share/lmod/lmod/init/bash: line 23: id: command not found
/usr/share/lmod/lmod/init/bash: line 24: uname: command not found
/usr/share/lmod/lmod/init/bash: line 26: [: =: unary operator expected
/usr/share/lmod/lmod/init/bash: line 30: [: syntax error: `-eq' unexpected
+ [[ 1 -eq 0 ]]
+ case "$1" in
+ grep -qsi '^COLOR.*none' /etc/GREP_COLORS
/usr/libexec/grepconf.sh: line 16: grep: command not found
bash: tty: command not found
bash: id: command not found
bash: uname: command not found
bash: [: =: unary operator expected
bash: [: syntax error: `-eq' unexpected
bash: readlink: command not found...
Packages providing this file are:
'coreutils'
'coreutils-single'
source /home/brunner56/Workspaces/rhythm-vibe-mcp/.venv/bin/activate
bash: basename: command not found...
Packages providing this file are:
'coreutils'
'coreutils-single'
/usr/share/lmod/lmod/init/bash: line 23: id: command not found
/usr/share/lmod/lmod/init/bash: line 24: uname: command not found
/usr/share/lmod/lmod/init/bash: line 26: [: =: unary operator expected
/usr/share/lmod/lmod/init/bash: line 30: [: syntax error: `-eq' unexpected
+ [[ 1 -eq 0 ]]
+ case "$1" in
+ grep -qsi '^COLOR.*none' /etc/GREP_COLORS
/usr/libexec/grepconf.sh: line 16: grep: command not found
/usr/share/lmod/lmod/init/bash: line 23: id: command not found
/usr/share/lmod/lmod/init/bash: line 24: uname: command not found
/usr/share/lmod/lmod/init/bash: line 26: [: =: unary operator expected
/usr/share/lmod/lmod/init/bash: line 30: [: syntax error: `-eq' unexpected
+ [[ 1 -eq 0 ]]
+ case "$1" in
+ grep -qsi '^COLOR.*none' /etc/GREP_COLORS
/usr/libexec/grepconf.sh: line 16: grep: command not found
/usr/share/lmod/lmod/init/bash: line 23: id: command not found
/usr/share/lmod/lmod/init/bash: line 24: uname: command not found
/usr/share/lmod/lmod/init/bash: line 26: [: =: unary operator expected
/usr/share/lmod/lmod/init/bash: line 30: [: syntax error: `-eq' unexpected
+ [[ 1 -eq 0 ]]
+ case "$1" in
+ grep -qsi '^COLOR.*none' /etc/GREP_COLORS
/usr/libexec/grepconf.sh: line 16: grep: command not found
bash: tty: command not found...
Similar command is: 'tty'
bash: id: command not found...
Similar commands are::
'ed'
'od'
bash: uname: command not found...
Packages providing this file are:
'coreutils'
'coreutils-single'
bash: [: =: unary operator expected
bash: [: syntax error: `-eq' unexpected
bash: readlink: command not found...
Packages providing this file are:
'coreutils'
'coreutils-single'
bash: basename: command not found...
Packages providing this file are:
'coreutils'
'coreutils-single'
Install package 'which' to provide command 'which'? [N/y]
 
same issue with your changes? what's going on lol it's saying most of the /usr/bin and /bin stuff isn't available even though it's on $PATH?

## Assistant

_Time: 2026-06-29T00:55:48.871Z_



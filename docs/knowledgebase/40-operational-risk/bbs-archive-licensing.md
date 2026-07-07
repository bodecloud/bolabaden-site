---
module: cyberscape
tags: [cyberscape, licensing, archive, risk]
problem_type: reference
---

# BBS archive licensing

## Policy

**[SYNTH]** The clone needs era-appropriate text (BBS listings, ANSI, Usenet slices) but **must not** bulk-commit third-party works without clearance.

| `license_class` | Meaning | Git / public deploy |
|-----------------|---------|---------------------|
| `public` | Cleared or official reference | May commit and ship |
| `dev-only` | Research / attribution required | Local + CI only until vetted |
| `restricted` | Do not fetch automatically | Manual legal review |

No entry may be promoted to `public` without explicit clearance documented in manifest `notes`.

## Sources and caveats

### Textfiles.com

**[OPEN]** Jason Scott’s archive; Cyberscape cites it officially. Per-file redistribution terms vary. Default **dev-only** until each artifact is reviewed.

### Internet Archive

**[OPEN]** Use item-level metadata (license, collection). BBS zines and `.ANS` files often lack uniform license—**dev-only** by default.

### Henry Spencer Usenet

**[OPEN]** Historical academic redistribution; suitable for read-only `USENET` slices after segment selection. Still **dev-only** until curated subset is tagged.

### UUCP maps

**[OPEN]** Historical network maps for `uupath` / `uumap`; generally reference data—verify each mirror’s terms.

### Community gists (np43, JKirchartz)

**[OPEN]** np43 host list: acceptable as structural reference (`public` in manifest). JKirchartz BBS notes: mapping research only (**dev-only**); contains real BBS names/numbers—do not republish as a standalone directory.

## Pipeline

1. `data/archive-manifest.json` — canonical entry list
2. `scripts/archive-fetch.ts` — idempotent fetch + SHA256 for local paths and remote URLs
3. CI (future): fail if `license_class: public` entry lacks `sha256`

## Public release bundle

**[SYNTH]** Ship **generated host bundles** containing only `public` manifest assignments. Full archive remains a local/CI artifact under `data/archive-cache/`.

## Related

- `data/raw/README.md` — ingested research provenance
- `docs/knowledgebase/90-meta/cyberscape-sources-index.md` — URL index

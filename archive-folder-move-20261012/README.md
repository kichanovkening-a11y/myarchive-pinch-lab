# Folder move experiment — 2026-10-12

Test URL: https://archive.vip-teatre.ru:8443/archive-folder-move-test-20261012/

Open a folder, tap its `•••`, choose **Переместить папку**, choose a destination or the main page, then confirm. The same action is available in a folder tile's context menu. The picker shows all eligible folders across the archive in alphabetical pages of six, with prefix search, path labels and covers. Previous/next controls expose every page; changing search resets to the first page. Cancel is at the top of both chooser and confirmation; the chooser header remains visible while scrolling. Source, descendants and current parent are excluded.

The service writes only `folders.parent_id` in a **private metadata snapshot** at `/opt/myarchive/audits/folder-move-test-20261012/archive.db`. Original DB path and inode are explicitly forbidden for writes. Files, folder IDs, names and descendant relationships remain intact. SQLite `BEGIN IMMEDIATE` serializes tree validation and updates, preventing concurrent cycle creation. Destination ancestor walks also reject corrupt preexisting cycles. Counts are recomputed over the resulting subtree.

The original production HTML, viewer and pinch bodies are copied unchanged, with add-on tags. Existing text/date search is included and uses the same metadata snapshot. Media previews/viewing are GET requests to existing production APIs; no originals are saved. A fail-closed fetch guard is embedded in HEAD before the original app starts, allowing mutations only to this test's exact folder-move PUT endpoint. Other archive mutations and diagnostic beacons are blocked in this test page. The production access policy is reused through an existing authenticated GET; this experiment does not change that policy.

After moving the currently open folder, browser routes are rebuilt root → new ancestors → current folder, so Back follows the new location. Historical folder routes with stale ancestry are reconciled when restored. Viewer routes and gesture code are unchanged.

New process binds only `127.0.0.1:8768`. Nginx routes only `/archive-folder-move-test-20261012/api/` to it, allowing GET/PUT. The production web and bot services are not restarted. This is a temporary test process; boot-time startup is not configured. Earlier search and pinch test versions are unchanged.

Tests:

```sh
python3 -m unittest discover -s archive-folder-move-20261012 -v
node --test archive-folder-move-20261012/folder-move-state.test.cjs
python3 -m unittest discover -s archive-search-20261012
node --test archive-search-20261012/search-state.test.cjs
```

18 new Python checks cover subtree/file preservation, root moves, cycles, concurrent updates, invalid IDs, protection of production DB, counts, HTTP authorization, missing destination and rejected unrelated mutations. Eight new JS checks cover destination exclusion, prefix search, maximum six results, production mutation guards including missing helper, and canonical route ancestry. The existing 32 search checks also pass. Physical iPhone testing remains user validation; no pinch performance claim is made.

Rollback: stop only the test PID in `/opt/myarchive/web/archive-folder-move-test-20261012/server.pid`, remove its nginx location, nginx -t and reload nginx. The isolated copy can stay archived outside webroot; do not touch the production DB or old test directories.

Live browser checks: prefix filter reduced the picker to one destination; Шкатулки moved from Поделки to Гаспар, then Back opened Гаспар with Шкатулки and the unchanged 120-photo/25-video count. A second move to the main page placed Шкатулки there with the same count. The snapshot was then restored to its initial parents. All folder and file rows matched production after restoration; snapshot integrity was ok. Live cycle attempt returned 400. Production HTML/backend/bot/DB and accepted search files retained their hashes. No physical pinch PASS is claimed.

Deferred per user: discuss a photo editor later; leave mass upload unchanged until a separate failure/retry test; investigate the reported worse pinch before any production integration of these add-ons.

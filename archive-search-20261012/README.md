# Isolated archive text search — 2026-10-12

Test URL: https://archive.vip-teatre.ru:8443/archive-search-test-20261012/

Search covers folder names and saved photo/video captions (uploaded filenames are stored in captions by the existing upload flow). It does not analyze image contents or search dates. Matching uses case-insensitive Unicode substrings, treats ё/е alike, and requires every entered word. Folders come first, then media by date added, newest first. Results load in pages of 40. Uncaptioned media cannot be found by text.

The page is a copy of the current production HTML (SHA-256 `299486be571d94005269d92390c2d595824b6fd46c568382990f11523006720a`) with only a stylesheet and two script tags added. Search opens the existing viewer, with the currently loaded media results as its list; loading all search results is not automatic. Viewer and pinch implementation bodies are unchanged.

`search_server.py` runs independently on **127.0.0.1:8767** and only exposes GET `/archive-search-test-20261012/api/search`. Access checking delegates to the existing production `/api/folders` endpoint, preserving its existing access policy. SQLite is opened with `mode=ro` and `query_only=ON`. No media is saved, and search text is not logged. No schema changes or new indexes.

Deployment added one exact nginx location for this GET endpoint, then ran nginx -t and reloaded nginx. Production services were not restarted. Nginx already had a duplicate server-name warning from another enabled configuration; the new route was verified through HTTPS. Backup configuration: `/opt/myarchive/audits/archive-search-nginx-before-20261012.conf`.

This is a temporary test process, not a boot-persistent service. PID file on VPS: `/opt/myarchive/web/archive-search-test-20261012/server.pid`. Logs: `/opt/myarchive/audits/archive-search-20261012.log`.

Run tests:

```sh
python3 -m unittest discover -s archive-search-20261012 -v
node --test archive-search-20261012/search-state.test.cjs
node --check archive-search-20261012/search-ui.js
```

17 Python tests cover real SQLite search, Cyrillic, null captions, literal punctuation, pagination, readonly writes, HTTP authorization, forbidden mutations, invalid requests and unavailable DB. Four Node tests cover stale requests, clearing, pagination and errors.

Live checks: HTTPS root, folders API, test page and test search returned 200. Browser interaction verified mixed-case Cyrillic folder search, opening the result folder, returning home, no-results text, media filename search, opening a loaded photo in the existing viewer and returning to the same results. A separate automated Chromium smoke run on the Windows host timed out waiting for its first result; it is not counted as PASS. The interactions above were subsequently verified in the cloud browser. No physical iPhone PASS is claimed.

Rollback: stop only the process identified by the test PID file; remove the exact search location from nginx (or restore the backup only if no subsequent nginx changes occurred); nginx -t; reload nginx. The isolated static directory can remain archived. Do not restart the archive web service or bot.

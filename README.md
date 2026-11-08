# Malward Browser Protection

Free browser extension, which helps you browse more safely and comfortably. It blocks intrusive ads, trackers and unwanted network requests using efficient Manifest V3 filtering rules. It also provides shield, which checks visited website domains and warns you before opening websites identified as harmful or untrusted.

## Builds

| Directory | Browsers |
| --- | --- |
| `BPExtension-Chromium` | Chromium based browser, eg: Chrome, Edge, Opera |
| `BPExtension-Firefox` | Firefox |

Both are Manifest V3. The Chromium build runs a service worker, the Firefox build uses background scripts and carries `browser_specific_settings`.

## Licence

GNU General Public License, version 3 or later (GPL-3.0-or-later) — see [LICENSE](LICENSE).

This extension contains modified components of **uBlock Origin Lite**, Copyright (C) 2022–present Raymond Hill, used under the same licence. Upstream project: https://github.com/uBlockOrigin/uBOL-home

Static filtering rules are compiled from community-maintained and filter-provider lists. Copyright and terms of individual lists belong to their respective authors; see `MALWARD-NOTICES.md` inside each build directory.

# Malward Browser Protection

Free browser extension, which helps you browse more safely and comfortably. It blocks intrusive ads, trackers and unwanted network requests using efficient Manifest V3 filtering rules. It also provides shield, which checks visited website domains and warns you before opening websites identified as harmful or untrusted.

## Builds

| Directory | Browsers |
| --- | --- |
| `BPExtension-Chromium` | Chrome, Edge, Opera |
| `BPExtension-Firefox` | Firefox |

Both are Manifest V3. The Chromium build runs a service worker, the Firefox build uses background scripts and carries `browser_specific_settings`.

## Installation

| Browser | Download |
| :--- | :---: |
| <img src="https://github.com/user-attachments/assets/24fa6369-3b9b-43f3-8b5c-054b70b4f427" width="24" align="absmiddle" alt=""> &nbsp;**Microsoft Edge** | [<img src="https://github.com/user-attachments/assets/aa843c96-7fb7-4bd2-bd58-7ee92f7c8aa9" height="36" alt="Download from the Microsoft Store">](https://microsoftedge.microsoft.com/addons/detail/malward-browser-protectio/cclpcookdcbmnloggjiojoknioeellan) |
| <img src="https://github.com/user-attachments/assets/7f0a444f-e2db-4ecf-a8d0-4f5fed0c5488" width="24" align="absmiddle" alt=""> &nbsp;**Google Chrome** | manually |
| <img src="https://github.com/user-attachments/assets/29ff6b54-55c9-4956-9c4e-12033556425f" width="24" align="absmiddle" alt=""> &nbsp;**Opera** | manually |
| <img src="https://github.com/user-attachments/assets/24689a02-8e80-4a2d-860e-e220b1844939" width="24" align="absmiddle" alt=""> &nbsp;**Mozilla Firefox** | manually |

### Installing manually from the ZIP

First get the files: click the green **Code** button at the top of this page, choose **Download ZIP**, and unpack it. You will get a folder containing `BPExtension-Chromium` and `BPExtension-Firefox` — install the one that matches your browser.

**Chrome, Edge and Opera** — use `BPExtension-Chromium`.

1. Open the extensions page: `chrome://extensions` in Chrome, `edge://extensions` in Edge, `opera://extensions` in Opera.
2. Turn on **Developer mode** (top-right in Chrome and Opera, left sidebar in Edge).
3. Click **Load unpacked** and select the `BPExtension-Chromium` folder — the one that contains `manifest.json` directly, not the folder above it.

The extension stays installed after a restart. These browsers cannot install a `.zip` directly, which is why it has to be unpacked first.

**Firefox** — use `BPExtension-Firefox`.

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file inside the `BPExtension-Firefox` folder.

Firefox removes temporary add-ons when it is closed, so this has to be repeated after every restart. A permanent install requires the package to be signed by Mozilla.

## Licence

GNU General Public License, version 3 or later (GPL-3.0-or-later) — see [LICENSE](LICENSE).

This extension contains modified components of **uBlock Origin Lite**, Copyright (C) 2022–present Raymond Hill, used under the same licence. Upstream project: https://github.com/uBlockOrigin/uBOL-home

Static filtering rules are compiled from community-maintained and filter-provider lists. Copyright and terms of individual lists belong to their respective authors; see `MALWARD-NOTICES.md` inside each build directory.

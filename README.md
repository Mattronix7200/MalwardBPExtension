<p align="center"><img width="50%" align="absmiddle" alt="" src="https://github.com/user-attachments/assets/0aaa0b8a-34ea-4013-a8f0-4be03010bb6d" /></p>

#

Free browser extension, which helps you browse more safely and comfortably. It blocks intrusive ads, trackers and unwanted network requests using efficient ManifestV3 (MV3) filtering rules. It also provides shield, which checks visited website domains and warns you before opening websites identified as harmful or untrusted.

## Key features

- Effective ad and tracker blocking  
- Malicious website protection
- Manifest V3-compatible filtering engine  (based on uBlock Origin)
- Built-in community filter lists and support for custom filter lists  
- Element picker for blocking unwanted page elements yourself  
- Custom filtering rules and URL-shield exceptions  
- Clear statistics for blocked ads, harmful URLs and frequently blocked domains  
- Light, fast and designed for modern Chromium browsers  

&nbsp;

<img width="1233" height="752" alt="enb" src="https://github.com/user-attachments/assets/084d13d5-e5b2-4b0c-a880-6fd2bfac65e2" />

&nbsp;

<img width="1235" height="802" alt="image" src="https://github.com/user-attachments/assets/594cc2b0-7131-46d1-97e6-444084c05ef7" />

## Installation

Supported browsers: Google Chrome, Microsoft Edge, and Mozilla Firefox. Click the link below to download and install the extension. Opera support is also available, but the extension must currently be installed manually.

| Browser | Download |
| :--- | :---: |
| <img src="docs/img/edge.png" width="24" align="absmiddle" alt=""> &nbsp;**Microsoft Edge** | [<img src="docs/img/ms-store-badge.png" height="36" alt="Download from the Microsoft Store">](https://microsoftedge.microsoft.com/addons/detail/malward-browser-protectio/cclpcookdcbmnloggjiojoknioeellan) <br> <a href="https://microsoftedge.microsoft.com/addons/detail/malward-browser-protectio/cclpcookdcbmnloggjiojoknioeellan">Link</a> |
| <img src="docs/img/chrome.png" width="24" align="absmiddle" alt=""> &nbsp;**Google Chrome** | [<img height="32" alt="Available Chrome Web Store" src="https://github.com/user-attachments/assets/4842019b-8fc5-44af-bf29-083c6b777192" />](https://chromewebstore.google.com/detail/malward-browser-protectio/dodeikeahkigilklipjchjplfjjbihga) <br> <a href="https://chromewebstore.google.com/detail/malward-browser-protectio/dodeikeahkigilklipjchjplfjjbihga">Link</a> |
| <img src="docs/img/opera.png" width="24" align="absmiddle" alt=""> &nbsp;**Opera** | - |
| <img src="docs/img/firefox.png" width="24" align="absmiddle" alt=""> &nbsp;**Mozilla Firefox** | [<img height="36" alt="fwa" src="https://github.com/user-attachments/assets/fe71fe91-044d-4a2f-93e3-4dbab5150e75" />](https://addons.mozilla.org/pl/firefox/addon/malward-browser-protection/) <br> <a href="https://addons.mozilla.org/pl/firefox/addon/malward-browser-protection/">Link</a> |

### Installing manually (Opera Browser)

First get the files: click the green **Code** button at the top of this page, choose **Download ZIP**, and unpack it. You will get a folder containing `BPExtension-Chromium`.

1. Open the extensions page: `opera://extensions` in Opera.
2. Turn on **Developer mode** (top-right in Opera).
3. Click **Load unpacked** and select the `BPExtension-Chromium` folder — the one that contains `manifest.json` directly, not the folder above it.

## Privacy

Malward Browser Protection performs filtering locally in your browser. When website protection is enabled, only the visited domain name is sent to determine whether it is known to be harmful. The extension does not collect website text, images, passwords, form data or personal messages. No browser extension can guarantee complete protection from every online threat. Always use caution when opening links, downloading files or entering sensitive information online.

## Licence

GNU General Public License, version 3 or later (GPL-3.0-or-later) — see [LICENSE](LICENSE).

This extension contains modified components of **uBlock Origin Lite**, Copyright (C) 2022–present Raymond Hill, used under the same licence. Upstream project: https://github.com/uBlockOrigin/uBOL-home

Static filtering rules are compiled from community-maintained and filter-provider lists. Copyright and terms of individual lists belong to their respective authors; see `MALWARD-NOTICES.md` inside each build directory.

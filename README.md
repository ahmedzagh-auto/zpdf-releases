# zPDF

**A fast, lightweight PDF reader with SmartLinks.**

[![Download zPDF](https://img.shields.io/github/v/release/ahmedzagh-auto/zpdf-releases?include_prereleases&label=download&color=F0A63A)](https://github.com/ahmedzagh-auto/zpdf-releases/releases/latest)

**Website: [ahmedzagh-auto.github.io/zpdf-releases](https://ahmedzagh-auto.github.io/zpdf-releases/)**

[![zPDF](https://ahmedzagh-auto.github.io/zpdf-releases/og.png)](https://ahmedzagh-auto.github.io/zpdf-releases/)

zPDF opens big documents in a blink, scrolls without a stutter and stays light on your machine.
Its SmartLinks turn the figures, tables, sections and citations a document mentions into links
you can preview and follow.

This repository holds zPDF's downloads, release notes and bug reports. The source code is private.

## Download

Get the newest build from the [website](https://ahmedzagh-auto.github.io/zpdf-releases/) or the
[releases page](https://github.com/ahmedzagh-auto/zpdf-releases/releases). Each release has:

| File | What it is |
| --- | --- |
| `zpdf-<version>-windows-x64-setup.exe` | Installer. Installs for your user, no admin rights needed, updates itself. |
| `zpdf-<version>-windows-x64.zip` | Portable build. Unzip and run; shows a notice when an update is out. |
| `*.sha256` | SHA-256 checksum for each file. |

**Requirements:** Windows 10 or 11, 64-bit. More platforms are planned.

## What it does

- **Fast.** Documents open almost at once, and pages keep up as you scroll and zoom, even in files of hundreds of pages.
- **Light.** A small download that leaves room for everything else you have open.
- **SmartLinks.** Figures, tables, sections and citations mentioned in the text become links. Preview what a reference points to, jump there, and see everywhere it is mentioned.
- **Tabs.** Open several documents, or the same one at two places.
- **Find and copy.** Search the whole document and copy text in reading order.
- **Accessible.** Every control works from the keyboard, screen readers can read the page text, and there are dark and light themes.

zPDF is an alpha. It reads PDFs only: no annotations, forms or printing yet.

## Check your download

The alpha is not code-signed yet, so Windows SmartScreen may say it "protected your PC".
Choose **More info**, then **Run anyway**. Before you do, check that the file matches the one published.
In PowerShell, in your Downloads folder:

```powershell
Get-FileHash .\zpdf-<version>-windows-x64-setup.exe -Algorithm SHA256
```

Compare the result with the `.sha256` file on the release.

## Report a bug

[Open an issue](https://github.com/ahmedzagh-auto/zpdf-releases/issues/new) with the version number
and what you did. Attach the PDF only if you are allowed to share it.

## Licence

zPDF is proprietary software and free during the alpha. It is not open source.
Do not share or redistribute it in any form without the author's written permission.

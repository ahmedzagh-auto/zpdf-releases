// Release lookup for the download page (specs/007-download-site DES-1).
// Pure functions only, so tests can import them without a browser.

/** Portable zip of a Windows build (REQ-1.1, REQ-1.3). */
export const ZIP_ASSET = /^zpdf-.+-windows-x64\.zip$/;
/** Installer of a Windows build (REQ-1.5). */
export const SETUP_ASSET = /^zpdf-.+-windows-x64-setup\.(exe|msi)$/;

const HEX64 = /^[0-9a-f]{64}$/;

/**
 * Reads the hash from a `.sha256` file (`<hex>  <name>` as written by the release
 * pipeline, or a bare hex value). Returns the lower-case hex, or null.
 * @param {unknown} text
 * @returns {string | null}
 */
export function parseSha256(text) {
  if (typeof text !== "string") return null;
  const first = text.trim().split(/\s+/, 1)[0] ?? "";
  const hex = first.toLowerCase();
  return HEX64.test(hex) ? hex : null;
}

/**
 * Hash from an asset's `digest` field (`sha256:<hex>`), or null.
 * @param {unknown} asset
 * @returns {string | null}
 */
function digestOf(asset) {
  const d = asset && typeof asset === "object" ? asset.digest : null;
  if (typeof d !== "string" || !d.startsWith("sha256:")) return null;
  return parseSha256(d.slice("sha256:".length));
}

/** @param {unknown} a */
function isAsset(a) {
  return (
    a !== null &&
    typeof a === "object" &&
    typeof a.name === "string" &&
    typeof a.browser_download_url === "string" &&
    a.browser_download_url.startsWith("https://")
  );
}

/**
 * @typedef {{ name: string, url: string, size: number | null, sha256: string | null, sha256Url: string | null }} Download
 * @typedef {{ tag: string, version: string, published: string | null, notesUrl: string | null, main: Download, portable: Download | null }} Offer
 */

/**
 * Picks what the page offers from a GitHub "list releases" response: the newest
 * non-draft release that has a Windows zip (REQ-1.1, REQ-1.3). When that release also
 * has an installer, the installer is the main download and the zip is portable (REQ-1.5).
 * Anything malformed is skipped, never thrown.
 * @param {unknown} releases
 * @returns {Offer | null}
 */
export function pickRelease(releases) {
  if (!Array.isArray(releases)) return null;
  for (const r of releases) {
    if (r === null || typeof r !== "object" || r.draft === true) continue;
    if (typeof r.tag_name !== "string" || !Array.isArray(r.assets)) continue;
    const assets = r.assets.filter(isAsset);
    const zip = assets.find((a) => ZIP_ASSET.test(a.name));
    if (!zip) continue;
    const setup = assets.find((a) => SETUP_ASSET.test(a.name));
    /** @returns {Download} */
    const download = (a) => {
      const sidecar = assets.find((s) => s.name === `${a.name}.sha256`);
      return {
        name: a.name,
        url: a.browser_download_url,
        size: Number.isSafeInteger(a.size) && a.size >= 0 ? a.size : null,
        sha256: digestOf(a),
        sha256Url: sidecar ? sidecar.browser_download_url : null,
      };
    };
    return {
      tag: r.tag_name,
      version: r.tag_name.replace(/^v/, ""),
      published: typeof r.published_at === "string" ? r.published_at : null,
      notesUrl: typeof r.html_url === "string" && r.html_url.startsWith("https://") ? r.html_url : null,
      main: download(setup ?? zip),
      portable: setup ? download(zip) : null,
    };
  }
  return null;
}

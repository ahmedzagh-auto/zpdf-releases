// Fills the download card from the newest release (specs/007-download-site DES-1, T-3).
// The HTML already links the releases page, so if anything here fails the page still works
// (REQ-1.2, REQ-4.5).
import { pickRelease } from "./release.js";

/** Public repo that holds the Releases (DES-4, Q1). */
export const RELEASE_REPO = "ahmedzagh-auto/zpdf-releases";
const API = `https://api.github.com/repos/${RELEASE_REPO}/releases?per_page=10`;
const CACHE_KEY = "zpdf-releases-v1";
const CACHE_MS = 10 * 60 * 1000;

const $ = (id) => document.getElementById(id);

function readCache() {
  try {
    const hit = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null");
    if (hit && Date.now() - hit.at < CACHE_MS) return hit.data;
  } catch { /* storage blocked or corrupt: fetch instead */ }
  return null;
}

function writeCache(data) {
  try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
}

/** One request per load at most (NFR-3). */
async function loadReleases() {
  const cached = readCache();
  if (cached) return cached;
  const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const data = await res.json();
  writeCache(data);
  return data;
}

const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;
const day = (iso) => new Date(iso).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" });

function link(href, text) {
  const a = document.createElement("a");
  a.href = href;
  a.textContent = text;
  return a;
}

function render(offer) {
  const isSetup = /-setup\.(exe|msi)$/.test(offer.main.name);
  $("dl-main").href = offer.main.url;
  $("dl-label").textContent = isSetup ? "Download installer" : "Download zPDF";

  const meta = $("dl-meta");
  meta.replaceChildren();
  const facts = [["Version", offer.version]];
  if (offer.published) facts.push(["Released", day(offer.published)]);
  if (offer.main.size !== null) facts.push(["Size", mb(offer.main.size)]);
  facts.push(["For", "Windows x64"]);
  for (const [k, v] of facts) {
    const s = document.createElement("span");
    const b = document.createElement("b");
    b.textContent = v;
    s.append(`${k} `, b);
    meta.append(s);
  }

  const alt = $("dl-alt");
  alt.replaceChildren();
  if (offer.portable) {
    const size = offer.portable.size !== null ? ` (${mb(offer.portable.size)})` : "";
    alt.append("Or get the ", link(offer.portable.url, `portable zip${size}`), " · ");
  }
  if (offer.notesUrl) alt.append(link(offer.notesUrl, "Release notes"));
  else alt.append(link($("foot-releases").href, "Release notes"));

  const hash = $("hash");
  if (offer.main.sha256) {
    hash.textContent = offer.main.sha256;
    $("copy-hash").hidden = false;
  } else if (offer.main.sha256Url) {
    hash.replaceChildren(link(offer.main.sha256Url, `Download ${offer.main.name}.sha256`));
  }
  $("ps").textContent = `Get-FileHash .\\${offer.main.name} -Algorithm SHA256`;
}

function fallback(message) {
  const s = $("dl-status");
  s.textContent = message;
  s.hidden = false;
}

async function start() {
  try {
    const offer = pickRelease(await loadReleases());
    if (offer) render(offer);
    else fallback("No Windows build is published yet. The button opens the releases page.");
  } catch {
    fallback("Couldn't load the latest version. The button opens the releases page, where every build is listed.");
  }
}

$("copy-hash").addEventListener("click", async () => {
  const button = $("copy-hash");
  try {
    await navigator.clipboard.writeText($("hash").textContent);
    button.textContent = "Copied";
  } catch {
    const range = document.createRange();
    range.selectNodeContents($("hash"));
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    button.textContent = "Selected";
  }
  setTimeout(() => { button.textContent = "Copy"; }, 1600);
});

start();

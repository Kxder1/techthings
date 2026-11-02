// Tech Things build step: writes this week's products into index.html as plain HTML
// (so search engines read them without running JavaScript) and updates sitemap.xml.
// Run after editing the CHART block:  node build.mjs
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("./index.html", import.meta.url);
let html = readFileSync(file, "utf8");

// Load SETTINGS and CHART from the inline <script> that defines them.
const first = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).find(c => c.includes("const CHART"));
if (!first) throw new Error("Could not find the CHART script in index.html");
const { SETTINGS, CHART } = new Function(first + "; return { SETTINGS, CHART };")();

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const link = asin => `https://www.amazon.com/dp/${encodeURIComponent(asin)}/?tag=${encodeURIComponent(SETTINGS.AFFILIATE_TAG)}`;
const nice = iso => new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

// Same no-repeat rule the page uses: deals first, then best sellers.
const seen = new Set(CHART.lastWeekAsins || []);
const pick = list => {
  const out = [];
  for (const it of list || []) {
    if (!it || !it.asin || seen.has(it.asin)) continue;
    seen.add(it.asin); out.push(it);
    if (out.length === 10) break;
  }
  return out;
};
const deals = pick(CHART.deals);
const items = pick((CHART.items || []).slice().sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99)));
if (items.length < 10) throw new Error(`Only ${items.length} best sellers after the no-repeat rule`);

const row = (it, i, isDeal) => `<li class="item">
      <div class="rank">${i + 1}</div>
      <a class="thumb" href="${link(it.asin)}" target="_blank" rel="nofollow sponsored noopener" tabindex="-1">${it.img ? `<img src="https://m.media-amazon.com/images/I/${encodeURIComponent(it.img)}._AC_SL300_.jpg" alt="${esc(it.name)}" width="88" height="88" loading="lazy" decoding="async">` : ""}</a>
      <div class="info"><span class="name">${isDeal ? '<span class="tag">Deal</span>' : ""}${esc(it.name)}</span><span class="brand">${esc(it.brand)}</span></div>
      <a class="btn" href="${link(it.asin)}" target="_blank" rel="nofollow sponsored noopener">${isDeal ? "See deal on Amazon" : "View on Amazon"}</a>
    </li>`;

const swap = (re, value, label) => {
  if (!re.test(html)) throw new Error("Marker not found: " + label);
  html = html.replace(re, value);
};

swap(/(<ol id="deals">)[\s\S]*?(<\/ol>)/, `$1${deals.map((it, i) => row(it, i, true)).join("")}$2`, "deals list");
swap(/(<ol id="list">)[\s\S]*?(<\/ol>)/, `$1${items.map((it, i) => row(it, i, false)).join("")}$2`, "best sellers list");
swap(/<section class="board" id="deals-board"( hidden)?/, `<section class="board" id="deals-board"${deals.length ? "" : " hidden"}`, "deals section");
swap(/(<div class="meta" id="meta">)[\s\S]*?(<\/div>)/,
  `$1<span>Week of <b>${esc(nice(CHART.weekOf))}</b></span><span>New list every Friday</span>$2`, "week line");

// Product list structured data, written into the <head>.
const itemList = (name, desc, list) => ({
  "@type": "ItemList", name, description: desc, numberOfItems: list.length,
  itemListElement: list.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: "https://www.amazon.com/dp/" + it.asin }))
});
const graph = [];
if (deals.length) graph.push(itemList("Best Tech & Gaming Deals This Week", `Tech and gaming deals on Amazon for the week of ${nice(CHART.weekOf)}.`, deals));
graph.push(itemList("Top 10 Best-Selling Tech Gadgets", `The best-selling everyday and gaming tech on Amazon for the week of ${nice(CHART.weekOf)}.`, items));
const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c");
swap(/<!--ITEMLIST:START-->[\s\S]*?<!--ITEMLIST:END-->/,
  `<!--ITEMLIST:START--><script type="application/ld+json">${ld}</script><!--ITEMLIST:END-->`, "ITEMLIST markers");

writeFileSync(file, html);

const sm = new URL("./sitemap.xml", import.meta.url);
writeFileSync(sm, readFileSync(sm, "utf8").replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${CHART.weekOf}</lastmod>`));

console.log(`Built: ${deals.length} deals, ${items.length} best sellers, week of ${CHART.weekOf}`);

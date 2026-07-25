#!/usr/bin/env node
// Generates static, crawlable city + barber profile pages from live Supabase data.
// Run: node scripts/generate-barber-pages.js
//
// Output structure (relative to faded-landing/):
//   barbers.html                    -> /barbers          (city index)
//   barbers/<city-slug>.html        -> /barbers/<city>   (per-city listing)
//   barbers/<city-slug>/<slug>.html -> /barbers/<city>/<slug> (barber profile)
//
// Deliberately regenerates the whole barbers/ tree from scratch every run rather
// than diffing -- this guarantees stale/removed/unapproved barbers never linger
// as orphaned public pages.

const fs = require("fs");
const path = require("path");
const { fetchLiveBarbers, normalizeCity } = require("./lib/fetch-barbers");
const { cityHubPage, cityPage, barberProfilePage } = require("./lib/templates");

const ROOT = path.join(__dirname, "..");
const BARBERS_DIR = path.join(ROOT, "barbers");

function slugifyBarberFallback(name, id) {
  const base = (name || "barber").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base ? `${base}-${id.slice(0, 6)}` : id.slice(0, 8);
}

async function main() {
  console.log("[generate-barber-pages] Fetching live barbers from Supabase...");
  const raw = await fetchLiveBarbers();
  console.log(`[generate-barber-pages] Fetched ${raw.length} approved, non-test barbers.`);

  // Group into cities, skipping anything with no usable city text or no
  // shareable_slug (no slug = no way to link to a real in-app booking page,
  // so a public profile for it would be a dead end).
  const cityMap = new Map(); // slug -> { display, slug, barbers: [] }
  let skipped = 0;
  for (const row of raw) {
    const norm = normalizeCity(row.city);
    if (!norm) { skipped++; continue; }
    if (!row.shareable_slug) { skipped++; continue; }
    const name = (Array.isArray(row.profiles) ? row.profiles[0]?.full_name : row.profiles?.full_name) || row.handle || "Barber";
    const barber = {
      id: row.id,
      name,
      slug: row.shareable_slug || slugifyBarberFallback(name, row.id),
      bio: row.bio,
      specialty: row.specialty,
      price_min: row.price_min,
      price_max: row.price_max,
      rating: row.rating,
      review_count: row.review_count,
      total_cuts: row.total_cuts,
      avatar_url: row.avatar_url,
      instagram: row.instagram,
      is_mobile: row.is_mobile,
      is_founding_barber: row.is_founding_barber,
    };
    if (!cityMap.has(norm.slug)) cityMap.set(norm.slug, { display: norm.display, slug: norm.slug, barbers: [] });
    cityMap.get(norm.slug).barbers.push(barber);
  }
  if (skipped > 0) console.log(`[generate-barber-pages] Skipped ${skipped} barber(s) with unusable city text or missing shareable_slug.`);

  const cities = [...cityMap.values()]
    .map(c => ({ ...c, count: c.barbers.length }))
    .sort((a, b) => b.count - a.count || a.display.localeCompare(b.display));

  // Clean slate: remove any previously generated barbers/ tree + hub page
  fs.rmSync(BARBERS_DIR, { recursive: true, force: true });
  fs.rmSync(path.join(ROOT, "barbers.html"), { force: true });
  fs.mkdirSync(BARBERS_DIR, { recursive: true });

  fs.writeFileSync(path.join(ROOT, "barbers.html"), cityHubPage(cities));
  console.log("[generate-barber-pages] Wrote barbers.html");

  const generatedUrls = [{ loc: "https://www.letsgetfaded.com/barbers", changefreq: "daily", priority: "0.8" }];

  for (const city of cities) {
    fs.writeFileSync(path.join(BARBERS_DIR, `${city.slug}.html`), cityPage(city, city.barbers));
    const cityDir = path.join(BARBERS_DIR, city.slug);
    fs.mkdirSync(cityDir, { recursive: true });
    generatedUrls.push({ loc: `https://www.letsgetfaded.com/barbers/${city.slug}`, changefreq: "daily", priority: "0.7" });
    for (const b of city.barbers) {
      fs.writeFileSync(path.join(cityDir, `${b.slug}.html`), barberProfilePage(city, b));
      generatedUrls.push({ loc: `https://www.letsgetfaded.com/barbers/${city.slug}/${b.slug}`, changefreq: "weekly", priority: "0.6" });
    }
    console.log(`[generate-barber-pages] Wrote /barbers/${city.slug} + ${city.barbers.length} profile page(s)`);
  }

  updateSitemap(generatedUrls);
  console.log(`[generate-barber-pages] Done. ${cities.length} cities, ${raw.length - skipped} profile pages.`);
}

function updateSitemap(generatedUrls) {
  const sitemapPath = path.join(ROOT, "sitemap.xml");
  let xml = fs.readFileSync(sitemapPath, "utf8");

  // Remove any previously-generated /barbers block (marked by comment sentinels)
  // and existing generated <url> entries, then insert a fresh block.
  xml = xml.replace(/\s*<!-- GENERATED:BARBERS:START -->[\s\S]*?<!-- GENERATED:BARBERS:END -->\s*/, "\n");

  const urlsXml = generatedUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n");

  const block = `\n<!-- GENERATED:BARBERS:START -->\n${urlsXml}\n<!-- GENERATED:BARBERS:END -->\n`;
  xml = xml.replace("</urlset>", `${block}</urlset>`);
  fs.writeFileSync(sitemapPath, xml);
  console.log(`[generate-barber-pages] Updated sitemap.xml with ${generatedUrls.length} URLs.`);
}

main().catch(e => {
  console.error("[generate-barber-pages] FAILED:", e.message);
  process.exit(1);
});

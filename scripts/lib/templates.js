// HTML templates for programmatic barber/city discovery pages.
// Reuses the same nav/fonts/style pattern as contact.html/privacy.html/terms.html
// so these pages feel like part of the site, not a bolted-on directory.

const SITE = "https://www.letsgetfaded.com";
const APP = "https://app.letsgetfaded.com";

const HEAD_STYLE = `
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;background:#0C0C10}
body{background:#0C0C10;color:#F5F5F0;font-family:'DM Sans',sans-serif;min-height:100vh}
::selection{background:#3B6CF7;color:#fff}
a:focus-visible,button:focus-visible{outline:2px solid #3B6CF7;outline-offset:3px;border-radius:4px}
nav{padding:20px 48px;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:space-between}
.nav-logo{font-family:'Bebas Neue',sans-serif;font-size:24px;letter-spacing:1.5px;text-decoration:none}
.nav-logo .fad{color:#F5F5F0}.nav-logo .ed{color:#3B6CF7}
.nav-back{font-family:'Syne',sans-serif;font-size:13px;font-weight:600;color:rgba(245,245,240,0.6);text-decoration:none;transition:color 0.2s}
.nav-back:hover{color:#F5F5F0}
.page{max-width:840px;margin:0 auto;padding:80px 24px 100px}
.eyebrow{font-family:'Syne',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;color:#3B6CF7;text-transform:uppercase;text-align:center}
h1{font-family:'Oswald',sans-serif;font-weight:600;font-size:clamp(30px,5vw,46px);text-align:center;margin:14px 0 8px}
.sub{font-family:'DM Sans',sans-serif;font-size:16px;color:rgba(245,245,240,0.55);text-align:center;margin:0 0 48px;max-width:600px;margin-left:auto;margin-right:auto}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:8px}
.card{display:block;padding:22px;border-radius:16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);text-decoration:none;color:inherit;transition:transform 0.15s ease,border-color 0.15s ease}
.card:hover{transform:translateY(-3px);border-color:rgba(59,108,247,0.4)}
.card-title{font-family:'Oswald',sans-serif;font-size:19px;font-weight:600;color:#F5F5F0}
.card-sub{font-family:'DM Sans',sans-serif;font-size:13px;color:rgba(245,245,240,0.5);margin-top:4px}
.badge{display:inline-block;padding:4px 10px;border-radius:20px;background:rgba(37,99,235,0.12);border:1px solid rgba(37,99,235,0.3);color:#3B6CF7;font-size:11px;font-weight:700;letter-spacing:0.3px}
.profile-hero{display:flex;gap:20px;align-items:center;padding:24px;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);margin-bottom:28px}
.avatar{width:76px;height:76px;border-radius:50%;object-fit:cover;background:#1a1a1a;flex-shrink:0}
.avatar-fallback{width:76px;height:76px;border-radius:50%;background:linear-gradient(135deg,#2563EB33,#2563EB55);display:flex;align-items:center;justify-content:center;font-family:'Oswald',sans-serif;font-size:26px;font-weight:600;color:#3B6CF7;flex-shrink:0}
.profile-name{font-family:'Oswald',sans-serif;font-size:24px;font-weight:600}
.profile-meta{font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(245,245,240,0.55);margin-top:4px}
.stat-row{display:flex;gap:24px;margin:20px 0;flex-wrap:wrap}
.stat{font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(245,245,240,0.7)}
.stat b{color:#F5F5F0;font-weight:700}
.specs{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0}
.spec-chip{padding:6px 12px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);font-size:12.5px;color:rgba(245,245,240,0.75)}
.bio{font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.7;color:rgba(245,245,240,0.75);margin:20px 0}
.cta-btn{display:inline-block;margin-top:12px;padding:16px 32px;background:linear-gradient(135deg,#3B6CF7,#2a52c9);color:#fff;border:none;border-radius:13px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:16px;text-decoration:none;box-shadow:0 20px 50px -12px rgba(59,108,247,0.55);transition:transform 0.2s ease,box-shadow 0.2s ease}
.cta-btn:hover{transform:translateY(-2px);box-shadow:0 28px 60px -10px rgba(59,108,247,0.8)}
.divider{margin-top:56px;padding-top:32px;border-top:1px solid rgba(255,255,255,0.07);text-align:center}
.divider p{font-family:'DM Sans',sans-serif;font-size:14px;color:rgba(245,245,240,0.45)}
.divider a{color:#3B6CF7;text-decoration:none}
.empty{text-align:center;padding:40px 20px;color:rgba(245,245,240,0.5);font-size:15px}
`;

const HEAD_LINKS = `
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;600&family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
`;

function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

function initials(name) {
  return (name || "B").trim().split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase();
}

function nav(backHref, backLabel) {
  return `<nav>
  <a href="/" class="nav-logo"><span class="fad">FAD</span><span class="ed">ED</span></a>
  <a href="${backHref}" class="nav-back">← ${backLabel}</a>
</nav>`;
}

function pageShell({ title, description, canonical, breadcrumbJsonLd, extraJsonLd, bodyHtml, ogImage }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${HEAD_LINKS}
<meta name="description" content="${escapeHtml(description)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${ogImage || SITE + "/og-image.png"}">
<meta property="og:site_name" content="FADED">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<title>${escapeHtml(title)}</title>
<style>${HEAD_STYLE}</style>
<script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>
${extraJsonLd ? `<script type="application/ld+json">${JSON.stringify(extraJsonLd)}</script>` : ""}
</head>
<body>
${bodyHtml}
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}

// ─── City hub page: /barbers ──────────────────────────────────────────────
function cityHubPage(cities) {
  const canonical = `${SITE}/barbers`;
  const title = "Find a Barber Near You, Anywhere in Canada — FADED";
  const description = "Browse live, verified barbers by city across Canada. Real-time availability, real prices, book in seconds — no calls, no DMs.";
  const cards = cities.length
    ? cities.map(c => `<a class="card" href="/barbers/${c.slug}">
        <div class="card-title">${escapeHtml(c.display)}</div>
        <div class="card-sub">${c.count} live barber${c.count === 1 ? "" : "s"}</div>
      </a>`).join("\n")
    : `<div class="empty">No cities live yet — check back soon, or open the app to see barbers as they go live in real time.</div>`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Barbers" },
    ],
  };
  const itemListJsonLd = cities.length ? {
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: cities.map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.display, url: `${SITE}/barbers/${c.slug}`,
    })),
  } : null;

  const bodyHtml = `${nav("/", "Back to site")}
<div class="page">
  <div class="eyebrow">Live Across Canada</div>
  <h1>Find a barber near you.</h1>
  <p class="sub">FADED is live coast to coast — pick a city to see who's actually available right now.</p>
  <div class="grid">
${cards}
  </div>
  <div class="divider"><p>Don't see your city yet? <a href="${APP}">Open the app</a> — new barbers go live every week across all of Canada.</p></div>
</div>`;

  return pageShell({ title, description, canonical, breadcrumbJsonLd, extraJsonLd: itemListJsonLd, bodyHtml });
}

// ─── City page: /barbers/[city] ───────────────────────────────────────────
function cityPage(city, barbers) {
  const canonical = `${SITE}/barbers/${city.slug}`;
  const title = `Barbers in ${city.display} — Book Instantly on FADED`;
  const description = `See real-time availability for ${barbers.length} verified barber${barbers.length === 1 ? "" : "s"} in ${city.display}. Real prices, real reviews, book in seconds — no calls, no DMs.`;

  const cards = barbers.map(b => `<a class="card" href="/barbers/${city.slug}/${b.slug}">
      ${b.avatar_url ? `<img class="avatar" src="${escapeHtml(b.avatar_url)}" alt="${escapeHtml(b.name)}" loading="lazy" style="margin-bottom:12px">` : `<div class="avatar-fallback" style="margin-bottom:12px">${initials(b.name)}</div>`}
      <div class="card-title">${escapeHtml(b.name)}</div>
      <div class="card-sub">${b.specialty?.length ? escapeHtml(b.specialty.slice(0,2).join(", ")) : "Barber"}${b.rating && b.review_count > 0 ? ` · ★ ${b.rating.toFixed(1)}` : ""}</div>
    </a>`).join("\n");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Barbers", item: `${SITE}/barbers` },
      { "@type": "ListItem", position: 3, name: city.display },
    ],
  };
  const serviceJsonLd = {
    "@context": "https://schema.org", "@type": "Service",
    name: `FADED Barber Booking in ${city.display}`,
    serviceType: "Barber booking marketplace",
    provider: { "@type": "Organization", name: "FADED", url: `${SITE}/` },
    areaServed: { "@type": "City", name: city.display },
    description,
    url: canonical,
  };

  const bodyHtml = `${nav("/barbers", "All cities")}
<div class="page">
  <div class="eyebrow">${escapeHtml(city.display)}</div>
  <h1>Barbers in ${escapeHtml(city.display)}.</h1>
  <p class="sub">${barbers.length} verified barber${barbers.length === 1 ? "" : "s"} live right now — open the app to see real-time availability and book.</p>
  <div class="grid">
${cards}
  </div>
  <div class="divider"><p>New to FADED? <a href="${APP}">Open the app</a> to browse the live map and book instantly.</p></div>
</div>`;

  return pageShell({ title, description, canonical, breadcrumbJsonLd, extraJsonLd: serviceJsonLd, bodyHtml });
}

// ─── Barber profile page: /barbers/[city]/[slug] ──────────────────────────
function barberProfilePage(city, b) {
  const canonical = `${SITE}/barbers/${city.slug}/${b.slug}`;
  const title = `${b.name} — Barber in ${city.display} | FADED`;
  const description = (b.bio && b.bio.trim())
    ? b.bio.trim().slice(0, 155)
    : `Book ${b.name}, a verified barber in ${city.display}, on FADED. Real-time availability, real prices — book in seconds.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "Barbers", item: `${SITE}/barbers` },
      { "@type": "ListItem", position: 3, name: city.display, item: `${SITE}/barbers/${city.slug}` },
      { "@type": "ListItem", position: 4, name: b.name },
    ],
  };
  // Person + explicit hasOfferCatalog / makesOffer omitted -- BarberShop/LocalBusiness would
  // imply a fixed physical address we don't reliably have (mobile barbers, unverified addresses).
  // Person + "worksFor" Organization is an honest fit for an independent, possibly-mobile barber
  // without asserting facts (address, fixed hours) we can't confirm are accurate.
  const personJsonLd = {
    "@context": "https://schema.org", "@type": "Person",
    name: b.name,
    jobTitle: "Barber",
    worksFor: { "@type": "Organization", name: "FADED", url: `${SITE}/` },
    ...(b.avatar_url ? { image: b.avatar_url } : {}),
    ...(b.instagram ? { sameAs: [`https://instagram.com/${b.instagram.replace(/^@/, "")}`] } : {}),
    ...(b.rating && b.review_count ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: b.rating,
        reviewCount: b.review_count,
      },
    } : {}),
    description,
    url: canonical,
  };

  const bodyHtml = `${nav(`/barbers/${city.slug}`, `All ${city.display} barbers`)}
<div class="page">
  <div class="profile-hero">
    ${b.avatar_url ? `<img class="avatar" src="${escapeHtml(b.avatar_url)}" alt="${escapeHtml(b.name)}">` : `<div class="avatar-fallback">${initials(b.name)}</div>`}
    <div>
      <div class="profile-name">${escapeHtml(b.name)}</div>
      <div class="profile-meta">${escapeHtml(city.display)}${b.is_mobile ? " · Mobile" : ""}${b.is_founding_barber ? " · Founding Barber" : ""}</div>
    </div>
  </div>
  <div class="stat-row">
    ${b.rating && b.review_count > 0 ? `<div class="stat"><b>★ ${b.rating.toFixed(1)}</b> (${b.review_count} review${b.review_count === 1 ? "" : "s"})</div>` : ""}
    ${b.total_cuts > 0 ? `<div class="stat"><b>${b.total_cuts}</b> cuts done</div>` : ""}
    ${b.price_min ? `<div class="stat"><b>$${b.price_min}${b.price_max && b.price_max !== b.price_min ? `–$${b.price_max}` : ""}</b> starting price</div>` : ""}
  </div>
  ${b.specialty?.length ? `<div class="specs">${b.specialty.map(s => `<span class="spec-chip">${escapeHtml(s)}</span>`).join("")}</div>` : ""}
  ${b.bio ? `<p class="bio">${escapeHtml(b.bio)}</p>` : ""}
  <a class="cta-btn" href="${APP}/barber/${encodeURIComponent(b.slug)}">Book ${escapeHtml(b.name.split(" ")[0])} on FADED →</a>
  <div class="divider"><p>Not in ${escapeHtml(city.display)}? <a href="/barbers">See all cities</a> or <a href="${APP}">open the app</a> to find a barber near you.</p></div>
</div>`;

  return pageShell({ title, description, canonical, breadcrumbJsonLd, extraJsonLd: personJsonLd, bodyHtml, ogImage: b.avatar_url });
}

module.exports = { cityHubPage, cityPage, barberProfilePage, escapeHtml };

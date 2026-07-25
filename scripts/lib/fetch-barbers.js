// Fetches real, public, live barber data from Supabase for static page generation.
// Only ever selects columns already treated as public in the main app (see
// BARBER_PUBLIC_COLUMNS in src/App.js) -- never phone, stripe fields, or anything private.

const SUPABASE_URL = "https://qyjwfyboyijqiovtagby.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5andmeWJveWlqcWlvdnRhZ2J5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Njg0ODksImV4cCI6MjA5MjU0NDQ4OX0.jl4TiGzfF9cwEYJeqxXP8FbP6hHi6qL3aDuC9zBMJKs";

const PUBLIC_COLUMNS = [
  "id", "handle", "bio", "specialty", "price_min", "price_max", "rating",
  "review_count", "total_cuts", "status", "city", "province", "country",
  "shareable_slug", "avatar_url", "instagram", "since_year", "is_mobile",
  "is_founding_barber", "is_licensed", "years_cutting",
].join(",");

async function fetchLiveBarbers() {
  const url = `${SUPABASE_URL}/rest/v1/barbers?select=${PUBLIC_COLUMNS},profiles(full_name)&approved=eq.true&handle=not.is.null&or=(is_test.is.null,is_test.eq.false)&limit=1000`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Canadian province names -> official 2-letter codes, for stripping accidental
// province text that barbers typed directly into the free-text city field.
const PROVINCE_NAMES = {
  "ontario": "ON", "quebec": "QC", "québec": "QC", "british columbia": "BC",
  "alberta": "AB", "manitoba": "MB", "saskatchewan": "SK", "nova scotia": "NS",
  "new brunswick": "NB", "newfoundland and labrador": "NL", "newfoundland": "NL",
  "prince edward island": "PE", "northwest territories": "NT", "yukon": "YT", "nunavut": "NU",
};
const PROVINCE_CODES = new Set(["ON","QC","BC","AB","MB","SK","NS","NB","NL","PE","NT","YT","NU"]);

// Cleans up messy free-text city input (e.g. "Brampton,ON", "beamsville ontario ",
// "Montréal ") into a consistent display name + URL slug, using the separate
// structured `province` column as the source of truth for province rather than
// whatever (if anything) got typed into the city field itself.
function normalizeCity(rawCity) {
  if (!rawCity) return null;
  let s = rawCity.trim();
  // Strip a trailing/embedded ",XX" or " XX" 2-letter province code
  s = s.replace(/,?\s*\b([A-Za-z]{2})\b\s*$/, (m, code) => PROVINCE_CODES.has(code.toUpperCase()) ? "" : m);
  // Strip a trailing full province name
  const lower = s.toLowerCase();
  for (const name of Object.keys(PROVINCE_NAMES)) {
    if (lower.endsWith(name)) { s = s.slice(0, s.length - name.length); break; }
  }
  s = s.replace(/,\s*$/, "").trim();
  if (!s) return null;
  // Title-case the display name (handles "beamsville" -> "Beamsville")
  const display = s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  const slug = display
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // strip accents (Montréal -> Montreal)
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return { display, slug };
}

module.exports = { fetchLiveBarbers, normalizeCity, PROVINCE_CODES };

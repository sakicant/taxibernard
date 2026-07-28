# taxivodice.hr (TAXI Vodice Bernard)

A private taxi and transfer service in Vodice, Croatia, run by Bernard
Mikulić (legal entity: BHOPE, obrt za taxi prijevoz i usluge, vl. Bernard
Mikulić). This is a **different client** from Antonio's own sites
(taxisibenik.hr, taxiskradin.hr) — same build system and general approach
(built by Antonio Digital), but Bernard's own brand, business, and pricing.
Do not merge Bernard's business details with Antonio's.

## What this project is

Rebuilt from the previous WordPress + Elementor + CabGrid site
(taxivodice.hr) into a static site with a custom PHP + MySQL booking
backend, mirroring the system built for taxisibenik.hr but with Bernard's
own yellow/cream/black brand and Vodice-specific pricing. The goal is to
replace CabGrid and WordPress entirely once this is live.

- One driver, one car: Bernard Mikulić, a Renault Espace seating up to 6
  passengers plus the driver (not 4, unlike Antonio's Škoda Superb).
- Bernard speaks Croatian and English fluently, and can also communicate in
  Serbian, Montenegrin and Bosnian. Never claim other languages for him.
- Running his own taxi service since 2024.
- Contact: +385 97 753 9328 (phone/WhatsApp), bernard.mikulic@gmail.com.
- Address: Udovičića Benjamina 3b, 22211 Vodice, Croatia. OIB: 39613340643.

## Build workflow

- Pages live in `src/pages/<page-id>/<lang>/{meta.json,content.html}`;
  shared markup in `src/partials/` (header/footer/quote-widget/base).
- Run `python build.py` to generate the site. NEVER hand-edit generated
  `index.html` files; they are overwritten on every build.
- Only `en` exists today (site root, no prefix). The original WordPress site
  also had a working Croatian version at `/hr/` — not yet rebuilt here. See
  `LANGUAGES` in `build.py` to add languages; follow the taxiskradin.hr
  pattern (`src/partials/<name>.<lang>.html` overrides, per-page `<lang>`
  folders).
- `PRICES` in `script.js` is the source of truth for the quote widget's
  fixed fares, all anchored at Vodice (every route is Vodice-to-X).
  `booking-submit.php`'s passenger cap is 6 (not 4), matching the Espace.
- `build.py` computes an asset version hash for `styles.css` + `script.js`
  cache busting, and writes `sitemap.xml`.
- Local preview: `.claude/launch.json` defines a static server on port 5510
  (taxiskradin/taxisibenik use other ports, so all three can run at once).
  PHP pages (booking backend, admin) cannot run in the static preview.

## Standing rules (carried over from Antonio's sites, still apply here)

- NO em dashes ever, in any content, any language.
- Mobile-friendliness is top priority: check every change at mobile width.
- Git: descriptive commits explaining why. Only commit when asked.
- `config.php` (real DB + admin credentials) is gitignored and lives only on
  the server. `config.sample.php` is the template.

## Bernard-specific rules (do NOT copy Antonio's terms here)

- **No advance payment or deposit.** Unlike Antonio's 20% advance policy,
  Bernard's actual Terms & Conditions require no advance payment at all;
  full payment (cash or card) is due to the driver on the day. Keep booking
  confirmation emails and copy consistent with this, never mention a
  deposit for Bernard.
- Fixed prices cover up to 4 passengers; a small additional fee applies for
  5-6 (contact Bernard for the exact amount, not published as a fixed
  number anywhere on the original site).
- Local rides (Vodice, Srima, Tribunj and nearby Gaćelezi, Čista Velika,
  Čista Mala) use the meter: start €3, then €4/km, plus €0.42/minute
  waiting time. `LOCAL_ZONE` in script.js is the source of truth for which
  towns count as "local" in the quote widget.
- Fixed-price destinations added 2026-07-28: Tisno (€50), Jezera (€55),
  Pirovac (€50), Betina (€70), matched against taxisibenik.hr's own
  Vodice-anchored price matrix (script.js, "Vodice"/reverse entries) since
  Bernard hadn't quoted these himself yet. Murter (€45) was already set
  from Bernard's real site and was left untouched.
- **Missing prices to get from Bernard**: the local-zone cross-pairs have
  no fixed price on purpose (intentionally left out of PRICES so the quote
  widget falls back to "Bernard will quote you directly"): Vodice&ndash;Srima,
  Vodice&ndash;Tribunj, Srima&ndash;Tribunj. Once Bernard gives real numbers, add
  them to PRICES.Vodice (and PRICES.Srima for the Srima&ndash;Tribunj pair).

## Known gaps / next steps

- **Trustindex reviews widget**: DONE. Three live embeds from Bernard's
  Trustindex dashboard are wired in (`cdn.trustindex.io/loader.js?<id>`,
  not the `loader-cert.js` variant taxisibenik.hr uses): a compact badge
  (`d329dbc7...`) in the hero/trust-strip spot on home, airport-transfers,
  intercity-transfers and contact; a full review grid (`39b03747...`) on
  the homepage reviews section; a footer badge (`a5001877...`) in
  `src/partials/footer.html`. All three verified rendering live content in
  the browser. The footer one lazy-loads on scroll into view, so it may
  read empty if checked immediately after page load without scrolling.
- **Opening hours**: not published anywhere on the original site beyond "on
  demand during working hours". Ask Bernard for his actual hours before
  publishing an `openingHoursSpecification` in the LocalBusiness schema.
- **Croatian translation**: the live WordPress site has a working `/hr/`
  version; this rebuild is English-only so far.
- **"Hope Apartments Vodice" partner link**: listed in the footer as a
  partner but no confirmed URL was available while porting; currently
  plain text, not a link.
- The original site's Terms & Conditions page had a stray sentence at the
  top ("Here's the full Terms & Conditions, restructured around how Bernard
  actually operates...") that reads like leftover AI-assistant commentary
  accidentally left in published content. It was NOT carried over here;
  flag this to Bernard/Antonio if it's still live on WordPress.

## Backend (PHP + MySQL, mirrors taxisibenik.hr)

- `booking-submit.php` stores bookings and emails Bernard + the customer.
- `contact.php` handles the contact form (name, email, message, GDPR
  consent, matches the fields on the original WordPress contact form).
- Admin: `manage-b7k39x/` (secret path, HTTP Basic Auth gated, salted
  SHA-256 in config, same pattern as taxisibenik's `manage-k29q7x/`). No
  special-offers feature here (Bernard's site has none).
- Deployment target: not yet decided; taxisibenik/taxiskradin use cPanel
  hosting. DB + user created in cPanel, tables imported via phpMyAdmin,
  `config.php` created on the server from `config.sample.php`.

## GitHub

Repo: https://github.com/sakicant/taxibernard

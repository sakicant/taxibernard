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
- `PRICES` in `script.js` is the source of truth for the quote widget's and
  booking page's *displayed* fixed fares, all anchored at Vodice (every
  route is Vodice-to-X). `prices.php` is the independent server-side copy,
  used only to re-validate a submitted booking's price in
  `booking-submit.php` before it's stored/emailed, since the price arrives
  as a plain editable URL/form field and must never be trusted on its own
  (found and fixed 2026-07-29: `?price=1` on a booking link used to sail
  straight through to Bernard's inbox unchecked). **Keep both files in sync
  by hand when a price changes**, there's no build step wiring them
  together. `booking-submit.php`'s passenger cap is 6 (not 4), matching the
  Espace.
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

- **Advance payment required, same as Antonio's system (changed 2026-07-29,
  by Bernard's own request — "same amounts same everything").** A booking
  is only confirmed once the deposit or full fare is paid: 20% deposit
  (minimum €20) for transfers over €20, full advance payment for €20 and
  under. Balance due to the driver on the day, cash or card. Refunds: full
  (bank transfer) or full minus €10 (card) more than 72h before pickup, no
  refund at 72h or under or on a no-show. Ported wholesale from
  taxisibenik.hr's booking form (contact_method + payment_option + invoice
  checkbox + consent checkbox), booking-submit.php validation, schema
  (`contact_method`, `payment_option`, `invoice_required` columns,
  `customer_email` now nullable since WhatsApp-only bookers may skip it),
  and Terms & Conditions §3/§4/§5. Payment collection itself is manual on
  Antonio's site too (no Stripe/PayPal anywhere) — Bernard follows up by
  email with bank transfer/card instructions after the booking request
  arrives, then flips the `payment` field in the admin once it's received.
  If Bernard ever reverts to no-deposit, undo this across: book/en/,
  terms-and-conditions/en/, script.js booking-page block,
  booking-submit.php, schema.sql, manage-b7k39x/{index,booking}.php,
  llms.txt, and the two meta.json files that mention payment.
- Fixed prices cover up to 4 passengers; a small additional fee applies for
  5-6 (contact Bernard for the exact amount, not published as a fixed
  number anywhere on the original site).
- Local rides (Vodice, Srima, Tribunj and nearby Čista Mala) use the meter:
  start €3, then €4/km, plus €0.42/minute waiting time. `LOCAL_ZONE` in
  script.js is the source of truth for which towns count as "local" in the
  quote widget. Srima and Tribunj also carry a real Vodice fixed price now
  (€15 each), they just stay grouped as "local" per Bernard's own request,
  not moved into the fixed-price destinations group.
- **Fixed prices updated 2026-07-29 from Bernard's own numbers**: Tisno
  (€30), Jezera (€40), Pirovac (€30), Murter (€50, was €45), Srima (€15),
  Tribunj (€15), Čista Velika (€40), Gaćelezi (€25), Stankovci (€45) — all
  new towns. These replace the 2026-07-28 taxisibenik.hr-matched guesses
  for Tisno/Jezera/Pirovac; Murter's card on intercity-transfers was
  updated to match.
- **Three exceptions kept at Antonio's price instead of Bernard's, by
  explicit request** (Antonio wants to double check these with Bernard
  before matching them, since Bernard's numbers came in lower/higher than
  what's been quoted so far):
  - Skradin: site says €70, Bernard says €55 (site is €15 higher)
  - Lozovac: site says €60 (from taxisibenik.hr's matrix, Lozovac wasn't
    priced on this site before), Bernard says €45 (site is €15 higher)
  - Primošten: site says €70 (from taxisibenik.hr's matrix, wasn't priced
    on this site before), Bernard says €80 (site is €10 lower)
  Betina wasn't in Bernard's 2026-07-29 list, but per Bernard's own price
  list it's the same fare as Murter (bridge-connected island towns), so
  it's set to €50 to match Murter rather than left at the old €70 guess.

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

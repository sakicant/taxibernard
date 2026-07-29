const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// The Trustindex widget scripts scan the page for contact info and clone the
// topbar's mailto link as a stray, invisible tracking element right after
// .topbar. It has no visible content of its own, but its presence still
// pushes .site-header down by one empty line, which reads as a stray third
// color (the cream body background) briefly showing through the header.
// Strip any .topbar-item clone that lands outside the real topbar markup,
// both immediately and whenever new nodes show up later (the widgets load
// async).
function stripStrayTopbarClones() {
  document.querySelectorAll('.topbar-item').forEach((el) => {
    if (!el.closest('.topbar-inner')) el.remove();
  });
}
stripStrayTopbarClones();
new MutationObserver(stripStrayTopbarClones).observe(document.body, { childList: true, subtree: true });

const whatsappFloat = document.querySelector('.whatsapp-float');
if (whatsappFloat) {
  setTimeout(() => whatsappFloat.classList.add('visible'), 3000);
}

const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const toggleHeaderBg = () => siteHeader.classList.toggle('scrolled', window.scrollY > 40);
  toggleHeaderBg();
  window.addEventListener('scroll', toggleHeaderBg);
}

const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

document.querySelectorAll('.nav-dropdown-toggle').forEach((toggle) => {
  toggle.addEventListener('click', () => {
    if (window.innerWidth > 900) return;
    const dropdown = toggle.closest('.nav-dropdown');
    dropdown.classList.toggle('open');
  });
});

// ---------------------------------------------------------------------------
// Canonical fixed prices, anchored at Vodice (Bernard's base). Shared by the
// quote widget below and the booking page's price display further down, so
// there's one source of truth for what a route "should" cost on the client
// side. The server has its own independent copy (prices.php) and never
// trusts whatever price a request claims, exactly because this file (and
// the URL params it reads) are fully client-controlled and editable by
// anyone, this constant is for display/UX only, not a security boundary.
// Keep both copies in sync when a price changes.
const PRICES = {
  Vodice: {
    'Šibenik': 30,
    'Split': 155,
    'Zadar': 100,
    'Murter': 50,
    'Skradin': 70,
    'Zagreb': 490,
    'Dubrovnik': 490,
    'Makarska': 210,
    'Tisno': 30,
    'Jezera': 40,
    'Pirovac': 30,
    'Betina': 50,
    'Srima': 15,
    'Tribunj': 15,
    'Lozovac': 60,
    'Primošten': 70,
    'Čista Velika': 40,
    'Gaćelezi': 25,
    'Stankovci': 45,
    'Split Airport (SPU)': 115,
    'Zadar Airport (ZAD)': 100,
    'Zagreb Airport (ZAG)': 480,
    'Dubrovnik Airport (DBV)': 480
  }
};

// Price for one direction; prefers the exact directional value and falls back
// to the reverse direction when only one is listed. Returns null if the pair
// has no fixed price (custom quote).
function priceOneWay(from, to) {
  const f = PRICES[from];
  if (f && f[to] != null) return f[to];
  const r = PRICES[to];
  if (r && r[from] != null) return r[from];
  return null;
}

// ---------------------------------------------------------------------------
// Quote widget.
// ---------------------------------------------------------------------------
const quoteWidget = document.getElementById('quote-widget');
if (quoteWidget) {
  // Towns close enough to Vodice to be a meter-rate "local" ride rather than
  // a fixed-price trip. Srima and Tribunj now also have a real Vodice fixed
  // price (see PRICES above), they just stay grouped here per Bernard, same
  // idea as before: picking the same town twice still shows the meter
  // message, and any other cross-pair among these (e.g. Srima to Tribunj)
  // that has no PRICES entry falls back to "Bernard quotes you directly".
  const LOCAL_ZONE = ['Vodice', 'Srima', 'Tribunj'];

  const GROUPS = [
    { label: 'Vodice (local rides)', items: LOCAL_ZONE },
    { label: 'Airports', items: ['Split Airport (SPU)', 'Zadar Airport (ZAD)', 'Zagreb Airport (ZAG)', 'Dubrovnik Airport (DBV)'] },
    { label: 'Fixed-price destinations', items: [
      'Betina', 'Čista Velika', 'Dubrovnik', 'Gaćelezi', 'Jezera', 'Lozovac',
      'Makarska', 'Murter', 'Pirovac', 'Primošten', 'Skradin', 'Split',
      'Stankovci', 'Šibenik', 'Tisno', 'Zadar', 'Zagreb'
    ] }
  ];

  // Diacritic-insensitive normalize so "sibenik" matches "Šibenik", etc.
  function normalize(s) {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function iconFor(name) {
    let p;
    if (/Airport/.test(name)) {
      p = '<path d="M21 15.5v-1.4l-7-4.3V5a1.5 1.5 0 0 0-3 0v4.8l-7 4.3v1.4l7-2.1v3.4l-1.9 1.3v1.1L12 18l3.9 1.2v-1.1L14 16.8v-3.4z"/>';
    } else {
      p = '<path d="M3 21V7l5-2.5V7l5-2.5V10h6v11H3zm2.5-3H8v-2H5.5v2zm0-4H8v-2H5.5v2zm0-4H8V8H5.5v2zm7 8H15v-2h-2.5v2zm0-4H15v-2h-2.5v2z"/>';
    }
    return '<svg class="combo-opt-icon" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">' + p + '</svg>';
  }

  // Searchable, grouped dropdown backed by a hidden input (id kept as
  // quote-from / quote-to so the quote logic can still read .value).
  function initCombo(root) {
    const input = root.querySelector('.combo-input');
    const hidden = root.querySelector('input[type="hidden"]');
    const panel = root.querySelector('.combo-panel');
    const options = [];
    let isOpen = false;
    let activeIdx = -1;

    GROUPS.forEach((group) => {
      const g = document.createElement('div');
      g.className = 'combo-group';
      const gl = document.createElement('div');
      gl.className = 'combo-group-label';
      gl.textContent = group.label;
      g.appendChild(gl);
      group.items.forEach((name) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'combo-option';
        btn.innerHTML = iconFor(name) + '<span class="combo-opt-label"></span>';
        btn.querySelector('.combo-opt-label').textContent = name;
        btn.addEventListener('click', () => choose(name));
        g.appendChild(btn);
        options.push({ el: btn, group: g, value: name, norm: normalize(name) });
      });
      panel.appendChild(g);
    });
    const empty = document.createElement('div');
    empty.className = 'combo-empty';
    empty.textContent = 'No matching location';
    empty.hidden = true;
    panel.appendChild(empty);

    function visible() { return options.filter((o) => !o.el.hidden); }
    function clearActive() { options.forEach((o) => o.el.classList.remove('active')); activeIdx = -1; }
    function setActive(i) {
      const vis = visible();
      if (!vis.length) return;
      activeIdx = (i + vis.length) % vis.length;
      options.forEach((o) => o.el.classList.remove('active'));
      vis[activeIdx].el.classList.add('active');
      vis[activeIdx].el.scrollIntoView({ block: 'nearest' });
    }
    function filter(q) {
      const nq = normalize(q);
      const groupsShown = new Set();
      let any = false;
      options.forEach((o) => {
        const match = nq === '' || o.norm.indexOf(nq) !== -1;
        o.el.hidden = !match;
        if (match) { any = true; groupsShown.add(o.group); }
      });
      panel.querySelectorAll('.combo-group').forEach((g) => { g.hidden = !groupsShown.has(g); });
      empty.hidden = any;
      clearActive();
    }
    function open() {
      if (isOpen) return;
      isOpen = true;
      panel.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      filter('');
    }
    function close() {
      isOpen = false;
      panel.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      input.value = hidden.value;
      clearActive();
    }
    function choose(name) {
      hidden.value = name;
      input.value = name;
      close();
    }

    input.addEventListener('focus', () => { open(); input.select(); });
    input.addEventListener('click', open);
    input.addEventListener('input', () => { open(); filter(input.value); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); setActive(activeIdx + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx - 1); }
      else if (e.key === 'Enter') {
        if (isOpen) {
          e.preventDefault();
          const vis = visible();
          if (activeIdx >= 0 && vis[activeIdx]) choose(vis[activeIdx].value);
          else if (vis.length === 1) choose(vis[0].value);
        }
      } else if (e.key === 'Escape') { close(); }
    });
    document.addEventListener('click', (e) => { if (!root.contains(e.target)) close(); });
  }

  document.querySelectorAll('#quote-widget .combo').forEach(initCombo);

  const fromSelect = document.getElementById('quote-from');
  const toSelect = document.getElementById('quote-to');

  const tripToggleBtns = document.querySelectorAll('.trip-toggle-btn');
  let tripType = 'oneway';
  tripToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tripToggleBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      tripType = btn.dataset.trip;
    });
  });

  document.querySelectorAll('.stepper-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const delta = parseInt(btn.dataset.delta, 10);
      const min = parseInt(target.dataset.min, 10);
      const max = parseInt(target.dataset.max, 10);
      const next = Math.min(max, Math.max(min, parseInt(target.dataset.value, 10) + delta));
      target.dataset.value = String(next);
      target.textContent = String(next);
    });
  });

  function bookingUrl(q) {
    const params = new URLSearchParams();
    params.set('from', q.from);
    params.set('to', q.to);
    params.set('trip', q.tripType);
    params.set('pax', q.passengers);
    params.set('lug', q.luggage);
    params.set('price', q.priceParam);
    return '/book/?' + params.toString();
  }

  const quoteResult = document.getElementById('quote-result');

  document.getElementById('quote-submit').addEventListener('click', () => {
    const from = fromSelect.value;
    const to = toSelect.value;

    quoteResult.hidden = false;

    if (!from || !to) {
      quoteResult.innerHTML = '<p>Please choose a pickup location and destination.</p>';
      return;
    }

    const passengers = document.getElementById('quote-passengers').dataset.value;
    const luggage = document.getElementById('quote-luggage').dataset.value;
    const base = { from, to, tripType, passengers, luggage };
    const pax = parseInt(passengers, 10);
    const feeNote = pax >= 5 ? ' <span class="quote-price-note">+ small fee for 5-6 passengers, confirmed with Bernard.</span>' : '';

    if (from === to && LOCAL_ZONE.includes(from)) {
      const url = bookingUrl({ ...base, priceParam: 'meter' });
      quoteResult.innerHTML =
        '<p>A local ride within ' + from + ' (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the <a href="/#pricing">local rates</a>.</p>' +
        '<a class="btn btn-primary quote-btn" href="' + url + '">Book Now</a>';
      return;
    }

    const oneway = priceOneWay(from, to);
    if (oneway != null) {
      let total, sub;
      if (tripType === 'return') {
        total = oneway + priceOneWay(to, from);
        sub = 'return total';
      } else {
        total = oneway;
        sub = 'one way';
      }
      const url = bookingUrl({ ...base, priceParam: String(total) });
      quoteResult.innerHTML =
        '<div class="quote-price">&euro;' + total + ' <span class="quote-price-sub">' + sub + '</span>' + feeNote + '</div>' +
        '<a class="btn btn-primary quote-btn" href="' + url + '">Book Now</a>';
    } else {
      const url = bookingUrl({ ...base, priceParam: 'custom' });
      quoteResult.innerHTML =
        '<p>Bernard doesn\'t have a listed fixed price for ' + from + ' to ' + to + ' yet, but he\'ll quote you directly.</p>' +
        '<a class="btn btn-primary quote-btn" href="' + url + '">Request a Quote</a>';
    }
  });

  // "Reserve Now" route cards prefill the widget with the route and show the fare.
  document.querySelectorAll('.route-book[data-from]').forEach((link) => {
    link.addEventListener('click', () => {
      const set = (hidId, visId, val) => {
        const h = document.getElementById(hidId);
        const v = document.getElementById(visId);
        if (h) h.value = val;
        if (v) v.value = val;
      };
      set('quote-from', 'quote-from-input', link.dataset.from);
      set('quote-to', 'quote-to-input', link.dataset.to);
      document.getElementById('quote-submit').click();
    });
  });
}

// ---------------------------------------------------------------------------
// Booking page: reads the quote from the URL, shows a summary, collects the
// remaining details (date, time, contact) and emails the full request.
// ---------------------------------------------------------------------------
const bookingPageForm = document.getElementById('booking-page-form');
if (bookingPageForm) {
  const params = new URLSearchParams(location.search);
  const fromEl = document.getElementById('book-from');
  const toEl = document.getElementById('book-to');
  const tripEl = document.getElementById('book-trip');
  const paxEl = document.getElementById('book-pax');
  const lugEl = document.getElementById('book-lug');
  const fromVal = params.get('from') || '';
  const toVal = params.get('to') || '';

  if (fromVal) fromEl.value = fromVal;
  if (toVal) toEl.value = toVal;
  if (params.get('trip') === 'return') tripEl.value = 'return';
  if (params.get('pax')) paxEl.value = params.get('pax');
  if (params.get('lug')) lugEl.value = params.get('lug');

  // Recompute the price ourselves from the route instead of trusting the
  // URL's price param: it's plain editable text, ?price=1 works exactly
  // like ?price=115 as far as the browser's concerned. This keeps the
  // on-screen summary honest even off a hand-edited link, and
  // booking-submit.php independently re-checks the same way server-side
  // before anything reaches Bernard, so a tampered link can't get a fake
  // price past either the display or the actual booking.
  const rawPriceParam = params.get('price') || '';
  let priceParam = rawPriceParam;
  let priceText = '';
  if (rawPriceParam === 'meter') {
    priceText = 'Taxi meter (start €3, then €4/km)';
  } else {
    const oneway = priceOneWay(fromVal, toVal);
    if (oneway != null) {
      const total = tripEl.value === 'return' ? oneway + priceOneWay(toVal, fromVal) : oneway;
      priceParam = String(total);
      priceText = '€' + total;
    } else {
      priceParam = 'custom';
    }
  }
  if (priceText) {
    document.getElementById('sum-price').textContent = priceText;
    document.getElementById('booking-price-line').hidden = false;
  }

  const returnFields = document.getElementById('book-return-fields');
  const syncReturn = () => { returnFields.hidden = tripEl.value !== 'return'; };
  tripEl.addEventListener('change', syncReturn);
  syncReturn();

  const bookingPageNote = document.getElementById('booking-page-note');

  const todayStr = new Date().toISOString().slice(0, 10);
  const bookDateEl = document.getElementById('book-date');
  const bookReturnDateEl = document.getElementById('book-return-date');
  if (bookDateEl) bookDateEl.min = todayStr;
  if (bookReturnDateEl) bookReturnDateEl.min = todayStr;

  bookingPageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const from = fromEl.value.trim();
    const to = toEl.value.trim();
    const name = document.getElementById('book-name').value.trim();
    const email = document.getElementById('book-email').value.trim();
    const phone = document.getElementById('book-phone').value.trim();
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;

    if (!from || !to || !name || !email || !phone || !date || !time) {
      bookingPageNote.textContent = 'Please fill in the pickup and drop-off, your name, email, phone, pickup date and time.';
      return;
    }

    bookingPageNote.textContent = 'Sending...';

    try {
      const body = new FormData();
      body.append('pickup', from);
      body.append('dropoff', to);
      body.append('trip', tripEl.value);
      body.append('pickup_date', date);
      body.append('pickup_time', time);
      body.append('return_date', document.getElementById('book-return-date').value);
      body.append('return_time', document.getElementById('book-return-time').value);
      body.append('passengers', paxEl.value);
      body.append('luggage', lugEl.value);
      body.append('price', priceParam);
      body.append('name', name);
      body.append('email', email);
      body.append('phone', phone);
      body.append('flight', document.getElementById('book-flight').value.trim());
      body.append('dropoff_details', document.getElementById('book-dropoff-details').value.trim());
      body.append('notes', document.getElementById('book-notes').value.trim());
      body.append('company', document.getElementById('book-company').value);

      const response = await fetch('/booking-submit.php', {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success) {
        bookingPageNote.textContent = 'Thanks! Your booking request has been received. Bernard will confirm directly by phone, WhatsApp or email shortly, no advance payment needed.';
        bookingPageForm.reset();
      } else {
        bookingPageNote.textContent = (data && data.error) || 'Something went wrong. Please call or WhatsApp Bernard instead.';
      }
    } catch (err) {
      bookingPageNote.textContent = 'Something went wrong. Please call or WhatsApp Bernard instead.';
    }
  });
}

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
const contactForm = document.getElementById('contact-form');
const contactNote = document.getElementById('form-note');

if (contactForm && contactNote) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    contactNote.textContent = 'Sending...';

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success) {
        contactNote.textContent = 'Thanks! Your message has been sent. Bernard will get back to you shortly.';
        contactForm.reset();
      } else {
        contactNote.textContent = (data && data.error) || 'Something went wrong. Please call or WhatsApp Bernard instead.';
      }
    } catch (err) {
      contactNote.textContent = 'Something went wrong. Please call or WhatsApp Bernard instead.';
    }
  });
}

// ---------------------------------------------------------------------------
// Cookie banner
// ---------------------------------------------------------------------------
const cookieBanner = document.getElementById('cookie-banner');
if (cookieBanner) {
  const getConsent = () => localStorage.getItem('tx_cookie_consent');
  const setConsent = (val) => localStorage.setItem('tx_cookie_consent', val);
  if (!getConsent()) cookieBanner.hidden = false;
  const accept = document.getElementById('cookie-accept');
  const decline = document.getElementById('cookie-decline');
  if (accept) accept.addEventListener('click', () => { setConsent('accepted'); cookieBanner.hidden = true; });
  if (decline) decline.addEventListener('click', () => { setConsent('rejected'); cookieBanner.hidden = true; });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Language. The page's <html lang> drives which strings and which internal
// paths the scripted UI uses, so the quote widget and the booking/contact
// forms speak the same language as the page they sit on. Translations live in
// I18N keyed by the English string; t() falls back to English for anything
// missing, so an untranslated key degrades to English rather than breaking.
// ---------------------------------------------------------------------------
const LANG = (document.documentElement.getAttribute('lang') || 'en').toLowerCase();

// Path of the booking page and the home page in each language. The quote
// widget links here, so a hardcoded /book/ would drop a Croatian visitor onto
// the English form.
const BOOK_PATH = {
  en: '/book/', hr: '/hr/rezervacija/', de: '/de/buchen/', pl: '/pl/rezerwacja/',
  cs: '/cs/rezervace/', it: '/it/prenota/', fr: '/fr/reserver/',
  nl: '/nl/boeken/', hu: '/hu/foglalas/'
};
const HOME_PATH = {
  en: '/', hr: '/hr/', de: '/de/', pl: '/pl/', cs: '/cs/',
  it: '/it/', fr: '/fr/', nl: '/nl/', hu: '/hu/'
};
const bookPath = () => BOOK_PATH[LANG] || BOOK_PATH.en;
const homePath = () => HOME_PATH[LANG] || HOME_PATH.en;

const I18N = {
  hr: {
    'No matching location': 'Nema odgovarajuće lokacije',
    'Please choose a pickup location and destination.': 'Odaberite mjesto polaska i odredište.',
    'Book Now': 'Rezerviraj odmah',
    'Request a Quote': 'Zatraži ponudu',
    'one way': 'u jednom smjeru',
    'return total': 'ukupno povratno',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ mala doplata za 5-6 putnika, potvrđuje se s Bernardom.',
    'local rates': 'lokalne cijene',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Lokalna vožnja u mjestu {from} (i obližnjoj Čistoj Maloj) naplaćuje se po taksimetru: start &euro;3, zatim &euro;4/km. Pogledajte {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernard još nema navedenu fiksnu cijenu za relaciju {from} - {to}, ali će vam ponudu dati izravno.",
    'Sending...': 'Šaljemo...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Ispunite mjesto polaska i odredište, ime, željeni način kontakta, odabir plaćanja, datum i vrijeme preuzimanja te prihvatite Uvjete korištenja.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Odaberite preuzimanje najmanje 2 sata od sada. Za raniju vožnju nazovite Bernarda ili mu pišite na WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Hvala! Vaš zahtjev za rezervaciju je zaprimljen. Bernard će vam se uskoro javiti e-poštom kako bi potvrdio dostupnost i poslao upute za predujam kojim se rezervacija u potpunosti potvrđuje.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Hvala! Vaša poruka je poslana. Bernard će vam se javiti u najkraćem roku.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Nešto je pošlo po zlu. Nazovite Bernarda ili mu pišite na WhatsApp.'
  },
  de: {
    'No matching location': 'Kein passender Ort',
    'Please choose a pickup location and destination.': 'Bitte wählen Sie Abholort und Zielort.',
    'Book Now': 'Jetzt buchen',
    'Request a Quote': 'Angebot anfragen',
    'one way': 'einfache Fahrt',
    'return total': 'Gesamtpreis Hin- und Rückfahrt',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ kleiner Aufpreis für 5-6 Personen, mit Bernard abgestimmt.',
    'local rates': 'lokale Tarife',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Eine lokale Fahrt innerhalb von {from} (und dem nahen Čista Mala) wird nach Taxameter berechnet: Grundpreis &euro;3, dann &euro;4/km. Siehe {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Für {from} nach {to} hat Bernard noch keinen festen Preis hinterlegt, er nennt Ihnen aber direkt ein Angebot.",
    'Sending...': 'Wird gesendet...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Bitte füllen Sie Abhol- und Zielort, Ihren Namen, den bevorzugten Kontaktweg, die Zahlungsart sowie Datum und Uhrzeit der Abholung aus und akzeptieren Sie die AGB.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Bitte wählen Sie eine Abholung frühestens in 2 Stunden. Für eine frühere Fahrt rufen Sie Bernard an oder schreiben Sie ihm per WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Danke! Ihre Buchungsanfrage ist eingegangen. Bernard meldet sich in Kürze per E-Mail, um die Verfügbarkeit zu bestätigen und Ihnen die Hinweise zur Anzahlung zu senden, mit der Ihre Reservierung endgültig bestätigt wird.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Danke! Ihre Nachricht wurde gesendet. Bernard meldet sich in Kürze bei Ihnen.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Etwas ist schiefgelaufen. Bitte rufen Sie Bernard an oder schreiben Sie ihm per WhatsApp.'
  },
  pl: {
    'No matching location': 'Brak pasującej lokalizacji',
    'Please choose a pickup location and destination.': 'Wybierz miejsce odbioru i cel podróży.',
    'Book Now': 'Zarezerwuj teraz',
    'Request a Quote': 'Poproś o wycenę',
    'one way': 'w jedną stronę',
    'return total': 'łącznie w obie strony',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ niewielka dopłata za 5-6 pasażerów, potwierdzana z Bernardem.',
    'local rates': 'stawki lokalne',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Lokalny przejazd w obrębie {from} (oraz pobliskiej Čista Mala) rozliczany jest według taksometru: start &euro;3, następnie &euro;4/km. Zobacz {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernard nie ma jeszcze podanej stałej ceny na trasie {from} - {to}, ale poda wycenę bezpośrednio.",
    'Sending...': 'Wysyłanie...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Uzupełnij miejsce odbioru i cel podróży, imię i nazwisko, preferowany kontakt, wybór płatności, datę i godzinę odbioru oraz zaakceptuj Regulamin.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Wybierz odbiór za co najmniej 2 godziny. Aby pojechać wcześniej, zadzwoń do Bernarda lub napisz na WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Dziękujemy! Twoja prośba o rezerwację została przyjęta. Bernard wkrótce wyśle e-mail, aby potwierdzić dostępność i przekazać instrukcje dotyczące zaliczki, która ostatecznie potwierdza rezerwację.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Dziękujemy! Twoja wiadomość została wysłana. Bernard odezwie się wkrótce.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Coś poszło nie tak. Zadzwoń do Bernarda lub napisz na WhatsApp.'
  },
  cs: {
    'No matching location': 'Žádná odpovídající lokalita',
    'Please choose a pickup location and destination.': 'Vyberte místo vyzvednutí a cíl cesty.',
    'Book Now': 'Rezervovat',
    'Request a Quote': 'Vyžádat nabídku',
    'one way': 'jednosměrná jízda',
    'return total': 'celkem zpáteční',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ malý příplatek za 5-6 cestujících, potvrzuje se s Bernardem.',
    'local rates': 'místní ceny',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Místní jízda v rámci {from} (a blízké Čista Mala) se účtuje podle taxametru: nástup &euro;3, poté &euro;4/km. Viz {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernard zatím nemá uvedenou pevnou cenu pro trasu {from} - {to}, nabídku vám ale sdělí přímo.",
    'Sending...': 'Odesílání...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Vyplňte místo vyzvednutí a cíl, jméno, preferovaný kontakt, způsob platby, datum a čas vyzvednutí a potvrďte Obchodní podmínky.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Zvolte vyzvednutí nejdříve za 2 hodiny. Pro dřívější jízdu zavolejte Bernardovi nebo mu napište na WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Děkujeme! Vaši žádost o rezervaci jsme přijali. Bernard vám brzy pošle e-mail, potvrdí dostupnost a zašle pokyny k zálohové platbě, která rezervaci definitivně potvrzuje.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Děkujeme! Vaše zpráva byla odeslána. Bernard se vám brzy ozve.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Něco se pokazilo. Zavolejte prosím Bernardovi nebo mu napište na WhatsApp.'
  },
  it: {
    'No matching location': 'Nessuna località corrispondente',
    'Please choose a pickup location and destination.': 'Scegli il luogo di partenza e la destinazione.',
    'Book Now': 'Prenota ora',
    'Request a Quote': 'Richiedi un preventivo',
    'one way': 'solo andata',
    'return total': 'totale andata e ritorno',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ piccolo supplemento per 5-6 passeggeri, confermato con Bernard.',
    'local rates': 'tariffe locali',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Una corsa locale all'interno di {from} (e nella vicina Čista Mala) viene calcolata con il tassametro: scatto &euro;3, poi &euro;4/km. Vedi {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernard non ha ancora un prezzo fisso indicato per {from} - {to}, ma ti darà un preventivo direttamente.",
    'Sending...': 'Invio in corso...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Compila luogo di partenza e destinazione, nome, contatto preferito, scelta di pagamento, data e ora del ritiro e accetta i Termini e condizioni.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Scegli un ritiro almeno 2 ore da adesso. Per un viaggio prima, chiama Bernard o scrivigli su WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Grazie! La tua richiesta di prenotazione è stata ricevuta. Bernard ti scriverà presto per confermare la disponibilità e inviarti le istruzioni per l\'acconto che conferma definitivamente la prenotazione.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Grazie! Il tuo messaggio è stato inviato. Bernard ti risponderà a breve.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Qualcosa è andato storto. Chiama Bernard o scrivigli su WhatsApp.'
  },
  fr: {
    'No matching location': 'Aucun lieu correspondant',
    'Please choose a pickup location and destination.': 'Choisissez le lieu de prise en charge et la destination.',
    'Book Now': 'Réserver',
    'Request a Quote': 'Demander un devis',
    'one way': 'aller simple',
    'return total': 'total aller-retour',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ petit supplément pour 5-6 passagers, confirmé avec Bernard.',
    'local rates': 'tarifs locaux',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Un trajet local dans {from} (et la commune voisine de Čista Mala) est facturé au compteur : prise en charge &euro;3, puis &euro;4/km. Voir les {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernard n'a pas encore de prix fixe indiqué pour {from} - {to}, mais il vous fera une offre directement.",
    'Sending...': 'Envoi en cours...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Renseignez le lieu de prise en charge et la destination, votre nom, le contact souhaité, le mode de paiement, la date et l\'heure de prise en charge, et acceptez les Conditions générales.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Choisissez une prise en charge dans au moins 2 heures. Pour un trajet plus tôt, appelez Bernard ou écrivez-lui sur WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Merci ! Votre demande de réservation a bien été reçue. Bernard vous écrira prochainement pour confirmer la disponibilité et vous envoyer les instructions pour l\'acompte qui confirme définitivement votre réservation.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Merci ! Votre message a été envoyé. Bernard vous répondra très vite.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Une erreur est survenue. Appelez Bernard ou écrivez-lui sur WhatsApp.'
  },
  nl: {
    'No matching location': 'Geen overeenkomende locatie',
    'Please choose a pickup location and destination.': 'Kies een ophaallocatie en bestemming.',
    'Book Now': 'Nu boeken',
    'Request a Quote': 'Offerte aanvragen',
    'one way': 'enkele reis',
    'return total': 'totaal retour',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ kleine toeslag voor 5-6 passagiers, af te stemmen met Bernard.',
    'local rates': 'lokale tarieven',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "Een lokale rit binnen {from} (en het nabijgelegen Čista Mala) wordt op de taximeter afgerekend: start &euro;3, daarna &euro;4/km. Zie de {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernard heeft nog geen vaste prijs vermeld voor {from} - {to}, maar hij geeft u rechtstreeks een offerte.",
    'Sending...': 'Versturen...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Vul de ophaallocatie en bestemming, uw naam, gewenst contact, betaalkeuze, datum en tijd van ophalen in en accepteer de Algemene voorwaarden.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Kies een ophaaltijd van minimaal 2 uur vanaf nu. Voor een eerdere rit belt u Bernard of stuurt u hem een WhatsApp.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Bedankt! Uw boekingsaanvraag is ontvangen. Bernard mailt u binnenkort om de beschikbaarheid te bevestigen en stuurt instructies voor de aanbetaling waarmee uw reservering definitief wordt.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Bedankt! Uw bericht is verzonden. Bernard neemt spoedig contact met u op.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Er is iets misgegaan. Bel Bernard of stuur hem een WhatsApp.'
  },
  hu: {
    'No matching location': 'Nincs találat',
    'Please choose a pickup location and destination.': 'Válasszon felvételi helyet és úti célt.',
    'Book Now': 'Foglalás',
    'Request a Quote': 'Ajánlatkérés',
    'one way': 'egy útra',
    'return total': 'oda-vissza összesen',
    '+ small fee for 5-6 passengers, confirmed with Bernard.': '+ kis felár 5-6 utas esetén, Bernarddal egyeztetve.',
    'local rates': 'helyi tarifák',
    "A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.": "A {from} területén belüli helyi fuvar taxióra szerint történik: alapdíj &euro;3, majd &euro;4/km. Lásd: {link}.",
    "Bernard doesn't have a listed fixed price for {from} to {to} yet, but he'll quote you directly.": "Bernardnak még nincs megadott fix ára a(z) {from} - {to} útvonalra, de közvetlenül ad ajánlatot.",
    'Sending...': 'Küldés...',
    'Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.': 'Adja meg a felvételi helyet és az úti célt, a nevét, a kívánt kapcsolatfelvételi módot, a fizetési választást, a felvétel dátumát és időpontját, majd fogadja el az Általános szerződési feltételeket.',
    'Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.': 'Válasszon legalább 2 órával későbbi felvételi időpontot. Korábbi útért hívja Bernardot vagy írjon neki WhatsAppon.',
    'Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.': 'Köszönjük! Foglalási kérését megkaptuk. Bernard hamarosan e-mailben jelentkezik, visszaigazolja a szabad időpontot, és elküldi az előleg utalásához szükséges tudnivalókat, amellyel a foglalás véglegessé válik.',
    'Thanks! Your message has been sent. Bernard will get back to you shortly.': 'Köszönjük! Üzenetét elküldtük. Bernard hamarosan válaszol.',
    'Something went wrong. Please call or WhatsApp Bernard instead.': 'Valami hiba történt. Hívja Bernardot vagy írjon neki WhatsAppon.'
  }
};

const t = (s) => (I18N[LANG] && I18N[LANG][s]) || s;

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
    empty.textContent = t('No matching location');
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
    return bookPath() + '?' + params.toString();
  }

  const quoteResult = document.getElementById('quote-result');

  document.getElementById('quote-submit').addEventListener('click', () => {
    const from = fromSelect.value;
    const to = toSelect.value;

    quoteResult.hidden = false;

    if (!from || !to) {
      quoteResult.innerHTML = '<p>' + t('Please choose a pickup location and destination.') + '</p>';
      return;
    }

    const passengers = document.getElementById('quote-passengers').dataset.value;
    const luggage = document.getElementById('quote-luggage').dataset.value;
    const base = { from, to, tripType, passengers, luggage };
    const pax = parseInt(passengers, 10);
    const feeNote = pax >= 5 ? ' <span class="quote-price-note">' + t('+ small fee for 5-6 passengers, confirmed with Bernard.') + '</span>' : '';

    if (from === to && LOCAL_ZONE.includes(from)) {
      const url = bookingUrl({ ...base, priceParam: 'meter' });
      quoteResult.innerHTML =
        '<p>' + t('A local ride within {from} (and nearby Čista Mala) is charged by the taxi meter: start &euro;3, then &euro;4/km. See the {link}.').replace('{from}', from).replace('{link}', '<a href="' + homePath() + '#pricing">' + t('local rates') + '</a>') + '</p>' +
        '<a class="btn btn-primary quote-btn" href="' + url + '">' + t('Book Now') + '</a>';
      return;
    }

    const oneway = priceOneWay(from, to);
    if (oneway != null) {
      let total, sub;
      if (tripType === 'return') {
        total = oneway + priceOneWay(to, from);
        sub = t('return total');
      } else {
        total = oneway;
        sub = t('one way');
      }
      const url = bookingUrl({ ...base, priceParam: String(total) });
      quoteResult.innerHTML =
        '<div class="quote-price">&euro;' + total + ' <span class="quote-price-sub">' + sub + '</span>' + feeNote + '</div>' +
        '<a class="btn btn-primary quote-btn" href="' + url + '">' + t('Book Now') + '</a>';
    } else {
      const url = bookingUrl({ ...base, priceParam: 'custom' });
      quoteResult.innerHTML =
        '<p>' + t('Bernard doesn\'t have a listed fixed price for {from} to {to} yet, but he\'ll quote you directly.').replace('{from}', from).replace('{to}', to) + '</p>' +
        '<a class="btn btn-primary quote-btn" href="' + url + '">' + t('Request a Quote') + '</a>';
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

  // Contact method picks which of email/phone is actually required, and
  // flags the other as optional, so the two fields stay simple text inputs
  // without duplicating a whole "how do I reach you" question twice.
  const emailEl = document.getElementById('book-email');
  const phoneEl = document.getElementById('book-phone');
  const emailFlag = document.getElementById('email-flag');
  const phoneFlag = document.getElementById('phone-flag');
  const applyContactPref = () => {
    const chosen = bookingPageForm.querySelector('input[name="contact_method"]:checked');
    const v = chosen ? chosen.value : '';
    if (emailEl) emailEl.required = v === 'email';
    if (phoneEl) phoneEl.required = v === 'whatsapp';
    if (emailFlag) emailFlag.textContent = v ? '(' + (v === 'email' ? 'required' : 'optional') + ')' : '';
    if (phoneFlag) phoneFlag.textContent = v ? '(' + (v === 'whatsapp' ? 'required' : 'optional') + ')' : '';
  };
  bookingPageForm.querySelectorAll('input[name="contact_method"]').forEach((r) => r.addEventListener('change', applyContactPref));
  applyContactPref();

  const bookingPageNote = document.getElementById('booking-page-note');

  const todayStr = new Date().toISOString().slice(0, 10);
  const bookDateEl = document.getElementById('book-date');
  const bookReturnDateEl = document.getElementById('book-return-date');
  if (bookDateEl) bookDateEl.min = todayStr;
  if (bookReturnDateEl) bookReturnDateEl.min = todayStr;

  // Bernard confirms bookings by hand, so give him a minimum runway: reject
  // a pickup less than 2 hours out and point the customer at a faster
  // channel (call/WhatsApp) instead.
  const MIN_NOTICE_MS = 2 * 60 * 60 * 1000;

  bookingPageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const from = fromEl.value.trim();
    const to = toEl.value.trim();
    const name = document.getElementById('book-name').value.trim();
    const email = emailEl.value.trim();
    const phone = phoneEl.value.trim();
    const date = document.getElementById('book-date').value;
    const time = document.getElementById('book-time').value;
    const contactMethodEl = bookingPageForm.querySelector('input[name="contact_method"]:checked');
    const paymentOptionEl = bookingPageForm.querySelector('input[name="payment_option"]:checked');
    const consentEl = document.getElementById('book-consent');
    const contactOk = contactMethodEl && (contactMethodEl.value === 'email' ? email : phone);

    if (!from || !to || !name || !date || !time || !contactOk || !paymentOptionEl || !consentEl.checked) {
      bookingPageNote.textContent = t('Please fill in the pickup and drop-off, your name, preferred contact, payment choice, pickup date and time, and accept the Terms and Conditions.');
      return;
    }

    const pickupAt = new Date(date + 'T' + time);
    if (isNaN(pickupAt.getTime()) || pickupAt.getTime() - Date.now() < MIN_NOTICE_MS) {
      bookingPageNote.textContent = t('Please choose a pickup at least 2 hours from now. For a sooner ride, call or WhatsApp Bernard directly.');
      return;
    }

    bookingPageNote.textContent = t('Sending...');

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
      body.append('contact_method', contactMethodEl.value);
      body.append('payment_option', paymentOptionEl.value);
      body.append('invoice_required', document.getElementById('book-invoice').checked ? '1' : '');
      body.append('consent', consentEl.checked ? '1' : '');

      const response = await fetch('/booking-submit.php', {
        method: 'POST',
        body,
        headers: { Accept: 'application/json' }
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success) {
        bookingPageNote.textContent = t('Thanks! Your booking request has been received. Bernard will email you soon to confirm availability and send instructions for the advance payment that fully confirms your reservation.');
        bookingPageForm.reset();
        applyContactPref();
      } else {
        bookingPageNote.textContent = (data && data.error) || t('Something went wrong. Please call or WhatsApp Bernard instead.');
      }
    } catch (err) {
      bookingPageNote.textContent = t('Something went wrong. Please call or WhatsApp Bernard instead.');
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
    contactNote.textContent = t('Sending...');

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' }
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data && data.success) {
        contactNote.textContent = t('Thanks! Your message has been sent. Bernard will get back to you shortly.');
        contactForm.reset();
      } else {
        contactNote.textContent = (data && data.error) || t('Something went wrong. Please call or WhatsApp Bernard instead.');
      }
    } catch (err) {
      contactNote.textContent = t('Something went wrong. Please call or WhatsApp Bernard instead.');
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

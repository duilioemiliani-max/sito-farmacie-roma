# Sito Farmacie Roma (Emiliani, San Luca, Strampelli)

Sito statico a più pagine: non serve nessun server né database.

## Pagine
- `index.html` — Home (richiesta rapida, servizi in evidenza, sedi)
- `servizi.html` — tutti i servizi, con filtri e prenotazione via WhatsApp
- `convenzioni.html` — servizi in convenzione ASL / mutuabili / a pagamento
- `farmacie.html` — le tre sedi (indirizzi, orari, contatti)
- `privacy.html` — informativa privacy (BOZZA: completa le parti tra parentesi quadre)
- `archivio.html` — archivio richieste per il personale (accesso con email e password)

Cartella `assets/`: `style.css` (grafica), `app.js` (funzioni), `img/` (foto e loghi).

## Come metterlo online con GitHub + Netlify (consigliato)
Con questo metodo, ogni volta che modifichi un file su GitHub, il sito online si aggiorna da solo in un minuto,
senza dover ricaricare nulla a mano.

### La prima volta
1. Vai su **github.com**, crea un account gratuito se non ce l'hai.
2. In alto a destra premi **+** > **New repository**. Dai un nome, per esempio `sito-farmacie-roma`.
   Lascialo "Public" o "Private" come preferisci, non aggiungere altri file, poi **Create repository**.
3. Nella pagina del repository appena creato premi **uploading an existing file**.
4. Apri sul tuo computer la cartella `site` (quella dentro questo zip) e trascina **tutto il contenuto**
   della cartella (non la cartella stessa) nella pagina di GitHub.
5. In basso scrivi un messaggio tipo "Primo caricamento" e premi **Commit changes**.
6. Vai su **netlify.com**, crea un account gratuito (puoi accedere anche con l'account GitHub).
7. Premi **Add new site > Import an existing project > Deploy with GitHub**, autorizza Netlify e scegli
   il repository `sito-farmacie-roma`.
8. Lascia le impostazioni proposte (non serve nessun comando di build) e premi **Deploy**.
9. Dopo un minuto il sito è online con un indirizzo tipo `nome-a-caso.netlify.app`. Puoi cambiarlo in uno
   più leggibile da "Site configuration" > "Change site name".

Da questo momento, ogni modifica salvata su GitHub aggiorna da sola il sito su Netlify.

### Per fare una modifica in futuro
1. Vai sul repository su GitHub, apri il file da cambiare (es. `farmacie.html`), premi l'icona della matita
   in alto a destra per modificarlo.
2. Fai la modifica, scorri in basso, scrivi una breve descrizione e premi **Commit changes**.
3. Netlify se ne accorge da solo e ripubblica il sito in circa un minuto: non serve fare nient'altro.

Per modifiche più grandi (nuove pagine, nuovi servizi, restyling) torna pure in chat: preparo i file
aggiornati e tu li ricarichi su GitHub con "Add file > Upload files", trascinando quelli cambiati.

### In alternativa: solo hosting, senza GitHub
Va bene anche caricare l'intera cartella così com'è su un hosting tradizionale (Aruba, Register…) via FTP,
oppure trascinarla su Netlify con "Deploy manually" (senza collegamento a GitHub: in quel caso, per ogni
modifica dovrai ricaricare tu la cartella).

## Dati da aggiornare
- Numeri WhatsApp e telefoni: cerca in `index.html`, `farmacie.html`, e in `assets/app.js` (numeri con prefisso `39`).
- Orari: nelle pagine (`index.html`, `farmacie.html`, footer) e in `assets/app.js` (calcolo di "Aperta ora").
- Coordinate delle sedi (per "farmacia più vicina"): in `assets/app.js`.
- Servizi: card in `servizi.html` (le sei in evidenza sono ripetute in `index.html`).

## Note
- Le richieste partono su WhatsApp e, se attivi l'archivio (sotto), vengono anche registrate per sede.
- La posizione dell'utente resta nel suo browser e non viene inviata a nessuno.
- I font vengono caricati da Google Fonts.

## Archivio richieste per sede (da attivare)
Ogni richiesta inviata dal sito (servizio, sede, giorno, nome e telefono se scritti, note) viene salvata e
compare in `archivio.html`, divisa per sede, con stato Nuova / In carico / Completata / Annullata,
ricerca e scarico in CSV. Ogni farmacia vede solo le proprie richieste; il titolare può vedere tutte le sedi.

1. Crea un progetto gratuito su https://supabase.com (oppure usa quello che avevi con Lovable).
2. In Supabase apri **SQL Editor**, incolla tutto il contenuto di `supabase-setup.sql` e premi **Run**.
3. In **Authentication > Users > Add user** crea un utente per ogni farmacia, con queste email e una password a scelta (spunta "Auto Confirm User"): `staffemiliani@gmail.com`, `staff.sanluca@gmail.com`, `staff.strampelli@gmail.com`. Se vuoi, aggiungi anche un utente per il titolare. Poi, sempre nell'SQL Editor,
   collegali alle sedi con le righe in fondo a `supabase-setup.sql` (togli i `--`; le email delle tre farmacie ci sono già).
4. In **Authentication > Sign In / Providers** disattiva le nuove registrazioni (Allow new users to sign up).
5. In **Project Settings > API** copia "Project URL" e la chiave "anon / publishable" dentro `assets/config.js`.
6. Ricarica il sito sul dominio. Apri `https://tuodominio.it/archivio.html` per entrare.

Finché `assets/config.js` resta vuoto il sito funziona solo con WhatsApp e non salva nulla.

### Privacy
- Completa `privacy.html` (titolare, contatti, tempo di conservazione) e fai controllare il testo dal vostro consulente privacy.
- Se vuoi la cancellazione automatica delle richieste vecchie, usa l'ultimo blocco (facoltativo) di `supabase-setup.sql`.
- Il modulo ha un campo nascosto anti-spam. Per un filtro più forte si può aggiungere un captcha in un secondo momento.

## Avviso email al farmacista (facoltativo, gratuito)
Quando arriva una richiesta, la farmacia scelta riceve una email (Emiliani: staffemiliani@gmail.com,
San Luca: staff.sanluca@gmail.com, Strampelli: staff.strampelli@gmail.com). L'email contiene servizio, preferenza, nome, telefono, note e il link all'archivio.
Funziona con Google Apps Script, senza costi e senza dominio di posta:

1. Vai su https://script.google.com con l'account Google da cui vuoi far partire le email e crea un **Nuovo progetto**.
2. Cancella il codice di esempio e incolla il contenuto di `notifiche/apps-script.gs`.
3. In alto nello script cambia `SECRET` con una frase lunga e casuale e `LINK_ARCHIVIO` con il vostro dominio.
4. Premi **Distribuisci > Nuova distribuzione > Tipo: App web**. Esegui come: **Me**. Chi ha accesso: **Chiunque**. Autorizza quando richiesto.
5. Copia l'ID che compare nell'indirizzo dell'app web (`https://script.google.com/macros/s/ID/exec`).
6. Apri `supabase-notifiche.sql`, sostituisci `INCOLLA_ID_SCRIPT` con l'ID e `LA_TUA_FRASE_SEGRETA` con la stessa frase di `SECRET`, poi eseguilo nell'SQL Editor di Supabase.
7. Prova: invia una richiesta dal sito e controlla la casella della farmacia (guarda anche in Spam la prima volta).

Note: un account Gmail gratuito può inviare circa 100 email al giorno, più che sufficienti per le richieste del sito.
Le email contengono i dati della richiesta: usa caselle riservate al personale.

## Collegamento con la scheda Google (Google Business Profile)
Il collegamento principale del gruppo è la scheda di **Farmacia Emiliani**: il link "Trovaci su Google" è nel piè di pagina di ogni pagina.
Nel sito, la pagina **Farmacie** ha inoltre per ogni sede: "Vedi su Google Maps", "Lascia una recensione" (apre direttamente
la scheda Google della farmacia) e il pulsante "Indicazioni" basato sulla stessa scheda. I dati strutturati della pagina
indicano a Google indirizzo, telefono, orari e mappa di ogni sede.

Dal lato di Google (lo fa il proprietario della scheda, dal profilo dell'attività su https://business.google.com):
1. **Sito web**: inserisci l'indirizzo del sito (per ogni farmacia, la pagina `farmacie.html` oppure la home).
2. **Link per prenotazioni / appuntamenti**: inserisci l'indirizzo di `servizi.html`.
3. **Servizi e prodotti**: aggiungi i servizi (vaccini, Holter, metabolic check, cuptest…) come sul sito.
4. **Orari**: tienili uguali a quelli del sito; per festivi e ponti usa gli "orari speciali" della scheda.
5. Per contare le visite che arrivano da Google, aggiungi alla fine dell'indirizzo del sito nella scheda:
   `?utm_source=google&utm_medium=scheda`
6. Per raccogliere recensioni, stampa un QR code dei link "Lascia una recensione" e mettilo in cassa.

### Voto Google di Emiliani nel sito
Il voto e il numero di recensioni (4,8 e 69, dati di settembre 2026) si trovano in `assets/config.js`, nel blocco `FR_GOOGLE`.
Compaiono nella Home, nella card di Emiliani (pagina Farmacie) e nel piè di pagina. Aggiornali ogni tanto guardando la scheda su Google.

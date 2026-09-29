/**
 * Avviso email al farmacista quando arriva una nuova richiesta dal sito.
 * Si incolla in Google Apps Script (vedi LEGGIMI.md) e si pubblica come "App web".
 * Le email partono dall'account Google con cui lo pubblichi.
 */

// Parola segreta: cambiala con una frase lunga e casuale. Deve essere uguale a quella
// messa nell'indirizzo del webhook in supabase-notifiche.sql.
var SECRET = 'CAMBIA-QUESTA-FRASE-SEGRETA';

// Link all'archivio (per il pulsante nell'email). Metti il vostro dominio.
var LINK_ARCHIVIO = 'https://TUODOMINIO.it/archivio.html';

var EMAIL_SEDE = {
  emiliani:   'staffemiliani@gmail.com',
  sanluca:    'staff.sanluca@gmail.com',
  strampelli: 'staff.strampelli@gmail.com'
};
var NOME_SEDE = { emiliani: 'Emiliani', sanluca: 'San Luca', strampelli: 'Strampelli' };

function pulisci(v, max) {
  return String(v == null ? '' : v).replace(/[\r\n]+/g, ' ').slice(0, max || 200);
}

function doPost(e) {
  if (!e || !e.parameter || e.parameter.key !== SECRET) {
    return ContentService.createTextOutput('non autorizzato');
  }
  var dati = JSON.parse(e.postData.contents);
  var r = dati.record || {};
  var to = EMAIL_SEDE[r.sede];
  if (!to) return ContentService.createTextOutput('sede sconosciuta');

  var righe = [
    'Farmacia: ' + NOME_SEDE[r.sede],
    'Servizio: ' + pulisci(r.servizio, 120)
  ];
  if (r.modalita) righe.push('Modalità: ' + pulisci(r.modalita, 60));
  if (r.giorno || r.fascia) righe.push('Preferenza: ' + pulisci([r.giorno, r.fascia].join(' '), 60));
  if (r.nome) righe.push('Nome: ' + pulisci(r.nome, 100));
  if (r.telefono) righe.push('Telefono: ' + pulisci(r.telefono, 30));
  if (r.note) righe.push('Note: ' + pulisci(r.note, 500));
  righe.push('', 'Gestiscila nell\'archivio: ' + LINK_ARCHIVIO);

  MailApp.sendEmail({
    to: to,
    subject: 'Nuova richiesta: ' + pulisci(r.servizio, 80) + ' (' + NOME_SEDE[r.sede] + ')',
    body: righe.join('\n'),
    name: 'Sito Farmacie Roma'
  });
  return ContentService.createTextOutput('ok');
}

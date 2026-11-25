/* GIORNATE A TEMA
   Per aggiungere una giornata copia l'esempio qui sotto dentro FR_GIORNATE (tra le parentesi quadre).
   Dopo la data indicata in "fino" la giornata sparisce da sola dal sito.

   {
     sede: "emiliani",                  // emiliani | sanluca | strampelli
     data: "2026-12-14",                // giorno della giornata (anno-mese-giorno)
     fino: "2026-12-14",                // facoltativo: ultimo giorno in cui mostrarla (se dura più giorni)
     titolo: "Controllo colesterolo + glicemia",
     quando: "Lunedì 14 dicembre · 8:30-13:00 e 16:00-19:30",
     testo: "Colesterolo totale, HDL, LDL, trigliceridi e glicemia: <b>solo 15 €</b>.",
     note: "È necessario venire a digiuno. Posti limitati, prenotazione obbligatoria.",   // facoltativo
     locandina: "assets/img/giornata-2026-12-14.jpg",   // facoltativo
     frase: "prenotare il controllo colesterolo + glicemia di lunedì 14 dicembre"        // testo del messaggio WhatsApp
   },
*/
window.FR_GIORNATE = [
];

(function () {
  var SEDI = {
    emiliani: { nome: 'Farmacia Emiliani', wa: '393331804161', tel: '+39062203046', telTxt: '06 220 3046', via: 'Via Cantiano 62/A, Corcolle' },
    sanluca: { nome: 'Farmacia San Luca', wa: '393890336019', tel: '+390624400522', telTxt: '06 2440 0522', via: 'Via di Acqua Bullicante 70, Torpignattara' },
    strampelli: { nome: 'Farmacia Strampelli', wa: '393403515536', tel: '+39067028004', telTxt: '06 702 8004', via: 'Via di S. Croce in Gerusalemme 22A, San Giovanni' }
  };
  var d = new Date(), oggi = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  var prossime = (window.FR_GIORNATE || []).filter(function (g) { return g && SEDI[g.sede] && (g.fino || g.data) >= oggi; })
    .sort(function (a, b) { return a.data < b.data ? -1 : 1; });

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function scheda(g) {
    var s = SEDI[g.sede];
    var msg = 'Buongiorno ' + s.nome + ', vorrei ' + (g.frase || ('prenotare: ' + g.titolo)) + '.';
    return '<section class="giornata"><div class="wrap"><div class="gt" style="--gc:var(--' + g.sede + ')">' +
      (g.locandina ? '<a class="gt-img" href="' + esc(g.locandina) + '" target="_blank" rel="noopener"><img src="' + esc(g.locandina) + '" alt="Locandina: ' + esc(g.titolo) + '" loading="lazy"></a>' : '') +
      '<div class="gt-txt"><span class="gt-tag">' + esc(s.nome) + ' · Giornata a tema</span><h2>' + esc(g.titolo) + '</h2>' +
      '<p class="gt-quando"><b>' + esc(g.quando) + '</b></p>' + (g.testo ? '<p>' + g.testo + '</p>' : '') + (g.note ? '<p><b>' + esc(g.note) + '</b></p>' : '') +
      '<p class="gt-dove">' + esc(s.via) + '</p><div class="gt-btns"><a class="btn" href="https://wa.me/' + s.wa + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">Prenota su WhatsApp</a>' +
      (s.tel ? '<a class="btnl" href="tel:' + s.tel + '">Chiama ' + s.telTxt + '</a>' : '') + '</div></div></div></div></section>';
  }

  // Home: mostra le prossime giornate (se non ce ne sono, niente)
  var home = document.getElementById('giornate-home');
  if (home && prossime.length) home.innerHTML = prossime.map(scheda).join('');

  // Pagina Giornate a tema: elenco completo, oppure messaggio se non ce ne sono
  var pag = document.getElementById('giornate-elenco');
  if (pag) {
    pag.innerHTML = prossime.length ? prossime.map(scheda).join('') :
      '<div class="wrap"><p class="intro gt-vuoto">Al momento non ci sono giornate in programma. Torna a trovarci presto.</p></div>';
  }
})();

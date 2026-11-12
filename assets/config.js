/* Collegamento all'archivio richieste (Supabase) e voto Google di Farmacia Emiliani.
   Istruzioni per rifare o aggiornare questo file: vedi LEGGIMI.md */
window.FR_CONFIG = {
  SUPABASE_URL: "https://rciguhgtvmaapcneailv.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_LWoMpSDV6oRb_tx9VQIWkg_qSTO5Mmw"
};

/* Voti Google delle tre farmacie mostrati nel sito. Aggiornali ogni tanto guardando le schede su Google. */
window.FR_GOOGLE = { aggiornato: "ottobre 2026", farmacie: {
  emiliani:   { voto: 4.8, recensioni: 69 },
  sanluca:    { voto: 4.6, recensioni: 48 },
  strampelli: { voto: 4.0, recensioni: 69 }
} };

/* Recensioni a 5 stelle che scorrono nel riquadro della home (sezione «Le recensioni su Google").
   Prese da Google il 12/11/2026, solo 5 stelle. Copiale così come sono scritte (testo e nome come appare su Google, es. "Maria R.").
   farmacia: "emiliani", "sanluca" o "strampelli". Se la lista è vuota il riquadro non compare. */
window.FR_RECENSIONI = [
  /* { farmacia: "emiliani", nome: "Nome C.", stelle: 5, testo: "Testo della recensione" }, */
  { farmacia: "emiliani", nome: "Miriam C.", stelle: 5, testo: "Farmacia organizzata, pulita e accogliente. Il personale è preparato, disponibile e sempre pronto a spiegare con chiarezza i prodotti e le terapie consigliate. Tempi di attesa rapidi, ampia scelta di articoli e grande attenzione al cliente. Un punto di riferimento affidabile nel quartiere." },
  { farmacia: "emiliani", nome: "Chiara B.", stelle: 5, testo: "Siamo stati questa mattina a fare un elettrocardiogramma a mio figlio di 4 anni. Ci ha subito servito e fatti accomodare nella stanza dove effettuano l’esame. Mio figlio super tranquillo con il dottore. Grazie ritornerò sicuramente per esami simili." },
  { farmacia: "emiliani", nome: "Giulia Z.", stelle: 5, testo: "Una farmacia molto rifornita, ma quello che è più importante è la serietà e l'enorme preparazione e l'enorme cortesia. Il personale è di una gentilezza unica e tanto tanto gentile. Grazie per tutto" },
  { farmacia: "emiliani", nome: "Giuseppe R.", stelle: 5, testo: "Farmacia ben fornita e con servizi utili come prenotazione e somministrazione vaccino, montaggio holter pressorio, ecc. ecc." },
  { farmacia: "emiliani", nome: "Dany B.", stelle: 5, testo: "Medici sempre disponibili all'ascolto e per dare consigli. Farmacia che offre anche altri servizi sanitari" },
  { farmacia: "emiliani", nome: "Silvia B.", stelle: 5, testo: "Farmacia ben fornita che offre anche servizi sanitari, personale gentile e professionale" },
  { farmacia: "emiliani", nome: "Mario M.", stelle: 5, testo: "Farmacia con personale disponibilissimo, sono sempre molto preparati per ogni tipo richiesta! TOP" },
  { farmacia: "sanluca", nome: "Vanessa F.", stelle: 5, testo: "Non conoscevo questa farmacia, in quanto un po' fuori mano rispetto a casa. Sono capitata per caso, ed ho trovato grandissima disponibilità e gentilezza del personale. Mi hanno davvero aiutata molto. La consiglio." },
  { farmacia: "sanluca", nome: "Walter R.", stelle: 5, testo: "Tutto il personale è fantastico, preparato e sanno consigliarti molto bene, super gentilissimi, fantastici tutti. Siete Unici 👍" },
  { farmacia: "sanluca", nome: "Simone C.", stelle: 5, testo: "Farmacia super fornita e personale cortese... la migliore farmacia a Torpignattara. Consigliatissima!!" },
  { farmacia: "sanluca", nome: "Marco M.", stelle: 5, testo: "La mia farmacia di fiducia da decenni. Ci sono cresciuto. […] Mi piacerebbe averli dove vivo ora ma sono felice servano il quartiere in cui sono nato e cresciuto: Torpignattara." },
  { farmacia: "sanluca", nome: "Domenico C.", stelle: 5, testo: "Personale gentile e qualificato, sempre attenti alle esigenze del cliente" },
  { farmacia: "sanluca", nome: "Carla C.", stelle: 5, testo: "Ragazzi giovani ben preparati disponibili a dispensare consigli. La raccomando" },
  { farmacia: "sanluca", nome: "Stella B.", stelle: 5, testo: "Peccato non averla vicino casa, dottore gentilissimo e signora commessa al banco idem […] ha aiutato con gli strip per una ferita di mia madre, caduta oggi, con cortesia e professionalità, siamo rimaste entrambe colpite" },
  { farmacia: "strampelli", nome: "Mariangela B.", stelle: 5, testo: "Farmacia eccellente sotto ogni punto di vista. Grande assortimento di prodotti e farmaci, ma il vero valore aggiunto è la cortesia dei farmacisti, sempre disponibili e pronti ad aiutare il cliente con professionalità." },
  { farmacia: "strampelli", nome: "Antonella B.", stelle: 5, testo: "Vado alla farmacia Strampelli da diversi anni e mi sono sempre trovata bene. Mi sanno ben consigliare sui prodotti da acquistare nel mio interesse e quindi per me è perfetta. Riscontro da sempre efficienza e gentilezza." },
  { farmacia: "strampelli", nome: "Benedetta V.", stelle: 5, testo: "Stamattina ho fatto un ECG e un tampone oro faringeo. Ho trovato la dottoressa Daniela molto accogliente e dolcissima. Esperienza eccellente!!! Bravi!" },
  { farmacia: "strampelli", nome: "Giacomo L.", stelle: 5, testo: "Cortesia e professionalità accompagnate da grande simpatia. Numeri uno!" },
  { farmacia: "strampelli", nome: "Barbara M.", stelle: 5, testo: "Consulenza altamente professionale, attenzione e gentilezza. Grazie al dr. Nicola e ai suoi collaboratori" },
  { farmacia: "strampelli", nome: "Claudia O.", stelle: 5, testo: "Un grazie immenso ai dottori della farmacia Strampelli… serena e felice del prezioso servizio medico che offrite alla nostra comunità" },
  { farmacia: "strampelli", nome: "Roberto P.", stelle: 5, testo: "Personale molto gentile e disponibile, farmacia tradizionale ben rifornita, offre diversi servizi" }
];

/* Popup «Scarica l'app di Farmacia Emiliani» che compare all'apertura del sito.
   Inserisci i link degli store. Se sono vuoti il popup non compare. */
window.FR_APP = {
  android: "",  /* link Google Play, es. https://play.google.com/store/apps/details?id=... */
  ios: ""       /* link App Store, es. https://apps.apple.com/it/app/... */
};

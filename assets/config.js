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

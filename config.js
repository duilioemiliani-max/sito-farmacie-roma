/* Collegamento all'archivio richieste (Supabase). Istruzioni in LEGGIMI.md.
   Finche' i due valori restano vuoti, il sito funziona come prima (solo WhatsApp)
   e non salva nessuna richiesta. */
/* Voto Google di Farmacia Emiliani mostrato nel sito. Aggiornalo ogni tanto guardando la scheda su Google.
   Per nasconderlo, cancella il blocco FR_GOOGLE. */
window.FR_GOOGLE = { voto: 4.8, recensioni: 69, aggiornato: "settembre 2026" };

window.FR_CONFIG = {
  SUPABASE_URL: "",       // es. "https://abcdxyz.supabase.co"
  SUPABASE_ANON_KEY: ""   // chiave "anon" / "publishable" del progetto
};

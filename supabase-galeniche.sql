-- =====================================================================
-- Preparazioni galeniche - spazio privato per le ricette caricate dal sito
-- Da eseguire UNA VOLTA in Supabase: SQL Editor > New query > incolla > Run
-- Non cancella nulla: aggiunge una colonna, una cartella privata e i permessi.
-- =====================================================================

-- Percorsi dei file allegati a una richiesta (massimo 5)
alter table public.fr_richieste add column if not exists allegati text[];
alter table public.fr_richieste drop constraint if exists fr_richieste_allegati_check;
alter table public.fr_richieste add constraint fr_richieste_allegati_check
  check (allegati is null or (cardinality(allegati) between 1 and 5));

-- Il sito puo' inviare richieste; gli allegati devono stare nella cartella della sede scelta
drop policy if exists "sito puo inviare richieste" on public.fr_richieste;
create policy "sito puo inviare richieste" on public.fr_richieste
  for insert to anon, authenticated
  with check (stato = 'nuova' and gestita_il is null
    and (allegati is null or not exists (select 1 from unnest(allegati) a
         where a !~ ('^' || sede || '/[0-9a-f-]{36}\.(jpg|png|webp|heic|pdf)$'))));

-- Cartella privata (non pubblica), file fino a 10 MB, solo immagini e PDF
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fr_galeniche','fr_galeniche',false,10485760,
  array['image/jpeg','image/png','image/webp','image/heic','image/heif','application/pdf'])
on conflict (id) do update set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

-- Il sito puo' SOLO caricare nuovi file (non leggerli ne' sostituirli)
drop policy if exists "fr_galeniche sito carica" on storage.objects;
create policy "fr_galeniche sito carica" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'fr_galeniche'
    and name ~ '^(emiliani|sanluca|strampelli)/[0-9a-f-]{36}\.(jpg|png|webp|heic|pdf)$');

-- Il personale apre solo i file della propria sede (o di tutte, per il titolare)
drop policy if exists "fr_galeniche personale legge la propria sede" on storage.objects;
create policy "fr_galeniche personale legge la propria sede" on storage.objects
  for select to authenticated
  using (bucket_id = 'fr_galeniche' and exists (select 1 from public.fr_staff s
    where s.user_id = auth.uid() and (s.sede = 'tutte' or s.sede = (storage.foldername(name))[1])));

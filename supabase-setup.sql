-- =====================================================================
-- Archivio richieste - Farmacie Roma (Emiliani, San Luca, Strampelli)
-- Da eseguire UNA VOLTA in Supabase: SQL Editor > New query > incolla > Run
-- I nomi hanno prefisso "fr_" per non andare in conflitto con altre tabelle.
-- =====================================================================

create table if not exists public.fr_richieste (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  sede        text not null check (sede in ('emiliani','sanluca','strampelli')),
  servizio    text not null check (char_length(servizio) between 1 and 120),
  modalita    text check (char_length(modalita) <= 60),
  giorno      date,
  fascia      text check (char_length(fascia) <= 30),
  nome        text check (char_length(nome) <= 100),
  telefono    text check (char_length(telefono) <= 30),
  note        text check (char_length(note) <= 500),
  stato       text not null default 'nuova'
              check (stato in ('nuova','in_carico','completata','annullata')),
  gestita_il  timestamptz
);

create index if not exists fr_richieste_sede_data on public.fr_richieste (sede, created_at desc);

-- Chi puo' leggere/gestire: ogni utente e' collegato a una sede (oppure a 'tutte')
create table if not exists public.fr_staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  sede    text not null check (sede in ('emiliani','sanluca','strampelli','tutte'))
);

alter table public.fr_richieste enable row level security;
alter table public.fr_staff     enable row level security;

-- Il pubblico (sito) puo' SOLO inviare nuove richieste, mai leggerle
drop policy if exists "sito puo inviare richieste" on public.fr_richieste;
create policy "sito puo inviare richieste" on public.fr_richieste
  for insert to anon, authenticated
  with check (stato = 'nuova' and gestita_il is null);

-- Il personale vede e aggiorna solo le richieste della propria sede
drop policy if exists "personale legge la propria sede" on public.fr_richieste;
create policy "personale legge la propria sede" on public.fr_richieste
  for select to authenticated
  using (exists (select 1 from public.fr_staff s
                 where s.user_id = auth.uid()
                   and (s.sede = 'tutte' or s.sede = fr_richieste.sede)));

drop policy if exists "personale aggiorna la propria sede" on public.fr_richieste;
create policy "personale aggiorna la propria sede" on public.fr_richieste
  for update to authenticated
  using (exists (select 1 from public.fr_staff s
                 where s.user_id = auth.uid()
                   and (s.sede = 'tutte' or s.sede = fr_richieste.sede)))
  with check (exists (select 1 from public.fr_staff s
                 where s.user_id = auth.uid()
                   and (s.sede = 'tutte' or s.sede = fr_richieste.sede)));

drop policy if exists "ognuno vede la propria abilitazione" on public.fr_staff;
create policy "ognuno vede la propria abilitazione" on public.fr_staff
  for select to authenticated using (user_id = auth.uid());

grant insert on public.fr_richieste to anon, authenticated;
grant select, update on public.fr_richieste to authenticated;
grant select on public.fr_staff to authenticated;

-- ---------------------------------------------------------------------
-- DOPO aver creato gli utenti in Authentication > Users, collegali alle sedi
-- (sostituisci le email con quelle reali; 'tutte' = vede tutte le sedi):
--
-- insert into public.fr_staff (user_id, sede)
--   select id, 'emiliani'   from auth.users where email = 'staffemiliani@gmail.com';
-- insert into public.fr_staff (user_id, sede)
--   select id, 'sanluca'    from auth.users where email = 'staff.sanluca@gmail.com';
-- insert into public.fr_staff (user_id, sede)
--   select id, 'strampelli' from auth.users where email = 'staff.strampelli@gmail.com';
-- insert into public.fr_staff (user_id, sede)
--   select id, 'tutte'      from auth.users where email = 'titolare@esempio.it';
-- ---------------------------------------------------------------------

-- FACOLTATIVO - cancellazione automatica delle richieste vecchie (privacy).
-- Adatta i mesi al periodo scritto nell'informativa privacy.
-- Richiede l'estensione pg_cron (Database > Extensions):
--
-- select cron.schedule('fr-pulizia-richieste', '0 3 * * *',
--   $$ delete from public.fr_richieste where created_at < now() - interval '12 months' $$);

-- =====================================================================
-- Avviso email per ogni nuova richiesta (da eseguire DOPO supabase-setup.sql)
-- 1) Pubblica prima lo script di notifiche/apps-script.gs (vedi LEGGIMI.md)
-- 2) Sostituisci qui sotto SOLO le due scritte in MAIUSCOLO dentro l'indirizzo:
--      INCOLLA_ID_SCRIPT  -> l'ID che compare nell'URL dell'app web di Apps Script
--      LA_TUA_FRASE_SEGRETA -> la stessa frase messa in SECRET nello script
-- 3) SQL Editor > New query > incolla > Run
-- =====================================================================

create extension if not exists pg_net with schema extensions;

create or replace function public.fr_notifica()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  -- Se l'invio dell'avviso fallisce, la richiesta viene salvata comunque
  begin
    perform net.http_post(
      url     := 'https://script.google.com/macros/s/INCOLLA_ID_SCRIPT/exec?key=LA_TUA_FRASE_SEGRETA',
      body    := jsonb_build_object('record', to_jsonb(new)),
      headers := '{"Content-Type":"application/json"}'::jsonb
    );
  exception when others then
    null;
  end;
  return new;
end;
$$;

drop trigger if exists fr_notifica_nuova_richiesta on public.fr_richieste;
create trigger fr_notifica_nuova_richiesta
  after insert on public.fr_richieste
  for each row execute function public.fr_notifica();

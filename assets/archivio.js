/* Archivio richieste - accesso riservato al personale delle farmacie */
(function(){
  var C=window.FR_CONFIG||{},U=(C.SUPABASE_URL||'').replace(/\/$/,''),K=C.SUPABASE_ANON_KEY||'';
  var $=function(i){return document.getElementById(i)};
  var SEDI={emiliani:'Emiliani',sanluca:'San Luca',strampelli:'Strampelli'};
  var COL={emiliani:'--emiliani',sanluca:'--sanluca',strampelli:'--strampelli'};
  var STATI=[['nuova','Nuove'],['in_carico','In carico'],['completata','Completate'],['annullata','Annullate'],['*','Tutte']];
  var S={sess:null,sede:null,rows:[],tab:'*',st:'nuova',q:'',timer:null};
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  if(!U||!K){$('login').hidden=true;$('nocfg').hidden=false;return}
  function api(p,o,t){o=o||{};var h={apikey:K,Authorization:'Bearer '+(t||K),'Content-Type':'application/json'};
    for(var k in (o.headers||{}))h[k]=o.headers[k];
    return fetch(U+p,{method:o.method||'GET',headers:h,body:o.body})}
  function save(s){s.exp=Date.now()+Math.max(60,(s.expires_in||3600)-60)*1000;sessionStorage.setItem('fr_sess',JSON.stringify(s));S.sess=s}
  function token(){
    if(!S.sess)return Promise.reject();
    if(Date.now()<S.sess.exp)return Promise.resolve(S.sess.access_token);
    return api('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:S.sess.refresh_token})})
      .then(function(r){return r.ok?r.json():Promise.reject()}).then(function(s){save(s);return s.access_token})}
  function call(p,o){return token().then(function(t){return api(p,o,t)})}
  function logout(){sessionStorage.removeItem('fr_sess');S.sess=null;clearInterval(S.timer);location.reload()}
  function fmtT(iso){return new Date(iso).toLocaleString('it-IT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
  function fmtD(d){var p=d.split('-');return new Date(p[0],p[1]-1,p[2]).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})}
  function waNum(t){var d=String(t).replace(/\D/g,'');if(d.indexOf('00')===0)d=d.slice(2);else if(d.indexOf('39')!==0)d='39'+d;return d}
  function login(e){
    e.preventDefault();$('lerr').textContent='';
    api('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:$('em').value.trim(),password:$('pw').value})})
      .then(function(r){return r.ok?r.json():Promise.reject()})
      .then(function(s){save(s);start()})
      .catch(function(){$('lerr').textContent='Email o password non corrette.'})}
  function start(){
    call('/rest/v1/fr_staff?select=sede').then(function(r){return r.ok?r.json():Promise.reject()}).then(function(a){
      if(!a.length){$('lerr').textContent="Questo account non è abilitato a nessuna sede.";sessionStorage.removeItem('fr_sess');return}
      S.sede=a.some(function(x){return x.sede==='tutte'})?'tutte':a[0].sede;
      $('login').hidden=true;$('app').hidden=false;$('out').hidden=false;
      S.tab=S.sede==='tutte'?'*':S.sede;refresh();S.timer=setInterval(refresh,60000)
    }).catch(function(){$('lerr').textContent='Accesso non riuscito. Riprova.';sessionStorage.removeItem('fr_sess')})}
  function refresh(){
    call('/rest/v1/fr_richieste?select=*&order=created_at.desc&limit=1000').then(function(r){return r.ok?r.json():Promise.reject()})
      .then(function(a){S.rows=a;$('upd').textContent='Aggiornato alle '+new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});render()})
      .catch(function(){$('upd').textContent='Non riesco ad aggiornare: controlla la connessione.'})}
  function view(){
    var q=S.q.toLowerCase();
    return S.rows.filter(function(r){
      if(S.tab!=='*'&&r.sede!==S.tab)return false;
      if(S.st!=='*'&&r.stato!==S.st)return false;
      if(q&&[r.servizio,r.nome,r.telefono,r.note,r.modalita].join(' ').toLowerCase().indexOf(q)<0)return false;
      return true})}
  function chip(box,label,on,fn,n){var b=el('button',null,label);b.type='button';b.setAttribute('aria-pressed',on);
    if(n!=null){var c=el('span','cnt',n);b.appendChild(c)}b.addEventListener('click',fn);box.appendChild(b)}
  function render(){
    var tabs=$('tabs');tabs.textContent='';
    var sedi=S.sede==='tutte'?['*','emiliani','sanluca','strampelli']:[S.sede];
    sedi.forEach(function(s){
      var n=S.rows.filter(function(r){return (s==='*'||r.sede===s)&&r.stato==='nuova'}).length;
      chip(tabs,s==='*'?'Tutte le sedi':SEDI[s],S.tab===s,function(){S.tab=s;render()},n)});
    var sf=$('stf');sf.textContent='';
    STATI.forEach(function(x){
      var n=S.rows.filter(function(r){return (S.tab==='*'||r.sede===S.tab)&&(x[0]==='*'||r.stato===x[0])}).length;
      chip(sf,x[1],S.st===x[0],function(){S.st=x[0];render()},n)});
    var nn=S.rows.filter(function(r){return r.stato==='nuova'}).length;
    document.title=(nn?'('+nn+') ':'')+'Archivio richieste · Farmacie Roma';
    var l=$('list');l.textContent='';var v=view();
    if(!v.length){l.appendChild(el('p','intro','Nessuna richiesta in questa vista.'));return}
    v.forEach(function(r){l.appendChild(card(r))})}
  function line(box,k,v){if(!v)return;var p=el('p','meta');var b=el('b',null,k+': ');p.appendChild(b);p.appendChild(document.createTextNode(v));box.appendChild(p);return p}
  function card(r){
    var c=el('article','rq');c.style.setProperty('--c','var('+COL[r.sede]+')');
    var h=el('div','rqh');h.appendChild(el('h3',null,r.servizio));
    h.appendChild(el('span','stt '+r.stato,(STATI.filter(function(x){return x[0]===r.stato})[0]||['',''])[1].replace(/e$/,'a')));
    c.appendChild(h);
    c.appendChild(el('p','meta','Farmacia '+SEDI[r.sede]+' · ricevuta il '+fmtT(r.created_at)));
    line(c,'Modalità',r.modalita);
    if(r.giorno||r.fascia)line(c,'Preferenza',[r.giorno?fmtD(r.giorno):'',r.fascia||''].filter(Boolean).join(' '));
    line(c,'Nome',r.nome);
    if(r.telefono){var p=el('p','meta');p.appendChild(el('b',null,'Telefono: '));c.appendChild(p);var a=el('a',null,r.telefono);a.href='tel:'+r.telefono.replace(/[^\d+]/g,'');p.appendChild(a);
      var w=el('a',null,' · WhatsApp');w.href='https://wa.me/'+waNum(r.telefono);w.target='_blank';w.rel='noopener';p.appendChild(w)}
    line(c,'Note',r.note);
    var ac=el('div','acts2');
    var A={nuova:[['in_carico','Prendi in carico'],['completata','Completata'],['annullata','Annulla']],
      in_carico:[['completata','Completata'],['annullata','Annulla'],['nuova','Rimetti tra le nuove']],
      completata:[['nuova','Riapri']],annullata:[['nuova','Riapri']]}[r.stato]||[];
    A.forEach(function(x){var b=el('button',x[0]==='completata'?'primary':null,x[1]);b.type='button';
      b.addEventListener('click',function(){b.disabled=true;setStato(r,x[0])});ac.appendChild(b)});
    c.appendChild(ac);return c}
  function setStato(r,s){
    var body={stato:s,gestita_il:(s==='nuova')?null:new Date().toISOString()};
    call('/rest/v1/fr_richieste?id=eq.'+encodeURIComponent(r.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(body)})
      .then(function(x){if(!x.ok)throw 0;r.stato=s;render()}).catch(function(){alert('Non sono riuscito ad aggiornare la richiesta. Riprova.');render()})}
  function csv(){
    var H=['Data','Sede','Servizio','Modalità','Giorno preferito','Fascia','Nome','Telefono','Note','Stato'];
    function q(v){v=v==null?'':String(v);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}
    var rows=view().map(function(r){return [fmtT(r.created_at),SEDI[r.sede],r.servizio,r.modalita,r.giorno,r.fascia,r.nome,r.telefono,r.note,r.stato].map(q).join(';')});
    var blob=new Blob(['\ufeff'+H.map(q).join(';')+'\r\n'+rows.join('\r\n')],{type:'text/csv;charset=utf-8'});
    var a=el('a');a.href=URL.createObjectURL(blob);a.download='richieste-'+(S.tab==='*'?'tutte':S.tab)+'.csv';document.body.appendChild(a);a.click();a.remove()}
  $('lf').addEventListener('submit',login);
  $('out').addEventListener('click',logout);
  $('csv').addEventListener('click',csv);
  $('q').addEventListener('input',function(){S.q=this.value;render()});
  try{var s=JSON.parse(sessionStorage.getItem('fr_sess')||'null');if(s){S.sess=s;start()}}catch(e){}
})();

/* Farmacie Emistra - script condiviso da tutte le pagine */

(function(){
  var go=document.getElementById('go');
  function upd(){
    if(!go)return;
    var s=document.querySelector('input[name=s]:checked').value;
    var f=document.querySelector('input[name=f]:checked').value.split('|');
    var d=document.getElementById('det').value.trim();
    var msg='Buongiorno Farmacia '+f[1]+', '+s.charAt(0).toLowerCase()+s.slice(1)+'.'+(d?' '+d:'');
    if(window.FRRicetta)msg+=window.FRRicetta.text('h');
    go.href='https://wa.me/'+f[0]+'?text='+encodeURIComponent(msg);
  }
  document.querySelectorAll('#richiesta input,#det').forEach(function(e){e.addEventListener('input',upd)});
  upd();
  var b=document.getElementById('fab'),m=document.getElementById('menu');
  b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded',false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
  document.addEventListener('click',function(e){if(!e.target.closest('.fab')){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
})();

(function(){
  var f=document.querySelectorAll('.filters button'),cards=document.querySelectorAll('.svc');
  f.forEach(function(b){b.addEventListener('click',function(){
    f.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    cards.forEach(function(c){c.hidden=b.dataset.f!=='*'&&c.dataset.cat!==b.dataset.f});});});
  var d=document.getElementById('dlg'),cur=null,go=document.getElementById('dgo');
  function $(i){return document.getElementById(i)}
  function upd(){
    if(!cur)return;
    var s=document.querySelector('input[name=df]:checked').value.split('|');
    var w='';
    if(cur.dataset.book==='1'){
      if($('dd').value){var p=$('dd').value.split('-');w=' per '+new Date(p[0],p[1]-1,p[2]).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})}
      var h=document.querySelector('input[name=dh]:checked').value; if(h)w+=(w?' ':' ')+h;
    }
    var n=$('dn').value.trim(),m=$('dm').value.trim();
    var mc=document.querySelector('input[name=dm2]:checked');var msg='Buongiorno Farmacia '+s[1]+', '+(n?'sono '+n+' e ':'')+'vorrei '+cur.dataset.phrase+(mc?' ('+mc.value.charAt(0).toLowerCase()+mc.value.slice(1)+')':'')+w+'.'+(m?' '+m:'');
    if(window.FRRicetta)msg+=window.FRRicetta.text();
    go.href='https://wa.me/'+s[0]+'?text='+encodeURIComponent(msg);
  }
  document.addEventListener('click',function(ev){var b=ev.target.closest('.svc-btn');if(!b)return;
    cur=b.closest('.svc');
    $('dt').textContent=cur.dataset.title;
    var dsc=cur.querySelector('h3+p');if($('ddesc'))$('ddesc').textContent=dsc?dsc.textContent:'';
    var book=cur.dataset.book==='1';
    $('when').hidden=!book;
    var mo=cur.dataset.modes?cur.dataset.modes.split('|'):[];
    $('modes').hidden=!mo.length;$('ml').textContent=cur.dataset.ml;
    $('mopts').innerHTML=mo.map(function(x,i){return '<input type="radio" name="dm2" id="mm'+i+'" value="'+x+'"'+(i?'':' checked')+'><label for="mm'+i+'">'+x+'</label>'}).join('');
    $('dhint').textContent=cur.dataset.title==='Invia una ricetta'?'Su WhatsApp puoi anche allegare la foto della ricetta direttamente nella chat.':(book?'La farmacia ti conferma giorno e orario su WhatsApp.':'');
    var t=new Date(),z=function(x){return String(x).padStart(2,'0')};
    $('dd').min=t.getFullYear()+'-'+z(t.getMonth()+1)+'-'+z(t.getDate());
    upd();d.showModal();});
  d.addEventListener('input',upd);
  $('dx').addEventListener('click',function(){d.close()});
  d.addEventListener('click',function(e){if(e.target===d)d.close()});
})();

(function(){
  var M=[[510,1200]],W={emiliani:[[510,1170]]},S={emiliani:[[510,780]],sanluca:[[510,780]],strampelli:[[510,780],[960,1170]]};
  var D=['domenica','lunedì','martedì','mercoledì','giovedì','venerdì','sabato'],K=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function f(m){return Math.floor(m/60)+':'+('0'+m%60).slice(-2)}
  function slots(k,d){return d===0?[]:d===6?S[k]:(W[k]||M)}
  function st(k){
    var q=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Rome',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()),o={};
    q.forEach(function(x){o[x.type]=x.value});
    var d=K.indexOf(o.weekday),t=+o.hour*60+ +o.minute,s=slots(k,d),i;
    for(i=0;i<s.length;i++){if(t>=s[i][0]&&t<s[i][1])return['o','Aperta ora · chiude alle '+f(s[i][1])];
}
    for(i=0;i<s.length;i++){if(t<s[i][0])return['c','Chiusa · riapre alle '+f(s[i][0])];
}
    for(i=1;i<=7;i++){var n=(d+i)%7,z=slots(k,n);if(z.length)return['c','Chiusa · riapre '+(i===1?'domani':D[n])+' alle '+f(z[0][0])];
}
    return['c','Chiusa'];
  }
  function run(){document.querySelectorAll('.st').forEach(function(e){var r=st(e.dataset.k);e.className='st '+r[0];e.textContent=r[1]})}
  run();setInterval(run,60000);
})();

(function(){
  var K=['emiliani','sanluca','strampelli'],NM=['Emiliani','San Luca','Strampelli'];
  var PL={emiliani:[41.9130723,12.7291002],sanluca:[41.8836752,12.5434803],strampelli:[41.8895619,12.5137454]};
  var geo=null,T={f:0,d:0},busy=false,asked=false;
  function hav(a,b){var r=Math.PI/180,x=Math.sin((b[0]-a[0])*r/2),y=Math.sin((b[1]-a[1])*r/2);
    return 12742*Math.asin(Math.sqrt(x*x+Math.cos(a[0]*r)*Math.cos(b[0]*r)*y*y))}
  function fmt(k){return k<1?Math.round(k*100)*10+' m':k.toLocaleString('it-IT',{maximumFractionDigits:1})+' km'}
  function msg(t){['geoS','dgeo'].forEach(function(i){var e=document.getElementById(i);if(e)e.innerHTML=t})}
  function apply(){
    var d={},n=null,m=1e9;
    K.forEach(function(k){d[k]=hav(geo,PL[k]);if(d[k]<m){m=d[k];n=k}});
    ['f','d'].forEach(function(g){
      K.forEach(function(k,i){var l=document.querySelector('label[for='+g+(i+1)+']');if(!l)return;
        var s=l.querySelector('small');if(!s){s=document.createElement('small');l.appendChild(s)}
        s.textContent=fmt(d[k])+(k===n?' · più vicina':'')});
      if(!T[g]){var r=document.getElementById(g+(K.indexOf(n)+1));
        if(r&&!r.checked){r.checked=true;r.dispatchEvent(new Event('input',{bubbles:true}))}}
    });
    document.querySelectorAll('.st[data-k]').forEach(function(e){
      var s=e.nextElementSibling;if(!s||!s.classList.contains('dist')){s=document.createElement('span');s.className='dist';e.parentNode.insertBefore(s,e.nextSibling)}
      s.textContent='A '+fmt(d[e.dataset.k])+' da te'});
    msg('Più vicina a te: <b>Farmacia '+NM[K.indexOf(n)]+'</b> ('+fmt(d[n])+' in linea d\'aria). La tua posizione resta sul tuo dispositivo.');
  }
  function locate(){
    if(geo){apply();return}
    if(busy)return;
    if(!navigator.geolocation){msg('La posizione non è disponibile su questo dispositivo: scegli tu la farmacia.');return}
    busy=true;msg('Cerco la farmacia più vicina…');
    navigator.geolocation.getCurrentPosition(function(p){busy=false;geo=[p.coords.latitude,p.coords.longitude];apply()},
      function(){busy=false;msg('Non riesco a leggere la tua posizione: scegli tu la farmacia.')},
      {timeout:10000,maximumAge:600000});
  }
  document.addEventListener('change',function(e){var n=e.target.name;if(n==='f')T.f=1;if(n==='df')T.d=1});
  ['geob','dgeob'].forEach(function(i){var b=document.getElementById(i);if(b)b.addEventListener('click',function(){asked=true;locate()})});
  var ri=document.getElementById('richiesta');
  if(ri)ri.addEventListener('change',function(){if(!asked){asked=true;locate()}});
  document.addEventListener('click',function(e){if(e.target.closest('.svc-btn')){T.d=0;asked=true;locate()}});
  if(navigator.permissions&&navigator.permissions.query)navigator.permissions.query({name:'geolocation'}).then(function(r){if(r.state==='granted'){asked=true;locate()}}).catch(function(){});
})();

(function(){
  var nav=document.getElementById('nav'),nb=document.getElementById('navbtn');
  if(nb)nb.addEventListener('click',function(){var o=nav.classList.toggle('open');nb.setAttribute('aria-expanded',o)});
  var ak=document.getElementById('askwa');
  if(ak)ak.addEventListener('click',function(){setTimeout(function(){document.getElementById('fab').click()},0)});
})();

(function(){
  var C=window.FR_CONFIG||{},U=(C.SUPABASE_URL||'').replace(/\/$/,''),K=C.SUPABASE_ANON_KEY||'';
  var SEDE={'Emiliani':'emiliani','San Luca':'sanluca','Strampelli':'strampelli'},last='',lt=0;
  function v(i,n){var e=document.getElementById(i);return e?e.value.trim().slice(0,n):''}
  function post(p){
    return fetch(U+'/rest/v1/fr_richieste',{method:'POST',
      headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify(p)});
  }
  function send(p){
    var s=JSON.stringify(p);if(s===last&&Date.now()-lt<60000)return;last=s;lt=Date.now();
    try{post(p).catch(function(){})}catch(e){}
  }
  function dataFor(dialog){
    if(dialog){
      var f=document.querySelector('input[name=df]:checked'),mo=document.querySelector('input[name=dm2]:checked'),
          fs=document.querySelector('input[name=dh]:checked'),wh=document.getElementById('when').hidden;
      return {sede:SEDE[f.value.split('|')[1]],servizio:document.getElementById('dt').textContent.slice(0,120),
        modalita:mo?mo.value.slice(0,60):null,giorno:(!wh&&v('dd',10))||null,fascia:(!wh&&fs&&fs.value)||null,
        nome:v('dn',100)||null,telefono:v('dp',30)||null,note:v('dm',500)||null};
    }
    var f2=document.querySelector('input[name=f]:checked'),s2=document.querySelector('input[name=s]:checked'),
        l=document.querySelector('label[for='+s2.id+']');
    return {sede:SEDE[f2.value.split('|')[1]],servizio:(l?l.textContent:'Richiesta').slice(0,120),note:v('det',500)||null};
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('#dgo,#go');if(!a)return;
    if(v('website',50))return;
    send(dataFor(a.id==='dgo'));
  });

  /* Pulsanti "Invia via Email": spediscono direttamente la richiesta tramite Web3Forms */
  /* Una chiave Web3Forms per farmacia: ogni richiesta arriva solo alla farmacia scelta.
     Strampelli usa per ora la chiave principale, finche non avra la sua. */
  var W3KEYS={'Emiliani':'2832345b-2b05-4606-bcc3-619339f7ac5f','San Luca':'4079be4c-f054-47e8-8acb-b3bd7fd30306','Strampelli':'1d95b3a9-1510-4a1e-b50b-b0f500b0e2a5'};
  var EM={'Emiliani':'staffemiliani@gmail.com','San Luca':'staff.sanluca@gmail.com','Strampelli':'staff.strampelli@gmail.com'};
  function mailBtn(btnId,statusId,waId,radio,getServ,getContact){
    var b=document.getElementById(btnId),st=document.getElementById(statusId),wa=document.getElementById(waId);
    if(!b||!wa)return;
    function farm(){var f=document.querySelector('input[name='+radio+']:checked');return f?f.value.split('|')[1]:''}
    function hint(){if(st&&!b.disabled&&!st.classList.contains('ok')&&!st.classList.contains('err'))st.textContent='Arriva alla Farmacia '+farm()+'. Oppure scrivi a: '+(EM[farm()]||'')}
    ['input','change','click'].forEach(function(ev){document.addEventListener(ev,function(e){if(e.target!==b){if(st&&ev!=='click'){st.classList.remove('ok','err')}setTimeout(hint,0)}})});
    hint();
    function show(cls,t){st.className='note mailto-alt'+(cls?' '+cls:'');st.textContent=t;try{st.scrollIntoView({block:'nearest'})}catch(e){st.scrollIntoView(false)}}
    b.addEventListener('click',function(){
      if(v('website',50))return;
      if(window.FRRicetta){var rxe=window.FRRicetta.check(btnId==='dmail'?'':'h');if(rxe){show('err',rxe);return}}
      var c=getContact();
      if(!c.tel&&!c.email){show('err','Inserisci il telefono o l\'email, così la farmacia può risponderti.');var fi=document.getElementById(btnId==='dmail'?'dp':'hc');if(fi){fi.style.borderColor='#c0392b';fi.addEventListener('input',function(){fi.style.borderColor=''},{once:true})}return}
      if(c.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)){show('err','L\'email non sembra corretta: controllala.');return}
      var txt='';try{txt=new URL(wa.href).searchParams.get('text')||''}catch(e){}
      var fa=farm(),serv=getServ();
      var body={access_key:W3KEYS[fa]||W3KEYS['Strampelli'],subject:'Richiesta dal sito - Farmacia '+fa+' - '+serv,from_name:'Sito Farmacie Emistra',
        'Farmacia':fa,'Email farmacia':EM[fa]||'','Servizio':serv,'Messaggio':txt,'Telefono cliente':c.tel||'-','Email cliente':c.email||'-'};
      if(c.email)body.replyto=c.email;
      b.disabled=true;show('','Invio in corso…');
      fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(body)})
        .then(function(r){return r.json()}).then(function(j){
          if(!j||!j.success)throw 0;
          show('ok','✓ Richiesta inviata alla Farmacia '+fa+'. Ti ricontatteremo presto.');
        }).catch(function(){
          show('err','Invio non riuscito. Riprova, oppure scrivi su WhatsApp o a '+(EM[fa]||''));
        }).then(function(){b.disabled=false});
    });
  }
  mailBtn('dmail','dmailalt','dgo','df',function(){return document.getElementById('dt').textContent},function(){return {tel:v('dp',30),email:v('de',100)}});
  mailBtn('gomail','gomailalt','go','f',function(){var s2=document.querySelector('input[name=s]:checked'),l=s2&&document.querySelector('label[for='+s2.id+']');return l?l.textContent:'Richiesta'},function(){var h=v('hc',100);return h.indexOf('@')>-1?{tel:'',email:h}:{tel:h,email:''}});
})();

(function(){
  var g=window.FR_GOOGLE;if(!g)return;
  document.querySelectorAll('[data-gr]').forEach(function(e){
    var k=e.getAttribute('data-gr')||'emiliani',d=(g.farmacie&&g.farmacie[k])||(k==='emiliani'&&g.voto?g:null);if(!d)return;
    e.textContent='★ '+Number(d.voto).toFixed(1).replace('.',',')+' su Google ('+d.recensioni+' recensioni)';e.title='Dato di '+g.aggiornato});
})();

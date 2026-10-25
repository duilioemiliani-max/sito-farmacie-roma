/* Preparazioni galeniche: il cliente carica foto o PDF della ricetta, che vengono salvati
   nella cartella privata di Supabase (fr_galeniche) e compaiono nell'Archivio richieste della farmacia scelta.
   Alla farmacia arriva anche un'email di avviso (senza allegato: Web3Forms e Formspree non li accettano). */
(function(){
  var form=document.getElementById('gal');if(!form)return;
  var C=window.FR_CONFIG||{},U=(C.SUPABASE_URL||'').replace(/\/$/,''),K=C.SUPABASE_ANON_KEY||'';
  var SEDE={'Emiliani':'emiliani','San Luca':'sanluca','Strampelli':'strampelli'};
  var EXT={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/heic':'heic','image/heif':'heic','application/pdf':'pdf'};
  var MAXN=5,MAXB=10*1024*1024,files=[],busy=false;
  function $(i){return document.getElementById(i)}
  function v(i,n){return $(i).value.trim().slice(0,n)}
  function farm(){return document.querySelector('input[name=gf]:checked').value.split('|')}
  function tipo(){return document.querySelector('input[name=gt]:checked').value}
  var st=$('gst');
  function show(cls,t){st.className='note mailto-alt'+(cls?' '+cls:'');st.textContent=t;try{st.scrollIntoView({block:'nearest'})}catch(e){}}
  function upd(){
    var f=farm();
    var n=v('gn',100),m=v('gm',400);
    $('gwa').href='https://wa.me/'+f[0]+'?text='+encodeURIComponent('Buongiorno Farmacia '+f[1]+', '+(n?'sono '+n+' e ':'')+'vorrei far preparare una preparazione galenica ('+(tipo()==='Veterinaria'?'veterinaria':'uso umano')+'). Vi allego la ricetta.'+(m?' '+m:''));
    $('gtnote').textContent=tipo()==='Veterinaria'?'Ricetta del veterinario per il tuo animale.':'Ricetta del medico per una persona.';
    if(!busy&&!st.classList.contains('ok')&&!st.classList.contains('err'))st.textContent='Arriva alla Farmacia '+f[1]+'.';
  }
  form.addEventListener('change',function(){if(!busy)st.classList.remove('ok','err');upd()});
  form.addEventListener('input',function(){if(!busy)st.classList.remove('err');upd()});
  /* Invio su WhatsApp: la richiesta viene registrata nell'archivio (senza file, che il cliente allega nella chat) */
  $('gwa').addEventListener('click',function(){
    if(v('gweb',50)||!U||!K)return;var f=farm();
    try{fetch(U+'/rest/v1/fr_richieste',{method:'POST',headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},
      body:JSON.stringify({sede:SEDE[f[1]],servizio:'Preparazione galenica · '+(tipo()==='Veterinaria'?'Veterinaria':'Uso umano')+' (WhatsApp)',
        nome:v('gn',100)||null,telefono:v('gp',30)||null,note:v('gm',400)||null})}).catch(function(){})}catch(e){}
  });
  upd();

  function typeOf(f){if(EXT[f.type])return f.type;if(/\.pdf$/i.test(f.name))return 'application/pdf';if(/\.hei[cf]$/i.test(f.name))return 'image/heic';return ''}
  function size(b){return b<1048576?Math.max(1,Math.round(b/1024))+' KB':(b/1048576).toFixed(1).replace('.',',')+' MB'}
  /* Le foto grandi vengono ridotte (lato lungo 2400 px) per caricarle più in fretta; se il browser non le sa leggere restano com'erano */
  function shrink(f){
    var t=typeOf(f);if(!/^image\/(jpeg|png|webp)$/.test(t))return Promise.resolve({blob:f,type:t});
    return new Promise(function(ok){
      var url=URL.createObjectURL(f),im=new Image();
      im.onload=function(){
        var s=Math.min(1,2400/Math.max(im.naturalWidth,im.naturalHeight)),cv=document.createElement('canvas');
        cv.width=Math.round(im.naturalWidth*s);cv.height=Math.round(im.naturalHeight*s);
        cv.getContext('2d').drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(url);
        cv.toBlob(function(b){ok(b&&b.size<f.size?{blob:b,type:'image/jpeg'}:{blob:f,type:t})},'image/jpeg',.85)};
      im.onerror=function(){URL.revokeObjectURL(url);ok({blob:f,type:t})};
      im.src=url})}
  function list(){
    var ul=$('gfiles');ul.textContent='';
    files.forEach(function(f,i){
      var li=document.createElement('li');
      if(typeOf(f)==='application/pdf'){var ic=document.createElement('span');ic.className='gico';ic.textContent='PDF';li.appendChild(ic)}
      else{var im=document.createElement('img');im.alt='';im.src=URL.createObjectURL(f);im.onerror=function(){im.replaceWith(Object.assign(document.createElement('span'),{className:'gico',textContent:'FOTO'}))};li.appendChild(im)}
      var n=document.createElement('span');n.className='gname';n.textContent=f.name+' · '+size(f.size);li.appendChild(n);
      var x=document.createElement('button');x.type='button';x.className='gx';x.textContent='Togli';x.setAttribute('aria-label','Togli '+f.name);
      x.addEventListener('click',function(){files.splice(i,1);list()});li.appendChild(x);ul.appendChild(li)});
    document.querySelector('label[for=gfile]').textContent=files.length?'➕ Aggiungi un altro file':'📄 Scegli foto o PDF';
  }
  $('gfile').addEventListener('change',function(){
    var msg='';
    Array.prototype.forEach.call(this.files||[],function(f){
      if(!typeOf(f)){msg='"'+f.name+'" non è una foto o un PDF.';return}
      if(f.size>MAXB){msg='"'+f.name+'" è troppo grande (massimo 10 MB).';return}
      if(files.length>=MAXN){msg='Puoi caricare al massimo '+MAXN+' file.';return}
      files.push(f)});
    this.value='';list();
    if(msg)show('err',msg);else{st.classList.remove('err');upd()}
  });

  function uid(){if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();
    var b=crypto.getRandomValues(new Uint8Array(16)),h=[];b[6]=b[6]&15|64;b[8]=b[8]&63|128;
    for(var i=0;i<16;i++)h.push((b[i]+256).toString(16).slice(1));h=h.join('');
    return h.slice(0,8)+'-'+h.slice(8,12)+'-'+h.slice(12,16)+'-'+h.slice(16,20)+'-'+h.slice(20)}
  function upload(sede,f){
    return shrink(f).then(function(x){
      var path=sede+'/'+uid()+'.'+EXT[x.type];
      return fetch(U+'/storage/v1/object/fr_galeniche/'+path,{method:'POST',
        headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':x.type,'x-upsert':'false'},body:x.blob})
        .then(function(r){if(!r.ok)throw 0;return path})})}

  form.addEventListener('submit',function(e){
    e.preventDefault();if(busy)return;
    if(v('gweb',50))return;
    var f=farm(),fa=f[1],sede=SEDE[fa],tel=v('gp',30),em=v('ge',100),nome=v('gn',100),note=v('gm',400);
    if(!files.length){show('err','Carica almeno una foto o un PDF della ricetta.');return}
    if(!tel&&!em){show('err','Inserisci il telefono o l\'email, così la farmacia può ricontattarti.');$('gp').focus();return}
    if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){show('err','L\'email non sembra corretta: controllala.');$('ge').focus();return}
    if(!U||!K){show('err','Il caricamento non è disponibile in questo momento: mandaci la ricetta su WhatsApp.');return}
    var serv='Preparazione galenica · '+(tipo()==='Veterinaria'?'Veterinaria':'Uso umano'),btn=$('gsend');
    busy=true;btn.disabled=true;show('','Caricamento in corso… non chiudere la pagina.');
    Promise.all(files.map(function(x){return upload(sede,x)})).then(function(paths){
      return fetch(U+'/rest/v1/fr_richieste',{method:'POST',
        headers:{apikey:K,Authorization:'Bearer '+K,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({sede:sede,servizio:serv,nome:nome||null,telefono:tel||null,
          note:([em?'Email: '+em:'',note].filter(Boolean).join(' · ')||null),allegati:paths})})
        .then(function(r){if(!r.ok)throw 0;return paths})
    }).then(function(paths){
      /* Avviso email alla farmacia: se non parte, la ricetta è comunque nell'archivio */
      if(window.FRMail)window.FRMail.send(fa,serv,{'Messaggio':'Nuova ricetta per una preparazione galenica caricata dal sito ('+paths.length+' file). Aprila dall\'Archivio richieste: '+new URL('archivio.html',location.href).href,
        'Nome cliente':nome||'-','Telefono cliente':tel||'-','Email cliente':em||'-','Note':note||'-'},em).catch(function(){});
      files=[];list();['gn','gp','ge','gm'].forEach(function(i){$(i).value=''});
      show('ok','✓ Ricetta inviata alla Farmacia '+fa+'. Ti ricontatteremo presto per tempi e costo della preparazione.');
    }).catch(function(){
      show('err','Invio non riuscito. Riprova tra poco, oppure mandaci la ricetta su WhatsApp o a '+(window.FRMail?window.FRMail.email(fa):'')+'.');
    }).then(function(){busy=false;btn.disabled=false});
  });
})();

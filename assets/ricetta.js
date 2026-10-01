/* Lettura della ricetta elettronica (promemoria) sul dispositivo del cliente.
   Il file NON viene caricato da nessuna parte: si estraggono solo codice NRE e codice fiscale. */
(function(){
  var BASE=(document.currentScript&&document.currentScript.src||'').replace(/ricetta\.js.*$/,'');
  function load(src){return new Promise(function(ok,ko){var s=document.createElement('script');s.src=BASE+src;s.onload=ok;s.onerror=ko;document.head.appendChild(s)})}
  var pdfReady=null,zxReady=null;
  function pdfLib(){if(!pdfReady)pdfReady=load('vendor/pdf.min.js').then(function(){window.pdfjsLib.GlobalWorkerOptions.workerSrc=BASE+'vendor/pdf.worker.min.js';return window.pdfjsLib});return pdfReady}
  function zxLib(){if(!zxReady)zxReady=load('vendor/zxing.min.js').then(function(){return window.ZXing});return zxReady}

  /* ---- controlli sui codici ---- */
  var ODD={0:1,1:0,2:5,3:7,4:9,5:13,6:15,7:17,8:19,9:21,A:1,B:0,C:5,D:7,E:9,F:13,G:15,H:17,I:19,J:21,K:2,L:4,M:18,N:20,O:11,P:3,Q:6,R:8,S:12,T:14,U:16,V:10,W:22,X:25,Y:24,Z:23};
  function cfOk(cf){
    cf=(cf||'').toUpperCase();
    if(!/^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(cf))return false;
    var s=0;for(var i=0;i<15;i++){var c=cf[i];s+= i%2===0?ODD[c]:(/[0-9]/.test(c)?+c:c.charCodeAt(0)-65)}
    return String.fromCharCode(65+s%26)===cf[15];
  }
  function nreOk(n){return /^[0-9]{3}[0-9A-Z]{2}[0-9]{10}$/.test((n||'').toUpperCase())}

  var TOL={'0':'O','1':'I','5':'S','8':'B','2':'Z','6':'G','4':'A'},TOD={O:'0',D:'0',Q:'0',U:'0',I:'1',L:'1',J:'1',Z:'2',S:'5',G:'6',E:'6',B:'8',T:'7',A:'4'};
  var DIG=[6,7,9,10,12,13,14];
  function cfFix(w){ /* prova a correggere lettere/cifre scambiate dall'OCR, accetta solo se il controllo torna */
    if(cfOk(w))return w;var a=w.split('');
    for(var i=0;i<16;i++){if(DIG.indexOf(i)>-1){if(TOD[a[i]])a[i]=TOD[a[i]]}else if(TOL[a[i]])a[i]=TOL[a[i]]}
    var f=a.join('');return cfOk(f)?f:'';
  }
  /* ---- estrazione dai testi (testo del PDF o contenuto dei codici a barre) ---- */
  function parse(texts){
    var res={nre:'',cf:''},parts1=[],parts2=[],cfs=[],fuzzy=[];
    texts.forEach(function(t){
      var u=String(t).toUpperCase().replace(/€/g,'E').replace(/\*/g,' ');
      var m=u.match(/(?:^|[^0-9A-Z])([0-9]{3}[0-9A-Z]{2})[^0-9A-Z]{1,8}([0-9]{10})(?![0-9])/)||u.match(/(?:^|[^0-9A-Z])([0-9]{3}[0-9A-Z]{2})([0-9]{10})(?![0-9])/);
      if(m&&!res.nre)res.nre=m[1]+m[2];
      var tok=u.trim();
      if(/^[0-9]{3}[0-9A-Z]{2}$/.test(tok))parts1.push(tok);
      if(/^[0-9]{10}$/.test(tok))parts2.push(tok);
      if(/^[0-9]{3}[0-9A-Z]{2}[0-9]{10}$/.test(tok)&&!res.nre)res.nre=tok;
      var re=/[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]/g,c;
      u.split(/\n/).forEach(function(line){
        var comp='',pos=[];for(var i=0;i<line.length;i++){if(/[0-9A-Z]/.test(line[i])){comp+=line[i];pos.push(i)}}
        for(var j=0;j+16<=comp.length;j++){
          var p0=pos[j],p1=pos[j+15];
          if(p0>0&&/[0-9A-Z]/.test(line[p0-1]))continue;                    /* deve iniziare come parola a sé */
          if(p1+1<line.length&&/[0-9A-Z]/.test(line[p1+1]))continue;        /* e finire come parola a sé */
          var span=line.slice(p0,p1+1);if((span.match(/[^0-9A-Z]+/g)||[]).length>2||span.length>20)continue;
          var w=comp.substr(j,16),f=cfFix(w);if(!f)continue;
          var subs=0;for(var k=0;k<16;k++)if(w[k]!==f[k])subs++;if(subs>3)continue;
          if(/MEDICO/.test(line.slice(Math.max(0,p0-45),p0)))continue;
          if(fuzzy.indexOf(f)<0)fuzzy.push(f);
        }
      });
      while((c=re.exec(u))){
        var before=u.slice(Math.max(0,c.index-45),c.index);
        if(/MEDICO/.test(before))continue;           // esclude il codice fiscale del medico
        if(cfOk(c[0]))cfs.push(c[0]);
      }
    });
    if(!res.nre&&parts1.length&&parts2.length)res.nre=parts1[0]+parts2[0];
    res.cf=cfs[0]||fuzzy[0]||'';
    return res;
  }

  /* ---- lettura dei codici a barre da un'immagine ---- */
  function decodeCanvas(cv){
    var found=[];
    var native=('BarcodeDetector' in window)?new window.BarcodeDetector({formats:['code_39','code_128']}).detect(cv).then(function(r){r.forEach(function(b){found.push(b.rawValue)})}).catch(function(){}):Promise.resolve();
    return native.then(function(){
      var p=parse(found);if(p.nre&&p.cf)return found;
      return zxLib().then(function(Z){
        var hints=new Map();hints.set(Z.DecodeHintType.POSSIBLE_FORMATS,[Z.BarcodeFormat.CODE_39,Z.BarcodeFormat.CODE_128]);hints.set(Z.DecodeHintType.TRY_HARDER,true);
        var reader=new Z.MultiFormatReader();reader.setHints(hints);
        var t0=Date.now(),angles=[0,-2,2,-4,4,-6,6,-8,8,-11,11];
        function tile(src,x0,y,w,h){
          var sc=w<900?Math.min(2.5,900/w):1,c=document.createElement('canvas');c.width=Math.round(w*sc);c.height=Math.round(h*sc);
          var x=c.getContext('2d',{willReadFrequently:true});x.imageSmoothingEnabled=true;x.drawImage(src,x0,y,w,h,0,0,c.width,c.height);
          var img=x.getImageData(0,0,c.width,c.height),lum=new Z.RGBLuminanceSource(toLum(img),c.width,c.height);
          var bins=[new Z.HybridBinarizer(lum),new Z.GlobalHistogramBinarizer(lum)];
          for(var i=0;i<bins.length;i++){try{var r=reader.decode(new Z.BinaryBitmap(bins[i]));if(r){var t=r.getText();if(found.indexOf(t)<0)found.push(t);return}}catch(e){}}
        }
        for(var a=0;a<angles.length&&Date.now()-t0<7000;a++){
          var src=angles[a]?rotate(cv,angles[a]):cv,W=src.width,H=src.height;
          var cols=[[0,1],[0,.5],[.25,.75],[.5,1],[0,.35],[.3,.65],[.6,1]],bh=Math.max(50,Math.round(H/16));
          for(var y=0;y<H*.5;y+=Math.round(bh/2)){
            for(var k=0;k<cols.length;k++){var x0=Math.round(W*cols[k][0]);tile(src,x0,y,Math.round(W*(cols[k][1]-cols[k][0])),Math.min(bh,H-y))}
            var p0=parse(found);if(p0.nre&&p0.cf)break;
          }
          p=parse(found);if(p.nre&&p.cf)break;
        }
        return found;
      });
    });
  }
  function toLum(img){var d=img.data,o=new Uint8ClampedArray(img.width*img.height);for(var i=0,j=0;i<d.length;i+=4,j++)o[j]=(d[i]*299+d[i+1]*587+d[i+2]*114)/1000;return o}
  function rotate(cv,deg){var r=deg*Math.PI/180,c=document.createElement('canvas');c.width=cv.width;c.height=cv.height;var x=c.getContext('2d',{willReadFrequently:true});x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.translate(c.width/2,c.height/2);x.rotate(r);x.drawImage(cv,-cv.width/2,-cv.height/2);return c}
  function fileToCanvas(file){
    return new Promise(function(ok,ko){
      var url=URL.createObjectURL(file),im=new Image();
      im.onload=function(){var max=2600,s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);var x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(url);ok(c)};
      im.onerror=function(){URL.revokeObjectURL(url);ko(new Error('immagine'))};im.src=url;
    });
  }
  var tessReady=null,onSlow=null;
  function ocr(cv){
    if(!tessReady)tessReady=load('vendor/tess/tesseract.min.js').then(function(){
      return window.Tesseract.createWorker('eng',1,{workerPath:BASE+'vendor/tess/worker.min.js',corePath:BASE+'vendor/tess/',langPath:BASE+'vendor/tess/',gzip:true,logger:function(){}});
    });
    return tessReady.then(function(w){
      var h=Math.round(cv.height*.42),sc=Math.min(2,2200/cv.width),c=document.createElement('canvas');   /* i codici sono nella parte alta del promemoria */
      c.width=Math.round(cv.width*sc);c.height=Math.round(h*sc);var x=c.getContext('2d');x.filter='grayscale(1) contrast(1.4)';x.drawImage(cv,0,0,cv.width,h,0,0,c.width,c.height);
      return w.recognize(c).then(function(r){return r.data.text||''});
    });
  }
  function readPdf(file){
    return Promise.all([pdfLib(),file.arrayBuffer()]).then(function(a){
      return a[0].getDocument({data:a[1]}).promise.then(function(doc){
        var page1;
        return doc.getPage(1).then(function(pg){page1=pg;return pg.getTextContent()}).then(function(tc){
          var txt=tc.items.map(function(i){return i.str}).join(' ');
          var p=parse([txt]);
          if(p.nre&&p.cf){p.via='pdf';return p}
          var vp=page1.getViewport({scale:2}),c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;  // PDF scansionato: lo leggo come immagine
          return page1.render({canvasContext:c.getContext('2d',{willReadFrequently:true}),viewport:vp}).promise.then(function(){return decodeCanvas(c)}).then(function(f){var q=parse(f.concat([txt]));q.via='pdf-immagine';return q});
        });
      });
    });
  }
  function read(file){
    if(!file)return Promise.reject(new Error('nessun file'));
    if(file.type==='application/pdf'||/\.pdf$/i.test(file.name))return readPdf(file);
    return fileToCanvas(file).then(function(cv){
      return decodeCanvas(cv).then(function(f){
        var p=parse(f);p.via='foto';if(p.nre&&p.cf)return p;
        if(typeof onSlow==='function')onSlow();
        return ocr(cv).then(function(txt){var q=parse(f.concat([txt]));q.nre=q.nre||p.nre;q.cf=q.cf||p.cf;q.via='testo';return q}).catch(function(){return p});
      });
    });
  }

  /* ---- interfaccia nel riquadro del servizio "Invia una ricetta" ---- */
  function $(i){return document.getElementById(i)}
  function isRicetta(){var rx=$('rx');return rx&&!rx.hidden}
  function vals(){return {nre:($('rxnre')&&$('rxnre').value||'').toUpperCase().replace(/\s+/g,''),cf:($('rxcf')&&$('rxcf').value||'').toUpperCase().replace(/\s+/g,'')}}
  function changed(){var d=$('dlg');if(d)d.dispatchEvent(new Event('input',{bubbles:true}))}
  function st(t,cls){var s=$('rxst');if(!s)return;s.textContent=t;s.className='note rxst'+(cls?' '+cls:'')}
  function init(){
    var f=$('rxfile');if(!f)return;
    document.addEventListener('click',function(e){
      if(!e.target.closest('.svc-btn'))return;
      setTimeout(function(){var on=$('dt')&&$('dt').textContent.trim()==='Invia una ricetta';$('rx').hidden=!on;if(on){f.value='';$('rxnre').value='';$('rxcf').value='';st('')}changed()},0);
    });
    f.addEventListener('change',function(){
      var file=f.files&&f.files[0];if(!file)return;
      st('Sto leggendo la ricetta…');onSlow=function(){st('Sto leggendo il testo della ricetta, ci vuole qualche secondo in più…')};
      read(file).then(function(p){
        if(p.nre)$('rxnre').value=p.nre;if(p.cf)$('rxcf').value=p.cf;changed();
        if(p.nre&&p.cf)st(p.via==='testo'?'✓ Codici trovati. Confrontali con la ricetta, soprattutto le cifre del codice NRE.':'✓ Codici trovati. Controlla che siano giusti prima di inviare.','ok');
        else if(p.nre||p.cf)st('Ho trovato solo '+(p.nre?'il codice NRE':'il codice fiscale')+'. Inserisci a mano quello mancante.','err');
        else st('Non sono riuscito a leggere i codici. Riprova con una foto più dritta e luminosa, oppure scrivili a mano.','err');
      }).catch(function(){st('Non sono riuscito ad aprire il file. Riprova, oppure scrivi i codici a mano.','err')});
    });
    ['rxnre','rxcf'].forEach(function(i){$(i).addEventListener('input',function(){this.value=this.value.toUpperCase()})});
  }
  window.FRRicetta={
    read:read,parse:parse,cfOk:cfOk,nreOk:nreOk,
    text:function(){if(!isRicetta())return '';var v=vals();return (v.nre?' Codice NRE: '+v.nre+'.':'')+(v.cf?' Codice fiscale: '+v.cf+'.':'')},
    check:function(){if(!isRicetta())return '';var v=vals();
      if(!v.nre)return 'Carica la ricetta o scrivi il codice NRE. Se la ricetta è cartacea senza NRE, mandane la foto su WhatsApp.';
      if(!nreOk(v.nre))return 'Il codice NRE non sembra corretto: deve avere 15 caratteri (es. 1200A1234567890).';
      if(v.cf&&!cfOk(v.cf))return 'Il codice fiscale non sembra corretto: controllalo.';
      if(!v.cf)return 'Inserisci il codice fiscale del paziente.';
      return ''}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

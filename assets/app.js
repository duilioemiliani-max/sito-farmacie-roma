/* Farmacie Roma - script condiviso */

(function(){
  var go=document.getElementById('go');
  if(!go)return;
  function upd(){
    var s=document.querySelector('input[name=s]:checked').value;
    var f=document.querySelector('input[name=f]:checked').value.split('|');
    var d=document.getElementById('det').value.trim();
    var msg='Buongiorno Farmacia '+f[1]+', '+s.charAt(0).toLowerCase()+s.slice(1)+'.'+(d?' '+d:'');
    go.href='https://wa.me/'+f[0]+'?text='+encodeURIComponent(msg);
  }
  document.querySelectorAll('#richiesta input,#det').forEach(function(e){e.addEventListener('input',upd)});
  upd();
})();

(function(){
  var dlg=document.getElementById('dlg'),cur=null,dgo=document.getElementById('dgo'),dgo2=document.getElementById('dgo2');
  function $(i){return document.getElementById(i)}
  function v(i,n){var e=$(i);return e?e.value.trim().slice(0,n):''}
  function upd(){
    if(!cur)return;
    var s=document.querySelector('input[name=df]:checked').value.split('|');
    var w='';
    if(cur.dataset.book==='1'){
      if($('dd').value){var p=$('dd').value.split('-');w=' per '+new Date(p[0],p[1]-1,p[2]).toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})}
      var h=document.querySelector('input[name=dh]:checked').value; if(h)w+=(w?' ':' ')+h;
    }
    var n=$('dn').value.trim(),m=$('dm').value.trim();
    var mc=document.querySelector('input[name=dm2]:checked');
    var msg='Buongiorno Farmacia '+s[1]+', '+(n?'sono '+n+' e ':'')+'vorrei '+cur.dataset.phrase+(mc?' ('+mc.value.charAt(0).toLowerCase()+mc.value.slice(1)+')':'')+w+'.'+(m?' '+m:'');
    dgo.href='https://wa.me/'+s[0]+'?text='+encodeURIComponent(msg);
  }
  document.addEventListener('click',function(ev){
    var b=ev.target.closest('.svc-btn');
    if(!b)return;
    cur=b.closest('.svc');
    $('dt').textContent=cur.dataset.title;
    var book=cur.dataset.book==='1';
    $('when').hidden=!book;
    var mo=cur.dataset.modes?cur.dataset.modes.split('|'):[];
    $('modes').hidden=!mo.length;
    $('ml').textContent=cur.dataset.ml;
    $('mopts').innerHTML=mo.map(function(x,i){return '<input type="radio" name="dm2" id="mm'+i+'" value="'+x+'"'+(i?'':' checked')+'><label for="mm'+i+'">'+x+'</label>'}).join('');
    $('dhint').textContent=cur.dataset.title==='Invia una ricetta'?'Allega la foto della ricetta direttamente nella chat di WhatsApp.':(book?'La farmacia ti conferma giorno e orario su WhatsApp.':'');
    var t=new Date(),z=function(x){return String(x).padStart(2,'0')};
    $('dd').min=t.getFullYear()+'-'+z(t.getMonth()+1)+'-'+z(t.getDate());
    upd();
    dlg.showModal();
  });
  dlg.addEventListener('input',upd);
  $('dx').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  
  dgo.addEventListener('click',function(e){
    e.preventDefault();
    upd();
  });
  
  dgo2.addEventListener('click',function(e){
    e.preventDefault();
    var s=document.querySelector('input[name=df]:checked').value.split('|');
    var n=$('dn').value.trim(),m=$('dm').value.trim();
    var mc=document.querySelector('input[name=dm2]:checked');
    var msg='Richiesta: '+cur.dataset.phrase+(mc?' ('+mc.value.charAt(0).toLowerCase()+mc.value.slice(1)+')':'')+(n?'\nNome: '+n:'')+'Telefono: '+v('dp',30)+'\nEmail: '+v('de',100)+(m?'\nNote: '+m:'');
    var subject='Richiesta da sito - '+cur.dataset.title;
    var emailMap={'Emiliani':'staffemiliani@gmail.com','San Luca':'staff.sanluca@gmail.com','Strampelli':'staff.strampelli@gmail.com'};
    var farmacia=s[1];
    var mailto='mailto:'+emailMap[farmacia]+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(msg);
    window.location.href=mailto;
  });
})();

(function(){
  var nav=document.getElementById('nav'),nb=document.getElementById('navbtn');
  if(nb)nb.addEventListener('click',function(){var o=nav.classList.toggle('open');nb.setAttribute('aria-expanded',o)});
})();

(function(){
  var b=document.getElementById('fab'),m=document.getElementById('menu');
  if(!b||!m)return;
  b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded',false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
  document.addEventListener('click',function(e){if(!e.target.closest('.fab')){m.classList.remove('open');b.setAttribute('aria-expanded',false)}});
})();

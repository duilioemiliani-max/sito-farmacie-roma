/* Farmacie Roma - script condiviso da tutte le pagine */

(function(){
  var go=document.getElementById('go');
  function upd(){
    if(!go)return;
    var s=document.querySelector('input[name=s]:checked').value;
    var f=document.querySelector('input[name=f]:checked').value.split('|');
    var d=document.getElementById('det').value.trim();
    var msg='Buongiorno Farmacia '+f[1]+', '+s.charAt(0).toLowerCase()+s.slice(1)+'.'+(d?' '+d:'');
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
    var mc=document.querySelector('input[name=dm2]:checked');var msg='Buongiorno Farmacia '+s[1]+', '+(n?'sono '+n+' e ':'')+'vorrei '+cur.dataset.phras

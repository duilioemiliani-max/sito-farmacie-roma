/* Farmacie Roma */

(function(){
  var dlg=document.getElementById('dlg');
  if(!dlg)return;
  
  var cur=null;
  
  function $(id){return document.getElementById(id)}
  function v(id,n){var e=$(id);return e?e.value.trim().slice(0,n):''}
  
  function updateDialog(){
    if(!cur)return;
    var f=document.querySelector('input[name=df]:checked').value.split('|');
    var n=v('dn',100),m=v('dm',500);
    var phrase=cur.dataset.phrase||'';
    var msg='Buongiorno Farmacia '+f[1]+', vorrei '+phrase+(n?' Nome: '+n:'')+(m?' Note: '+m:'');
    var url='https://wa.me/'+f[0]+'?text='+encodeURIComponent(msg);
    document.getElementById('dgo').href=url;
  }
  
  document.addEventListener('click',function(e){
    var btn=e.target.closest('.svc-btn');
    if(!btn)return;
    
    cur=btn.closest('.svc');
    $('dt').textContent=cur.dataset.title||'';
    
    var when=$('when');
    if(when)when.hidden=(cur.dataset.book!=='1');
    
    var dd=$('dd');
    if(dd){
      var t=new Date(),z=function(x){return String(x).padStart(2,'0')};
      dd.min=t.getFullYear()+'-'+z(t.getMonth()+1)+'-'+z(t.getDate());
    }
    
    updateDialog();
    dlg.showModal();
  });
  
  dlg.addEventListener('input',updateDialog);
  
  var dx=$('dx');
  if(dx)dx.addEventListener('click',function(){dlg.close()});
  
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  
  // Pulsante Email
  var dgo2=$('dgo2');
  if(dgo2){
    dgo2.addEventListener('click',function(e){
      e.preventDefault();
      if(!cur)return;
      
      var de=v('de',100);
      if(!de){alert('Inserisci la tua email');return}
      
      var dp=v('dp',30);
      if(!dp){alert('Inserisci il tuo telefono');return}
      
      var f=document.querySelector('input[name=df]:checked').value.split('|');
      var farmacia=f[1];
      var dn=v('dn',100);
      var dm=v('dm',500);
      
      var emailMap={
        'Emiliani':'staffemiliani@gmail.com',
        'San Luca':'staff.sanluca@gmail.com',
        'Strampelli':'staff.strampelli@gmail.com'
      };
      
      var msg='Richiesta servizio: '+cur.dataset.title+'\n'+
              'Nome: '+(dn||'Non specificato')+'\n'+
              'Telefono: '+dp+'\n'+
              'Email: '+de+'\n'+
              (dm?'Note: '+dm:'');
      
      var mailto='mailto:'+emailMap[farmacia]+'?subject='+encodeURIComponent('Richiesta - '+cur.dataset.title)+'&body='+encodeURIComponent(msg);
      window.location.href=mailto;
    });
  }
})();

// Menu FAB
(function(){
  var fab=$('fab'),menu=$('menu');
  function $(id){return document.getElementById(id)}
  
  if(!fab||!menu)return;
  
  fab.addEventListener('click',function(){
    var open=menu.classList.toggle('open');
    fab.setAttribute('aria-expanded',open);
  });
  
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      menu.classList.remove('open');
      fab.setAttribute('aria-expanded',false);
    });
  });
  
  document.addEventListener('click',function(e){
    if(!e.target.closest('.fab')){
      menu.classList.remove('open');
      fab.setAttribute('aria-expanded',false);
    }
  });
})();

// Menu Header
(function(){
  var nav=document.getElementById('nav');
  var nb=document.getElementById('navbtn');
  
  if(!nb||!nav)return;
  
  nb.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    nb.setAttribute('aria-expanded',open);
  });
})();

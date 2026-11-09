(function(){
  // Daten setzt der Generator ein (bau/bauen.py), Preise stehen nur dort
  var D={"produkt":"RallyLoop™ Solo Tennis Trainer","kurz":"RallyLoop™","ebookKorb":"Learn Tennis e-book","ebookInhalt":"18-page PDF: rules, strokes, 4-week plan","lieferzeit":"6 to 21 business days","stufe":"Free tracked delivery over $59.99: a second set is $33.00 more. Delivery takes 6 to 21 business days.","lieferVon":6,"lieferBis":21,"angebote":[{"id":"1","kurz":"1 Set","lang":"","preis":"44.95","sets":1,"frei":false,"ebook":false},{"id":"2","kurz":"2 Sets","lang":"","preis":"77.95","sets":2,"frei":true,"ebook":true},{"id":"4","kurz":"Buy 3 Get 1 Free","lang":"4 sets","preis":"109.95","sets":4,"frei":true,"ebook":true}]};
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  var R=document.documentElement.getAttribute('data-r')||'./';
  function angebot(id){return D.angebote.filter(function(a){return a.id===id})[0]||null}
  function esc(t){var d=document.createElement('div');d.textContent=t;return d.innerHTML}

  // Karten: Preis in Knopf und Klebeleiste
  function gewaehlt(){var i=$('.angebot input:checked');return i?angebot(i.value):null}
  function waehlen(){
    var a=gewaehlt();if(!a)return;
    $$('.angebot').forEach(function(l){l.classList.toggle('an',l.querySelector('input').checked)});
    $$('[data-preis]').forEach(function(e){e.textContent='$'+a.preis});
    $$('[data-name]').forEach(function(e){e.textContent=a.kurz});
  }
  try{var _w=sessionStorage.getItem('rallyloop_wahl');if(_w&&angebot(_w))$('.angebot input[value="'+_w+'"]').checked=true}catch(e){}
  $$('.angebot input').forEach(function(i){i.addEventListener('change',function(){try{sessionStorage.setItem('rallyloop_wahl',i.value)}catch(e){}waehlen()})});
  waehlen();
  addEventListener('pageshow',function(){waehlen();var a=gewaehlt();if(a){try{sessionStorage.setItem('rallyloop_wahl',a.id)}catch(e){}}});

  // Schubladen
  var offenVon=null;
  function oeffne(s){offenVon=document.activeElement;if(s.id==='korb'){var hw=$('#korb-hinweis');if(hw)hw.hidden=true}s.classList.add('offen');document.documentElement.classList.add('gesperrt');var z=$('[data-zu].symbol',s);if(z)z.focus({preventScroll:true})}
  function schliesse(s){s.classList.remove('offen');if(!$('.schublade.offen'))document.documentElement.classList.remove('gesperrt');if(offenVon&&offenVon.focus)offenVon.focus({preventScroll:true})}
  $$('.schublade').forEach(function(s){s.addEventListener('click',function(e){if(e.target.closest('[data-zu]'))schliesse(s)})});
  $$('[data-auf]').forEach(function(b){b.addEventListener('click',function(){oeffne($('#'+b.getAttribute('data-auf')))})});

  // Korb: genau ein Posten, das gewaehlte Angebot
  var KEY='rallyloop_korb',korb=null;
  try{korb=sessionStorage.getItem(KEY)}catch(e){}
  if(korb&&!angebot(korb))korb=null;
  function speichere(){try{if(korb){sessionStorage.setItem(KEY,korb)}else{sessionStorage.removeItem(KEY)}}catch(e){}}
  function zeichneKorb(){
    var a=korb?angebot(korb):null,inh=$('#korb-inhalt'),fuss=$('#korb-fuss');
    $$('.korbzahl').forEach(function(z){z.textContent=a?a.sets:'';z.hidden=!a});
    if(!inh)return;
    var hin=$('#korb-hinweis');if(hin)hin.hidden=true;
    if(!a){
      inh.innerHTML='<div class="korb-leer"><p>Your cart is empty.</p><a class="knopf" data-zu href="'+R+'index.html#kaufen">Shop the '+esc(D.kurz)+'</a></div>';
      fuss.hidden=true;return;
    }
    var h='<ul class="liste-korb" style="list-style:none;margin:0;padding:0">';
    h+='<li class="posten" data-posten="set"><img src="'+R+'img/korb_trainer.jpg" alt="" width="64" height="64"><div><strong>'+esc(D.produkt)+'</strong><span>'+esc(a.kurz)+(a.lang?' &middot; '+esc(a.lang):'')+'</span></div><b>$'+a.preis+'</b></li>';
    h+='<li class="posten" data-posten="schlaeger"><img src="'+R+'img/korb_schlaeger.jpg" alt="" width="64" height="64"><div><strong>Tennis racket</strong><span>Quantity: '+a.sets+'</span></div><b>Included</b></li>';
    if(a.ebook){h+='<li class="posten" data-posten="ebook"><img src="'+R+'img/korb_ebook.jpg" alt="" width="64" height="64"><div><strong>'+esc(D.ebookKorb)+'</strong><span>'+esc(D.ebookInhalt)+'</span></div><b>Free</b></li>'}
    h+='</ul><button type="button" class="entfernen" data-entfernen>Remove</button>';
    inh.innerHTML=h;
    $('#korb-summe').textContent='$'+a.preis;
    $('#korb-versand').textContent=a.frei?'Free \u00b7 '+D.lieferzeit:'Shown at checkout';
    var stufe=$('#korb-stufe');stufe.textContent=a.frei?'':D.stufe;stufe.hidden=a.frei;
    fuss.hidden=false;
  }
  document.addEventListener('click',function(e){if(e.target.closest('[data-entfernen]')){korb=null;speichere();zeichneKorb()}});
  $$('[data-kauf]').forEach(function(b){b.addEventListener('click',function(){
    var a=gewaehlt();if(!a)return;
    korb=a.id;speichere();zeichneKorb();oeffne($('#korb'));
  })});
  $$('#korb-kasse,[data-express]').forEach(function(b){b.addEventListener('click',function(){$('#korb-hinweis').hidden=false})});
  zeichneKorb();

  // Lieferdatum: ab heute gezaehlt, nur Montag bis Freitag, Feiertage nicht abgezogen
  var MONATE=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function inTagen(n){var d=new Date();while(n>0){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)n--}return MONATE[d.getMonth()]+' '+d.getDate()}
  $$('[data-datum]').forEach(function(e){e.textContent='Order today, arrives '+inTagen(D.lieferVon)+' to '+inTagen(D.lieferBis)+' (est.)'});

  // Galerie: wischen (Scroll-Snap), Zaehler, Daumen am Desktop
  var spur=$('.galerie__spur'),vorgeladen={};
  function laden(i){if(i&&i.loading==='lazy'){i.loading='eager'}}
  if(spur){
    var folien=$$('.folie',spur),zaehler=$('.zaehler'),daumen=$$('.daumen button'),aktuell=0,warte=false;
    var setze=function(i){
      aktuell=i;
      if(zaehler){zaehler.textContent=(i+1)+' / '+folien.length}
      daumen.forEach(function(b,n){b.setAttribute('aria-current',n===i?'true':'false')});
      var leiste=daumen.length&&daumen[i].parentNode;
      if(leiste&&leiste.offsetParent){leiste.scrollTo({left:daumen[i].offsetLeft-leiste.clientWidth/2+32,behavior:'smooth'})}
      [i-1,i+1,i+2].forEach(function(n){if(folien[n])laden($('img',folien[n]))});
    };
    spur.addEventListener('scroll',function(){
      if(warte)return;warte=true;
      requestAnimationFrame(function(){warte=false;var i=Math.round(spur.scrollLeft/spur.clientWidth);if(i!==aktuell&&folien[i])setze(i)});
    },{passive:true});
    daumen.forEach(function(b,i){b.addEventListener('click',function(){
      var folie=folien[i];laden($('img',folie));
      spur.scrollTo({left:i*spur.clientWidth,behavior:'smooth'});
    })});
    spur.addEventListener('touchstart',function(){[aktuell+1,aktuell+2].forEach(function(n){if(folien[n])laden($('img',folien[n]))})},{passive:true});
  }

  // Bewertungen: Rest zeigen
  $$('[data-mehr]').forEach(function(b){b.addEventListener('click',function(){
    $$('.stimme[hidden]').forEach(function(s){s.hidden=false});
    b.parentNode.hidden=true;
  })});

  // Kundenfoto gross
  var gross=$('.grossbild');
  if(gross){
    var grossImg=$('img',gross),grossVon=null;
    var zu=function(){gross.hidden=true;grossImg.removeAttribute('src');document.documentElement.classList.remove('gesperrt');if(grossVon)grossVon.focus({preventScroll:true})};
    $$('[data-gross]').forEach(function(a){a.addEventListener('click',function(e){
      e.preventDefault();grossVon=a;grossImg.src=a.getAttribute('href');gross.hidden=false;document.documentElement.classList.add('gesperrt');$('.symbol',gross).focus({preventScroll:true});
    })});
    gross.addEventListener('click',function(e){if(e.target===gross||e.target.closest('.symbol'))zu()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!gross.hidden)zu()});
  }
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){$$('.schublade.offen').forEach(schliesse)}});

  // Klebeleiste: erscheint, wenn der Kaufknopf oben raus ist; weg, wenn der Schlussknopf zu sehen ist
  var klebe=$('.klebe'),kaufKnopf=$('#kaufen [data-kauf]'),schlussKnopf=$('.schluss [data-kauf]');
  if(klebe&&kaufKnopf){
    var pruef=function(){
      var kr=kaufKnopf.getBoundingClientRect(),weg=kr.top<0||kr.bottom>innerHeight,schluss=false;
      if(schlussKnopf){var r=schlussKnopf.getBoundingClientRect();schluss=r.top<innerHeight&&r.bottom>0}
      klebe.classList.toggle('an',weg&&!schluss);
    };
    addEventListener('scroll',pruef,{passive:true});addEventListener('resize',pruef);pruef();if(document.fonts)document.fonts.ready.then(pruef);
  }

  // Bilder vorladen: nie sichtbares Nachladen. Zuerst Folie 2, dann alles auf der Seite in Reihenfolge,
  // dann der Rest der Galerie; hoechstens 6 gleichzeitig. Was sich auf 2500 px naehert, laedt sofort.
  function fertig(i){return i.complete&&i.naturalWidth>0}
  function allesLaden(){
    var alle=$$('img[loading="lazy"]');
    var inGalerie=function(i){return !!i.closest('.galerie')},sichtbar=function(i){return i.offsetParent!==null};
    var zweite=alle.filter(function(i){var f=i.closest('.folie');return f&&f===f.parentNode.children[1]});
    var seite=alle.filter(function(i){return !inGalerie(i)&&sichtbar(i)});
    var galerie=alle.filter(function(i){return !!i.closest('.folie')&&zweite.indexOf(i)<0});
    var rest=alle.filter(function(i){return zweite.indexOf(i)<0&&seite.indexOf(i)<0&&galerie.indexOf(i)<0&&sichtbar(i)});
    var schlange=zweite.concat(seite,galerie,rest),SCHUB=6,unterwegs=0;
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){laden(e.target);io.unobserve(e.target)}})},{rootMargin:'2500px 0px'});
      alle.forEach(function(i){io.observe(i)});
    }
    function weiter(){
      while(unterwegs<SCHUB&&schlange.length){
        var i=schlange.shift();
        if(fertig(i))continue;
        unterwegs++;
        (function(i){var f=function(){i.removeEventListener('load',f);i.removeEventListener('error',f);if(i.decode&&fertig(i)){i.decode().catch(function(){})}unterwegs--;weiter()};
          i.addEventListener('load',f);i.addEventListener('error',f);laden(i);if(fertig(i))f()})(i);
      }
    }
    weiter();
  }
  var erstes=$('.folie img'),gestartet=false;
  function los(){if(gestartet)return;gestartet=true;setTimeout(allesLaden,0)}
  if(document.readyState==='complete'||!erstes||fertig(erstes)){los()}
  else{erstes.addEventListener('load',los);erstes.addEventListener('error',los);addEventListener('load',los)}
})();

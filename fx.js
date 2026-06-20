/* ============================================================
   KONECTA — capa de efectos (reveals + contadores + hover)
   No quita ni cambia secciones. Solo anima.
   ============================================================ */
(function(){
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var SEL = '.sec-head,.feat,.step,.stat,.conexion-card,.config-text,.config-opt,.config-robot,.plan,.modo-titulo,.faq-item,.redes-canal';
  document.querySelectorAll(SEL).forEach(function(e){ e.classList.add('fx'); });

  function fmt(n){ return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function count(el){
    var m = (el.textContent || '').match(/^(\D*)([\d.,]+)(.*)$/);
    if(!m) return;
    var pre = m[1], suf = m[3], target = parseInt(m[2].replace(/[.,]/g, ''), 10);
    if(isNaN(target)) return;
    if(rm){ el.textContent = pre + fmt(target) + suf; return; }
    var start = null, dur = 2600;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(Math.round(e * target)) + suf;
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function reveal(el){
    if(el.classList.contains('in')) return;
    el.classList.add('in');
    if(el.classList.contains('stat')){ var n = el.querySelector('.num'); if(n) count(n); }
  }
  function check(){
    var h = window.innerHeight || 800;
    document.querySelectorAll('.fx:not(.in)').forEach(function(e){
      if(e.getBoundingClientRect().top < h * 0.88) reveal(e);
    });
  }
  window.addEventListener('scroll', check, {passive:true});
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  check();
  /* red de seguridad: nada se queda invisible (no dispara contadores antes de tiempo) */
  setTimeout(function(){ document.querySelectorAll('.fx:not(.stat):not(.in)').forEach(reveal); }, 4500);

  /* FAQ acordeón inteligente: al abrir una, cierra las demás */
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.parentElement;
      document.querySelectorAll('.faq-item.open').forEach(function(o){ if(o !== item) o.classList.remove('open'); });
    });
  });

  /* CONFIG: resaltar las 3 opciones una por una, en bucle */
  var opts = document.querySelectorAll('.config-opts .config-opt');
  if(opts.length >= 2 && !rm){
    var ci = 0;
    function cyc(){ for(var k=0;k<opts.length;k++) opts[k].classList.toggle('active', k===ci); ci=(ci+1)%opts.length; }
    cyc(); setInterval(cyc, 2000);
  }

  /* NAV: transparente arriba, tenue al hacer scroll */
  var hdr = document.querySelector('header');
  if(hdr){
    function navScroll(){ hdr.classList.toggle('scrolled', window.scrollY > 30); }
    window.addEventListener('scroll', navScroll, {passive:true});
    navScroll();
  }

  /* REDES: reemplazar los PNG (con fondo blanco) por SVG limpios y transparentes */
  var ICO_MSG = '<svg viewBox="0 0 1024 1024" width="78" height="78"><defs><radialGradient id="kmg" cx="19.247%" cy="99.465%" r="108.96%"><stop offset="0" stop-color="#0099ff"/><stop offset=".6" stop-color="#a033ff"/><stop offset=".9" stop-color="#ff5280"/><stop offset="1" stop-color="#ff7061"/></radialGradient></defs><path fill="url(#kmg)" d="M512 0C223.2 0 0 211.6 0 497.5c0 149.5 61.3 278.7 161.1 367.9 8.4 7.5 13.5 18 13.8 29.3l2.8 91.3c.9 29.1 31 48 57.7 36.2l101.9-45c8.6-3.8 18.3-4.5 27.4-2 46.7 12.8 96.4 19.7 148.3 19.7 288.8 0 512-211.6 512-497.5S800.8 0 512 0z"/><path fill="#fff" d="M204.6 642.2l150.4-238.6c23.9-37.9 75.1-47.3 110.9-20.5l119.6 89.7c11 8.2 26 8.2 37 .1l161.5-122.6c21.6-16.4 49.7 9.5 35.3 32.5L668.4 620.9c-23.9 37.9-75.1 47.3-110.9 20.5l-119.6-89.7c-11-8.2-26-8.2-37-.1L239.9 674.7c-21.5 16.3-49.6-9.6-35.3-32.5z"/></svg>';
  var ICO_IG = '<svg viewBox="0 0 24 24" width="78" height="78"><defs><linearGradient id="kig" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#feda75"/><stop offset=".35" stop-color="#fa7e1e"/><stop offset=".62" stop-color="#d62976"/><stop offset="1" stop-color="#962fbf"/></linearGradient></defs><rect x="1" y="1" width="22" height="22" rx="6.5" fill="url(#kig)"/><rect x="6" y="6" width="12" height="12" rx="4" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="16.8" cy="7.2" r="1.05" fill="#fff"/></svg>';
  var ICO_FB = '<svg viewBox="0 0 24 24" width="78" height="78"><circle cx="12" cy="12" r="12" fill="#1877F2"/><path fill="#fff" d="M13.4 21v-7.1h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8v2.8h2.4V21h3z"/></svg>';
  var SVGS = [ICO_MSG, ICO_IG, ICO_FB];
  var rcicos = document.querySelectorAll('#redes .rc-ico');
  rcicos.forEach(function(el, idx){ if(SVGS[idx]) el.innerHTML = SVGS[idx]; });

  /* Shopify: cambiar el PNG (con fondo blanco) por el SVG oficial transparente */
  var shImg = document.querySelector('#integraciones .shopify-left img:not(.dropi-img)');
  if(shImg) shImg.src = 'assets/logos/shopify.svg';
})();

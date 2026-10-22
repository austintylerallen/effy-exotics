(() => {
  const page = document.querySelector('#page');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let cloudEntrance;
  const entranceSmoke = {progress:0};
  function paintEntranceSmoke() {
    document.querySelector('.atmosphere').style.setProperty('--smoke-hole', (entranceSmoke.progress*145-15)+'%');
    window.dispatchEvent(new CustomEvent('effy-smoke-clear',{detail:entranceSmoke.progress}));
  }
  function stopCloudEntrance() {
    cloudEntrance?.kill();
    entranceSmoke.progress=0;
    paintEntranceSmoke();
  }
  window.addEventListener('effy-age-entering', () => {
    if (!window.gsap || reduced.matches || navigator.connection?.saveData) return;
    cloudEntrance=gsap.timeline()
      .to(entranceSmoke,{progress:.48,duration:1.15,ease:'power2.out',onUpdate:paintEntranceSmoke})
      .to(entranceSmoke,{progress:0,duration:2.4,ease:'sine.inOut',onUpdate:paintEntranceSmoke});
  });
  let entrancePlayed = false;
  let entrance;
  let buildLoop;
  let logoShine;
  function revealText() {
    if (page.inert || entrancePlayed) return;
    entrancePlayed = true;
    if (!window.gsap || reduced.matches || navigator.connection?.saveData) return;
    buildLoop = gsap.timeline({repeat:-1,repeatDelay:.6})
      .fromTo('.creator-scan',{xPercent:-120,opacity:0},{xPercent:620,opacity:.65,duration:2.6,ease:'power1.inOut'})
      .to('.creator-scan',{opacity:0,duration:.25},'-=.25')
      .fromTo('.creator-bracket',{opacity:.4},{opacity:1,duration:.8,stagger:.18,yoyo:true,repeat:1},0);
    logoShine = gsap.timeline({repeat:-1,repeatDelay:5.5,delay:1.5})
      .fromTo('.hero-logo-shine',{'--shine-position':'-80%'},{'--shine-position':'180%',duration:3.8,ease:'sine.inOut'});
    if (document.hidden) { buildLoop.pause(); logoShine.pause(); }
    entrance = gsap.timeline();
    entrance.fromTo('.hero-brand', {autoAlpha:0,scale:.92,y:14}, {autoAlpha:1,scale:1,y:0,duration:.9,ease:'power3.out',clearProps:'all'},0)
      .fromTo('.headline-line > span', {yPercent:110, autoAlpha:0, rotate:3, filter:'blur(8px)'}, {yPercent:0,autoAlpha:1,rotate:0,filter:'blur(0px)',duration:1.05,stagger:.16,ease:'power3.out',clearProps:'all'},.1)
      .fromTo('.intro', {autoAlpha:0,y:20}, {autoAlpha:1,y:0,duration:.65,ease:'power2.out',clearProps:'all'}, '-=.65')
      .fromTo('.section-heading', {autoAlpha:0,y:18}, {autoAlpha:1,y:0,duration:.5,clearProps:'all'}, '-=.45')
      // Contact 12's staggered card entrance, adapted to this static page's GSAP runtime.
      .fromTo('.location-card',{autoAlpha:0,y:20},{autoAlpha:1,y:0,duration:.6,stagger:.07,ease:'power3.out',clearProps:'all'},.25);
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      stopCloudEntrance();
      entrance?.progress(1);
      buildLoop?.pause();
      logoShine?.pause();
      if (window.gsap) gsap.set('.creator-scan,.creator-bracket,.hero-logo-shine',{clearProps:'all'});
    } else if (!document.hidden) { buildLoop?.restart(); logoShine?.restart(); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden || reduced.matches) { buildLoop?.pause(); logoShine?.pause(); }
    else { buildLoop?.resume(); logoShine?.resume(); }
  });
  window.addEventListener('effy-age-verified', revealText);
  revealText();
  const stores = {
    'las-cruces': { city: 'Las Cruces', address: '2153 W Picacho Ave, Las Cruces, NM 88007', phone: '+15756524619', display: '(575) 652-4619' },
    alamogordo: { city: 'Alamogordo', address: '1408 Black St, Alamogordo, NM 88310', phone: '+15752864282', display: '(575) 286-4282' }
  };
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  for (const control of document.querySelectorAll('.location-choice, .primary')) {
    const reset = () => { control.style.removeProperty('--magnet-x'); control.style.removeProperty('--magnet-y'); };
    control.addEventListener('pointermove', event => {
      if (reduceMotion.matches || event.pointerType !== 'mouse') return;
      const box = control.getBoundingClientRect();
      control.style.setProperty('--magnet-x', ((event.clientX-box.left-box.width/2)/box.width*8)+'px');
      control.style.setProperty('--magnet-y', ((event.clientY-box.top-box.height/2)/box.height*8)+'px');
    });
    control.addEventListener('pointerleave', reset);
    control.addEventListener('blur', reset);
  }
  const details = document.querySelector('#store-dialog');
  const atmosphere = document.querySelector('.atmosphere');
  const choices = [...document.querySelectorAll('[data-store]')];
  const smoke = {progress:0};
  let trigger, transition, revealTimer;
  let transitioning = false;
  const updateSmoke = () => {
    atmosphere.style.setProperty('--smoke-hole',(smoke.progress*145-15)+'%');
    window.dispatchEvent(new CustomEvent('effy-smoke-clear',{detail:smoke.progress}));
  };
  function finishEntrance() {
    clearTimeout(revealTimer);
    transitioning=false;
    page.removeAttribute('aria-busy');
    choices.forEach(button=>button.removeAttribute('aria-disabled'));
    window.location.assign('/'+trigger.dataset.store+'/shop');
  }
  function immediateEntrance() {
    transition?.kill();
    smoke.progress=1; updateSmoke();
    page.style.opacity='0';
    if (window.gsap) gsap.set('.store-content',{clearProps:'all'});
    finishEntrance();
  }
  reduced.addEventListener('change',()=>{if(reduced.matches && transitioning) immediateEntrance();});
  for (const choice of choices) choice.addEventListener('click', () => {
    if (transitioning || details.open) return;
    stopCloudEntrance();
    entrance?.progress(1);
    const slug=choice.dataset.store, store=stores[slug];
    trigger=choice;
    document.querySelector('#store-title').textContent=store.city;
    document.querySelector('#store-address').textContent=store.address;
    document.querySelector('#store-phone').textContent=store.display;
    document.querySelector('#store-call').href='tel:'+store.phone;
    document.querySelector('#store-map').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(store.address);
    try { document.cookie='ee_city='+slug+'; max-age=15552000; path=/; SameSite=Lax'+(location.protocol==='https:'?'; Secure':''); } catch {}
    if (!window.gsap || reduced.matches || navigator.connection?.saveData) { immediateEntrance(); return; }
    transitioning=true;
    choices.forEach(button=>button.setAttribute('aria-disabled','true'));
    page.setAttribute('aria-busy','true');
    document.body.style.overflow='hidden';
    transition?.kill();
    // The already-rendered next view enters while smoke is still moving outward.
    transition=gsap.timeline({onComplete:finishEntrance})
      .to(page,{opacity:0,scale:1.12,duration:.65,ease:'power2.in'},0)
      .to(smoke,{progress:1,duration:1.4,ease:'power2.inOut',onUpdate:updateSmoke},0)
      .fromTo('.store-content',{opacity:0,scale:.88,y:24},{opacity:1,scale:1,y:0,duration:.85,ease:'power3.out',clearProps:'all'},.55);
    revealTimer=setTimeout(immediateEntrance,1800);
  });
  document.querySelector('#close-store').addEventListener('click',()=>details.close());
  details.addEventListener('close',()=>{
    clearTimeout(revealTimer); transition?.kill(); transitioning=false;
    page.removeAttribute('aria-busy'); choices.forEach(button=>button.removeAttribute('aria-disabled'));
    document.body.style.overflow='';
    if(window.gsap && !reduced.matches && !navigator.connection?.saveData) {
      transition=gsap.timeline().to(smoke,{progress:0,duration:.7,onUpdate:updateSmoke},0)
        .to(page,{opacity:1,scale:1,duration:.6,clearProps:'all'},.1);
    } else {smoke.progress=0;updateSmoke();page.style.removeProperty('opacity');page.style.removeProperty('transform');}
    trigger?.focus({preventScroll:true});
  });
})();

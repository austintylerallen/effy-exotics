(() => {
  const page = document.querySelector('#page');
  const gate = document.querySelector('#age-gate');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let entering = false;
  function finish() {
    gate.close();
    page.inert = false;
    document.body.style.overflow = '';
    const heading = page.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
    window.dispatchEvent(new Event('effy-age-verified'));
  }
  function enter(animate) {
    if (entering) return;
    entering = true;
    if (!animate || reduced.matches || !gate.animate) { finish(); return; }
    window.dispatchEvent(new Event('effy-age-entering'));
    gate.classList.add('leaving');
    const motion = gate.animate([
      {opacity:1,transform:'translate(-50%, -50%) scale(1)'},
      {opacity:0,transform:'translate(-50%, -54%) scale(.96)'}
    ], {duration:450,easing:'ease-in',fill:'forwards'});
    motion.finished.then(finish, finish);
  }
  let verified = false;
  try { verified = document.cookie.split(';').some(c => c.trim() === 'ageVerified=true'); } catch {}
  gate.removeAttribute('open');
  if (verified) enter(false);
  else { document.body.style.overflow = 'hidden'; gate.showModal(); }
  gate.addEventListener('cancel', event => event.preventDefault());
  document.querySelector('#age-yes').addEventListener('click', () => {
    try { document.cookie = 'ageVerified=true; max-age=2592000; path=/; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : ''); } catch {}
    enter(true);
  });
  document.querySelector('#age-no').addEventListener('click', () => {
    document.querySelector('#age-actions').hidden = true;
    document.querySelector('#age-denied').hidden = false;
    document.querySelector('#age-denied a').focus();
  });
})();

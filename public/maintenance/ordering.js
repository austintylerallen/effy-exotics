(() => {
  let started = false;
  function loadMenu() {
    if (started || document.querySelector('#page').inert) return;
    started = true;
    const target = document.querySelector('#dutchie-embed-root');
    const status = document.querySelector('#menu-status');
    status.textContent = 'Loading the Dutchie menu…';
    const script = document.createElement('script');
    script.id = 'dutchie--embed__script';
    script.async = true;
    script.src = 'https://dutchie.com/api/v2/embedded-menu/' + target.dataset.embed + '.js';
    const timer = setTimeout(() => { status.textContent = 'If the menu does not appear, refresh this page or call the store for help.'; }, 15000);
    script.onload = () => { clearTimeout(timer); status.hidden = true; };
    script.onerror = () => { clearTimeout(timer); status.textContent = 'The menu could not load. Please refresh or call the store for help.'; };
    target.appendChild(script);
  }
  window.addEventListener('effy-age-verified', loadMenu);
  loadMenu();
})();

(() => {
  const panels = [...document.querySelectorAll('[data-hours]')];
  let pending = false;
  function unavailable(panel) {
    panel.querySelector('.hours-status').textContent = 'Call the store to confirm hours';
    panel.querySelector('.hours-today').textContent = '';
    panel.querySelector('details').hidden = true;
    delete panel.dataset.state;
  }
  function render(panel, location) {
    panel.dataset.state = location.status.state;
    panel.querySelector('.hours-status').textContent = `${location.status.label} · ${location.status.detail}`;
    panel.querySelector('.hours-today').textContent = `Today · ${location.status.todayHours}`;
    const list = panel.querySelector('dl');
    list.replaceChildren();
    for (const row of location.week) {
      const line = document.createElement('div');
      const day = document.createElement('dt');
      const hours = document.createElement('dd');
      day.textContent = row.day; hours.textContent = row.hours;
      line.append(day, hours); list.append(line);
    }
    const special = panel.querySelector('.special-hours');
    special.replaceChildren();
    for (const row of location.special) {
      const line = document.createElement('p');
      line.textContent = `${row.day}: ${row.hours}`; special.append(line);
    }
    panel.querySelector('.hours-source').textContent = location.source;
    panel.querySelector('details').hidden = !location.week.length;
  }
  async function refresh() {
    if (pending || document.hidden) return;
    pending = true;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('/api/store-hours', { signal: controller.signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Hours unavailable');
      const data = await response.json();
      for (const panel of panels) {
        const location = data.locations.find(item => item.slug === panel.dataset.hours);
        if (location) render(panel, location); else unavailable(panel);
      }
    } catch { panels.forEach(unavailable); }
    finally { clearTimeout(timer); pending = false; }
  }
  refresh();
  setInterval(refresh, 60000);
  document.addEventListener('visibilitychange', refresh);
})();

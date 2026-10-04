(() => {
  const map = document.querySelector('.climate-map-demo .impact-map');
  if (!map) return;

  map.insertAdjacentHTML('afterbegin', '<img class="climate-world" src="assets/world-detailed.svg" alt="標示各國邊界與海岸線的全球氣候災害地圖">');

  const extraEvents = [
    ['heatwave', 'HW', '印度 · 熱浪', 'Heatwave impact in India'],
    ['hurricane', 'HC', '加勒比海 · 颶風', 'Hurricane impact in Caribbean'],
    ['australia-fire', 'BF', '澳洲 · 森林火災', 'Bushfire impact in Australia']
  ];
  extraEvents.forEach(([cls, code, label, aria]) => {
    const button = document.createElement('button');
    button.className = `impact-point ${cls}`;
    button.setAttribute('aria-label', aria);
    button.innerHTML = `<i></i><b>${code}</b><small>${label}</small>`;
    map.appendChild(button);
  });

  map.insertAdjacentHTML('beforeend', '<div class="impact-status" aria-live="polite"><span>ACTIVE EVENT</span><b>西北太平洋颱風</b><small>WIND 155 KM/H · EXPOSURE HIGH</small></div>');
  const status = map.querySelector('.impact-status');
  const details = {
    typhoon:['西北太平洋颱風','WIND 155 KM/H · EXPOSURE HIGH'],
    quake:['日本近海地震','MAG 6.2 · EXPOSURE MEDIUM'],
    flood:['歐洲區域洪水','RAINFALL +187% · EXPOSURE HIGH'],
    wildfire:['北美野火','BURN AREA 42K HA · EXPOSURE HIGH'],
    drought:['東非乾旱','SOIL MOISTURE −31% · EXPOSURE SEVERE'],
    heatwave:['南亞熱浪','TEMP +4.8°C · EXPOSURE HIGH'],
    hurricane:['加勒比海颶風','WIND 178 KM/H · EXPOSURE HIGH'],
    'australia-fire':['澳洲森林火災','FIRE INDEX 82 · EXPOSURE HIGH']
  };
  const points = [...map.querySelectorAll('.impact-point')];
  points.forEach((point, index) => {
    if (!index) point.classList.add('is-active');
    point.addEventListener('click', () => {
      points.forEach(item => item.classList.remove('is-active'));
      point.classList.add('is-active');
      const key = [...point.classList].find(name => details[name]);
      const detail = details[key];
      status.innerHTML = `<span>ACTIVE EVENT</span><b>${detail[0]}</b><small>${detail[1]}</small>`;
    });
  });

  const head = document.querySelector('.climate-map-demo .matrix-head .live-dot');
  if (head) head.textContent = '8 ACTIVE EVENTS';
  const legend = document.querySelector('.climate-map-demo .impact-legend');
  if (legend) legend.innerHTML = '<span class="legend-typhoon"><i></i>颱風</span><span class="legend-flood"><i></i>洪水</span><span class="legend-wildfire"><i></i>野火</span><span class="legend-drought"><i></i>乾旱</span><span class="legend-heatwave"><i></i>熱浪</span><span class="legend-quake"><i></i>地震</span><b>DATA REFRESHED 02:14 UTC</b>';
})();

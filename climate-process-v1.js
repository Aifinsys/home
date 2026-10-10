(() => {
  const root = document.querySelector('.climate-process');
  if (!root) return;

  const content = {
    zh: [
      { mode:'data', kicker:'DATA COLLECTION', state:'LIVE · 24/7', title:'將氣候資料匯集到中央系統', text:'衛星、海洋、氣象與災害資料持續送入中央資料核心，完成品質檢查、時間對齊與標準化。', items:['衛星與雷達觀測','海溫與氣象資料','災害與地理資訊'], output:'標準化氣候資料層', metrics:[['SATELLITE','18 TB'],['OCEAN','23.1°C'],['WEATHER','24/7']]},
      { mode:'compute', kicker:'SCIENTIFIC COMPUTING', state:'MODEL RUNNING', title:'以 AI 進行高速科學計算', text:'大量數值持續進入模型，推演災害機率、強度、時間範圍與不確定性，形成可比較的風險分數。', items:['氣候情境模擬','機率與強度運算','模型信心度檢核'], output:'動態氣候風險分數', metrics:[['MODELS','36'],['SCENARIOS','128'],['CONF.','97.6%']]},
      { mode:'market', kicker:'FINANCIAL QUANTIFICATION', state:'MARKET LIVE', title:'把氣候風險量化為股市波動', text:'將氣候衝擊連結至價格、成交量、波動率與企業現金流，轉換為可直接比較的金融訊號。', items:['紅綠 K 棒與趨勢','預期損失與波動率','企業財務敏感度'], output:'市場波動與價格訊號', metrics:[['VOL.','18.4'],['RISK','24.6'],['AI SCORE','86.4']]},
      { mode:'global', kicker:'GLOBAL HEDGE DELIVERY', state:'ACTION READY', title:'將投資與避險策略送往全球市場', text:'中央系統把計算結果配置到不同地區、資產與期貨市場，持續監測並依氣候變化重新平衡。', items:['全球投資標的評分','期貨與碳權避險','跨市場動態再平衡'], output:'全球投資與避險策略', metrics:[['REGIONS','196'],['HEDGE','35%'],['SIGNAL','BUY']]}
    ],
    en: [
      { mode:'data', kicker:'DATA COLLECTION', state:'LIVE · 24/7', title:'Collect climate data into the central system', text:'Satellite, ocean, weather, and disaster data continuously enter the core for quality checks, time alignment, and standardization.', items:['Satellite and radar observations','Ocean and weather data','Hazard and geospatial data'], output:'Standardized climate data layer', metrics:[['SATELLITE','18 TB'],['OCEAN','23.1°C'],['WEATHER','24/7']]},
      { mode:'compute', kicker:'SCIENTIFIC COMPUTING', state:'MODEL RUNNING', title:'Run high-speed scientific computation with AI', text:'Continuous numerical streams model hazard probability, intensity, time horizon, and uncertainty to create comparable risk scores.', items:['Climate scenario simulation','Probability and intensity models','Model confidence checks'], output:'Dynamic climate risk score', metrics:[['MODELS','36'],['SCENARIOS','128'],['CONF.','97.6%']]},
      { mode:'market', kicker:'FINANCIAL QUANTIFICATION', state:'MARKET LIVE', title:'Quantify climate risk as market volatility', text:'Climate impact is linked to price, volume, volatility, and corporate cash flow to produce comparable financial signals.', items:['Red-green candles and trend','Expected loss and volatility','Corporate financial sensitivity'], output:'Market volatility and price signal', metrics:[['VOL.','18.4'],['RISK','24.6'],['AI SCORE','86.4']]},
      { mode:'global', kicker:'GLOBAL HEDGE DELIVERY', state:'ACTION READY', title:'Distribute investment and hedge strategies globally', text:'The central system allocates results across regions, assets, and futures markets, then monitors and rebalances as climate conditions change.', items:['Global investment scoring','Futures and carbon hedging','Cross-market rebalancing'], output:'Global investment and hedge strategy', metrics:[['REGIONS','196'],['HEDGE','35%'],['SIGNAL','BUY']]}
    ]
  };

  const buttons = [...root.querySelectorAll('[data-flow-step]')];
  const card = root.querySelector('.flow-decision-card');
  const metricBox = root.querySelector('.flow-metrics');
  let current = 0;
  let timer;

  const language = () => document.documentElement.lang.startsWith('en') ? 'en' : 'zh';
  const render = (index, animate = true) => {
    current = index;
    buttons.forEach((button, buttonIndex) => {
      button.classList.toggle('is-active', buttonIndex === index);
      button.classList.toggle('is-complete', buttonIndex < index);
      button.setAttribute('aria-selected', buttonIndex === index ? 'true' : 'false');
    });
    if (animate) card.classList.add('is-switching');
    window.setTimeout(() => {
      const item = content[language()][index];
      root.querySelector('.flow-visual-kicker').textContent = item.kicker;
      root.querySelector('.flow-visual-state').textContent = item.state;
      root.dataset.flowMode = item.mode;
      card.querySelector('.flow-step-label').textContent = `STEP ${String(index + 1).padStart(2,'0')} / 04`;
      card.querySelector('h3').textContent = item.title;
      card.querySelector('p').textContent = item.text;
      card.querySelector('ul').innerHTML = item.items.map(value => `<li>${value}</li>`).join('');
      card.querySelector('.flow-output b').textContent = item.output;
      metricBox.innerHTML = item.metrics.map(([label,value]) => `<span><small>${label}</small><b>${value}</b></span>`).join('');
      card.classList.remove('is-switching');
    }, animate ? 180 : 0);
  };
  const restart = () => { window.clearInterval(timer); timer = window.setInterval(() => render((current + 1) % buttons.length), 5200); };
  buttons.forEach((button, index) => button.addEventListener('click', () => { render(index); restart(); }));
  root.addEventListener('mouseenter', () => window.clearInterval(timer));
  root.addEventListener('mouseleave', restart);
  document.querySelector('#languageToggle')?.addEventListener('click', () => window.setTimeout(() => render(current, false), 0));
  render(0, false);
  restart();

  const stats = document.querySelectorAll('.hero-stats > div');
  const flipStats = () => stats.forEach(stat => stat.classList.add('stat-flip'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { flipStats(); observer.disconnect(); }
    }, { threshold:.5 });
    observer.observe(document.querySelector('.hero-stats'));
  } else flipStats();
})();

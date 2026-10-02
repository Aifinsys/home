const heroCopy={zh:{title:'提供氣候數據<br>為<strong>金融避險</strong>',text:'全球氣候資料以 AI 科學計算，成為金融投資與避險決策。',news:'最新消息'},en:{title:'Climate data<br>for <strong>financial hedging.</strong>',text:'Global climate data, scientifically computed with AI, powers financial investment and hedging decisions.',news:'Latest news'}};
const updateHero=()=>{const isEn=document.documentElement.lang==='en',t=heroCopy[isEn?'en':'zh'];document.querySelector('[data-i18n-html="heroTitle"]').innerHTML=t.title;document.querySelector('.hero-copy h1+p').textContent=t.text;document.querySelector('[data-i18n="newsTitle"]').textContent=t.news};
document.querySelector('#languageToggle').addEventListener('click',updateHero);updateHero();
const demos={portfolio:{score:'84.2',change:'+ 6.4%',title:'Projected climate-adjusted alpha',allocation:'ESG 65% · TAIEX FUT 20% · EUA 15%',market:'TAIEX / ESG PORTFOLIO',path:'M0,155 C55,142 70,160 112,135 S180,80 218,105 S267,132 303,94 S367,48 402,70 S455,122 492,66 S560,35 600,18'},futures:{score:'91.6',change:'+ 9.1%',title:'Futures hedge impact simulation',allocation:'WTI 30% · GOLD 25% · EUA 25% · CASH 20%',market:'GLOBAL CLIMATE FUTURES',path:'M0,139 C55,157 73,95 115,122 S171,48 220,99 S282,76 318,62 S370,111 410,48 S489,86 530,40 S570,29 600,24'},global:{score:'78.9',change:'+ 3.8%',title:'Global portfolio risk projection',allocation:'US EQ 40% · APAC 30% · EU EQ 15% · HEDGE 15%',market:'GLOBAL EQUITY / CLIMATE RISK',path:'M0,152 C44,130 70,105 112,128 S181,82 222,115 S276,140 319,95 S383,116 419,77 S470,101 507,58 S557,78 600,38'}};
document.querySelectorAll('.demo-tabs button').forEach(button=>button.addEventListener('click',()=>{const d=demos[button.dataset.demo];document.querySelectorAll('.demo-tabs button').forEach(x=>x.classList.remove('active'));button.classList.add('active');document.querySelector('.demo-score').textContent=d.score;document.querySelector('.demo-change').textContent=d.change;document.querySelector('.demo-chart-title').textContent=d.title;document.querySelector('.demo-allocation').textContent=d.allocation;document.querySelector('.demo-market').textContent=d.market;const line=document.querySelector('.chart-line'),fill=document.querySelector('.chart-fill');line.setAttribute('d',d.path);fill.setAttribute('d',d.path+' L600,190 L0,190Z')}));
document.querySelectorAll('.stock-row').forEach(stock=>stock.addEventListener('click',()=>{document.querySelectorAll('.stock-row').forEach(x=>x.classList.remove('selected'));stock.classList.add('selected');const code=stock.querySelector('b').textContent,name=stock.querySelector('span').textContent,price=stock.querySelector('em').textContent;document.querySelector('.quant-title b').textContent=`${code} · ${name}`;document.querySelector('.demo-market').textContent=`${code} / AI QUANT SIGNAL`;document.querySelector('.demo-chart-title').textContent=`${name} climate-adjusted price momentum`;document.querySelector('.demo-score').textContent=code==='2454'?'74.2':code==='TAIEX'?'81.6':'86.4';document.querySelector('.demo-change').textContent=stock.querySelector('i').textContent;document.querySelector('.quant-title strong').firstChild.textContent=code==='2454'?'74.2 ':code==='TAIEX'?'81.6 ':'86.4 '}));

const earth = document.querySelector('.earth');
let globeRotationX = -8;
let globeRotationY = -18;
let globeDragging = false;
let globePointerX = 0;
let globePointerY = 0;
const renderGlobe = () => {
  earth.style.transform = `rotateX(${globeRotationX}deg) rotateY(${globeRotationY}deg)`;
};
earth.addEventListener('pointerdown', event => {
  globeDragging = true;
  globePointerX = event.clientX;
  globePointerY = event.clientY;
  earth.setPointerCapture(event.pointerId);
  earth.classList.add('is-dragging');
});
earth.addEventListener('pointermove', event => {
  if (!globeDragging) return;
  globeRotationY += (event.clientX - globePointerX) * .45;
  globeRotationX = Math.max(-32, Math.min(32, globeRotationX - (event.clientY - globePointerY) * .28));
  globePointerX = event.clientX;
  globePointerY = event.clientY;
  renderGlobe();
});
earth.addEventListener('pointerup', event => {
  globeDragging = false;
  earth.releasePointerCapture(event.pointerId);
  earth.classList.remove('is-dragging');
});
earth.addEventListener('pointercancel', () => {
  globeDragging = false;
  earth.classList.remove('is-dragging');
});
renderGlobe();

const partnerTrack = document.querySelector('.official-partners');
if (partnerTrack && !partnerTrack.dataset.loopReady) {
  [...partnerTrack.children].forEach(item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    partnerTrack.appendChild(clone);
  });
  partnerTrack.dataset.loopReady = 'true';
}

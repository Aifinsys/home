const heroCopy={zh:{title:'提供氣候數據為<strong>金融避險</strong>',text:'全球氣候資料以 AI 科學計算，成為金融投資與避險決策。',news:'最新消息'},en:{title:'Climate data for <strong>financial hedging.</strong>',text:'Global climate data, scientifically computed with AI, powers financial investment and hedging decisions.',news:'Latest news'}};
const updateHero=()=>{const isEn=document.documentElement.lang==='en',t=heroCopy[isEn?'en':'zh'];document.querySelector('[data-i18n-html="heroTitle"]').innerHTML=t.title;document.querySelector('.hero-copy h1+p').textContent=t.text;document.querySelector('[data-i18n="newsTitle"]').textContent=t.news};
document.querySelector('#languageToggle').addEventListener('click',updateHero);updateHero();
const demos={portfolio:{score:'84.2',change:'+ 6.4%',title:'Projected climate-adjusted alpha',allocation:'ESG 65% · TAIEX FUT 20% · EUA 15%',market:'TAIEX / ESG PORTFOLIO',path:'M0,155 C55,142 70,160 112,135 S180,80 218,105 S267,132 303,94 S367,48 402,70 S455,122 492,66 S560,35 600,18'},futures:{score:'91.6',change:'+ 9.1%',title:'Futures hedge impact simulation',allocation:'WTI 30% · GOLD 25% · EUA 25% · CASH 20%',market:'GLOBAL CLIMATE FUTURES',path:'M0,139 C55,157 73,95 115,122 S171,48 220,99 S282,76 318,62 S370,111 410,48 S489,86 530,40 S570,29 600,24'},global:{score:'78.9',change:'+ 3.8%',title:'Global portfolio risk projection',allocation:'US EQ 40% · APAC 30% · EU EQ 15% · HEDGE 15%',market:'GLOBAL EQUITY / CLIMATE RISK',path:'M0,152 C44,130 70,105 112,128 S181,82 222,115 S276,140 319,95 S383,116 419,77 S470,101 507,58 S557,78 600,38'}};
document.querySelectorAll('.demo-tabs button').forEach(button=>button.addEventListener('click',()=>{const d=demos[button.dataset.demo];document.querySelectorAll('.demo-tabs button').forEach(x=>x.classList.remove('active'));button.classList.add('active');document.querySelector('.demo-score').textContent=d.score;document.querySelector('.demo-change').textContent=d.change;document.querySelector('.demo-chart-title').textContent=d.title;document.querySelector('.demo-allocation').textContent=d.allocation;document.querySelector('.demo-market').textContent=d.market;const line=document.querySelector('.chart-line'),fill=document.querySelector('.chart-fill');line.setAttribute('d',d.path);fill.setAttribute('d',d.path+' L600,190 L0,190Z')}));
document.querySelectorAll('.stock-row').forEach(stock=>stock.addEventListener('click',()=>{document.querySelectorAll('.stock-row').forEach(x=>x.classList.remove('selected'));stock.classList.add('selected');const code=stock.querySelector('b').textContent,name=stock.querySelector('span').textContent,price=stock.querySelector('em').textContent;document.querySelector('.quant-title b').textContent=`${code} · ${name}`;document.querySelector('.demo-market').textContent=`${code} / AI QUANT SIGNAL`;document.querySelector('.demo-chart-title').textContent=`${name} climate-adjusted price momentum`;document.querySelector('.demo-score').textContent=code==='2454'?'74.2':code==='TAIEX'?'81.6':'86.4';document.querySelector('.demo-change').textContent=stock.querySelector('i').textContent;document.querySelector('.quant-title strong').firstChild.textContent=code==='2454'?'74.2 ':code==='TAIEX'?'81.6 ':'86.4 '}));

const renderCandles=(seed=2330)=>{
  const svg=document.querySelector('.quant-demo .chart svg');
  if(!svg)return;
  svg.querySelectorAll('.k-candles,.k-volume,.k-average').forEach(node=>node.remove());
  const ns='http://www.w3.org/2000/svg',candles=document.createElementNS(ns,'g'),volume=document.createElementNS(ns,'g'),average=document.createElementNS(ns,'path');
  candles.setAttribute('class','k-candles');volume.setAttribute('class','k-volume');average.setAttribute('class','k-average');
  const values=[];let close=118+(seed%17),state=(seed%97)+11;
  const random=()=>{state=(state*9301+49297)%233280;return state/233280};
  for(let index=0;index<24;index++){
    const open=close+(random()-.48)*7,trend=(index<7?.9:index<14?-.28:1.05),next=open+(random()-.43)*9+trend,high=Math.max(open,next)+random()*5+1,low=Math.min(open,next)-random()*5-1;
    close=next;values.push({open,close,high,low,vol:random()*22+8});
  }
  const max=Math.max(...values.map(v=>v.high)),min=Math.min(...values.map(v=>v.low)),scale=value=>18+(max-value)/(max-min)*119;
  const step=600/values.length,ma=[];
  values.forEach((value,index)=>{
    const x=index*step+step/2,up=value.close>=value.open,kind=Math.abs(value.close-value.open)<.45?'flat':up?'up':'down',group=document.createElementNS(ns,'g'),wick=document.createElementNS(ns,'line'),body=document.createElementNS(ns,'rect');
    group.setAttribute('class',kind);wick.setAttribute('class','wick');wick.setAttribute('x1',x);wick.setAttribute('x2',x);wick.setAttribute('y1',scale(value.high));wick.setAttribute('y2',scale(value.low));body.setAttribute('class','body');body.setAttribute('x',x-step*.29);body.setAttribute('width',step*.58);body.setAttribute('y',Math.min(scale(value.open),scale(value.close)));body.setAttribute('height',Math.max(2,Math.abs(scale(value.open)-scale(value.close))));group.append(wick,body);candles.append(group);
    const bar=document.createElementNS(ns,'rect');bar.setAttribute('class',up?'up':'down');bar.setAttribute('x',x-step*.3);bar.setAttribute('width',step*.6);bar.setAttribute('y',184-value.vol);bar.setAttribute('height',value.vol);volume.append(bar);
    const from=Math.max(0,index-4),slice=values.slice(from,index+1),mean=slice.reduce((sum,item)=>sum+item.close,0)/slice.length;ma.push(`${index?'L':'M'}${x.toFixed(1)},${scale(mean).toFixed(1)}`);
  });
  average.setAttribute('d',ma.join(' '));
  const fill=svg.querySelector('.chart-fill');svg.insertBefore(volume,fill);svg.insertBefore(candles,fill);svg.insertBefore(average,fill);
  const chart=svg.closest('.chart');if(chart&&!chart.querySelector('.chart-legend')){const legend=document.createElement('div');legend.className='chart-legend';legend.innerHTML='<i class="up">● 上漲</i><i class="down">● 下跌</i><i class="ma">— MA5</i>';chart.append(legend)}
};
renderCandles();
document.querySelectorAll('.demo-tabs button').forEach((button,index)=>button.addEventListener('click',()=>renderCandles([2330,8801,7003][index])));
document.querySelectorAll('.stock-row').forEach(stock=>stock.addEventListener('click',()=>renderCandles([...stock.querySelector('b').textContent].reduce((sum,char)=>sum+char.charCodeAt(0),0))));

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

  let partnerDragging = false;
  let partnerStartX = 0;
  let partnerStartScroll = 0;
  let partnerResumeAt = 0;
  const pausePartnerAuto = () => { partnerResumeAt = performance.now() + 2800; };
  partnerTrack.addEventListener('pointerdown', event => {
    partnerDragging = true;
    partnerStartX = event.clientX;
    partnerStartScroll = partnerTrack.scrollLeft;
    partnerTrack.setPointerCapture(event.pointerId);
    partnerTrack.classList.add('is-dragging');
    pausePartnerAuto();
  });
  partnerTrack.addEventListener('pointermove', event => {
    if (!partnerDragging) return;
    partnerTrack.scrollLeft = partnerStartScroll - (event.clientX - partnerStartX);
  });
  const endPartnerDrag = event => {
    if (!partnerDragging) return;
    partnerDragging = false;
    if (event.pointerId != null && partnerTrack.hasPointerCapture(event.pointerId)) partnerTrack.releasePointerCapture(event.pointerId);
    partnerTrack.classList.remove('is-dragging');
    pausePartnerAuto();
  };
  partnerTrack.addEventListener('pointerup', endPartnerDrag);
  partnerTrack.addEventListener('pointercancel', endPartnerDrag);
  partnerTrack.addEventListener('wheel', pausePartnerAuto, { passive:true });
  partnerTrack.addEventListener('mouseenter', pausePartnerAuto);

  let partnerLastFrame = performance.now();
  const animatePartners = now => {
    const elapsed = Math.min(40, now - partnerLastFrame);
    partnerLastFrame = now;
    if (!partnerDragging && now > partnerResumeAt && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      partnerTrack.scrollLeft += elapsed * .035;
      const midpoint = partnerTrack.scrollWidth / 2;
      if (partnerTrack.scrollLeft >= midpoint) partnerTrack.scrollLeft -= midpoint;
    }
    requestAnimationFrame(animatePartners);
  };
  requestAnimationFrame(animatePartners);
}

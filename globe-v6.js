(() => {
  const canvas = document.querySelector('.globe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0, radius = 0;
  let centerLon = 120, centerLat = 12;
  let dragging = false, lastX = 0, lastY = 0, lastTime = performance.now();

  const continents = [
    [[-168,70],[-140,70],[-120,55],[-100,50],[-82,25],[-97,15],[-118,30],[-135,45],[-168,58]],
    [[-82,12],[-68,8],[-50,-5],[-38,-22],[-54,-52],[-72,-45],[-80,-15]],
    [[-12,36],[5,45],[28,42],[38,30],[34,5],[20,-35],[2,-33],[-14,5]],
    [[-10,72],[35,72],[72,60],[110,68],[155,55],[145,38],[120,24],[105,8],[78,8],[55,25],[35,34],[12,38]],
    [[112,-12],[154,-10],[150,-40],[118,-36]],
    [[-52,82],[-20,76],[-28,60],[-50,62]],
    [[95,20],[110,24],[122,18],[130,5],[119,-8],[105,1]],
    [[130,34],[142,45],[147,39],[139,30]]
  ];
  const locations = [
    {lon:121,lat:24,label:'TAIWAN',value:'RISK 24.6'},
    {lon:140,lat:36,label:'TOKYO',value:'NIKKEI FUT'},
    {lon:-74,lat:41,label:'NEW YORK',value:'S&P 500'},
    {lon:0,lat:52,label:'LONDON',value:'FTSE FUT'},
    {lon:104,lat:1,label:'SINGAPORE',value:'SGX'},
    {lon:12,lat:49,label:'EUROPE',value:'EUA €71.48'}
  ];
  const rad = value => value * Math.PI / 180;
  const project = (lon, lat) => {
    const lambda = rad(lon - centerLon), phi = rad(lat), phi0 = rad(centerLat);
    const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);
    const visible = Math.sin(phi0) * sinPhi + Math.cos(phi0) * cosPhi * Math.cos(lambda);
    return {
      x: width / 2 + radius * cosPhi * Math.sin(lambda),
      y: height / 2 - radius * (Math.cos(phi0) * sinPhi - Math.sin(phi0) * cosPhi * Math.cos(lambda)),
      visible
    };
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width; height = rect.height; radius = Math.min(width, height) * .455;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const drawCurve = points => {
    let drawing = false;
    ctx.beginPath();
    points.forEach(([lon, lat]) => {
      const p = project(lon, lat);
      if (p.visible > 0) { drawing ? ctx.lineTo(p.x,p.y) : ctx.moveTo(p.x,p.y); drawing = true; }
      else drawing = false;
    });
    ctx.stroke();
  };
  const draw = now => {
    if (!dragging) centerLon = (centerLon + Math.min((now - lastTime) * .006, .35) + 540) % 360 - 180;
    lastTime = now;
    ctx.clearRect(0,0,width,height);
    const cx=width/2, cy=height/2;
    const ocean = ctx.createRadialGradient(cx-radius*.38,cy-radius*.42,radius*.06,cx,cy,radius);
    ocean.addColorStop(0,'#b7ef55'); ocean.addColorStop(.22,'#568f38'); ocean.addColorStop(.63,'#163c2e'); ocean.addColorStop(1,'#06120f');
    ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.fillStyle=ocean; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx,cy,radius,0,Math.PI*2); ctx.clip();
    ctx.strokeStyle='rgba(192,255,104,.22)'; ctx.lineWidth=1;
    for(let lat=-75;lat<=75;lat+=15){const pts=[];for(let lon=-180;lon<=180;lon+=3)pts.push([lon,lat]);drawCurve(pts);}
    for(let lon=-180;lon<180;lon+=15){const pts=[];for(let lat=-88;lat<=88;lat+=3)pts.push([lon,lat]);drawCurve(pts);}
    continents.forEach(poly => {
      const visible = poly.map(([lon,lat]) => ({...project(lon,lat),lon,lat})).filter(p=>p.visible>-.08);
      if(visible.length<3)return;
      ctx.beginPath(); visible.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)); ctx.closePath();
      const land=ctx.createLinearGradient(cx-radius,cy-radius,cx+radius,cy+radius);
      land.addColorStop(0,'rgba(199,255,93,.9)'); land.addColorStop(1,'rgba(73,142,53,.72)');
      ctx.fillStyle=land; ctx.fill(); ctx.strokeStyle='rgba(219,255,139,.42)'; ctx.lineWidth=1; ctx.stroke();
    });
    locations.forEach(location => {
      const p=project(location.lon,location.lat); if(p.visible<.12)return;
      const alpha=Math.min(1,(p.visible-.1)*2.2);
      ctx.globalAlpha=alpha; ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='#d7ff63';ctx.fill();
      ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.strokeStyle='rgba(215,255,99,.35)';ctx.stroke();
      ctx.font='600 9px DM Mono, monospace';ctx.fillStyle='#efffd1';ctx.fillText(location.label,p.x+13,p.y-3);
      ctx.font='8px DM Mono, monospace';ctx.fillStyle='#baff39';ctx.fillText(location.value,p.x+13,p.y+9);
      ctx.globalAlpha=1;
    });
    const shade=ctx.createLinearGradient(cx-radius,cy,cx+radius,cy);
    shade.addColorStop(0,'rgba(255,255,255,.08)');shade.addColorStop(.5,'rgba(0,0,0,0)');shade.addColorStop(1,'rgba(0,0,0,.58)');
    ctx.fillStyle=shade;ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);ctx.restore();
    ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.strokeStyle='rgba(190,255,88,.65)';ctx.lineWidth=1.5;ctx.stroke();
    requestAnimationFrame(draw);
  };
  canvas.addEventListener('pointerdown', event => { event.stopPropagation(); dragging=true;lastX=event.clientX;lastY=event.clientY;canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', event => { event.stopPropagation(); if(!dragging)return;centerLon-= (event.clientX-lastX)*.42;centerLat=Math.max(-55,Math.min(55,centerLat+(event.clientY-lastY)*.28));lastX=event.clientX;lastY=event.clientY; });
  const stop = event => { event.stopPropagation(); dragging=false; };
  canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);
  new ResizeObserver(resize).observe(canvas); resize(); requestAnimationFrame(draw);
})();

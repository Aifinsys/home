(() => {
  const canvas = document.querySelector('.globe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const texture = new Image();
  const sphere = document.createElement('canvas');
  const sctx = sphere.getContext('2d');
  const cloudMap = document.createElement('canvas');
  const cloudCtx = cloudMap.getContext('2d');
  cloudMap.width = 480;
  cloudMap.height = 240;
  texture.src = 'assets/earth-blue-marble.png';

  let earthPixels = null;
  let textureWidth = 0;
  let textureHeight = 0;
  let cloudPixels = null;
  let width = 0;
  let height = 0;
  let radius = 0;
  let centerLon = 120;
  let centerLat = 12;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = performance.now();
  let zoom = 1;
  let clouds = true;
  let cloudTime = 0;
  let lastCloudFrame = -1;
  let pinchDistance = 0;
  let pinchZoom = 1;

  const locations = [
    { lon: 121, lat: 24, label: 'TAIWAN', value: 'RISK 24.6' },
    { lon: 140, lat: 36, label: 'TOKYO', value: 'NIKKEI FUT' },
    { lon: -74, lat: 41, label: 'NEW YORK', value: 'S&P 500' },
    { lon: 0, lat: 52, label: 'LONDON', value: 'FTSE FUT' },
    { lon: 104, lat: 1, label: 'SINGAPORE', value: 'SGX' },
    { lon: 12, lat: 49, label: 'EUROPE', value: 'EUA €71.48' }
  ];

  const rad = value => value * Math.PI / 180;
  const smooth = value => value * value * (3 - 2 * value);
  const hash = (x, y, seed = 0) => {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const noise = (x, y, seed = 0) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed);
    const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
    const top = a + (b - a) * xf;
    const bottom = c + (d - c) * xf;
    return top + (bottom - top) * yf;
  };
  const fbm = (x, y) => {
    let value = 0, amplitude = .55, frequency = 1;
    for (let octave = 0; octave < 5; octave++) {
      value += noise(x * frequency, y * frequency, octave + 9) * amplitude;
      frequency *= 2.04;
      amplitude *= .48;
    }
    return value;
  };

  const project = (lon, lat) => {
    const lambda = rad(lon - centerLon), phi = rad(lat), phi0 = rad(centerLat);
    const cp = Math.cos(phi), sp = Math.sin(phi);
    const visible = Math.sin(phi0) * sp + Math.cos(phi0) * cp * Math.cos(lambda);
    return {
      x: width / 2 + radius * cp * Math.sin(lambda),
      y: height / 2 - radius * (Math.cos(phi0) * sp - Math.sin(phi0) * cp * Math.cos(lambda)),
      visible
    };
  };

  const updateReadout = () => {
    const label = document.querySelector('.globe-readout em');
    if (label) label.textContent = Math.round(zoom * 100) + '%';
  };
  const setZoom = value => {
    zoom = Math.max(.72, Math.min(1.62, value));
    radius = Math.min(width, height) * .315 * zoom;
    updateReadout();
  };
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    setZoom(zoom);
  };

  texture.addEventListener('load', () => {
    const source = document.createElement('canvas');
    source.width = texture.naturalWidth;
    source.height = texture.naturalHeight;
    const sourceContext = source.getContext('2d', { willReadFrequently: true });
    sourceContext.drawImage(texture, 0, 0);
    textureWidth = source.width;
    textureHeight = source.height;
    earthPixels = sourceContext.getImageData(0, 0, textureWidth, textureHeight).data;
  });

  const cycloneWarp = (lon, lat, centerX, centerY, strength) => {
    let dx = lon - centerX;
    if (dx > 180) dx -= 360;
    if (dx < -180) dx += 360;
    const dy = lat - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, 1 - distance / 32);
    const angle = influence * strength * (1 - distance / 40);
    const c = Math.cos(angle), s = Math.sin(angle);
    return { x: centerX + dx * c - dy * s, y: centerY + dx * s + dy * c, influence };
  };

  const buildCloudMap = () => {
    const image = cloudCtx.createImageData(cloudMap.width, cloudMap.height);
    const pixels = image.data;
    for (let y = 0; y < cloudMap.height; y++) {
      const lat = 90 - y / cloudMap.height * 180;
      for (let x = 0; x < cloudMap.width; x++) {
        const lon = x / cloudMap.width * 360 - 180;
        let warpedLon = lon + cloudTime * (Math.abs(lat) > 25 ? .75 : 1.15);
        let warpedLat = lat;
        const pacific = cycloneWarp(warpedLon, warpedLat, 148 + cloudTime * .28, 18, 3.9);
        const atlantic = cycloneWarp(pacific.x, pacific.y, -62 + cloudTime * .22, 27, -3.5);
        warpedLon = atlantic.x;
        warpedLat = atlantic.y;
        const latitudeBand = .5 + .5 * Math.sin(rad(warpedLon * 2.25 + warpedLat * 4.1 + cloudTime * 1.4));
        const broad = fbm((warpedLon + 240) / 42, (warpedLat + 120) / 31);
        const detail = fbm((warpedLon + 390) / 15, (warpedLat + 180) / 12);
        const polarFade = Math.max(0, 1 - Math.pow(Math.abs(lat) / 94, 5));
        const stormBoost = Math.max(pacific.influence, atlantic.influence) * .22;
        let density = broad * .72 + detail * .34 + latitudeBand * .09 + stormBoost - .68;
        density = Math.max(0, Math.min(1, density * 3.15)) * polarFade;
        density = smooth(density);
        const index = (y * cloudMap.width + x) * 4;
        const brightness = 226 + Math.round(detail * 29);
        pixels[index] = brightness;
        pixels[index + 1] = Math.min(255, brightness + 5);
        pixels[index + 2] = 255;
        pixels[index + 3] = Math.round(density * 205);
      }
    }
    cloudCtx.putImageData(image, 0, 0);
    cloudCtx.filter = 'blur(1.3px) contrast(1.12)';
    cloudCtx.drawImage(cloudMap, 0, 0);
    cloudCtx.filter = 'none';
    cloudPixels = cloudCtx.getImageData(0, 0, cloudMap.width, cloudMap.height).data;
  };

  const renderEarth = (cx, cy) => {
    if (!earthPixels) return false;
    const size = Math.max(190, Math.min(520, Math.round(radius * 1.42)));
    if (sphere.width !== size) { sphere.width = size; sphere.height = size; }
    const frame = sctx.createImageData(size, size);
    const pixels = frame.data;
    const phi0 = rad(centerLat), c0 = Math.cos(phi0), s0 = Math.sin(phi0);
    for (let y = 0; y < size; y++) {
      const ny = 1 - (y + .5) / size * 2;
      for (let x = 0; x < size; x++) {
        const nx = (x + .5) / size * 2 - 1;
        const rr = nx * nx + ny * ny;
        if (rr > 1) continue;
        const nz = Math.sqrt(1 - rr);
        const phi = Math.asin(Math.max(-1, Math.min(1, ny * c0 + nz * s0)));
        const lambda = Math.atan2(nx, nz * c0 - ny * s0);
        let lon = centerLon + lambda * 180 / Math.PI;
        lon = ((lon + 180) % 360 + 360) % 360 - 180;
        const lat = phi * 180 / Math.PI;
        const tx = Math.min(textureWidth - 1, Math.max(0, Math.floor((lon + 180) / 360 * textureWidth)));
        const ty = Math.min(textureHeight - 1, Math.max(0, Math.floor((90 - lat) / 180 * textureHeight)));
        const sourceIndex = (ty * textureWidth + tx) * 4;
        const destinationIndex = (y * size + x) * 4;
        const light = Math.max(.16, Math.min(1.08, .28 + nz * .8 - nx * .24 - ny * .07));
        const atmosphere = Math.pow(1 - nz, 3) * .48;
        let red = earthPixels[sourceIndex] * light + 48 * atmosphere;
        let green = earthPixels[sourceIndex + 1] * light + 128 * atmosphere;
        let blue = earthPixels[sourceIndex + 2] * light + 235 * atmosphere;
        if (clouds && cloudPixels) {
          const cloudX = Math.min(cloudMap.width - 1, Math.max(0, Math.floor((lon + 180) / 360 * cloudMap.width)));
          const cloudY = Math.min(cloudMap.height - 1, Math.max(0, Math.floor((90 - lat) / 180 * cloudMap.height)));
          const cloudIndex = (cloudY * cloudMap.width + cloudX) * 4;
          const alpha = cloudPixels[cloudIndex + 3] / 255 * Math.max(.45, nz);
          red = red * (1 - alpha) + cloudPixels[cloudIndex] * light * alpha;
          green = green * (1 - alpha) + cloudPixels[cloudIndex + 1] * light * alpha;
          blue = blue * (1 - alpha) + cloudPixels[cloudIndex + 2] * light * alpha;
        }
        pixels[destinationIndex] = Math.min(255, red);
        pixels[destinationIndex + 1] = Math.min(255, green);
        pixels[destinationIndex + 2] = Math.min(255, blue);
        pixels[destinationIndex + 3] = 255;
      }
    }
    sctx.putImageData(frame, 0, 0);
    ctx.drawImage(sphere, cx - radius, cy - radius, radius * 2, radius * 2);
    return true;
  };

  const curve = points => {
    let drawing = false;
    ctx.beginPath();
    points.forEach(([lon, lat]) => {
      const point = project(lon, lat);
      if (point.visible > 0) {
        drawing ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y);
        drawing = true;
      } else drawing = false;
    });
    ctx.stroke();
  };

  const draw = now => {
    const delta = Math.min(now - lastTime, 60);
    if (!dragging) centerLon = (centerLon + delta * .006 + 540) % 360 - 180;
    cloudTime += delta * .00055;
    const cloudFrame = Math.floor(cloudTime * 2);
    if (cloudFrame !== lastCloudFrame) { buildCloudMap(); lastCloudFrame = cloudFrame; }
    lastTime = now;
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height / 2;
    const halo = ctx.createRadialGradient(cx, cy, radius * .78, cx, cy, radius * 1.12);
    halo.addColorStop(.78, 'rgba(53,142,255,0)');
    halo.addColorStop(.91, 'rgba(85,177,255,.3)');
    halo.addColorStop(1, 'rgba(85,177,255,0)');
    ctx.beginPath(); ctx.arc(cx, cy, radius * 1.12, 0, Math.PI * 2); ctx.fillStyle = halo; ctx.fill();
    renderEarth(cx, cy);
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
    ctx.strokeStyle = 'rgba(177,226,255,.09)'; ctx.lineWidth = .65;
    for (let lat = -75; lat <= 75; lat += 15) { const points = []; for (let lon = -180; lon <= 180; lon += 3) points.push([lon, lat]); curve(points); }
    for (let lon = -180; lon < 180; lon += 15) { const points = []; for (let lat = -88; lat <= 88; lat += 3) points.push([lon, lat]); curve(points); }
    locations.forEach(location => {
      const point = project(location.lon, location.lat);
      if (point.visible < .12) return;
      ctx.globalAlpha = Math.min(1, (point.visible - .1) * 2.2);
      ctx.beginPath(); ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#d7ff63'; ctx.fill();
      ctx.beginPath(); ctx.arc(point.x, point.y, 10, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(215,255,99,.5)'; ctx.stroke();
      ctx.font = '600 9px DM Mono, monospace'; ctx.fillStyle = '#efffd1'; ctx.fillText(location.label, point.x + 13, point.y - 3);
      ctx.font = '8px DM Mono, monospace'; ctx.fillStyle = '#baff39'; ctx.fillText(location.value, point.x + 13, point.y + 9);
      ctx.globalAlpha = 1;
    });
    const shade = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
    shade.addColorStop(0, 'rgba(164,219,255,.04)'); shade.addColorStop(.45, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(0,3,10,.72)');
    ctx.fillStyle = shade; ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, radius + .8, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(105,190,255,.72)'; ctx.lineWidth = 2.2; ctx.stroke();
    requestAnimationFrame(draw);
  };

  canvas.addEventListener('pointerdown', event => { event.stopPropagation(); dragging = true; lastX = event.clientX; lastY = event.clientY; canvas.setPointerCapture(event.pointerId); });
  canvas.addEventListener('pointermove', event => { event.stopPropagation(); if (!dragging) return; centerLon -= (event.clientX - lastX) * .42; centerLat = Math.max(-70, Math.min(70, centerLat + (event.clientY - lastY) * .28)); lastX = event.clientX; lastY = event.clientY; });
  const stop = event => { event.stopPropagation(); dragging = false; };
  canvas.addEventListener('pointerup', stop); canvas.addEventListener('pointercancel', stop);
  canvas.addEventListener('wheel', event => { event.preventDefault(); setZoom(zoom + (event.deltaY < 0 ? .09 : -.09)); }, { passive: false });
  canvas.addEventListener('dblclick', event => { event.preventDefault(); setZoom(zoom >= 1.48 ? 1 : zoom + .18); });
  canvas.addEventListener('touchstart', event => { if (event.touches.length === 2) { pinchDistance = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY); pinchZoom = zoom; } }, { passive: true });
  canvas.addEventListener('touchmove', event => { if (event.touches.length === 2 && pinchDistance) { const distance = Math.hypot(event.touches[0].clientX - event.touches[1].clientX, event.touches[0].clientY - event.touches[1].clientY); setZoom(pinchZoom * distance / pinchDistance); } }, { passive: true });
  new ResizeObserver(resize).observe(canvas);
  resize();
  buildCloudMap();
  requestAnimationFrame(draw);
})();

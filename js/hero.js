/*
 * Hero animado
 * ------------
 * Grafo de nodos y aristas por el que viajan puntos verdes, como datos
 * recorriendo un pipeline. Es la versión a pantalla completa de
 * assets/banner-es.svg, dibujada en <canvas> y sin dependencias.
 *
 * - El grafo se genera en cada carga: una cuadrícula con ruido y huecos,
 *   donde cada nodo se une a sus vecinos más cercanos sin cruzar aristas.
 * - Unos pocos "pipelines" recorren el grafo de izquierda a derecha: el camino
 *   se ilumina, un punto lo atraviesa y luego se apaga para dar paso a otro.
 * - Se pausa cuando el hero no está a la vista y respeta
 *   prefers-reduced-motion (en ese caso dibuja un único cuadro quieto).
 */
(() => {
  'use strict';

  const canvas = document.querySelector('.hero-canvas');
  const hero = canvas && canvas.closest('.hero');
  if (!hero || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const layer = document.createElement('canvas'); // aristas y nodos: no cambian
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Colores del banner del README
  const EDGE = '#30363D';
  const NODE_FILL = '#0D1117';
  const NODE_STROKE = '#8B949E';
  const GREEN = '34, 197, 94'; // #22C55E, para usar con transparencia

  const TAU = Math.PI * 2;
  const SPEED = 120; // px por segundo, como en el banner

  let width = 0;
  let height = 0;
  let dpr = 1;
  let scale = 1;
  let nodeRadius = 7;
  let dotRadius = 3;
  let packetRadius = 4;
  let graphWidth = 0;
  let graphHeight = 0;

  let nodes = [];
  let edges = [];
  let neighbors = [];
  let pipes = [];

  let rafId = 0;
  let lastTime = 0;
  let inView = true;

  const rand = (min, max) => min + Math.random() * (max - min);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  /* ---------- Grafo ---------- */

  // ¿Se cruzan los segmentos ab y cd? (los que comparten un extremo no cuentan)
  function crosses(a, b, c, d) {
    if (a === c || a === d || b === c || b === d) return false;
    const side = (p, q, r) => Math.sign((q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x));
    return side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b);
  }

  function connect(i, j) {
    if (neighbors[i].includes(j)) return;
    const a = nodes[i];
    const b = nodes[j];
    if (edges.some(([k, l]) => crosses(a, b, nodes[k], nodes[l]))) return;
    edges.push([i, j]);
    neighbors[i].push(j);
    neighbors[j].push(i);
  }

  function buildGraph() {
    const cell = width < 640 ? 96 : 132;
    graphWidth = width;
    graphHeight = height + 160; // margen para que el hero pueda crecer un poco
    const cols = Math.ceil(graphWidth / cell) + 1;
    const rows = Math.ceil(graphHeight / cell) + 1;

    nodes = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (Math.random() < 0.3) continue; // huecos: que no parezca una cuadrícula
        nodes.push({
          x: (c + rand(-0.3, 0.3)) * cell,
          y: (r + rand(-0.3, 0.3)) * cell,
          phase: rand(0, TAU),
          flash: 0,
        });
      }
    }

    edges = [];
    neighbors = nodes.map(() => []);
    const maxDist = cell * 1.6;
    nodes.forEach((node, i) => {
      nodes
        .map((other, j) => ({ j, d: Math.hypot(other.x - node.x, other.y - node.y) }))
        .filter(({ j, d }) => j !== i && d < maxDist)
        .sort((a, b) => a.d - b.d)
        .slice(0, Math.random() < 0.4 ? 3 : 2)
        .forEach(({ j }) => connect(i, j));
    });
  }

  function paintLayer() {
    layer.width = canvas.width;
    layer.height = canvas.height;
    const g = layer.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    g.strokeStyle = EDGE;
    g.lineWidth = 1.2;
    g.beginPath();
    edges.forEach(([i, j]) => {
      g.moveTo(nodes[i].x, nodes[i].y);
      g.lineTo(nodes[j].x, nodes[j].y);
    });
    g.stroke();

    g.fillStyle = NODE_FILL;
    g.strokeStyle = NODE_STROKE;
    g.lineWidth = 1.5;
    nodes.forEach((n) => {
      g.beginPath();
      g.arc(n.x, n.y, nodeRadius, 0, TAU);
      g.fill();
      g.stroke();
    });
  }

  /* ---------- Pipelines ---------- */

  // Zona donde nacen los pipelines: a la derecha del texto en pantallas
  // anchas; en móvil, en la franja superior (el texto queda abajo).
  function region() {
    // yMin deja libre la franja de la cabecera
    return width >= 900
      ? { x0: width * 0.5, x1: width * 0.8, y0: height * 0.14, y1: height * 0.85, yMin: 100, yMax: height * 0.92 }
      : { x0: 0, x1: width * 0.55, y0: height * 0.06, y1: height * 0.36, yMin: 80, yMax: height * 0.44 };
  }

  // Camino aleatorio que siempre avanza hacia la derecha, sin pasar por los
  // nodos `busy` (los que ya usa otro pipeline)
  function randomPath(busy) {
    const r = region();
    const starts = [];
    nodes.forEach((n, i) => {
      if (n.x >= r.x0 && n.x <= r.x1 && n.y >= Math.max(r.y0, r.yMin) && n.y <= r.y1 && neighbors[i].length && !busy.has(i)) starts.push(i);
    });
    if (!starts.length) return null;

    for (let attempt = 0; attempt < 10; attempt++) {
      const path = [pick(starts)];
      while (path.length < 6) {
        const here = nodes[path[path.length - 1]];
        const options = neighbors[path[path.length - 1]].filter((j) => {
          const n = nodes[j];
          return n.x > here.x + 10 && n.x < width - 8 && n.y > r.yMin && n.y < r.yMax && !busy.has(j);
        });
        if (!options.length) break;
        path.push(pick(options));
      }
      if (path.length >= 3) return path;
    }
    return null;
  }

  function newPipe(delay) {
    return { state: 'wait', timer: delay, alpha: 0, path: [], points: [], cum: [0], total: 0, d: 0, next: 1 };
  }

  function launch(pipe) {
    const busy = new Set();
    pipes.forEach((p) => {
      if (p !== pipe && p.state !== 'wait') p.path.forEach((i) => busy.add(i));
    });
    const path = randomPath(busy);
    if (!path) {
      pipe.state = 'wait';
      pipe.timer = 1;
      return false;
    }
    pipe.path = path;
    pipe.points = path.map((i) => nodes[i]);
    pipe.cum = [0];
    for (let k = 1; k < pipe.points.length; k++) {
      const a = pipe.points[k - 1];
      const b = pipe.points[k];
      pipe.cum.push(pipe.cum[k - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }
    pipe.total = pipe.cum[pipe.cum.length - 1];
    pipe.d = 0;
    pipe.next = 1;
    pipe.alpha = 0;
    pipe.state = 'in';
    return true;
  }

  function pointAt(pipe, d) {
    const { points, cum } = pipe;
    let k = 1;
    while (k < cum.length - 1 && cum[k] < d) k++;
    const a = points[k - 1];
    const b = points[k];
    const t = Math.min(1, Math.max(0, (d - cum[k - 1]) / (cum[k] - cum[k - 1] || 1)));
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  // Ciclo de cada pipeline: wait → in (se ilumina) → run (viaja el dato) → out (se apaga)
  function update(dt) {
    nodes.forEach((n) => {
      if (n.flash > 0) n.flash = Math.max(0, n.flash - dt * 1.4);
    });

    pipes.forEach((p) => {
      if (p.state === 'wait') {
        p.timer -= dt;
        if (p.timer <= 0) launch(p);
      } else if (p.state === 'in') {
        p.alpha = Math.min(1, p.alpha + dt / 0.6);
        if (p.alpha === 1) {
          p.state = 'run';
          p.points[0].flash = 1;
        }
      } else if (p.state === 'run') {
        p.d += SPEED * scale * dt;
        while (p.next < p.points.length && p.d >= p.cum[p.next]) {
          p.points[p.next].flash = 1; // el nodo se enciende al recibir el dato
          p.next++;
        }
        if (p.d >= p.total) p.state = 'out';
      } else if (p.state === 'out') {
        p.alpha = Math.max(0, p.alpha - dt / 0.9);
        if (p.alpha === 0) {
          p.state = 'wait';
          p.timer = rand(0.3, 2);
        }
      }
    });
  }

  /* ---------- Dibujo ---------- */

  // `time` en segundos, o null para un cuadro quieto
  function draw(time) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(layer, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Caminos activos, recortados para no pisar los nodos
    ctx.lineWidth = 1.6;
    pipes.forEach((p) => {
      if (p.alpha <= 0 || p.points.length < 2) return;
      ctx.strokeStyle = `rgba(${GREEN}, ${(0.45 * p.alpha).toFixed(3)})`;
      ctx.beginPath();
      for (let k = 1; k < p.points.length; k++) {
        const a = p.points[k - 1];
        const b = p.points[k];
        const len = p.cum[k] - p.cum[k - 1] || 1;
        const gx = ((b.x - a.x) / len) * (nodeRadius + 1);
        const gy = ((b.y - a.y) / len) * (nodeRadius + 1);
        ctx.moveTo(a.x + gx, a.y + gy);
        ctx.lineTo(b.x - gx, b.y - gy);
      }
      ctx.stroke();
    });

    // Centro verde de cada nodo: late suave y se enciende cuando pasa un dato
    nodes.forEach((n) => {
      const pulse = time === null ? 0.5 : 0.5 + 0.5 * Math.sin((time * TAU) / 3 + n.phase);
      const alpha = Math.min(1, 0.1 + 0.4 * pulse + 0.8 * n.flash);
      ctx.fillStyle = `rgba(${GREEN}, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, dotRadius, 0, TAU);
      ctx.fill();
    });

    // Paquetes de datos
    pipes.forEach((p) => {
      if ((p.state !== 'in' && p.state !== 'run') || p.points.length < 2) return;
      const { x, y } = pointAt(p, p.d);
      ctx.fillStyle = `rgba(${GREEN}, ${(0.14 * p.alpha).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, packetRadius * 2.6, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgba(${GREEN}, ${p.alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, packetRadius, 0, TAU);
      ctx.fill();
    });
  }

  // Movimiento reducido: pipelines fijos con su dato a mitad de camino
  function drawStill() {
    nodes.forEach((n) => { n.flash = 0; });
    pipes.forEach((p) => {
      p.state = 'wait';
      p.alpha = 0;
    });
    pipes.forEach((p) => {
      if (!launch(p)) return;
      p.state = 'run';
      p.alpha = 1;
      p.d = p.total * rand(0.3, 0.7);
    });
    draw(null);
  }

  /* ---------- Bucle ---------- */

  function frame(now) {
    const t = now / 1000;
    const dt = Math.min(0.05, Math.max(0, t - lastTime));
    lastTime = t;
    update(dt);
    draw(t);
    rafId = requestAnimationFrame(frame);
  }

  function sync() {
    const animate = inView && !document.hidden && !reducedMotion.matches;
    if (animate && !rafId) {
      lastTime = performance.now() / 1000;
      rafId = requestAnimationFrame(frame);
    } else if (!animate && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function resetPipes() {
    pipes = Array.from({ length: width < 640 ? 3 : 4 }, (_, i) => newPipe(0.2 + i * 1.1));
  }

  function resize() {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    if (!w || !h || (w === width && h === height)) return;
    width = w;
    height = h;
    dpr = Math.min(window.devicePixelRatio || 1, width > 1400 ? 1.5 : 2);
    scale = width < 640 ? 0.85 : 1;
    nodeRadius = 7 * scale;
    dotRadius = 3 * scale;
    packetRadius = 4 * scale;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // Solo se regenera el grafo si cambia el ancho o el alto supera lo
    // generado; así el hero no "salta" por cambios pequeños de altura.
    if (width !== graphWidth || height > graphHeight) {
      buildGraph();
      resetPipes();
    }
    paintLayer();

    if (reducedMotion.matches) drawStill();
    else draw(performance.now() / 1000);
  }

  /* ---------- Inicio ---------- */

  resize();

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  };
  if ('ResizeObserver' in window) new ResizeObserver(onResize).observe(hero);
  else window.addEventListener('resize', onResize);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    }).observe(hero);
  }

  document.addEventListener('visibilitychange', sync);

  const onMotionChange = () => {
    if (reducedMotion.matches) drawStill();
    else resetPipes();
    sync();
  };
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionChange);
  else if (reducedMotion.addListener) reducedMotion.addListener(onMotionChange);

  sync();
})();

/* ============================================================
   CONFIG
   ============================================================ */

const START_DATE = new Date(2025, 8, 27); // 27 de Setembro de 2025

const FOTOS = [
  'WhatsApp Image 2026-06-11 at 22.48.18.jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.19.jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.19 (1).jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.19 (2).jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.20.jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.21.jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.21 (1).jpeg',
  'WhatsApp Image 2026-06-11 at 22.48.40.jpeg',
];

/* ============================================================
   CALCULOS DE TEMPO
   ============================================================ */

function calcularTempo() {
  const hoje = new Date();
  const diff = hoje - START_DATE;
  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const semanas = Math.floor(dias / 7);
  const meses = Math.floor(dias / 30.44);
  const horas = dias * 24;
  return { dias, semanas, meses, horas };
}

function getSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5)  return { icon: '🌸', label: 'Primavera', caption: 'Florescendo juntos todos os dias.' };
  if (m >= 6 && m <= 8)  return { icon: '☀️', label: 'Inverno', caption: 'Aquecendo cada dia juntos.' };
  if (m >= 9 && m <= 11) return { icon: '🍂', label: 'Primavera', caption: 'Florescendo juntos todos os dias.' };
  return { icon: '⭐', label: 'Verão', caption: 'Brilhando juntos todos os dias.' };
}

/* ============================================================
   FOTO DISCOVERY
   ============================================================ */

async function descobrirFotos() {
  if (FOTOS.length > 0) return FOTOS.map(f => `img/${f}`);
  try {
    const res = await fetch('./img/');
    if (res.ok) {
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const fotos = [];
      doc.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href') || '';
        if (/\.(jpe?g|png|webp|gif)$/i.test(href) && !href.startsWith('?')) {
          fotos.push(`img/${decodeURIComponent(href)}`);
        }
      });
      if (fotos.length > 0) return fotos;
    }
  } catch (_) {}
  return gerarPlaceholders(8);
}

function gerarPlaceholders(n) {
  const configs = [
    { c1: '#ff6b9d', c2: '#c44569', emoji: '❤️' },
    { c1: '#1DB954', c2: '#0f7d3c', emoji: '🎵' },
    { c1: '#667eea', c2: '#764ba2', emoji: '✨' },
    { c1: '#ff6b6b', c2: '#ee5a24', emoji: '🌹' },
    { c1: '#11998e', c2: '#38ef7d', emoji: '🌿' },
    { c1: '#f7971e', c2: '#ffd200', emoji: '⭐' },
    { c1: '#833ab4', c2: '#fd1d1d', emoji: '💫' },
    { c1: '#0f3460', c2: '#533483', emoji: '🌙' },
  ];
  return Array.from({ length: n }, (_, i) => {
    const { c1, c2, emoji } = configs[i % configs.length];
    const cv = document.createElement('canvas');
    cv.width = 800; cv.height = 600;
    const ctx = cv.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 800, 600);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = 'rgba(0,0,0,.15)';
    for (let y = 0; y < 600; y += 18) ctx.fillRect(0, y, 800, 1);
    ctx.font = '100px serif'; ctx.textAlign = 'center';
    ctx.fillText(emoji, 400, 290);
    ctx.font = 'bold 20px sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.fillText(`Foto ${i + 1}`, 400, 370);
    return cv.toDataURL('image/jpeg', .85);
  });
}

/* ============================================================
   PARTICLES (Story 01)
   ============================================================ */

class Particles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.active = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width  = this.canvas.offsetWidth  || 390;
    this.canvas.height = this.canvas.offsetHeight || 844;
  }
  spawn() {
    for (let i = 0; i < 60; i++) this.particles.push(this.newParticle(true));
  }
  newParticle(spread = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: spread ? Math.random() * this.canvas.height : this.canvas.height + 10,
      size: Math.random() * 4 + 1.5,
      vx: (Math.random() - .5) * .5,
      vy: -(Math.random() * .6 + .2),
      opacity: Math.random() * .35 + .05,
      color: Math.random() > .5 ? '#1DB954' : '#e91e8c',
      isHeart: Math.random() > .55,
    };
  }
  drawHeart(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * .3);
    ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * .3);
    ctx.bezierCurveTo(x - s, y + s * .7, x, y + s * 1.1, x, y + s * 1.35);
    ctx.bezierCurveTo(x, y + s * 1.1, x + s, y + s * .7, x + s, y + s * .3);
    ctx.bezierCurveTo(x + s, y, x, y, x, y + s * .3);
    ctx.fill();
  }
  tick() {
    if (!this.active) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.y < -20) this.particles[i] = this.newParticle();
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      if (p.isHeart) this.drawHeart(ctx, p.x, p.y, p.size);
      else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    requestAnimationFrame(() => this.tick());
  }
  start() { this.active = true; this.spawn(); this.tick(); }
  stop()  { this.active = false; }
}

/* ============================================================
   COUNTER ANIMATION
   ============================================================ */

function animateCounter(el, target, duration = 1800) {
  if (!el) return;
  const start = performance.now();
  const ease = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  const update = now => {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(ease(p) * target).toLocaleString('pt-BR');
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('pt-BR');
  };
  requestAnimationFrame(update);
}

/* ============================================================
   MUSIC PLAYER
   ============================================================ */

class MusicPlayer {
  constructor() {
    this.audio      = document.getElementById('bgMusic');
    this.playing    = false;
    this.audioCtx   = null;
    this.analyser   = null;
    this.source     = null;
    this.duration   = 232;
    this.fakeTime   = 0;
    this.fakeTimer  = null;
    this.audioReady = false;

    this.elPlay    = document.getElementById('btnPlay');
    this.elIconPlay  = document.getElementById('iconPlay');
    this.elIconPause = document.getElementById('iconPause');
    this.elFill    = document.getElementById('progressFill');
    this.elDot     = document.getElementById('progressDot');
    this.elCurrent = document.getElementById('tCurrent');
    this.elTotal   = document.getElementById('tTotal');
    this.elTrack   = document.getElementById('progressTrack');
    this.elVol     = document.getElementById('volFill');
    this.elVolTrack= document.getElementById('volTrack');
    this.artGlow   = document.getElementById('playerArtGlow');
    this.eqBars    = document.getElementById('eqBars');
    this.waveCanvas  = document.getElementById('waveCanvas');
    this.waveBarsCSS = document.getElementById('waveBarsCSS');

    this.audio.volume = 0.4;
    this.init();
  }

  init() {
    this.audio.addEventListener('loadedmetadata', () => {
      this.duration = this.audio.duration;
      if (this.elTotal) this.elTotal.textContent = this.formatTime(this.duration);
      this.audioReady = true;
    });
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => { this.audio.currentTime = 0; });
    this.audio.addEventListener('error', () => { this.audioReady = false; });

    if (this.elPlay) this.elPlay.addEventListener('click', () => this.toggle());

    const btnShuffle = document.getElementById('btnShuffle');
    const btnRepeat  = document.getElementById('btnRepeat');
    const btnNext    = document.getElementById('btnNext');
    const btnPrev    = document.getElementById('btnPrev');

    if (btnShuffle) btnShuffle.addEventListener('click', e => e.currentTarget.classList.toggle('active'));
    if (btnRepeat)  btnRepeat.addEventListener('click',  e => {
      e.currentTarget.classList.toggle('active');
      this.audio.loop = e.currentTarget.classList.contains('active');
    });
    if (btnNext) btnNext.addEventListener('click', () => {
      if (this.audioReady) this.audio.currentTime = Math.min(this.audio.currentTime + 10, this.duration);
      else { this.fakeTime = Math.min(this.fakeTime + 10, this.duration); this.updateProgressFake(); }
    });
    if (btnPrev) btnPrev.addEventListener('click', () => {
      if (this.audioReady) this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
      else { this.fakeTime = Math.max(this.fakeTime - 10, 0); this.updateProgressFake(); }
    });

    if (this.elTrack) this.elTrack.addEventListener('click', e => {
      const rect = this.elTrack.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      if (this.audioReady) this.audio.currentTime = pct * this.duration;
      else { this.fakeTime = pct * this.duration; this.updateProgressFake(); }
    });

    if (this.elVolTrack) this.elVolTrack.addEventListener('click', e => {
      const rect = this.elVolTrack.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.audio.volume = pct;
      if (this.elVol) this.elVol.style.width = (pct * 100) + '%';
    });
  }

  toggle() { this.playing ? this.pause() : this.play(); }

  async play() {
    try {
      await this.audio.play();
      this.playing = true;
      this.setupAudioCtx();
    } catch (_) {
      this.playing = true;
      this.startFake();
    }
    this.setPlayingUI(true);
  }

  pause() {
    this.audio.pause();
    clearInterval(this.fakeTimer);
    this.playing = false;
    this.setPlayingUI(false);
  }

  setupAudioCtx() {
    if (this.audioCtx) return;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.source = this.audioCtx.createMediaElementSource(this.audio);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      if (this.waveCanvas) {
        this.waveCanvas.classList.add('active');
        if (this.waveBarsCSS) this.waveBarsCSS.style.display = 'none';
        this.drawWave();
      }
    } catch (_) {}
  }

  drawWave() {
    if (!this.analyser || !this.waveCanvas) return;
    const canvas = this.waveCanvas;
    const ctx = canvas.getContext('2d');
    const bufLen = this.analyser.frequencyBinCount;
    const data = new Uint8Array(bufLen);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const loop = () => {
      if (!this.playing) return;
      requestAnimationFrame(loop);
      this.analyser.getByteFrequencyData(data);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barW = (canvas.width / bufLen) * 2.5;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const h = (data[i] / 255) * canvas.height;
        ctx.fillStyle = `hsla(${140 + (data[i] / 255) * 80}, 70%, 50%, .8)`;
        ctx.fillRect(x, canvas.height - h, barW - 1, h);
        x += barW;
      }
    };
    loop();
  }

  startFake() {
    clearInterval(this.fakeTimer);
    this.fakeTimer = setInterval(() => {
      if (!this.playing) return;
      this.fakeTime = (this.fakeTime + 1) % this.duration;
      this.updateProgressFake();
    }, 1000);
  }

  updateProgressFake() {
    const pct = (this.fakeTime / this.duration) * 100;
    if (this.elFill) this.elFill.style.width = pct + '%';
    if (this.elCurrent) this.elCurrent.textContent = this.formatTime(this.fakeTime);
  }

  updateProgress() {
    if (!this.audioReady) return;
    const pct = (this.audio.currentTime / this.duration) * 100;
    if (this.elFill) this.elFill.style.width = pct + '%';
    if (this.elCurrent) this.elCurrent.textContent = this.formatTime(this.audio.currentTime);
  }

  setPlayingUI(on) {
    if (this.elIconPlay)  this.elIconPlay.style.display  = on ? 'none'  : 'block';
    if (this.elIconPause) this.elIconPause.style.display = on ? 'block' : 'none';
    if (this.eqBars)      this.eqBars.classList.toggle('paused', !on);
    if (this.artGlow)     this.artGlow.classList.toggle('active', on);
    if (this.waveBarsCSS) this.waveBarsCSS.classList.toggle('paused', !on);
    if (!on && this.waveCanvas?.classList.contains('active')) {
      this.waveCanvas.getContext('2d').clearRect(0, 0, this.waveCanvas.width, this.waveCanvas.height);
    }
  }

  loadAlbumArt(src) {
    const img = document.getElementById('s3ArtImg');
    if (!img) return;
    const testImg = new Image();
    testImg.onload = () => { img.src = src; img.style.display = 'block'; };
    testImg.onerror = () => { img.src = src; };
    testImg.src = src;
  }

  formatTime(s) {
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }
}

/* ============================================================
   GALLERY (lightbox only)
   ============================================================ */

class Gallery {
  constructor(photos) {
    this.photos = photos;
    this.lbCurrent = 0;
    this.bindLightbox();
  }

  openLightbox(index) {
    this.lbCurrent = index;
    document.getElementById('lbImg').src = this.photos[index];
    document.getElementById('lightbox').classList.add('open');
    document.getElementById('lightbox').setAttribute('aria-hidden', 'false');
    document.dispatchEvent(new CustomEvent('lightbox:open'));
  }

  closeLightbox() {
    document.getElementById('lightbox').classList.remove('open');
    document.getElementById('lightbox').setAttribute('aria-hidden', 'true');
    document.dispatchEvent(new CustomEvent('lightbox:close'));
  }

  bindLightbox() {
    document.getElementById('lbClose').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lbBackdrop').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lbPrev').addEventListener('click', () => {
      this.lbCurrent = (this.lbCurrent - 1 + this.photos.length) % this.photos.length;
      document.getElementById('lbImg').src = this.photos[this.lbCurrent];
    });
    document.getElementById('lbNext').addEventListener('click', () => {
      this.lbCurrent = (this.lbCurrent + 1) % this.photos.length;
      document.getElementById('lbImg').src = this.photos[this.lbCurrent];
    });
    document.addEventListener('keydown', e => {
      if (!document.getElementById('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape')      this.closeLightbox();
      if (e.key === 'ArrowLeft')   document.getElementById('lbPrev').click();
      if (e.key === 'ArrowRight')  document.getElementById('lbNext').click();
    });
  }
}

/* ============================================================
   PHOTO COLLAGE BUILDER
   ============================================================ */

function buildCollage(photos, containerId, count, gallery) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';
  const slice = photos.slice(0, Math.min(count, photos.length));
  // If fewer photos than slots, repeat
  const items = Array.from({ length: count }, (_, i) => photos[i % photos.length]);
  items.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = `Foto ${i + 1}`;
    img.loading = 'eager';
    if (gallery) {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => gallery.openLightbox(i % photos.length));
    }
    el.appendChild(img);
  });
}

/* ============================================================
   TIMELINE BUILDER
   ============================================================ */

function buildTimeline() {
  const hoje = new Date();
  const events = [
    { date: new Date(2025, 8, 27),  title: 'O Começo de Tudo',          desc: 'O dia em que nossa história começou',   icon: '💫', special: true },
    { date: new Date(2025, 9, 27),  title: '1 Mês Juntos',              desc: 'Um mês de descobertas e carinho',       icon: '🌙' },
    { date: new Date(2025, 11, 25), title: 'Primeiro Natal Juntos',      desc: 'Um Natal especial e cheio de amor',     icon: '🎄', special: true },
    { date: new Date(2025, 11, 31), title: 'Virada de Ano Novo',         desc: 'Entrando 2026 juntos e felizes',        icon: '🎆', special: true },
    { date: new Date(2026, 1, 14),  title: 'Dia dos Namorados',          desc: 'Nosso primeiro Dia dos Namorados',      icon: '💝', special: true },
    { date: new Date(2026, 2, 27),  title: '6 Meses — Meio Ano!',        desc: 'Meio ano de amor e cumplicidade',       icon: '🎊', special: true },
    { date: new Date(2026, 4, 27),  title: '8 Meses Juntos',            desc: 'Nossa história continua crescendo',     icon: '🌿' },
    { date: hoje,                   title: 'Hoje',                       desc: 'E nossa história continua...',          icon: '❤️', today: true },
  ];

  const container = document.getElementById('timeline');
  if (!container) return;
  container.innerHTML = '';

  events.filter(e => e.date <= hoje).forEach((ev, i) => {
    const item = document.createElement('div');
    item.className = 'tl-item';
    const dotClass = ev.today ? 'tl-dot today' : ev.special ? 'tl-dot special' : 'tl-dot';
    const dateStr = ev.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    item.innerHTML = `
      <div class="${dotClass}"></div>
      <div class="tl-content">
        <div class="tl-date">${dateStr}</div>
        <div class="tl-title"><span class="tl-emoji">${ev.icon}</span>${ev.title}</div>
        <div class="tl-desc">${ev.desc}</div>
      </div>`;
    container.appendChild(item);
    setTimeout(() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 100);
            obs.disconnect();
          }
        });
      }, { threshold: .1 });
      obs.observe(item);
    }, 100 + i * 50);
  });
}

/* ============================================================
   CONFETTI (Story 16)
   ============================================================ */

class Confetti {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.active = false;
    this.colors = ['#1DB954', '#e91e8c', '#FFD700', '#ff6b6b', '#4ecdc4', '#fff', '#a855f7'];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  resize() {
    this.canvas.width  = this.canvas.offsetWidth  || 393;
    this.canvas.height = this.canvas.offsetHeight || 852;
  }
  spawn(n = 100) {
    for (let i = 0; i < n; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -10 - Math.random() * 80,
        size: Math.random() * 7 + 3,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        vx: (Math.random() - .5) * 3.5,
        vy: Math.random() * 2.5 + 1,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - .5) * 8,
        shape: Math.random() > .5 ? 'rect' : 'circle',
        opacity: 1,
        gravity: .04 + Math.random() * .025,
      });
    }
  }
  tick() {
    if (!this.active) return;
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gravity;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height * .8) p.opacity -= .012;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else { ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.restore();
    });
    this.particles = this.particles.filter(p => p.opacity > 0);
    requestAnimationFrame(() => this.tick());
  }
  start() {
    if (this.active) return;
    this.active = true;
    this.spawn(160);
    this.tick();
    let c = 0;
    const iv = setInterval(() => {
      if (!this.active || c++ > 6) { clearInterval(iv); return; }
      this.spawn(35);
    }, 1200);
  }
}

/* ============================================================
   STORY PLAYER
   ============================================================ */

class StoryPlayer {
  constructor(config) {
    this.total   = 16;
    this.current = 0;
    this.paused  = false;
    this.rafId   = null;
    this.startTs = null;
    this.elapsed = 0;
    this.durations      = config.durations      || {};
    this.onEnter        = config.onEnter        || {};
    this.onPauseChange  = config.onPauseChange  || null;
    this.triggered      = new Set();
    this.defaultDur     = 8000;
  }

  getDur() {
    return this.durations[this.current] || this.defaultDur;
  }

  init() {
    this.buildProgressBars();
    this.showStory(0, 0);
    this.bindTap();
    this.bindSwipe();
    this.bindKeys();

    document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
    document.getElementById('navPrev').addEventListener('click', () => this.prev());
    document.getElementById('navNext').addEventListener('click', () => this.next());

    // Coração no header — toggle + toast
    const heartBtn = document.getElementById('heartBtn');
    const toast    = document.getElementById('loveToast');
    let toastTimer = null;
    const showToast = () => {
      clearTimeout(toastTimer);
      toast.classList.remove('hide');
      toast.classList.add('show');
      toastTimer = setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.classList.remove('hide'), 380);
      }, 4000);
    };

    heartBtn.addEventListener('click', () => {
      const loved = heartBtn.textContent === '❤️';
      heartBtn.textContent = loved ? '🤍' : '❤️';
      if (!loved) {
        heartBtn.classList.add('loved');
        setTimeout(() => heartBtn.classList.remove('loved'), 400);
        showToast();
      } else {
        toast.classList.remove('show');
        toast.classList.add('hide');
        clearTimeout(toastTimer);
        setTimeout(() => toast.classList.remove('hide'), 380);
      }
    });

    document.addEventListener('lightbox:open',  () => this.pause());
    document.addEventListener('lightbox:close', () => { if (this.paused) this.resume(); });
  }

  buildProgressBars() {
    const container = document.getElementById('progressBars');
    container.innerHTML = '';
    for (let i = 0; i < this.total; i++) {
      const seg = document.createElement('div');
      seg.className = 'pb-seg';
      const fill = document.createElement('div');
      fill.className = 'pb-fill';
      fill.id = `pb${i}`;
      seg.appendChild(fill);
      container.appendChild(seg);
    }
  }

  goTo(index, dir) {
    const next = Math.max(0, Math.min(index, this.total - 1));
    if (dir === undefined) dir = next > this.current ? 1 : -1;
    const prevIdx = this.current;
    this.current = next;

    const fromEl = document.getElementById(`story-${prevIdx}`);
    const toEl   = document.getElementById(`story-${this.current}`);

    if (fromEl) {
      fromEl.classList.remove('story--active', 'story--enter-next', 'story--enter-prev');
      fromEl.classList.add(dir > 0 ? 'story--exit-next' : 'story--exit-prev');
      setTimeout(() => {
        fromEl.classList.remove('story--exit-next', 'story--exit-prev');
        fromEl.style.opacity = '0';
      }, 350);
    }

    if (toEl) {
      toEl.style.opacity = '1';
      if (prevIdx !== this.current) {
        toEl.classList.add(dir > 0 ? 'story--enter-next' : 'story--enter-prev');
        setTimeout(() => toEl.classList.remove('story--enter-next', 'story--enter-prev'), 360);
      }
      toEl.classList.add('story--active');
    }

    this.resetTimer();
    this.updateBars();
    this.updateCounter();
    this.triggerEnter(this.current);
  }

  showStory(index) {
    const el = document.getElementById(`story-${index}`);
    if (el) { el.style.opacity = '1'; el.classList.add('story--active'); }
    this.updateBars();
    this.updateCounter();
    this.triggerEnter(index);
    this.startTimer();
  }

  next() { if (this.current < this.total - 1) this.goTo(this.current + 1, 1); }
  prev() { if (this.current > 0) this.goTo(this.current - 1, -1); }

  pause() {
    if (this.paused) return;
    this.paused = true;
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    const btn = document.getElementById('pauseBtn');
    if (btn) btn.textContent = '▶';
    if (this.onPauseChange) this.onPauseChange(true);
  }

  resume() {
    if (!this.paused) return;
    this.paused = false;
    const btn = document.getElementById('pauseBtn');
    if (btn) btn.textContent = '⏸';
    if (this.onPauseChange) this.onPauseChange(false);
    this.startTimer();
  }

  togglePause() { this.paused ? this.resume() : this.pause(); }

  resetTimer() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    this.elapsed = 0;
    this.startTs = null;
    if (!this.paused) this.startTimer();
  }

  startTimer() {
    const dur = this.getDur();
    const snap = this.elapsed;
    const tick = ts => {
      if (this.paused) return;
      if (!this.startTs) this.startTs = ts - snap;
      this.elapsed = ts - this.startTs;
      const prog = Math.min(this.elapsed / dur, 1);
      const fill = document.getElementById(`pb${this.current}`);
      if (fill) fill.style.width = (prog * 100) + '%';
      if (prog >= 1) { this.next(); return; }
      this.rafId = requestAnimationFrame(tick);
    };
    this.startTs = null;
    this.rafId = requestAnimationFrame(tick);
  }

  updateBars() {
    for (let i = 0; i < this.total; i++) {
      const f = document.getElementById(`pb${i}`);
      if (!f) continue;
      f.style.width = i < this.current ? '100%' : '0%';
    }
  }

  updateCounter() {
    const el = document.getElementById('storyCounter');
    if (el) el.textContent = `${this.current + 1}/${this.total}`;
    const prev = document.getElementById('navPrev');
    const next = document.getElementById('navNext');
    if (prev) prev.disabled = this.current === 0;
    if (next) next.disabled = this.current === this.total - 1;
  }

  triggerEnter(index) {
    const cb = this.onEnter[index];
    if (!cb) return;
    const delay = index === 0 ? 100 : 350;
    setTimeout(() => {
      if (this.triggered.has(index)) {
        // Allow re-triggering for story 16 (confetti)
        if (index === 15) cb();
        return;
      }
      this.triggered.add(index);
      cb();
    }, delay);
  }

  bindTap() {
    const phone = document.getElementById('storiesPhone');
    phone.addEventListener('click', e => {
      if (e.target.closest('button') ||
          e.target.closest('.progress-track') ||
          e.target.closest('.vol-track') ||
          e.target.closest('.collage-4') ||
          e.target.closest('.lightbox') ||
          e.target.closest('.pb-seg')) return;
      const x = e.clientX - phone.getBoundingClientRect().left;
      x < phone.offsetWidth * 0.33 ? this.prev() : this.next();
    });
  }

  bindSwipe() {
    const phone = document.getElementById('storiesPhone');
    let sx = 0, sy = 0, st = 0, longPress = null;

    phone.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      st = Date.now();
      if (!e.target.closest('button') && !e.target.closest('.progress-track')) {
        longPress = setTimeout(() => this.pause(), 180);
      }
    }, { passive: true });

    phone.addEventListener('touchend', e => {
      clearTimeout(longPress);
      const dx = e.changedTouches[0].clientX - sx;
      const dy = Math.abs(e.changedTouches[0].clientY - sy);
      const dt = Date.now() - st;
      if (Math.abs(dx) > 44 && dy < 70 && dt < 320) {
        dx < 0 ? this.next() : this.prev();
      } else if (this.paused && dt < 300) {
        this.resume();
      }
    }, { passive: true });
  }

  bindKeys() {
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight')               this.next();
      if (e.key === 'ArrowLeft')                this.prev();
      if (e.key === ' ') { e.preventDefault();  this.togglePause(); }
    });
  }
}

/* ============================================================
   INIT
   ============================================================ */

async function init() {
  const loadingBar = document.getElementById('loadingBar');
  const loading    = document.getElementById('loading');

  // Barra de loading: 0→100% em exatamente 2s via RAF
  const LOAD_DUR = 2000;
  const loadStart = performance.now();
  const animBar = () => {
    const p = Math.min((performance.now() - loadStart) / LOAD_DUR, 1);
    // easeInOut para parecer orgânico
    const ease = p < .5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
    loadingBar.style.width = (ease * 100) + '%';
    if (p < 1) requestAnimationFrame(animBar);
  };
  requestAnimationFrame(animBar);

  // Inicialização em paralelo com a animação
  const minWait = new Promise(r => setTimeout(r, LOAD_DUR));

  // Calcular tempo
  const stats  = calcularTempo();
  const season = getSeason();

  // Season story
  const s05Icon    = document.getElementById('s05Icon');
  const s05Caption = document.getElementById('s05Caption');
  if (s05Icon)    s05Icon.textContent    = season.icon;
  if (s05Caption) s05Caption.textContent = season.caption;

  // Final days static preview
  const finalDays = document.getElementById('finalDays');
  if (finalDays) finalDays.textContent = stats.dias.toLocaleString('pt-BR');

  // Load photos
  const fotos = await descobrirFotos();

  // Gallery (lightbox)
  const gallery = new Gallery(fotos);

  // Music player
  const player = new MusicPlayer();
  // Try first photo as album art fallback
  if (fotos.length > 0) player.loadAlbumArt(fotos[0]);

  // Particles
  const pCanvas = document.getElementById('particlesCanvas');
  const particles = new Particles(pCanvas);
  particles.start();

  // Confetti
  const cCanvas = document.getElementById('confettiCanvas');
  const confetti = new Confetti(cCanvas);

  // Build timeline immediately (hidden until story 12)
  buildTimeline();

  // Story player
  const sp = new StoryPlayer({
    onPauseChange: (isPaused) => {
      if (isPaused) {
        player.audio.pause();
        player.playing = false;
        player.setPlayingUI(false);
      } else {
        player.play();
      }
    },
    durations: {
      0: 7000,   // Intro
      1: 9000,   // Nós dois
      2: 25000,  // Música (interactive)
      3: 9000,   // Stats
      4: 7000,   // Temporada
      5: 10000,  // Ranking
      6: 9000,   // Gêneros
      7: 8000,   // Wrapped
      8: 8000,   // Risadas
      9: 10000,  // Fotos
      10: 8000,  // Conquista
      11: 12000, // Timeline
      12: 9000,  // Define
      13: 9000,  // Para Sempre
      14: 10000, // Msg Final
      15: 20000, // Encerramento
    },
    onEnter: {
      0: () => { particles.resize(); },
      1: () => buildCollage(fotos, 'collage-s1', 3, gallery),
      3: () => {
        animateCounter(document.getElementById('cntDays'),   stats.dias,    2000);
        animateCounter(document.getElementById('cntWeeks'),  stats.semanas, 1800);
        animateCounter(document.getElementById('cntMonths'), stats.meses,   1600);
        animateCounter(document.getElementById('cntHours'),  stats.horas,   2200);
      },
      8: () => animateCounter(document.getElementById('cntLaughs'), 1247, 2000),
      9: () => buildCollage(fotos, 'collage-s9', 4, gallery),
      11: () => {
        // Trigger all timeline items visible
        setTimeout(() => {
          document.querySelectorAll('.tl-item').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), i * 80);
          });
        }, 400);
      },
      15: () => {
        confetti.resize();
        confetti.start();
        if (finalDays) animateCounter(finalDays, stats.dias, 2000);
      },
    },
  });

  sp.init();

  document.getElementById('shareBtn').addEventListener('click', () => shareCard(stats, fotos));

  // Aguarda os 2s mínimos antes de esconder
  await minWait;
  setTimeout(() => loading.classList.add('hidden'), 300);

  // Autoplay: tenta imediatamente; se o browser bloquear, dispara no primeiro toque do usuário
  const tryAutoplay = async () => {
    try {
      await player.audio.play();
      player.playing = true;
      player.setupAudioCtx();
      player.setPlayingUI(true);
    } catch (_) {
      // Aguarda primeiro gesto do usuário
      const onFirstGesture = async () => {
        document.removeEventListener('click',      onFirstGesture);
        document.removeEventListener('touchstart', onFirstGesture);
        document.removeEventListener('keydown',    onFirstGesture);
        if (!player.playing) await player.play();
      };
      document.addEventListener('click',      onFirstGesture, { once: true });
      document.addEventListener('touchstart', onFirstGesture, { once: true });
      document.addEventListener('keydown',    onFirstGesture, { once: true });
    }
  };

  // Dispara após a tela de loading sumir
  setTimeout(tryAutoplay, 600);
}

/* ============================================================
   SHARE CARD — gera imagem 9:16 e compartilha
   ============================================================ */

async function generateShareCard(stats, fotos) {
  const W = 1080, H = 1920;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  // Fundo gradiente escuro
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   '#0a0a0a');
  bg.addColorStop(0.5, '#0d0a12');
  bg.addColorStop(1,   '#0a0a0a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Forma decorativa superior
  const shape = ctx.createLinearGradient(W * .3, 0, W, H * .5);
  shape.addColorStop(0, 'rgba(200,24,92,.55)');
  shape.addColorStop(1, 'rgba(120,0,60,.0)');
  ctx.fillStyle = shape;
  ctx.beginPath();
  ctx.moveTo(W * .22, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * .5); ctx.lineTo(W * .48, H * .52);
  ctx.closePath(); ctx.fill();

  // Forma decorativa inferior
  const shape2 = ctx.createLinearGradient(0, H * .7, W * .5, H);
  shape2.addColorStop(0, 'rgba(29,185,84,.18)');
  shape2.addColorStop(1, 'rgba(29,185,84,.0)');
  ctx.fillStyle = shape2;
  ctx.beginPath();
  ctx.moveTo(0, H * .72); ctx.lineTo(W * .7, H * .68); ctx.lineTo(W * .55, H); ctx.lineTo(0, H);
  ctx.closePath(); ctx.fill();

  // Foto de fundo com overlay (primeira foto)
  if (fotos && fotos.length > 0) {
    try {
      const img = await loadImage(fotos[0]);
      ctx.save();
      ctx.globalAlpha = .18;
      const scale = Math.max(W / img.width, H / img.height);
      const iw = img.width * scale, ih = img.height * scale;
      ctx.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
      ctx.restore();
    } catch (_) {}
  }

  // Logo Spotify (círculo verde com ícone simplificado)
  const cx = 108, cy = 180, r = 50;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = '#1DB954'; ctx.fill();
  ctx.fillStyle = '#000';
  ctx.font = 'bold 52px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('♫', cx, cy + 2);

  // Eyebrow
  ctx.font = '700 38px -apple-system, sans-serif';
  ctx.fillStyle = '#1DB954';
  ctx.textAlign = 'left'; ctx.textBaseline = 'top';
  ctx.letterSpacing = '6px';
  ctx.fillText('NOSSA RETROSPECTIVA', 108, 280);

  // Título principal
  ctx.font = '900 148px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Nossa', 108, 360);
  ctx.fillText('História.', 108, 520);

  // Separador
  ctx.fillStyle = '#1DB954';
  ctx.fillRect(108, 700, 200, 6);

  // Stats
  const statItems = [
    { value: stats.dias.toLocaleString('pt-BR'),    label: 'dias juntos' },
    { value: stats.semanas.toLocaleString('pt-BR'), label: 'semanas' },
    { value: stats.meses.toLocaleString('pt-BR'),   label: 'meses' },
  ];
  let sy = 760;
  statItems.forEach(s => {
    ctx.font = '900 110px -apple-system, sans-serif';
    ctx.fillStyle = '#1DB954';
    ctx.textAlign = 'left';
    ctx.fillText(s.value, 108, sy);
    ctx.font = '500 46px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.fillText(s.label, 108, sy + 116);
    sy += 210;
  });

  // Grid de fotos (4 miniaturas)
  if (fotos && fotos.length >= 2) {
    const thumbSize = 220, gap = 14, startX = 108, startY = 1370;
    const count = Math.min(4, fotos.length);
    for (let i = 0; i < count; i++) {
      try {
        const img = await loadImage(fotos[i]);
        const tx = startX + i * (thumbSize + gap);
        ctx.save();
        roundRect(ctx, tx, startY, thumbSize, thumbSize, 18);
        ctx.clip();
        const scale = Math.max(thumbSize / img.width, thumbSize / img.height);
        const iw = img.width * scale, ih = img.height * scale;
        ctx.drawImage(img, tx + (thumbSize - iw) / 2, startY + (thumbSize - ih) / 2, iw, ih);
        ctx.restore();
      } catch (_) {}
    }
  }

  // Data
  ctx.font = '600 40px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  ctx.textAlign = 'left';
  ctx.fillText('Desde 27/09/2025 ❤️', 108, 1640);

  // Crédito
  ctx.font = '500 36px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  ctx.fillText('Feito com amor — Gabriel Oliveira', 108, 1720);

  // Borda inferior verde
  ctx.fillStyle = '#1DB954';
  ctx.fillRect(108, 1790, W - 216, 4);

  return cv;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function shareCard(stats, fotos) {
  const btn = document.getElementById('shareBtn');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span>⏳</span> Gerando...'; btn.disabled = true;

  try {
    const canvas = await generateShareCard(stats, fotos);

    canvas.toBlob(async blob => {
      const file = new File([blob], 'nossa-retrospectiva.png', { type: 'image/png' });

      // Web Share API com arquivo (abre Instagram Stories, WhatsApp, etc.)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Nossa Retrospectiva ❤️',
          text: 'Nossa história em números e memórias ✨',
        });
      } else {
        // Fallback: baixa a imagem
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'nossa-retrospectiva.png';
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }

      btn.innerHTML = orig; btn.disabled = false;
    }, 'image/png');
  } catch (err) {
    btn.innerHTML = orig; btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', init);

/* ============================================================
   FULLSCREEN — esconde a barra do navegador no primeiro toque
   ============================================================ */
(function () {
  const requestFS = () => {
    const el = document.documentElement;
    const fn = el.requestFullscreen
      || el.webkitRequestFullscreen
      || el.mozRequestFullScreen
      || el.msRequestFullscreen;
    if (fn) fn.call(el).catch(() => {});
  };

  // Tenta no primeiro gesto do usuário (exigido pelos browsers)
  const once = { once: true, passive: true };
  document.addEventListener('touchstart', requestFS, once);
  document.addEventListener('click',      requestFS, once);
})();

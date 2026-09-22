// Progressive enhancement: the complete portfolio and project notes work without JavaScript.
(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const printButton = document.querySelector('[data-print]');
  if (printButton) {
    printButton.hidden = false;
    printButton.addEventListener('click', () => window.print());
  }

  const cards = [...document.querySelectorAll('.project-card')];
  const filters = document.querySelector('.filters');
  if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      const category = button.dataset.filter;
      filters.querySelectorAll('button').forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      let visible = 0;
      cards.forEach(card => {
        card.hidden = category !== 'all' && card.dataset.category !== category;
        if (!card.hidden) visible++;
      });
      document.getElementById('filter-status').textContent = `${visible} projects shown.`;
    });
    // Direct links from the skills section must remain reachable after filtering.
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#project-"]');
      if (link && document.getElementById(link.hash.slice(1))?.hidden) {
        filters.querySelector('[data-filter="all"]').click();
      }
    });
    window.addEventListener('hashchange', () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target?.matches('.project-card') && target.hidden) {
        filters.querySelector('[data-filter="all"]').click();
        target.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    });
  }

  const dialog = document.getElementById('project-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    let returnFocus = null;
    document.querySelectorAll('.project-details>summary').forEach(summary => {
      summary.addEventListener('click', event => {
        event.preventDefault();
        returnFocus = summary;
        const card = summary.closest('.project-card');
        document.getElementById('dialog-title').textContent = card.querySelector('h3').textContent;
        const content = document.getElementById('dialog-content');
        content.replaceChildren(card.querySelector('.case-content').cloneNode(true));
        dialog.showModal();
        document.body.classList.add('dialog-open');
        dialog.querySelector('.dialog-close').focus();
      });
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const rect = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      returnFocus?.focus({ preventScroll: true });
    });
  }

  const perspectives = {
    business: {
      overline: 'START WITH THE QUESTION',
      title: 'Turn information into a clearer decision.',
      body: 'Business analytics, academic research, and digital marketing provide a foundation for framing the problem before choosing the technology.',
      steps: ['Question', 'Analysis', 'Insight'],
      link: '#project-insight', label: 'See it in InsightBot'
    },
    technical: {
      overline: 'BUILD TO UNDERSTAND',
      title: 'Make an idea tangible, then investigate it.',
      body: 'Python, AI frameworks, and web technologies support hands-on exploration—from evolving Pong agents to document hierarchy and connected business applications.',
      steps: ['Structure', 'Prototype', 'Explore'],
      link: '#project-chunking', label: 'Explore document chunking'
    },
    people: {
      overline: 'KEEP PEOPLE IN THE PICTURE',
      title: 'Translate between systems and the people using them.',
      body: 'A communication degree, research experience, and front-of-house team leadership bring a human perspective to technical and operational work.',
      steps: ['Listen', 'Coordinate', 'Communicate'],
      link: '#experience', label: 'Explore leadership experience'
    }
  };
  const perspectiveButtons = document.querySelector('.perspective-buttons');
  if (perspectiveButtons) {
    perspectiveButtons.hidden = false;
    perspectiveButtons.addEventListener('click', event => {
      const button = event.target.closest('[data-perspective]');
      if (!button) return;
      const info = perspectives[button.dataset.perspective];
      const panel = document.getElementById('perspective-panel');
      perspectiveButtons.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      panel.querySelector('.eyebrow').textContent = info.overline;
      panel.querySelector('h3').textContent = info.title;
      panel.querySelector('p:not(.eyebrow)').textContent = info.body;
      panel.querySelectorAll('.process-line span').forEach((item, index) => item.textContent = info.steps[index]);
      const link = panel.querySelector('a');
      link.href = info.link;
      link.replaceChildren(document.createTextNode(info.label + ' '));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗'; link.append(arrow);
    });
  }

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  const canvas = document.getElementById('network-canvas');
  if (!canvas || !motionButton) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let userPaused = false;
  let visible = true;
  let frame = 0;
  let elapsed = 0;
  let lastTime = 0;
  let width = 1;
  let height = 1;
  const points = Array.from({ length: 32 }, (_, index) => ({
    x: ((index * 137.508) % 100) / 100,
    y: ((index * 71.27 + 19) % 100) / 100,
    phase: index * 1.7
  }));
  const isPaused = () => userPaused || motionPreference.matches || document.hidden || !visible;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const time = elapsed / 6500;
    const nodes = points.map(point => ({
      x: point.x * width + Math.sin(time + point.phase) * 13,
      y: point.y * height + Math.cos(time * .8 + point.phase) * 13
    }));
    nodes.forEach((node, index) => {
      ctx.beginPath(); ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(198,228,161,.65)'; ctx.fill();
      for (let j = index + 1; j < nodes.length; j++) {
        const other = nodes[j]; const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < 91) {
          ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(172,207,139,${(1 - distance / 91) * .25})`;
          ctx.lineWidth = .6; ctx.stroke();
        }
      }
    });
  }
  function animate(timestamp) {
    if (isPaused()) { frame = 0; lastTime = 0; return; }
    if (lastTime) elapsed += Math.min(timestamp - lastTime, 50);
    lastTime = timestamp;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function syncMotion() {
    document.body.classList.toggle('motion-paused', userPaused || motionPreference.matches);
    document.querySelector('.hero-system').classList.toggle('scene-paused', document.hidden || !visible);
    motionButton.disabled = motionPreference.matches;
    motionButton.setAttribute('aria-pressed', String(userPaused || motionPreference.matches));
    motionButton.textContent = motionPreference.matches ? 'Reduced motion' : userPaused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
    if (isPaused()) {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0; draw();
    } else if (!frame) frame = requestAnimationFrame(animate);
  }
  function resize() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width; height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  motionButton.hidden = false;
  motionButton.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });
  motionPreference.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener('resize', resize);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting; syncMotion();
    }, { threshold: 0 }).observe(canvas);
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('reveal-in'); reveal.unobserve(entry.target); }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.project-card, .research-papers article, .timeline article').forEach(element => reveal.observe(element));
  }
  resize(); syncMotion();
})();

// Core content and inline image links also work without JavaScript.
(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const printButton = document.querySelector('[data-print]');
  if (printButton) { printButton.hidden = false; printButton.addEventListener('click', () => window.print()); }

  const cards = [...document.querySelectorAll('.project-card')];
  const filters = document.querySelector('.filters');
  if (filters) {
    filters.hidden = false;
    filters.addEventListener('click', event => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      filters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let visible = 0;
      cards.forEach(card => {
        card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
        if (!card.hidden) visible++;
      });
      document.getElementById('filter-status').textContent = `${visible} projects shown.`;
    });
    document.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#project-"]');
      if (link && document.getElementById(link.hash.slice(1))?.hidden) filters.querySelector('[data-filter="all"]').click();
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
    const projects = [...document.querySelectorAll('[data-gallery-id]')].map(card => ({
      id: card.dataset.galleryId,
      title: card.querySelector('h3').textContent.replace('↗', '').trim(),
      description: card.querySelector('.project-description, .game-copy>p:not(.card-overline)')?.textContent.trim() || '',
      notes: card.querySelector('.project-note')?.textContent.trim() || '',
      repo: card.querySelector('.repo-link')?.href || '',
      images: [...card.querySelectorAll('.gallery-items a')].map(a => ({
        src: a.href, thumb: a.querySelector('img').src, caption: a.dataset.caption,
        kind: a.dataset.kind, animation: a.dataset.animation === 'true', poster: a.dataset.poster
      }))
    }));
    const allImages = projects.flatMap(project => project.images.map(image => ({ ...image, project })));
    let items = allImages, index = 0, returnFocus = null, zoomed = false, playing = false;
    const image = dialog.querySelector('#gallery-image');
    const stage = dialog.querySelector('.gallery-stage');
    const selector = dialog.querySelector('#gallery-project');
    const thumbnails = dialog.querySelector('.gallery-thumbnails');
    const play = dialog.querySelector('.gallery-play');
    const zoom = dialog.querySelector('.gallery-zoom');
    const previous = dialog.querySelector('.gallery-prev');
    const next = dialog.querySelector('.gallery-next');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    selector.append(new Option('All projects', 'all'));
    projects.forEach(project => selector.append(new Option(project.title, project.id)));
    function stopClip() {
      playing = false;
      play.setAttribute('aria-pressed', 'false');
      play.textContent = 'Play clip';
      if (items[index]?.animation) image.src = items[index].poster;
    }
    function setZoom(value) {
      zoomed = value;
      stage.classList.toggle('is-zoomed', value);
      zoom.setAttribute('aria-pressed', String(value));
      zoom.textContent = value ? 'Fit image' : 'Zoom in';
      stage.scrollTo(0, 0);
    }
    function showImage(newIndex) {
      index = Math.max(0, Math.min(newIndex, items.length - 1));
      const item = items[index];
      if (!item) return;
      stopClip(); setZoom(false);
      dialog.querySelector('#gallery-error').hidden = true;
      image.hidden = false;
      image.alt = `${item.project.title} — ${item.caption}`;
      image.src = item.animation ? item.poster : item.src;
      dialog.querySelector('#dialog-title').textContent = item.project.title;
      dialog.querySelector('#gallery-caption').textContent = item.caption;
      dialog.querySelector('#gallery-counter').textContent = `${index + 1} / ${items.length}`;
      dialog.querySelector('#gallery-original').href = item.src;
      dialog.querySelector('#gallery-kind').textContent = item.kind;
      dialog.querySelector('#gallery-description').textContent = item.project.description;
      dialog.querySelector('#gallery-notes').textContent = item.project.notes;
      const repo = dialog.querySelector('#gallery-repository');
      repo.hidden = !item.project.repo;
      if (item.project.repo) repo.href = item.project.repo; else repo.removeAttribute('href');
      previous.disabled = index === 0; next.disabled = index === items.length - 1;
      play.hidden = !item.animation;
      thumbnails.querySelectorAll('button').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      const active = thumbnails.children[index];
      if (active) thumbnails.scrollTo({ left: active.offsetLeft - thumbnails.offsetLeft - thumbnails.clientWidth / 2 + active.clientWidth / 2, behavior: 'auto' });
    }
    function selectProject(id) {
      selector.value = id;
      items = id === 'all' ? allImages : allImages.filter(item => item.project.id === id);
      thumbnails.replaceChildren();
      items.forEach((item, i) => {
        const button = document.createElement('button'); button.type = 'button';
        button.setAttribute('aria-label', `${i + 1}. ${item.project.title}: ${item.caption}`);
        const thumb = document.createElement('img'); thumb.src = item.thumb; thumb.alt = ''; thumb.loading = 'lazy';
        button.append(thumb); button.addEventListener('click', () => showImage(i)); thumbnails.append(button);
      });
      showImage(0);
    }
    function openGallery(id, trigger) {
      returnFocus = trigger; selectProject(id);
      dialog.showModal(); document.body.classList.add('dialog-open');
      document.dispatchEvent(new Event('portfolio:dialog'));
      dialog.querySelector('.dialog-close').focus();
    }
    document.querySelectorAll('[data-open-gallery]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => openGallery(button.dataset.openGallery, button));
    });
    document.querySelectorAll('.project-details>summary').forEach(summary => {
      summary.addEventListener('click', event => {
        event.preventDefault(); openGallery(summary.closest('[data-gallery-id]').dataset.galleryId, summary);
      });
    });
    selector.addEventListener('change', () => selectProject(selector.value));
    previous.addEventListener('click', () => showImage(index - 1));
    next.addEventListener('click', () => showImage(index + 1));
    zoom.addEventListener('click', () => setZoom(!zoomed));
    play.addEventListener('click', () => {
      if (playing) stopClip();
      else { playing = true; image.src = items[index].src; play.textContent = 'Stop clip'; play.setAttribute('aria-pressed', 'true'); }
    });
    image.addEventListener('error', () => { image.hidden = true; dialog.querySelector('#gallery-error').hidden = false; });
    dialog.addEventListener('keydown', event => {
      if (event.target.matches('select, input, textarea') || zoomed) return;
      if (event.key === 'ArrowLeft') { event.preventDefault(); showImage(index - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showImage(index + 1); }
      if (event.key === 'Home') { event.preventDefault(); showImage(0); }
      if (event.key === 'End') { event.preventDefault(); showImage(items.length - 1); }
    });
    let startTouch = null;
    stage.addEventListener('touchstart', event => { if (event.touches.length === 1 && !zoomed) startTouch = [event.touches[0].clientX, event.touches[0].clientY]; }, { passive: true });
    stage.addEventListener('touchend', event => {
      if (!startTouch || zoomed) return;
      const dx = event.changedTouches[0].clientX - startTouch[0], dy = event.changedTouches[0].clientY - startTouch[1];
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showImage(index + (dx < 0 ? 1 : -1));
      startTouch = null;
    }, { passive: true });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      const bounds = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
    });
    dialog.addEventListener('close', () => {
      stopClip(); document.body.classList.remove('dialog-open');
      document.dispatchEvent(new Event('portfolio:dialog')); returnFocus?.focus({ preventScroll: true });
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden && playing) stopClip(); });
    motionPreference.addEventListener('change', () => { if (motionPreference.matches && playing) stopClip(); });
  }

  const perspectives = {
    business: { title: 'From information to insight.', body: 'Business analytics, research, and digital marketing.', steps: ['Question', 'Analysis', 'Insight'], link: '#project-insight', label: 'Explore InsightBot' },
    technical: { title: 'Build. Test. Understand.', body: 'Python, AI systems, and connected applications.', steps: ['Structure', 'Prototype', 'Explore'], link: '#project-chunking', label: 'Explore document chunking' },
    people: { title: 'Keep people at the center.', body: 'Communication, team leadership, and service delivery.', steps: ['Listen', 'Coordinate', 'Communicate'], link: '#experience', label: 'Explore experience' }
  };
  const perspectiveButtons = document.querySelector('.perspective-buttons');
  if (perspectiveButtons) {
    perspectiveButtons.hidden = false;
    perspectiveButtons.addEventListener('click', event => {
      const button = event.target.closest('[data-perspective]'); if (!button) return;
      const info = perspectives[button.dataset.perspective], panel = document.getElementById('perspective-panel');
      perspectiveButtons.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      panel.querySelector('h3').textContent = info.title;
      panel.querySelector('p:not(.eyebrow)').textContent = info.body;
      panel.querySelectorAll('.process-line span').forEach((item, i) => item.textContent = info.steps[i]);
      const link = panel.querySelector('a'); link.href = info.link; link.textContent = info.label + ' ↗';
    });
  }
})();

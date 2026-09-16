/*=============================================
  DANISH SAYYED — PORTFOLIO SCRIPT
=============================================*/
document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- PRELOADER ---------- */
  const preloader = document.querySelector('[data-preloader]');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 500);
  });

  /* ---------- CUSTOM CURSOR (data theme) ---------- */
  const cross = document.querySelector('[data-cursor-cross]');
  const coord = document.querySelector('[data-cursor-coord]');
  const trailWrap = document.querySelector('[data-cursor-trail]');
  if (cross && coord && trailWrap && !reduceMotion && matchMedia('(hover:hover)').matches) {
    const TRAIL_LEN = 7;
    const nodes = [];
    for (let i = 0; i < TRAIL_LEN; i++) {
      const n = document.createElement('div');
      n.className = 'trail-node';
      const scale = 1 - i / TRAIL_LEN;
      n.style.width = n.style.height = (2 + scale * 4) + 'px';
      n.style.opacity = (scale * 0.55).toFixed(2);
      n.style.background = i % 2 === 0 ? 'var(--violet)' : 'var(--cyan)';
      trailWrap.appendChild(n);
      nodes.push({ el: n, x: 0, y: 0 });
    }

    let mx = 0, my = 0, shown = false;

    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cross.style.left = mx + 'px'; cross.style.top = my + 'px';
      coord.style.left = mx + 'px'; coord.style.top = my + 'px';
      coord.textContent = `X ${String(Math.round(mx)).padStart(3, '0')} · Y ${String(Math.round(my)).padStart(3, '0')}`;
      if (!shown) { coord.classList.add('is-visible'); shown = true; }
      nodes.forEach(n => { if (n.x === 0 && n.y === 0) { n.x = mx; n.y = my; } });
    });

    window.addEventListener('mouseleave', () => coord.classList.remove('is-visible'));

    function loop() {
      let targetX = mx, targetY = my;
      nodes.forEach((n, i) => {
        n.x += (targetX - n.x) * 0.32;
        n.y += (targetY - n.y) * 0.32;
        n.el.style.transform = `translate(${n.x}px, ${n.y}px) translate(-50%,-50%)`;
        targetX = n.x; targetY = n.y;
      });
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll('a, button, .project-card, .testi-card, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => cross.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cross.classList.remove('is-active'));
    });
  }

  /* ---------- SERVICE CARD SPOTLIGHT ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });
  if (!reduceMotion && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- SERVICE CARD SPOTLIGHT ---------- */
  if (matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---------- BACKGROUND BLOB PARALLAX ---------- */
  if (!reduceMotion) {
    const blobs = document.querySelectorAll('.blob');
    window.addEventListener('mousemove', e => {
      const px = (e.clientX / window.innerWidth) - 0.5;
      const py = (e.clientY / window.innerHeight) - 0.5;
      blobs.forEach((b, i) => {
        const depth = (i + 1) * 10;
        b.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
      });
    });
  }

  /* ---------- NAV ---------- */
  const nav = document.querySelector('[data-nav]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navPill = document.querySelector('.nav-pill');
  const sections = document.querySelectorAll('main [id]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobileDrawer = document.querySelector('[data-mobile-drawer]');

  function movePill(el) {
    if (!el || !navPill) return;
    navPill.style.width = el.offsetWidth + 'px';
    navPill.style.transform = `translateX(${el.offsetLeft}px)`;
  }

  function setActiveLink(link) {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    movePill(link);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      setActiveLink(link);
      target && target.scrollIntoView({ behavior: 'smooth' });
      mobileDrawer && mobileDrawer.classList.remove('is-open');
      navToggle && navToggle.classList.remove('is-open');
    });
  });

  window.addEventListener('load', () => {
    const active = document.querySelector('.nav-link.active') || navLinks[0];
    movePill(active);
  });
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    movePill(active);
  });

  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('is-scrolled', window.scrollY > 30);
    const toTop = document.querySelector('[data-to-top]');
    toTop && toTop.classList.toggle('show', window.scrollY > 700);

    let current = sections[0];
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.4) current = sec;
    });
    if (current) {
      const link = document.querySelector(`.nav-link[href="#${current.id}"]`);
      if (link && !link.classList.contains('active')) setActiveLink(link);
    }
  }, { passive: true });

  navToggle && navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('is-open');
    mobileDrawer.classList.toggle('is-open');
  });

  document.querySelector('[data-to-top]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- SCROLL REVEAL ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el, i) => {
    el.style.setProperty('--i', i % 8);
    io.observe(el);
  });

  /* ---------- COUNT UP ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const cIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cIo.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cIo.observe(el));

  /* ---------- SKILL PULSE WAVEFORMS ---------- */
  const pulseWaves = document.querySelectorAll('[data-pulse-wave]');
  const pIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const val = parseFloat(el.dataset.value);
      const amp = 0.32 + Math.pow(val / 100, 1.6) * 1.05;
      const line = el.querySelector('.wave-line');
      if (line) {
        line.style.transition = 'transform 1s var(--ease-spring)';
        line.style.transform = 'scaleY(0.15)';
        requestAnimationFrame(() => {
          setTimeout(() => { line.style.transform = `scaleY(${amp})`; }, 60);
        });
      }
      pIo.unobserve(el);
    });
  }, { threshold: 0.4 });
  pulseWaves.forEach(el => pIo.observe(el));

  /* ---------- PROJECT PREVIEW MODAL ---------- */
  const previewOverlay = document.querySelector('[data-preview-overlay]');
  if (previewOverlay) {
    const pImg = document.querySelector('[data-preview-img]');
    const pTitle = document.querySelector('[data-preview-title]');
    const pDesc = document.querySelector('[data-preview-desc]');
    const pLabel = document.querySelector('[data-preview-label]');
    const pLink = document.querySelector('[data-preview-link]');

    document.querySelectorAll('[data-preview-btn]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        pImg.src = btn.dataset.img;
        pTitle.textContent = btn.dataset.title;
        pDesc.textContent = btn.dataset.desc;
        pLabel.textContent = btn.dataset.label;
        pLink.href = btn.dataset.href;
        previewOverlay.classList.add('is-open');
      });
    });

    function closePreview() { previewOverlay.classList.remove('is-open'); }
    previewOverlay.addEventListener('click', e => {
      if (e.target === previewOverlay || e.target.closest('[data-preview-close]')) closePreview();
    });
    window.addEventListener('keydown', e => { if (e.key === 'Escape') closePreview(); });
  }

  /* ---------- PROJECT FILTER + LOAD MORE ---------- */
  const filterBtns = document.querySelectorAll('[data-filter-btn]');
  const cards = Array.from(document.querySelectorAll('[data-filter-item]'));
  const PAGE_SIZE = 9;
  let currentFilter = 'all';
  let visibleCount = PAGE_SIZE;
  const loadMoreBtn = document.querySelector('[data-load-more]');

  function applyFilter() {
    const matched = cards.filter(c => currentFilter === 'all' || c.dataset.category === currentFilter);
    cards.forEach(c => c.classList.add('hide'));
    matched.forEach((c, i) => {
      if (i < visibleCount) {
        c.classList.remove('hide');
        c.style.setProperty('--i', i % 9);
      }
    });
    if (loadMoreBtn) loadMoreBtn.style.display = matched.length > visibleCount ? 'inline-flex' : 'none';
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filterBtn;
      visibleCount = PAGE_SIZE;
      applyFilter();
    });
  });
  loadMoreBtn && loadMoreBtn.addEventListener('click', () => {
    visibleCount += PAGE_SIZE;
    applyFilter();
  });
  applyFilter();

  /* ---------- PROJECT CARD TILT ---------- */
  if (!reduceMotion && matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${py * -6}deg) rotateY(${px * 8}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- TESTIMONIALS CAROUSEL ---------- */
  const track = document.querySelector('[data-testi-track]');
  if (track) {
    const slides = Array.from(track.children);
    const dotsWrap = document.querySelector('[data-testi-dots]');
    const prevBtn = document.querySelector('[data-testi-prev]');
    const nextBtn = document.querySelector('[data-testi-next]');
    let perView = window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
    let index = 0;
    let autoplayId;

    function buildDots() {
      dotsWrap.innerHTML = '';
      const pages = Math.max(1, slides.length - perView + 1);
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('button');
        d.className = 'testi-dot' + (i === 0 ? ' active' : '');
        d.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(d);
      }
    }

    function update() {
      const slideWidth = slides[0].getBoundingClientRect().width + 16;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
      document.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function goTo(i) {
      const maxIndex = Math.max(0, slides.length - perView);
      index = Math.max(0, Math.min(i, maxIndex));
      update();
    }

    function next() { goTo(index + 1 > slides.length - perView ? 0 : index + 1); }
    function prev() { goTo(index - 1 < 0 ? slides.length - perView : index - 1); }

    nextBtn && nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    prevBtn && prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

    function restartAutoplay() {
      clearInterval(autoplayId);
      autoplayId = setInterval(next, 5000);
    }
    function stopAutoplay() { clearInterval(autoplayId); }

    const outer = document.querySelector('.testi-track-outer');
    outer.addEventListener('mouseenter', stopAutoplay);
    outer.addEventListener('mouseleave', () => { if (inView) restartAutoplay(); });

    // Only start the timer once the carousel actually scrolls into view,
    // so it always begins on slide 1 instead of having already advanced
    // while the visitor was reading earlier sections.
    let inView = false;
    const testiIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          inView = true;
          goTo(0);
          restartAutoplay();
        } else {
          inView = false;
          stopAutoplay();
        }
      });
    }, { threshold: 0.4 });
    testiIo.observe(outer);

    // drag support
    let isDown = false, startX = 0, startIndex = 0;
    outer.addEventListener('pointerdown', e => {
      isDown = true; startX = e.clientX; startIndex = index;
      outer.classList.add('dragging');
    });
    window.addEventListener('pointermove', e => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      const slideWidth = slides[0].getBoundingClientRect().width + 16;
      track.style.transform = `translateX(${-(startIndex * slideWidth) + dx}px)`;
    });
    window.addEventListener('pointerup', e => {
      if (!isDown) return;
      isDown = false;
      outer.classList.remove('dragging');
      const dx = e.clientX - startX;
      if (dx < -60) next();
      else if (dx > 60) prev();
      else update();
      if (inView) restartAutoplay();
    });

    window.addEventListener('resize', () => {
      perView = window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
      buildDots();
      goTo(0);
    });

    buildDots();
    update();

    // modal
    const overlay = document.querySelector('[data-modal-overlay]');
    const modalImg = document.querySelector('[data-modal-img]');
    const modalName = document.querySelector('[data-modal-name]');
    const modalRole = document.querySelector('[data-modal-role]');
    const modalText = document.querySelector('[data-modal-text]');

    slides.forEach(slide => {
      slide.addEventListener('click', () => {
        const card = slide.querySelector('.testi-card') || slide;
        modalImg.src = card.dataset.img;
        modalName.textContent = card.dataset.name;
        modalRole.textContent = card.dataset.role;
        modalText.textContent = card.dataset.full;
        overlay.classList.add('is-open');
      });
    });
    overlay?.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('[data-modal-close]')) {
        overlay.classList.remove('is-open');
      }
    });
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') overlay?.classList.remove('is-open');
    });
  }

  /* ---------- CONTACT FORM ---------- */
  const form = document.querySelector('[data-form]');
  if (form) {
    const submitBtn = form.querySelector('[data-form-submit]');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      submitBtn.classList.remove('done', 'error');
      submitBtn.classList.add('loading');
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        submitBtn.classList.remove('loading');
        if (res.ok) {
          submitBtn.classList.add('done');
          form.reset();
          setTimeout(() => submitBtn.classList.remove('done'), 3200);
        } else {
          submitBtn.classList.add('error');
          setTimeout(() => submitBtn.classList.remove('error'), 3200);
        }
      } catch (err) {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('error');
        setTimeout(() => submitBtn.classList.remove('error'), 3200);
      }
    });
  }

});

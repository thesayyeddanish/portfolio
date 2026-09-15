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

  /* ---------- CUSTOM CURSOR ---------- */
  const dot = document.querySelector('[data-cursor-dot]');
  const ring = document.querySelector('[data-cursor-ring]');
  if (dot && ring && !reduceMotion && matchMedia('(hover:hover)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    };
    loop();
    document.querySelectorAll('a, button, .project-card, .testi-card, [data-magnetic]').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
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

  /* ---------- SKILL BARS ---------- */
  const skillRows = document.querySelectorAll('.skill-row');
  const sIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector('.skill-fill');
      const val = entry.target.dataset.value;
      fill.style.width = val + '%';
      sIo.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  skillRows.forEach(el => sIo.observe(el));

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
      autoplayId = setInterval(next, 4500);
    }

    const outer = document.querySelector('.testi-track-outer');
    outer.addEventListener('mouseenter', () => clearInterval(autoplayId));
    outer.addEventListener('mouseleave', restartAutoplay);

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
      restartAutoplay();
    });

    window.addEventListener('resize', () => {
      perView = window.innerWidth < 640 ? 1 : window.innerWidth < 960 ? 2 : 3;
      buildDots();
      goTo(0);
    });

    buildDots();
    update();
    restartAutoplay();

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
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      submitBtn.classList.add('loading');
      setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('done');
        form.reset();
        setTimeout(() => submitBtn.classList.remove('done'), 2600);
      }, 1100);
    });
  }

  /* ---------- HERO CHART DOTS ---------- */
  const dots = document.querySelectorAll('.chart-dot');
  dots.forEach((d, i) => { d.style.animationDelay = (1.8 + i * 0.12) + 's'; });

});

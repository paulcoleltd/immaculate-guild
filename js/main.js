/* ═══════════════════════════════════════════════════════════
   IMMACULATE GUILD — Main JavaScript
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('up'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ── Nav scroll behaviour ───────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 72);
    }, { passive: true });
  }

  /* ── Hero entrance ──────────────────────────────────────── */
  const heroInner = document.getElementById('heroInner');
  if (heroInner) {
    heroInner.style.cssText = 'opacity:0;transform:translateY(24px)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroInner.style.cssText = 'transition:opacity .95s ease,transform .95s ease;opacity:1;transform:translateY(0)';
    }));
  }

  /* ── Mobile menu ────────────────────────────────────────── */
  window.toggleMobile = function () {
    document.getElementById('mobileMenu')?.classList.toggle('open');
  };
  window.closeMobile = function () {
    document.getElementById('mobileMenu')?.classList.remove('open');
  };

  /* ── Stats counter animation ────────────────────────────── */
  function animateCount(el, target, suffix) {
    let start = 0;
    const dur = 1600;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statsEl = document.getElementById('stats');
  if (statsEl) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          document.querySelectorAll('.stat-num').forEach(el => {
            const t = el.textContent;
            if (t.includes('+'))  animateCount(el, parseInt(t), '+');
            else if (t.includes('%')) animateCount(el, parseInt(t), '%');
          });
          statsObs.disconnect();
        }
      });
    }, { threshold: 0.3 });
    statsObs.observe(statsEl);
  }

  /* ── Form submission handler ────────────────────────────── */
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = 'Sending... ⟳';
      btn.disabled = true;
      // Replace this timeout with actual form submission (Formspree/Netlify)
      setTimeout(() => {
        btn.innerHTML = '✓ Quote Request Sent!';
        btn.style.background = '#10B981';
        setTimeout(() => { btn.innerHTML = original; btn.disabled = false; btn.style.background = ''; }, 4000);
      }, 1500);
    });
  }

});

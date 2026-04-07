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

  /* ── Form submission — Formspree AJAX ──────────────────── */
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const btn    = document.getElementById('formSubmitBtn');
      const msgEl  = document.getElementById('formMsg');
      const orig   = btn.innerHTML;

      // Basic client-side validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(f => { if (!f.value.trim()) { f.style.borderColor = '#E53E3E'; valid = false; } else { f.style.borderColor = ''; } });
      if (!valid) {
        showMsg(msgEl, 'Please fill in all required fields.', '#FEF2F2', '#C53030');
        return;
      }

      btn.innerHTML = 'Sending&hellip;';
      btn.disabled = true;

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(form)
        });

        if (res.ok) {
          form.reset();
          btn.innerHTML = '✓ Quote Request Sent!';
          btn.style.background = '#10B981';
          showMsg(msgEl, 'Thank you — we\'ll be in touch within 3 hours.', '#F0FFF4', '#276749');
          setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; msgEl.style.display = 'none'; }, 6000);
        } else {
          const data = await res.json();
          const err  = (data.errors || []).map(x => x.message).join(', ') || 'Submission failed. Please try again.';
          showMsg(msgEl, err, '#FFF5F5', '#C53030');
          btn.innerHTML = orig;
          btn.disabled = false;
        }
      } catch {
        showMsg(msgEl, 'Network error — please call us on 0151 234 5678.', '#FFF5F5', '#C53030');
        btn.innerHTML = orig;
        btn.disabled = false;
      }
    });
  }

  function showMsg(el, text, bg, color) {
    el.textContent = text;
    el.style.cssText = `display:block;background:${bg};color:${color};padding:14px;margin-top:12px;font-size:14px;border-radius:2px;`;
  }

});

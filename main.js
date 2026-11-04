// Publication view toggle (Selected / All). Without JS, every paper is shown.
(function () {
  const list = document.querySelector('.pubs');
  const toggle = document.querySelector('.toggle');
  if (!list || !toggle) return;

  let saved = null;
  try { saved = localStorage.getItem('pubView'); } catch (e) { /* storage unavailable */ }

  function setView(view) {
    list.dataset.view = view;
    toggle.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    try { localStorage.setItem('pubView', view); } catch (e) { /* ignore */ }
  }

  toggle.hidden = false;
  setView(saved === 'all' ? 'all' : 'selected');
  toggle.addEventListener('click', e => {
    const b = e.target.closest('button[data-view]');
    if (b) setView(b.dataset.view);
  });
})();

// Teaser videos autoplay (muted, looping) while on screen and pause when scrolled away,
// so off-screen videos don't download or decode. Visitors who ask for reduced motion
// get the poster frame and can play a video by hovering or tapping it.
(function () {
  const videos = document.querySelectorAll('.pub video');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function play(v) { const p = v.play(); if (p) p.catch(() => {}); }

  if (reduceMotion) {
    videos.forEach(v => {
      const row = v.closest('.pub');
      row.addEventListener('mouseenter', () => play(v));
      row.addEventListener('mouseleave', () => v.pause());
      v.addEventListener('click', () => (v.paused ? play(v) : v.pause()));
    });
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => (en.isIntersecting ? play(en.target) : en.target.pause()));
    }, { threshold: 0.25 });
    videos.forEach(v => io.observe(v));
  } else {
    videos.forEach(play);
  }
})();

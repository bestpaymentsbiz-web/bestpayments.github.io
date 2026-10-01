/* ════════════════════════════════════════════════
   Ok-페이백 | main.js
   ════════════════════════════════════════════════ */

/* ── 모바일 네비 토글 ── */
function toggleNav() {
  document.getElementById('mainNav').classList.toggle('open');
}

/* 네비 외부 클릭 시 닫기 */
document.addEventListener('click', function (e) {
  const nav    = document.getElementById('mainNav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove('open');
  }
});

/* ── 현재 페이지 nav 링크 active 표시 ── */
(function () {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(function (a) {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) a.classList.add('active');
  });
})();

/* ── FAQ 아코디언 ── */
function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const icon   = el.querySelector('.fa');
  const isOpen = answer.classList.contains('open');

  /* 같은 그룹 내 다른 항목 모두 닫기 */
  const list = el.closest('.faq-list');
  if (list) {
    list.querySelectorAll('.faq-a').forEach(function (a) { a.classList.remove('open'); });
    list.querySelectorAll('.fa').forEach(function (i)   { i.textContent = '+'; });
  }

  if (!isOpen) {
    answer.classList.add('open');
    if (icon) icon.textContent = '−';
  }
}

/* ── FAQ 카테고리 필터 ── */
function filterFaq(cat, btn) {
  document.querySelectorAll('.faq-cat').forEach(function (b) {
    b.classList.remove('active');
  });
  btn.classList.add('active');

  document.querySelectorAll('.faq-item').forEach(function (item) {
    item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
  });
}

/* ── 스크롤 시 헤더 그림자 강조 ── */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.style.boxShadow = '0 3px 12px rgba(0,0,0,.18)';
    } else {
      header.style.boxShadow = '0 2px 0 rgba(0,0,0,.1)';
    }
  }, { passive: true });
})();

/* ── 스크롤 애니메이션 (Intersection Observer) ── */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const style = document.createElement('style');
  style.textContent = `
    .fade-up {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity .55s ease, transform .55s ease;
    }
    .fade-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.step-card, .card, .rate-card, .merit-item, .tl-item, .comp-card, .ct-item'
  );

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(function (el) {
    el.classList.add('fade-up');
    observer.observe(el);
  });
})();

/* 김만기 이름연구소 - main.js */
(function () {
  'use strict';

  /* 1. 헤더 스크롤 */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 2. 모바일 메뉴 */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('open');
    });
  });

  /* 3. 스크롤 등장 애니메이션 */
  var targets = document.querySelectorAll(
    '.section-eyebrow, .section-title, .section-desc, .about-text, .about-card,' +
    '.service-card, .service-note, .method-item, .process-list li,' +
    '.tool-card,' +
    '.faq-item, .contact-form, .contact-direct'
  );
  targets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) { el.classList.add('visible'); });
  }

  /* 4. FAQ 하나만 열기 */
  var faqItems = document.querySelectorAll('#faqList .faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* 5. 문의 폼 -> 메일 앱 */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  var MAIL_TO = 'a80717961@gmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    if (!name || !phone) {
      note.textContent = '성함과 연락처를 입력해 주세요.';
      return;
    }

    var body = [
      '성함: ' + name,
      '연락처: ' + phone,
      '문의 종류: ' + form.type.value,
      '생년월일시: ' + (form.birth.value.trim() || '(미기재)'),
      '',
      '내용:',
      form.message.value.trim() || '(없음)',
      '',
      '---',
      '김만기 이름연구소 홈페이지 문의'
    ].join('\n');

    var url = 'mailto:' + MAIL_TO +
      '?subject=' + encodeURIComponent('[작명 문의] ' + name + ' - ' + form.type.value) +
      '&body=' + encodeURIComponent(body);

    window.location.href = url;
    note.textContent = '메일 앱이 열립니다. 열리지 않으면 전화로 연락 주세요.';
  });
})();

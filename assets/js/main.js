(function () {
  'use strict';

  /* ---------------- Settings ---------------- */

  // Campaign: starts 22 Shahrivar 1405 (13 Sep 2026) 00:00 Tehran time, runs 22 days
  // → ends 13 Mehr 1405 (5 Oct 2026) 00:00 Tehran time.
  var CAMPAIGN_START = new Date('2026-09-13T00:00:00+03:30').getTime();
  var CAMPAIGN_DAYS = 22;
  var CAMPAIGN_END = CAMPAIGN_START + CAMPAIGN_DAYS * 864e5;

  var DISCOUNT_PERCENT = 15;
  var CAROUSEL_INTERVAL = 2000;       // ms between slides
  var CAROUSEL_DURATION = 600;        // ms slide animation (auto-play)
  var CAROUSEL_MANUAL_DURATION = 320; // ms slide animation (arrows)

  // "Tamin Time" collection — edit names / prices / links here
  var HOT_PRODUCTS = [
    { img: '2641', name: 'روان‌نویس یونی‌بال آی سبز',          price: 145000 },
    { img: '2071', name: 'زونکن پهن سبز',                       price: 98000 },
    { img: '1590', name: 'دفتر روزنامه جلد قهوه‌ای',            price: 185000 },
    { img: '1128', name: 'دفتر روزنامه جلد آبی',                price: 185000 },
    { img: '1359', name: 'خودکار قرمز (بسته ۳ عددی)',           price: 72000 },
    { img: '4577', name: 'زونکن کلاسیک نارنجی',                 price: 105000 },
    { img: '6001', name: 'ماژیک هایلایت نووس زرد',              price: 38000 },
    { img: '1271', name: 'دفتر روزنامه جلد بنفش',               price: 185000 },
    { img: '1908', name: 'روان‌نویس نوک‌نمدی استدلر سبز',      price: 64000 },
    { img: '2110', name: 'ماژیک اسنومن سبز',                    price: 45000 },
    { img: '3238', name: 'زونکن کلاسیک قرمز',                   price: 105000 },
    { img: '3259', name: 'باکس فایل قرمز',                      price: 165000 },
    { img: '3508', name: 'روان‌نویس ۰٫۵ آبی',                   price: 58000 },
    { img: '3509', name: 'روان‌نویس ۰٫۵ قرمز',                  price: 58000 },
    { img: '5601', name: 'نوک مداد نوکی کرونا ۰٫۵',             price: 32000 },
    { img: '5677', name: 'ماژیک وایت‌برد قرمز',                 price: 42000 },
    { img: '6019', name: 'ماژیک فسفری پنمکس نارنجی',            price: 52000 },
    { img: '604',  name: 'زونکن ایگل قرمز',                     price: 112000 },
    { img: '1591', name: 'دفتر کل جلد بنفش',                    price: 210000 },
    { img: '6075', name: 'مداد نوکی فلزی سبز',                  price: 89000 },
    { img: '2026', name: 'سینی نامه دو طبقه',                   price: 265000 }
  ];

  /* ---------------- Helpers ---------------- */

  var FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
  function toFa(value) {
    return String(value).replace(/\d/g, function (d) { return FA_DIGITS[d]; });
  }
  function pad2(n) {
    return toFa(n < 10 ? '0' + n : String(n));
  }
  function money(n) {
    return n.toLocaleString('fa-IR');
  }
  function discounted(price) {
    return Math.round(price * (100 - DISCOUNT_PERCENT) / 100 / 1000) * 1000;
  }
  function mod(n, m) {
    return ((n % m) + m) % m;
  }
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /* ---------------- Countdown ---------------- */

  function initCountdown() {
    var root = document.getElementById('countdown');
    if (!root) return;

    var units = {};
    root.querySelectorAll('[data-unit]').forEach(function (el) {
      units[el.dataset.unit] = el;
    });
    var title = root.querySelector('[data-countdown-title]');
    var timer;

    function setText(el, text) {
      if (el.textContent === text) return;
      el.textContent = text;
      el.classList.remove('tick');
      void el.offsetWidth; // restart animation
      el.classList.add('tick');
    }

    function render() {
      var now = Date.now();
      var target = CAMPAIGN_END;
      var label = 'تا پایان جشنواره';

      if (now < CAMPAIGN_START) {
        target = CAMPAIGN_START;
        label = 'تا شروع جشنواره';
      } else if (now >= CAMPAIGN_END) {
        label = 'جشنواره به پایان رسید';
        root.classList.add('is-ended');
        clearInterval(timer);
      }

      if (title.textContent !== label) title.textContent = label;

      var s = Math.max(0, Math.floor((target - now) / 1000));
      setText(units.days, pad2(Math.floor(s / 86400)));
      setText(units.hours, pad2(Math.floor((s % 86400) / 3600)));
      setText(units.minutes, pad2(Math.floor((s % 3600) / 60)));
      setText(units.seconds, pad2(s % 60));
    }

    render();
    timer = setInterval(render, 1000);
  }

  /* ---------------- Tamin Time carousel ---------------- */

  function miniCard(p) {
    var a = document.createElement('a');
    a.className = 'card mini-card text-decoration-none';
    a.href = p.url || '#';
    a.draggable = false;
    a.innerHTML =
      '<div class="mini-card__media position-relative">' +
        '<span class="badge badge-off rounded-pill position-absolute fw-black">' + toFa(DISCOUNT_PERCENT) + '٪</span>' +
        '<img class="object-fit-contain" src="assets/images/' + p.img + '.jpg" alt="' + p.name + '" width="200" height="200" loading="lazy" draggable="false">' +
      '</div>' +
      '<div class="card-body mini-card__body d-flex flex-column align-items-center text-center">' +
        '<del class="price-old fw-medium">' + money(p.price) + '</del>' +
        '<p class="price-new fw-black mb-0">' + money(discounted(p.price)) + ' <small>تومان</small></p>' +
        '<h3 class="mini-card__title fw-semibold">' + p.name + '</h3>' +
      '</div>';
    return a;
  }

  /*
   * Seamless loop without re-ordering the DOM: the list is rendered twice and the
   * track position is wrapped with modulo. Everything (auto-play, arrows, drag,
   * momentum) moves the same `pos` value and is painted in requestAnimationFrame.
   * RTL: the first card sits on the right; a positive X moves the track right = forward.
   */
  function initCarousel() {
    var viewport = document.getElementById('hotCarousel');
    if (!viewport) return;
    var track = viewport.querySelector('.hot-slider__track');
    var count = HOT_PRODUCTS.length;

    for (var copy = 0; copy < 2; copy++) {
      HOT_PRODUCTS.forEach(function (p) {
        var card = miniCard(p);
        if (copy) {
          card.setAttribute('aria-hidden', 'true');
          card.tabIndex = -1;
        }
        track.appendChild(card);
      });
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var step = 0;      // card width + gap
    var loop = 0;      // width of one full set
    var pos = 0;       // current offset in px
    var anim = null;   // { from, to, start, duration, ease }
    var raf = 0;
    var timer = null;
    var hovered = false;

    /* --- painting --- */

    function render() {
      track.style.transform = 'translate3d(' + mod(pos, loop) + 'px,0,0)';
    }

    function frame(now) {
      raf = 0;
      if (anim) {
        var t = Math.min(1, (now - anim.start) / anim.duration);
        pos = anim.from + (anim.to - anim.from) * anim.ease(t);
        if (t >= 1) {
          anim = null;
          pos = mod(pos, loop);
        }
      }
      render();
      if (anim) requestFrame();
    }

    function requestFrame() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function animateTo(to, duration, ease) {
      if (reduceMotion || duration <= 0 || Math.abs(to - pos) < 0.5) {
        anim = null;
        pos = mod(to, loop);
        requestFrame();
        return;
      }
      anim = { from: pos, to: to, start: performance.now(), duration: duration, ease: ease };
      requestFrame();
    }

    function go(delta, duration, ease) {
      var base = anim ? anim.to : Math.round(pos / step) * step;
      animateTo(base + delta * step, duration, ease);
    }

    function measure() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var newStep = track.firstElementChild.getBoundingClientRect().width + gap;
      var index = step ? Math.round((anim ? anim.to : pos) / step) : 0;
      anim = null;
      step = newStep;
      loop = step * count;
      pos = mod(index * step, loop);
      render();
    }

    /* --- auto-play --- */

    function start() {
      stop();
      timer = setInterval(function () {
        if (!hovered && pointerId === null && !document.hidden) {
          go(1, CAROUSEL_DURATION, easeInOutCubic);
        }
      }, CAROUSEL_INTERVAL);
    }
    function stop() {
      if (timer) clearInterval(timer);
    }

    /* --- arrows --- */

    document.querySelectorAll('.hot__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        go(btn.dataset.dir === 'next' ? 1 : -1, CAROUSEL_MANUAL_DURATION, easeOutCubic);
        start();
      });
    });

    /* --- hover pause (mouse only, so taps don't stop auto-play on phones) --- */

    viewport.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') hovered = true;
    });
    viewport.addEventListener('pointerleave', function (e) {
      if (e.pointerType === 'mouse') hovered = false;
    });
    viewport.addEventListener('focusin', function () { hovered = true; });
    viewport.addEventListener('focusout', function () { hovered = false; });

    /* --- drag / swipe with momentum --- */

    var pointerId = null;
    var dragging = false;
    var moved = false;
    var startX = 0;
    var startPos = 0;
    var resumeTo = null;
    var samples = [];

    viewport.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || pointerId !== null) return;
      pointerId = e.pointerId;
      dragging = false;
      moved = false;
      startX = e.clientX;
      resumeTo = anim ? anim.to : null;
      anim = null;               // catch the track wherever it is
      startPos = pos;
      samples = [{ x: e.clientX, t: e.timeStamp }];
      if (e.pointerType === 'mouse') e.preventDefault(); // no text selection
    });

    viewport.addEventListener('pointermove', function (e) {
      if (e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;

      if (!dragging) {
        if (Math.abs(dx) < 5) return;
        dragging = true;
        moved = true;
        try { viewport.setPointerCapture(pointerId); } catch (err) { /* ignore */ }
        viewport.classList.add('is-dragging');
      }

      pos = startPos + dx;
      samples.push({ x: e.clientX, t: e.timeStamp });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
      requestFrame();
    });

    function endDrag(e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;

      if (!dragging) {
        // plain click/tap: let an interrupted slide finish
        if (resumeTo !== null) animateTo(resumeTo, 250, easeOutCubic);
        return;
      }

      dragging = false;
      viewport.classList.remove('is-dragging');

      // release velocity (px/ms) from the last ~100ms of movement
      var velocity = 0;
      var first = samples[0];
      var last = samples[samples.length - 1];
      if (last.t > first.t && e.timeStamp - last.t < 80) {
        velocity = (last.x - first.x) / (last.t - first.t);
      }

      var projected = pos + velocity * 200;
      var to = Math.round(projected / step) * step;
      var duration = Math.min(700, Math.max(260, Math.abs(to - pos) * 1.1));
      animateTo(to, duration, easeOutCubic);
      start();
    }

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // Don't follow a link after a drag
    viewport.addEventListener('click', function (e) {
      if (moved) {
        e.preventDefault();
        moved = false;
      }
    }, true);

    window.addEventListener('resize', measure);

    measure();
    start();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCountdown();
    initCarousel();
  });
})();

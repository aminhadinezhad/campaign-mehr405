(function () {
  "use strict";

  /* ---------------- Settings ---------------- */

  // Campaign: starts 22 Shahrivar 1405 (13 Sep 2026) 00:00 Tehran time, runs 22 days
  // → ends 13 Mehr 1405 (5 Oct 2026) 00:00 Tehran time.
  var CAMPAIGN_START = new Date("2026-09-13T00:00:00+03:30").getTime();
  var CAMPAIGN_DAYS = 22;
  var CAMPAIGN_END = CAMPAIGN_START + CAMPAIGN_DAYS * 864e5;

  var DISCOUNT_PERCENT = 15;
  var CAROUSEL_INTERVAL = 2000; // ms between slides
  var CAROUSEL_DURATION = 600; // ms slide animation (auto-play)
  var CAROUSEL_MANUAL_DURATION = 320; // ms slide animation (arrows)

  // Product pages live at https://www.taminfalat.com/product/detail/<slug>
  var PRODUCT_BASE_URL = "https://www.taminfalat.com/product/detail/";

  // "Tamin Time" collection — edit names / prices / links here.
  // Link each card with `slug` (the part after /product/detail/ in the product page
  // address) or with a full `url`. Cards without either link to "#".
  var HOT_PRODUCTS = [
    {
      img: "2641",
      name: "روان نویس یونی بال سبز چشمی میکرو",
      price: 280000,
      slug: "روان-نویس-یونی-بال-سبز-چشمی-میکرو",
    },
    {
      img: "2071",
      name: "زونکن A4 سبز کلاسیک 4/5 سانت",
      price: 371900,
      slug: "زونکن-A4-سبز-4-5-کلاسیک",
    },
    {
      img: "1590",
      name: "دفتر روزنامه قطع رحلی 200 برگ",
      price: 289500,
      slug: "دفتر-روزنامه-سایز-A4",
    },
    {
      img: "1128",
      name: "دفتر روزنامه رحلی 100 برگ",
      price: 600000,
      slug: "دفتر-روزنامه-100-برگ",
    },
    {
      img: "1359",
      name: "خودکار پنتر قرمز مدل 101 SP",
      price: 55800,
      slug: "خودکار-پنتر-قرمز-مدل-101-SP",
    },
    {
      img: "4577",
      name: "زونکنA4 نارنجی کلاسیک 7/5 سانت",
      price: 371900,
      slug: "زونکنA4-نارنجی-کلاسیک-7-5-سانت",
    },
    {
      img: "6001",
      name: "ماژیک های لایت زرد NOVUS",
      price: 58700,
      slug: "ماژیک-های-لایت-زرد-NOVUS",
    },
    {
      img: "1271",
      name: "دفتر روزنامه وزیری 160 برگ",
      price: 600000,
      slug: "دفتر-روزنامه-وزیری-160-رگ",
    },
    {
      img: "1908",
      name: "روان نویس نوک نمدی سبز استدلر",
      price: 140000,
      slug: "روان-نویس-نوک-نمدی-سبز-استدلر",
    },
    {
      img: "2110",
      name: "ماژیک نوک گرد سبز اسنومن",
      price: 184200,
      slug: "ماژیک-نوک-گرد-سبز-اسنومن",
    },
    {
      img: "3238",
      name: "زونکن A4 قرمز کلاسیک 7/5 سانت",
      price: 371900,
      slug: "زونکن-A4-قرمز-7-5-سانت-کلاسیک",
    },
    {
      img: "3259",
      name: "جامجله ای 3 گوش قرمز ووکس10 سانت",
      price: 120000,
      slug: "جامجله-ای-3-گوش-قرمز-ووکس-7-5-سانت",
    },
    {
      img: "3509",
      name: "روان نویس قرمز پارسیکار 2110",
      price: 143000,
      slug: "روان-نویس-قرمز-پارسیکار-2110",
    },
    {
      img: "5601",
      name: "نوک اتود کرونا 0/5",
      price: 24500,
      slug: "نوک-اتود-کرونا-0-5",
    },
    {
      img: "5677",
      name: "ماژیک وایت برد نوک تخت قرمز سلنا",
      price: 28000,
      slug: "ماژیک-وایت-برد-نوک-تخت-قرمز-سلنا",
    },
    {
      img: "1591",
      name: "دفتر کل رحلی شقایق 100 برگ",
      price: 600000,
      slug: "دفتر-کل-رحلی-شقایق-100-برگ",
    },
    {
      img: "6075",
      name: "مداد اتود پریت 0.5",
      price: 89900,
      slug: "مداد-اتود-پریت-0-5",
    },
  ];

  /* ---------------- Helpers ---------------- */

  var FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
  function toFa(value) {
    return String(value).replace(/\d/g, function (d) {
      return FA_DIGITS[d];
    });
  }
  function pad2(n) {
    return toFa(n < 10 ? "0" + n : String(n));
  }
  function money(n) {
    return n.toLocaleString("fa-IR");
  }
  function productUrl(p) {
    if (p.url) return p.url;
    if (p.slug) return PRODUCT_BASE_URL + p.slug;
    return "#";
  }
  function discounted(price) {
    return Math.round((price * (100 - DISCOUNT_PERCENT)) / 100 / 1000) * 1000;
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
    var root = document.getElementById("countdown");
    if (!root) return;

    var units = {};
    root.querySelectorAll("[data-unit]").forEach(function (el) {
      units[el.dataset.unit] = el;
    });
    var title = root.querySelector("[data-countdown-title]");
    var timer;

    function setText(el, text) {
      if (el.textContent === text) return;
      el.textContent = text;
      el.classList.remove("tick");
      void el.offsetWidth; // restart animation
      el.classList.add("tick");
    }

    function render() {
      var now = Date.now();
      var target = CAMPAIGN_END;
      var label = "تا پایان جشنواره";

      if (now < CAMPAIGN_START) {
        target = CAMPAIGN_START;
        label = "تا شروع جشنواره";
      } else if (now >= CAMPAIGN_END) {
        label = "جشنواره به پایان رسید";
        root.classList.add("is-ended");
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
    var a = document.createElement("a");
    a.className = "card mini-card text-decoration-none";
    a.href = productUrl(p);
    if (a.getAttribute("href") !== "#") {
      a.target = "_blank";
      a.rel = "noopener";
    }
    a.draggable = false;
    a.innerHTML =
      '<div class="mini-card__media position-relative">' +
      '<span class="badge badge-off rounded-pill position-absolute fw-black">' +
      toFa(DISCOUNT_PERCENT) +
      "٪</span>" +
      '<img class="object-fit-contain" src="assets/images/' +
      p.img +
      '.jpg" alt="' +
      p.name +
      '" width="200" height="200" loading="lazy" draggable="false">' +
      "</div>" +
      '<div class="card-body mini-card__body d-flex flex-column align-items-center text-center">' +
      '<del class="price-old fw-medium">' +
      money(p.price) +
      "</del>" +
      '<p class="price-new fw-black mb-0">' +
      money(discounted(p.price)) +
      " <small>تومان</small></p>" +
      '<h3 class="mini-card__title fw-semibold">' +
      p.name +
      "</h3>" +
      "</div>";
    return a;
  }

  /*
   * Seamless loop without re-ordering the DOM: the list is rendered twice and the
   * track position is wrapped with modulo. Everything (auto-play, arrows, drag,
   * momentum) moves the same `pos` value and is painted in requestAnimationFrame.
   * RTL: the first card sits on the right; a positive X moves the track right = forward.
   */
  function initCarousel() {
    var viewport = document.getElementById("hotCarousel");
    if (!viewport) return;
    var track = viewport.querySelector(".hot-slider__track");
    var count = HOT_PRODUCTS.length;

    for (var copy = 0; copy < 2; copy++) {
      HOT_PRODUCTS.forEach(function (p) {
        var card = miniCard(p);
        if (copy) {
          card.setAttribute("aria-hidden", "true");
          card.tabIndex = -1;
        }
        track.appendChild(card);
      });
    }

    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    var step = 0; // card width + gap
    var loop = 0; // width of one full set
    var pos = 0; // current offset in px
    var anim = null; // { from, to, start, duration, ease }
    var raf = 0;
    var timer = null;
    var hovered = false;

    /* --- painting --- */

    function render() {
      track.style.transform = "translate3d(" + mod(pos, loop) + "px,0,0)";
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
      anim = {
        from: pos,
        to: to,
        start: performance.now(),
        duration: duration,
        ease: ease,
      };
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

    document.querySelectorAll(".hot__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        go(
          btn.dataset.dir === "next" ? 1 : -1,
          CAROUSEL_MANUAL_DURATION,
          easeOutCubic,
        );
        start();
      });
    });

    /* --- hover pause (mouse only, so taps don't stop auto-play on phones) --- */

    viewport.addEventListener("pointerenter", function (e) {
      if (e.pointerType === "mouse") hovered = true;
    });
    viewport.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "mouse") hovered = false;
    });
    viewport.addEventListener("focusin", function () {
      hovered = true;
    });
    viewport.addEventListener("focusout", function () {
      hovered = false;
    });

    /* --- drag / swipe with momentum --- */

    var pointerId = null;
    var dragging = false;
    var moved = false;
    var startX = 0;
    var startPos = 0;
    var resumeTo = null;
    var samples = [];

    viewport.addEventListener("pointerdown", function (e) {
      if (e.button > 0 || pointerId !== null) return;
      pointerId = e.pointerId;
      dragging = false;
      moved = false;
      startX = e.clientX;
      resumeTo = anim ? anim.to : null;
      anim = null; // catch the track wherever it is
      startPos = pos;
      samples = [{ x: e.clientX, t: e.timeStamp }];
      if (e.pointerType === "mouse") e.preventDefault(); // no text selection
    });

    viewport.addEventListener("pointermove", function (e) {
      if (e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;

      if (!dragging) {
        if (Math.abs(dx) < 5) return;
        dragging = true;
        moved = true;
        try {
          viewport.setPointerCapture(pointerId);
        } catch (err) {
          /* ignore */
        }
        viewport.classList.add("is-dragging");
      }

      pos = startPos + dx;
      samples.push({ x: e.clientX, t: e.timeStamp });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 100)
        samples.shift();
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
      viewport.classList.remove("is-dragging");

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

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("dragstart", function (e) {
      e.preventDefault();
    });

    // Don't follow a link after a drag
    viewport.addEventListener(
      "click",
      function (e) {
        if (moved) {
          e.preventDefault();
          moved = false;
        }
      },
      true,
    );

    window.addEventListener("resize", measure);

    measure();
    start();
  }

  /* ---------------- Footer: back to top ---------------- */

  function initScrollTop() {
    document.querySelectorAll(".btn-scroll-to-top").forEach(function (btn) {
      btn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  /* ---------------- Footer: newsletter ---------------- */

  // Same endpoint as the main site (POST /site/subscribe). This page is static,
  // so the CSRF token is read from the main site's homepage — same domain,
  // same session cookie. Only works on www.taminfalat.com, not from a local file.
  function initNewsletter() {
    var btn = document.getElementById("action_subscribe");
    var input = document.getElementById("action_point_subscriber");
    if (!btn || !input) return;

    var status = document.createElement("p");
    status.className = "newsletter-status";
    status.setAttribute("role", "status");
    btn.parentNode.insertAdjacentElement("afterend", status);

    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var busy = false;

    function show(message, ok) {
      status.textContent = message;
      status.classList.toggle("is-error", !ok);
    }

    function getToken() {
      return fetch("/", { credentials: "same-origin" })
        .then(function (res) {
          return res.text();
        })
        .then(function (html) {
          var match = html.match(/name="_token"[^>]*value="([^"]+)"/);
          if (!match) throw new Error("csrf token not found");
          return match[1];
        });
    }

    function submit() {
      var email = input.value.trim();
      if (!EMAIL_RE.test(email)) {
        show("لطفاً یک ایمیل معتبر وارد کنید.", false);
        input.focus();
        return;
      }
      if (busy) return;
      busy = true;
      btn.disabled = true;
      show("در حال ثبت…", true);

      getToken()
        .then(function (token) {
          return fetch("/site/subscribe", {
            method: "POST",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              Accept: "application/json",
              "X-CSRF-TOKEN": token,
              "X-Requested-With": "XMLHttpRequest",
            },
            body: JSON.stringify({ _token: token, email: email }),
          });
        })
        .then(function (res) {
          if (res.ok) {
            input.value = "";
            show("ایمیل شما در خبرنامه تامین فلات ثبت شد.", true);
            return;
          }
          if (res.status === 429) {
            show(
              "تعداد درخواست‌ها زیاد است؛ چند دقیقه بعد دوباره تلاش کنید.",
              false,
            );
            return;
          }
          if (res.status === 422) {
            // the server returns the validation message itself as a JSON string
            return res.json().then(function (message) {
              show(
                typeof message === "string" ? message : "ثبت ایمیل انجام نشد.",
                false,
              );
            });
          }
          throw new Error("HTTP " + res.status);
        })
        .catch(function () {
          show("ثبت ایمیل انجام نشد؛ لطفاً دوباره تلاش کنید.", false);
        })
        .then(function () {
          busy = false;
          btn.disabled = false;
        });
    }

    btn.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCountdown();
    initCarousel();
    initScrollTop();
    initNewsletter();
  });
})();

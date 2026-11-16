/* Fyndora storefront: cart, bilingual text, order flow. */
(function () {
  "use strict";

  // ---------- Settings (change here) ----------
  var CONFIG = {
    // Google Apps Script web-app URL. Empty = demo mode (order is not sent anywhere).
    ORDER_ENDPOINT: "https://script.google.com/macros/s/AKfycbwA26p-JsXPnbZ8ZCxpKDOZhkE_6vm9txqMmkUiR2gE71lWU9LdxVomTz597JelQeDMbw/exec",
    PRICE: 540,
    WAS: 590,
    DELIVERY: { inside: 60, outside: 120 },
    WHATSAPP: "8801314624969"
  };

  var PRODUCTS = {
    "combo-a":       { en: "Combo A (Lemon, Tea, Jasmine, Vanilla)", bn: "কম্বো A (লেমন, টি, জুঁই, ভ্যানিলা)", img: "assets/img/combo-a.webp", price: 2100 },
    "combo-b":       { en: "Combo B (Lemon, Rose, Mint, Lavender)", bn: "কম্বো B (লেমন, রোজ, মিন্ট, ল্যাভেন্ডার)", img: "assets/img/combo-b.webp", price: 2100 },
    "jasmine":       { en: "Jasmine",            bn: "জুঁই (Jasmine)",          img: "assets/img/jasmine.webp" },
    "lavender":      { en: "Lavender",           bn: "ল্যাভেন্ডার",              img: "assets/img/lavender.webp" },
    "lemon-floral":  { en: "Lemon, floral tin",  bn: "লেমন, ফ্লোরাল টিন",       img: "assets/img/lemon-floral.webp" },
    "lemon-paisley": { en: "Lemon, paisley tin", bn: "লেমন, পেইসলি টিন",        img: "assets/img/lemon-paisley.webp" },
    "mint":          { en: "Mint",               bn: "মিন্ট (পুদিনা)",           img: "assets/img/mint.webp" },
    "rose":          { en: "Rose",               bn: "রোজ (গোলাপ)",             img: "assets/img/rose.webp" },
    "tea":           { en: "Tea",                bn: "টি (চা)",                 img: "assets/img/tea.webp" },
    "vanilla":       { en: "Vanilla",            bn: "ভ্যানিলা",                 img: "assets/img/vanilla.webp" }
  };

  var BN = {
    "nav.collection": "কালেকশন", "nav.gift": "গিফট", "nav.details": "বিস্তারিত", "nav.faq": "প্রশ্নোত্তর", "nav.cart": "কার্ট",
    "hero.title": "যে উপহারে যত্নের ছাপ থাকে।",
    "hero.lead": "নকশা প্রিন্ট করা মেটাল টিনে আটটি সয় ওয়াক্স সুগন্ধি, পৌঁছে যাবে প্রিয়জনের দরজায়।", "nav.quick": "সহজ অর্ডার",
    "hero.each": "প্রতিটি", "hero.cta": "সুগন্ধি বেছে নিন", "hero.wa": "WhatsApp-এ জানুন",
        "col.title": "তাঁর পছন্দের সুগন্ধি বেছে নিন", "combo.badge": "৪টির সেট", "p.comboa": "কম্বো A", "p.combob": "কম্বো B", "n.comboa": "লেমন, টি, জুঁই ও ভ্যানিলা", "n.combob": "লেমন, রোজ, মিন্ট ও ল্যাভেন্ডার",
    "col.lead": "সারিটি থামাতে মাউস রাখুন। যতগুলোই নিন, ডেলিভারি চার্জ পুরো অর্ডারে একবারই।",
    "col.leadTouch": "আরও দেখতে আঙুল দিয়ে সরান বা তীরে চাপুন",
    "p.jasmine": "জুঁই (Jasmine)", "p.lavender": "ল্যাভেন্ডার", "p.lemonf": "লেমন, ফ্লোরাল টিন", "p.lemonp": "লেমন, পেইসলি টিন",
    "p.mint": "মিন্ট (পুদিনা)", "p.rose": "রোজ (গোলাপ)", "p.tea": "টি (চা)", "p.vanilla": "ভ্যানিলা",
    "n.jasmine": "নরম সাদা ফুলের ঘ্রাণ, ধীর সন্ধ্যার জন্য",
    "n.lavender": "শান্ত, ভেষজ ঘ্রাণ, দিনশেষের বিশ্রামে",
    "n.lemon": "ঝকঝকে, তাজা, খোলা জানালার মতো",
    "n.lemonp": "একই লেমন, বেগুনি পেইসলি টিনে",
    "n.mint": "ঠান্ডা ও পরিষ্কার, পড়ার টেবিলের জন্য",
    "n.rose": "চিরচেনা গোলাপ, ভালোবাসার মানুষের জন্য",
    "n.tea": "উষ্ণ ও নিরিবিলি, প্রথম কাপের মতো",
    "n.vanilla": "মিষ্টি ও আরামদায়ক, সবার প্রিয়",
    "add": "কার্টে যোগ করুন",
    "gift.title": "উপহার দেওয়ার জন্যই তৈরি",
    "gift.1t": "বক্সে মোড়ানো অবস্থায় পৌঁছায়", "gift.1": "প্রতিটি টিন নিজস্ব প্রিন্টেড বক্সে আসে, হাতে তুলে দিলেই হলো।",
    "gift.2t": "মোম ফুরালেও টিন থেকে যায়", "gift.2": "নকশা প্রিন্ট করা মেটালের কৌটা, আংটি, ক্লিপ বা চকলেট রাখার কাজে লাগে।",
    "gift.3t": "চারটির সেট, উপহারের জন্য তৈরি", "gift.3": "চারটি সুগন্ধির দুটি কম্বো, উপহারটা যেন হয় আরও উদার।",
    "det.title": "অর্ডারের আগে জেনে নিন",
    "det.lead": "দুটি কথা আমরা সবসময় আগে বলি: ক্যান্ডেলটি ছোট, আর ঘ্রাণ মৃদু। এই সততার কারণেই আজ পর্যন্ত কেউ ফেরত পাঠাননি।",
    "det.orders": "অর্ডার ডেলিভারি হয়েছে", "det.returns": "এখন পর্যন্ত রিটার্ন",
    "s.size": "ক্যান্ডেলের মাপ", "s.sizev": "৬.৯ সেমি চওড়া, ৭.৭ সেমি উঁচু",
    "s.scent": "ঘ্রাণ", "s.scentv": "মাঝারি (moderate), ঘরে মৃদু সুবাস",
    "s.box": "বক্সের মাপ", "s.boxv": "৭.২ × ৮ সেমি",
    "s.wax": "মোম", "s.waxv": "সয় ওয়াক্স, ৪ আউন্স (১১৩ গ্রাম)",
    "s.weight": "বক্সসহ ওজন", "s.weightv": "১৫০ গ্রাম",
    "s.burn": "জ্বলার সময়", "s.burnv": "কমপক্ষে ১৬ ঘণ্টা",
    "s.tin": "পাত্র", "s.tinv": "ঢাকনাসহ মেটাল টিন",
    "wish.title": "ডিজিটাল উইশ কার্ড যোগ করুন",
    "wish.lead": "প্রিয়জনের নাম আর আপনার কথা দিয়ে আমরা একটি কার্ড ডিজাইন করে দেব, বিশেষ দিনে পাঠানোর জন্য। এর জন্য সামান্য বাড়তি খরচ; ডিজাইন ও দাম WhatsApp-এ ঠিক করে নেব।",
    "wish.cta": "উইশ কার্ড নিয়ে জানুন",
    "ret.title": "৩ দিনের নো-রিজন রিটার্ন",
    "own.title": "Fyndora-র পেছনে কে আছেন", "own.name": "শাহরিয়ার", "own.role": "প্রতিষ্ঠাতা, Fyndora, লক্ষ্মীপুর",
    "own.text": "আমি শাহরিয়ার, লক্ষ্মীপুর থেকে Fyndora চালাই। আমরা যে ক্যান্ডেল বিক্রি করি তার প্রতিটি আমি নিজে বাছাই করি, আর পাঠানোর আগে প্রতিটি পার্সেল চেক করি। কোনো সমস্যা হলে সরাসরি আমাকে মেসেজ করতে পারেন।",
    "own.cta": "WhatsApp-এ আমাকে মেসেজ করুন",
    "qo.title": "সহজ অর্ডার", "qo.lead": "যে ক্যান্ডেল চান তার পাশে + চাপুন। শেষ হলে \"অর্ডার করতে যান\" চাপুন।", "qo.go": "অর্ডার করতে যান",
    "qo.items": "টি পণ্য", "qo.none": "এখনো কিছু বাছাই করা হয়নি", "qo.plus": "ডেলিভারি চার্জ আলাদা",
    "ret.1": "হাতে পাওয়ার ৩ দিনের মধ্যে ফেরত দিতে পারবেন, কোনো কারণ বলতে হবে না।",
    "ret.2": "আপনার ঠিকানা থেকেই আমরা পিকআপের ব্যবস্থা করব।",
    "ret.3": "রিটার্ন ডেলিভারি চার্জ কেটে বাকি টাকা ফেরত দেওয়া হবে।",
    "cond.t": "প্রতিটি রিটার্নের শর্ত", "cond": "ক্যান্ডেলটি জ্বালানো বা ব্যবহার করা যাবে না, আবার বিক্রি করার মতো অবস্থায় থাকতে হবে। জ্বালানো বা ব্যবহৃত ক্যান্ডেল ফেরত নেওয়া হবে না।",
    "ret.4": "রাইডারের সামনেই চেক করে নিতে পারেন; পছন্দ না হলে শুধু ডেলিভারি চার্জ দিয়ে ফেরত দিন।",
    "faq.title": "যে প্রশ্নগুলো সবচেয়ে বেশি আসে",
    "q1": "টিনটা কিসের তৈরি?", "a1": "মেটালের। ঢাকনাসহ নকশা প্রিন্ট করা টিনের কৌটা, ক্যান্ডেল শেষ হলেও কাজে লাগে।",
    "q2": "কত ঘণ্টা জ্বলবে?", "a2": "কমপক্ষে ১৬ ঘণ্টা। প্রথমবার জ্বালানোর সময় উপরের মোম কিনারা পর্যন্ত গলতে দিন, তাহলে মাঝখানে গর্ত (tunneling) হবে না।",
    "q3": "সাইজ ও ওজন কত?", "a3": "ক্যান্ডেল ৬.৯ সেমি চওড়া, ৭.৭ সেমি উঁচু; বক্স ৭.২ × ৮ সেমি। ভেতরে ১১৩ গ্রাম সয় ওয়াক্স, বক্সসহ ওজন ১৫০ গ্রাম। এটি ছোট ক্যান্ডেল, বেডসাইড, টেবিল বা উপহারের জন্য উপযুক্ত।",
    "q4": "ঘ্রাণ কতটা তীব্র?", "a4": "মাঝারি (moderate)। ছোট ঘরে মৃদু সুবাস দেয়, বড় হলরুম ভরিয়ে দেয় না। খুব কড়া ঘ্রাণ চাইলে এটি আপনার জন্য নাও হতে পারে।",
    "q5": "ডেলিভারি চার্জ ১২০ টাকা কেন?", "a5": "আমাদের স্টক লক্ষ্মীপুরে, তাই প্রতিটি পার্সেল সেখান থেকে Steadfast কুরিয়ারে যায়। লক্ষ্মীপুরের ভেতরে ৬০ টাকা; ঢাকাসহ বাকি সব জায়গায় ১২০ টাকা।",
    "q6": "পেমেন্ট কীভাবে, কবে পাব?", "a6": "শুধু ক্যাশ অন ডেলিভারি, হাতে পেয়ে টাকা দেবেন। সময় লাগে ২ থেকে ৫ দিন।",
    "foot.about": "যত্নে বাছাই করা উপহার আর ছোট ছোট বিলাসিতা, লক্ষ্মীপুর থেকে সারা বাংলাদেশে।",
    "foot.talk": "যোগাযোগ", "foot.shop": "শপ",
    "foot.base": "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি, Steadfast কুরিয়ারে।",
    "cart.title": "আপনার কার্ট",
    "form.title": "কোথায় পাঠাব?", "form.name": "আপনার নাম", "form.phone": "মোবাইল নম্বর",
    "form.address": "পূর্ণ ঠিকানা", "form.addressPh": "বাসা, রোড, এলাকা, জেলা",
    "form.zone": "ডেলিভারি এলাকা", "zone.in": "লক্ষ্মীপুরের ভেতরে", "zone.out": "লক্ষ্মীপুরের বাইরে",
    "form.wish": "আমি ডিজিটাল উইশ কার্ডও চাই। এটি বাড়তি টাকার সেবা; ডিজাইন ও দামের জন্য আপনারা WhatsApp-এ যোগাযোগ করবেন।",
    "form.note": "নোট (ঐচ্ছিক)",
    "err.name": "অনুগ্রহ করে নাম লিখুন।", "err.phone": "০১ দিয়ে শুরু ১১ সংখ্যার নম্বর দিন।", "err.address": "অনুগ্রহ করে পূর্ণ ঠিকানা লিখুন।",
    "t.sub": "সাবটোটাল", "t.del": "ডেলিভারি", "t.total": "মোট, ক্যাশ অন ডেলিভারি", "t.place": "অর্ডার করুন",
    "t.small": "পণ্য হাতে পেয়ে রাইডারকে টাকা দেবেন।",
    "c.title": "অর্ডারের আগে",
    "c.lead": "আমরা চাই আপনি খুশি হন, তাই দুটি বিষয় নিশ্চিত করুন:",
    "c.1": "ক্যান্ডেলটি ছোট: ৬.৯ সেমি চওড়া, ৭.৭ সেমি উঁচু।",
    "c.2": "ঘ্রাণ মাঝারি (moderate), মৃদু সুবাস, কড়া নয়।",
    "c.agree": "আমি সাইজ ও ঘ্রাণের বিষয়টি জেনেই অর্ডার করছি।",
    "c.back": "ফিরে যান", "c.ok": "অর্ডার নিশ্চিত করুন",
    "d.title": "ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে।",
    "d.lead": "Fyndora-র একজন প্রতিনিধি শীঘ্রই আপনাকে কল করে অর্ডারটি নিশ্চিত করবেন। অর্ডার নম্বরটি রেখে দিন।",
    "d.ok": "ঠিক আছে",
    "d.wa": "WhatsApp-এ অর্ডার পাঠান",
    "d.waNote": "শেষ ধাপ: নিচের বাটনে চাপুন, তারপর WhatsApp-এ Send চাপুন। তাহলেই অর্ডারটি আমাদের কাছে পৌঁছাবে।",
    "msg.added": "কার্টে যোগ হয়েছে", "msg.addedBtn": "যোগ হয়েছে", "msg.empty": "কার্ট খালি। একটি সুগন্ধি বেছে নিন।",
    "msg.emptyToast": "আগে কার্টে একটি ক্যান্ডেল যোগ করুন", "msg.fix": "লাল চিহ্নিত ঘরগুলো ঠিক করুন",
    "msg.fail": "অর্ডার পাঠানো যায়নি। আবার চেষ্টা করুন বা WhatsApp করুন।", "msg.demo": "ডেমো: অর্ডার কোথাও পাঠানো হয়নি",
    "msg.remove": "সরান", "msg.each": "প্রতিটি"
  };
  var EN_EXTRA = {
    "msg.added": "Added to cart", "msg.addedBtn": "Added", "msg.empty": "Your cart is empty. Pick a scent to begin.",
    "msg.emptyToast": "Add a candle to your cart first", "msg.fix": "Please fix the fields marked in red",
    "msg.fail": "The order could not be sent. Try again or message us on WhatsApp.", "msg.demo": "Demo: this order was not sent anywhere",
    "msg.remove": "Remove", "msg.each": "each",
    "col.leadTouch": "Swipe or tap the arrows to see more",
    "qo.items": "items", "qo.none": "Nothing chosen yet", "qo.plus": "plus delivery"
  };

  var doc = document.documentElement;
  doc.classList.add("js");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  // ---------- Language ----------
  var EN = {};
  $$("[data-i18n]").forEach(function (el) { EN[el.getAttribute("data-i18n")] = el.textContent; });
  $$("[data-i18n-ph]").forEach(function (el) { EN[el.getAttribute("data-i18n-ph")] = el.getAttribute("placeholder"); });
  Object.keys(EN_EXTRA).forEach(function (k) { EN[k] = EN_EXTRA[k]; });

  var lang = store.get("fy.lang", "en");
  var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
  function digits(s) { return lang === "bn" ? String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; }) : String(s); }
  function money(n) { return "৳" + digits(Number(n).toLocaleString("en-IN")); }
  function t(k) { return (lang === "bn" ? BN[k] : EN[k]) || EN[k] || k; }

  function applyLang() {
    doc.lang = lang;
    $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    $$("[data-money]").forEach(function (el) { el.textContent = money(el.getAttribute("data-money")); });
    $$("[data-num]").forEach(function (el) { el.textContent = digits(el.textContent.replace(/[০-৯]/g, function (d) { return BN_DIGITS.indexOf(d); })); });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang)); });
    render();
  }
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { lang = b.getAttribute("data-lang"); store.set("fy.lang", lang); applyLang(); });
  });

  // ---------- Toast ----------
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  // ---------- Marquee: clone once for a seamless loop ----------
  var track = $("#track"), marquee = $("#marquee");
  var swipeMode = window.matchMedia("(hover: none), (max-width: 900px)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!swipeMode) {
    $$(".card", track).forEach(function (c) {
      var k = c.cloneNode(true);
      k.setAttribute("aria-hidden", "true");
      $$("button", k).forEach(function (b) { b.tabIndex = -1; });
      track.appendChild(k);
    });
  } else {
    // Phones: a real swipeable row that also moves on its own until the visitor touches it.
    marquee.classList.add("is-swipe");
    doc.classList.add("is-swipe-page");
    $("#mqHint").setAttribute("data-i18n", "col.leadTouch");
    var autoTimer, idleTimer;
    var step = function (dir) {
      var c = $(".card", track); if (!c) return;
      var w = c.getBoundingClientRect().width + 16;
      var max = marquee.scrollWidth - marquee.clientWidth;
      var x = marquee.scrollLeft + dir * w;
      if (dir > 0 && marquee.scrollLeft >= max - 4) x = 0;
      if (dir < 0 && marquee.scrollLeft <= 4) x = max;
      marquee.scrollTo({ left: x, behavior: reduceMotion ? "auto" : "smooth" });
    };
    var play = function () { clearInterval(autoTimer); if (!reduceMotion) autoTimer = setInterval(function () { step(1); }, 3000); };
    var hold = function () { clearInterval(autoTimer); clearTimeout(idleTimer); idleTimer = setTimeout(play, 6000); };
    marquee.addEventListener("touchstart", hold, { passive: true });
    marquee.addEventListener("pointerdown", hold);
    $("#mqPrev").addEventListener("click", function () { hold(); step(-1); });
    $("#mqNext").addEventListener("click", function () { hold(); step(1); });
    play();
  }

  // ---------- Hero tilt ----------
  var tilt = $("#tilt");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (tilt && !reduce && window.matchMedia("(hover: hover)").matches) {
    tilt.addEventListener("mousemove", function (e) {
      var r = tilt.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty("--ry", (x * 8).toFixed(2) + "deg");
      tilt.style.setProperty("--rx", (-y * 8).toFixed(2) + "deg");
    });
    tilt.addEventListener("mouseleave", function () { tilt.style.setProperty("--rx", "0deg"); tilt.style.setProperty("--ry", "0deg"); });
  }

  // ---------- Reveal ----------
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(function (el, i) { el.style.transitionDelay = (i % 2) * 0.08 + "s"; io.observe(el); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- Cart ----------
  var cart = store.get("fy.cart", {});
  function priceOf(k) { return (PRODUCTS[k] && PRODUCTS[k].price) || CONFIG.PRICE; }
  function count() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function zone() { var z = $('input[name="zone"]:checked'); return z ? z.value : "outside"; }
  function sums() {
    var n = count(), sub = Object.keys(cart).reduce(function (s, k) { return s + (PRODUCTS[k] ? priceOf(k) * cart[k] : 0); }, 0), del = n ? CONFIG.DELIVERY[zone()] : 0;
    return { n: n, sub: sub, del: del, total: sub + del };
  }
  function save() { store.set("fy.cart", cart); }

  var QO_ORDER = ["jasmine", "lavender", "lemon-floral", "lemon-paisley", "mint", "rose", "tea", "vanilla", "combo-a", "combo-b"];
  var WAS = { "combo-a": 2360, "combo-b": 2360 };
  var qoBox = $("#qo");
  QO_ORDER.forEach(function (id) {
    var row = document.createElement("div");
    row.className = "qo-row"; row.setAttribute("data-id", id);
    row.innerHTML = '<img alt="" width="56" height="56" loading="lazy"><div><h3></h3><span class="qo-price"><span class="now"></span><s></s></span></div>' +
      '<div class="qty"><button type="button" data-d="-1">−</button><span>0</span><button type="button" data-d="1">+</button></div>';
    $("img", row).src = PRODUCTS[id].img;
    $$("button", row).forEach(function (b) {
      b.addEventListener("click", function () {
        cart[id] = Math.max(0, (cart[id] || 0) + Number(b.getAttribute("data-d")));
        if (!cart[id]) delete cart[id];
        save(); render();
        if (b.getAttribute("data-d") === "1") { var cb = $("#openCart"); cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump"); }
      });
    });
    qoBox.appendChild(row);
  });
  $("#qoGo").addEventListener("click", function () {
    if (!count()) { toast(t("msg.emptyToast")); return; }
    openDrawer();
  });
  function renderQO() {
    $$(".qo-row", qoBox).forEach(function (row) {
      var id = row.getAttribute("data-id"), n = cart[id] || 0;
      $("h3", row).textContent = PRODUCTS[id][lang];
      $(".now", row).textContent = money(priceOf(id));
      $("s", row).textContent = money(WAS[id] || CONFIG.WAS);
      $(".qty span", row).textContent = digits(n);
      $('[data-d="-1"]', row).setAttribute("aria-label", "−1 " + PRODUCTS[id].en);
      $('[data-d="1"]', row).setAttribute("aria-label", "+1 " + PRODUCTS[id].en);
      row.classList.toggle("has", n > 0);
    });
    var s = sums();
    $("#qoSum").textContent = s.n ? digits(s.n) + " " + t("qo.items") + ", " + money(s.sub) + " (" + t("qo.plus") + ")" : t("qo.none");
  }

  function render() {
    var lines = $("#lines");
    var ids = Object.keys(cart).filter(function (k) { return PRODUCTS[k] && cart[k] > 0; });
    if (!ids.length) {
      lines.innerHTML = '<p class="empty"></p>';
      $(".empty", lines).textContent = t("msg.empty");
    } else {
      lines.innerHTML = "";
      ids.forEach(function (id) {
        var p = PRODUCTS[id], row = document.createElement("div");
        row.className = "line";
        row.innerHTML =
          '<img alt="" width="72" height="72">' +
          '<div><h4></h4><small></small></div>' +
          '<div class="qty"><button type="button" data-d="-1"></button><span></span><button type="button" data-d="1">+</button></div>';
        $("img", row).src = p.img;
        $("h4", row).textContent = p[lang];
        $("small", row).textContent = money(priceOf(id)) + " " + t("msg.each");
        var minus = $('[data-d="-1"]', row);
        minus.textContent = cart[id] > 1 ? "−" : "×";
        minus.setAttribute("aria-label", cart[id] > 1 ? "−1" : t("msg.remove"));
        $('[data-d="1"]', row).setAttribute("aria-label", "+1");
        $("span", row).textContent = digits(cart[id]);
        $$("button", row).forEach(function (b) {
          b.addEventListener("click", function () {
            cart[id] += Number(b.getAttribute("data-d"));
            if (cart[id] <= 0) delete cart[id];
            save(); render();
          });
        });
        lines.appendChild(row);
      });
    }
    var s = sums();
    $("#cartCount").textContent = digits(s.n);
    $("#tSub").textContent = money(s.sub);
    $("#tDel").textContent = money(s.del);
    $("#tTotal").textContent = money(s.total);
    $("#orderForm").style.display = s.n ? "" : "none";
    renderQO();
  }

  track.addEventListener("click", function (e) {
    var b = e.target.closest(".add"); if (!b) return;
    var id = b.closest(".card").getAttribute("data-id");
    cart[id] = (cart[id] || 0) + 1; save(); render();
    var cb = $("#openCart"); cb.classList.remove("bump"); void cb.offsetWidth; cb.classList.add("bump");
    $$('.card[data-id="' + id + '"] .add').forEach(function (x) {
      x.classList.add("is-added"); x.textContent = t("msg.addedBtn");
      setTimeout(function () { x.classList.remove("is-added"); x.textContent = t("add"); }, 1400);
    });
    toast(PRODUCTS[id][lang] + ": " + t("msg.added"));
  });
  $$('input[name="zone"]').forEach(function (r) { r.addEventListener("change", render); });

  // ---------- Drawer + modals ----------
  var scrim = $("#scrim"), drawer = $("#drawer"), confirmM = $("#confirm"), doneM = $("#done"), lastFocus;
  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.classList.add("open"); scrim.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    setTimeout(function () { $("#closeCart").focus(); }, 60);
  }
  function closeAll() {
    [drawer, confirmM, doneM].forEach(function (m) { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); });
    scrim.classList.remove("open");
    if (lastFocus) lastFocus.focus();
  }
  function openModal(m) {
    m.classList.add("open"); m.setAttribute("aria-hidden", "false"); scrim.classList.add("open");
    setTimeout(function () { var f = $("input, button", m); if (f) f.focus(); }, 60);
  }
  $("#openCart").addEventListener("click", openDrawer);
  $("#closeCart").addEventListener("click", closeAll);
  scrim.addEventListener("click", function () {
    if (confirmM.classList.contains("open")) { confirmM.classList.remove("open"); confirmM.setAttribute("aria-hidden", "true"); return; }
    closeAll();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (confirmM.classList.contains("open")) { confirmM.classList.remove("open"); confirmM.setAttribute("aria-hidden", "true"); return; }
    closeAll();
  });

  // ---------- Validation ----------
  function normPhone(v) {
    v = String(v).replace(/[০-৯]/g, function (d) { return BN_DIGITS.indexOf(d); }).replace(/[^\d+]/g, "");
    if (v.indexOf("+88") === 0) v = v.slice(3); else if (v.indexOf("88") === 0 && v.length === 13) v = v.slice(2);
    return v;
  }
  function check() {
    var ok = true, f = $("#orderForm");
    function mark(name, bad) { var el = $('[data-f="' + name + '"]', f); el.classList.toggle("bad", bad); if (bad) ok = false; }
    mark("name", f.elements["name"].value.trim().length < 2);
    mark("phone", !/^01[3-9]\d{8}$/.test(normPhone(f.elements["phone"].value)));
    mark("address", f.elements["address"].value.trim().length < 8);
    return ok;
  }
  $$("#orderForm input, #orderForm textarea").forEach(function (el) {
    el.addEventListener("input", function () { var p = el.closest(".field"); if (p) p.classList.remove("bad"); });
  });

  $("#placeOrder").addEventListener("click", function () {
    if (!count()) { toast(t("msg.emptyToast")); return; }
    if (!check()) { toast(t("msg.fix")); var b = $(".field.bad input, .field.bad textarea"); if (b) b.focus(); return; }
    $("#agree").checked = false; $("#cOk").disabled = true;
    openModal(confirmM);
  });
  $("#agree").addEventListener("change", function () { $("#cOk").disabled = !this.checked; });
  $("#cBack").addEventListener("click", function () { confirmM.classList.remove("open"); confirmM.setAttribute("aria-hidden", "true"); });

  function orderId() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return "FY-" + String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  }

  $("#cOk").addEventListener("click", function () {
    var btn = this, f = $("#orderForm"), s = sums();
    var order = {
      id: orderId(),
      time: new Date().toISOString(),
      name: f.elements["name"].value.trim(),
      phone: normPhone(f.elements["phone"].value),
      address: f.elements["address"].value.trim(),
      zone: zone() === "inside" ? "Inside Lakshmipur" : "Outside Lakshmipur",
      items: Object.keys(cart).map(function (k) { return { item: PRODUCTS[k].en, qty: cart[k], price: priceOf(k) }; }),
      subtotal: s.sub, delivery: s.del, total: s.total,
      note: f.elements["note"].value.trim(),
      lang: lang, agreedSizeAndScent: true
    };
    btn.disabled = true;
    var send = CONFIG.ORDER_ENDPOINT
      ? fetch(CONFIG.ORDER_ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(order) })
      : Promise.resolve("demo");
    var wa = "New Fyndora order " + order.id +
      "\nName: " + order.name + "\nPhone: " + order.phone + "\nAddress: " + order.address + "\nArea: " + order.zone +
      "\nItems:\n" + order.items.map(function (i) { return "- " + i.item + " x" + i.qty + " = Tk " + i.price * i.qty; }).join("\n") +
      "\nSubtotal: Tk " + order.subtotal + "\nDelivery: Tk " + order.delivery + "\nTotal (cash on delivery): Tk " + order.total +
      (order.note ? "\nNote: " + order.note : "") + "\nI know the candle is 6.9 x 7.7 cm and the fragrance is moderate.";
    send.then(function (r) {
      cart = {}; save(); f.reset(); render();
      confirmM.classList.remove("open"); confirmM.setAttribute("aria-hidden", "true");
      drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true");
      $("#dId").textContent = order.id;
      $("#dWa").href = "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent(wa);
      // Without a Sheet connection the only way the order reaches us is the customer's WhatsApp message.
      $("#dWaNote").hidden = r !== "demo";
      $("#dWa").hidden = r !== "demo";
      openModal(doneM);
    }).catch(function () { toast(t("msg.fail")); btn.disabled = false; });
  });
  $("#dOk").addEventListener("click", closeAll);

  applyLang();
})();

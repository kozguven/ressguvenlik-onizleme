/* RESS Koruma — Seçenek 2 önizleme etkileşimleri (vanilla JS) */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var params = new URLSearchParams(location.search);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var framed = window.self !== window.top;

  /* Videolar: hareket azaltma tercihinde durdur */
  if (reduce) $$("video").forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });

  /* Toast */
  var toastEl = $(".toast"), toastT;
  function toast(t) {
    if (!toastEl) return;
    toastEl.textContent = t; toastEl.classList.add("on");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("on"); }, 3200);
  }
  $$("[data-toast]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); toast(a.getAttribute("data-toast")); });
  });

  /* Mobil menü */
  var drawer = $("#drawer"), mbtn = $(".mast .menu-btn");
  function setMenu(on) {
    if (!drawer) return;
    drawer.classList.toggle("on", on);
    if (mbtn) mbtn.setAttribute("aria-expanded", on ? "true" : "false");
    document.body.style.overflow = on ? "hidden" : "";
  }
  if (mbtn) mbtn.addEventListener("click", function () { setMenu(true); });
  var mclose = $(".drawer .close");
  if (mclose) mclose.addEventListener("click", function () { setMenu(false); });
  if (params.get("menu") === "1") setMenu(true);

  /* Ekranlar */
  var sbtn = $(".screens-btn"), spop = $("#screens");
  if (framed && sbtn) { sbtn.hidden = true; }
  if (sbtn) sbtn.addEventListener("click", function () {
    var on = !spop.classList.contains("on");
    spop.classList.toggle("on", on); sbtn.setAttribute("aria-expanded", on ? "true" : "false");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (spop) spop.classList.remove("on"); setMenu(false); closeAst(); }
  });

  /* Soru-cevap: telefonda açılır kapanır */
  if (window.matchMedia && matchMedia("(max-width: 760px)").matches) $$(".qa-item").forEach(function (d) { d.open = false; });
  $$(".qa-item summary").forEach(function (sm) {
    sm.addEventListener("click", function (e) { if (!(window.matchMedia && matchMedia("(max-width: 760px)").matches)) e.preventDefault(); });
  });

  /* ---------- Bölgeler ---------- */
  var REG = {
    gm: { ad: "Genel Müdürlük", sehir: "İstanbul, Esenyurt", adres: "Talatpaşa Mah. Pazaryolu Cad. No:2 Sedai Plaza Kat:7 Daire:73 Esenyurt / İstanbul", iller: ["İstanbul", "Tekirdağ", "Edirne", "Kırklareli"] },
    marmara: { ad: "Marmara Bölge Müdürlüğü", sehir: "Kocaeli", iller: ["Kocaeli", "Sakarya", "Bursa", "Yalova", "Bilecik", "Düzce", "Bolu", "Balıkesir", "Çanakkale"] },
    icanadolu: { ad: "İç Anadolu Bölge Müdürlüğü", sehir: "Ankara", iller: ["Ankara", "Konya", "Eskişehir", "Kayseri", "Kırıkkale", "Kırşehir", "Aksaray", "Nevşehir", "Niğde", "Karaman", "Yozgat", "Sivas", "Çankırı"] },
    karadeniz: { ad: "Karadeniz Bölge Müdürlüğü", sehir: "Ordu", iller: ["Ordu", "Samsun", "Giresun", "Trabzon", "Rize", "Artvin", "Gümüşhane", "Bayburt", "Tokat", "Amasya", "Çorum", "Sinop", "Kastamonu", "Karabük", "Bartın", "Zonguldak"] },
    ege: { ad: "Ege Bölge Müdürlüğü", sehir: "İzmir", iller: ["İzmir", "Manisa", "Aydın", "Muğla", "Denizli", "Uşak", "Afyonkarahisar", "Kütahya"] },
    akdeniz: { ad: "Akdeniz Bölge Müdürlüğü", sehir: "Adana", iller: ["Adana", "Mersin", "Hatay", "Osmaniye", "Kahramanmaraş"] },
    antalya: { ad: "Antalya Bölge Müdürlüğü", sehir: "Antalya", iller: ["Antalya", "Isparta", "Burdur"] },
    guneydogu: { ad: "Güneydoğu Anadolu Bölge Müdürlüğü", sehir: "Gaziantep", iller: ["Gaziantep", "Şanlıurfa", "Adıyaman", "Kilis", "Diyarbakır", "Mardin", "Batman", "Siirt", "Şırnak", "Malatya"] },
    dogu: { ad: "Doğu Anadolu Bölge Müdürlüğü", sehir: "Ağrı, Doğubayazıt", iller: ["Ağrı", "Erzurum", "Kars", "Iğdır", "Ardahan", "Van", "Muş", "Bitlis", "Hakkari", "Erzincan", "Elazığ", "Tunceli", "Bingöl"] }
  };
  function regOfIl(il) {
    for (var k in REG) if (REG[k].iller.indexOf(il) > -1) return k;
    return "gm";
  }
  function regHTML(k) {
    var r = REG[k];
    return '<h3>' + r.ad + '</h3><p class="city">' + r.sehir + '</p><dl>' +
      (r.adres ? '<dt>Adres</dt><dd>' + r.adres + '</dd>' : '') +
      '<dt>Sorumlu iller</dt><dd>' + r.iller.join(", ") + '</dd>' +
      '<dt>Telefon</dt><dd><a href="tel:08508887377">0850 888 73 77</a> (genel hat, bölgeye aktarılır)</dd>' +
      '<dt>E-posta</dt><dd><a href="mailto:info@resyonetim.com.tr">info@resyonetim.com.tr</a></dd></dl>' +
      '<p style="margin:18px 0 0"><a class="btn sm" href="teklif.html">Bu bölgeden keşif talep et</a></p>';
  }
  $$("[data-map]").forEach(function (box) {
    var card = $("[data-regcard]", box);
    function pick(k) {
      $$(".pt", box).forEach(function (p) { p.classList.toggle("on", p.getAttribute("data-reg") === k); });
      $$(".reglist button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-reg") === k); });
      if (card) card.innerHTML = regHTML(k);
    }
    $$(".pt", box).forEach(function (p) {
      p.addEventListener("click", function () { pick(p.getAttribute("data-reg")); });
      p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(p.getAttribute("data-reg")); } });
    });
    $$(".reglist button").forEach(function (b) {
      b.addEventListener("click", function () { pick(b.getAttribute("data-reg")); if (window.innerWidth < 760 && card) card.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); });
    });
    pick(box.getAttribute("data-start") || "gm");
  });

  /* ---------- Kadro hesabı (ortak) ---------- */
  var TUR = {
    fabrika: { ad: "fabrika ve sanayi tesisi", not: "Fabrikalarda kantar ve sevkiyat kapısı ayrı nokta sayılır." },
    hastane: { ad: "hastane ve sağlık tesisi", not: "Hastanelerde acil servis girişi ayrı nokta sayılır; kadronun en az üçte biri için kadın görevli önerilir." },
    avm: { ad: "AVM ve mağaza", not: "AVM'lerde açılış ve kapanış saatlerinde kadro artırımı keşifte ayrıca planlanır." },
    site: { ad: "site ve rezidans", not: "Sitelerde gece devriyesi için en az bir görevlinin nokta dışında dolaşması önerilir." },
    plaza: { ad: "plaza ve iş merkezi", not: "Plazalarda resepsiyon ve otopark girişi ayrı nokta sayılır." },
    depo: { ad: "lojistik depo", not: "Depolarda rampa ve araç kapısı ayrı nokta sayılır; gece için silahlı görev değerlendirilir." },
    santiye: { ad: "şantiye", not: "Şantiyelerde malzeme sahası için gece devriyesi ya da drone gözetimi önerilir." },
    okul: { ad: "okul ve kampüs", not: "Okullarda giriş ve çıkış saatlerinde ek görevli keşifte planlanır." }
  };
  var SAAT = { "724": { h: 168, ad: "7/24", duzen: "3 vardiya × 8 saat" }, gunduz: { h: 84, ad: "Gündüz 08–20", duzen: "2 dönüşümlü ekip × 12 saat" }, gece: { h: 84, ad: "Gece 20–08", duzen: "2 dönüşümlü ekip × 12 saat" }, haftasonu: { h: 48, ad: "Yalnız hafta sonu", duzen: "Cumartesi ve pazar, 2 vardiya × 12 saat" } };
  function fmt(n) { return n.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }); }
  function kadro(tur, nokta, saat, silah, extraPosts) {
    var s = SAAT[saat] || SAAT["724"];
    var posts = nokta + (extraPosts || 0);
    var hours = s.h * posts;
    var ham = hours / 45, top = ham * 1.12;
    var n = Math.max(1, Math.ceil(top - 1e-9));
    var amir = (saat === "724" && n >= 6) ? 1 : 0;
    return {
      hours: hours, ham: ham, top: top, n: n, amir: amir, s: s,
      text: n + " görevli",
      calc: fmt(top) + " → " + n + " görevli",
      amirText: amir ? "+ 1 vardiya amiri" : "Vardiya amiri gerekmez",
      not: (TUR[tur] || TUR.fabrika).not + " 45 saat: İş Kanunu'na göre haftalık en çok çalışma süresi. Kesin kadro keşiften sonra belirlenir." +
        (silah === "1" ? " Silahlı görevde kadro sayısı değişmez; görevlilerde silahlı ÖGKK ve valilik silah izni gerekir." : "")
    };
  }
  window.RessKadro = kadro;

  var calc = $("[data-calc]");
  if (calc) {
    var o = function (k) { return $('[data-o="' + k + '"]', calc); };
    var inN = $("#c-nokta", calc), last = "";
    var run = function () {
      var tur = $("#c-tur", calc).value;
      var n = Math.min(40, Math.max(1, parseInt(inN.value, 10) || 1));
      var saat = $('input[name="saat"]:checked', calc).value;
      var silah = $('input[name="silah"]:checked', calc).value;
      var r = kadro(tur, n, saat, silah);
      o("baslik").textContent = r.s.ad + ", " + n + " nokta, " + TUR[tur].ad + (silah === "1" ? ", silahlı" : "");
      o("kadro").textContent = r.text; o("kadro2").textContent = r.calc;
      o("amir").textContent = r.amirText;
      o("saat").textContent = r.hours + " saat";
      o("ham").textContent = fmt(r.ham) + " görevli";
      o("pay").textContent = fmt(r.top) + " görevli";
      o("duzen").textContent = r.s.duzen;
      o("not").textContent = r.not;
      o("link").href = "teklif.html?tur=" + tur + "&nokta=" + n + "&saat=" + saat + "&silah=" + silah + "&adim=2";
      if (r.text !== last && last && !reduce) { var b = o("kadro"); b.classList.remove("flash"); void b.offsetWidth; b.classList.add("flash"); }
      last = r.text;
    };
    $$("[data-step]", calc).forEach(function (b) {
      b.addEventListener("click", function () { inN.value = Math.min(40, Math.max(1, (parseInt(inN.value, 10) || 1) + parseInt(b.getAttribute("data-step"), 10))); run(); });
    });
    calc.addEventListener("input", run); calc.addEventListener("change", run);
    run();
  }

  /* ---------- Hizmet süzme ---------- */
  var fl = $("[data-filters]");
  if (fl) {
    var setF = function (k) {
      $$("button", fl).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-f") === k ? "true" : "false"); });
      var shown = 0;
      $$("[data-sek]").forEach(function (c) { var on = k === "hepsi" || c.getAttribute("data-sek").split(" ").indexOf(k) > -1; c.hidden = !on; if (on && c.matches(".svc, tr")) shown++; });
      var cnt = $("[data-count]"); if (cnt) cnt.textContent = shown + " " + (cnt.getAttribute("data-count") || "kayıt listeleniyor");
    };
    $$("button", fl).forEach(function (b) { b.addEventListener("click", function () { setF(b.getAttribute("data-f")); }); });
    setF(params.get("sektor") || "hepsi");
  }

  /* ---------- Teklif sihirbazı ---------- */
  var wiz = $("[data-wizard]");
  if (wiz) {
    var steps = $$(".wstep", wiz), prog = $$(".progress li", wiz), cur = 0;
    var f = wiz;
    var val = function (n) { var el = $('[name="' + n + '"]:checked', f) || $('[name="' + n + '"]', f); return el ? el.value : ""; };
    var EK = { k9: "K9 köpekli ekip", drone: "Drone ile gözetim", kamera: "Kamera izleme koordinasyonu", arac: "Devriye aracı" };
    var sum = function () {
      var tur = val("tur") || "fabrika", n = Math.max(1, parseInt(val("nokta"), 10) || 1), saat = val("saat") || "724", silah = val("silah") || "0";
      var ek = $$('[name="ek"]:checked', f).map(function (c) { return c.value; });
      var r = kadro(tur, n, saat, silah, ek.indexOf("arac") > -1 ? 1 : 0);
      var il = val("il");
      var set = function (k, v) { $$('[data-s="' + k + '"]').forEach(function (e) { e.textContent = v; }); };
      set("tur", TUR[tur] ? TUR[tur].ad.charAt(0).toUpperCase() + TUR[tur].ad.slice(1) : "");
      set("konum", il ? il + (val("ilce") ? ", " + val("ilce") : "") : "Seçilmedi");
      set("bolge", il ? REG[regOfIl(il)].ad : "İl seçince belirlenir");
      set("duzen", n + " nokta, " + r.s.ad + ", " + (silah === "1" ? "silahlı" : "silahsız"));
      set("ek", ek.length ? ek.map(function (k) { return EK[k]; }).join(", ") : "Yok");
      set("kadro", r.text); set("amir", r.amirText); set("vardiya", r.s.duzen);
      set("hesap", "Haftada " + r.hours + " saat ÷ 45 × 1,12 = " + r.calc);
      set("not", r.not);
      var bn = $("[data-bolgenot]", f); if (bn) bn.textContent = il ? il + " ili " + REG[regOfIl(il)].ad + " sorumluluğundadır. Keşif bu bölgenin ekibiyle yapılır." : "";
    };
    var show = function (i) {
      cur = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, k) { s.classList.toggle("on", k === cur); });
      prog.forEach(function (p, k) { p.classList.toggle("done", k < cur); p.classList.toggle("cur", k === cur); if (k === cur) p.setAttribute("aria-current", "step"); else p.removeAttribute("aria-current"); });
      sum();
    };
    var check = function () {
      var st = steps[cur], ok = true;
      $$(".err", st).forEach(function (e) { e.remove(); });
      $$("[required]", st).forEach(function (el) {
        var bad = el.type === "checkbox" ? !el.checked : !el.value.trim();
        if (bad && ok) {
          ok = false;
          var m = document.createElement("p"); m.className = "err";
          m.textContent = el.getAttribute("data-err") || "Bu alanı doldurun.";
          (el.closest(".field") || el.parentNode).appendChild(m); el.focus();
        }
      });
      return ok;
    };
    $$("[data-next]", f).forEach(function (b) { b.addEventListener("click", function () { if (!check()) return; if (cur === 5) { var no = "RS-2026-" + String(Math.floor(10000 + Math.random() * 89999)); $$("[data-s='ref']").forEach(function (e) { e.textContent = no; }); } show(cur + 1); f.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }); });
    $$("[data-prev]", f).forEach(function (b) { b.addEventListener("click", function () { show(cur - 1); }); });
    f.addEventListener("change", sum); f.addEventListener("input", sum);
    $$("[data-step]", f).forEach(function (b) {
      b.addEventListener("click", function () { var i = $('[name="nokta"]', f); i.value = Math.min(40, Math.max(1, (parseInt(i.value, 10) || 1) + parseInt(b.getAttribute("data-step"), 10))); sum(); });
    });
    f.addEventListener("submit", function (e) { e.preventDefault(); });
    ["tur", "saat", "silah"].forEach(function (k) {
      var v = params.get(k); if (!v) return;
      var el = $('[name="' + k + '"][value="' + v + '"]', f); if (el) el.checked = true;
    });
    if (params.get("nokta")) $('[name="nokta"]', f).value = params.get("nokta");
    if (params.get("il")) $('[name="il"]', f).value = params.get("il");
    var start = parseInt(params.get("adim"), 10);
    show(start ? start - 1 : 0);
    if (start > 1 && !location.hash) window.addEventListener("load", function () { setTimeout(function () { var y = wiz.getBoundingClientRect().top + window.pageYOffset - 84; window.scrollTo(0, y); }, 60); });
  }

  /* ---------- Diğer formlar ---------- */
  $$("form[data-demo]").forEach(function (fm) {
    fm.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("[required]", fm).filter(function (el) { return el.type === "checkbox" ? !el.checked : !el.value.trim(); });
      $$(".err", fm).forEach(function (x) { x.remove(); });
      if (bad.length) {
        var m = document.createElement("p"); m.className = "err"; m.textContent = (bad[0].getAttribute("data-err") || "Zorunlu alanları doldurun.");
        (bad[0].closest(".field") || bad[0].parentNode).appendChild(m); bad[0].focus(); return;
      }
      var out = $(fm.getAttribute("data-demo"));
      var no = (fm.getAttribute("data-prefix") || "RS-2026-") + String(Math.floor(10000 + Math.random() * 89999));
      if (out) { $$("[data-ref]", out).forEach(function (r) { r.textContent = no; }); fm.hidden = true; out.hidden = false; out.focus && out.focus(); }
    });
  });

  $$("[data-job]").forEach(function (a) {
    a.addEventListener("click", function () { var i = $("#b-poz"); if (i) i.value = a.getAttribute("data-job"); });
  });

  /* Portal giriş */
  var lg = $("[data-login]");
  if (lg) {
    var s1 = $("[data-l1]", lg), s2 = $("[data-l2]", lg);
    $("[data-sendcode]", lg).addEventListener("click", function () {
      var em = $("#p-mail", lg); if (!em.value.trim()) { em.value = "satinalma@gebzeuretim.com.tr"; }
      s1.hidden = true; s2.hidden = false; var first = $(".otp input", lg); if (first) first.focus();
    });
    $$(".otp input", lg).forEach(function (i, k, all) { i.addEventListener("input", function () { if (i.value && all[k + 1]) all[k + 1].focus(); }); });
    $("[data-enter]", lg).addEventListener("click", function () { location.hash = "panel"; var p = $("#panel"); if (p) p.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); toast("Önizleme: gerçek giriş yapılmadı; örnek tesis gösteriliyor."); });
  }
  $$("[data-tab]").forEach(function (b) {
    b.addEventListener("click", function () { toast(b.getAttribute("data-tab")); });
  });

  /* Bağlantı çapası: görseller yüklendikten sonra yeniden konumla */
  if (location.hash.length > 1) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (t && t.offsetParent !== null) t.scrollIntoView();
        else if (t && wiz) { var y = wiz.getBoundingClientRect().top + window.pageYOffset - 84; window.scrollTo(0, y); }
      }, 60);
    });
  }

  /* ---------- Dijital asistan ---------- */
  var astBtn = $(".ast-btn"), ast = $("#ast"), log = ast && $(".ast-log", ast);
  function closeAst() { if (!ast) return; ast.classList.remove("on"); astBtn.setAttribute("aria-expanded", "false"); }
  function ref(p) { return p + "-2026-" + String(Math.floor(10000 + Math.random() * 89999)); }
  function add(who, html) {
    var d = document.createElement("div"); d.className = "msg " + who; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight;
  }
  function opts(list) {
    var w = document.createElement("div"); w.className = "opts";
    list.forEach(function (o) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = o[0];
      b.addEventListener("click", function () { w.remove(); add("me", o[0]); setTimeout(function () { o[1](); }, reduce ? 0 : 350); });
      w.appendChild(b);
    });
    log.appendChild(w); log.scrollTop = log.scrollHeight;
  }
  var FLOW = {
    start: function () {
      add("bot", "Ress Dijital Asistanına hoş geldiniz. Özel güvenlik, tesis yönetimi, temizlik ve teknik bakım alanlarında hangi konuda destek almak istediğinizi yazabilirsiniz.");
      add("bot", "Ben bir yapay zekâ asistanıyım. Fiyat ve başlangıç tarihi veremem; talebinizi ilgili bölge müdürlüğüne kayıt numarasıyla iletirim.");
      opts([["Güvenlik teklifi istiyorum", FLOW.teklif], ["İş başvurusu yapmak istiyorum", FLOW.is], ["En yakın bölge müdürlüğü", FLOW.bolge], ["Şikâyet / öneri", FLOW.sikayet]]);
    },
    teklif: function () {
      add("bot", "Hangi tür tesis için güvenlik hizmeti arıyorsunuz?");
      var next = function (t) { return function () {
        add("bot", t + " için kaç nokta ve hangi saatlerde görevli gerekiyor?");
        opts([["1 nokta, 7/24", fin("1 nokta 7/24: 168 ÷ 45 × 1,12 = 4,2 → 5 görevli")], ["2 nokta, 7/24", fin("2 nokta 7/24: 8,4 → 9 görevli ve 1 vardiya amiri")], ["1 nokta, yalnız gece", fin("1 nokta gece: 84 ÷ 45 × 1,12 = 2,1 → 3 görevli")], ["Bilmiyorum, keşifte belirlensin", fin("Kadro keşifte belirlenecek")]]);
      }; };
      var fin = function (k) { return function () {
        add("bot", "Ön hesap: " + k + ". Kesin kadro keşiften sonra belirlenir. Keşif için bölge müdürlüğümüzün size ulaşabilmesi için adınızı ve telefonunuzu yazar mısınız?");
        askContact(function () {
          add("bot", "Teşekkürler. Talebinizi bölge müdürlüğüne ilettim, kayıt numaranız <b>" + ref("RS") + "</b>. Fiyat keşiften sonra yazılı teklifle verilir." + SIM);
          add("bot", 'Daha ayrıntılı bilgi vermek isterseniz <a href="teklif.html">teklif sihirbazını</a> açabilirsiniz.');
          opts([["Başka bir konu", FLOW.menu]]);
        });
      }; };
      opts([["Fabrika / sanayi", next("Fabrika")], ["Hastane", next("Hastane")], ["AVM / mağaza", next("AVM")], ["Site / rezidans", next("Site")], ["Diğer", next("Tesisiniz")]]);
    },
    is: function () {
      add("bot", "Özel Güvenlik Kimlik Kartınız (ÖGKK) var mı?");
      var il = function (durum) { return function () {
        if (durum === "yok") {
          add("bot", "Görev alabilmek için önce yetkili bir özel güvenlik eğitim kurumunda temel eğitimi tamamlayıp sınavı geçmeniz gerekir. Kartınızı aldığınızda başvurunuzu bekliyoruz.");
          opts([["Başka bir konu", FLOW.menu]]); return;
        }
        add("bot", durum === "az" ? "Kartınızın süresi dolmadan yenileme eğitimine katılmanız gerekir; başvurunuzu yine de alıyorum. Hangi ilde çalışmak istersiniz?" : "Hangi ilde çalışmak istersiniz?");
        var son = function (x) { return function () {
          add("bot", x + " için başvuru açabilirim. Adınızı ve telefonunuzu yazar mısınız?");
          askContact(function () {
            add("bot", "Başvuru kaydınızı açtım: <b>" + ref("BSV") + "</b>. İnsan kaynakları ekibimiz verdiğiniz numaradan size ulaşacak. Bilgilerinizi tamamlamak için <a href=\"kariyer.html#basvuru\">başvuru formunu</a> doldurabilirsiniz." + SIM);
            opts([["Başka bir konu", FLOW.menu]]);
          });
        }; };
        opts([["İstanbul", son("İstanbul")], ["Kocaeli", son("Kocaeli")], ["Ankara", son("Ankara")], ["İzmir", son("İzmir")], ["Başka bir il", son("Seçtiğiniz il")]]);
      }; };
      opts([["Var, geçerli", il("var")], ["Var, süresi dolmak üzere", il("az")], ["Yok", il("yok")]]);
    },
    bolge: function () {
      add("bot", "Tesisiniz hangi ilde?");
      var r = function (il) { return function () {
        var k = regOfIl(il), x = REG[k];
        add("bot", il + " ili <b>" + x.ad + "</b> (" + x.sehir + ") sorumluluğundadır. Telefon: 0850 888 73 77, çağrınız bölgeye aktarılır. <a href=\"bolgeler.html\">Bölge haritası</a>");
        opts([["Başka bir konu", FLOW.menu]]);
      }; };
      opts([["İstanbul", r("İstanbul")], ["Kocaeli", r("Kocaeli")], ["Ankara", r("Ankara")], ["İzmir", r("İzmir")], ["Gaziantep", r("Gaziantep")], ["Samsun", r("Samsun")]]);
    },
    sikayet: function () {
      add("bot", "Konu nedir?");
      var t = function (k) { return function () {
        add("bot", "Kısaca yazar mısınız? Hizmet aldığınız tesisin adını da eklerseniz ilgili bölgeye doğrudan iletirim.");
        pending = function (txt) {
          add("bot", "Size dönüş yapabilmemiz için adınızı ve telefonunuzu yazar mısınız?");
          askContact(function () {
            add("bot", "Kaydınız alındı: <b>" + ref("SKY") + "</b>. " + k + " başlığıyla ilgili bölge müdürlüğüne iletildi; verdiğiniz numaradan size dönüş yapılacak." + SIM);
            opts([["Başka bir konu", FLOW.menu]]);
          });
        };
      }; };
      opts([["Hizmet aldığım tesisle ilgili", t("Hizmet")], ["Görevli davranışı", t("Görevli davranışı")], ["Öneri", t("Öneri")]]);
    },
    menu: function () {
      add("bot", "Başka nasıl yardımcı olabilirim?");
      opts([["Güvenlik teklifi istiyorum", FLOW.teklif], ["İş başvurusu yapmak istiyorum", FLOW.is], ["En yakın bölge müdürlüğü", FLOW.bolge], ["Şikâyet / öneri", FLOW.sikayet]]);
    }
  };
  var pending = null, started = false;
  var SIM = '<span class="sim">Önizleme: gerçek talep oluşturulmadı.</span>';
  function askContact(done) {
    var w = document.createElement("div"); w.className = "opts";
    var b = document.createElement("button"); b.type = "button"; b.textContent = "Örnek bilgiyle doldur: Ahmet Y., 0532 *** ** 18";
    b.addEventListener("click", function () { w.remove(); pending = null; add("me", "Ahmet Yılmaz, 0532 *** ** 18"); setTimeout(done, reduce ? 0 : 350); });
    w.appendChild(b); log.appendChild(w); log.scrollTop = log.scrollHeight;
    pending = function () { w.remove(); done(); };
  }
  function openAst() {
    if (!ast) return;
    ast.classList.add("on"); astBtn.setAttribute("aria-expanded", "true");
    if (!started) { started = true; FLOW.start(); }
    var i = $("#ast-in"); if (i && !framed) i.focus();
  }
  if (astBtn) {
    astBtn.addEventListener("click", function () { if (ast.classList.contains("on")) closeAst(); else openAst(); });
    $(".ast-close", ast).addEventListener("click", closeAst);
    $(".ast-form", ast).addEventListener("submit", function (e) {
      e.preventDefault(); var i = $("#ast-in"), t = i.value.trim(); if (!t) return;
      add("me", t.replace(/</g, "&lt;")); i.value = "";
      setTimeout(function () {
        if (pending) { var p = pending; pending = null; p(t); return; }
        var low = t.toLocaleLowerCase("tr-TR");
        if (/teklif|fiyat|kadro|görevli/.test(low)) FLOW.teklif();
        else if (/iş|başvuru|kariyer|kart/.test(low)) FLOW.is();
        else if (/bölge|adres|nerede|şube/.test(low)) FLOW.bolge();
        else if (/şikâyet|şikayet|öneri/.test(low)) FLOW.sikayet();
        else { add("bot", "Bu önizlemede hazır konular çalışıyor. Aşağıdan birini seçebilir ya da 0850 888 73 77'yi arayabilirsiniz."); FLOW.menu(); }
      }, reduce ? 0 : 350);
    });
    if (params.get("asistan") === "1") {
      openAst();
      if (params.get("akis") === "teklif") { setTimeout(function () { var b = $(".opts button", ast); if (b) b.click(); }, 50); }
    }
  }
})();

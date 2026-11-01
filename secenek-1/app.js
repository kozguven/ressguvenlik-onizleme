/* RESS — Seçenek 1 "Gece Nöbeti" etkileşimleri (vanilla) */
(function () {
  "use strict";
  var doc = document.documentElement;
  var params = new URLSearchParams(location.search);
  var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (params.has("onizleme") || window.self !== window.top) doc.classList.add("onizleme");

  var IK = {
    kapat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    sohbet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>'
  };

  /* Mobil menü */
  var menu = document.getElementById("mobil-menu");
  var menuAc = document.querySelector(".menu-ac");
  function menuDurum(ac) {
    if (!menu) return;
    menu.classList.toggle("acik", ac);
    menuAc && menuAc.setAttribute("aria-expanded", ac ? "true" : "false");
    document.body.style.overflow = ac ? "hidden" : "";
    if (ac) { var k = menu.querySelector("button"); k && k.focus(); } else if (menuAc) menuAc.focus();
  }
  if (menuAc) menuAc.addEventListener("click", function () { menuDurum(true); });
  if (menu) {
    menu.querySelector(".menu-kapat").addEventListener("click", function () { menuDurum(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("acik")) menuDurum(false); });
  }
  if (params.get("menu") === "1" && menu) { menu.classList.add("acik"); }

  /* Videolar: az hareket tercihinde dur */
  document.querySelectorAll("video[autoplay]").forEach(function (v) {
    if (azHareket) { v.removeAttribute("autoplay"); v.pause(); }
  });
  var vd = document.querySelector(".video-dugme");
  if (vd) {
    var hv = document.querySelector(".acilis video");
    var guncelle = function () { vd.textContent = hv.paused ? "Videoyu oynat" : "Videoyu durdur"; };
    vd.addEventListener("click", function () { hv.paused ? hv.play() : hv.pause(); guncelle(); });
    hv.addEventListener("play", guncelle); hv.addEventListener("pause", guncelle);
    guncelle();
  }

  /* 24 saatlik nöbet */
  var nobet = document.querySelector(".nobet");
  if (nobet) {
    var anlar = [].slice.call(nobet.querySelectorAll(".an"));
    var dakikalar = anlar.map(function (a) { return +a.dataset.dk; });
    var dugmeler = [].slice.call(nobet.querySelectorAll(".saatler button"));
    var sahne = nobet.querySelector(".nobet-sahne");
    var kare, saatYazi, saatAcik, dolu, isaretler = [];
    var genis = window.matchMedia("(min-width: 960px)");
    var etkin = -1;

    function saatBicim(dk) {
      var t = (8 * 60 + Math.round(dk)) % 1440;
      var h = Math.floor(t / 60), m = t % 60;
      return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
    }
    function sahneKur() {
      kare = sahne.querySelector(".sahne-kare");
      anlar.forEach(function (a, i) {
        var g = a.querySelector("figure img, .telefon-rapor");
        var kopya = g.cloneNode(true);
        if (kopya.tagName === "IMG") kopya.alt = "";
        kopya.setAttribute("aria-hidden", "true");
        kopya.dataset.i = i;
        kare.appendChild(kopya);
      });
      saatYazi = sahne.querySelector(".sahne-saat .veri");
      saatAcik = sahne.querySelector(".sahne-saat span:last-child");
      dolu = sahne.querySelector(".cizelge-dolu");
      var cz = sahne.querySelector(".cizelge");
      dakikalar.forEach(function (d) {
        var i = document.createElement("i");
        i.style.left = (d / 1440 * 100) + "%";
        cz.appendChild(i); isaretler.push(i);
      });
    }
    function etkinYap(i) {
      if (i === etkin) return;
      etkin = i;
      anlar.forEach(function (a, j) { a.classList.toggle("etkin", j === i); });
      dugmeler.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
      if (kare) [].forEach.call(kare.children, function (c) { c.classList.toggle("etkin", +c.dataset.i === i); });
      if (saatAcik) saatAcik.textContent = anlar[i].querySelector("h3").textContent;
      isaretler.forEach(function (m, j) { m.classList.toggle("gecti", j <= i); });
    }
    function kaydir() {
      if (!nobet.classList.contains("sahne")) return;
      var r = nobet.querySelector(".anlar").getBoundingClientRect();
      var odak = window.innerHeight * 0.45;
      // Hangi adımdayız ve adımın içinde ne kadar ilerledik
      var i = 0, ic = 0;
      for (var k = 0; k < anlar.length; k++) {
        var ar = anlar[k].getBoundingClientRect();
        if (ar.top <= odak) { i = k; ic = Math.min(1, Math.max(0, (odak - ar.top) / ar.height)); }
      }
      var bas = dakikalar[i], son = i + 1 < dakikalar.length ? dakikalar[i + 1] : 1440;
      var dk = r.top > odak ? 0 : bas + (son - bas) * ic;
      saatYazi.textContent = saatBicim(dk);
      dolu.style.width = (dk / 1440 * 100) + "%";
      etkinYap(i);
    }
    function mod() {
      var ac = genis.matches;
      nobet.classList.toggle("sahne", ac);
      if (ac && kare && !kare.children.length) sahneKur();
      if (ac) { etkin = -1; kaydir(); }
      else { anlar.forEach(function (a) { a.classList.remove("etkin"); }); }
    }
    if (sahne) {
      sahneKur();
      mod();
      genis.addEventListener ? genis.addEventListener("change", mod) : genis.addListener(mod);
      window.addEventListener("scroll", kaydir, { passive: true });
      window.addEventListener("resize", kaydir);
    }
    dugmeler.forEach(function (b, i) {
      b.addEventListener("click", function () {
        var hedef = anlar[i];
        var y = hedef.getBoundingClientRect().top + window.scrollY - (nobet.classList.contains("sahne") ? window.innerHeight * 0.45 - 2 : 90);
        window.scrollTo({ top: y, behavior: azHareket ? "auto" : "smooth" });
        if (!nobet.classList.contains("sahne")) etkinYap(i);
      });
    });
  }

  /* Süzgeç (hizmetler, referanslar) */
  document.querySelectorAll("[data-suzgec]").forEach(function (grup) {
    var hedef = document.querySelectorAll(grup.dataset.suzgec);
    var bilgi = document.getElementById(grup.dataset.bilgi || "");
    function uygula(deger) {
      var n = 0;
      hedef.forEach(function (el) {
        var g = deger === "hepsi" || (" " + el.dataset.sektor + " ").indexOf(" " + deger + " ") > -1;
        el.hidden = !g; if (g) n++;
      });
      grup.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.deger === deger ? "true" : "false"); });
      if (bilgi) bilgi.textContent = n + " kayıt gösteriliyor";
    }
    grup.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) uygula(b.dataset.deger); });
    var ilk = params.get("sektor");
    if (ilk && grup.querySelector('[data-deger="' + ilk + '"]')) uygula(ilk);
  });

  /* Bölge haritası */
  var bolgeKart = document.getElementById("bolge-kart");
  if (bolgeKart && window.BOLGELER) {
    var noktalar = document.querySelectorAll(".harita .nokta");
    function bolgeGoster(id) {
      var b = window.BOLGELER[id]; if (!b) return;
      noktalar.forEach(function (n) { n.setAttribute("aria-pressed", n.dataset.id === id ? "true" : "false"); });
      bolgeKart.innerHTML = '<h2>' + b.ad + '</h2><p class="merkez">' + b.merkez + '</p>' +
        '<h3>Sorumlu iller</h3><p>' + b.iller + '</p>' +
        '<h3>Öne çıkan hizmetler</h3><p>' + b.hizmet + '</p>' +
        '<h3>Telefon</h3><p><a href="tel:08508887377">0850 888 73 77</a></p>' +
        '<p class="ikincil" style="margin-top:16px;font-size:.9rem">Arayınca bölgenizi söylemeniz yeterli; çağrı ilgili müdürlüğe aktarılır.</p>' +
        '<div class="dugmeler" style="margin-top:20px"><a class="dugme dugme-ana" href="teklif.html">Bu bölge için teklif iste</a></div>';
    }
    noktalar.forEach(function (n) {
      n.addEventListener("click", function () { bolgeGoster(n.dataset.id); });
      n.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); bolgeGoster(n.dataset.id); } });
    });
    bolgeGoster(params.get("bolge") || "marmara");
  }

  /* Teklif sihirbazı */
  var sb = document.getElementById("sihirbaz");
  if (sb) {
    var adimlar = [].slice.call(sb.querySelectorAll(".adim"));
    var ilerleme = [].slice.call(document.querySelectorAll(".ilerleme li"));
    var simdi = 0;
    var SAAT = { "7/24": 168, "gunduz": 50, "gece": 98, "haftasonu": 48 };
    var SAAT_AD = { "7/24": "7/24", "gunduz": "Hafta içi gündüz (08–18)", "gece": "Her gece (18–08)", "haftasonu": "Hafta sonu tam gün" };
    var MODEL = {
      "Fabrika / sanayi tesisi": "Kapı ve kantar kontrolü, çevre devriyesi, NFC kontrol noktalı gece turu",
      "Plaza / iş merkezi": "Resepsiyon ve ziyaretçi kaydı, otopark kontrolü, mesai dışı kat devriyesi",
      "Site / rezidans": "Giriş kontrolü, misafir kaydı, gece çevre devriyesi, otopark izleme",
      "Hastane / sağlık tesisi": "Acil giriş kontrolü, ziyaretçi düzeni, kadın görevli dengesi, 7/24 iç devriye",
      "AVM / mağaza": "Giriş kontrolü, kayıp önleme, otopark ve yükleme alanı kontrolü",
      "Depo / lojistik": "Araç giriş-çıkış ve sevkiyat kontrolü, mühür kaydı, gece çevre devriyesi",
      "Etkinlik / organizasyon": "Giriş kontrolü ve arama, kalabalık yönetimi, sahne ve kulis güvenliği",
      "Şantiye": "Malzeme ve araç giriş kontrolü, gece çevre devriyesi, mesai dışı nöbet",
      "Marina / liman": "Rıhtım ve iskele kontrolü, tekne erişim kaydı, gece devriyesi"
    };
    function deger(ad) { var e = sb.querySelector('[name="' + ad + '"]:checked'); return e ? e.value : ""; }
    function hesap() {
      var nokta = Math.max(1, Math.min(40, parseInt(sb.querySelector("#nokta").value, 10) || 1));
      var saatTur = deger("saat") || "7/24";
      var hafta = SAAT[saatTur];
      var ham = nokta * hafta / 45 * 1.125;
      var gorevli = Math.ceil(ham - 0.05);
      var amir = gorevli >= 8 ? Math.max(1, Math.round(gorevli / 12)) : 0;
      var ekler = [].map.call(sb.querySelectorAll('[name="ek"]:checked'), function (e) { return e.value; });
      return { nokta: nokta, saatTur: saatTur, hafta: hafta, ham: ham, gorevli: gorevli, amir: amir, ekler: ekler,
        tesis: deger("tesis"), il: (sb.querySelector("#il").value || ""), ilce: (sb.querySelector("#ilce").value || ""), silah: deger("silah") || "Silahsız" };
    }
    function virgul(x) { return x.toFixed(1).replace(".", ","); }
    function ozetYaz() {
      var h = hesap();
      var o = document.getElementById("ozet-dl");
      o.innerHTML =
        '<div><dt>Tesis</dt><dd>' + (h.tesis || "Seçilmedi") + '</dd></div>' +
        '<div><dt>Konum</dt><dd>' + ((h.il ? h.il : "Seçilmedi") + (h.ilce ? " / " + h.ilce : "")) + '</dd></div>' +
        '<div><dt>Nokta</dt><dd>' + h.nokta + '</dd></div>' +
        '<div><dt>Çalışma</dt><dd>' + SAAT_AD[h.saatTur] + '</dd></div>' +
        '<div><dt>Yetki</dt><dd>' + h.silah + '</dd></div>' +
        '<div><dt>Ek ihtiyaç</dt><dd>' + (h.ekler.length ? h.ekler.join(", ") : "Yok") + '</dd></div>';
      document.getElementById("ozet-sayi").textContent = h.gorevli + (h.amir ? " + " + h.amir : "");
      document.getElementById("ozet-sayi-ac").textContent = h.amir ? "görevli + vardiya amiri" : "görevli önerilir";
      // Sonuç adımı
      var s = document.getElementById("sonuc-kadro");
      if (s) {
        var satir = '<li><span>' + h.silah + ' özel güvenlik görevlisi</span><span>' + h.gorevli + ' kişi</span></li>';
        if (h.amir) satir += '<li><span>Vardiya amiri</span><span>' + h.amir + ' kişi</span></li>';
        var EK = { "K9 köpekli ekip": "K9 ekibi (eğitimli görevli + köpek)", "Drone gözetimi": "Drone ile gözetim, haftalık uçuş planı", "Kamera izleme": "Kamera izleme koordinasyonu", "Devriye aracı": "Devriye aracı ve sürücü görevli" };
        h.ekler.forEach(function (e) { satir += '<li><span>' + (EK[e] || e) + '</span><span>ek</span></li>'; });
        satir += '<li><span>Hesap yöneticisi ve bölge denetçisi</span><span>dahil</span></li>';
        s.innerHTML = satir;
        document.getElementById("sonuc-sayi").textContent = (h.gorevli + h.amir);
        document.getElementById("sonuc-hesap").textContent =
          h.nokta + " nokta × haftada " + h.hafta + " saat = " + (h.nokta * h.hafta) + " saat. Bir görevli haftada en fazla 45 saat çalışır; izin ve resmî tatil payıyla nokta başına " +
          virgul(h.hafta / 45 * 1.125) + " görevli gerekir. Toplam " + virgul(h.ham) + ", yukarı yuvarlanınca " + h.gorevli + " görevli.";
        document.getElementById("sonuc-model").textContent = MODEL[h.tesis] || "Giriş kontrolü, ziyaretçi kaydı, devriye ve olay tutanağı; ayrıntı keşifte netleşir.";
      }
    }
    function goster(i) {
      simdi = Math.max(0, Math.min(adimlar.length - 1, i));
      adimlar.forEach(function (a, j) { a.hidden = j !== simdi; });
      ilerleme.forEach(function (l, j) {
        l.className = j < simdi ? "tamam" : j === simdi ? "simdi" : "";
        if (j === simdi) l.setAttribute("aria-current", "step"); else l.removeAttribute("aria-current");
      });
      ozetYaz();
      document.getElementById("ozet").hidden = simdi >= 4;
    }
    sb.addEventListener("click", function (e) {
      var ileri = e.target.closest("[data-ileri]"), geri = e.target.closest("[data-geri]");
      if (ileri) {
        var a = adimlar[simdi];
        var zorunlu = a.querySelector("[data-zorunlu]");
        if (zorunlu && !a.querySelector("input:checked") && zorunlu.tagName === "FIELDSET") {
          var h = a.querySelector(".hata"); h.hidden = false; return;
        }
        var gerekli = [].slice.call(a.querySelectorAll("input[required],select[required]"));
        for (var k = 0; k < gerekli.length; k++) { if (!gerekli[k].checkValidity()) { gerekli[k].reportValidity(); return; } }
        if (simdi === 5) {
          var no = "RS-2026-" + String(Math.floor(1000 + (Date.now() / 1000) % 9000));
          document.getElementById("talep-no").textContent = no;
        }
        goster(simdi + 1);
        var ust = sb.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: ust, behavior: azHareket ? "auto" : "smooth" });
        var bas = adimlar[simdi].querySelector("h2"); if (bas) { bas.setAttribute("tabindex", "-1"); bas.focus({ preventScroll: true }); }
      }
      if (geri) goster(simdi - 1);
    });
    sb.addEventListener("change", function (e) {
      var a = e.target.closest(".adim"); var h = a && a.querySelector(".hata"); if (h) h.hidden = true;
      ozetYaz();
    });
    sb.addEventListener("input", ozetYaz);
    var ad = parseInt(params.get("adim"), 10);
    if (ad >= 2) {
      // Önizleme: örnek seçimlerle ilgili adımı aç
      var t = sb.querySelector('[name="tesis"][value="Fabrika / sanayi tesisi"]'); if (t) t.checked = true;
      sb.querySelector("#il").value = "Kocaeli"; sb.querySelector("#ilce").value = "Gebze";
      sb.querySelector("#nokta").value = 3;
    }
    goster(isNaN(ad) ? 0 : ad - 1);
  }

  /* Basit form gönderimleri (prototip) */
  document.querySelectorAll("form[data-onay]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var k = document.getElementById(f.dataset.onay);
      if (k) { k.hidden = false; k.setAttribute("tabindex", "-1"); k.focus(); }
    });
  });
  var kodIste = document.getElementById("kod-iste");
  if (kodIste) kodIste.addEventListener("click", function () {
    var e = document.getElementById("portal-eposta");
    if (!e.checkValidity()) { e.reportValidity(); return; }
    document.getElementById("kod-adim").hidden = false;
    document.querySelector(".kod-alan input").focus();
  });
  document.querySelectorAll(".kod-alan input").forEach(function (inp, i, hepsi) {
    inp.addEventListener("input", function () { inp.value = inp.value.replace(/\D/g, "").slice(0, 1); if (inp.value && hepsi[i + 1]) hepsi[i + 1].focus(); });
  });

  /* Dijital asistan */
  var AKIS = {
    bas: { m: "Ress Dijital Asistanına hoş geldiniz. Özel güvenlik, tesis yönetimi, temizlik ve teknik bakım alanlarında hangi konuda destek almak istediğinizi yazabilirsiniz.",
      s: [["Güvenlik teklifi istiyorum", "teklif"], ["İş başvurusu yapmak istiyorum", "is"], ["En yakın bölge müdürlüğü", "bolge"], ["Şikâyet / öneri", "sikayet"]] },
    teklif: { m: "Hangi tesis için güvenlik düşünüyorsunuz?", s: [["Fabrika veya depo", "teklif2"], ["Plaza veya ofis", "teklif2"], ["Site veya rezidans", "teklif2"], ["Başka bir tesis", "teklif2"]] },
    teklif2: { m: "Tesis hangi ilde?", s: [["İstanbul", "teklif3"], ["Kocaeli", "teklif3"], ["Başka bir il", "teklif3"]] },
    teklif3: { m: 'Talebinizi ilgili bölge müdürlüğüne ilettim. Kayıt numaranız: <span class="veri">RS-2026-0418</span>. Fiyat ve başlangıç tarihini keşiften sonra bölge müdürlüğümüz paylaşır. Önerilen kadroyu şimdi görmek isterseniz <a href="teklif.html">teklif sihirbazını açın</a>.', s: [["Başka bir konu", "bas"]] },
    is: { m: "Geçerli bir Özel Güvenlik Kimlik Kartınız (ÖGKK) var mı?", s: [["Evet, kartım var", "is2"], ["Hayır, yok", "is3"]] },
    is2: { m: 'Başvurunuzu <a href="kariyer.html#basvuru">kariyer sayfasındaki formdan</a> yapabilirsiniz; kart geçerlilik tarihinizi yazmayı unutmayın. Başvurular, oturduğunuz ile en yakın bölge müdürlüğünde değerlendirilir.', s: [["Açık pozisyonlar", "is4"], ["Başka bir konu", "bas"]] },
    is3: { m: "Görev alabilmek için ÖGKK şarttır. Kartı, yetkili bir özel güvenlik eğitim kurumunda temel eğitimi ve sınavı tamamladıktan sonra alırsınız. Kartınız çıktığında başvurunuzu bekleriz.", s: [["Yine de bilgilerimi bırakmak istiyorum", "is2"], ["Başka bir konu", "bas"]] },
    is4: { m: 'Şu an İstanbul, Gebze ve Ambarlı için ilanlarımız var. Tam listeyi <a href="kariyer.html">kariyer sayfasında</a> görebilirsiniz.', s: [["Başka bir konu", "bas"]] },
    bolge: { m: "Hangi ildesiniz?", s: [["İstanbul", "bolge-ist"], ["Kocaeli / Sakarya / Bursa", "bolge-mar"], ["Ankara", "bolge-ank"], ["İzmir", "bolge-ege"], ["Başka bir il", "bolge-diger"]] },
    "bolge-ist": { m: "İstanbul'daki talepler Esenyurt'taki genel müdürlüğümüzden yürütülür: Sedai Plaza Kat 7, Talatpaşa Mah. Telefon: 0850 888 73 77.", s: [["Başka bir konu", "bas"]] },
    "bolge-mar": { m: "Size en yakın birim Marmara Bölge Müdürlüğümüz (Kocaeli). Telefon: 0850 888 73 77; çağrı ilgili müdürlüğe aktarılır.", s: [["Başka bir konu", "bas"]] },
    "bolge-ank": { m: "Size en yakın birim İç Anadolu Bölge Müdürlüğümüz (Ankara). Telefon: 0850 888 73 77.", s: [["Başka bir konu", "bas"]] },
    "bolge-ege": { m: "Size en yakın birim Ege Bölge Müdürlüğümüz (İzmir). Telefon: 0850 888 73 77.", s: [["Başka bir konu", "bas"]] },
    "bolge-diger": { m: 'Sekiz bölge müdürlüğümüzün hangisine bağlı olduğunuzu <a href="bolgeler.html">bölge haritasında</a> görebilirsiniz.', s: [["Başka bir konu", "bas"]] },
    sikayet: { m: "Konu hangisi?", s: [["Görevli ile ilgili", "sikayet2"], ["Hizmet düzeni", "sikayet2"], ["Öneri", "sikayet2"]] },
    sikayet2: { m: 'Kaydınızı açtım: <span class="veri">SK-2026-0093</span>. Kalite ve Denetim Koordinatörlüğümüz kaydı inceleyip sizi arayacak. Ayrıntı eklemek isterseniz <a href="iletisim.html">iletişim formunu</a> kullanabilirsiniz.', s: [["Başka bir konu", "bas"]] }
  };
  var asBtn = document.createElement("button");
  asBtn.className = "asistan-dugme"; asBtn.type = "button";
  asBtn.setAttribute("aria-expanded", "false"); asBtn.setAttribute("aria-controls", "asistan");
  asBtn.innerHTML = IK.sohbet + '<span>Dijital asistan</span>';
  asBtn.querySelector("span").className = "uzun";
  asBtn.setAttribute("aria-label", "Dijital asistanı aç");
  var as = document.createElement("section");
  as.className = "asistan"; as.id = "asistan"; as.setAttribute("aria-label", "Ress Dijital Asistan");
  as.innerHTML = '<div class="asistan-bas"><div><strong>Ress Dijital Asistan</strong><span>Yapay zekâ ile çalışır. Teklif ve kararları bölge müdürlüğümüz verir.</span></div><button type="button" aria-label="Asistanı kapat">' + IK.kapat + '</button></div>' +
    '<div class="asistan-akis" aria-live="polite"></div><div class="hazir"></div>' +
    '<form class="asistan-yaz"><label class="gizli" for="asistan-girdi">Mesajınız</label><input id="asistan-girdi" type="text" placeholder="Sorunuzu yazın" autocomplete="off"><button class="dugme dugme-ana" type="submit">Yaz</button></form>';
  document.body.appendChild(as); document.body.appendChild(asBtn);
  var akis = as.querySelector(".asistan-akis"), hazir = as.querySelector(".hazir");
  function msj(metin, kim) { var d = document.createElement("div"); d.className = "msj msj-" + kim; d.innerHTML = metin; akis.appendChild(d); akis.scrollTop = akis.scrollHeight; }
  function dugum(ad) {
    var n = AKIS[ad]; msj(n.m, "bot"); hazir.innerHTML = "";
    n.s.forEach(function (s) {
      var b = document.createElement("button"); b.type = "button"; b.textContent = s[0];
      b.addEventListener("click", function () { msj(s[0], "sen"); dugum(s[1]); });
      hazir.appendChild(b);
    });
  }
  function asistanDurum(ac) {
    as.classList.toggle("acik", ac); asBtn.setAttribute("aria-expanded", ac ? "true" : "false");
    if (ac && !akis.children.length) dugum("bas");
    if (ac) { var b = hazir.querySelector("button"); b && b.focus(); }
  }
  asBtn.addEventListener("click", function () { asistanDurum(!as.classList.contains("acik")); });
  as.querySelector(".asistan-bas button").addEventListener("click", function () { asistanDurum(false); asBtn.focus(); });
  as.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault(); var i = as.querySelector("input"); if (!i.value.trim()) return;
    msj(i.value.replace(/</g, "&lt;"), "sen"); i.value = "";
    msj("Bu önizlemede yazılı soruları yanıtlamıyorum. Aşağıdaki seçeneklerden birini seçebilir ya da 0850 888 73 77'yi arayabilirsiniz.", "bot");
  });
  if (params.get("asistan") === "1") {
    asistanDurum(true);
    var ilk = hazir.querySelector("button"); if (ilk) ilk.click();
  }

  /* Ekranlar (önizleme gezintisi) */
  var EKRANLAR = [["index.html", "Ana sayfa"], ["hizmetler.html", "Hizmetler"], ["hizmet-detay.html", "Hizmet detayı: fabrika"], ["kurumsal.html", "Kurumsal"], ["referanslar.html", "Referanslar"], ["bolgeler.html", "Bölge müdürlükleri"], ["teklif.html", "Teklif sihirbazı"], ["kariyer.html", "Kariyer"], ["iletisim.html", "İletişim"], ["musteri-portali.html", "Müşteri portalı"], ["mobil.html", "Telefonda site"]];
  var burasi = location.pathname.split("/").pop() || "index.html";
  var ek = document.createElement("div"); ek.className = "ekranlar";
  ek.innerHTML = '<button type="button" aria-expanded="false">Ekranlar</button><nav class="ekranlar-liste" aria-label="Önizleme ekranları">' +
    EKRANLAR.map(function (e) { return '<a href="' + e[0] + '"' + (e[0] === burasi ? ' aria-current="page"' : "") + '>' + e[1] + '</a>'; }).join("") +
    '<hr><a href="../index.html">Tüm seçeneklere dön</a></nav>';
  document.body.appendChild(ek);
  ek.querySelector("button").addEventListener("click", function () {
    var ac = !ek.classList.contains("acik"); ek.classList.toggle("acik", ac); this.setAttribute("aria-expanded", ac ? "true" : "false");
  });
  document.addEventListener("click", function (e) { if (!ek.contains(e.target)) { ek.classList.remove("acik"); ek.querySelector("button").setAttribute("aria-expanded", "false"); } });
})();

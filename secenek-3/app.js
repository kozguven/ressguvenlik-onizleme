/* RESS Koruma — Seçenek 3: Dijital Nöbet. Ortak kabuk, asistan, sayfa davranışları. */
(function(){
"use strict";
var Q = new URLSearchParams(location.search);
var SAYFA = document.body.getAttribute("data-sayfa") || "";
var CERCEVE = Q.get("cerceve") === "1";
if (CERCEVE) document.body.classList.add("cerceve");

/* ---------- ikon seti: 24 kutu, 1.75 çizgi ---------- */
var IK = {
  kalkan:'<path d="M12 3l7 3v5c0 4.5-3 8.3-7 10-4-1.7-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
  asistan:'<path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H6a2 2 0 0 1-2-2z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/>',
  ev:'<path d="M4 11l8-7 8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>',
  izgara:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
  belge:'<path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  kilit:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  konum:'<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  kisi:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>',
  uyari:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
  telefon:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  posta:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6 8.5-6"/>',
  saat:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  nfc:'<circle cx="12" cy="12" r="1.8"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8"/>',
  rapor:'<path d="M4 4v16h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  indir:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  arti:'<path d="M12 5v14M5 12h14"/>',
  kapat:'<path d="M6 6l12 12M18 6L6 18"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  tik:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  sag:'<path d="M9 6l6 6-6 6"/>',
  asagi:'<path d="M6 9l6 6 6-6"/>',
  fabrika:'<path d="M3 21V10l6 4v-4l6 4V5h5v16z"/><path d="M7 18h2M12 18h2"/>',
  bina:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
  kamera:'<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 10.5l6-3v9l-6-3z"/>',
  whatsapp:'<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/><path d="M9 9c0 3 2.5 6 6 6"/>',
  egitim:'<path d="M3 9l9-5 9 5-9 5z"/><path d="M7 11.2V16c3 2 7 2 10 0v-4.8"/>',
  arac:'<path d="M3 16v-4l2.2-5h13.6L21 12v4z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/>',
  bayrak:'<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
  hastane:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
  magaza:'<path d="M4 9l1.5-5h13L20 9"/><path d="M4 9h16v2a3 3 0 0 1-5.3 2 3 3 0 0 1-5.4 0A3 3 0 0 1 4 11z"/><path d="M5.5 14v6h13v-6"/>',
  ekip:'<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6M15.5 14.5c3 0 5.5 2 5.5 5"/>',
  drone:'<circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="5.5" r="2.5"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><rect x="9.5" y="9.5" width="5" height="5" rx="1.2"/><path d="M7.5 7.5l2 2M16.5 7.5l-2 2M7.5 16.5l2-2M16.5 16.5l-2-2"/>',
  kopek:'<path d="M5 10l2-5 3 3h4l3-3 2 5v3a7 7 0 0 1-14 0z"/><path d="M10 13h.01M14 13h.01M11 17h2"/>',
  dalga:'<path d="M3 15c2 0 2-1.5 4.5-1.5S9.5 15 12 15s2-1.5 4.5-1.5S18.5 15 21 15"/><path d="M6 12V6h7l3 3v3"/><path d="M3 19c2 0 2-1.5 4.5-1.5S9.5 19 12 19s2-1.5 4.5-1.5S18.5 19 21 19"/>'
};
function ik(ad, sinif){ return '<svg class="ik'+(sinif?' '+sinif:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+(IK[ad]||'')+'</svg>'; }
window.RESS_IK = ik;
document.querySelectorAll("[data-ik]").forEach(function(el){ el.outerHTML = ik(el.getAttribute("data-ik"), el.getAttribute("data-sinif")); });

/* ---------- kabuk: üst menü, telefon menüsü, alt sekme, footer ---------- */
var MENU = [
  ["hizmetler","hizmetler.html","Hizmetler","13 hizmet ve dijital ürünlerimiz"],
  ["portal","musteri-portali.html","Dijital Nöbet","Müşteri portalı ve raporlar"],
  ["kurumsal","kurumsal.html","Kurumsal","2012'den beri Ress"],
  ["referanslar","referanslar.html","Referanslar","Müşterilerimiz ne diyor"],
  ["bolgeler","bolgeler.html","Bölgeler","8 bölge müdürlüğü"],
  ["kariyer","kariyer.html","Kariyer","Açık pozisyonlar, başvuru"],
  ["iletisim","iletisim.html","İletişim","0850 888 73 77"]
];
function aktif(k){ return (SAYFA===k || (k==="hizmetler" && SAYFA==="hizmet-detay")) ? ' aria-current="page"' : ''; }
var ust = document.getElementById("ust");
if (ust){
  ust.className = "ust";
  ust.innerHTML = '<div class="kap ust-ic"><a class="logo" href="index.html"><img src="../assets/logo/ress-koruma-logo-acik-zemin.png" alt="RESS Security Service ana sayfa" width="106" height="34"></a>'+
  '<nav aria-label="Ana menü"><ul>'+MENU.map(function(m){return '<li><a href="'+m[1]+'"'+aktif(m[0])+'>'+m[2]+'</a></li>';}).join("")+'</ul></nav>'+
  '<a class="ust-tel" href="tel:+908508887377">'+ik("telefon")+'0850 888 73 77</a>'+
  '<div class="ust-eylem"><a class="dug dug-cizgi" href="musteri-portali.html">Müşteri girişi</a><a class="dug dug-bordo" href="teklif.html">Teklif al</a></div>'+
  '<button class="menu-dug" type="button" aria-label="Menüyü aç" aria-expanded="false" aria-controls="menuSayfa">'+ik("menu")+'</button></div>';
  var ms = document.createElement("div");
  ms.className = "menu-sayfa"; ms.id = "menuSayfa"; ms.setAttribute("role","dialog"); ms.setAttribute("aria-label","Menü");
  ms.innerHTML = '<div class="ust-ic"><a class="logo" href="index.html"><img src="../assets/logo/ress-koruma-logo-acik-zemin.png" alt="RESS ana sayfa" width="106" height="34"></a><button class="menu-dug" type="button" aria-label="Menüyü kapat">'+ik("kapat")+'</button></div>'+
  '<ul class="menu-liste"><li><a href="index.html"'+aktif("index")+'>'+ik("ev")+'<span>Ana sayfa<small>Dijital asistan ve nöbet panosu</small></span></a></li>'+
  MENU.map(function(m){return '<li><a href="'+m[1]+'"'+aktif(m[0])+'>'+ik({hizmetler:"izgara",portal:"nfc",kurumsal:"bina",referanslar:"ekip",bolgeler:"konum",kariyer:"kisi",iletisim:"telefon"}[m[0]])+'<span>'+m[2]+'<small>'+m[3]+'</small></span></a></li>';}).join("")+
  '</ul><div class="menu-alt"><a class="dug dug-bordo dug-tam" href="teklif.html">Teklif al</a><a class="dug dug-cizgi dug-tam" href="tel:+908508887377">'+ik("telefon")+'0850 888 73 77’yi ara</a></div>';
  document.body.appendChild(ms);
  var acDug = ust.querySelector(".menu-dug"), kapaDug = ms.querySelector(".menu-dug");
  acDug.addEventListener("click", function(){ ms.classList.add("acik"); acDug.setAttribute("aria-expanded","true"); kapaDug.focus(); });
  kapaDug.addEventListener("click", function(){ ms.classList.remove("acik"); acDug.setAttribute("aria-expanded","false"); acDug.focus(); });
  if (Q.get("menu")==="1") ms.classList.add("acik");
}

var sekme = document.createElement("nav");
sekme.className = "sekme"; sekme.setAttribute("aria-label","Hızlı erişim");
sekme.innerHTML =
  '<a href="index.html"'+aktif("index")+'>'+ik("ev")+'Ana sayfa</a>'+
  '<a href="hizmetler.html"'+aktif("hizmetler")+'>'+ik("izgara")+'Hizmetler</a>'+
  '<a class="sekme-teklif" href="teklif.html"'+aktif("teklif")+'><span class="yuvar">'+ik("belge")+'Teklif al</span></a>'+
  '<button type="button" data-asistan-ac>'+ik("asistan")+'Asistan</button>'+
  '<a href="musteri-portali.html"'+aktif("portal")+'>'+ik("kilit")+'Giriş</a>';
document.body.appendChild(sekme);

var alt = document.getElementById("alt");
if (alt){
  alt.className = "alt";
  alt.innerHTML = '<div class="kap"><div class="alt-ic">'+
  '<div><img src="../assets/logo/ress-koruma-logo-koyu-zemin.png" alt="RESS Security Service" width="106" height="34"><p>RESS Koruma ve Özel Güvenlik Hizmetleri Limited Şirketi. Bir Ress Group kuruluşudur.</p><p>Hizmet Ress ile Mümkün.</p></div>'+
  '<div><h4>Genel Müdürlük</h4><p>Talatpaşa Mah. Pazaryolu Cad. No:2<br>Sedai Plaza Kat:7 Daire:73<br>Esenyurt / İstanbul</p></div>'+
  '<div><h4>Bize ulaşın</h4><ul><li><a href="tel:+908508887377">0850 888 73 77</a></li><li><a href="mailto:info@resyonetim.com.tr">info@resyonetim.com.tr</a></li><li><a href="https://www.ressgroup.com.tr" rel="noopener">ressgroup.com.tr</a></li></ul></div>'+
  '<div><h4>Sayfalar</h4><ul><li><a href="teklif.html">Teklif sihirbazı</a></li><li><a href="musteri-portali.html">Müşteri girişi</a></li><li><a href="kariyer.html">Kariyer</a></li><li><a href="iletisim.html#kvkk">KVKK aydınlatma metni</a></li></ul></div>'+
  '</div><div class="alt-son"><p>© 2026 RESS Koruma ve Özel Güvenlik. 5188 sayılı Kanun kapsamında İçişleri Bakanlığı faaliyet izniyle hizmet verir. #ressilemümkün</p><p>Tasarım önizlemesi: Webizmo</p></div></div>';
}

/* ---------- Ekranlar (sol alt) ---------- */
var EKR = [["index.html","Ana sayfa"],["hizmetler.html","Hizmetler"],["hizmet-detay.html","Hizmet detayı: fabrika"],["kurumsal.html","Kurumsal"],["referanslar.html","Referanslar"],["bolgeler.html","Bölge müdürlükleri"],["teklif.html","Teklif sihirbazı"],["kariyer.html","Kariyer ve başvuru"],["iletisim.html","İletişim"],["musteri-portali.html","Müşteri portalı"],["mobil.html","Telefonda site"]];
if (!CERCEVE){
  var dosya = location.pathname.split("/").pop() || "index.html";
  var ed = document.createElement("button");
  ed.className = "ekranlar-dug"; ed.type = "button"; ed.textContent = "Ekranlar"; ed.setAttribute("aria-expanded","false"); ed.setAttribute("aria-controls","ekranlarPan");
  var ep = document.createElement("div");
  ep.className = "ekranlar-pan"; ep.id = "ekranlarPan";
  ep.innerHTML = '<ol>'+EKR.map(function(e){return '<li><a href="'+e[0]+'"'+(e[0]===dosya?' aria-current="page"':'')+'>'+e[1]+'</a></li>';}).join("")+'</ol><a class="geri" href="../index.html">Tüm seçeneklere dön</a>';
  ed.addEventListener("click", function(){ var a = ep.classList.toggle("acik"); ed.setAttribute("aria-expanded", a?"true":"false"); });
  document.body.appendChild(ed); document.body.appendChild(ep);
}

/* ---------- videolar: hareket azaltma tercihinde durdur ---------- */
var azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll("video").forEach(function(v){ if (azHareket){ v.pause(); v.removeAttribute("autoplay"); } });

/* ---------- dijital asistan: sahnelenmiş akış ---------- */
var KARSILAMA = "Ress Dijital Asistanına hoş geldiniz. Özel güvenlik, tesis yönetimi, temizlik ve teknik bakım alanlarında hangi konuda destek almak istediğinizi yazabilirsiniz.";
var BAS = [
  {k:"teklif", t:"Güvenlik teklifi istiyorum", i:"belge"},
  {k:"basvuru", t:"İş başvurusu yapmak istiyorum", i:"kisi"},
  {k:"bolge", t:"En yakın bölge müdürlüğü", i:"konum"},
  {k:"sikayet", t:"Şikâyet / öneri", i:"uyari"}
];
function no(on){ return on+"-2026-"+String(1000+Math.floor(Math.random()*8999)); }
var AKIS = {
  teklif:{ s:"Elbette. Hangi tür tesis için güvenlik düşünüyorsunuz?",
    o:[["fabrika","Fabrika / sanayi tesisi"],["site","Site / rezidans"],["hastane","Hastane"],["avm","AVM / mağaza"]],
    sonra:function(sec){ return { s:"Kaç noktada, hangi saatlerde görevli bulunmalı?",
      o:[["7/24 tek nokta","Tek nokta, 7/24"],["7/24 üç nokta","2–3 nokta, 7/24"],["gece","Yalnız gece"]],
      sonra:function(s2){
        var kadro = s2==="7/24 tek nokta" ? "yaklaşık 4,2 görevli" : (s2==="gece" ? "nokta başına yaklaşık 2,1 görevli" : "nokta başına yaklaşık 4,2 görevli");
        return { son:true, s:"Bu ihtiyaç için "+kadro+" gerekir: haftada 168 saat, 45 saatlik yasal çalışma süresine bölünür, izin ve tatil payı eklenir. Fiyatı keşiften sonra bölge müdürlüğümüz verir; ben fiyat ya da tarih sözü veremem.",
          kayit:no("RS"), l:["teklif.html?tesis="+sec,"Teklif sihirbazında tamamla"] };
      }}; } },
  basvuru:{ s:"Teşekkürler. Özel Güvenlik Kimlik Kartınız (ÖGKK) var mı?",
    o:[["gecerli","Var, geçerli"],["yenilenecek","Var, yenilenmesi yakın"],["yok","Henüz yok"]],
    sonra:function(sec){
      var m = sec==="yok" ? "Kartı olmayan adayları temel eğitim sonrası değerlendiriyoruz. Formda bunu belirtmeniz yeterli; eğitim takvimini İnsan Kaynakları paylaşır."
        : sec==="yenilenecek" ? "Kart bitiş tarihinizi formda yazın; yenileme eğitimine kadar size hatırlatma yapılır."
        : "Harika. Açık pozisyonları görüp formu iki dakikada doldurabilirsiniz.";
      return { son:true, s:m+" Başvurunuz bölge müdürlüğünüze iletilir.", l:["kariyer.html#basvuru","Başvuru formunu aç"] }; } },
  bolge:{ s:"Hangi ildesiniz?",
    o:[["gm","İstanbul"],["marmara","Kocaeli / Bursa"],["icanadolu","Ankara"],["ege","İzmir"],["diger","Başka bir il"]],
    sonra:function(sec){
      var Y = {gm:"İstanbul Genel Müdürlük (Esenyurt, Sedai Plaza) size en yakın birim.",marmara:"Marmara Bölge Müdürlüğü (Kocaeli) Kocaeli, Sakarya ve Bursa’dan sorumlu.",icanadolu:"İç Anadolu Bölge Müdürlüğü (Ankara) size en yakın birim.",ege:"Ege Bölge Müdürlüğü (İzmir) size en yakın birim.",diger:"8 bölge müdürlüğümüz 81 ilde hizmet verebiliyor. Haritada ilinizi görebilirsiniz."};
      return { son:true, s:Y[sec]+" Tüm bölgeler için tek numara: 0850 888 73 77.", l:["bolgeler.html"+(sec!=="diger"?"?b="+sec:""),"Bölge kartını aç"] }; } },
  sikayet:{ s:"Geri bildiriminiz bizim için kayıt altına alınır. Konu nedir?",
    o:[["saha","Sahadaki görevli"],["fatura","Fatura / sözleşme"],["oneri","Öneri"]],
    sonra:function(sec){ return { son:true, s:"Kaydınızı açtım. Genel müdürlük kalite birimi kayıt numarasıyla sizinle iletişime geçer. Ayrıntıyı formdan ekleyebilirsiniz.", kayit:no("SKY"), l:["iletisim.html?konu=sikayet","Ayrıntı ekle"] }; } }
};

function Sohbet(kok, buyuk){
  this.kok = kok; this.buyuk = buyuk;
  this.m = kok.querySelector(".mesajlar"); this.s = kok.querySelector(".secenekler");
  var ben = this;
  var r = kok.querySelector("[data-sifirla]"); if (r) r.addEventListener("click", function(){ ben.basla(); });
  this.basla();
}
Sohbet.prototype.ekle = function(html, sinif){
  var d = document.createElement("div"); d.className = "msj "+sinif; d.innerHTML = html; this.m.appendChild(d); this.m.scrollTop = this.m.scrollHeight; return d;
};
Sohbet.prototype.basla = function(){
  this.m.innerHTML = ""; this.ekle("<p>"+KARSILAMA+"</p>","msj-bot");
  this.secenek(BAS.map(function(b){ return [b.k,b.t,b.i]; }), this.ilk.bind(this));
};
Sohbet.prototype.secenek = function(liste, fn){
  var ben = this; this.s.innerHTML = "";
  liste.forEach(function(o){
    var b = document.createElement("button"); b.type = "button"; b.className = "secenek";
    b.innerHTML = (o[2] && ben.buyuk ? ik(o[2]) : "")+"<span>"+o[1]+"</span>";
    b.addEventListener("click", function(){ fn(o[0], o[1]); });
    ben.s.appendChild(b);
  });
};
Sohbet.prototype.yaz = function(cb){
  var ben = this; this.s.innerHTML = "";
  var y = document.createElement("div"); y.className = "yaziyor"; y.setAttribute("aria-label","Asistan yazıyor"); y.innerHTML = "<i></i><i></i><i></i>";
  this.m.appendChild(y); this.m.scrollTop = this.m.scrollHeight;
  setTimeout(function(){ y.remove(); cb(); }, azHareket ? 150 : 750);
};
Sohbet.prototype.adim = function(d){
  var ben = this;
  this.yaz(function(){
    var h = "<p>"+d.s+"</p>"; if (d.kayit) h += '<span class="kayit">Kayıt no: <span class="veri">'+d.kayit+"</span></span>";
    ben.ekle(h, "msj-bot");
    if (d.son){
      var a = document.createElement("a"); a.className = "dug dug-bordo msj-link"; a.href = d.l[0]; a.textContent = d.l[1];
      ben.m.appendChild(a); ben.m.scrollTop = ben.m.scrollHeight;
      ben.secenek([["yeni","Başka bir konu"]], function(){ ben.basla(); });
    } else {
      ben.secenek(d.o, function(k, t){ ben.ekle("<p>"+t+"</p>","msj-kul"); ben.adim(d.sonra(k)); });
    }
  });
};
Sohbet.prototype.ilk = function(k, t){ this.ekle("<p>"+t+"</p>","msj-kul"); this.adim(AKIS[k]); };
/* çerçeve/önizleme için akışı kendiliğinden oynat */
Sohbet.prototype.oynat = function(k, secimler){
  var ben = this, d = AKIS[k];
  ben.ekle("<p>"+BAS.filter(function(b){return b.k===k;})[0].t+"</p>","msj-kul");
  var i = 0;
  (function ileri(dd){
    ben.yaz(function(){
      var h = "<p>"+dd.s+"</p>"; if (dd.kayit) h += '<span class="kayit">Kayıt no: <span class="veri">'+dd.kayit+"</span></span>";
      ben.ekle(h,"msj-bot");
      if (dd.son){ var a=document.createElement("a"); a.className="dug dug-bordo msj-link"; a.href=dd.l[0]; a.textContent=dd.l[1]; ben.m.appendChild(a); ben.m.scrollTop=ben.m.scrollHeight; ben.secenek([["yeni","Başka bir konu"]], function(){ ben.basla(); }); return; }
      var s = dd.o.filter(function(o){return o[0]===secimler[i];})[0] || dd.o[0]; i++;
      ben.ekle("<p>"+s[1]+"</p>","msj-kul"); ileri(dd.sonra(s[0]));
    });
  })(d);
};

var sohbetHTML = '<div class="sohbet"><div class="mesajlar" aria-live="polite"></div><div class="secenekler"></div><div class="sohbet-alt"><span>Yapay zekâ asistanı. Fiyat ve tarih sözü vermez, talebinizi bölge müdürlüğüne iletir.</span><button type="button" data-sifirla>Baştan başla</button></div></div>';

/* ana sayfadaki büyük kutu */
var buyukKutu = document.getElementById("asistanKutu");
var buyukSohbet = null;
if (buyukKutu){
  buyukKutu.insertAdjacentHTML("beforeend", sohbetHTML);
  buyukSohbet = new Sohbet(buyukKutu, true);
}

/* panel (diğer sayfalar + telefonda sekme) */
var pan = document.createElement("div");
pan.className = "asistan-pan"; pan.id = "asistanPan"; pan.setAttribute("role","dialog"); pan.setAttribute("aria-label","Ress Dijital Asistan");
pan.innerHTML = '<div class="pan-bas"><span class="yuz">'+ik("asistan")+'</span><div><strong>Ress Dijital Asistan</strong><span>Yapay zekâ ile çalışır, ekibimiz denetler</span></div><button class="pan-kapat" type="button" aria-label="Asistanı kapat">'+ik("kapat")+'</button></div>'+sohbetHTML;
var perde = document.createElement("div"); perde.className = "perde";
document.body.appendChild(perde); document.body.appendChild(pan);
var panSohbet = null;
function panAc(akis){
  if (buyukKutu && window.innerWidth >= 1100 && !akis){ buyukKutu.scrollIntoView({behavior: azHareket?"auto":"smooth", block:"center"}); return; }
  pan.classList.add("acik"); perde.classList.add("acik");
  if (!panSohbet) panSohbet = new Sohbet(pan, false);
  pan.querySelector(".pan-kapat").focus();
}
function panKapat(){ pan.classList.remove("acik"); perde.classList.remove("acik"); }
pan.querySelector(".pan-kapat").addEventListener("click", panKapat);
perde.addEventListener("click", panKapat);
document.addEventListener("keydown", function(e){ if (e.key==="Escape"){ panKapat(); var ms=document.getElementById("menuSayfa"); if (ms) ms.classList.remove("acik"); } });
var fab = document.createElement("button");
fab.className = "asistan-fab"; fab.type = "button"; fab.innerHTML = '<span class="yuz">'+ik("asistan")+'</span>Asistana sorun';
fab.addEventListener("click", function(){ pan.classList.add("acik"); perde.classList.add("acik"); if (!panSohbet) panSohbet = new Sohbet(pan,false); });
if (!buyukKutu) document.body.appendChild(fab);
document.addEventListener("click", function(e){ if (e.target.closest("[data-asistan-ac]")) panAc(); });
if (Q.get("asistan")){
  var hedefAkis = Q.get("asistan"), sec = (Q.get("sec")||"").split(",");
  if (buyukKutu && buyukSohbet){ buyukSohbet.m.innerHTML=""; buyukSohbet.ekle("<p>"+KARSILAMA+"</p>","msj-bot"); buyukSohbet.oynat(hedefAkis, sec); }
  else { pan.classList.add("acik"); perde.classList.add("acik"); panSohbet = new Sohbet(pan,false); panSohbet.m.innerHTML=""; panSohbet.ekle("<p>"+KARSILAMA+"</p>","msj-bot"); panSohbet.oynat(hedefAkis, sec); }
}

/* ---------- hizmet verisi ---------- */
var HIZ = [
  {a:"Site ve rezidans güvenliği", g:"site-guvenlik", s:["konut"], o:"Giriş kontrolü, ziyaretçi kaydı, otopark izleme ve gece devriyesi."},
  {a:"Fabrika ve sanayi tesisi güvenliği", g:"fabrika-guvenlik", s:["sanayi"], o:"Araç ve personel girişi, kantar ve sevkiyat kontrolü, vardiyalı çevre güvenliği.", detay:true},
  {a:"AVM ve mağaza güvenliği", g:"avm-guvenlik", s:["perakende"], o:"Kayıp önleme, kalabalık yönetimi, açılış ve kapanış kontrolü."},
  {a:"Etkinlik ve organizasyon güvenliği", g:"etkinlik-guvenlik", s:["etkinlik"], o:"Giriş araması, sahne önü, misafir alanı ve tahliye planı."},
  {a:"Hastane ve sağlık tesisi güvenliği", g:"hastane-guvenlik", s:["saglik"], o:"Acil servis girişi, hasta yakını yönlendirme, kadın görevli desteği."},
  {a:"Marina ve liman güvenliği", g:"marina-guvenlik", s:["deniz"], o:"İskele ve rıhtım erişimi, tekne kayıtları, kara tarafı devriyesi."},
  {a:"K9 köpekli güvenlik", g:"k9-guvenlik", s:["deniz","sanayi","ozel"], o:"Eğitimli köpek ve görevliyle arama, geniş alan kontrolü."},
  {a:"Drone ile gözetim", g:"drone-guvenlik", s:["sanayi","maden","etkinlik"], o:"Geniş saha ve çevre hattının havadan kontrolü, kayıtlı uçuş raporu."},
  {a:"e-PMS personel yönetim sistemi", g:"vardiya-brifing", s:["dijital"], o:"Vardiya planı, puantaj, eğitim ve ÖGKK süre takibi tek kayıtta.", urun:"e-PMS"},
  {a:"RDN – Ress Dijital Nöbet", g:"dijital-nobet-nfc", s:["dijital"], o:"NFC kontrol noktası, fotoğraflı olay tutanağı, müşteriye anlık rapor.", urun:"RDN"},
  {a:"Yük gemisi korumacılığı", g:"gemi-koruma", s:["deniz"], o:"Seyir ve liman bekleme süresince gemi üstü koruma ekibi."},
  {a:"Zırhlı taşımacılık", g:"zirhli-tasima", s:["ozel","perakende"], o:"Değerli eşya ve nakit transferi, rota ve teslim kaydıyla."},
  {a:"Maden koruma", g:"maden-koruma", s:["maden"], o:"Ocak girişi, patlayıcı deposu ve saha çevresi koruması."},
  {a:"VIP yakın koruma", g:"hero-gece-plaza", s:["ozel"], o:"Kişiye özel koruma planı, araç ve mekân keşfi.", ek:true},
  {a:"Devriye hizmeti", g:"istanbul-bati-panorama", s:["konut","sanayi"], o:"Araçlı ve yaya devriye, kontrol noktası okutmalı.", ek:true},
  {a:"Kamera izleme koordinasyonu", g:"operasyon-merkezi", s:["sanayi","perakende","konut"], o:"İzleme odası ile sahadaki ekibin anlık iletişimi.", ek:true},
  {a:"Plaza ve iş merkezi güvenliği", g:"plaza-resepsiyon", s:["perakende"], o:"Resepsiyon, turnike, kat erişimi ve misafir kartı.", ek:true},
  {a:"Okul güvenliği", g:"okul-guvenlik", s:["konut","ozel"], o:"Giriş-çıkış saatleri, veli bekleme alanı, servis kontrolü.", ek:true},
  {a:"Şantiye güvenliği", g:"santiye-guvenlik", s:["sanayi"], o:"Malzeme sahası, iş makinesi ve gece giriş kontrolü.", ek:true}
];
function hKart(h){
  return '<a class="h-kart" href="hizmet-detay.html" data-s="'+h.s.join(" ")+'"><img src="../assets/img/'+h.g+'.jpg" alt="" loading="lazy" width="600" height="400"><div class="ic"><h3>'+h.a+'</h3><p>'+h.o+'</p><span class="etiket">'+(h.detay?"Ayrıntıları gör":"Kapsamı incele")+'</span></div></a>';
}
var anaH = document.getElementById("anaHizmetler");
if (anaH) anaH.innerHTML = [1,0,4,2,6,5].map(function(i){ return hKart(HIZ[i]); }).join("");
var tumH = document.getElementById("tumHizmetler");
if (tumH){
  tumH.innerHTML = HIZ.filter(function(h){return !h.urun;}).map(hKart).join("");
  var bos = document.getElementById("bosSonuc");
  document.querySelectorAll("#sektorCip .cip").forEach(function(c){
    c.addEventListener("click", function(){
      document.querySelectorAll("#sektorCip .cip").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
      c.setAttribute("aria-pressed","true");
      var s = c.getAttribute("data-s"), say = 0;
      tumH.querySelectorAll(".h-kart").forEach(function(k){ var g = s==="tum" || k.getAttribute("data-s").split(" ").indexOf(s)>-1; k.hidden = !g; if (g) say++; });
      bos.style.display = say ? "none" : "block";
      document.getElementById("sonucSay").textContent = say+" hizmet";
    });
  });
}

/* referanslar süzme */
document.querySelectorAll("#refCip .cip").forEach(function(c){
  c.addEventListener("click", function(){
    document.querySelectorAll("#refCip .cip").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
    c.setAttribute("aria-pressed","true");
    var s = c.getAttribute("data-s");
    document.querySelectorAll("[data-ref]").forEach(function(k){ k.hidden = !(s==="tum" || k.getAttribute("data-ref").split(" ").indexOf(s)>-1); });
  });
});

/* ---------- bölgeler haritası ---------- */
var BOLGE = [
  {k:"gm", a:"İstanbul Genel Müdürlük", m:"Esenyurt, Sedai Plaza", lon:28.68, lat:41.03, il:["İstanbul","Tekirdağ","Edirne","Kırklareli"], gm:true},
  {k:"marmara", a:"Marmara Bölge Müdürlüğü", m:"Kocaeli", lon:29.92, lat:40.77, il:["Kocaeli","Sakarya","Bursa","Yalova","Bilecik","Düzce","Bolu","Balıkesir","Çanakkale"]},
  {k:"icanadolu", a:"İç Anadolu Bölge Müdürlüğü", m:"Ankara", lon:32.86, lat:39.93, il:["Ankara","Konya","Eskişehir","Kayseri","Kırıkkale","Kırşehir","Aksaray","Niğde","Nevşehir","Karaman","Çankırı","Yozgat","Sivas"]},
  {k:"karadeniz", a:"Karadeniz Bölge Müdürlüğü", m:"Ordu", lon:37.88, lat:40.98, il:["Ordu","Samsun","Trabzon","Giresun","Rize","Artvin","Sinop","Kastamonu","Zonguldak","Bartın","Karabük","Amasya","Tokat","Çorum","Gümüşhane","Bayburt"]},
  {k:"ege", a:"Ege Bölge Müdürlüğü", m:"İzmir", lon:27.14, lat:38.42, il:["İzmir","Manisa","Aydın","Muğla","Denizli","Uşak","Kütahya","Afyonkarahisar"]},
  {k:"akdeniz", a:"Akdeniz Bölge Müdürlüğü", m:"Adana", lon:35.32, lat:37.0, il:["Adana","Mersin","Hatay","Osmaniye","Kahramanmaraş"]},
  {k:"antalya", a:"Antalya Bölge Müdürlüğü", m:"Antalya", lon:30.71, lat:36.89, il:["Antalya","Isparta","Burdur"]},
  {k:"guneydogu", a:"Güneydoğu Anadolu Bölge Müdürlüğü", m:"Gaziantep", lon:37.38, lat:37.07, il:["Gaziantep","Şanlıurfa","Diyarbakır","Mardin","Batman","Siirt","Şırnak","Adıyaman","Kilis"]},
  {k:"dogu", a:"Doğu Anadolu Bölge Müdürlüğü", m:"Ağrı / Doğubayazıt", lon:44.08, lat:39.55, il:["Ağrı","Erzurum","Van","Kars","Iğdır","Ardahan","Erzincan","Malatya","Elazığ","Bingöl","Muş","Bitlis","Hakkari","Tunceli"]}
];
var TR = [[26.04,40.74],[26.36,41.02],[26.62,41.36],[26.32,41.72],[26.6,41.98],[27.55,42.0],[28.02,41.98],[28.12,41.6],[28.98,41.3],[29.9,41.15],[30.9,41.08],[31.4,41.3],[32.3,41.72],[33.4,42.0],[34.9,42.05],[35.2,41.72],[36.1,41.68],[36.6,41.28],[37.6,41.08],[38.4,40.92],[39.5,41.05],[40.4,40.98],[41.55,41.52],[42.5,41.45],[43.45,41.12],[43.72,40.72],[43.6,40.12],[44.4,39.95],[44.8,39.68],[44.42,39.4],[44.22,38.9],[44.48,38.32],[44.3,37.9],[44.8,37.18],[44.25,37.05],[42.8,37.35],[42.3,37.12],[41.2,37.08],[40.2,37.12],[39.0,36.7],[38.2,36.88],[37.0,36.65],[36.68,36.82],[36.68,36.22],[36.18,35.82],[35.8,36.3],[36.1,36.62],[35.6,36.6],[34.62,36.8],[34.0,36.28],[33.0,36.1],[32.3,36.2],[31.5,36.7],[30.62,36.82],[30.42,36.24],[29.6,36.15],[29.0,36.62],[28.2,36.72],[27.4,37.02],[27.22,37.4],[27.0,37.9],[26.3,38.24],[26.82,38.72],[26.62,39.3],[26.08,39.48],[26.18,40.04],[26.7,40.42],[26.25,40.6]];
var MARMARA = [[26.75,40.44],[27.5,40.32],[28.5,40.38],[29.25,40.45],[29.0,40.78],[28.1,40.98],[27.3,40.78],[26.95,40.6]];
var S = 46, KX = Math.cos(39*Math.PI/180);
var PAY = 70;
function px(lon,lat){ return [((lon-25.6)*KX*S+PAY).toFixed(1), ((42.4-lat)*S).toFixed(1)]; }
function yol(n){ return "M"+n.map(function(p){ return px(p[0],p[1]).join(","); }).join("L")+"Z"; }
var harita = document.getElementById("trHarita");
if (harita){
  var w = ((45.2-25.6)*KX*S+PAY*2).toFixed(0), hh = ((42.4-35.6)*S).toFixed(0);
  var svg = '<svg viewBox="0 0 '+w+' '+hh+'" role="img" aria-label="Türkiye haritasında 8 bölge müdürlüğü ve genel müdürlük"><path class="tr-sekil" d="'+yol(TR)+'"/><path class="marmara" d="'+yol(MARMARA)+'"/>';
  BOLGE.forEach(function(b){
    var p = px(b.lon,b.lat), sol = b.k==="gm" || b.k==="ege" || b.k==="antalya" || b.k==="akdeniz";
    var ty = b.k==="gm" ? -14 : (b.k==="marmara" ? 26 : 5);
    var tx = b.k==="gm" ? -12 : (sol ? -14 : 14);
    var anchor = (b.k==="gm" || sol) ? "end" : "start";
    if (b.k==="dogu"){ anchor="end"; tx=-14; }
    if (b.k==="marmara"){ anchor="start"; tx=4; }
    svg += '<g class="nokta-g'+(b.gm?' gm':'')+'" data-b="'+b.k+'" tabindex="0" role="button" aria-label="'+b.a+'"><circle class="d" cx="'+p[0]+'" cy="'+p[1]+'" r="10"/><circle class="i" cx="'+p[0]+'" cy="'+p[1]+'" r="3.5"/><text x="'+(+p[0]+tx)+'" y="'+(+p[1]+ty)+'" text-anchor="'+anchor+'">'+b.m.split(" /")[0].split(",")[0]+'</text></g>';
  });
  svg += "</svg>";
  harita.innerHTML = svg;
  var kart = document.getElementById("bolgeKart");
  function bolgeSec(k){
    var b = BOLGE.filter(function(x){return x.k===k;})[0]; if (!b) return;
    harita.querySelectorAll(".nokta-g").forEach(function(g){ g.classList.toggle("secili", g.getAttribute("data-b")===k); });
    kart.innerHTML = '<h3>'+b.a+'</h3><p class="ikincil">'+b.m+(b.gm?'':'. Genel müdürlüğe bağlı, sahadaki ekiplerin keşif ve denetiminden sorumlu.')+(b.gm?'. Talatpaşa Mah. Pazaryolu Cad. No:2 Kat:7 Daire:73.':'')+'</p><h4>Sorumlu iller ('+b.il.length+')</h4><ul class="il-liste">'+b.il.map(function(i){return "<li>"+i+"</li>";}).join("")+'</ul><div style="display:grid;gap:8px"><a class="dug dug-bordo" href="teklif.html">Bu bölgeden teklif iste</a><a class="dug dug-cizgi" href="tel:+908508887377">'+ik("telefon")+'0850 888 73 77</a></div>';
  }
  harita.addEventListener("click", function(e){ var g = e.target.closest(".nokta-g"); if (g) bolgeSec(g.getAttribute("data-b")); });
  harita.addEventListener("keydown", function(e){ if ((e.key==="Enter"||e.key===" ") && e.target.closest(".nokta-g")){ e.preventDefault(); bolgeSec(e.target.closest(".nokta-g").getAttribute("data-b")); } });
  bolgeSec(Q.get("b") || "gm");
  var liste = document.getElementById("bolgeListe");
  liste.innerHTML = BOLGE.map(function(b){ return '<div class="bolge-satir"><h3>'+b.a+'</h3><p>'+b.m+'. '+b.il.slice(0,6).join(", ")+(b.il.length>6?" ve "+(b.il.length-6)+" il daha":"")+'.</p></div>'; }).join("");
  document.querySelectorAll("#gorunum button").forEach(function(btn){
    btn.addEventListener("click", function(){
      document.querySelectorAll("#gorunum button").forEach(function(x){ x.setAttribute("aria-pressed","false"); });
      btn.setAttribute("aria-pressed","true");
      var l = btn.getAttribute("data-g")==="liste";
      document.getElementById("haritaGor").hidden = l; liste.classList.toggle("acik", l);
    });
  });
}

/* ---------- teklif sihirbazı ---------- */
var sih = document.getElementById("sihirbaz");
if (sih){
  var adimlar = sih.querySelectorAll(".adim"), N = adimlar.length, cur = 0;
  var SAAT = {"7/24":168, "gunduz":84, "gece":84, "haftasonu":48};
  var SAAT_AD = {"7/24":"7/24", "gunduz":"Gündüz (08–20)", "gece":"Gece (20–08)", "haftasonu":"Yalnız hafta sonu"};
  function deger(ad){ var e = sih.querySelector('[name="'+ad+'"]:checked'); return e ? e.value : ""; }
  function hesapla(){
    var nokta = +document.getElementById("noktaSay").value;
    var sa = SAAT[deger("saat")] || 168;
    var kisi = nokta*sa/45*1.125;
    var ekler = [].map.call(sih.querySelectorAll('[name="ek"]:checked'), function(e){ return e.getAttribute("data-ad"); });
    var tesis = sih.querySelector('[name="tesis"]:checked');
    var il = document.getElementById("il").value, ilce = document.getElementById("ilce").value;
    var ozet = {
      tesis: tesis ? tesis.getAttribute("data-ad") : "Seçilmedi",
      konum: il ? il+(ilce?" / "+ilce:"") : "Seçilmedi",
      nokta: nokta+" nokta, "+(SAAT_AD[deger("saat")]||"7/24"),
      yetki: deger("yetki")==="silahli" ? "Silahlı" : "Silahsız",
      ek: ekler.length ? ekler.join(", ") : "Yok"
    };
    Object.keys(ozet).forEach(function(k){ document.querySelectorAll('[data-oz="'+k+'"]').forEach(function(e){ e.textContent = ozet[k]; }); });
    var tam = Math.ceil(kisi);
    var amir = tam >= 8 ? 1 : 0;
    document.querySelectorAll("[data-kadro]").forEach(function(e){ e.textContent = kisi.toFixed(1).replace(".",",")+" görevli"; });
    document.querySelectorAll("[data-kadro-ac]").forEach(function(e){
      e.textContent = tam+" kişilik ekip olarak planlanır"+(amir?", 1 vardiya amiri eklenir":"")+". Hesap: "+nokta+" nokta × "+sa+" saat ÷ 45 saat, izin ve tatil payıyla.";
    });
    var model = ["Vardiyalı "+(deger("yetki")==="silahli"?"silahlı":"silahsız")+" özel güvenlik", "RDN dijital nöbet: NFC devriye ve olay tutanağı", "Aylık hizmet raporu ve hesap yöneticisi"];
    ekler.forEach(function(e){ model.push(e); });
    var ml = document.getElementById("modelListe"); if (ml) ml.innerHTML = model.map(function(m){return "<li>"+m+"</li>";}).join("");
  }
  function goster(i){
    cur = Math.max(0, Math.min(N-1, i));
    adimlar.forEach(function(a, j){ a.classList.toggle("aktif", j===cur); });
    var bar = document.getElementById("ilerleme"); bar.innerHTML = "";
    for (var j=0;j<N-1;j++){ var s=document.createElement("span"); if (j<=cur) s.className="dolu"; bar.appendChild(s); }
    document.getElementById("ilerlemeYazi").textContent = cur < N-1 ? "Adım "+(cur+1)+" / "+(N-1)+": "+adimlar[cur].getAttribute("data-ad") : "Talebiniz alındı";
    document.getElementById("geriDug").style.visibility = (cur===0 || cur===N-1) ? "hidden" : "visible";
    var il = document.getElementById("ileriDug");
    il.style.display = cur===N-1 ? "none" : "";
    il.textContent = cur===N-3 ? "İletişim bilgilerine geç" : (cur===N-2 ? "Talebi gönder" : "Devam et");
    document.getElementById("sihAlt").style.display = cur===N-1 ? "none" : "";
    hesapla();
  }
  sih.addEventListener("change", hesapla); sih.addEventListener("input", hesapla);
  document.getElementById("ileriDug").addEventListener("click", function(){
    if (cur===N-2){
      var f = document.getElementById("iletisimForm");
      if (!f.reportValidity()) return;
      document.getElementById("talepNo").textContent = no("RS");
    }
    goster(cur+1); if (window.innerWidth<1000) sih.scrollIntoView({block:"start"});
  });
  document.getElementById("geriDug").addEventListener("click", function(){ goster(cur-1); });
  document.querySelectorAll("[data-sayac]").forEach(function(b){
    b.addEventListener("click", function(){ var o=document.getElementById("noktaSay"); var v=Math.max(1,Math.min(20,+o.value+(+b.getAttribute("data-sayac")))); o.value=v; document.getElementById("noktaCikti").textContent=v; hesapla(); });
  });
  var t = Q.get("tesis"); if (t){ var r = sih.querySelector('[name="tesis"][value="'+t+'"]'); if (r) r.checked = true; }
  var a = +Q.get("adim");
  if (a){ var f1 = sih.querySelector('[name="tesis"][value="fabrika"]'); if (!t && f1) f1.checked = true; document.getElementById("il").value="Kocaeli"; document.getElementById("ilce").value="Gebze"; }
  if (a >= 4){ var n = document.getElementById("noktaSay"); n.value = 3; document.getElementById("noktaCikti").textContent = 3; var k9 = sih.querySelector('[name="ek"][value="kamera"]'); if (k9) k9.checked = true; }
  goster(a ? a-1 : 0);
}

/* ---------- kariyer: pozisyon seç ---------- */
document.querySelectorAll("[data-pozisyon]").forEach(function(b){
  b.addEventListener("click", function(){ var s = document.getElementById("pozisyon"); if (s) s.value = b.getAttribute("data-pozisyon"); });
});
document.querySelectorAll("form[data-gonder]").forEach(function(f){
  f.addEventListener("submit", function(e){
    e.preventDefault();
    var c = f.parentNode.querySelector("[data-sonuc]");
    if (c){ c.hidden = false; var n = c.querySelector(".veri"); if (n) n.textContent = no(f.getAttribute("data-gonder")); f.hidden = true; c.focus(); }
  });
});
document.querySelectorAll("[data-indir]").forEach(function(b){ b.addEventListener("click", function(){ b.textContent = "Önizlemede indirme kapalı"; }); });
var konu = Q.get("konu"); if (konu){ var ks = document.getElementById("konu"); if (ks) ks.value = konu; }

/* ---------- müşteri portalı ---------- */
var kodGonder = document.getElementById("kodGonder");
if (kodGonder){
  kodGonder.addEventListener("click", function(){
    var ep = document.getElementById("girisEposta");
    if (!ep.reportValidity()) return;
    document.getElementById("girisAdim1").hidden = true; document.getElementById("girisAdim2").hidden = false;
    var ilk = document.querySelector(".kod-kutular input"); if (ilk) ilk.focus();
  });
  var kutular = document.querySelectorAll(".kod-kutular input");
  kutular.forEach(function(k, i){
    k.addEventListener("input", function(){ k.value = k.value.replace(/\D/g,"").slice(0,1); if (k.value && kutular[i+1]) kutular[i+1].focus(); });
    k.addEventListener("keydown", function(e){ if (e.key==="Backspace" && !k.value && kutular[i-1]) kutular[i-1].focus(); });
  });
  document.getElementById("girisYap").addEventListener("click", function(){
    document.getElementById("portalBolum").scrollIntoView({behavior: azHareket?"auto":"smooth"});
  });
  document.getElementById("geriEposta").addEventListener("click", function(){ document.getElementById("girisAdim1").hidden = false; document.getElementById("girisAdim2").hidden = true; });
}
var pnav = document.querySelectorAll(".portal-nav [role=tab]");
pnav.forEach(function(b){
  b.addEventListener("click", function(){
    pnav.forEach(function(x){ x.setAttribute("aria-selected","false"); x.tabIndex = -1; });
    b.setAttribute("aria-selected","true"); b.tabIndex = 0;
    document.querySelectorAll(".p-sekme").forEach(function(s){ s.classList.toggle("aktif", s.id===b.getAttribute("aria-controls")); });
  });
});
var ps = Q.get("sekme"); if (ps){ var pb = document.querySelector('.portal-nav [aria-controls="'+ps+'"]'); if (pb) pb.click(); }
function cerceveKaydir(id){ var el = document.getElementById(id); if (!el) return; var git = function(){ window.scrollTo({top: el.getBoundingClientRect().top + window.pageYOffset - 76, behavior: "instant"}); }; [50, 400, 1200, 2500].forEach(function(t){ setTimeout(git, t); }); window.addEventListener("load", git); }
if (Q.get("giris")==="1") cerceveKaydir("portalBolum");
if (Q.get("kaydir")) cerceveKaydir(Q.get("kaydir"));
var talepDlg = document.getElementById("talepDlg");
if (talepDlg){
  document.querySelectorAll("[data-talep-ac]").forEach(function(b){ b.addEventListener("click", function(){ talepDlg.showModal(); }); });
  talepDlg.querySelector("[data-kapat]").addEventListener("click", function(){ talepDlg.close(); });
  talepDlg.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();
    var baslik = document.getElementById("talepKonu").value || "Yeni talep";
    var no2 = "TLP-2026-0"+(413+document.querySelectorAll(".talep-satir").length);
    var row = document.createElement("div"); row.className = "talep-satir";
    row.innerHTML = '<div><strong>'+baslik.replace(/</g,"&lt;")+'</strong><p><span class="veri">#'+no2+'</span>, az önce açıldı</p></div><span class="durum d-bekliyor">Alındı</span>';
    var tl = document.getElementById("talepListe"); tl.insertBefore(row, tl.firstChild);
    talepDlg.close(); e.target.reset();
  });
}
})();

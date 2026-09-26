/**
 * NIVIS - User Interface Controller & State Manager
 * Industrial Field Instrument Controller v2.2
 */

(function () {
  'use strict';

  // Multi-language Text Dictionary
  const I18N = {
    tr: {
      appTitle: "NIVIS",
      subTag: "Kutup Karar Destek",
      fieldMode: "Saha",
      langSwitch: "EN",
      
      // HUD Labels
      hudTdee: "TDEE Hedef",
      hudChill: "Wind Chill",
      hudHydro: "Hidrasyon",

      // Nav Tabs
      navParams: "Parametre",
      navRations: "Rasyon",
      navQR: "Saha QR",
      navLit: "Literatür",

      // Tab 1: Biometrics & Environment
      bioTitle: "Bireysel Biyometri",
      genderLabel: "Cinsiyet",
      male: "Erkek",
      female: "Kadın",
      ageLabel: "Yaş",
      heightLabel: "Boy",
      weightLabel: "Mevcut Kilo",
      waistLabel: "Bel Çevresi",
      actLabel: "Fiziksel Aktivite Düzeyi",

      // Activity Tiers
      tier1Title: "🛋️ I. Sedanter (Masa Başı & Dinlenme)",
      tier1Desc: "İstasyon içi laboratuvar analizi, telsiz nöbeti ve masa başı görevleri.",
      tier2Title: "🚶 II. Hafif Aktivite (İstasyon İçi)",
      tier2Desc: "İstasyon binaları arası intikal, rutin hafif bakım ve gözlem.",
      tier3Title: "🧭 III. Orta Düzey (Saha İntikali)",
      tier3Desc: "Açık buzulda numune toplama, rutin yürüyüş ve ekipman denetimi.",
      tier4Title: "🛷 IV. Çok Aktif (Ağır Yük & Kızak)",
      tier4Desc: "Ağır bilimsel donanım taşıma, manuel kar temizleme ve kızak çekme.",
      tier5Title: "🧗 V. Ekstrem (Buzul Tırmanışı)",
      tier5Desc: "Aşırı dik buzul tırmanışı, derin kar geçişi ve fırtına şartlarında intikal.",

      envTitle: "Kutup Çevresi",
      tempLabel: "Ortam Sıcaklığı",
      windLabel: "Rüzgar Hızı",
      windCalm: "Sakin",
      windStorm: "Fırtına",

      // Dynamic Alerts
      waistNormal: "Bel Çevresi Normal: Düşük kardiyometabolik risk.",
      waistRisk: "Bel Çevresi Artmış Risk (Abdominal Obezite).",
      waistDanger: "Bel Çevresi Çok Yüksek Risk (Kardiyometabolik Eşik).",
      adjWeightAlert: "BKİ kritik eşikte (≥30 veya <18.5). Baysal (2022) formülasyonuyla Düzeltilmiş Ağırlık devreye alındı.",

      // Thermal Vector Gauge
      thermalGaugeTitle: "Termal Isı Kaybı Vektörü",
      thermalConvectionDrop: "Rüzgar Kaybı",

      // Tab 2: Nutrition & Pipeline
      pipelineTitle: "Metabolik Enerji Pipeline'ı",
      pipeBmrTitle: "Adım 1: BMR",
      pipeTdee1Title: "Adım 2: TDEE₁",
      pipeTdee2Title: "Adım 3: TDEE₂",
      pipeTdee3Title: "Adım 4: TDEE₃",

      macroTitle: "Kutup Makrobesin Dağılımı",
      macroSub: "NAS 1996 Standardı",
      carb: "Karbonhidrat",
      protein: "Protein",
      fat: "Yağ",
      rationsTitle: "4 Fazlı Saha Rasyon Planı",

      // Tab 3: QR & Export
      qrTitle: "Saha Personeli QR Kimliği",
      qrSub: "Ekip İçi Veri Köprüsü",
      qrInfo: "Bu QR kod sahadaki araştırmacının metabolik profilini ve çevresel verilerini taşır. İnternetsiz anında aktarılabilir.",
      btnDownloadQr: "QR İndir",
      btnScanCamera: "Kamera ile QR Oku",
      btnUploadQr: "QR Görseli Seç",
      btnCopyReport: "Rapor Kopyala",
      btnPrintReport: "Saha PDF / Yazdır",
      copiedNotice: "Telemetri raporu panoya kopyalandı!",
      qrDownloaded: "QR kod görseli cihazınıza indirildi.",
      qrImportSuccess: "Saha personeli profili başarıyla yüklendi!",
      qrImportError: "Okunan QR formatı NIVIS ile uyumlu değil.",
      scannerTitle: "Saha QR Tarayıcı",
      scannerHint: "Kamerayı diğer personelin NIVIS QR koduna doğrultun:",
      cameraError: "Kamera erişilemiyor veya izin verilmedi.",

      // Tab 4: Literature Full Descriptions
      litTitle: "Bilimsel Metodoloji & Kaynakça",
      litSub: "Hakemli Literatür Kataloğu",
      lit1Desc: "Diyet El Kitabı (13. Baskı). Bel çevresi kardiyovasküler risk eşikleri ve aşırı kilolu/zayıf bireylerde İdeal/Düzeltilmiş Ağırlık formülasyonu.",
      lit2Desc: "Bireysel Bazal Metabolizma Hızı (BMH/BMR) Mifflin-St Jeor denklemi: Sağlıklı bireylerde dinlenme enerji harcaması kestirimi.",
      lit3Desc: "Kutup ve Yüksek İrtifa Koşullarında Beslenme İhtiyaçları. Bölüm 3: Kutup makrobesin dağılım standardı (%48.5 KH, %14.5 Protein, %37.0 Yağ).",
      lit4Desc: "Akut soğuk maruziyeti, insan metabolizması ve kahverengi yağ dokusu termojenezi. Kademeli soğuk çarpanları (+5°C ila -35°C).",
      lit5Desc: "Soğukta egzersiz sırasında rüzgarın termal ve metabolik yanıtlara etkisi. Konvektif rüzgar ısı kaybı ve enerji gereksinimi çarpanları.",
      lit6Desc: "NOAA Rüzgar Soğuğu Sıcaklık İndeksi (Wind Chill Temperature Index) ve donma süresi (frostbite) eşik risk kataloğu."
    },
    en: {
      appTitle: "NIVIS",
      subTag: "Polar Decision Console",
      fieldMode: "Field",
      langSwitch: "TR",

      // HUD Labels
      hudTdee: "TDEE Target",
      hudChill: "Wind Chill",
      hudHydro: "Hydration",

      // Nav Tabs
      navParams: "Params",
      navRations: "Rations",
      navQR: "Field QR",
      navLit: "Literature",

      // Tab 1: Biometrics & Environment
      bioTitle: "Biometric Telemetry",
      genderLabel: "Gender",
      male: "Male",
      female: "Female",
      ageLabel: "Age",
      heightLabel: "Height",
      weightLabel: "Weight",
      waistLabel: "Waist",
      actLabel: "Physical Activity Level",

      // Activity Tiers
      tier1Title: "🛋️ I. Sedentary (Desk & Rest)",
      tier1Desc: "Indoor station laboratory analysis, radio duty and desk tasks.",
      tier2Title: "🚶 II. Light Activity (Base Routine)",
      tier2Desc: "Routine transit between station modules, equipment inspections.",
      tier3Title: "🧭 III. Moderate (Field Traverse)",
      tier3Desc: "Open glacier sampling, standard march and outdoor monitoring.",
      tier4Title: "🛷 IV. Heavy (Gear Haul & Sled)",
      tier4Desc: "Heavy scientific gear transport, manual snow clearing and sled pulling.",
      tier5Title: "🧗 V. Extreme (Glacier Ascent)",
      tier5Desc: "Steep crevasse ascent, deep snow traverse under severe blizzard conditions.",

      envTitle: "Polar Environment",
      tempLabel: "Ambient Temp",
      windLabel: "Wind Speed",
      windCalm: "Calm",
      windStorm: "Storm",

      // Dynamic Alerts
      waistNormal: "Waist Circumference Normal: Low cardiometabolic risk.",
      waistRisk: "Waist Circumference Increased Risk (Abdominal Obesity).",
      waistDanger: "Waist Circumference High Risk (Cardiometabolic Alert).",
      adjWeightAlert: "BMI at critical threshold (≥30 or <18.5). Adjusted Weight applied per Baysal (2022).",

      // Thermal Vector Gauge
      thermalGaugeTitle: "Thermal Loss Vector",
      thermalConvectionDrop: "Wind Drop",

      // Tab 2: Nutrition & Pipeline
      pipelineTitle: "Metabolic Energy Pipeline",
      pipeBmrTitle: "Step 1: BMR",
      pipeTdee1Title: "Step 2: TDEE₁",
      pipeTdee2Title: "Step 3: TDEE₂",
      pipeTdee3Title: "Step 4: TDEE₃",

      macroTitle: "Polar Macronutrient Distribution",
      macroSub: "NAS 1996 Standard",
      carb: "Carbohydrate",
      protein: "Protein",
      fat: "Lipids (Fat)",
      rationsTitle: "4-Phase Expedition Ration Schedule",

      // Tab 3: QR & Export
      qrTitle: "Field Identity QR Matrix",
      qrSub: "Peer Telemetry Transfer",
      qrInfo: "This offline QR matrix encapsulates the researcher's metabolic budget & telemetry for instant team intake.",
      btnDownloadQr: "Download QR",
      btnScanCamera: "Scan via Camera",
      btnUploadQr: "Upload QR File",
      btnCopyReport: "Copy Telemetry",
      btnPrintReport: "Print / Field PDF",
      copiedNotice: "Expedition telemetry copied to clipboard!",
      qrDownloaded: "QR code image downloaded.",
      qrImportSuccess: "Field personnel profile successfully loaded!",
      qrImportError: "Invalid or incompatible QR format.",
      scannerTitle: "Field QR Scanner",
      scannerHint: "Align camera with peer researcher's NIVIS QR code:",
      cameraError: "Camera unavailable or permission denied.",

      // Tab 4: Literature Full Descriptions
      litTitle: "Scientific Methodology & References",
      litSub: "Peer-Reviewed Citation Catalogue",
      lit1Desc: "Diet Hand Book (13th Ed.). Waist circumference cardiometabolic risk thresholds and Adjusted Body Weight formulation for extreme BMI.",
      lit2Desc: "A predictive equation for resting energy expenditure in healthy individuals (Mifflin-St Jeor equation for basal metabolic rate).",
      lit3Desc: "Nutritional Needs in Cold and High-Altitude Environments. Polar macronutrient benchmark (48.5% Carb, 14.5% Protein, 37.0% Lipids).",
      lit4Desc: "Acute cold exposure, brown adipose tissue thermogenesis and metabolic rate elevation. Cold multipliers (+5°C down to -35°C).",
      lit5Desc: "Effects of wind on thermal and metabolic responses to exercise in the cold. Convective wind heat loss & expenditure factors.",
      lit6Desc: "Joint Action Group for Temperature Indices. National Oceanic & Atmospheric Administration (NOAA) Wind Chill & Frostbite Thresholds."
    }
  };

  const STORAGE_KEY = 'nivis_field_state_v2';

  // State
  const state = {
    gender: 'male',
    age: 28,
    height: 178,
    weight: 76,
    waist: 84,
    activity: 1.55,
    temp: -15,
    wind: 4.5,
    lang: 'tr',
    fieldMode: false,
    activeTab: 'tab-params'
  };

  let qrDirty = true;
  let qrDebounceTimer = null;
  let toastTimer = null;
  let audioCtx = null;

  // DOM Elements Cache
  const el = {};

  function initElements() {
    el.toast = document.getElementById('nivisToast');
    el.langBtn = document.getElementById('langToggleBtn');
    el.fieldModeBtn = document.getElementById('fieldModeToggleBtn');
    
    // HUD
    el.hudTdeeVal = document.getElementById('hudTdeeVal');
    el.hudChillVal = document.getElementById('hudChillVal');
    el.hudChillDot = document.getElementById('hudChillDot');
    el.hudHydroVal = document.getElementById('hudHydroVal');

    // Inputs
    el.btnMale = document.getElementById('btnMale');
    el.btnFemale = document.getElementById('btnFemale');
    el.inputAge = document.getElementById('inputAge');
    el.inputHeight = document.getElementById('inputHeight');
    el.inputWeight = document.getElementById('inputWeight');
    el.inputWaist = document.getElementById('inputWaist');
    
    // Activity Matrix Elements
    el.activityMatrix = document.getElementById('activityMatrix');
    el.actTierBtns = document.querySelectorAll('.act-tier-btn');
    el.actMultBadge = document.getElementById('actMultBadge');
    el.actDetailTitle = document.getElementById('actDetailTitle');
    el.actDetailDesc = document.getElementById('actDetailDesc');

    // Environment
    el.inputTemp = document.getElementById('inputTemp');
    el.tempDisplay = document.getElementById('tempDisplay');
    el.quickTempPills = document.getElementById('quickTempPills');

    el.inputWind = document.getElementById('inputWind');
    el.windDisplay = document.getElementById('windDisplay');
    el.quickWindPills = document.getElementById('quickWindPills');

    // Thermal Vector Elements
    el.vectorDelta = document.getElementById('vectorDelta');
    el.gaugeAmbientMarker = document.getElementById('gaugeAmbientMarker');
    el.gaugeAmbientTag = document.getElementById('gaugeAmbientTag');
    el.gaugeChillMarker = document.getElementById('gaugeChillMarker');
    el.gaugeChillTag = document.getElementById('gaugeChillTag');
    el.gaugeConnector = document.getElementById('gaugeConnector');

    // Alerts
    el.waistNotice = document.getElementById('waistNotice');
    el.adjWeightNotice = document.getElementById('adjWeightNotice');
    el.chillRiskBanner = document.getElementById('chillRiskBanner');

    // Pipeline
    el.pipeBmr = document.getElementById('pipeBmr');
    el.pipeTdee1 = document.getElementById('pipeTdee1');
    el.pipeActMult = document.getElementById('pipeActMult');
    el.pipeTdee2 = document.getElementById('pipeTdee2');
    el.pipeColdMult = document.getElementById('pipeColdMult');
    el.pipeTdee3 = document.getElementById('pipeTdee3');
    el.pipeWindMult = document.getElementById('pipeWindMult');

    // Macros & Rations
    el.barCarb = document.getElementById('barCarb');
    el.barProt = document.getElementById('barProt');
    el.barFat = document.getElementById('barFat');
    el.macroCarbGrams = document.getElementById('macroCarbGrams');
    el.macroCarbCals = document.getElementById('macroCarbCals');
    el.macroProtGrams = document.getElementById('macroProtGrams');
    el.macroProtCals = document.getElementById('macroProtCals');
    el.macroFatGrams = document.getElementById('macroFatGrams');
    el.macroFatCals = document.getElementById('macroFatCals');
    el.rationsContainer = document.getElementById('rationsContainer');

    // QR & Actions
    el.qrCodeContainer = document.getElementById('qrCodeContainer');
    el.btnDownloadQr = document.getElementById('btnDownloadQr');
    el.btnScanCamera = document.getElementById('btnScanCamera');
    el.btnUploadQr = document.getElementById('btnUploadQr');
    el.qrFileInput = document.getElementById('qrFileInput');
    el.btnCopyReport = document.getElementById('btnCopyReport');
    el.btnPrintReport = document.getElementById('btnPrintReport');

    // Scanner Modal
    el.scannerModal = document.getElementById('scannerModal');
    el.scannerVideo = document.getElementById('scannerVideo');
    el.closeScannerBtn = document.getElementById('closeScannerBtn');

    // Tabs
    el.tabBtns = document.querySelectorAll('.nav-tab-btn');
    el.tabContents = document.querySelectorAll('.tab-content');
  }

  /**
   * Tactile Sound FX (15ms Micro-Click via Web Audio)
   */
  function playTactileClick() {
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 0.012);
      gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.012);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.012);
    } catch (e) {}
  }

  /**
   * Tactical Toast Mesajı Göster
   */
  function showToast(msg, type = 'info') {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.className = `nivis-toast show ${type}`;
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (el.toast) el.toast.className = 'nivis-toast';
    }, 2400);
  }

  /**
   * LocalStorage'a Kaydet & Yükle
   */
  function saveStateToStorage() {
    try {
      const dataToSave = {
        gender: state.gender,
        age: state.age,
        height: state.height,
        weight: state.weight,
        waist: state.waist,
        activity: state.activity,
        temp: state.temp,
        wind: state.wind,
        lang: state.lang,
        fieldMode: state.fieldMode
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {}
  }

  function loadStateFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed.gender) state.gender = parsed.gender;
          if (parsed.age) state.age = parsed.age;
          if (parsed.height) state.height = parsed.height;
          if (parsed.weight) state.weight = parsed.weight;
          if (parsed.waist) state.waist = parsed.waist;
          if (parsed.activity) state.activity = parsed.activity;
          if (parsed.temp !== undefined) state.temp = parsed.temp;
          if (parsed.wind !== undefined) state.wind = parsed.wind;
          if (parsed.lang) state.lang = parsed.lang;
          if (parsed.fieldMode !== undefined) state.fieldMode = parsed.fieldMode;
        }
      }
    } catch (e) {}
  }

  /**
   * QR Kodunu Debounced Üret
   */
  function scheduleQrRender() {
    qrDirty = true;
    if (state.activeTab === 'tab-qr') {
      if (qrDebounceTimer) clearTimeout(qrDebounceTimer);
      qrDebounceTimer = setTimeout(() => {
        renderCurrentQr();
      }, 150);
    }
  }

  function renderCurrentQr() {
    if (!el.qrCodeContainer || !window.NivisQR) return;
    const qrPayload = {
      app: "NIVIS",
      v: "2.2",
      g: state.gender === 'male' ? 'M' : 'F',
      a: state.age,
      h: state.height,
      w: state.weight,
      wc: state.waist,
      act: state.activity,
      t: state.temp,
      ws: state.wind
    };
    window.NivisQR.renderQr(el.qrCodeContainer, qrPayload, { width: 176, height: 176 });
    qrDirty = false;
  }

  /**
   * Aktivite Detay Açıklamasını Güncelle
   */
  function updateActivityTierDisplay() {
    const t = I18N[state.lang];
    const act = state.activity;
    let title = t.tier3Title;
    let desc = t.tier3Desc;

    if (Math.abs(act - 1.20) < 0.01) {
      title = t.tier1Title; desc = t.tier1Desc;
    } else if (Math.abs(act - 1.375) < 0.01) {
      title = t.tier2Title; desc = t.tier2Desc;
    } else if (Math.abs(act - 1.55) < 0.01) {
      title = t.tier3Title; desc = t.tier3Desc;
    } else if (Math.abs(act - 1.725) < 0.01) {
      title = t.tier4Title; desc = t.tier4Desc;
    } else if (Math.abs(act - 1.90) < 0.01) {
      title = t.tier5Title; desc = t.tier5Desc;
    }

    if (el.actDetailTitle) el.actDetailTitle.textContent = title;
    if (el.actDetailDesc) el.actDetailDesc.textContent = desc;
    if (el.actMultBadge) el.actMultBadge.textContent = `${act.toFixed(3)}×`;

    el.actTierBtns.forEach(btn => {
      const btnAct = parseFloat(btn.getAttribute('data-act'));
      btn.classList.toggle('active', Math.abs(btnAct - act) < 0.01);
    });
  }

  /**
   * Termal Vektör Göstergesini Güncelle (NOAA Spectrum Gauge)
   */
  function updateThermalVector(temp, windChill) {
    if (!el.vectorDelta || !el.gaugeAmbientMarker || !el.gaugeChillMarker) return;

    // Scale from -60°C (0%) to +10°C (100%) -> Total 70°C span
    const minC = -60;
    const maxC = 10;
    const span = maxC - minC;

    const ambientPct = Math.max(3, Math.min(97, ((temp - minC) / span) * 100));
    const chillPct = Math.max(3, Math.min(97, ((windChill - minC) / span) * 100));

    el.gaugeAmbientMarker.style.left = `${ambientPct}%`;
    el.gaugeAmbientTag.textContent = `${temp > 0 ? '+' : ''}${temp}°C`;

    el.gaugeChillMarker.style.left = `${chillPct}%`;
    el.gaugeChillTag.textContent = `${windChill.toFixed(1)}°C`;

    // Connector Line between ambient and chill
    const leftEdge = Math.min(ambientPct, chillPct);
    const width = Math.abs(ambientPct - chillPct);
    el.gaugeConnector.style.left = `${leftEdge}%`;
    el.gaugeConnector.style.width = `${width}%`;

    const drop = windChill - temp;
    const t = I18N[state.lang];
    if (Math.abs(drop) < 0.2) {
      el.vectorDelta.textContent = `0.0°C (${t.windCalm})`;
      el.vectorDelta.style.color = "var(--text-muted)";
    } else {
      el.vectorDelta.textContent = `${drop.toFixed(1)}°C ${t.thermalConvectionDrop}`;
      el.vectorDelta.style.color = "var(--status-warning)";
    }
  }

  /**
   * Hero TDEE Sayı Yuvarlama ve Akıcı Sayaç Animasyonu
   */
  let activeAnimationId = null;
  let currentTdeeDisplay = 0;

  function animateTdee(targetVal) {
    if (!el.hudTdeeVal) return;
    const roundedTarget = Math.round(targetVal);

    if (currentTdeeDisplay === 0) {
      currentTdeeDisplay = roundedTarget;
      el.hudTdeeVal.textContent = roundedTarget.toLocaleString();
      return;
    }

    if (Math.round(currentTdeeDisplay) === roundedTarget) {
      el.hudTdeeVal.textContent = roundedTarget.toLocaleString();
      return;
    }

    if (activeAnimationId) cancelAnimationFrame(activeAnimationId);

    const startVal = currentTdeeDisplay;
    const diff = roundedTarget - startVal;
    const duration = 280; // ms
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      currentTdeeDisplay = startVal + diff * ease;
      el.hudTdeeVal.textContent = Math.round(currentTdeeDisplay).toLocaleString();

      if (progress < 1) {
        activeAnimationId = requestAnimationFrame(step);
      } else {
        currentTdeeDisplay = roundedTarget;
        el.hudTdeeVal.textContent = roundedTarget.toLocaleString();
        activeAnimationId = null;
      }
    }
    activeAnimationId = requestAnimationFrame(step);
  }

  /**
   * Ambient Aurora Canvas (Kutup Işıkları Shimmer Animasyonu)
   */
  function initAuroraCanvas() {
    const canvas = document.getElementById('auroraCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || 170;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener('resize', resize);
    resize();

    let step = 0;
    let isVisible = true;

    document.addEventListener('visibilitychange', () => {
      isVisible = !document.hidden;
    });

    function draw() {
      if (!isVisible) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      step += 0.012;

      // 1. Perde: Kutup Buzulu Camgöbeği (Arctic Cyan Ribbon)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= width; x += 12) {
        const y = Math.sin(x * 0.007 + step) * 26 + Math.cos(x * 0.015 + step * 0.6) * 14 + 50;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, 0);
      ctx.closePath();
      const grad1 = ctx.createLinearGradient(0, 0, width, height);
      grad1.addColorStop(0, 'rgba(14, 165, 233, 0.24)');
      grad1.addColorStop(0.5, 'rgba(56, 189, 248, 0.16)');
      grad1.addColorStop(1, 'rgba(99, 102, 241, 0.06)');
      ctx.fillStyle = grad1;
      ctx.fill();

      // 2. Perde: Zümrüt Aurora Şeridi (Auroral Emerald Glaze)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= width; x += 12) {
        const y = Math.sin(x * 0.009 - step * 0.75) * 28 + Math.cos(x * 0.006 + step * 1.1) * 16 + 60;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width, 0);
      ctx.closePath();
      const grad2 = ctx.createLinearGradient(width, 0, 0, height);
      grad2.addColorStop(0, 'rgba(16, 185, 129, 0.18)');
      grad2.addColorStop(0.6, 'rgba(45, 212, 191, 0.14)');
      grad2.addColorStop(1, 'rgba(14, 165, 233, 0.02)');
      ctx.fillStyle = grad2;
      ctx.fill();

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /**
   * Tam Hesaplama ve Arayüz Güncelleme
   */
  function refreshUI() {
    const t = I18N[state.lang];
    const data = window.NivisEngine.computeAll(state);

    // 1. HUD Updates
    animateTdee(data.pipeline.finalKcal);
    el.hudChillVal.textContent = `${data.environment.windChill.toFixed(1)}°C`;
    el.hudChillDot.style.backgroundColor = data.environment.frostbite.color;
    const fbLevel = data.environment.frostbite.level;
    el.hudChillDot.classList.toggle('pulse', fbLevel === 'severe' || fbLevel === 'extreme' || fbLevel === 'critical');
    el.hudHydroVal.textContent = `${data.nutrition.hydrationLiters.toFixed(1)} L`;

    // 2. Tab 1 Form Controls
    el.btnMale.classList.toggle('active', state.gender === 'male');
    el.btnFemale.classList.toggle('active', state.gender === 'female');
    if (document.activeElement !== el.inputAge) el.inputAge.value = state.age;
    if (document.activeElement !== el.inputHeight) el.inputHeight.value = state.height;
    if (document.activeElement !== el.inputWeight) el.inputWeight.value = state.weight;
    if (document.activeElement !== el.inputWaist) el.inputWaist.value = state.waist;

    updateActivityTierDisplay();

    el.inputTemp.value = state.temp;
    el.tempDisplay.textContent = `${state.temp > 0 ? '+' : ''}${state.temp}°C`;

    el.inputWind.value = state.wind;
    el.windDisplay.textContent = `${state.wind} m/s (${(state.wind * 3.6).toFixed(1)} km/h)`;

    // Update Quick Preset Active States
    document.querySelectorAll('#quickTempPills .preset-pill').forEach(pill => {
      const pVal = parseInt(pill.getAttribute('data-val'));
      pill.classList.toggle('active', pVal === state.temp);
    });
    document.querySelectorAll('#quickWindPills .preset-pill').forEach(pill => {
      const pVal = parseFloat(pill.getAttribute('data-val'));
      pill.classList.toggle('active', Math.abs(pVal - state.wind) < 0.2);
    });

    // Thermal Vector Widget
    updateThermalVector(data.environment.temp, data.environment.windChill);

    // Waist Alert
    const wEval = data.biometrics.waistEval;
    el.waistNotice.className = `notice-box ${wEval.level}`;
    el.waistNotice.innerHTML = `<div><strong>${state.lang === 'tr' ? wEval.labelTr : wEval.labelEn}:</strong> ${state.lang === 'tr' ? (wEval.level === 'normal' ? t.waistNormal : (wEval.level === 'danger' ? t.waistDanger : t.waistRisk)) : (wEval.level === 'normal' ? t.waistNormal : (wEval.level === 'danger' ? t.waistDanger : t.waistRisk))}</div>`;

    // Adjusted Weight Notice
    if (data.biometrics.isAdjusted) {
      el.adjWeightNotice.style.display = 'flex';
      el.adjWeightNotice.innerHTML = `<div>${t.adjWeightAlert} (BKİ: ${data.biometrics.bmi.toFixed(1)}, İdeal: ${data.biometrics.idealWeight.toFixed(1)} kg, Kullanılan: ${data.biometrics.usedWeight.toFixed(1)} kg)</div>`;
    } else {
      el.adjWeightNotice.style.display = 'none';
    }

    // Chill Banner
    const fb = data.environment.frostbite;
    el.chillRiskBanner.className = `notice-box ${fb.level === 'low' || fb.level === 'mild' ? 'info' : (fb.level === 'moderate' ? 'warning' : 'danger')}`;
    el.chillRiskBanner.innerHTML = `<div><strong>${state.lang === 'tr' ? fb.timeTr : fb.timeEn}</strong> — ${state.lang === 'tr' ? fb.descTr : fb.descEn}</div>`;

    // 3. Tab 2 Pipeline Card Updates
    if (el.pipeBmr) {
      el.pipeBmr.textContent = `${Math.round(data.pipeline.bmr)} kcal`;
      el.pipeTdee1.textContent = `${Math.round(data.pipeline.tdee1)} kcal`;
      el.pipeActMult.textContent = `${state.lang === 'tr' ? 'Aktivite' : 'Activity'} ×${data.pipeline.activityMultiplier.toFixed(3)}`;
      el.pipeTdee2.textContent = `${Math.round(data.pipeline.tdee2)} kcal`;
      el.pipeColdMult.textContent = `${state.lang === 'tr' ? 'Soğuk' : 'Cold'} ×${data.pipeline.coldMultiplier.toFixed(2)}`;
      el.pipeTdee3.textContent = `${Math.round(data.pipeline.tdee3)} kcal`;
      el.pipeWindMult.textContent = `${state.lang === 'tr' ? 'Rüzgar' : 'Wind'} ×${data.pipeline.windMultiplier.toFixed(2)}`;
    }

    // Macros
    const macros = data.nutrition.macros;
    el.barCarb.style.width = `${macros.carb.pct}%`;
    el.barProt.style.width = `${macros.protein.pct}%`;
    el.barFat.style.width = `${macros.fat.pct}%`;

    el.macroCarbGrams.textContent = `${Math.round(macros.carb.grams)}g`;
    el.macroCarbCals.textContent = `${Math.round(macros.carb.kcal)} kcal (${macros.carb.pct}%)`;

    el.macroProtGrams.textContent = `${Math.round(macros.protein.grams)}g`;
    el.macroProtCals.textContent = `${Math.round(macros.protein.kcal)} kcal (${macros.protein.pct}%)`;

    el.macroFatGrams.textContent = `${Math.round(macros.fat.grams)}g`;
    el.macroFatCals.textContent = `${Math.round(macros.fat.kcal)} kcal (${macros.fat.pct}%)`;

    // Rations List Render
    const rationIcons = ['🍳', '🎿', '🍫', '🍲'];
    el.rationsContainer.innerHTML = '';
    data.nutrition.rations.forEach((r, idx) => {
      const item = document.createElement('div');
      item.className = 'ration-item';
      const icon = rationIcons[idx] || '🍱';
      item.innerHTML = `
        <div class="ration-header">
          <span class="ration-name">${icon} ${state.lang === 'tr' ? r.nameTr : r.nameEn}</span>
          <div>
            <span class="ration-badge">%${r.pct}</span>
            <span class="ration-kcal tabular">${Math.round(r.kcal)} kcal</span>
          </div>
        </div>
        <div class="ration-desc">${state.lang === 'tr' ? r.descTr : r.descEn}</div>
      `;
      el.rationsContainer.appendChild(item);
    });

    // 4. QR and Storage Schedule
    scheduleQrRender();
    saveStateToStorage();
  }

  /**
   * Dil Çevirilerini DOM'a Uygula
   */
  function applyLanguage() {
    const t = I18N[state.lang];
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      if (t[key]) {
        node.textContent = t[key];
      }
    });
    el.langBtn.textContent = t.langSwitch;
    refreshUI();
  }

  /**
   * Tab Değiştirme
   */
  function switchTab(tabId) {
    playTactileClick();
    state.activeTab = tabId;
    el.tabContents.forEach(c => c.classList.toggle('active', c.id === tabId));
    el.tabBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === tabId));
    window.scrollTo({ top: 0, behavior: 'instant' });

    if (tabId === 'tab-qr' && qrDirty) {
      renderCurrentQr();
    }
  }

  /**
   * Olay Dinleyicileri (Event Listeners)
   */
  function setupEvents() {
    // Dil Değiştir
    el.langBtn.addEventListener('click', () => {
      playTactileClick();
      state.lang = state.lang === 'tr' ? 'en' : 'tr';
      applyLanguage();
    });

    // Saha / Eldiven Modu
    el.fieldModeBtn.addEventListener('click', () => {
      playTactileClick();
      state.fieldMode = !state.fieldMode;
      document.body.classList.toggle('field-mode', state.fieldMode);
      el.fieldModeBtn.classList.toggle('active', state.fieldMode);
      saveStateToStorage();
    });

    // Navigasyon Tabları
    el.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switchTab(tab);
      });
    });

    // Cinsiyet
    el.btnMale.addEventListener('click', () => {
      playTactileClick();
      state.gender = 'male';
      refreshUI();
    });
    el.btnFemale.addEventListener('click', () => {
      playTactileClick();
      state.gender = 'female';
      refreshUI();
    });

    // Stepper Butonları (+ / -)
    document.querySelectorAll('.stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        playTactileClick();
        const targetId = btn.getAttribute('data-for');
        const step = parseFloat(btn.getAttribute('data-step')) || 1;
        const input = document.getElementById(targetId);
        if (!input) return;

        let val = parseFloat(input.value) || 0;
        val += step;
        
        const min = parseFloat(input.getAttribute('min')) || 0;
        const max = parseFloat(input.getAttribute('max')) || 999;
        val = Math.max(min, Math.min(max, val));
        
        const isDecimal = Math.abs(step) % 1 !== 0;
        input.value = isDecimal ? val.toFixed(1) : Math.round(val);
        input.dispatchEvent(new Event('input'));
      });
    });

    // Doğrudan Input Girişleri & Blur Clamp
    const setupNumericInput = (inputEl, minVal, maxVal, stateKey, isFloat = false) => {
      inputEl.addEventListener('input', (e) => {
        const parsed = isFloat ? parseFloat(e.target.value) : parseInt(e.target.value);
        if (!isNaN(parsed)) {
          state[stateKey] = Math.max(minVal, Math.min(maxVal, parsed));
          refreshUI();
        }
      });
      inputEl.addEventListener('blur', () => {
        inputEl.value = isFloat ? state[stateKey].toFixed(1) : Math.round(state[stateKey]);
      });
    };

    setupNumericInput(el.inputAge, 10, 99, 'age', false);
    setupNumericInput(el.inputHeight, 100, 230, 'height', false);
    setupNumericInput(el.inputWeight, 30, 250, 'weight', true);
    setupNumericInput(el.inputWaist, 40, 180, 'waist', false);

    // Activity Matrix Tiers Click
    el.actTierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        playTactileClick();
        const actVal = parseFloat(btn.getAttribute('data-act'));
        if (!isNaN(actVal)) {
          state.activity = actVal;
          refreshUI();
        }
      });
    });

    // Sıcaklık Slider & Presets
    el.inputTemp.addEventListener('input', (e) => {
      state.temp = parseInt(e.target.value);
      refreshUI();
    });
    el.quickTempPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.preset-pill');
      if (pill) {
        playTactileClick();
        state.temp = parseInt(pill.getAttribute('data-val'));
        refreshUI();
      }
    });

    // Rüzgar Slider & Presets
    el.inputWind.addEventListener('input', (e) => {
      state.wind = parseFloat(e.target.value);
      refreshUI();
    });
    el.quickWindPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.preset-pill');
      if (pill) {
        playTactileClick();
        state.wind = parseFloat(pill.getAttribute('data-val'));
        refreshUI();
      }
    });

    // QR İndir
    el.btnDownloadQr.addEventListener('click', () => {
      playTactileClick();
      const canvas = el.qrCodeContainer.querySelector('canvas');
      const img = el.qrCodeContainer.querySelector('img');
      const link = document.createElement('a');
      link.download = `NIVIS-PROFILE-${Date.now()}.png`;
      if (canvas) {
        link.href = canvas.toDataURL('image/png');
      } else if (img && img.src) {
        link.href = img.src;
      } else {
        return;
      }
      link.click();
      showToast(I18N[state.lang].qrDownloaded, 'info');
    });

    // Rapor Kopyala
    el.btnCopyReport.addEventListener('click', () => {
      playTactileClick();
      const data = window.NivisEngine.computeAll(state);
      const text = window.NivisQR.generateReportText(data, state.lang);
      navigator.clipboard.writeText(text).then(() => {
        showToast(I18N[state.lang].copiedNotice, 'success');
      }).catch(() => {
        showToast("Pano erişim hatası.", 'danger');
      });
    });

    // Yazdır / PDF
    el.btnPrintReport.addEventListener('click', () => {
      playTactileClick();
      window.print();
    });

    // Kamera ile QR Tarayıcı Modal
    el.btnScanCamera.addEventListener('click', () => {
      playTactileClick();
      el.scannerModal.classList.add('active');
      window.NivisQR.startScanner(el.scannerVideo, (qrString) => {
        handleImportedQrData(qrString);
      }, (err) => {
        showToast(err, 'danger');
      });
    });

    el.closeScannerBtn.addEventListener('click', () => {
      playTactileClick();
      el.scannerModal.classList.remove('active');
      window.NivisQR.stopScanner();
    });

    // Modal Arka Planına Tıklayınca Kapat
    el.scannerModal.addEventListener('click', (e) => {
      if (e.target === el.scannerModal) {
        playTactileClick();
        el.scannerModal.classList.remove('active');
        window.NivisQR.stopScanner();
      }
    });

    // QR Görseli Yükle
    el.btnUploadQr.addEventListener('click', () => {
      playTactileClick();
      el.qrFileInput.click();
    });
    el.qrFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        window.NivisQR.scanFromImage(file, (qrString) => {
          handleImportedQrData(qrString);
        }, (err) => {
          showToast(err, 'danger');
        });
      }
    });
  }

  /**
   * Dışarıdan Alınan QR Verisini State'e Yükle
   */
  function handleImportedQrData(qrString) {
    try {
      const parsed = JSON.parse(qrString);
      if (parsed && (parsed.app === 'NIVIS' || parsed.app === 'KUTUPRO')) {
        state.gender = parsed.g === 'F' ? 'female' : 'male';
        state.age = Math.max(10, Math.min(99, parsed.a || 28));
        state.height = Math.max(100, Math.min(230, parsed.h || 178));
        state.weight = Math.max(30, Math.min(250, parsed.w || 76));
        state.waist = Math.max(40, Math.min(180, parsed.wc || 84));
        state.activity = parsed.act || 1.55;
        state.temp = parsed.t !== undefined ? parsed.t : -15;
        state.wind = parsed.ws !== undefined ? parsed.ws : 4.5;

        el.scannerModal.classList.remove('active');
        window.NivisQR.stopScanner();
        refreshUI();
        switchTab('tab-params');
        showToast(I18N[state.lang].qrImportSuccess, 'success');
      } else {
        showToast(I18N[state.lang].qrImportError, 'danger');
      }
    } catch (e) {
      showToast(I18N[state.lang].qrImportError, 'danger');
    }
  }

  // Safe Service Worker Registration
  function registerServiceWorker() {
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('SW registration warning:', err);
      });
    }
  }

  // App Initialize
  window.addEventListener('DOMContentLoaded', () => {
    initElements();
    initAuroraCanvas();
    loadStateFromStorage();
    if (state.fieldMode) {
      document.body.classList.add('field-mode');
      if (el.fieldModeBtn) el.fieldModeBtn.classList.add('active');
    }
    setupEvents();
    applyLanguage();
    registerServiceWorker();
  });
})();

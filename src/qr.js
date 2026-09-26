/**
 * NIVIS - QR Code & Expedition Data Transfer Bridge
 * Yerel QR kod üretimi, kamera taraması ve telemetri aktarımı.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NivisQR = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let activeStream = null;
  let scanInterval = null;

  /**
   * Saha Personeli QR Kodu Üret
   */
  function renderQr(containerEl, payload, options = {}) {
    if (!containerEl || !window.QRCode) return;

    containerEl.innerHTML = '';
    const textData = typeof payload === 'string' ? payload : JSON.stringify(payload);

    try {
      new window.QRCode(containerEl, {
        text: textData,
        width: options.width || 180,
        height: options.height || 180,
        colorDark: options.colorDark || '#090B10',
        colorLight: options.colorLight || '#FFFFFF',
        correctLevel: window.QRCode.CorrectLevel.M
      });
    } catch (e) {
      console.error('NIVIS QR render hatası:', e);
    }
  }

  /**
   * Kamera ile QR Tarayıcıyı Başlat
   */
  function startScanner(videoEl, onResult, onError) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (onError) onError('Kamera erişimi tarayıcı tarafından desteklenmiyor.');
      return;
    }

    stopScanner();

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } }
    }).then((stream) => {
      activeStream = stream;
      videoEl.srcObject = stream;
      videoEl.setAttribute('playsinline', 'true');
      videoEl.play();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      scanInterval = setInterval(() => {
        if (videoEl.readyState === videoEl.HAVE_ENOUGH_DATA && window.jsQR) {
          if (canvas.width !== videoEl.videoWidth || canvas.height !== videoEl.videoHeight) {
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;
          }
          ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = window.jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            stopScanner();
            onResult(code.data);
          }
        }
      }, 200);
    }).catch((err) => {
      console.error('Kamera başlatma hatası:', err);
      if (onError) onError('Kamera açılamadı. İzinleri kontrol edin veya QR görseli yükleyin.');
    });
  }

  /**
   * Kamerayı Durdur
   */
  function stopScanner() {
    if (scanInterval) {
      clearInterval(scanInterval);
      scanInterval = null;
    }
    if (activeStream) {
      activeStream.getTracks().forEach((track) => track.stop());
      activeStream = null;
    }
  }

  /**
   * QR Görsel Dosyasından Veri Oku
   */
  function scanFromImage(file, onResult, onError) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        if (window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            onResult(code.data);
          } else {
            if (onError) onError('Görselde geçerli bir NIVIS QR kodu tespit edilemedi.');
          }
        } else {
          if (onError) onError('QR kütüphanesi yüklenemedi.');
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Telemetri Metin Raporu Oluştur (Pano & Paylaşım)
   */
  function generateReportText(data, lang = 'tr') {
    const isTr = lang === 'tr';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return `[NIVIS POLAR EXPEDITION REPORT]
Timestamp: ${now}
System: NIVIS Field Decision Engine v2.0
Methodology: Mifflin-St Jeor / Baysal (2022) / NAS (1996) / NOAA

-- ${isTr ? 'BİYOMETRİK VERİ' : 'BIOMETRIC TELEMETRY'} --
${isTr ? 'Cinsiyet' : 'Gender'}: ${data.input.gender === 'male' ? (isTr ? 'Erkek' : 'Male') : (isTr ? 'Kadın' : 'Female')}
${isTr ? 'Yaş' : 'Age'}: ${data.input.age} | ${isTr ? 'Boy' : 'Height'}: ${data.input.height} cm | ${isTr ? 'Kilo' : 'Weight'}: ${data.input.weight} kg
${isTr ? 'Bel Çevresi' : 'Waist'}: ${data.input.waist} cm (${isTr ? data.biometrics.waistEval.labelTr : data.biometrics.waistEval.labelEn})
${isTr ? 'BKİ (BMI)' : 'BMI'}: ${data.biometrics.bmi.toFixed(1)} | ${isTr ? 'İdeal Ağırlık' : 'Ideal Wt'}: ${data.biometrics.idealWeight.toFixed(1)} kg | ${isTr ? 'Kullanılan' : 'Effective Wt'}: ${data.biometrics.usedWeight.toFixed(1)} kg
${isTr ? 'Aktivite Çarpanı' : 'Activity Factor'}: ×${data.pipeline.activityMultiplier}

-- ${isTr ? 'KUTUP ÇEVRESEL KOŞULLARI' : 'ENVIRONMENTAL METRICS'} --
${isTr ? 'Ortam Sıcaklığı' : 'Ambient Temp'}: ${data.environment.temp} °C (Soğuk Katsayısı: ×${data.pipeline.coldMultiplier})
${isTr ? 'Rüzgar Hızı' : 'Wind Speed'}: ${data.environment.wind} m/s (${(data.environment.wind * 3.6).toFixed(1)} km/h, Rüzgar Katsayısı: ×${data.pipeline.windMultiplier})
${isTr ? 'NOAA Hissedilen Soğukluk (Wind Chill)' : 'NOAA Wind Chill'}: ${data.environment.windChill.toFixed(1)} °C
${isTr ? 'Donma Riski Eşiği' : 'Frostbite Hazard'}: ${isTr ? data.environment.frostbite.timeTr : data.environment.frostbite.timeEn}

-- ${isTr ? 'ENERJİ & MAKRO DAĞILIMI' : 'METABOLIC & MACRONUTRIENT BUDGET'} --
BMR (${isTr ? 'Bazal' : 'Basal'}): ${Math.round(data.pipeline.bmr)} kcal
NİHAİ TDEE: ${data.pipeline.finalKcal} kcal/gün (${isTr ? 'Günlük Hedef' : 'Daily Target'})
- Karbonhidrat (%48.5): ${Math.round(data.nutrition.macros.carb.grams)}g (${Math.round(data.nutrition.macros.carb.kcal)} kcal)
- Protein (%14.5): ${Math.round(data.nutrition.macros.protein.grams)}g (${Math.round(data.nutrition.macros.protein.kcal)} kcal)
- Yağ (%37.0): ${Math.round(data.nutrition.macros.fat.grams)}g (${Math.round(data.nutrition.macros.fat.kcal)} kcal)
${isTr ? 'Önerilen Elektrolitli Sıvı' : 'Hydration Target'}: ~${data.nutrition.hydrationLiters.toFixed(1)} L/gün

-- ${isTr ? '4 ÖĞÜN SAHA RASYONU' : 'EXPEDITION RATION SCHEDULE'} --
1. Kahvaltı (%25): ${Math.round(data.nutrition.rations[0].kcal)} kcal
2. Saha İntikali (%35 - Pemmican/Yağ): ${Math.round(data.nutrition.rations[1].kcal)} kcal
3. Akşam Yemeği (%30 - Liyofilize): ${Math.round(data.nutrition.rations[2].kcal)} kcal
4. Gece Termojenezi (%10 - Shivering Önleyici): ${Math.round(data.nutrition.rations[3].kcal)} kcal
`;
  }

  return {
    renderQr,
    startScanner,
    stopScanner,
    scanFromImage,
    generateReportText
  };
}));

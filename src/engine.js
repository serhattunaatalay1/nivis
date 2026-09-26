/**
 * NIVIS - Polar Field Telemetry & Metabolic Engine
 * Bilimsel Metodoloji & Formülasyon Çekirdeği
 * 
 * Standartlar & Literatür:
 * - Mifflin, M. D., St Jeor, S. T., et al. (1990) -> BMR (Bazal Metabolizma Hızı)
 * - Baysal, A. (2022) -> Düzeltilmiş Vücut Ağırlığı ve Bel Çevresi Kardiyometabolik Eşikleri
 * - van Ooijen et al. (2001), Huo et al. (2022) -> Soğuk Termogenez Katsayıları
 * - Haymes et al. (1982) -> Konvektif Rüzgar Isı Kaybı Katsayıları
 * - National Academies of Sciences (1996) -> Kutup Koşulları Makrobesin Oranları
 * - NOAA (National Oceanic & Atmospheric Administration) -> Joint Wind Chill & Donma Eşiği
 * 
 * Saf Fonksiyonlar - Sıfır DOM Bağımlılığı - %100 Test Edilebilir
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NivisEngine = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /**
   * Yaşa bağlı ideal BKİ (BMI) katsayısı (Baysal, 2022)
   */
  function getIdealBmi(age) {
    if (age < 19) return 20.0;
    if (age <= 24) return 21.0;
    if (age <= 34) return 22.0;
    if (age <= 44) return 23.0;
    if (age <= 54) return 24.0;
    if (age <= 64) return 25.0;
    return 26.0;
  }

  /**
   * Beden Kitle İndeksi (BKİ)
   */
  function calculateBmi(weightKg, heightCm) {
    if (!heightCm || heightCm <= 0) return 0;
    const hM = heightCm / 100;
    return weightKg / (hM * hM);
  }

  /**
   * İdeal Vücut Ağırlığı (Baysal, 2022)
   */
  function calculateIdealWeight(idealBmi, heightCm) {
    const hM = heightCm / 100;
    return idealBmi * (hM * hM);
  }

  /**
   * Düzeltilmiş Ağırlık (Adjusted Body Weight)
   * BKİ >= 30 veya BKİ < 18.5 olduğunda aşırı/eksik kalori tahminini engeller.
   */
  function calculateAdjustedWeight(actualWeightKg, idealWeightKg) {
    return idealWeightKg + 0.25 * (actualWeightKg - idealWeightKg);
  }

  /**
   * Bel Çevresi Kardiyometabolik Risk Analizi (Baysal, 2022)
   */
  function evaluateWaist(gender, waistCm) {
    const isMale = gender === 'male' || gender === 'M';
    if (isMale) {
      if (waistCm >= 102) {
        return { level: 'danger', threshold: 102, labelTr: 'Çok Yüksek Risk', labelEn: 'Very High Risk' };
      }
      if (waistCm >= 94) {
        return { level: 'warning', threshold: 94, labelTr: 'Artmış Risk', labelEn: 'Increased Risk' };
      }
      return { level: 'normal', threshold: 94, labelTr: 'Normal', labelEn: 'Normal' };
    } else {
      if (waistCm >= 88) {
        return { level: 'danger', threshold: 88, labelTr: 'Çok Yüksek Risk', labelEn: 'Very High Risk' };
      }
      if (waistCm >= 80) {
        return { level: 'warning', threshold: 80, labelTr: 'Artmış Risk', labelEn: 'Increased Risk' };
      }
      return { level: 'normal', threshold: 80, labelTr: 'Normal', labelEn: 'Normal' };
    }
  }

  /**
   * Mifflin-St Jeor (1990) Bazal Metabolizma Hızı (BMR)
   */
  function calculateBmr(gender, weightKg, heightCm, ageYears) {
    const base = (10 * weightKg) + (6.25 * heightCm) - (5 * ageYears);
    const isMale = gender === 'male' || gender === 'M';
    return isMale ? base + 5 : base - 161;
  }

  /**
   * Soğuk Termogenez Katsayısı (van Ooijen et al. 2001, Huo et al. 2022)
   */
  function getColdMultiplier(tempC) {
    if (tempC > 10) return 1.00;
    if (tempC >= 5) return 1.03;
    if (tempC >= 0) return 1.05;
    if (tempC >= -10) return 1.08;
    if (tempC >= -20) return 1.12;
    return 1.15; // -20°C ve altı aşırı soğuk
  }

  /**
   * Konvektif Rüzgar Isı Kaybı Katsayısı (Haymes et al. 1982)
   */
  function getWindMultiplier(windSpeedMps) {
    if (windSpeedMps < 1.0) return 1.00;
    if (windSpeedMps <= 3.0) return 1.03;
    if (windSpeedMps <= 6.0) return 1.07;
    return 1.12; // >6 m/s fırtına / yüksek konveksiyon
  }

  /**
   * NOAA Joint Wind Chill Eşdeğeri Sıcaklık (°C)
   * Twc = 13.12 + 0.6215*T - 11.37*(V^0.16) + 0.3965*T*(V^0.16)
   * Şart: T <= 10°C ve Rüzgar >= 4.8 km/h (~1.33 m/s)
   */
  function calculateWindChill(tempC, windSpeedMps) {
    const vKmh = windSpeedMps * 3.6;
    if (tempC <= 10 && vKmh >= 4.8) {
      const vPow = Math.pow(vKmh, 0.16);
      return 13.12 + (0.6215 * tempC) - (11.37 * vPow) + (0.3965 * tempC * vPow);
    }
    return tempC;
  }

  /**
   * Donma (Frostbite) ve Hipotermi Riski Eşik Değerlendirmesi
   */
  function getFrostbiteRisk(windChillC) {
    if (windChillC > 0) {
      return {
        level: 'low',
        color: '#94A3B8',
        timeTr: 'Donma riski yok',
        timeEn: 'No frostbite hazard',
        descTr: 'İstasyon içi veya stabil serin hava.',
        descEn: 'Station interior or mild polar comfort.'
      };
    }
    if (windChillC >= -10) {
      return {
        level: 'mild',
        color: '#38BDF8',
        timeTr: 'Standart saha riski',
        timeEn: 'Standard field caution',
        descTr: 'Termal katman, rüzgarlık, bere ve eldiven zorunlu.',
        descEn: 'Thermal layer, windshell, beanie and gloves mandatory.'
      };
    }
    if (windChillC >= -27) {
      return {
        level: 'moderate',
        color: '#F59E0B',
        timeTr: 'Açık deri koruması şart',
        timeEn: 'Cover all exposed skin',
        descTr: 'Hipotermi tehlikesi. Yüz koruması ve rüzgar geçirmez kabuk.',
        descEn: 'Hypothermia danger. Balaclava & windproof barrier.'
      };
    }
    if (windChillC >= -40) {
      return {
        level: 'severe',
        color: '#F97316',
        timeTr: '~30 dakika içinde donma',
        timeEn: 'Frostbite in ~30 minutes',
        descTr: 'Açık kalan deri 30 dk içinde donabilir. Saha süresini kısıtla.',
        descEn: 'Exposed flesh can freeze in 30 min. Restrict traverse time.'
      };
    }
    if (windChillC >= -55) {
      return {
        level: 'extreme',
        color: '#EF4444',
        timeTr: '~10 dakika içinde donma!',
        timeEn: 'Frostbite in ~10 minutes!',
        descTr: 'Aşırı tehlike! Polar gözlük ve tam yüz maskesi mecburi.',
        descEn: 'Severe hazard! Polar goggles & full face protection required.'
      };
    }
    return {
      level: 'critical',
      color: '#DC2626',
      timeTr: '2 - 5 dakika içinde donma!',
      timeEn: 'Frostbite in 2 - 5 minutes!',
      descTr: 'EKSTREM KUTUP ACİL DURUMU! Derhal sığınağa intikal ediniz!',
      descEn: 'CRITICAL HAZARD! Immediate shelter required!'
    };
  }

  /**
   * NAS 1996 Kutup Makrobesin Dağılımı
   * %48.5 Karbonhidrat (4 kcal/g)
   * %14.5 Protein (4 kcal/g)
   * %37.0 Yağ (9 kcal/g)
   */
  function calculateMacronutrients(totalKcal) {
    const carbKcal = totalKcal * 0.485;
    const carbGrams = carbKcal / 4;

    const protKcal = totalKcal * 0.145;
    const protGrams = protKcal / 4;

    const fatKcal = totalKcal * 0.370;
    const fatGrams = fatKcal / 9;

    return {
      carb: { pct: 48.5, kcal: carbKcal, grams: carbGrams },
      protein: { pct: 14.5, kcal: protKcal, grams: protGrams },
      fat: { pct: 37.0, kcal: fatKcal, grams: fatGrams }
    };
  }

  /**
   * 4 Fazlı Taktik Saha Rasyon Dağılımı
   * 1. Kahvaltı: %25
   * 2. İntikal Rasyonu: %35 (Donmayan yüksek yağ ve kuruyemiş/pemmican)
   * 3. Kamp Akşam Yemeği: %30 (Doku onarımı & liyofilize sıcak öğün)
   * 4. Gece Termojenezi: %10 (Uykuda shivering/ısı kaybını önleyici yağlı sıcak içecek)
   */
  function calculateRations(totalKcal) {
    return [
      {
        id: 'breakfast',
        nameTr: 'Kahvaltı (Ana Kamp)',
        nameEn: 'Breakfast (Main Base)',
        pct: 25,
        kcal: totalKcal * 0.25,
        descTr: 'Yulaf, bal, fıstık ezmesi, kurutulmuş meyve, termal çay',
        descEn: 'Oats, honey, peanut butter, dried berries, thermal tea'
      },
      {
        id: 'traverse',
        nameTr: 'Saha İntikal Rasyonu',
        nameEn: 'Traverse Action Ration',
        pct: 35,
        kcal: totalKcal * 0.35,
        descTr: 'Donmayan yüksek yağlı barlar, pemmican, bitter çikolata, kuruyemiş',
        descEn: 'Non-freezing lipid bars, pemmican, dark chocolate, nuts'
      },
      {
        id: 'dinner',
        nameTr: 'Akşam Kamp Yemeği',
        nameEn: 'Evening Camp Meal',
        pct: 30,
        kcal: totalKcal * 0.30,
        descTr: 'Liyofilize etli karbonhidrat, tereyağlı sebze çorbası, peynir',
        descEn: 'Freeze-dried meat & carbs, buttered vegetable broth, cheese'
      },
      {
        id: 'nocturnal',
        nameTr: 'Gece Termojenik Rasyon',
        nameEn: 'Nocturnal Thermic Snack',
        pct: 10,
        kcal: totalKcal * 0.10,
        descTr: 'Uykuda titremeyi önleyici sıcak yağlı kakao veya süt tozu içeceği',
        descEn: 'Hot lipid-rich cocoa / fortified milk to avoid nocturnal shivering'
      }
    ];
  }

  /**
   * Kutup Koşullarında Günlük Hidrasyon İhtiyacı (Litre)
   * Kuru hava ve hiperventilasyon nedeniyle bazal 3.5 L + enerji harcamasına bağlı ek sıvı
   */
  function calculateHydration(totalKcal) {
    // 2500 kcal için ~3.5L, her ilave 1000 kcal için ~0.35L
    const liters = 3.5 + Math.max(0, (totalKcal - 2500) / 1000) * 0.35;
    return Math.min(6.0, Math.max(3.5, liters));
  }

  /**
   * Girdi Doğrulama ve Sınır Koruması
   */
  function sanitizeInput(raw) {
    const input = raw || {};
    const gender = (input.gender === 'female' || input.gender === 'F') ? 'female' : 'male';
    const age = Math.max(10, Math.min(100, Number(input.age) || 28));
    const height = Math.max(100, Math.min(240, Number(input.height) || 178));
    const weight = Math.max(30, Math.min(250, Number(input.weight) || 76));
    const waist = Math.max(40, Math.min(180, Number(input.waist) || 84));
    const activity = Math.max(1.0, Math.min(2.5, Number(input.activity) || 1.55));
    const temp = Math.max(-60, Math.min(25, (input.temp !== undefined && !isNaN(Number(input.temp))) ? Number(input.temp) : -15));
    const wind = Math.max(0, Math.min(50, (input.wind !== undefined && !isNaN(Number(input.wind))) ? Number(input.wind) : 4.5));
    return { gender, age, height, weight, waist, activity, temp, wind };
  }

  /**
   * Tüm Pipeline'ı Koşturan Ana Hesaplayıcı
   */
  function computeAll(rawInput) {
    const input = sanitizeInput(rawInput);
    const { gender, age, height, weight, waist, activity, temp, wind } = input;

    // 1. Biyometri
    const bmi = calculateBmi(weight, height);
    const idealBmi = getIdealBmi(age);
    const idealWeight = calculateIdealWeight(idealBmi, height);

    let usedWeight = weight;
    let isAdjusted = false;

    if (bmi >= 30.0 || bmi < 18.5) {
      usedWeight = calculateAdjustedWeight(weight, idealWeight);
      isAdjusted = true;
    }

    const waistEval = evaluateWaist(gender, waist);

    // 2. Enerji Aşamaları
    const bmr = calculateBmr(gender, usedWeight, height, age);
    const tdee1 = bmr * activity;

    const coldMultiplier = getColdMultiplier(temp);
    const tdee2 = tdee1 * coldMultiplier;

    const windMultiplier = getWindMultiplier(wind);
    const tdee3 = tdee2 * windMultiplier; // Nihai Günlük Harcama

    // 3. Çevre & Rüzgar Soğuğu
    const windChill = calculateWindChill(temp, wind);
    const frostbite = getFrostbiteRisk(windChill);

    // 4. Besin & Rasyon Dağılımı
    const macros = calculateMacronutrients(tdee3);
    const rations = calculateRations(tdee3);
    const hydrationLiters = calculateHydration(tdee3);

    return {
      input: { gender, age, height, weight, waist, activity, temp, wind },
      biometrics: {
        bmi,
        idealBmi,
        idealWeight,
        usedWeight,
        isAdjusted,
        waistEval
      },
      pipeline: {
        bmr,
        activityMultiplier: activity,
        tdee1,
        coldMultiplier,
        tdee2,
        windMultiplier,
        tdee3,
        finalKcal: Math.round(tdee3)
      },
      environment: {
        temp,
        wind,
        windChill,
        frostbite
      },
      nutrition: {
        macros,
        rations,
        hydrationLiters
      }
    };
  }

  return {
    getIdealBmi,
    calculateBmi,
    calculateIdealWeight,
    calculateAdjustedWeight,
    evaluateWaist,
    calculateBmr,
    getColdMultiplier,
    getWindMultiplier,
    calculateWindChill,
    getFrostbiteRisk,
    calculateMacronutrients,
    calculateRations,
    calculateHydration,
    computeAll
  };
}));

# NIVIS ❄️
### Polar Field Telemetry & Metabolic Decision Support Console

[![Build Android APK](https://github.com/serhattunaatalay1/nivis/actions/workflows/build-apk.yml/badge.svg)](https://github.com/serhattunaatalay1/nivis/actions/workflows/build-apk.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20PWA%20%7C%20Android%20APK-00F0FF.svg)](#)
[![Zero-Dependency](https://img.shields.io/badge/Architecture-100%25%20Offline%20%26%20Zero--Dependency-10B981.svg)](#)

> **"In extrema frigoris, scientia vita est."**  
> (Aşırı soğukta bilim hayattır.)

**NIVIS**, kutup bölgelerinde (Antarktika TAE / Arktik) görev yapan bilim insanları, kaşifler ve saha personelinin aşırı dondurucu ortam şartlarındaki metabolik enerji tüketimini hesaplayan, 4 aşamalı taktik saha rasyon planı çıkaran ve tamamen çevrimdışı QR entegrasyonuyla saha içi veri aktarımını sağlayan **endüstriyel mobil karar destek enstrümanıdır**.

---

## 📱 Gerçek Native Android APK İndirme & Kurulum

NIVIS, web sitesi sarmalayıcısı olmayan **saf yerel Android APK'sı** (Capacitor Native Engine) olarak paketlenmiştir:

* 📥 **[Doğrudan İndir: NIVIS v2.3.0 Native APK](https://github.com/serhattunaatalay1/nivis/releases/download/v2.3.0/NIVIS-Native.apk)** (Saf yerel Android uygulaması, tarayıcısız, adres çubuğu yok)
* 🏷️ **[Tüm Sürümler & İndirmeler (GitHub Releases)](https://github.com/serhattunaatalay1/nivis/releases)**
* 🌐 **[Canlı Web Sürümü (GitHub Pages)](https://serhattunaatalay1.github.io/nivis/)**

**Telefona Kurulum:**
1. Yukarıdaki linkten `NIVIS-Native.apk` dosyasını telefonunuza indirin.
2. İndirilen dosyaya tıklayın ve kurulumu onaylayın.
3. Uygulama herhangi bir web sitesi veya URL barı olmadan, telefonun kendi işletim sistemi arayüzünde tam ekran çalışır!

---

## 🧭 Temel Enstrüman Özellikleri (Craft Design)

* **Atmosferik Canlı Kutup Işıkları (Aurora Canvas):** Ekranın tepe bandında çalışan prosedürel, hafif akıcı kuzey ışıkları (aurora borealis) şeridi.
* **Akıcı Sayaç Rulosu (`animateTdee`):** Parametreler değiştikçe TDEE hedefi analog bir havacılık göstergesi gibi akarak hedefe ulaşır.
* **Mekanik Aktivite Matrisi (I–V):** Klasik hantal açılır menüler yerine, eldivenle dahi tek dokunuşla seçilebilen LED göstergeli 5 kademeli döner anahtar taklidi.
* **Dinamik Termal Kayıp Vektörü (NOAA Wind Chill Spectrum):** Ortam sıcaklığı ile rüzgar konveksiyonunun yarattığı donma farkını canlı simüle eden ölçek.
* **Eldiven / Saha Modu (🧤 Field Mode):** Büyütülmüş dokunma hedefleri (min 58px) ve artırılmış kontrast.
* **Çevrimdışı QR Telemetri Köprüsü:** İnternet, Bluetooth veya baz istasyonu olmadan, personelin metabolik profilini QR optik tarayıcıyla saniyeler içinde diğer cihaza aktarma.
* **Dokunsal Geri Bildirim (Tactile Audio):** Web Audio API ile sentezlenen 12ms mikro-klik dokunma sesleri.

---

## 🔬 Bilimsel Hesaplama Mimarisi & Hakemli Formüller

1. **Bireysel Bazal Metabolizma Hızı (BMR):**
   * **Mifflin–St Jeor Denklemi (1990):**
     * Erkek: $BMR = (10 \times Kilo) + (6.25 \times Boy) - (5 \times Yaş) + 5$
     * Kadın: $BMR = (10 \times Kilo) + (6.25 \times Boy) - (5 \times Yaş) - 161$

2. **Düzeltilmiş Ağırlık & Bel Çevresi Analizi (Baysal, 2022):**
   * $BMI \ge 30$ veya $BMI < 18.5$ kritik eşiklerinde aşırı kalori tahminini önlemek için Düzeltilmiş Ağırlık devreye girer:
     $$İdeal\ Kilo = İdeal\ BKİ \times (Boy/100)^2$$
     $$Düzeltilmiş\ Kilo = İdeal\ Kilo + 0.25 \times (Mevcut\ Kilo - İdeal\ Kilo)$$

3. **Kademeli TDEE Çarpanları:**
   * **Aktivite Düzeyi:** Sedanter (1.20) – Ekstrem İntikal (1.90) $\rightarrow TDEE_1 = BMR \times Aktivite$
   * **Soğuk Termojenez Katsayısı (van Ooijen et al. 2004, Huo et al. 2017):**
     * $+5^\circ\text{C} = 1.03$, $0^\circ\text{C} = 1.05$, $-10^\circ\text{C} = 1.08$, $-20^\circ\text{C} = 1.12$, $-35^\circ\text{C} = 1.15$
     * $\rightarrow TDEE_2 = TDEE_1 \times Soğuk\ Katsayısı$
   * **Rüzgar Konveksiyon Katsayısı (Haymes et al. 1980):**
     * $0.5\text{ m/s} = 1.00$, $2.5\text{ m/s} = 1.03$, $4.5\text{ m/s} = 1.07$, $>6\text{ m/s} = 1.12$
     * $\rightarrow TDEE_3 = TDEE_2 \times Rüzgar\ Katsayısı$

4. **Kutup Makrobesin Dağılımı (National Academies of Sciences, 1996):**
   * **Karbonhidrat (%48.5):** Glikojen depoları ve dayanıklılık.
   * **Protein (%14.5):** Doku ve kas onarımı.
   * **Yağ (%37.0):** Yüksek yoğunluklu termojenik enerji (titreme ve kahverengi yağ dokusu ısı üretimi).

5. **NOAA Wind Chill & Donma Eşiği (2001):**
   * $T_{wc} = 13.12 + 0.6215 \times T - 11.37 \times V^{0.16} + 0.3965 \times T \times V^{0.16}$
   * Donma süresi (frostbite time) ve hipotermi risk eşikleri.

---

## 🛠️ Yerel Geliştirme & Test

```bash
# Bağımlılıkları yükle
npm install

# Saf matematik motoru birim testlerini koştur (14/14 test)
npm test

# Web varlıklarını derle
npm run build

# Android ile senkronize et
npm run sync
```

---

## 👨‍💻 Yazar & Lisans

* **Tasarım & Bilimsel Modelleme:** Serhat Tuna Atalay
* **Lisans:** [MIT](LICENSE)

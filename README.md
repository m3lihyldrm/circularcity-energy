# CircularCity Energy
> **İkinci Yaşam Bataryalı ve Güneş Destekli Döngüsel Akıllı Kent Mobilyası Platformu**  
> *Konya Pilot Akıllı Şehir Uygulaması*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-21%20passed-emerald.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()
[![Konya Pilot](https://img.shields.io/badge/pilot-Konya%2C%20TR-amber.svg)]()

---

## 📌 Proje Özeti

**CircularCity Energy**, elektrikli araç (EV) kullanım ömrünü tamamlamış ikinci yaşam lityum-iyon batarya modüllerini, durak çatılarındaki monokristal güneş panelleriyle entegre ederek kendi kendine yeten, döngüsel enerji üreten ve vatandaşa kesintisiz akıllı hizmet sunan bir kent mobilyası platformudur.

Sistem iki temel arayüzden oluşur:
1. **Halk Paneli:** Açık, sade, güvenli ve kişisel veri talep etmeyen kamusal arayüz. Şehir haritası üzerinden durak olanaklarını (USB-C, priz, iklimlendirme, erişilebilirlik), anlık temiz enerji oranını ve en yakın durağı gösterir.
2. **Yönetici Paneli (Mühendislik & Telemetri):** Giriş korumalı, yetkili operatörlerin BMS hücre sıcaklıklarını, SOH/SOC ham verilerini, yangın/kabin sensörlerini, şebeke aktarımını ve AI Enerji Asistanı önerilerini izleyip simüle ettiği karar destek merkezi.

---

## 🛡️ Güvenlik, Şeffaflık ve Mimari İlkeler

* **Fiziksel Güvenlik Standardı:**  
  > *"Batarya oturma alanında değil; durağın yanında/arkasında, ayrı, kilitli, havalandırmalı ve yangına dayanımlı (EI60 / IP65 sertifikalı) **Güvenli Enerji Kabini** içinde korunur."*
* **API Telemetri Ayrımı:**  
  > *"Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır."*  
  *(Halk arayüzü; batarya seri numarası, hücre sıcaklıkları, ham SOC/SOH, BMS arıza kodları veya kabin kilit durumunu kesinlikle görüntülemez.)*
* **Donanım Komut Simülasyonu:**  
  > *"Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez."*  
  *(Yönetici panelindeki 'İzolasyona al' veya 'AI Önerisi Uygula' butonları yalnızca güvenli mock olay logları üretir.)*
* **Karar Destek:**  
  > *"Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir."*
* **Şebeke Aktarım Bildirimi:**  
  > *"Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir."*
* **İkinci Yaşam Batarya Uygunluğu:**  
  > *"İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir."*
* **Demo Şeffaflık Etiketi:**  
  > *"Pilot Demo – Simülasyon Verisi"* ve *"Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır."*

---

## 📍 Konya Pilot Durak Ağı (6 Lokasyon)

| Durak Kodu | Durak Adı | Koordinatlar | USB-C | Priz | Kablosuz | Durum | Güneş (kW) |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| `ST-KNY-01` | **Kampüs Ana Giriş Akıllı Durak** | `38.0028° N, 32.5186° E` | 8 Port | 4 Adet | Var (15W) | Aktif | 5.4 kW |
| `ST-KNY-02` | **Alaaddin Bulvarı Akıllı Durak** | `37.8728° N, 32.4925° E` | 6 Port | 2 Adet | Var (15W) | Aktif | 4.8 kW |
| `ST-KNY-03` | **Selçuklu Kongre Merkezi Akıllı Durak** | `37.9231° N, 32.4984° E` | 10 Port | 4 Adet | Var (15W) | Sınırlı Mod | 3.2 kW |
| `ST-KNY-04` | **Karatay Bilim Merkezi Akıllı Durak** | `37.8890° N, 32.5580° E` | 8 Port | 4 Adet | Var (15W) | Aktif | 6.2 kW |
| `ST-KNY-05` | **Meram Park Akıllı Durak** | `37.8465° N, 32.4410° E` | 4 Port | 2 Adet | Yok | Bakımda | 1.8 kW |
| `ST-KNY-06` | **Kılıçarslan Gençlik Merkezi Akıllı Durak**| `37.8785° N, 32.4860° E` | 8 Port | 4 Adet | Var (15W) | Aktif | 5.0 kW |

---

## 🏗️ Teknoloji Yığını

* **Arayüz (Frontend):**
  * React 18 & TypeScript
  * Vite (Yüksek hızlı build & HMR)
  * Tailwind CSS (İskandinav minimal renk paleti, koyu antrasit zemin, doğal ahşap ve sürdürülebilir yeşil vurgular)
  * React Leaflet & OpenStreetMap (API anahtarsız, mobilde dokunmatik uyumlu interaktif harita)
  * Recharts (24 saatlik enerji üretim/tüketim/SOC eğrileri)
  * Lucide React (Sistem ikon seti)
* **Sunucu & Veri (Backend):**
  * Node.js & Express REST API
  * Haversine Mesafe Hesaplama Algoritması
  * Mock / Simülasyon Telemetri Veritabanı
  * JWT Formatında Demo Admin Yetkilendirme Middleware
* **Test & Kalite:**
  * Vitest & React Testing Library (21 otomatik test)
  * Supertest (API entegrasyon testleri)
  * JSDOM & TypeScript Type-check

---

## 📡 API Uç Noktaları

### 🌍 Halka Açık (Public) API
* `GET /api/public/stations` – 6 pilot durağın filtrelenmiş genel bilgilerini döner (Hassas telemetri içermez).
* `GET /api/public/stations/:id` – Tekil durak halk detayları.
* `GET /api/public/nearby?lat=...&lng=...` – Haversine formülü ile kullanıcıya en yakın durakları mesafeye göre sıralar.
* `POST /api/public/feedback` – Anonim durak geri bildirimi kaydeder (Kişisel veri istemez, takip ID üretir).
* `GET /api/public/impact-summary` – Döngüsel ekonomi etki özeti ve CO2 tasarruf metrikleri.
* `GET /api/public/faqs` – Sıkça sorulan sorular listesi.

### 🔒 Yönetici (Admin) API
* `POST /api/admin/login` – Demo yönetici girişi (`admin@circularcity.demo` / `Demo123!`).
* `GET /api/admin/overview` – Sistem KPI'ları, 24 saatlik enerji eğrisi verisi ve AI özeti.
* `GET /api/admin/stations` – Tüm duraklar ve ayrıntılı teknik telemetri verileri.
* `GET /api/admin/stations/:id` – Tek durak detaylı telemetrisi.
* `GET /api/admin/stations/:id/battery` – İkinci yaşam batarya hücre sıcaklıkları, SOH/SOC, BMS hata kodları.
* `GET /api/admin/energy` – Güneş üretimi, inverter modu, MPPT ve şebeke aktarım verileri.
* `GET /api/admin/climate` – Bekleme alanı iç ortam sıcaklığı, nem, AQI ve kabin havalandırması.
* `GET /api/admin/charging` – USB-C ve priz yük dağılımı.
* `GET /api/admin/ai/recommendations` – AI Enerji Asistanı optimizasyon önerileri.
* `POST /api/admin/ai/recommendations/:id/apply` – AI önerisini mock olarak uygular.
* `POST /api/admin/ai/recommendations/:id/dismiss` – AI önerisini yok sayar.
* `POST /api/admin/batteries/:id/isolate` – Bataryayı simüle güvenlik modunda izolasyona alır.
* `GET /api/admin/alerts` – Sensör uyarıları ve alarmlar.
* `GET /api/admin/feedback` – Vatandaş geri bildirimleri listesi.
* `PATCH /api/admin/feedback/:id` – Bildirim durumunu güncelleme (`Kayıt Alındı` / `İnceleniyor` / `Tamamlandı`).

---

## 🚀 Yerel Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# 1. Depoyu klonlayın veya proje klasörüne girin
cd C:\Users\OMEN\Desktop\circularcity-energy

# 2. Bağımlılıkları yükleyin
npm install

# 3. Otomatik testleri çalıştırın (21/21 passed)
npm test

# 4. Üretim buildini derleyin
npm run build

# 5. Hem Backend API (Port 5000) hem Frontend İstemcisini (Port 3000) başlatın:
npm run dev
```

* **Halk Portalı:** `http://localhost:3000/` veya `http://localhost:3000/harita`
* **Yönetici Girişi:** `http://localhost:3000/admin`
  * **E-Posta:** `admin@circularcity.demo`
  * **Şifre:** `Demo123!`
  * *(Yalnızca Jüri Demo Hesabı)*

---

## 🧪 Otomatik Test Kapsamı

Proje 21 adet bağımsız vitest ve supertest senaryosu ile %100 doğrulanmıştır:
1. `GET /api/public/stations` 6 pilot durağı ve simülasyon etiketini döner.
2. Public API; seri no, hücre sıcaklığı, BMS kodları ve kilit durumunu döndürmez.
3. Admin endpointleri yetkisiz erişimde 401/403 yanıtı verir.
4. Admin demo girişi doğrulanır ve JWT token üretir.
5. Geri bildirim servisi kişisel veri olmadan kayıt oluşturup takip ID döner.
6. Haversine formülü ile yakın durak hesabı ve sıralaması doğrulanır.
7. AI önerisi uygulama/yok sayma işlemleri mock durum üretir.
8. Batarya izolasyonu gerçek donanıma komut göndermez, mock olay logu üretir.
9. React uygulaması build çıktısı doğrulanır.
10. Harita ve yedek liste görünümü 6 pilot durağı eksiksiz render eder.
11. Filtre barı ve arama kutusu durum değişikliklerini tetikler.
12. Mobilde yatay taşma (overflow-x) kısıtlamaları ve responsive uyumluluk doğrulanır.

---

## 📄 Lisans
Bu proje Konya Akıllı Şehir Hackathon / Jüri Sunumu için açık kaynaklı prototip olarak hazırlanmıştır. MIT Lisansı ile korunmaktadır.

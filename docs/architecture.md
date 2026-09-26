# CircularCity Energy - Sistem Mimarisi ve Güvenlik Tasarımı

Bu belge, **CircularCity Energy** projesinin donanım ayrımı, telemetri güvenliği, veri akışları ve yazılım mimarisini detaylandırmaktadır.

---

## 1. Fiziksel ve Donanım Güvenlik Katmanı

Geleneksel akıllı durak tasarımlarında batarya modülleri yolcu oturma bölmelerinin altına veya reklam panolarının içine yerleştirilmekte, bu durum yangın ve termal kaçak (thermal runaway) durumlarında ciddi kamusal risk oluşturmaktadır.

**CircularCity Energy Güvenlik Standardı:**
* **Bağımsız Konumlandırma:** Batarya oturma alanında değil; durağın yanında veya arkasında, yolcu bekleme alanından fiziksel olarak izole edilmiş bağımsız bir kabindedir.
* **Sertifikasyon:** EI60 yangın dayanımı (en az 60 dakika alev ve duman sızdırmazlığı) ve IP65 dış ortam koruma standardı.
* **İklimlendirme & Havalandırma:** Kabin içi bağımsız zorlamalı egzoz fanı, hidrojen/gaz sensörü ve aerosol tabanlı otomatik yangın söndürme modülü.
* **Fiziksel Erişim Kontrolü:** Elektronik kilit, RFID yetkili erişim kartı ve sabotaj (tamper) anahtarı.

```
       +---------------------------------------------+
       |           GÜNEŞ PANELİ (Çatı PV)            |
       +---------------------------------------------+
                              | (DC)
                              v
                +----------------------------+
                |     MPPT Şarj Regülatörü    |
                +----------------------------+
                              |
       +----------------------+----------------------+
       |                                             |
       v (İzole Güç Hattı)                           v (AC / DC Hat)
+-------------------------------+             +------------------------------+
|     GÜVENLİ ENERJİ KABİNİ     |             |       YOLCU ALANI            |
| (Durağın Yanında / Arkasında) |             |                              |
| - İkinci Yaşam EV Bataryası   |             | - USB-C Portları (PD 3.0)    |
| - Çok Katmanlı BMS Modülü     |             | - 220V Topraklı Prizler      |
| - Aerosol Yangın Söndürücü    |             | - Kablosuz Şarj Pedleri (Qi) |
| - EI60 Yangın Dayanımı (IP65) |             | - Akıllı Aydınlatma & HVAC   |
| - Zorlamalı Fan Havalandırma  |             | - Yolcu Bilgilendirme Ekranı |
+-------------------------------+             +------------------------------+
```

---

## 2. API Telemetri Ayrımı ve Sıfır Sızıntı Prensibi

Halkın kullandığı kamusal arayüz ile yetkili mühendislik arayüzü birbirinden hem ağ katmanında hem de veri serileştirme katmanında kesin kurallarla ayrılmıştır.

> **Güvenlik Taahhüdü:**  
> *"Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır."*

### Telemetri Matrisi:

| Veri Alanı | Halk API (`/api/public/*`) | Yönetici API (`/api/admin/*`) | Gerekçe |
|---|:---:|:---:|---|
| Durak Adı & Koordinat | ✅ Açık | ✅ Açık | Yolcu yönlendirmesi için gerekli |
| USB-C & Priz Durumu | ✅ Açık | ✅ Açık | Vatandaşın şarj ihtiyacı için temel veri |
| Anlık Güneş & Temiz Enerji Oranı | ✅ Açık | ✅ Açık | Şeffaf sürdürülebilirlik bilinci |
| İç Ortam Sıcaklığı & AQI | ✅ Açık | ✅ Açık | Konfor bilgisi |
| Güvenli Kabin Özeti | ✅ Sadece Güvenlik Bildirimi | ✅ Tam Detay | Oturma alanında olmadığı güvencesi |
| **Hücre Sıcaklıkları (Cell Temps)** | ❌ **YASAK** | ✅ Açık (H1..H4 °C) | Kritik donanım güvenlik verisi |
| **Ham SOC / SOH Değerleri** | ❌ **YASAK** | ✅ Açık (% formatında) | Donanım yıpranma analizi |
| **BMS Durumu & Hata Kodları** | ❌ **YASAK** | ✅ Açık (DTC Kodları) | Yalnızca yetkili servis görebilir |
| **Batarya Seri No / Modül ID** | ❌ **YASAK** | ✅ Açık | Varlık yönetimi ve envanter |
| **Kabin Kilit & RFID Erişim** | ❌ **YASAK** | ✅ Açık | Fiziksel güvenlik ihlali önleme |
| **Kamera & Güvenlik Sağlığı** | ❌ **YASAK** | ✅ Açık | Kişisel mahremiyet ve asayiş |

---

## 3. Donanım Güvenlik Duvarı ve Simülasyon Koruması

Demo ve operasyon paneli üzerindeki kontrollerin hiçbir koşulda sahada çalışan fiziksel kontaktörlere veya rölelere doğrudan sinyal göndermemesi için sanal koruma katmanı kurulmuştur.

* Tüm kontrol butonlarında görünür etiket:
  `"Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez."`
* Yönetici portalında yapılan batarya izolasyonu veya AI önerisi uygulama işlemleri sunucuda in-memory mock log oluşturur; fiziksel şalterleri tetiklemez.

---

## 4. Yazılım Katmanları

* **Sunucu (Backend):**
  * Node.js & Express REST mimarisi.
  * `requireAdminAuth` middleware'i ile JWT formatında token doğrulaması.
  * Sanitizer fonksiyonu ile Public API çıktılarından hassas anahtarlar otomatik silinir.
* **İstemci (Frontend):**
  * React 18, TypeScript, Tailwind CSS.
  * React Leaflet ve OpenStreetMap entegrasyonu (Google API Key bağımsızlığı).
  * Çevrimdışı / düşük veri modu: Harita karoları yüklenemese dahi tüm duraklar yedek liste görünümünde kullanılabilir.
  * Recharts ile 24 saatlik yük, üretim ve batarya eğrisi.

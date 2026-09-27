# BeeHive - Jüri Sunumu & Canlı Demo Senaryosu (3-5 Dakika)

Bu senaryo, Konya Akıllı Şehir jürisine projenin değer önerisini, teknik güvenlik ayrıntılarını ve canlı arayüzlerini 3 ila 5 dakika içinde eksiksiz anlatmak için hazırlanmıştır.

---

## ⏱️ Süre Dağılımı ve Akış Planı

* **00:00 - 00:45 | Giriş:** Problem ve Döngüsel Ekonomi Fırsatı
* **00:45 - 01:45 | Halk Portalı & Canlı Şehir Haritası:** Kullanıcı Deneyimi & Şeffaflık
* **01:45 - 03:00 | Yönetici Paneli & Donanım Güvenliği:** Telemetri, Güvenli Kabin, İzolasyon & AI Asistanı
* **03:00 - 03:45 | Teknik Güvence & Otomatik Testler:** Sıfır Sızıntı & Mühendislik Doğrulaması
* **03:45 - 04:00 | Kapanış & Soru-Cevap**

---

### Bölüm 1: Problem & Değer Önerisi (00:00 - 00:45)
> *"Sayın jüri üyeleri; elektrikli araç dönüşümü hızla yaygınlaşırken, kapasitesi %75-80 bandına düşen milyonlarca batarya modülü erken hurdaya ayrılma riskiyle karşı karşıya. BeeHive olarak biz, bu bataryaları Konya'nın yoğun akıllı duraklarına entegre ederek hem ikinci yaşam sabit enerji depolaması sağlıyor, hem de çatı tipi güneş panelleriyle şebekeden bağımsız çalışan, kesintisiz şarj ve iklimlendirme sunan döngüsel bir kent mobilyası ekosistemi kuruyoruz."*

---

### Bölüm 2: Halk Portalı & İnteraktif Şehir Haritası (00:45 - 01:45)
> *(Ekran: `http://localhost:3000/harita`)*
> 
> *"Halkın kullandığı ekran tamamen açık, sade ve güvenlidir. Kullanıcıdan hiçbir kişisel veri talep edilmez.*
> * *Harita Konya merkezli açılır ve Leaflet/OpenStreetMap altyapısıyla harici lisans maliyeti oluşturmaz.*
> * *Örnek olarak 'Alaaddin Bulvarı' durağına tıkladığımızda; kullanılabilir 6 adet USB-C portunu, 220V prizi ve anlık %92 temiz enerji oranını görüyoruz.*
> * *En kritik tasarım ilkemiz: Vatandaş ekranda teknik batarya hücresi verisi görmez; ancak durağın yanında ve arkasında yer alan, yangına dayanımlı ve kilitli 'Ayrı Güvenli Enerji Kabini' güvencesini şeffaflıkla görür.*
> * *İnternetin olmadığı acil durumlarda tek tıkla 'Yedek Liste Görünümü'ne geçerek durak olanaklarını inceleyebilir ve 'Geri Bildirim' formuyla anonim bildirimde bulunabilir."*

---

### Bölüm 3: Yönetici Portalı & Mühendislik Telemetrisi (01:45 - 03:00)
> *(Ekran: `http://localhost:3000/admin` - Demo Girişi Yapılır)*
> 
> *"Şimdi yetkili mühendislik arayüzüne geçiyoruz. Bu hesap Konya şebeke yöneticisi rolüyle açılmaktadır.*
> * *Genel Bakış: 24 saatlik güneş üretimi, yük tüketimi ve batarya doluluk eğrisi Recharts ile canlı modellenmiştir.*
> * *Batarya Yönetimi sekmesine geçtiğimizde; her modülün kimyası, döngü sayısı, BMS hata durumu ve 4 hücrenin bağımsız sıcaklıklarını (°C) anlık izliyoruz.*
> * *Güvenlik Testi: 'Selçuklu Kongre Merkezi' durağında 'İzolasyona Al' butonuna basıyorum. Karşımıza çıkan uyarı: 'Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.' Butona onay verdiğimizde durak sınırlı moda geçer, batarya izole edilir ve olay günlüğüne mock denetçi kaydı düşülür.*
> * *AI Enerji Asistanı: Sistem günün ışınım zirvesini tespit edip batarya şarjını önceliklendirme önerisi sunar. Tek tıkla bu karar desteğini onaylayabiliriz."*

---

### Bölüm 4: Otomatik Test Doğrulaması & Kapanış (03:00 - 04:00)
> *(Terminal: `npm test` çıktısı gösterilir)*
> 
> *"Sistemimizin güvenilirliği lafta değil, otomatik testlerle kanıtlanmıştır.*
> * *Projemizdeki 24 otomatik testin tamamı geçmektedir.*
> * *Özellikle 'Public API Teknik Veri Sızıntısı Koruması' testimiz; halk uç noktalarından batarya seri numarası, hücre sıcaklığı ve BMS kodlarının kesinlikle sızdırılmadığını garanti altına almaktadır.*
> * *BeeHive; sıfır atık, akıllı kent ve sürdürülebilir enerji vizyonunu Konya için hayata geçirmeye hazırdır. Dinlediğiniz için teşekkür ederiz."*

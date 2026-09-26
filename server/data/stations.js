/**
 * Circular City - Konya Akıllı Şehir Durakları Demo Veri Seti
 * NOT: Bu veriler pilot demo ve simülasyon amaçlıdır. Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır.
 */

export const stationsData = [
  {
    stationId: "ST-KNY-01",
    name: "Kampüs Ana Giriş Akıllı Durak",
    description: "Selçuk Üniversitesi Alaeddin Keykubat Kampüsü ana girişinde konumlu, yüksek öğrenci ve ziyaretçi sirkülasyonuna sahip döngüsel enerji durağı.",
    coordinates: [38.0028, 32.5186],
    status: "aktif", // aktif / sinirli / bakimda / baglanti_yok
    lastUpdated: "2026-09-26T09:25:00Z",
    // Halk Açık Verileri
    usbCPorts: 8,
    powerOutlets: 4,
    wirelessCharging: true,
    hvacStatus: "Aktif (Akıllı Isıtma / Soğutma)",
    accessibility: "Tam Uyumlu (Tekerlekli Sandalye Rampası, Braille & Sesli Bilgilendirme)",
    batteryReadiness: "yeterli", // yeterli / sinirli / bakimda
    solarProductionKw: 5.4,
    instantConsumptionKw: 1.6,
    dailyCleanEnergyRatio: 96,
    gridFeedEnergyKwh: 22.8,
    indoorTemperature: 22.0,
    indoorHumidity: 41,
    airQuality: "Mükemmel (AQI 18 - PM2.5: 4 µg/m³)",
    maintenanceMessage: null,
    // Güvenli Enerji Kabini
    energyCabinet: {
      location: "Durağın arkasında, yolcu bekleme alanından ayrı bağımsız zemin kabini",
      isLocked: true,
      isVentilated: true,
      isFireResistant: true,
      safetySummary: "Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur."
    },

    // Yöneticiye Özel Gizli Teknik Demo Telemetri (Halk API'sinde ASLA yer almaz!)
    adminOnly: {
      moduleId: "MOD-KNY-01-A",
      batterySerialNumber: "LFP-48V-200AH-KNY-0841",
      chemistryType: "LFP (Lityum Demir Fosfat - İkinci Yaşam Adayı)",
      nominalCapacityAh: 200,
      usableCapacityAh: 184,
      sohRaw: 98.4,
      socRaw: 86.2,
      cycleCount: 412,
      currentVoltageV: 53.2,
      currentAmperageA: 12.4,
      cellTemperatures: [22.4, 22.8, 22.5, 23.1],
      bmsStatus: "NORMAL",
      bmsFaultCode: "BMS_OK_000",
      bmsConnection: "Aktif - CANBus Senkron",
      lastMaintenanceDate: "2026-08-15",
      technicalEvaluation: "İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.",
      batteryState: "Normal", // Normal | İzleme gerekli | Bakım gerekli | İzolasyona alındı
      cabinetAccessInfo: "Manyetik Kilitli - Yetkili RFID No: #9042",
      cabinetDoorStatus: "Kapalı ve Güvenli",
      energyCabinetDetails: {
        exactPosition: "Durağın 1.8m arkasında beton kaide üzeri ankrajlı bağımsız kabin",
        lockMechanism: "Elektronik RFID + Manyetik Çift Kilit (Kilitli & Güvenli)",
        ventilationStatus: "Akıllı Termostatik Cebri Havalandırma (Fan Hızı: %40 - Filtre: Temiz)",
        fireSuppressionSystem: "Aerosol Otomatik Yangın Söndürme Kartuşu (Sistem Hazır - Basınç Normal)",
        fireRating: "EI60 / UL9540A Sertifikalı Yangın Bariyeri",
        internalTemperature: 22.2,
        tamperSensor: "Aktif - Yetkisiz Müdahale Yok"
      },
      inverterStatus: "Çift Yönlü Hibrit İnverter - Aktif Senkron",
      inverterCommands: ["STANDBY", "GRID_EXPORT_MAX", "ECO_MODE"],
      securityCameras: {
        activeCount: 2,
        systemHealth: "Kayıt Aktif - 1080p Yerel NVR",
        blindSpotWarning: false
      },
      technicalDiagnostics: "Modül verimliliği %21.4. İnverter MPPT 1 ve 2 dengeli. Priz kaçak akım rölesi devrede.",
      alerts: []
    }
  },
  {
    stationId: "ST-KNY-02",
    name: "Alaaddin Bulvarı Akıllı Durak",
    description: "Konya tarihi şehir merkezinde, Alaaddin Tepesi eteklerindeki yoğun aktarma noktasında hizmet veren güneş destekli durak.",
    coordinates: [37.8728, 32.4925],
    status: "aktif",
    lastUpdated: "2026-09-26T09:28:00Z",
    // Halk Açık Verileri
    usbCPorts: 6,
    powerOutlets: 2,
    wirelessCharging: true,
    hvacStatus: "Aktif (Doğal Havalandırma + Eco Klima)",
    accessibility: "Tam Uyumlu (Tekerlekli Sandalye Alanı & Dokunsal Zemin)",
    batteryReadiness: "yeterli",
    solarProductionKw: 4.8,
    instantConsumptionKw: 2.1,
    dailyCleanEnergyRatio: 92,
    gridFeedEnergyKwh: 16.5,
    indoorTemperature: 23.2,
    indoorHumidity: 39,
    airQuality: "İyi (AQI 32 - PM2.5: 8 µg/m³)",
    maintenanceMessage: null,
    energyCabinet: {
      location: "Durağın sağ yanında, korumalı servis koridorunda ayrı kabin",
      isLocked: true,
      isVentilated: true,
      isFireResistant: true,
      safetySummary: "Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur."
    },

    // Yöneticiye Özel Gizli Teknik Demo Telemetri
    adminOnly: {
      moduleId: "MOD-KNY-02-B",
      batterySerialNumber: "LFP-48V-200AH-KNY-0912",
      chemistryType: "LFP (Lityum Demir Fosfat)",
      nominalCapacityAh: 200,
      usableCapacityAh: 178,
      sohRaw: 96.1,
      socRaw: 79.5,
      cycleCount: 588,
      currentVoltageV: 52.8,
      currentAmperageA: 18.2,
      cellTemperatures: [23.8, 24.1, 23.9, 24.4],
      bmsStatus: "NORMAL",
      bmsFaultCode: "BMS_OK_000",
      bmsConnection: "Aktif - Modbus RTU",
      lastMaintenanceDate: "2026-07-20",
      technicalEvaluation: "Hücre empedansı nominal aralıkta. Çevrim ömrü stabilitesi yüksek.",
      batteryState: "Normal",
      cabinetAccessInfo: "Manyetik Kilitli - Son Erişim: 3 Gün Önce (Teknik Ekip A)",
      cabinetDoorStatus: "Kapalı ve Güvenli",
      energyCabinetDetails: {
        exactPosition: "Durağın sağ yanında 1.2m mesafede çelik muhafazalı kabin",
        lockMechanism: "Elektronik RFID Kilitli - Çift Mandal",
        ventilationStatus: "Cebri Havalandırma Aktif (Sıcaklık Kontrollü)",
        fireSuppressionSystem: "Stat-X Yangın Önleme Modülü (Devrede)",
        fireRating: "EI60 Yangına Dayanıklı Kompartıman",
        internalTemperature: 23.5,
        tamperSensor: "Normal - Titreşim Yok"
      },
      inverterStatus: "On-Grid Şebeke Destekli - Senkron",
      inverterCommands: ["STANDBY", "GRID_EXPORT_NORMAL"],
      securityCameras: {
        activeCount: 3,
        systemHealth: "Kayıt Aktif - 4K Geniş Açı NVR",
        blindSpotWarning: false
      },
      technicalDiagnostics: "Merkez yoğunluk pik saat yükü normal. Priz yükleme eşiği %45.",
      alerts: []
    }
  },
  {
    stationId: "ST-KNY-03",
    name: "Selçuklu Kongre Merkezi Akıllı Durak",
    description: "Selçuklu Kongre Merkezi ve Yeni İstanbul Caddesi aksındaki kültür-sanat etkinliği yolcularına yönelik akıllı durak.",
    coordinates: [37.9255, 32.4998],
    status: "sinirli",
    lastUpdated: "2026-09-26T09:20:00Z",
    // Halk Açık Verileri
    usbCPorts: 4,
    powerOutlets: 1,
    wirelessCharging: false,
    hvacStatus: "Sınırlı Güç Modu (Eco Havalandırma)",
    accessibility: "Tam Uyumlu (Rampa ve Geniş Giriş)",
    batteryReadiness: "sinirli",
    solarProductionKw: 2.1,
    instantConsumptionKw: 1.9,
    dailyCleanEnergyRatio: 78,
    gridFeedEnergyKwh: 4.2,
    indoorTemperature: 24.5,
    indoorHumidity: 46,
    airQuality: "İyi (AQI 29)",
    maintenanceMessage: "Kısmi gölgelenme ve batarya koruma modu devrede. Şarj noktaları dönüşümlü hizmet vermektedir.",
    energyCabinet: {
      location: "Durağın arkasında, yolcu oturma bölmesinden bağımsız kilitli kabin",
      isLocked: true,
      isVentilated: true,
      isFireResistant: true,
      safetySummary: "Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur."
    },

    // Yöneticiye Özel Gizli Teknik Demo Telemetri
    adminOnly: {
      moduleId: "MOD-KNY-03-C",
      batterySerialNumber: "LFP-48V-200AH-KNY-0763",
      chemistryType: "LFP (İkinci Yaşam EV Bataryası - Faz 2)",
      nominalCapacityAh: 200,
      usableCapacityAh: 154,
      sohRaw: 89.2,
      socRaw: 38.6,
      cycleCount: 924,
      currentVoltageV: 49.6,
      currentAmperageA: 8.5,
      cellTemperatures: [26.2, 27.1, 26.8, 27.5],
      bmsStatus: "WARNING_LOW_RESERVE",
      bmsFaultCode: "BMS_WARN_SOC_LOW_L2",
      bmsConnection: "Aktif - Uyarı Modu",
      lastMaintenanceDate: "2026-09-01",
      technicalEvaluation: "İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.",
      batteryState: "İzleme gerekli",
      cabinetAccessInfo: "Kilitli - Alarm Sensörü Aktif",
      cabinetDoorStatus: "Kapalı",
      energyCabinetDetails: {
        exactPosition: "Durağın arkasında 2.0m mesafede harici korunaklı kabin",
        lockMechanism: "Elektronik Kilit + Mekanik Anahtar Yuvası (Kilitli)",
        ventilationStatus: "Fan Hızı %80 (Soğutma Talebi Artışı)",
        fireSuppressionSystem: "Otomatik Termal Kapsül Hazır",
        fireRating: "EI60 Yangın Bariyeri",
        internalTemperature: 26.8,
        tamperSensor: "Normal"
      },
      inverterStatus: "Eco-Throttled (Kendi Kendine Yeterlilik Modu)",
      inverterCommands: ["LOAD_SHEDDING_ACTIVE", "BATTERY_CONSERVE"],
      securityCameras: {
        activeCount: 2,
        systemHealth: "Kayıt Aktif",
        blindSpotWarning: false
      },
      technicalDiagnostics: "MPPT Giriş 2 panel kirliliği veya gölgeleme tespit edildi (%35 kayıp). Batarya SOC kritik eşiğin altına inmemesi için kablosuz şarj devre dışı bırakıldı.",
      alerts: [
        { id: "ALT-301", level: "warning", message: "Hücre Delta V: 42mV (Dengeleme Devrede)", timestamp: "2026-09-26T08:45:00Z" },
        { id: "ALT-302", level: "info", message: "Kablosuz şarj ünitesi güç tasarrufu için kapatıldı.", timestamp: "2026-09-26T08:50:00Z" }
      ]
    }
  },
  {
    stationId: "ST-KNY-04",
    name: "Karatay Bilim Merkezi Akıllı Durak",
    description: "TÜBİTAK destekli Konya Bilim Merkezi ve Şehir Parkı girişinde yer alan, yüksek kapasiteli temiz enerji durağı.",
    coordinates: [37.8885, 32.5590],
    status: "aktif",
    lastUpdated: "2026-09-26T09:30:00Z",
    // Halk Açık Verileri
    usbCPorts: 8,
    powerOutlets: 4,
    wirelessCharging: true,
    hvacStatus: "Aktif (Tam Kapasite HVAC)",
    accessibility: "Tam Uyumlu (Engelli Aracı Hızlı Şarj Yuvası Mevcut)",
    batteryReadiness: "yeterli",
    solarProductionKw: 6.2,
    instantConsumptionKw: 2.4,
    dailyCleanEnergyRatio: 98,
    gridFeedEnergyKwh: 31.2,
    indoorTemperature: 21.5,
    indoorHumidity: 38,
    airQuality: "Mükemmel (AQI 15)",
    maintenanceMessage: null,
    energyCabinet: {
      location: "Durağın sol yanında, mimari olarak entegre yangına dayanıklı kabin",
      isLocked: true,
      isVentilated: true,
      isFireResistant: true,
      safetySummary: "Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur."
    },

    // Yöneticiye Özel Gizli Teknik Demo Telemetri
    adminOnly: {
      moduleId: "MOD-KNY-04-D",
      batterySerialNumber: "LFP-48V-300AH-KNY-1104",
      chemistryType: "LFP (Yüksek Kapasiteli Lityum Hücre)",
      nominalCapacityAh: 300,
      usableCapacityAh: 288,
      sohRaw: 99.1,
      socRaw: 92.4,
      cycleCount: 180,
      currentVoltageV: 54.1,
      currentAmperageA: 24.6,
      cellTemperatures: [21.8, 22.1, 21.9, 22.3],
      bmsStatus: "OPTIMAL",
      bmsFaultCode: "BMS_OK_000",
      bmsConnection: "Aktif - Yüksek Hızlı CAN",
      lastMaintenanceDate: "2026-09-10",
      technicalEvaluation: "Güneş üretimi yüksek, döngüsel şebeke senkronizasyonu ideal.",
      batteryState: "Normal",
      cabinetAccessInfo: "Manyetik Kilitli - İki Kademeli Yetkilendirme",
      cabinetDoorStatus: "Kapalı ve Kilitli",
      energyCabinetDetails: {
        exactPosition: "Durağın sol yanında 1.5m betonarme zemin üzerinde",
        lockMechanism: "Akıllı Manyetik Kilit + Çift Sensör (Kilitli)",
        ventilationStatus: "Akıllı Çift Fanlı Havalandırma Aktif (%30 devir)",
        fireSuppressionSystem: "Otomatik Aerosol Kapsülü (Devrede - Yeşil Gösterge)",
        fireRating: "EI90 / UL9540A Yüksek Yangın Dayanımı",
        internalTemperature: 21.9,
        tamperSensor: "Normal - Kilit Güvenli"
      },
      inverterStatus: "Yüksek Güç Modu - Şebekeye Aktif Satış",
      inverterCommands: ["GRID_INJECTION_MAX", "SMART_EV_ALLOWED"],
      securityCameras: {
        activeCount: 4,
        systemHealth: "Tüm Açılar Aktif - AI Güvenlik Analitiği",
        blindSpotWarning: false
      },
      technicalDiagnostics: "Güneş ışınımı 880 W/m². Batarya sıcaklığı ideal termal aralıkta (22°C).",
      alerts: []
    }
  },
  {
    stationId: "ST-KNY-05",
    name: "Meram Park Akıllı Durak",
    description: "Meram Bağları ve yeşil vadi rekreasyon alanında yer alan, doğayla uyumlu ahşap ve kompozit mimarili durak.",
    coordinates: [37.8522, 32.4410],
    status: "bakimda",
    lastUpdated: "2026-09-26T08:15:00Z",
    // Halk Açık Verileri
    usbCPorts: 0,
    powerOutlets: 0,
    wirelessCharging: false,
    hvacStatus: "Bakım Nedeniyle Kapalı",
    accessibility: "Rampa Mevcut (İç Alan Geçici Kapalı)",
    batteryReadiness: "bakimda",
    solarProductionKw: 0.0,
    instantConsumptionKw: 0.2,
    dailyCleanEnergyRatio: 0,
    gridFeedEnergyKwh: 0.0,
    indoorTemperature: 20.0,
    indoorHumidity: 45,
    airQuality: "İyi (AQI 22)",
    maintenanceMessage: "Yıllık periyodik panel revizyonu ve batarya güvenlik testleri yürütülmektedir. En yakın hizmet veren durak: Alaaddin Bulvarı.",
    energyCabinet: {
      location: "Durağın arkasında, yolcu alanından tamamen izole edilmiş teknik kabin",
      isLocked: false,
      isVentilated: true,
      isFireResistant: true,
      safetySummary: "Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur."
    },

    // Yöneticiye Özel Gizli Teknik Demo Telemetri
    adminOnly: {
      moduleId: "MOD-KNY-05-E",
      batterySerialNumber: "LFP-48V-200AH-KNY-0620",
      chemistryType: "LFP (İkinci Yaşam Doğrulama Test Grubu)",
      nominalCapacityAh: 200,
      usableCapacityAh: 140,
      sohRaw: 84.7,
      socRaw: 18.2,
      cycleCount: 1240,
      currentVoltageV: 46.8,
      currentAmperageA: 0.0,
      cellTemperatures: [19.8, 20.1, 19.9, 20.2],
      bmsStatus: "MAINTENANCE_ISOLATED",
      bmsFaultCode: "BMS_TEST_MANUAL_HOLD",
      bmsConnection: "Servis Modunda - Yerel Test",
      lastMaintenanceDate: "2026-09-26",
      technicalEvaluation: "İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.",
      batteryState: "Bakım gerekli",
      cabinetAccessInfo: "Açık / Saha Mühendisi Görevli (#E-782)",
      cabinetDoorStatus: "Açık - Servis Modu",
      energyCabinetDetails: {
        exactPosition: "Durağın 2.2m arkasında zemin kaidesi üzerinde",
        lockMechanism: "Manuel Servis Anahtarıyla Açık (Teknisyen #E-782)",
        ventilationStatus: "Doğal Menfez Açık + Fan Test Modu",
        fireSuppressionSystem: "Manuel Devre Dışı / Güvenlik Testi Devam Ediyor",
        fireRating: "EI60 Yangın Bariyeri",
        internalTemperature: 20.1,
        tamperSensor: "Servis Modu (Kayıtlı Erişim)"
      },
      inverterStatus: "İzole Edilmiş (Safety Breaker Tripped Manually)",
      inverterCommands: ["SERVICE_DISCONNECT", "MANUAL_LOCKOUT"],
      securityCameras: {
        activeCount: 2,
        systemHealth: "Servis Modu Kaydı",
        blindSpotWarning: false
      },
      technicalDiagnostics: "Fiziksel DC sigortası açık. 1200+ çevrim batarya kapasite kalibrasyon testi yürütülüyor.",
      alerts: [
        { id: "ALT-501", level: "critical", message: "Kabin Kapağı Açık (Servis Anahtarı Takılı)", timestamp: "2026-09-26T08:10:00Z" },
        { id: "ALT-502", level: "warning", message: "DC Giriş Kesici Açık (Manuel İzolasyon)", timestamp: "2026-09-26T08:12:00Z" }
      ]
    }
  },
  {
    stationId: "ST-KNY-06",
    name: "Kılıçarslan Gençlik Merkezi Akıllı Durak",
    description: "Şehir Meydanı ve Kılıçarslan Gençlik Merkezi önündeki gençlik buluşma noktasında konumlanmış akıllı durak.",
    coordinates: [37.8785, 32.4845],
    status: "baglanti_yok",
    lastUpdated: "2026-09-26T07:40:00Z",
    // Halk Açık Verileri
    usbCPorts: 4,
    powerOutlets: 2,
    wirelessCharging: true,
    hvacStatus: "Otonom Çalışıyor (Son Bilinen)",
    accessibility: "Tam Uyumlu (Sesli Rehber & Rampa)",
    batteryReadiness: "yeterli",
    solarProductionKw: 3.8,
    instantConsumptionKw: 1.5,
    dailyCleanEnergyRatio: 88,
    gridFeedEnergyKwh: 11.0,
    indoorTemperature: 22.8,
    indoorHumidity: 43,
    airQuality: "İyi (AQI 30)",
    maintenanceMessage: "Telemetri sunucu bağlantısı güncelleniyor. Durak içi fiziksel hizmetler yerel kontrol ünitesiyle çalışmaya devam etmektedir.",
    energyCabinet: {
      location: "Durağın arkasında, yolcu alanından bağımsız korunaklı kabin",
      isLocked: true,
      isVentilated: true,
      isFireResistant: true,
      safetySummary: "Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur."
    },

    // Yöneticiye Özel Gizli Teknik Demo Telemetri
    adminOnly: {
      moduleId: "MOD-KNY-06-F",
      batterySerialNumber: "LFP-48V-200AH-KNY-0899",
      chemistryType: "LFP (Lityum Demir Fosfat)",
      nominalCapacityAh: 200,
      usableCapacityAh: 172,
      sohRaw: 94.3,
      socRaw: 71.0,
      cycleCount: 650,
      currentVoltageV: 51.9,
      currentAmperageA: 14.1,
      cellTemperatures: [23.1, 23.4, 23.2, 23.7],
      bmsStatus: "OFFLINE_FALLBACK",
      bmsFaultCode: "COMM_GATEWAY_TIMEOUT_LTE",
      bmsConnection: "Bağlantı Yok (Son Bilinen: Aktif)",
      lastMaintenanceDate: "2026-06-12",
      technicalEvaluation: "LTE modülü geçici çevrimdışı. Otonom donanım koruması faal.",
      batteryState: "İzleme gerekli",
      cabinetAccessInfo: "Manyetik Kilitli - Son Durum Kilitli",
      cabinetDoorStatus: "Kapalı (Son Bilinen)",
      energyCabinetDetails: {
        exactPosition: "Durağın 1.9m arkasında bağımsız beton kaide üzeri kabin",
        lockMechanism: "Elektronik Manyetik Kilit (Otonom Kilitli)",
        ventilationStatus: "Otonom Termostatik Havalandırma Devrede",
        fireSuppressionSystem: "Otonom Aerosol Kapsülü Devrede",
        fireRating: "EI60 Yangın Bariyeri",
        internalTemperature: 23.3,
        tamperSensor: "Normal (Son Bilinen)"
      },
      inverterStatus: "Otonom Standalone Mod",
      inverterCommands: ["LOCAL_AUTO_ONLY"],
      securityCameras: {
        activeCount: 2,
        systemHealth: "Yerel SD Kart Kaydı Devam Ediyor (Bulut Aktarımı Beklemede)",
        blindSpotWarning: false
      },
      technicalDiagnostics: "LTE 4G Router ping yanıt vermiyor. Durak içi PLC yerel algoritmada güvenle çalışıyor.",
      alerts: [
        { id: "ALT-601", level: "critical", message: "LTE Ağ Geçidi Zaman Aşımı (>60 dk)", timestamp: "2026-09-26T07:45:00Z" }
      ]
    }
  }
];

// Mock AI Enerji Asistanı Önerileri (Kural tabanlı, açıklanabilir)
export const initialAiRecommendations = [
  {
    id: "AI-REC-01",
    stationId: "ST-KNY-04",
    stationName: "Karatay Bilim Merkezi",
    priority: "Yüksek",
    title: "Güneş Üretimi Yüksek: Batarya Şarjına Öncelik Ver",
    reason: "Anlık ışınım 880 W/m² seviyesinde ve üretim (6.2 kW) tüketimden (2.4 kW) yüksek. Akşam saatleri için bataryayı %100 seviyesine çıkarmak verimliliği maksimize eder.",
    expectedImpact: "+%14 pik saat enerji tasarrufu, sıfır şebeke çekişi.",
    timestamp: "2026-09-26T09:10:00Z",
    actionCommand: "PRIORITIZE_BATTERY_CHARGE",
    status: "pending"
  },
  {
    id: "AI-REC-02",
    stationId: "ST-KNY-02",
    stationName: "Alaaddin Bulvarı",
    priority: "Orta",
    title: "Akşam Yoğunluğu Öncesi Rezerv Oluştur",
    reason: "17:30 - 19:30 saatleri arasında yolcu şarj talebi %65 artmaktadır. Mevcut SOC (%79.5) seviyesinin korunması önerilir.",
    expectedImpact: "Kesintisiz 8 port USB-C ve kablosuz şarj sürekliliği.",
    timestamp: "2026-09-26T08:55:00Z",
    actionCommand: "RESERVE_CAPACITY_PEAK",
    status: "pending"
  },
  {
    id: "AI-REC-03",
    stationId: "ST-KNY-03",
    stationName: "Selçuklu Kongre Merkezi",
    priority: "Yüksek",
    title: "Batarya Sıcaklığı Yüksek: Güç Sınırla & Tasarruf Moduna Geç",
    reason: "Hücre sıcaklığı 27.5°C'ye ulaştı ve SOC %38.6. Batarya ömrünü korumak için kablosuz şarj sınırlandırılmalı ve fan devri artırılmalı.",
    expectedImpact: "Hücre sıcaklığında 2.5°C düşüş, termal stres önleme.",
    timestamp: "2026-09-26T09:05:00Z",
    actionCommand: "POWER_THROTTLE_COOLING",
    status: "pending"
  },
  {
    id: "AI-REC-04",
    stationId: "ST-KNY-01",
    stationName: "Kampüs Ana Giriş",
    priority: "Düşük",
    title: "Şebeke Aktarım Değerlendirmesi",
    reason: "Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir. Fazla 22.8 kWh enerjinin şebeke senkron testi değerlendirilebilir.",
    expectedImpact: "Döngüsel mikro şebekeye temiz enerji katkısı.",
    timestamp: "2026-09-26T07:30:00Z",
    actionCommand: "SIMULATE_GRID_INJECTION",
    status: "pending"
  }
];

// Mock geri bildirim veritabanı
export const feedbackSubmissions = [
  {
    feedbackId: "FB-20260926-01",
    stationId: "ST-KNY-03",
    stationName: "Selçuklu Kongre Merkezi Akıllı Durak",
    issueType: "Şarj noktası sorunu",
    message: "2 numaralı USB-C soketi temassızlık yapıyor.",
    createdAt: "2026-09-26T08:30:00Z",
    status: "İnceleniyor"
  },
  {
    feedbackId: "FB-20260926-02",
    stationId: "ST-KNY-02",
    stationName: "Alaaddin Bulvarı Akıllı Durak",
    issueType: "Durak temiz değil",
    message: "Oturma alanında temizlik yapılması rica olunur.",
    createdAt: "2026-09-26T08:45:00Z",
    status: "Kayıt Alındı"
  }
];

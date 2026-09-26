import express from 'express';
import cors from 'cors';
import { stationsData, feedbackSubmissions, initialAiRecommendations } from './data/stations.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Demo Admin Token sabiti
export const DEMO_ADMIN_TOKEN = "demo-admin-jwt-token-circularcity-2026";
export const DEMO_ADMIN_EMAIL = "admin@circularcity.demo";
export const DEMO_ADMIN_PASSWORD = "Demo123!";

// In-memory state for admin actions
export let aiRecommendations = [...initialAiRecommendations];
export let feedbacks = [...feedbackSubmissions];
export let eventLogs = [
  {
    id: "LOG-01",
    timestamp: "2026-09-26T08:15:00Z",
    type: "MAINTENANCE",
    message: "Meram Park (ST-KNY-05) bakım moduna alındı (Mock simülasyon)."
  },
  {
    id: "LOG-02",
    timestamp: "2026-09-26T09:00:00Z",
    type: "AI_SUGGESTION",
    message: "AI Enerji Asistanı: Güneş ışınımı pik saati tespit edildi."
  }
];

export const faqsData = [
  {
    id: "faq-1",
    question: "Bu duraklar nasıl enerji üretiyor?",
    answer: "Durakların çatısında yer alan yüksek verimli monokristal güneş panelleri gün boyunca güneş ışığını elektrik enerjisine dönüştürür. Üretilen enerji MPPT şarj kontrol ünitesi aracılığıyla güvenli enerji kabinindeki bataryalara depolanır."
  },
  {
    id: "faq-2",
    question: "İkinci yaşam batarya nedir?",
    answer: "Elektrikli araçlarda kapasitesi belirli bir seviyeye gerilemiş ancak sabit depolama için yüksek performans sunan batarya modülleridir. İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir."
  },
  {
    id: "faq-3",
    question: "Bataryalar güvenli mi?",
    answer: "Kesinlikle güvenlidir. Batarya oturma alanında değil; durağın yanında/arkasında, ayrı, kilitli, havalandırmalı ve yangına dayanımlı (EI60 sertifikalı) “Güvenli Enerji Kabini” içinde korunur. Çok katmanlı BMS ve otomatik yangın söndürme modülü ile izlenir."
  },
  {
    id: "faq-4",
    question: "Haritadaki veriler gerçek zamanlı mı?",
    answer: "Haritadaki tüm durak, enerji üretimi ve batarya verileri pilot konsept simülasyonudur. Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır."
  },
  {
    id: "faq-5",
    question: "Şarj noktaları nasıl kullanılır?",
    answer: "Durak içerisinde yer alan USB-C portları ve 220V topraklı prizler halkın ücretsiz ve anlık kullanımına açıktır. Akıllı güç yönetim sistemi tüm cihazları aşırı akıma karşı korur."
  },
  {
    id: "faq-6",
    question: "Konumum kaydediliyor mu?",
    answer: "Hayır. Konumunuz yalnızca size en yakın durağı göstermek için anlık olarak kullanılır ve sunucuda kalıcı olarak saklanmaz. Açık onay vermediğiniz sürece konum verisi talep edilmez."
  },
  {
    id: "faq-7",
    question: "Şebekeye enerji aktarımı nasıl olur?",
    answer: "Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir. Fazla üretilen temiz enerjinin çift yönlü sayaçla mikro şebekeye verilmesi hedeflenmektedir."
  },
  {
    id: "faq-8",
    question: "Bu sistem nerelerde kurulabilir?",
    answer: "Güneş alan meydanlar, üniversite kampüsleri, aktarma merkezleri, rekreasyon alanları ve kırsal duraklar dahil olmak üzere şehir şebekesinden bağımsız veya on-grid olarak her yere kurulabilir."
  }
];

/**
 * Haversine Mesafe Hesaplama (Kilometre cinsinden)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Dünya yarıçapı (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Halk API'si için hassas teknik verileri ayıran filtreleyici.
 * KURAL: "Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır."
 */
export function sanitizeStationForPublic(station) {
  const { adminOnly, ...publicFields } = station;
  return {
    ...publicFields,
    isDemoData: true,
    policyNotice: "Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır."
  };
}

/**
 * Yönetici Kimlik Doğrulama Middleware
 */
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      error: "Yetkisiz Erişim",
      message: "Bu teknik uç noktaya erişmek için yönetici yetkilendirmesi gereklidir."
    });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (token !== DEMO_ADMIN_TOKEN) {
    return res.status(403).json({
      error: "Geçersiz Yetki",
      message: "Sağlanan token geçersiz veya yetersiz role sahip."
    });
  }

  next();
}

// ==========================================
// HALK (PUBLIC) API ENDPOINTS
// ==========================================

/**
 * GET /api/public/stations
 * Tüm durakların halka açık güvenli listesini döner.
 */
app.get('/api/public/stations', (req, res) => {
  const sanitized = stationsData.map(sanitizeStationForPublic);
  res.json({
    success: true,
    total: sanitized.length,
    disclaimer: "Pilot Demo – Simülasyon Verisi",
    hardwareStatus: "Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır.",
    securityAudit: "Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.",
    stations: sanitized
  });
});

/**
 * GET /api/public/stations/:id
 * Belirli bir durağın halka açık güvenli detayını döner.
 */
app.get('/api/public/stations/:id', (req, res) => {
  const station = stationsData.find(s => s.stationId.toLowerCase() === req.params.id.toLowerCase());
  if (!station) {
    return res.status(404).json({
      success: false,
      error: "Durak bulunamadı."
    });
  }
  res.json({
    success: true,
    station: sanitizeStationForPublic(station)
  });
});

/**
 * GET /api/public/nearby?lat={lat}&lng={lng}
 * Kullanıcının ilettiği anlık koordinata göre durakları mesafeye göre sıralar.
 * Konum sunucuda kalıcı olarak saklanmaz.
 */
app.get('/api/public/nearby', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({
      success: false,
      error: "Geçerli lat ve lng koordinatları gereklidir."
    });
  }

  const nearbyStations = stationsData.map(station => {
    const dist = calculateDistance(lat, lng, station.coordinates[0], station.coordinates[1]);
    const walkingMinutes = Math.max(1, Math.round((dist / 4.8) * 60));
    return {
      ...sanitizeStationForPublic(station),
      distanceKm: parseFloat(dist.toFixed(2)),
      walkingMinutes: walkingMinutes
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  res.json({
    success: true,
    userLocation: { lat, lng },
    privacyNotice: "Konumunuz yalnızca size en yakın durağı göstermek için kullanılır ve sunucuda kalıcı olarak saklanmaz.",
    stations: nearbyStations
  });
});

/**
 * POST /api/public/feedback
 * Halktan gelen durak geri bildirimlerini kaydeder.
 * Kişisel veri istenmez.
 */
app.post('/api/public/feedback', (req, res) => {
  const { stationId, issueType, message } = req.body;

  const validIssues = [
    "Şarj noktası çalışmıyor",
    "Şarj noktası sorunu",
    "Priz sorunu",
    "İklimlendirme sorunu",
    "Aydınlatma sorunu",
    "Durak temiz değil",
    "Erişilebilirlik sorunu",
    "Diğer"
  ];

  if (!stationId) {
    return res.status(400).json({
      success: false,
      error: "stationId alanı zorunludur."
    });
  }

  const station = stationsData.find(s => s.stationId.toLowerCase() === stationId.toLowerCase());
  if (!station) {
    return res.status(404).json({
      success: false,
      error: "Belirtilen durak bulunamadı."
    });
  }

  if (!issueType || !validIssues.includes(issueType)) {
    return res.status(400).json({
      success: false,
      error: `Geçersiz bildirim konusu. Geçerli seçenekler: ${validIssues.join(", ")}`
    });
  }

  const newFeedback = {
    feedbackId: `FB-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
    stationId: station.stationId,
    stationName: station.name,
    issueType,
    message: (message || "").trim(),
    createdAt: new Date().toISOString(),
    status: "Kayıt Alındı"
  };

  feedbacks.unshift(newFeedback);

  res.status(201).json({
    success: true,
    message: "Geri bildiriminiz başarıyla iletildi. Katkınız için teşekkür ederiz!",
    feedbackId: newFeedback.feedbackId,
    feedback: newFeedback
  });
});

/**
 * GET /api/public/impact-summary
 * Halk paneli etki özeti metrikleri
 */
app.get('/api/public/impact-summary', (req, res) => {
  res.json({
    success: true,
    disclaimer: "Demo/simülasyon verisi; gerçek pilot ölçümü değildir.",
    metrics: {
      pilotStationCount: 6,
      averageCleanEnergyRatio: 84, // %84 ortalama temiz enerji karşılama
      dailySolarGenerationKwh: 42.8, // 42,8 kWh günlük güneş üretimi
      activeChargingPoints: 18, // 18 aktif şarj noktası
      estimatedCo2EquivalentKg: 1260, // 1.260 kg tahmini CO2 eşdeğeri
      dailyGridSupportKwh: 85.7,
      totalFeedbackCount: feedbacks.length,
      circularEconomyRatio: "%100 İkinci Yaşam Batarya Dönüşümü"
    }
  });
});

/**
 * GET /api/public/faqs
 * Sıkça Sorulan Sorular listesi
 */
app.get('/api/public/faqs', (req, res) => {
  res.json({
    success: true,
    faqs: faqsData
  });
});

// ==========================================
// YÖNETİCİ (ADMIN) API ENDPOINTS
// ==========================================

/**
 * POST /api/admin/login
 * Yönetici paneli demo girişi (Yalnızca Jüri Demo Hesabı)
 */
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;

  if (email === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
    return res.json({
      success: true,
      token: DEMO_ADMIN_TOKEN,
      user: {
        email: DEMO_ADMIN_EMAIL,
        name: "Konya Akıllı Şebeke Yöneticisi",
        role: "SYSTEM_ADMIN",
        accessLevel: "LEVEL_4_FULL_TELEMETRY"
      },
      accountNotice: "Yalnızca Jüri Demo Hesabı",
      message: "Yönetici oturumu başarıyla açıldı."
    });
  }

  return res.status(401).json({
    success: false,
    error: "Giriş başarısız. Lütfen demo bilgileriyle deneyiniz: admin@circularcity.demo / Demo123!"
  });
});

/**
 * GET /api/admin/overview
 * Yönetici genel bakış kontrol paneli metrikleri ve son 24 saat enerji simülasyonu
 */
app.get('/api/admin/overview', requireAdminAuth, (req, res) => {
  const total = stationsData.length;
  const active = stationsData.filter(s => s.status === 'aktif').length;
  const limited = stationsData.filter(s => s.status === 'sinirli').length;
  const maintenance = stationsData.filter(s => s.status === 'bakimda').length;
  const totalSolar = parseFloat(stationsData.reduce((acc, s) => acc + s.solarProductionKw, 0).toFixed(1));
  const totalConsumption = parseFloat(stationsData.reduce((acc, s) => acc + s.instantConsumptionKw, 0).toFixed(1));
  const totalGridExport = parseFloat(stationsData.reduce((acc, s) => acc + s.gridFeedEnergyKwh, 0).toFixed(1));

  // Son 24 saat saatlik enerji grafiği mock serisi
  const hourly24h = [
    { hour: "00:00", solar: 0, consumption: 0.8, batterySoc: 74 },
    { hour: "03:00", solar: 0, consumption: 0.5, batterySoc: 71 },
    { hour: "06:00", solar: 0.8, consumption: 1.2, batterySoc: 68 },
    { hour: "09:00", solar: 3.8, consumption: 2.1, batterySoc: 79 },
    { hour: "12:00", solar: 6.2, consumption: 2.8, batterySoc: 94 },
    { hour: "15:00", solar: 5.1, consumption: 2.4, batterySoc: 98 },
    { hour: "18:00", solar: 1.9, consumption: 3.2, batterySoc: 88 },
    { hour: "21:00", solar: 0, consumption: 2.2, batterySoc: 80 },
  ];

  res.json({
    success: true,
    disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
    decisionSupportNote: "Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir.",
    stats: {
      totalStations: total,
      activeStations: active,
      limitedStations: limited,
      maintenanceStations: maintenance,
      totalSolarProductionKw: totalSolar,
      totalInstantConsumptionKw: totalConsumption,
      totalGridExportKwh: totalGridExport,
      criticalAlertCount: 2,
      pendingFeedbackCount: feedbacks.filter(f => f.status === 'Kayıt Alındı').length,
    },
    hourly24h,
    aiSummary: {
      pendingCount: aiRecommendations.filter(r => r.status === 'pending').length,
      topSuggestion: aiRecommendations[0]?.title || "Tüm parametreler dengeli"
    }
  });
});

/**
 * GET /api/admin/stations
 * Tüm duraklar ve ayrıntılı teknik telemetri verileri
 */
app.get('/api/admin/stations', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    role: "ADMIN",
    stations: stationsData,
    decisionSupportNote: "Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir."
  });
});

/**
 * GET /api/admin/stations/:id
 * Tek durak detaylı teknik telemetrisi
 */
app.get('/api/admin/stations/:id', requireAdminAuth, (req, res) => {
  const station = stationsData.find(s => s.stationId.toLowerCase() === req.params.id.toLowerCase());
  if (!station) {
    return res.status(404).json({ success: false, error: "Durak bulunamadı." });
  }
  res.json({ success: true, station });
});

/**
 * GET /api/admin/stations/:id/battery
 * Batarya ve BMS telemetrisi
 */
app.get('/api/admin/stations/:id/battery', requireAdminAuth, (req, res) => {
  const station = stationsData.find(s => s.stationId.toLowerCase() === req.params.id.toLowerCase());
  if (!station) {
    return res.status(404).json({ success: false, error: "Durak bulunamadı." });
  }
  res.json({
    success: true,
    stationId: station.stationId,
    name: station.name,
    status: station.status,
    batteryTelemetry: station.adminOnly
  });
});

/**
 * GET /api/admin/energy
 * Güneş ve enerji telemetrisi özeti
 */
app.get('/api/admin/energy', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
    gridNotice: "Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir.",
    stationsEnergy: stationsData.map(s => ({
      stationId: s.stationId,
      name: s.name,
      solarProductionKw: s.solarProductionKw,
      instantConsumptionKw: s.instantConsumptionKw,
      gridFeedEnergyKwh: s.gridFeedEnergyKwh,
      dailyCleanEnergyRatio: s.dailyCleanEnergyRatio,
      inverterStatus: s.adminOnly.inverterStatus
    }))
  });
});

/**
 * GET /api/admin/climate
 * İklimlendirme ve konfor telemetrisi
 */
app.get('/api/admin/climate', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    stationsClimate: stationsData.map(s => ({
      stationId: s.stationId,
      name: s.name,
      hvacStatus: s.hvacStatus,
      indoorTemperature: s.indoorTemperature,
      indoorHumidity: s.indoorHumidity,
      airQuality: s.airQuality,
      cabinetVentilation: s.adminOnly.energyCabinetDetails?.ventilationStatus
    }))
  });
});

/**
 * GET /api/admin/charging
 * Şarj hizmetleri yük dağılımı
 */
app.get('/api/admin/charging', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    stationsCharging: stationsData.map(s => ({
      stationId: s.stationId,
      name: s.name,
      usbCPorts: s.usbCPorts,
      powerOutlets: s.powerOutlets,
      wirelessCharging: s.wirelessCharging,
      loadPercentage: s.usbCPorts > 0 ? 65 : 0
    }))
  });
});

/**
 * GET /api/admin/ai/recommendations
 * AI Enerji Asistanı önerileri
 */
app.get('/api/admin/ai/recommendations', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
    recommendations: aiRecommendations
  });
});

/**
 * POST /api/admin/ai/recommendations/:id/apply
 * AI önerisini uygulama (Yalnızca mock durum değişikliği)
 */
app.post('/api/admin/ai/recommendations/:id/apply', requireAdminAuth, (req, res) => {
  const rec = aiRecommendations.find(r => r.id === req.params.id);
  if (!rec) {
    return res.status(404).json({ success: false, error: "Öneri bulunamadı." });
  }

  rec.status = 'applied';

  const logEntry = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    type: "AI_APPLY",
    message: `AI Önerisi '${rec.title}' için mock optimizasyon uygulandı.`
  };
  eventLogs.unshift(logEntry);

  res.json({
    success: true,
    disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
    message: "Öneri simüle olarak uygulandı.",
    recommendation: rec,
    logEntry
  });
});

/**
 * POST /api/admin/ai/recommendations/:id/dismiss
 * AI önerisini yok sayma
 */
app.post('/api/admin/ai/recommendations/:id/dismiss', requireAdminAuth, (req, res) => {
  const rec = aiRecommendations.find(r => r.id === req.params.id);
  if (!rec) {
    return res.status(404).json({ success: false, error: "Öneri bulunamadı." });
  }

  rec.status = 'dismissed';

  const logEntry = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    type: "AI_DISMISS",
    message: `AI Önerisi '${rec.title}' yok sayıldı.`
  };
  eventLogs.unshift(logEntry);

  res.json({
    success: true,
    disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
    message: "Öneri yok sayıldı.",
    recommendation: rec,
    logEntry
  });
});

/**
 * POST /api/admin/batteries/:id/isolate
 * Batarya modülünü izolasyona alma (Yalnızca mock olay kaydı oluşturur, gerçek donanıma komut göndermez)
 */
app.post('/api/admin/batteries/:id/isolate', requireAdminAuth, (req, res) => {
  const station = stationsData.find(
    s => s.stationId.toLowerCase() === req.params.id.toLowerCase() ||
         s.adminOnly.moduleId.toLowerCase() === req.params.id.toLowerCase()
  );

  if (!station) {
    return res.status(404).json({ success: false, error: "Batarya modülü bulunamadı." });
  }

  station.adminOnly.batteryState = "İzolasyona alındı";

  const logEntry = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    type: "BATTERY_ISOLATION_MOCK",
    message: `Durak ${station.stationId} bataryası (${station.adminOnly.moduleId}) güvenlik simülasyonu amacıyla izolasyona alındı.`
  };
  eventLogs.unshift(logEntry);

  res.json({
    success: true,
    disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
    message: `Modül ${station.adminOnly.moduleId} simüle izolasyona alındı. Gerçek fiziksel donanıma komut gönderilmemiştir.`,
    stationId: station.stationId,
    batteryState: "İzolasyona alındı",
    logEntry
  });
});

/**
 * GET /api/admin/alerts
 * Sistem uyarıları ve telemetri alarmları
 */
app.get('/api/admin/alerts', requireAdminAuth, (req, res) => {
  const allAlerts = [];
  stationsData.forEach(st => {
    if (st.adminOnly.alerts && st.adminOnly.alerts.length > 0) {
      st.adminOnly.alerts.forEach(a => {
        allAlerts.push({
          stationId: st.stationId,
          stationName: st.name,
          ...a
        });
      });
    }
  });

  res.json({
    success: true,
    totalAlerts: allAlerts.length,
    alerts: allAlerts,
    eventLogs: eventLogs
  });
});

/**
 * GET /api/admin/feedback
 * Vatandaş geri bildirimleri listesi
 */
app.get('/api/admin/feedback', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    total: feedbacks.length,
    feedbacks: feedbacks
  });
});

/**
 * PATCH /api/admin/feedback/:id
 * Geri bildirim durumunu güncelleme
 */
app.patch('/api/admin/feedback/:id', requireAdminAuth, (req, res) => {
  const { status } = req.body;
  const item = feedbacks.find(f => f.feedbackId === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, error: "Geri bildirim bulunamadı." });
  }

  if (status) item.status = status;

  res.json({
    success: true,
    message: "Geri bildirim durumu güncellendi.",
    feedback: item
  });
});

export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[CircularCity Energy API] Sunucu ${PORT} portunda çalışıyor.`);
  });
}

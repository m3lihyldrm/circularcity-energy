import { PublicStation, AdminStation, AdminAlert, FeedbackSubmission, AiRecommendation } from '../types';
import { fallbackStations } from './mockData';

const BASE_URL = '/api';

/**
 * Haversine Mesafe Hesaplama (Client-side offline fallback için)
 */
export function calculateClientDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

// ----------------------------------------------------
// HALK (PUBLIC) API İSTEMCİSİ
// ----------------------------------------------------

export async function getPublicStations(): Promise<PublicStation[]> {
  try {
    const res = await fetch(`${BASE_URL}/public/stations`);
    if (!res.ok) throw new Error('API Hatası');
    const data = await res.json();
    return data.stations;
  } catch (err) {
    console.warn('[API] Sunucuya erişilemedi, offline fallback verisi kullanılıyor.', err);
    return fallbackStations;
  }
}

export async function getStationDetail(stationId: string): Promise<PublicStation | null> {
  try {
    const res = await fetch(`${BASE_URL}/public/stations/${stationId}`);
    if (!res.ok) throw new Error('Durak bulunamadı');
    const data = await res.json();
    return data.station;
  } catch (err) {
    const found = fallbackStations.find(s => s.stationId.toLowerCase() === stationId.toLowerCase());
    return found || null;
  }
}

export async function getNearbyStations(lat: number, lng: number): Promise<PublicStation[]> {
  try {
    const res = await fetch(`${BASE_URL}/public/nearby?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error('Mesafe API Hatası');
    const data = await res.json();
    return data.stations;
  } catch (err) {
    return fallbackStations
      .map(station => {
        const dist = calculateClientDistance(lat, lng, station.coordinates[0], station.coordinates[1]);
        const walkingMin = Math.max(1, Math.round((dist / 4.8) * 60));
        return {
          ...station,
          distanceKm: dist,
          walkingMinutes: walkingMin
        };
      })
      .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }
}

export async function sendFeedback(payload: {
  stationId: string;
  issueType: string;
  message?: string;
}): Promise<{ success: boolean; message: string; feedbackId?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/public/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'İşlem başarısız');
    return data;
  } catch (err: any) {
    return {
      success: true,
      message: 'Geri bildiriminiz başarıyla iletildi (Çevrimdışı Simülasyon). Katkınız için teşekkür ederiz!',
      feedbackId: `FB-DEMO-${Date.now().toString().slice(-4)}`
    };
  }
}

export async function getImpactSummary(): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/public/impact-summary`);
    if (!res.ok) throw new Error('Etki verisi alınamadı');
    return await res.json();
  } catch {
    return {
      success: true,
      disclaimer: "Demo/simülasyon verisi; gerçek pilot ölçümü değildir.",
      metrics: {
        pilotStationCount: 6,
        averageCleanEnergyRatio: 84,
        dailySolarGenerationKwh: 42.8,
        activeChargingPoints: 18,
        estimatedCo2EquivalentKg: 1260,
        dailyGridSupportKwh: 85.7,
        totalFeedbackCount: 3,
        circularEconomyRatio: "%100 İkinci Yaşam Batarya Dönüşümü"
      }
    };
  }
}

export async function getFaqs(): Promise<any[]> {
  try {
    const res = await fetch(`${BASE_URL}/public/faqs`);
    if (!res.ok) throw new Error('SSS alınamadı');
    const data = await res.json();
    return data.faqs;
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// YÖNETİCİ (ADMIN) API İSTEMCİSİ
// ----------------------------------------------------

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Giriş başarısız' };
    }
    return { success: true, token: data.token };
  } catch (err: any) {
    if (email === 'admin@circularcity.demo' && password === 'Demo123!') {
      return { success: true, token: 'demo-admin-jwt-token-circularcity-2026' };
    }
    return { success: false, error: 'Giriş başarısız. Lütfen demo bilgileriyle deneyin: admin@circularcity.demo / Demo123!' };
  }
}

export async function getAdminOverview(token: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/admin/overview`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Yetkisiz erişim');
    return await res.json();
  } catch {
    return {
      success: true,
      disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
      decisionSupportNote: "Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir.",
      stats: {
        totalStations: 6,
        activeStations: 4,
        limitedStations: 1,
        maintenanceStations: 1,
        totalSolarProductionKw: 24.9,
        totalInstantConsumptionKw: 11.2,
        totalGridExportKwh: 85.7,
        criticalAlertCount: 2,
        pendingFeedbackCount: 2
      },
      hourly24h: [
        { hour: "00:00", solar: 0, consumption: 0.8, batterySoc: 74 },
        { hour: "03:00", solar: 0, consumption: 0.5, batterySoc: 71 },
        { hour: "06:00", solar: 0.8, consumption: 1.2, batterySoc: 68 },
        { hour: "09:00", solar: 3.8, consumption: 2.1, batterySoc: 79 },
        { hour: "12:00", solar: 6.2, consumption: 2.8, batterySoc: 94 },
        { hour: "15:00", solar: 5.1, consumption: 2.4, batterySoc: 98 },
        { hour: "18:00", solar: 1.9, consumption: 3.2, batterySoc: 88 },
        { hour: "21:00", solar: 0, consumption: 2.2, batterySoc: 80 }
      ],
      aiSummary: {
        pendingCount: 2,
        topSuggestion: "Güneş Üretimi Yüksek: Batarya Şarjına Öncelik Ver"
      }
    };
  }
}

export async function getAdminStations(token: string): Promise<AdminStation[]> {
  try {
    const res = await fetch(`${BASE_URL}/admin/stations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Yetkisiz erişim');
    const data = await res.json();
    return data.stations;
  } catch {
    return [];
  }
}

export async function getAdminStationBattery(stationId: string, token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/stations/${stationId}/battery`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Yetkisiz erişim');
  return res.json();
}

export async function getAdminEnergy(token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/energy`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Yetkisiz erişim');
  return res.json();
}

export async function getAdminClimate(token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/climate`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Yetkisiz erişim');
  return res.json();
}

export async function getAdminCharging(token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/admin/charging`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Yetkisiz erişim');
  return res.json();
}

export async function getAiRecommendations(token: string): Promise<{ recommendations: AiRecommendation[] }> {
  try {
    const res = await fetch(`${BASE_URL}/admin/ai/recommendations`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Yetkisiz erişim');
    return await res.json();
  } catch {
    return {
      recommendations: [
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
          stationId: "ST-KNY-03",
          stationName: "Selçuklu Kongre Merkezi",
          priority: "Orta",
          title: "Etkinlik Öncesi Şarj Rezervi Artırma",
          reason: "Selçuklu Kongre Merkezi'nde 14:00'te başlayacak sempozyum nedeniyle insan yoğunluğu ve USB-C şarj talebinde %60 artış öngörülmektedir.",
          expectedImpact: "Kesintisiz halk şarj hizmeti ve sıfır aşırı yükleme.",
          timestamp: "2026-09-26T09:30:00Z",
          actionCommand: "BOOST_RESERVE_CAPACITY",
          status: "pending"
        }
      ]
    };
  }
}

export async function applyAiRecommendation(id: string, token: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/admin/ai/recommendations/${id}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  } catch {
    return {
      success: true,
      disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
      message: "Öneri simüle olarak uygulandı."
    };
  }
}

export async function dismissAiRecommendation(id: string, token: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/admin/ai/recommendations/${id}/dismiss`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  } catch {
    return {
      success: true,
      disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
      message: "Öneri yok sayıldı."
    };
  }
}

export async function isolateBattery(stationId: string, token: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/admin/batteries/${stationId}/isolate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return await res.json();
  } catch {
    return {
      success: true,
      disclaimer: "Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.",
      message: `Durak ${stationId} bataryası simüle izolasyona alındı.`
    };
  }
}

export async function getAdminAlerts(token: string): Promise<{ alerts: AdminAlert[]; eventLogs?: any[] }> {
  try {
    const res = await fetch(`${BASE_URL}/admin/alerts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Yetkisiz erişim');
    return await res.json();
  } catch {
    return { alerts: [], eventLogs: [] };
  }
}

export async function getAdminFeedbacks(token: string): Promise<FeedbackSubmission[]> {
  try {
    const res = await fetch(`${BASE_URL}/admin/feedback`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Yetkisiz erişim');
    const data = await res.json();
    return data.feedbacks;
  } catch {
    return [];
  }
}

export async function updateFeedbackStatus(id: string, status: string, token: string): Promise<any> {
  try {
    const res = await fetch(`${BASE_URL}/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    return await res.json();
  } catch {
    return { success: true, message: "Geri bildirim durumu simüle güncellendi." };
  }
}

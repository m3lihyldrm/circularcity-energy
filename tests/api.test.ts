import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app, { DEMO_ADMIN_TOKEN, DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '../server/index.js';

describe('CircularCity Energy Backend API Testleri', () => {
  // 1. Public durak listeleme endpointi
  describe('1. Public Durak Listeleme Endpointi (GET /api/public/stations)', () => {
    it('Halk endpointi 6 pilot durağı ve simülasyon etiketini döner (200 OK)', async () => {
      const res = await request(app).get('/api/public/stations');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.stations)).toBe(true);
      expect(res.body.stations.length).toBe(6);
      expect(res.body.disclaimer).toContain('Pilot Demo – Simülasyon Verisi');
    });
  });

  // 2. Public API'nin teknik batarya verisi döndürmemesi
  describe('2. Public API Teknik Veri Sızıntısı Koruması', () => {
    it('Public API; seri numarası, hücre sıcaklıkları, SOC/SOH ham verisi, BMS hata kodu ve kilit bilgilerini döndürmez', async () => {
      const res = await request(app).get('/api/public/stations');
      expect(res.status).toBe(200);

      res.body.stations.forEach((st: any) => {
        expect(st.adminOnly).toBeUndefined();
        expect(st.batterySerialNumber).toBeUndefined();
        expect(st.moduleId).toBeUndefined();
        expect(st.chemistryType).toBeUndefined();
        expect(st.cellTemperatures).toBeUndefined();
        expect(st.sohRaw).toBeUndefined();
        expect(st.socRaw).toBeUndefined();
        expect(st.bmsStatus).toBeUndefined();
        expect(st.bmsFaultCode).toBeUndefined();
        expect(st.cabinetAccessInfo).toBeUndefined();
        expect(st.cabinetDoorStatus).toBeUndefined();
        expect(st.inverterCommands).toBeUndefined();
        expect(st.securityCameras).toBeUndefined();
        expect(st.technicalDiagnostics).toBeUndefined();
      });
    });

    it('Tekil durak halk endpointi (GET /api/public/stations/:id) de teknik verileri içermez', async () => {
      const res = await request(app).get('/api/public/stations/ST-KNY-01');
      expect(res.status).toBe(200);
      expect(res.body.station.name).toBe('Kampüs Ana Giriş Akıllı Durak');
      expect(res.body.station.adminOnly).toBeUndefined();
      expect(res.body.station.batterySerialNumber).toBeUndefined();
    });
  });

  // 3. Admin endpointinin yetkisiz erişimde 401/403 vermesi
  describe('3. Admin Endpointi Yetkisiz Erişim Koruması', () => {
    it('Yetkisiz istekte 401 Unauthorized döner', async () => {
      const res = await request(app).get('/api/admin/overview');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Yetkisiz Erişim');
    });

    it('Geçersiz token ile yapılan istekte 403 Forbidden döner', async () => {
      const res = await request(app)
        .get('/api/admin/stations')
        .set('Authorization', 'Bearer gecersiz-token-123');
      expect(res.status).toBe(403);
    });
  });

  // 4. Admin demo girişi
  describe('4. Admin Demo Girişi (POST /api/admin/login)', () => {
    it('Doğru demo kimlik bilgileriyle başarılı giriş yapar ve token üretir', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: DEMO_ADMIN_EMAIL,
          password: DEMO_ADMIN_PASSWORD
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBe(DEMO_ADMIN_TOKEN);
      expect(res.body.accountNotice).toBe('Yalnızca Jüri Demo Hesabı');
    });

    it('Hatalı şifrede 401 döner', async () => {
      const res = await request(app)
        .post('/api/admin/login')
        .send({
          email: DEMO_ADMIN_EMAIL,
          password: 'YanlisSifre!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // 5. Geri bildirim kaydı
  describe('5. Geri Bildirim Kaydı (POST /api/public/feedback)', () => {
    it('Geçerli geri bildirimi kaydeder, kişisel veri istemez ve takip kodu üretir', async () => {
      const res = await request(app)
        .post('/api/public/feedback')
        .send({
          stationId: 'ST-KNY-02',
          issueType: 'Priz sorunu',
          message: '220V priz kapağı gevşemiş.'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.feedbackId).toMatch(/^FB-/);
      expect(res.body.feedback.stationId).toBe('ST-KNY-02');
    });

    it('Geçersiz sorun türünde 400 döner', async () => {
      const res = await request(app)
        .post('/api/public/feedback')
        .send({
          stationId: 'ST-KNY-02',
          issueType: 'Tanımsız Konu'
        });

      expect(res.status).toBe(400);
    });
  });

  // 6. Yakın durak hesaplaması
  describe('6. Yakın Durak Hesaplaması (GET /api/public/nearby)', () => {
    it('Haversine formülü ile durakları mesafeye göre doğru sıralar', async () => {
      // Alaaddin Tepesi yakını: [37.8720, 32.4920]
      const res = await request(app)
        .get('/api/public/nearby')
        .query({ lat: 37.8720, lng: 32.4920 });

      expect(res.status).toBe(200);
      expect(res.body.stations.length).toBe(6);
      expect(res.body.stations[0].stationId).toBe('ST-KNY-02');
      expect(res.body.stations[0].distanceKm).toBeLessThan(0.5);

      for (let i = 0; i < res.body.stations.length - 1; i++) {
        expect(res.body.stations[i].distanceKm).toBeLessThanOrEqual(res.body.stations[i + 1].distanceKm);
      }
    });
  });

  // 7. AI önerisi uygulama/yok sayma
  describe('7. AI Enerji Asistanı Önerisi Uygulama / Yok Sayma', () => {
    it('AI önerisini uygular, gerçek donanıma komut göndermez ve simülasyon etiketi taşır', async () => {
      const res = await request(app)
        .post('/api/admin/ai/recommendations/AI-REC-01/apply')
        .set('Authorization', `Bearer ${DEMO_ADMIN_TOKEN}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.disclaimer).toBe('Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.');
      expect(res.body.recommendation.status).toBe('applied');
      expect(res.body.logEntry).toBeDefined();
    });

    it('AI önerisini yok sayar', async () => {
      const res = await request(app)
        .post('/api/admin/ai/recommendations/AI-REC-02/dismiss')
        .set('Authorization', `Bearer ${DEMO_ADMIN_TOKEN}`);

      expect(res.status).toBe(200);
      expect(res.body.recommendation.status).toBe('dismissed');
    });
  });

  // 8. Batarya izolasyonunun yalnızca mock olay üretmesi
  describe('8. Batarya İzolasyonu Mock Doğrulaması', () => {
    it('Batarya izolasyonu gerçek komut göndermez, mock olay kaydı üretir ve açıklama taşır', async () => {
      const res = await request(app)
        .post('/api/admin/batteries/ST-KNY-03/isolate')
        .set('Authorization', `Bearer ${DEMO_ADMIN_TOKEN}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.disclaimer).toBe('Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.');
      expect(res.body.batteryState).toBe('İzolasyona alındı');
      expect(res.body.logEntry.type).toBe('BATTERY_ISOLATION_MOCK');
    });
  });
});

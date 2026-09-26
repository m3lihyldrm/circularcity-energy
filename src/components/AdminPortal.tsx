import React, { useState, useEffect } from 'react';
import {
  Shield,
  Zap,
  Sun,
  Battery,
  Activity,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  LogOut,
  RefreshCw,
  Lock,
  Compass,
  AlertCircle,
  Info,
  Clock,
  Server,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { AdminStation, AdminAlert, FeedbackSubmission, AiRecommendation } from '../types';
import {
  loginAdmin,
  getAdminOverview,
  getAdminStations,
  getAiRecommendations,
  applyAiRecommendation,
  dismissAiRecommendation,
  isolateBattery,
  getAdminAlerts,
  getAdminFeedbacks,
  updateFeedbackStatus
} from '../services/api';

interface AdminPortalProps {
  onBackToPublic?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToPublic }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('cc_admin_token'));
  const [loginEmail, setLoginEmail] = useState('admin@circularcity.demo');
  const [loginPassword, setLoginPassword] = useState('Demo123!');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active admin tab
  type AdminTab =
    | 'overview'
    | 'stations'
    | 'batteries'
    | 'energy'
    | 'climate'
    | 'charging'
    | 'ai'
    | 'alerts'
    | 'feedback';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data states
  const [overview, setOverview] = useState<any>(null);
  const [stations, setStations] = useState<AdminStation[]>([]);
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [eventLogs, setEventLogs] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>(() => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));

  // Modal states
  const [isolationTarget, setIsolationTarget] = useState<AdminStation | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [selectedStationDetail, setSelectedStationDetail] = useState<AdminStation | null>(null);

  // Load admin data
  const loadAllAdminData = async (authToken: string) => {
    setIsLoading(true);
    try {
      const [ovData, stData, recData, alData, fbData] = await Promise.all([
        getAdminOverview(authToken),
        getAdminStations(authToken),
        getAiRecommendations(authToken),
        getAdminAlerts(authToken),
        getAdminFeedbacks(authToken)
      ]);

      setOverview(ovData);
      setStations(stData);
      setRecommendations(recData.recommendations || []);
      setAlerts(alData.alerts || []);
      setEventLogs(alData.eventLogs || []);
      setFeedbacks(fbData || []);
      setLastUpdatedTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Admin veri yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllAdminData(token);
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await loginAdmin(loginEmail, loginPassword);
      if (res.success && res.token) {
        setToken(res.token);
        localStorage.setItem('cc_admin_token', res.token);
      } else {
        setLoginError(res.error || 'Giriş yapılamadı.');
      }
    } catch {
      setLoginError('Bağlantı hatası. Lütfen tekrar deneyiniz.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('cc_admin_token');
  };

  const handleIsolateConfirm = async () => {
    if (!isolationTarget || !token) return;
    try {
      await isolateBattery(isolationTarget.stationId, token);
      setActionSuccessMessage(
        `${isolationTarget.name} bataryası simüle izolasyona alındı. Gerçek fiziksel donanıma komut gönderilmemiştir.`
      );
      setStations(prev =>
        prev.map(s =>
          s.stationId === isolationTarget.stationId
            ? {
                ...s,
                status: 'sinirli' as const,
                batteryReadiness: 'bakimda' as const,
                adminOnly: {
                  ...s.adminOnly,
                  batteryState: 'İzolasyona alındı' as const
                }
              }
            : s
        )
      );
      setIsolationTarget(null);
      setTimeout(() => setActionSuccessMessage(null), 6000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAiAction = async (recId: string, action: 'apply' | 'dismiss') => {
    if (!token) return;
    try {
      if (action === 'apply') {
        await applyAiRecommendation(recId, token);
        setActionSuccessMessage("Öneri simülasyonda uygulandı. Gerçek fiziksel donanıma komut gönderilmez.");
      } else {
        await dismissAiRecommendation(recId, token);
        setActionSuccessMessage("Öneri yok sayıldı.");
      }
      setRecommendations(prev =>
        prev.map(r => (r.id === recId ? { ...r, status: action === 'apply' ? 'applied' : 'dismissed' } : r))
      );
      setTimeout(() => setActionSuccessMessage(null), 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFeedbackStatusChange = async (feedbackId: string, newStatus: string) => {
    if (!token) return;
    try {
      await updateFeedbackStatus(feedbackId, newStatus, token);
      setFeedbacks(prev =>
        prev.map(f => (f.feedbackId === feedbackId ? { ...f, status: newStatus } : f))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // ----------------------------------------------------
  // GİRİŞ EKRANI (KURUMSAL SAKİN GÖRÜNÜM)
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F6F6F2] text-[#182019] flex flex-col justify-center items-center px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-white border border-[#DDE1DA] rounded-xl p-8 shadow-subtle space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E5F0EA] border border-[#1F5A43]/20 flex items-center justify-center text-[#1F5A43]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[#182019]">CircularCity Energy</h1>
              <p className="text-xs text-[#5D665E]">Yetkili Yönetim & Karar Destek Portalı</p>
            </div>
          </div>

          {/* Jüri Demo Hesabı Bilgisi */}
          <div className="p-3.5 bg-[#EFF0EB] border border-[#DDE1DA] rounded-lg text-xs text-[#5D665E] space-y-1">
            <div className="font-semibold text-[#182019] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#1F5A43]" />
              <span>Yalnızca Jüri Demo Hesabı</span>
            </div>
            <p className="leading-relaxed">
              Konya pilot değerlendirmesi için demo giriş bilgileri önceden tanımlanmıştır.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-[#FCECEC] border border-[#B94040]/30 rounded-lg text-[#B94040] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#182019] mb-1">E-Posta</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                className="w-full bg-[#F6F6F2] border border-[#DDE1DA] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#182019] focus:bg-white focus:border-[#1F5A43] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#182019] mb-1">Şifre</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                className="w-full bg-[#F6F6F2] border border-[#DDE1DA] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#182019] focus:bg-white focus:border-[#1F5A43] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold rounded-lg text-xs sm:text-sm shadow-subtle transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Giriş Doğrulanıyor...' : 'Yönetici Girişi Yap'}</span>
            </button>
          </form>

          {/* Hızlı Demo Bilgisi Doldurma */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@circularcity.demo');
                setLoginPassword('Demo123!');
              }}
              className="text-xs text-[#5D665E] hover:text-[#1F5A43] transition underline underline-offset-4"
            >
              Demo Bilgilerini Doldur (admin@circularcity.demo / Demo123!)
            </button>
          </div>

          {onBackToPublic && (
            <div className="pt-3 border-t border-[#DDE1DA] text-center">
              <button
                onClick={onBackToPublic}
                className="text-xs text-[#5D665E] hover:text-[#182019] transition"
              >
                ← Şehir Haritasına Dön
              </button>
            </div>
          )}

          <div className="p-2.5 bg-[#EFF0EB] rounded-lg text-[10px] text-[#5D665E] text-center leading-relaxed">
            Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GİRİŞ YAPILMIŞ YÖNETİCİ PORTALI (AÇIK RENK, SAKİN TEMA)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-[#F6F6F2] text-[#182019] flex flex-col font-sans">
      {/* Üst Şeffaflık Bandı */}
      <div className="bg-[#EFF0EB] border-b border-[#DDE1DA] px-4 sm:px-6 py-1.5 text-xs text-[#5D665E] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F5A43]" />
          <span className="font-semibold text-[#182019]">Pilot Demo</span>
          <span>·</span>
          <span>Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.</span>
        </div>
        <div className="text-[11px] text-[#5D665E] hidden md:block">
          Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir.
        </div>
      </div>

      {/* Aksiyon Bildirim Toast'ı */}
      {actionSuccessMessage && (
        <div className="fixed top-14 right-4 z-50 max-w-md bg-white border border-[#1F5A43]/40 shadow-elevated rounded-xl p-4 flex items-start gap-3 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-[#1F5A43] shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-[#1F5A43]">Simülasyon Güncellendi</div>
            <p className="text-xs text-[#5D665E] mt-0.5 leading-relaxed">{actionSuccessMessage}</p>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-[#5D665E] hover:text-[#182019]">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Ana Yönetici Başlığı ve Tab Menüsü */}
      <header className="bg-white border-b border-[#DDE1DA] px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5F0EA] border border-[#1F5A43]/20 flex items-center justify-center text-[#1F5A43]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#182019]">CircularCity Energy</h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#EFF0EB] text-[#5D665E] border border-[#DDE1DA] font-mono">
                  Yönetim Portalı
                </span>
              </div>
              <p className="text-[11px] text-[#5D665E]">Son güncelleme: {lastUpdatedTime} · 6 Pilot Durak</p>
            </div>
          </div>

          {/* Menü Tabları */}
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-thin">
            {[
              { id: 'overview', label: 'Genel Bakış', icon: Activity },
              { id: 'stations', label: 'Durak Yönetimi', icon: Compass },
              { id: 'batteries', label: 'Batarya Yönetimi', icon: Battery },
              { id: 'energy', label: 'Güneş & Enerji', icon: Sun },
              { id: 'climate', label: 'İklim & Konfor', icon: Thermometer },
              { id: 'charging', label: 'Şarj Hizmetleri', icon: Zap },
              { id: 'ai', label: 'Enerji Planlama Önerileri', icon: CheckCircle2 },
              { id: 'alerts', label: 'Uyarılar & Olaylar', icon: AlertTriangle },
              { id: 'feedback', label: 'Vatandaş Bildirimleri', icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E5F0EA] text-[#1F5A43] font-semibold border border-[#1F5A43]/30'
                      : 'text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1F5A43]' : 'text-[#5D665E]'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Aksiyon Butonları */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => token && loadAllAdminData(token)}
              disabled={isLoading}
              title="Yenile"
              className="p-2 rounded-lg border border-[#DDE1DA] bg-white text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2] transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#1F5A43]' : ''}`} />
            </button>

            {onBackToPublic && (
              <button
                onClick={onBackToPublic}
                className="px-3 py-1.5 rounded-lg border border-[#DDE1DA] bg-white text-xs font-medium text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2] transition hidden sm:inline-block"
              >
                Halk Görünümü
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#B94040]/30 bg-white text-[#B94040] hover:bg-[#FCECEC] text-xs font-medium transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* İÇERİK ALANI */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* ---------------------------------------------------- */}
        {/* TAB 1: GENEL BAKIŞ (SADE 4 ÖZET METRİK + 1 GRAFİK)    */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 ÖZET METRİK KARTI (İstenen net format) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#DDE1DA] p-4 rounded-xl shadow-subtle space-y-1">
                <span className="text-xs text-[#5D665E] font-medium block">Operasyonel Duraklar</span>
                <div className="text-2xl font-bold text-[#182019] tabular-nums">
                  5 <span className="text-xs font-normal text-[#5D665E]">/ 6 Aktif</span>
                </div>
                <div className="text-[11px] text-[#1F5A43] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 4 Tam Aktif, 1 Sınırlı
                </div>
              </div>

              <div className="bg-white border border-[#DDE1DA] p-4 rounded-xl shadow-subtle space-y-1">
                <span className="text-xs text-[#5D665E] font-medium block">Günlük Üretim</span>
                <div className="text-2xl font-bold text-[#D59B2E] tabular-nums">
                  {overview?.stats?.totalSolarProductionKw ?? '24.9'} <span className="text-xs font-normal text-[#5D665E]">kW</span>
                </div>
                <div className="text-[11px] text-[#5D665E]">Anlık güneş enerjisi toplamı</div>
              </div>

              <div className="bg-white border border-[#DDE1DA] p-4 rounded-xl shadow-subtle space-y-1">
                <span className="text-xs text-[#5D665E] font-medium block">Günlük Tüketim</span>
                <div className="text-2xl font-bold text-[#416D86] tabular-nums">
                  {overview?.stats?.totalInstantConsumptionKw ?? '11.2'} <span className="text-xs font-normal text-[#5D665E]">kW</span>
                </div>
                <div className="text-[11px] text-[#5D665E]">Aydınlatma, HVAC ve şarj yükü</div>
              </div>

              <div className="bg-white border border-[#DDE1DA] p-4 rounded-xl shadow-subtle space-y-1">
                <span className="text-xs text-[#5D665E] font-medium block">Açık Uyarılar</span>
                <div className="text-2xl font-bold text-[#B7791F] tabular-nums">
                  {alerts.filter(a => a.level === 'critical' || a.level === 'warning').length || 2} <span className="text-xs font-normal text-[#5D665E]">İkaz</span>
                </div>
                <div className="text-[11px] text-[#B7791F]">BMS ve filtre bakım ikazları</div>
              </div>
            </div>

            {/* ANA GRAFİK & OPERASYON NOTLARI DÜZENİ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sol: 24 Saatlik Enerji Dengesi Grafiği */}
              <div className="lg:col-span-8 bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-3">
                <div className="flex items-center justify-between border-b border-[#DDE1DA] pb-2.5">
                  <div>
                    <h3 className="text-sm font-bold text-[#182019]">24 Saatlik Enerji Dengesi</h3>
                    <p className="text-xs text-[#5D665E]">Güneş üretimi (kW), tüketim (kW) ve batarya doluluk oranı (%)</p>
                  </div>
                  <span className="text-[11px] text-[#5D665E] font-mono bg-[#F6F6F2] px-2 py-0.5 rounded border border-[#DDE1DA]">
                    Simülasyon Modeli
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={overview?.hourly24h || [
                        { hour: "00:00", solar: 0, consumption: 0.8, batterySoc: 74 },
                        { hour: "03:00", solar: 0, consumption: 0.5, batterySoc: 71 },
                        { hour: "06:00", solar: 0.8, consumption: 1.2, batterySoc: 68 },
                        { hour: "09:00", solar: 3.8, consumption: 2.1, batterySoc: 79 },
                        { hour: "12:00", solar: 6.2, consumption: 2.8, batterySoc: 94 },
                        { hour: "15:00", solar: 5.1, consumption: 2.4, batterySoc: 98 },
                        { hour: "18:00", solar: 1.9, consumption: 3.2, batterySoc: 88 },
                        { hour: "21:00", solar: 0, consumption: 2.2, batterySoc: 80 }
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="adminSolar" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#D59B2E" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#D59B2E" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="adminCons" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#416D86" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#416D86" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="adminSoc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1F5A43" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#1F5A43" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE6" />
                      <XAxis dataKey="hour" stroke="#5D665E" fontSize={11} tickLine={false} />
                      <YAxis stroke="#5D665E" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#DDE1DA',
                          borderRadius: '8px',
                          color: '#182019',
                          fontSize: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                      <Area type="monotone" dataKey="solar" name="Güneş (kW)" stroke="#D59B2E" strokeWidth={2} fill="url(#adminSolar)" />
                      <Area type="monotone" dataKey="consumption" name="Tüketim (kW)" stroke="#416D86" strokeWidth={2} fill="url(#adminCons)" />
                      <Area type="monotone" dataKey="batterySoc" name="Batarya SOC (%)" stroke="#1F5A43" strokeWidth={2} fill="url(#adminSoc)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-[11px] text-[#5D665E] pt-2 border-t border-[#DDE1DA]">
                  Demo verisi – fiziksel pilot ölçümü değildir.
                </div>
              </div>

              {/* Sağ: Operasyon Notları Listesi */}
              <div className="lg:col-span-4 bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#182019] border-b border-[#DDE1DA] pb-2.5">
                    Operasyon Notları
                  </h3>

                  <div className="space-y-2.5 pt-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] space-y-1">
                      <div className="flex items-center justify-between font-semibold text-[#182019]">
                        <span>Selçuklu Kongre Merkezi</span>
                        <span className="text-[10px] text-[#B7791F] font-mono">Sınırlı Mod</span>
                      </div>
                      <p className="text-[11px] text-[#5D665E]">
                        Filtre temizliği planlandı. Batarya şarjı %38.6 seviyesinde güvenle tutuluyor.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] space-y-1">
                      <div className="flex items-center justify-between font-semibold text-[#182019]">
                        <span>Karatay Bilim Merkezi</span>
                        <span className="text-[10px] text-[#1F5A43] font-mono">Yüksek Üretim</span>
                      </div>
                      <p className="text-[11px] text-[#5D665E]">
                        Anlık güneş ışınımı 880 W/m² seviyesinde. Batarya şarjına öncelik veriliyor.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] space-y-1">
                      <div className="flex items-center justify-between font-semibold text-[#182019]">
                        <span>Meram Park</span>
                        <span className="text-[10px] text-[#B94040] font-mono">Bakımda</span>
                      </div>
                      <p className="text-[11px] text-[#5D665E]">
                        Yıllık mekanik kabin denetimi devam ediyor. Yolcu hizmeti geçici sınırlı.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#DDE1DA] text-[11px] text-[#5D665E]">
                  Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: DURAK YÖNETİMİ (STATION MANAGEMENT)           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'stations' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#182019]">Konya Pilot Durak Telemetri Listesi</h3>
                <p className="text-xs text-[#5D665E]">6 pilot durağın anlık çalışma ve donanım durumu</p>
              </div>
              <span className="text-xs text-[#5D665E]">Toplam 6 durak</span>
            </div>

            <div className="bg-white border border-[#DDE1DA] rounded-xl overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F6F6F2] text-[#5D665E] uppercase tracking-wider font-semibold border-b border-[#DDE1DA]">
                    <tr>
                      <th className="py-3 px-4">Durak / Kod</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Güneş</th>
                      <th className="py-3 px-4">Tüketim</th>
                      <th className="py-3 px-4">Temiz Enerji</th>
                      <th className="py-3 px-4">Kabin Konumu</th>
                      <th className="py-3 px-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE1DA] text-[#182019]">
                    {stations.map(st => (
                      <tr key={st.stationId} className="hover:bg-[#F6F6F2] transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#182019]">{st.name}</div>
                          <div className="text-[11px] font-mono text-[#5D665E]">{st.stationId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              st.status === 'aktif'
                                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/30'
                                : st.status === 'sinirli'
                                ? 'bg-[#FFF7E6] text-[#B7791F] border-[#B7791F]/30'
                                : 'bg-[#FCECEC] text-[#B94040] border-[#B94040]/30'
                            }`}
                          >
                            {st.status === 'aktif' ? 'Aktif' : st.status === 'sinirli' ? 'Sınırlı' : 'Bakımda'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-[#D59B2E]">{st.solarProductionKw} kW</td>
                        <td className="py-3 px-4 font-mono font-medium text-[#416D86]">{st.instantConsumptionKw} kW</td>
                        <td className="py-3 px-4 font-mono font-medium text-[#1F5A43]">%{st.dailyCleanEnergyRatio}</td>
                        <td className="py-3 px-4 text-[#5D665E]">
                          <div>{st.adminOnly.energyCabinetDetails?.exactPosition || "Ayrı Güvenli Kabin"}</div>
                          <span className="text-[10px] text-[#1F5A43] font-mono">EI60 Yangın Dayanımı</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedStationDetail(st)}
                            className="px-2.5 py-1 rounded-lg border border-[#DDE1DA] hover:bg-[#EFF0EB] text-[#182019] text-xs font-medium transition"
                          >
                            Teknik Detay →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 3: BATARYA YÖNETİMİ (SAKİN TEKNİK TABLO)          */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'batteries' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#182019]">İkinci Yaşam Batarya Modülleri & BMS Telemetrisi</h3>
                <p className="text-xs text-[#5D665E]">Durağın oturma alanında bulunmayan, dış güvenli kabindeki EV bataryaları</p>
              </div>
              <div className="text-xs text-[#5D665E] bg-white border border-[#DDE1DA] p-2 rounded-lg max-w-md">
                İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => {
                const b = st.adminOnly;
                const isIsolated = b.batteryState === 'İzolasyona alındı';

                return (
                  <div
                    key={st.stationId}
                    className={`bg-white border rounded-xl p-5 space-y-3.5 shadow-subtle ${
                      isIsolated ? 'border-[#B94040]/40 bg-[#FCECEC]/20' : 'border-[#DDE1DA]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 border-b border-[#DDE1DA] pb-2.5">
                      <div>
                        <div className="text-[11px] font-mono text-[#1F5A43]">{b.moduleId}</div>
                        <h4 className="text-sm font-bold text-[#182019]">{st.name}</h4>
                        <div className="text-[10px] text-[#5D665E]">Seri: {b.batterySerialNumber}</div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isIsolated
                            ? 'bg-[#FCECEC] text-[#B94040] border-[#B94040]/30'
                            : 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/30'
                        }`}
                      >
                        {b.batteryState}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-[#F6F6F2] p-3 rounded-lg border border-[#DDE1DA]">
                      <div>
                        <span className="text-[10px] text-[#5D665E] block">Kimya</span>
                        <span className="font-semibold text-[#182019]">{b.chemistryType}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5D665E] block">SOH (Sağlık)</span>
                        <span className="font-semibold text-[#1F5A43]">%{b.sohRaw}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5D665E] block">SOC (Doluluk)</span>
                        <span className="font-semibold text-[#D59B2E]">%{b.socRaw}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#5D665E] block">Döngü Sayısı</span>
                        <span className="font-semibold text-[#182019]">{b.cycleCount} çevrim</span>
                      </div>
                    </div>

                    {/* Hücre Sıcaklıkları */}
                    <div className="text-xs space-y-1">
                      <span className="text-[11px] text-[#5D665E] block">Hücre Sıcaklıkları (°C):</span>
                      <div className="flex gap-1.5 font-mono text-[11px]">
                        {b.cellTemperatures.map((temp, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-[#EFF0EB] rounded border border-[#DDE1DA] text-[#182019]">
                            H{idx + 1}: {temp}°
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* İzolasyon Butonu (Sakin ikincil aksiyon formatı) */}
                    <div className="pt-2 border-t border-[#DDE1DA] space-y-1.5">
                      <div className="text-[10px] text-[#5D665E]">
                        Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.
                      </div>
                      {isIsolated ? (
                        <div className="p-2 bg-[#FCECEC] border border-[#B94040]/30 rounded-lg text-[#B94040] text-xs font-medium text-center">
                          Modül İzolasyonda (Simülasyon Modu)
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsolationTarget(st)}
                          className="w-full py-1.5 px-3 bg-white hover:bg-[#FCECEC] text-[#B94040] border border-[#B94040]/30 rounded-lg text-xs font-medium transition"
                        >
                          Test senaryosunda izole et
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 4: GÜNEŞ & ENERJİ                                 */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'energy' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#182019]">Güneş Üretimi, İnverter & Şebeke Aktarımı</h3>
              <p className="text-xs text-[#5D665E]">
                Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => (
                <div key={st.stationId} className="bg-white border border-[#DDE1DA] rounded-xl p-5 space-y-2.5 shadow-subtle">
                  <div className="flex justify-between items-center border-b border-[#DDE1DA] pb-2">
                    <h4 className="text-sm font-bold text-[#182019]">{st.name}</h4>
                    <span className="text-xs font-mono font-semibold text-[#D59B2E]">{st.solarProductionKw} kW</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#DDE1DA]">
                      <span className="text-[#5D665E]">İnverter:</span>
                      <span className="font-medium text-[#1F5A43]">{st.adminOnly.inverterStatus}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DDE1DA]">
                      <span className="text-[#5D665E]">Temiz Enerji Oranı:</span>
                      <span className="font-medium text-[#1F5A43]">%{st.dailyCleanEnergyRatio}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DDE1DA]">
                      <span className="text-[#5D665E]">Anlık Yük Tüketimi:</span>
                      <span className="font-medium text-[#416D86]">{st.instantConsumptionKw} kW</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#5D665E]">Şebekeye Verilen Fazla:</span>
                      <span className="font-medium text-[#1F5A43]">+{st.gridFeedEnergyKwh} kWh / gün</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: İKLİMLENDİRME VE KONFOR                       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'climate' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#182019]">Durak İçi İklimlendirme ve Hava Kalitesi</h3>
              <p className="text-xs text-[#5D665E]">Bekleme alanı sıcaklığı, nem, AQI ve güvenli enerji kabini havalandırması</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => (
                <div key={st.stationId} className="bg-white border border-[#DDE1DA] rounded-xl p-5 space-y-3 shadow-subtle">
                  <div className="flex justify-between items-center border-b border-[#DDE1DA] pb-2">
                    <h4 className="text-sm font-bold text-[#182019]">{st.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-medium">
                      {st.hvacStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-[#F6F6F2] rounded-lg border border-[#DDE1DA] text-xs">
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">Sıcaklık</span>
                      <span className="font-bold text-[#182019] text-sm">{st.indoorTemperature}°C</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">Nem</span>
                      <span className="font-bold text-[#182019] text-sm">%{st.indoorHumidity}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">Hava</span>
                      <span className="font-bold text-[#1F5A43] text-sm">{st.airQuality.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-[#5D665E]">
                    <div className="flex justify-between text-[11px]">
                      <span>Kabin Havalandırması:</span>
                      <span className="text-[#1F5A43] font-medium">{st.adminOnly.energyCabinetDetails?.ventilationStatus}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Kabin İçi Sıcaklık:</span>
                      <span className="text-[#182019] font-medium">{st.adminOnly.energyCabinetDetails?.internalTemperature}°C</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: ŞARJ HİZMETLERİ                               */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'charging' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-[#182019]">Halk Şarj Hizmetleri ve Yük Dağılımı</h3>
              <p className="text-xs text-[#5D665E]">USB-C portları, 220V prizler ve kablosuz şarj kapasitesi</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => (
                <div key={st.stationId} className="bg-white border border-[#DDE1DA] rounded-xl p-5 space-y-3 shadow-subtle">
                  <div className="flex justify-between items-center border-b border-[#DDE1DA] pb-2">
                    <h4 className="text-sm font-bold text-[#182019]">{st.name}</h4>
                    <span className="text-xs font-mono font-medium text-[#1F5A43]">{st.usbCPorts}x USB-C</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#5D665E]">
                    <div className="flex justify-between py-1 border-b border-[#DDE1DA]">
                      <span>220V Topraklı Priz:</span>
                      <span className="font-medium text-[#182019]">{st.powerOutlets} Adet</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#DDE1DA]">
                      <span>Kablosuz Şarj Pedi:</span>
                      <span className="font-medium text-[#182019]">{st.wirelessCharging ? '15W Qi' : 'Yok'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Kullanım Durumu:</span>
                      <span className="font-medium text-[#1F5A43]">{st.usbCPorts > 0 ? 'Aktif' : 'Servis Dışı'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 7: ENERJİ PLANLAMA ÖNERİLERİ (ESKİ AI ASİSTANI)  */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#182019]">Enerji Planlama Önerileri</h3>
                <p className="text-xs text-[#5D665E]">
                  Işınım tahmini, etkinlik yoğunluğu ve şebeke optimizasyonu için karar destek tablosu
                </p>
              </div>
              <div className="text-xs text-[#5D665E] bg-white border border-[#DDE1DA] px-3 py-1.5 rounded-lg">
                Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.
              </div>
            </div>

            <div className="space-y-3">
              {recommendations.map(rec => {
                const isPending = rec.status === 'pending';
                const isApplied = rec.status === 'applied';

                return (
                  <div
                    key={rec.id}
                    className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle flex flex-wrap md:flex-nowrap items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border ${
                            rec.priority === 'Yüksek'
                              ? 'bg-[#FCECEC] text-[#B94040] border-[#B94040]/30'
                              : 'bg-[#FFF7E6] text-[#B7791F] border-[#B7791F]/30'
                          }`}
                        >
                          {rec.priority} Öncelik
                        </span>
                        <span className="text-xs font-mono text-[#5D665E]">{rec.stationName}</span>
                      </div>

                      <h4 className="text-sm font-bold text-[#182019]">{rec.title}</h4>

                      {/* Neden Gösteriliyor ve Beklenen Etki (İstenen net format) */}
                      <div className="space-y-1 text-xs">
                        <div>
                          <strong className="text-[#182019]">Neden gösteriliyor? </strong>
                          <span className="text-[#5D665E]">{rec.reason}</span>
                        </div>
                        <div>
                          <strong className="text-[#1F5A43]">Beklenen etki: </strong>
                          <span className="text-[#174634]">{rec.expectedImpact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 shrink-0 w-full md:w-auto">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleAiAction(rec.id, 'apply')}
                            className="px-4 py-2 bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow-subtle"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Simülasyonda uygula</span>
                          </button>
                          <span className="text-[10px] text-[#5D665E] text-center">
                            Gerçek donanıma komut gönderilmez.
                          </span>
                          <button
                            onClick={() => handleAiAction(rec.id, 'dismiss')}
                            className="px-4 py-1.5 bg-white hover:bg-[#F6F6F2] text-[#5D665E] border border-[#DDE1DA] rounded-lg text-xs font-medium transition"
                          >
                            Yok say
                          </button>
                        </>
                      ) : isApplied ? (
                        <span className="px-3 py-1.5 rounded-lg bg-[#E5F0EA] text-[#1F5A43] text-xs font-semibold flex items-center gap-1.5 border border-[#1F5A43]/30">
                          <CheckCircle className="w-4 h-4" /> Uygulandı (Simülasyon)
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-[#EFF0EB] text-[#5D665E] text-xs font-semibold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Yok sayıldı
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 8: UYARILAR VE OLAYLAR                           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-[#182019]">Sistem Uyarıları & Simüle Olay Kayıtları</h3>
              <p className="text-xs text-[#5D665E]">Sensör ikazları ve simülasyon aksiyon günlükleri</p>
            </div>

            <div className="space-y-2.5">
              {alerts.length === 0 ? (
                <div className="p-4 bg-white border border-[#DDE1DA] rounded-xl text-xs text-[#5D665E]">
                  Aktif kritik alarm bulunmuyor.
                </div>
              ) : (
                alerts.map(a => (
                  <div
                    key={a.id}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      a.level === 'critical'
                        ? 'bg-[#FCECEC] border-[#B94040]/30 text-[#B94040]'
                        : 'bg-[#FFF7E6] border-[#B7791F]/30 text-[#B7791F]'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="font-semibold flex items-center justify-between">
                        <span>{a.stationName || a.stationId}</span>
                        <span className="font-mono text-[11px] opacity-75">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="mt-0.5 text-[#182019]">{a.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Olay Günlüğü */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-[#182019] uppercase tracking-wider">Olay Günlüğü (Event Logs)</h4>
              <div className="bg-white border border-[#DDE1DA] rounded-xl divide-y divide-[#DDE1DA] text-xs shadow-subtle">
                {eventLogs.map(log => (
                  <div key={log.id} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-[#5D665E]" />
                      <div>
                        <span className="font-mono text-[#1F5A43] text-[11px] mr-2">[{log.type}]</span>
                        <span className="text-[#182019]">{log.message}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#5D665E] shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 9: VATANDAŞ BİLDİRİMLERİ                         */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#182019]">Vatandaş Geri Bildirimleri</h3>
                <p className="text-xs text-[#5D665E]">Halk ekranından iletilen anonim durak bildirimleri</p>
              </div>
              <span className="text-xs text-[#5D665E]">{feedbacks.length} Bildirim</span>
            </div>

            <div className="bg-white border border-[#DDE1DA] rounded-xl overflow-hidden shadow-subtle">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F6F6F2] text-[#5D665E] uppercase tracking-wider font-semibold border-b border-[#DDE1DA]">
                    <tr>
                      <th className="py-3 px-4">Takip No / Tarih</th>
                      <th className="py-3 px-4">Durak</th>
                      <th className="py-3 px-4">Konu</th>
                      <th className="py-3 px-4">Açıklama</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4 text-right">Güncelle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDE1DA] text-[#182019]">
                    {feedbacks.map(f => (
                      <tr key={f.feedbackId} className="hover:bg-[#F6F6F2] transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-[#1F5A43]">
                          {f.feedbackId}
                          <div className="text-[10px] text-[#5D665E] font-sans">
                            {new Date(f.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#182019]">{f.stationName}</td>
                        <td className="py-3 px-4 text-[#5D665E]">{f.issueType}</td>
                        <td className="py-3 px-4 text-[#182019] max-w-xs truncate" title={f.message}>
                          {f.message || "Detay belirtilmedi"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              f.status === 'Tamamlandı'
                                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/30'
                                : f.status === 'İnceleniyor'
                                ? 'bg-[#EAF2F6] text-[#416D86] border-[#416D86]/30'
                                : 'bg-[#FFF7E6] text-[#B7791F] border-[#B7791F]/30'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={f.status}
                            onChange={e => handleFeedbackStatusChange(f.feedbackId, e.target.value)}
                            className="bg-[#F6F6F2] border border-[#DDE1DA] rounded px-2 py-1 text-xs text-[#182019] focus:outline-none focus:border-[#1F5A43]"
                          >
                            <option value="Kayıt Alındı">Kayıt Alındı</option>
                            <option value="İnceleniyor">İnceleniyor</option>
                            <option value="Tamamlandı">Tamamlandı</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ---------------------------------------------------- */}
      {/* MODAL: BATARYA İZOLASYON ONAYI                       */}
      {/* ---------------------------------------------------- */}
      {isolationTarget && (
        <div className="fixed inset-0 z-50 bg-[#182019]/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDE1DA] rounded-xl max-w-md w-full p-6 space-y-4 shadow-elevated">
            <div className="w-10 h-10 rounded-full bg-[#FCECEC] text-[#B94040] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-[#182019]">Batarya Güvenlik İzolasyon Simülasyonu</h3>
              <p className="text-xs text-[#5D665E] mt-0.5">
                {isolationTarget.name} ({isolationTarget.adminOnly.moduleId})
              </p>
            </div>

            <div className="p-3 bg-[#FFF7E6] border border-[#B7791F]/30 rounded-lg text-xs text-[#B7791F] space-y-1">
              <span className="font-semibold block">Demo / Simülasyon Bildirimi:</span>
              <p className="text-[11px] leading-relaxed text-[#182019]">
                Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez. Bu işlem arayüz durumunu günceller ve olay günlüğüne simüle kayıt ekler.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsolationTarget(null)}
                className="flex-1 py-2 bg-white hover:bg-[#F6F6F2] border border-[#DDE1DA] text-[#5D665E] rounded-lg text-xs font-semibold transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleIsolateConfirm}
                className="flex-1 py-2 bg-[#B94040] hover:bg-[#991b1b] text-white rounded-lg text-xs font-semibold transition shadow-subtle"
              >
                Simüle İzolasyonu Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: TEKNİK DURAK DETAYI                           */}
      {/* ---------------------------------------------------- */}
      {selectedStationDetail && (
        <div className="fixed inset-0 z-50 bg-[#182019]/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDE1DA] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-elevated max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDE1DA]">
              <div>
                <h3 className="text-base font-bold text-[#182019]">{selectedStationDetail.name}</h3>
                <span className="text-xs font-mono text-[#5D665E]">ID: {selectedStationDetail.stationId}</span>
              </div>
              <button
                onClick={() => setSelectedStationDetail(null)}
                className="p-1 rounded-lg text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F6F6F2] p-3 rounded-lg border border-[#DDE1DA] space-y-1">
                <div className="font-semibold text-[#182019] mb-1">Güvenli Enerji Kabini</div>
                <div>Konum: {selectedStationDetail.adminOnly.energyCabinetDetails?.exactPosition}</div>
                <div>Yangın Dayanımı: {selectedStationDetail.adminOnly.energyCabinetDetails?.fireRating}</div>
                <div>Söndürme: {selectedStationDetail.adminOnly.energyCabinetDetails?.fireSuppressionSystem}</div>
              </div>

              <div className="bg-[#F6F6F2] p-3 rounded-lg border border-[#DDE1DA] space-y-1">
                <div className="font-semibold text-[#182019] mb-1">BMS & İnverter</div>
                <div>BMS: {selectedStationDetail.adminOnly.bmsStatus}</div>
                <div>Hata Kodu: {selectedStationDetail.adminOnly.bmsFaultCode}</div>
                <div>İnverter: {selectedStationDetail.adminOnly.inverterStatus}</div>
              </div>
            </div>

            <div className="bg-[#F6F6F2] p-3 rounded-lg border border-[#DDE1DA] text-xs">
              <div className="font-semibold text-[#182019] mb-1">Teknik Teşhis</div>
              <p className="text-[#5D665E] leading-relaxed">{selectedStationDetail.adminOnly.technicalDiagnostics}</p>
            </div>

            <div className="text-[11px] text-[#5D665E] p-2.5 bg-[#EFF0EB] rounded-lg border border-[#DDE1DA]">
              Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir.
            </div>

            <button
              onClick={() => setSelectedStationDetail(null)}
              className="w-full py-2 bg-[#1F5A43] hover:bg-[#174634] text-white rounded-lg text-xs font-semibold transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-[#DDE1DA] px-6 py-4 text-center text-xs text-[#5D665E]">
        <p>CircularCity Energy · Konya Pilot Şebeke Yönetimi</p>
        <p className="text-[11px] mt-0.5">
          Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
        </p>
      </footer>
    </div>
  );
};

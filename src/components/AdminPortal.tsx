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
  Cpu,
  MessageSquare,
  LogOut,
  RefreshCw,
  Sliders,
  Lock,
  Compass,
  AlertCircle,
  Info,
  Clock,
  Sparkles,
  Server
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

  // Modal states
  const [isolationTarget, setIsolationTarget] = useState<AdminStation | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [selectedStationDetail, setSelectedStationDetail] = useState<AdminStation | null>(null);

  // Load admin data when token changes or refresh triggered
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
      const res = await isolateBattery(isolationTarget.stationId, token);
      setActionSuccessMessage(
        `${isolationTarget.name} bataryası güvenli simülasyon modunda izolasyona alındı. Gerçek fiziksel donanıma komut gönderilmemiştir.`
      );
      // Update local state
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
      // Auto-clear message after 6 seconds
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
        setActionSuccessMessage("AI Önerisi simüle olarak uygulandı. Gerçek fiziksel donanıma komut gönderilmez.");
      } else {
        await dismissAiRecommendation(recId, token);
        setActionSuccessMessage("AI Önerisi yok sayıldı.");
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
  // GİRİŞ EKRANI (LOGIN VIEW)
  // ----------------------------------------------------
  if (!token) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-2xl p-8 backdrop-blur-md shadow-2xl relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-stone-900 rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-100">CircularCity Energy</h1>
              <p className="text-xs text-stone-400">Yetkili Mühendislik & Yönetim Portalı</p>
            </div>
          </div>

          {/* Jury demo notice tag */}
          <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-amber-300">Yalnızca Jüri Demo Hesabı</div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                Konya Pilot Projesi jüri değerlendirmesi için önceden tanımlanmış oturum bilgileri yüklüdür.
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Yönetici E-Posta</label>
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Şifre</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-700 rounded-lg px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-stone-950 font-semibold py-2.5 px-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {isLoggingIn ? 'Giriş Doğrulanıyor...' : 'Yönetici Girişi Yap'}
            </button>
          </form>

          {/* Quick autofill helper */}
          <div className="mt-5 pt-4 border-t border-stone-800 text-center">
            <button
              type="button"
              onClick={() => {
                setLoginEmail('admin@circularcity.demo');
                setLoginPassword('Demo123!');
              }}
              className="text-xs text-stone-400 hover:text-emerald-400 transition underline underline-offset-4"
            >
              Demo Bilgilerini Otomatik Doldur (admin@circularcity.demo / Demo123!)
            </button>
          </div>

          {onBackToPublic && (
            <div className="mt-4 text-center">
              <button
                onClick={onBackToPublic}
                className="text-xs text-stone-400 hover:text-stone-200 transition"
              >
                ← Halka Açık Şehir Haritasına Dön
              </button>
            </div>
          )}

          {/* Security & Design Policy Disclaimer */}
          <div className="mt-6 p-2.5 bg-stone-950/70 rounded-lg border border-stone-800/80 text-[10px] text-stone-400 leading-relaxed text-center">
            Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GİRİŞ YAPILMIŞ YÖNETİCİ PORTALI
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Banner: Transparency & Disclaimers */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-amber-200/90">
        <div className="flex items-center gap-2 font-medium">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold tracking-wider text-[10px] uppercase">
            Pilot Demo – Simülasyon Verisi
          </span>
          <span className="hidden sm:inline">|</span>
          <span>Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.</span>
        </div>
        <div className="text-[11px] text-amber-300/80 italic hidden md:block">
          Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir.
        </div>
      </div>

      {/* Global Action Success Toast */}
      {actionSuccessMessage && (
        <div className="fixed top-14 right-4 z-50 max-w-md bg-stone-900 border border-emerald-500/50 shadow-2xl rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-emerald-300">Simülasyon İşlemi Tamamlandı</div>
            <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">{actionSuccessMessage}</p>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-stone-500 hover:text-stone-300"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Admin Navigation Header */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-stone-100 tracking-tight">CircularCity Energy</h1>
              <span className="text-[11px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                Admin v2.4 (Konya Pilot)
              </span>
            </div>
            <p className="text-xs text-stone-400">İkinci Yaşam Enerji & Akıllı Durak Telemetri Merkezi</p>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: Activity },
            { id: 'stations', label: 'Durak Yönetimi', icon: Compass },
            { id: 'batteries', label: 'Batarya Yönetimi', icon: Battery },
            { id: 'energy', label: 'Güneş & Enerji', icon: Sun },
            { id: 'climate', label: 'İklim & Konfor', icon: Thermometer },
            { id: 'charging', label: 'Şarj Hizmetleri', icon: Zap },
            { id: 'ai', label: 'AI Enerji Asistanı', icon: Sparkles },
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
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Top actions & Profile */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => token && loadAllAdminData(token)}
            disabled={isLoading}
            title="Telemetri Verilerini Yenile"
            className="p-2 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 hover:text-emerald-400 hover:border-emerald-500/40 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>

          {onBackToPublic && (
            <button
              onClick={onBackToPublic}
              className="px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs text-stone-300 hover:text-stone-100 transition hidden sm:inline-block"
            >
              Halk Görünümüne Geç
            </button>
          )}

          <button
            onClick={handleLogout}
            title="Yönetici Oturumunu Kapat"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/20 text-xs font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* Main Body Content based on active tab */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Sub-Header Notice on physical hardware safety */}
        <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>Aktif Güvenlik Politikası:</strong> Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
            </span>
          </div>
          <div className="text-stone-400 text-[11px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Simülasyon Motoru Aktif (6 Konya Pilot Durağı)
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* TAB 1: GENEL BAKIŞ (OVERVIEW)                         */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400 font-medium">Toplam Pilot Durak</div>
                <div className="text-2xl font-bold text-stone-100 mt-1">{stations.length || 6}</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> 4 Tam Aktif, 1 Sınırlı
                </div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400 font-medium">Anlık Güneş Üretimi</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {overview?.stats?.totalSolarProductionKw ?? '24.9'} <span className="text-xs font-normal text-stone-400">kW</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1">6 çatı monokristal PV</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400 font-medium">Anlık Yük Tüketimi</div>
                <div className="text-2xl font-bold text-sky-400 mt-1">
                  {overview?.stats?.totalInstantConsumptionKw ?? '11.2'} <span className="text-xs font-normal text-stone-400">kW</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Aydınlatma + HVAC + Şarj</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400 font-medium">Günlük Şebeke Desteği</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {overview?.stats?.totalGridExportKwh ?? '85.7'} <span className="text-xs font-normal text-stone-400">kWh</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Simüle fazlalık aktarımı</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400 font-medium">Kritik Telemetri Uyarısı</div>
                <div className="text-2xl font-bold text-amber-300 mt-1">
                  {alerts.filter(a => a.level === 'critical' || a.level === 'warning').length}
                </div>
                <div className="text-[11px] text-amber-400/80 mt-1">BMS & Filtre ikazları</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs text-stone-400 font-medium">Halk Geri Bildirimi</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1">{feedbacks.length}</div>
                <div className="text-[11px] text-stone-400 mt-1">Kayıtlı vatandaş iletisi</div>
              </div>
            </div>

            {/* 24-Hour Energy Curve Chart */}
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-stone-100">Son 24 Saat Enerji & Batarya SOC Eğrisi</h3>
                  <p className="text-xs text-stone-400">
                    Konya geneli anlık güneş üretimi (kW), yük tüketimi (kW) ve ortalama batarya doluluk oranı (%)
                  </p>
                </div>
                <div className="text-xs px-2.5 py-1 rounded bg-stone-800 text-stone-300 font-mono">
                  Saatlik Örnekleme (Simülasyon)
                </div>
              </div>

              <div className="h-72 w-full">
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
                      <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="socGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                    <XAxis dataKey="hour" stroke="#78716c" fontSize={11} />
                    <YAxis stroke="#78716c" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1c1917',
                        borderColor: '#44403c',
                        borderRadius: '8px',
                        color: '#f5f5f4',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="solar" name="Güneş Üretimi (kW)" stroke="#f59e0b" fillOpacity={1} fill="url(#solarGrad)" />
                    <Area type="monotone" dataKey="consumption" name="Tüketim (kW)" stroke="#06b6d4" fillOpacity={1} fill="url(#consGrad)" />
                    <Area type="monotone" dataKey="batterySoc" name="Batarya SOC (%)" stroke="#10b981" fillOpacity={1} fill="url(#socGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Assistant Quick Summary Card */}
            <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-2xl">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-emerald-300">AI Enerji Asistanı Önerisi</h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                      Aktif Karar Desteği
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    {recommendations.find(r => r.status === 'pending')?.title ||
                      "Karatay Bilim Merkezi: Anlık ışınım yüksek; batarya şarjını önceliklendirerek akşam saatleri için enerji rezervini %100'e çıkarın."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold rounded-lg text-xs transition"
              >
                Önerileri İncele & Yönet →
              </button>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 2: DURAK YÖNETİMİ (STATION MANAGEMENT)           */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'stations' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-100">Konya Pilot Akıllı Durak Telemetri Listesi</h3>
                <p className="text-xs text-stone-400">
                  Her durak için anlık enerji üretimi, yük durumu ve korunaklı enerji kabini telemetrisi
                </p>
              </div>
              <span className="text-xs text-stone-400">Toplam 6 durak izleniyor</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-800/80 text-stone-300 uppercase tracking-wider font-semibold border-b border-stone-700">
                    <tr>
                      <th className="py-3 px-4">Durak Adı / Kod</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4">Güneş (kW)</th>
                      <th className="py-3 px-4">Tüketim (kW)</th>
                      <th className="py-3 px-4">Şebeke (kWh)</th>
                      <th className="py-3 px-4">Kabin Konumu & Güvenlik</th>
                      <th className="py-3 px-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {stations.map(st => (
                      <tr key={st.stationId} className="hover:bg-stone-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-100">{st.name}</div>
                          <div className="text-[11px] font-mono text-stone-400">{st.stationId}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium inline-flex items-center gap-1 ${
                              st.status === 'aktif'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : st.status === 'sinirli'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {st.status === 'aktif' ? 'Aktif' : st.status === 'sinirli' ? 'Sınırlı Mod' : 'Bakımda'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-300 font-semibold">
                          {st.solarProductionKw} kW
                        </td>
                        <td className="py-3 px-4 font-mono text-sky-300">
                          {st.instantConsumptionKw} kW
                        </td>
                        <td className="py-3 px-4 font-mono text-emerald-300">
                          +{st.gridFeedEnergyKwh} kWh
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-stone-200">{st.adminOnly.energyCabinetDetails?.exactPosition || "Ayrı Güvenli Kabin"}</div>
                          <div className="text-[11px] text-stone-400 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            {st.adminOnly.energyCabinetDetails?.fireRating || "EI60 Yangın Dayanımı"}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedStationDetail(st)}
                            className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition"
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
        {/* TAB 3: BATARYA YÖNETİMİ (BATTERY & BMS TELEMETRY)      */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'batteries' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-100">İkinci Yaşam Batarya Modülleri & BMS Telemetrisi</h3>
                <p className="text-xs text-stone-400">
                  Durağın oturma alanında bulunmayan, dış güvenli kabindeki EV kaynaklı ikinci yaşam bataryalar
                </p>
              </div>
              <div className="p-2 bg-stone-900 border border-stone-800 rounded-lg text-xs text-amber-300/90 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => {
                const b = st.adminOnly;
                const isIsolated = b.batteryState === 'İzolasyona alındı';

                return (
                  <div
                    key={st.stationId}
                    className={`bg-stone-900 border rounded-xl p-5 space-y-4 transition ${
                      isIsolated ? 'border-rose-500/40 bg-rose-950/10' : 'border-stone-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[11px] font-mono text-emerald-400">{b.moduleId}</div>
                        <h4 className="text-sm font-bold text-stone-100">{st.name}</h4>
                        <div className="text-[10px] text-stone-400">Seri No: {b.batterySerialNumber}</div>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isIsolated
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {b.batteryState}
                      </span>
                    </div>

                    {/* Technical metrics grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-stone-950/60 p-3 rounded-lg border border-stone-800/80">
                      <div>
                        <span className="text-stone-400 text-[10px] block">Kimya & Tip</span>
                        <span className="font-semibold text-stone-200">{b.chemistryType}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">SOH (Sağlık)</span>
                        <span className="font-semibold text-emerald-400">%{b.sohRaw}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">SOC (Doluluk)</span>
                        <span className="font-semibold text-amber-400">%{b.socRaw}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Döngü Sayısı</span>
                        <span className="font-semibold text-stone-200">{b.cycleCount} çevrim</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">Gerilim / Akım</span>
                        <span className="font-semibold text-stone-200">{b.currentVoltageV}V / {b.currentAmperageA}A</span>
                      </div>
                      <div>
                        <span className="text-stone-400 text-[10px] block">BMS Durumu</span>
                        <span className="font-semibold text-emerald-400">{b.bmsStatus}</span>
                      </div>
                    </div>

                    {/* Cell temperatures */}
                    <div className="text-xs">
                      <span className="text-stone-400 text-[11px] block mb-1">Hücre Sıcaklıkları (°C):</span>
                      <div className="flex gap-1.5 font-mono text-[11px]">
                        {b.cellTemperatures.map((temp, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-stone-800 rounded border border-stone-700 text-stone-200"
                          >
                            H{idx + 1}: {temp}°
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Safety Isolation Button */}
                    <div className="pt-2 border-t border-stone-800">
                      <div className="text-[10px] text-stone-400 mb-2 italic">
                        Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.
                      </div>
                      {isIsolated ? (
                        <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-1.5 font-medium">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Modül İzolasyonda (Simülasyon Modu)
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsolationTarget(st)}
                          className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          İzolasyona Al (Simülasyon)
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
        {/* TAB 4: GÜNEŞ & ENERJİ TELEMETRİSİ                     */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'energy' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-100">Güneş Üretimi, İnverter & Mikro Şebeke Telemetrisi</h3>
              <p className="text-xs text-stone-400">
                Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => (
                <div key={st.stationId} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-stone-100">{st.name}</h4>
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">{st.solarProductionKw} kW Üretim</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">İnverter Durumu:</span>
                      <span className="font-semibold text-emerald-400">{st.adminOnly.inverterStatus}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Temiz Enerji Oranı:</span>
                      <span className="font-semibold text-emerald-300">%{st.dailyCleanEnergyRatio}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Anlık Yük Tüketimi:</span>
                      <span className="font-semibold text-sky-400">{st.instantConsumptionKw} kW</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-400">Şebekeye Verilen Fazla:</span>
                      <span className="font-semibold text-emerald-400">+{st.gridFeedEnergyKwh} kWh</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-stone-400 bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                    MPPT Şarj Algoritması: Dinamik Işınım Takibi Aktif
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 5: İKLİMLENDİRME VE KONFOR (CLIMATE & COMFORT)    */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'climate' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-100">Durak İçi İklimlendirme ve Hava Kalitesi Telemetrisi</h3>
              <p className="text-xs text-stone-400">
                Bekleme alanı sıcaklık, nem, AQI ve güvenli enerji kabini zorlamalı havalandırma durumu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => (
                <div key={st.stationId} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-stone-100">{st.name}</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                      {st.hvacStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center py-2 bg-stone-950 rounded-lg border border-stone-800">
                    <div>
                      <div className="text-[10px] text-stone-400">İç Sıcaklık</div>
                      <div className="text-base font-bold text-amber-300 mt-0.5">{st.indoorTemperature}°C</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400">Bağıl Nem</div>
                      <div className="text-base font-bold text-sky-300 mt-0.5">%{st.indoorHumidity}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-stone-400">Hava Kalitesi</div>
                      <div className="text-xs font-bold text-emerald-400 mt-1">{st.airQuality}</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-stone-300">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-400">Kabin Havalandırması:</span>
                      <span className="text-emerald-400 font-medium">{st.adminOnly.energyCabinetDetails?.ventilationStatus}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-400">Kabin İçi Sıcaklık:</span>
                      <span className="text-stone-200">{st.adminOnly.energyCabinetDetails?.internalTemperature}°C</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 6: ŞARJ HİZMETLERİ (CHARGING SERVICES)            */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'charging' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-stone-100">Halk Şarj Hizmetleri ve Yük Dağılımı</h3>
              <p className="text-xs text-stone-400">
                USB-C portları, prizler, kablosuz şarj ve aşırı akım koruma telemetrisi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stations.map(st => (
                <div key={st.stationId} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-stone-100">{st.name}</h4>
                    <span className="text-xs font-mono text-emerald-400">{st.usbCPorts}x USB-C</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">220V Topraklı Priz:</span>
                      <span className="font-semibold text-stone-200">{st.powerOutlets} Adet</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-800">
                      <span className="text-stone-400">Kablosuz Şarj Pedi:</span>
                      <span className="font-semibold text-stone-200">{st.wirelessCharging ? 'Mevcut (15W Qi)' : 'Yok'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-400">Kullanım Durumu:</span>
                      <span className="font-semibold text-emerald-300">{st.usbCPorts > 0 ? 'Aktif Hizmet Veriyor' : 'Servis Dışı'}</span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-800 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${st.usbCPorts > 0 ? 65 : 0}%` }}></div>
                  </div>
                  <div className="text-[10px] text-stone-400 text-right">Tahmini Şarj Yükü: %{st.usbCPorts > 0 ? 65 : 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 7: AI ENERJİ ASİSTANI (AI ENERGY ASSISTANT)       */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-100">AI Enerji Asistanı Önerileri</h3>
                <p className="text-xs text-stone-400">
                  Tahmini enerji üretimi, etkinlik yoğunluğu ve şebeke optimizasyonu önerileri
                </p>
              </div>
              <div className="text-xs text-amber-300/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez.
              </div>
            </div>

            <div className="space-y-3">
              {recommendations.map(rec => {
                const isPending = rec.status === 'pending';
                const isApplied = rec.status === 'applied';
                const isDismissed = rec.status === 'dismissed';

                return (
                  <div
                    key={rec.id}
                    className="bg-stone-900 border border-stone-800 rounded-xl p-5 flex flex-wrap md:flex-nowrap items-start justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            rec.priority === 'Yüksek'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {rec.priority} Öncelik
                        </span>
                        <span className="text-xs font-mono text-stone-400">{rec.stationName} ({rec.stationId})</span>
                        <span className="text-[11px] text-stone-400">• {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <h4 className="text-sm font-bold text-stone-100">{rec.title}</h4>
                      <p className="text-xs text-stone-300 leading-relaxed">{rec.reason}</p>

                      <div className="text-xs text-emerald-400 font-medium">
                        Beklenen Etki: {rec.expectedImpact}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleAiAction(rec.id, 'apply')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-semibold rounded-lg text-xs transition flex items-center justify-center gap-1.5 shadow"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Öneriyi Uygula (Simülasyon)
                          </button>
                          <button
                            onClick={() => handleAiAction(rec.id, 'dismiss')}
                            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition"
                          >
                            Yok Say
                          </button>
                        </>
                      ) : isApplied ? (
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30">
                          <CheckCircle className="w-4 h-4" /> Uygulandı (Simülasyon)
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-400 text-xs font-semibold flex items-center gap-1.5">
                          <XCircle className="w-4 h-4" /> Yok Sayıldı
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
        {/* TAB 8: UYARILAR VE OLAYLAR (ALERTS & LOGS)             */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-stone-100">Sistem Uyarıları & Simüle Olay Kayıtları</h3>
              <p className="text-xs text-stone-400">
                Sensör alarmları, batarya izolasyon kayıtları ve AI asistan aksiyon logları
              </p>
            </div>

            {/* Active alerts */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Aktif Alarmlar</h4>
              {alerts.length === 0 ? (
                <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-400">
                  Aktif kritik alarm bulunmuyor.
                </div>
              ) : (
                alerts.map(a => (
                  <div
                    key={a.id}
                    className={`p-4 rounded-xl border flex items-start gap-3 ${
                      a.level === 'critical'
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="flex-1 text-xs">
                      <div className="font-semibold flex items-center justify-between">
                        <span>{a.stationName || a.stationId}</span>
                        <span className="font-mono text-[11px] opacity-75">{new Date(a.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="mt-1 text-stone-200">{a.message}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Event logs */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">Olay Günlüğü (Event Logs)</h4>
              <div className="bg-stone-900 border border-stone-800 rounded-xl divide-y divide-stone-800 text-xs">
                {eventLogs.map(log => (
                  <div key={log.id} className="p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-stone-400" />
                      <div>
                        <span className="font-mono text-emerald-400 text-[11px] mr-2">[{log.type}]</span>
                        <span className="text-stone-200">{log.message}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-400 shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------- */}
        {/* TAB 9: VATANDAŞ BİLDİRİMLERİ (FEEDBACK MANAGEMENT)   */}
        {/* ---------------------------------------------------- */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-stone-100">Vatandaş Geri Bildirimleri</h3>
                <p className="text-xs text-stone-400">
                  Halk ekranından iletilen anonim durak bildirimleri ve operasyonel çözüm durumu
                </p>
              </div>
              <span className="text-xs text-stone-400">{feedbacks.length} Bildirim Kayıtlı</span>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-800/80 text-stone-300 uppercase tracking-wider font-semibold border-b border-stone-700">
                    <tr>
                      <th className="py-3 px-4">Takip No / Tarih</th>
                      <th className="py-3 px-4">Durak</th>
                      <th className="py-3 px-4">Bildirim Konusu</th>
                      <th className="py-3 px-4">Açıklama</th>
                      <th className="py-3 px-4">Durum</th>
                      <th className="py-3 px-4 text-right">Durum Güncelle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-200">
                    {feedbacks.map(f => (
                      <tr key={f.feedbackId} className="hover:bg-stone-800/40 transition">
                        <td className="py-3 px-4 font-mono text-[11px] text-emerald-400">
                          {f.feedbackId}
                          <div className="text-[10px] text-stone-400 font-sans">
                            {new Date(f.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-100">{f.stationName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                            {f.issueType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-300 max-w-xs truncate" title={f.message}>
                          {f.message || "Detay belirtilmedi"}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              f.status === 'Tamamlandı'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : f.status === 'İnceleniyor'
                                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {f.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={f.status}
                            onChange={e => handleFeedbackStatusChange(f.feedbackId, e.target.value)}
                            className="bg-stone-950 border border-stone-700 rounded px-2 py-1 text-xs text-stone-200 focus:outline-none focus:border-emerald-500"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-stone-100">Batarya Güvenlik İzolasyon Simülasyonu</h3>
              <p className="text-xs text-stone-400 mt-1">
                <strong>{isolationTarget.name}</strong> ({isolationTarget.adminOnly.moduleId})
              </p>
            </div>

            {/* Mandatory Disclaimers */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-1.5 text-xs text-amber-200">
              <div className="font-semibold text-amber-300">Demo / Simülasyon Bildirimi:</div>
              <p className="text-[11px] leading-relaxed">
                Demo / Simülasyon – Gerçek fiziksel donanıma komut gönderilmez. Bu işlem yalnızca arayüz ve simüle operasyon kaydını günceller.
              </p>
            </div>

            <div className="text-xs text-stone-300 space-y-1 bg-stone-950 p-3 rounded-lg border border-stone-800">
              <div>• Batarya modülü durumu: <strong>İzolasyona alındı</strong> olarak işaretlenecek.</div>
              <div>• Durak enerji modu: <strong>Sınırlı Mod</strong> seviyesine çekilecek.</div>
              <div>• Olay günlüğüne denetçi simülasyon kaydı eklenecek.</div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsolationTarget(null)}
                className="flex-1 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-semibold transition"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleIsolateConfirm}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition shadow-lg shadow-rose-600/20"
              >
                Simüle İzolasyonu Onayla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: TEKNİK DURAK DETAYI (STATION TELEMETRY MODAL) */}
      {/* ---------------------------------------------------- */}
      {selectedStationDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <h3 className="text-base font-bold text-stone-100">{selectedStationDetail.name}</h3>
                <span className="text-xs font-mono text-stone-400">Teknik Telemetri Kimliği: {selectedStationDetail.stationId}</span>
              </div>
              <button
                onClick={() => setSelectedStationDetail(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-stone-400 font-semibold mb-1">Güvenli Enerji Kabini</div>
                <div>Konum: {selectedStationDetail.adminOnly.energyCabinetDetails?.exactPosition}</div>
                <div>Yangın Dayanımı: {selectedStationDetail.adminOnly.energyCabinetDetails?.fireRating}</div>
                <div>Söndürme Sistemi: {selectedStationDetail.adminOnly.energyCabinetDetails?.fireSuppressionSystem}</div>
                <div>Kilit Mekanizması: {selectedStationDetail.adminOnly.energyCabinetDetails?.lockMechanism}</div>
              </div>

              <div className="bg-stone-950 p-3 rounded-lg border border-stone-800">
                <div className="text-stone-400 font-semibold mb-1">BMS & İnverter</div>
                <div>BMS Durumu: {selectedStationDetail.adminOnly.bmsStatus}</div>
                <div>BMS Hata Kodu: {selectedStationDetail.adminOnly.bmsFaultCode}</div>
                <div>İnverter: {selectedStationDetail.adminOnly.inverterStatus}</div>
                <div>Son Bakım: {selectedStationDetail.adminOnly.lastMaintenanceDate}</div>
              </div>
            </div>

            <div className="bg-stone-950 p-3 rounded-lg border border-stone-800 text-xs">
              <div className="text-stone-400 font-semibold mb-1">Teknik Değerlendirme & Teşhis</div>
              <p className="text-stone-300 leading-relaxed">{selectedStationDetail.adminOnly.technicalDiagnostics}</p>
            </div>

            <div className="text-[11px] text-stone-400 p-2.5 bg-stone-950/80 rounded-lg border border-stone-800">
              Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir.
            </div>

            <button
              onClick={() => setSelectedStationDetail(null)}
              className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-semibold transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 px-6 py-4 text-center text-xs text-stone-400">
        <p>CircularCity Energy Admin Portal • Konya Pilot Şebeke Yönetimi</p>
        <p className="text-[11px] mt-1 text-stone-400">
          Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
        </p>
      </footer>
    </div>
  );
};

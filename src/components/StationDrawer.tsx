import React from 'react';
import {
  X,
  Zap,
  Plug,
  Wifi,
  Snowflake,
  Accessibility,
  SunMedium,
  Compass,
  Clock,
  Thermometer,
  Wind,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  MessageSquarePlus,
  Navigation2,
  BatteryCharging
} from 'lucide-react';
import { PublicStation, StationStatus } from '../types';

interface StationDrawerProps {
  station: PublicStation | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedback: (station: PublicStation) => void;
}

export const getStatusBadge = (status: StationStatus) => {
  switch (status) {
    case 'aktif':
      return {
        label: 'Hizmet Aktif',
        bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        dot: 'bg-emerald-400',
      };
    case 'sinirli':
      return {
        label: 'Sınırlı Mod / Düşük Enerji',
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-400',
      };
    case 'bakimda':
      return {
        label: 'Bakımda / Hizmet Dışı',
        bg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        dot: 'bg-rose-400',
      };
    case 'baglanti_yok':
      return {
        label: 'Bağlantı Yok',
        bg: 'bg-slate-700 text-slate-300 border-slate-600',
        dot: 'bg-slate-400',
      };
  }
};

export const StationDrawer: React.FC<StationDrawerProps> = ({
  station,
  isOpen,
  onClose,
  onOpenFeedback
}) => {
  if (!isOpen || !station) return null;

  const statusBadge = getStatusBadge(station.status);
  const [lat, lng] = station.coordinates;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${lat}%2C${lng}`;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ', ' +
             date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
      return isoString;
    }
  };

  const getEnergyReadinessBadge = (readiness: string) => {
    if (readiness === 'yeterli') {
      return { label: 'Enerji durumu: yeterli', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (readiness === 'sinirli') {
      return { label: 'Enerji durumu: sınırlı', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    }
    return { label: 'Enerji durumu: bakımda', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const readiness = getEnergyReadinessBadge(station.batteryReadiness);

  return (
    <>
      {/* Karartma arka plan */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sağdan (Desktop) / Alttan (Mobil) Kayan Panel */}
      <aside
        aria-label="Durak Detayları"
        className="fixed inset-y-0 right-0 max-w-full w-full sm:max-w-md md:max-w-lg bg-slate-900 shadow-2xl z-50 flex flex-col border-l border-slate-800 text-white transform transition-transform duration-300 ease-in-out overflow-hidden"
      >
        {/* Üst Başlık Barı */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between bg-slate-950/60">
          <div className="space-y-1.5 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${statusBadge.dot} animate-pulse`} />
                {statusBadge.label}
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {station.stationId}
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${readiness.color}`}>
                {readiness.label}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {station.name}
            </h2>

            {station.description && (
              <p className="text-xs text-slate-300 leading-relaxed">
                {station.description}
              </p>
            )}

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Son güncelleme: {formatTime(station.lastUpdated)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            aria-label="Detay panelini kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kaydırılabilir İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Güvenli Bakım Mesajı Varsa */}
          {station.maintenanceMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-bold text-amber-300 block">Bilgilendirme / Güvenli Bakım Notu:</span>
                <p className="leading-relaxed text-slate-300">{station.maintenanceMessage}</p>
              </div>
            </div>
          )}

          {/* Yakınlık Rozeti */}
          {station.distanceKm !== undefined && (
            <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-500 text-slate-950 rounded-xl">
                  <Navigation2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-emerald-300 block">Konumunuza Yakınlık</span>
                  <span className="text-sm font-extrabold text-white">
                    {station.distanceKm} km ({station.walkingMinutes} dk yürüme)
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                En Yakın
              </span>
            </div>
          )}

          {/* KULLANICI HİZMETLERİ VE BÜYÜK KARTLAR */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Kullanıcı Hizmetleri & Donanımlar
            </span>

            {/* Kart 1: USB-C Şarj */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kullanılabilir USB-C Portu</h4>
                  <p className="text-xs text-slate-400">Akıllı hızlı mobil cihaz şarjı</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-blue-400">{station.usbCPorts}</span>
                <span className="text-[10px] text-slate-500 block">Port Aktif</span>
              </div>
            </div>

            {/* Kart 2: 220V Priz */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                  <Plug className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kullanılabilir 220V Priz</h4>
                  <p className="text-xs text-slate-400">Dizüstü bilgisayar & medikal priz</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-400">{station.powerOutlets}</span>
                <span className="text-[10px] text-slate-500 block">Priz Aktif</span>
              </div>
            </div>

            {/* Kart 3: Kablosuz Şarj */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Kablosuz (Qi) Şarj</h4>
                  <p className="text-xs text-slate-400">Temassız masaüstü şarj pedi</p>
                </div>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  station.wirelessCharging
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {station.wirelessCharging ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            {/* Kart 4: İklimlendirme */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                  <Snowflake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">İklimlendirme / Havalandırma</h4>
                  <p className="text-xs text-slate-400">{station.hvacStatus}</p>
                </div>
              </div>
            </div>

            {/* Kart 5: Erişilebilirlik */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                <Accessibility className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Erişilebilirlik Bilgisi</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{station.accessibility}</p>
              </div>
            </div>
          </div>

          {/* GÜVENLİ ENERJİ KABİNİ BÖLÜMÜ */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Güvenli Enerji Kabini
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                EI60 / IP65
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Batarya durağın yanında/arkasında, ayrı, kilitli, havalandırmalı ve yangına dayanımlı “Güvenli Enerji Kabini” içinde muhafaza edilmektedir.
            </p>

            {/* Güvenlik Mesajı Vurgusu */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-emerald-300 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>“Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur.”</span>
            </div>

            {/* Şema */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-center text-[10px] text-slate-300">
              <div className="flex-1 p-1.5 bg-slate-900 rounded-lg">
                <span className="block font-bold text-white">Durak Alanı</span>
                <span className="text-slate-400">Yolcu Oturma & Şarj</span>
              </div>
              <span className="px-2 text-amber-400 font-mono">⟵ 1.8m ⟶</span>
              <div className="flex-1 p-1.5 bg-emerald-950/70 border border-emerald-800 rounded-lg text-emerald-300">
                <span className="block font-bold">Güvenli Kabin</span>
                <span className="text-slate-400">Yanında / Arkasında</span>
              </div>
            </div>
          </div>

          {/* DÖNGÜSEL GÜNEŞ ENERJİSİ & ÇEVRE GÖSTERGELERİ */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <SunMedium className="w-4 h-4 text-amber-400" />
                <span>Güneş ve Temiz Enerji Metrikleri</span>
              </span>
              <span className="text-xs font-bold text-emerald-400">
                %{station.dailyCleanEnergyRatio} Temiz Enerji
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Anlık Güneş Üretimi</span>
                <strong className="text-amber-400 text-sm">{station.solarProductionKw} kW</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Anlık Tüketim</span>
                <strong className="text-white text-sm">{station.instantConsumptionKw} kW</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 col-span-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Şebekeye Aktarılan Tahmini Fazla Enerji</span>
                  <strong className="text-emerald-400 text-xs">+{station.gridFeedEnergyKwh} kWh / gün</strong>
                </div>
                <span className="text-[9px] text-slate-400 text-right max-w-[140px]">
                  Mevzuat ve teknik uygunluğa bağlı planlanan özellik
                </span>
              </div>
            </div>

            {/* İç Ortam Sıcaklık / Nem / Hava Kalitesi */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">İç Sıcaklık</span>
                <strong className="text-white">{station.indoorTemperature}°C</strong>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Nem</span>
                <strong className="text-white">%{station.indoorHumidity}</strong>
              </div>
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Hava Kalitesi</span>
                <strong className="text-emerald-400">{station.airQuality.split(' ')[0]}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* ALT BUTONLAR: YOL TARİFİ VE GERİ BİLDİRİM */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 space-y-2.5">
          <div className="grid grid-cols-2 gap-2">
            <a
              href={osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-xl transition-colors border border-slate-700"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>OSM Yol Tarifi</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold rounded-xl transition-colors border border-slate-700"
            >
              <Navigation2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

          <button
            onClick={() => onOpenFeedback(station)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-slate-950" />
            <span>Geri Bildirim Gönder (Sorun Bildir)</span>
          </button>
        </div>
      </aside>
    </>
  );
};

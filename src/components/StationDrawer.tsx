import React, { useEffect } from 'react';
import {
  X,
  Zap,
  Plug,
  Wifi,
  Snowflake,
  Accessibility,
  Clock,
  Lock,
  ExternalLink,
  MessageSquare,
  Navigation,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PublicStation, StationStatus } from '../types';

interface StationDrawerProps {
  station: PublicStation | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedback: (station: PublicStation) => void;
  tourStep?: number;
}

export const getStatusBadge = (status: StationStatus) => {
  switch (status) {
    case 'aktif':
      return {
        label: 'Hizmet Aktif',
        bg: 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/30',
        dot: 'bg-[#1F5A43]',
      };
    case 'sinirli':
      return {
        label: 'Sınırlı Mod',
        bg: 'bg-[#FFF7E6] text-[#B7791F] border-[#B7791F]/30',
        dot: 'bg-[#B7791F]',
      };
    case 'bakimda':
      return {
        label: 'Bakımda',
        bg: 'bg-[#FCECEC] text-[#B94040] border-[#B94040]/30',
        dot: 'bg-[#B94040]',
      };
    case 'baglanti_yok':
      return {
        label: 'Bağlantı Yok',
        bg: 'bg-[#EFF0EB] text-[#5D665E] border-[#DDE1DA]',
        dot: 'bg-[#5D665E]',
      };
  }
};

export const StationDrawer: React.FC<StationDrawerProps> = ({
  station,
  isOpen,
  onClose,
  onOpenFeedback,
  tourStep
}) => {
  // Escape tuşu ile kapanabilme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !station) return null;

  const statusBadge = getStatusBadge(station.status);
  const [lat, lng] = station.coordinates;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ', ' +
             date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    } catch {
      return isoString;
    }
  };

  return (
    <>
      {/* Karartma arka plan */}
      <div
        className="fixed inset-0 bg-[#182019]/30 backdrop-blur-2xs z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Masaüstünde sağdan, mobilde alttan açılan temiz panel */}
      <aside
        id="tour-step-4-drawer"
        aria-label="Durak Detayları"
        className={`fixed inset-y-0 right-0 max-w-full w-full sm:max-w-[420px] bg-white shadow-elevated z-50 flex flex-col border-l border-[#DDE1DA] text-[#182019] transition-transform duration-200 ease-out overflow-hidden ${
          tourStep === 4 ? 'ring-4 ring-[#1F5A43]/30' : ''
        }`}
      >
        {/* Üst Başlık Barı */}
        <div className="p-5 border-b border-[#DDE1DA] flex items-start justify-between bg-[#F6F6F2]">
          <div className="space-y-1.5 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot}`} />
                {statusBadge.label}
              </span>
              <span className="text-[11px] font-mono text-[#5D665E] bg-white px-2 py-0.5 rounded border border-[#DDE1DA]">
                {station.stationId}
              </span>
            </div>

            <h2 className="text-base sm:text-lg font-bold text-[#182019] leading-snug">
              {station.name}
            </h2>

            <div className="flex items-center gap-1.5 text-xs text-[#5D665E]">
              <Clock className="w-3.5 h-3.5 text-[#5D665E]" />
              <span>Son güncelleme: {formatTime(station.lastUpdated)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#5D665E] hover:text-[#182019] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#DDE1DA]"
            aria-label="Detay panelini kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kaydırılabilir İçerik Alanı */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Varsa Bakım Notu */}
          {station.maintenanceMessage && (
            <div className="p-3.5 rounded-lg bg-[#FFF7E6] border border-[#B7791F]/30 text-xs text-[#B7791F] flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Bakım Notu:</span>
                <span className="text-[#182019]">{station.maintenanceMessage}</span>
              </div>
            </div>
          )}

          {/* Varsa Kullanıcıya Mesafe */}
          {station.distanceKm !== undefined && (
            <div className="p-3 bg-[#E5F0EA] rounded-lg border border-[#1F5A43]/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#174634]">
                <Navigation className="w-4 h-4 text-[#1F5A43]" />
                <span>
                  Konumunuza <strong className="font-bold">{station.distanceKm} km</strong> mesafede (~{station.walkingMinutes} dk yürüme)
                </span>
              </div>
            </div>
          )}

          {/* BİRİNCİ ALAN: DÖRT MİNİMAL HİZMET SATIRI */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5D665E] block pb-1 border-b border-[#DDE1DA]">
              Hizmet Olanakları
            </span>

            <div className="divide-y divide-[#DDE1DA] border border-[#DDE1DA] rounded-lg bg-[#F6F6F2] text-xs">
              {/* 1. Hizmet Durumu */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#5D665E]">
                  <CheckCircle2 className="w-4 h-4 text-[#1F5A43]" />
                  <span>Hizmet Durumu</span>
                </div>
                <span className="font-semibold text-[#182019]">{statusBadge.label}</span>
              </div>

              {/* 2. Şarj Kullanılabilir */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#5D665E]">
                  <Zap className="w-4 h-4 text-[#1F5A43]" />
                  <span>Şarj Kullanılabilir</span>
                </div>
                <div className="text-right font-medium text-[#182019]">
                  <span>{station.usbCPorts}x USB-C</span>
                  <span className="text-[#5D665E] mx-1.5">·</span>
                  <span>{station.powerOutlets}x 220V</span>
                  {station.wirelessCharging && (
                    <>
                      <span className="text-[#5D665E] mx-1.5">·</span>
                      <span className="text-[#1F5A43]">Qi Kablosuz</span>
                    </>
                  )}
                </div>
              </div>

              {/* 3. İklim Konforu */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#5D665E]">
                  <Snowflake className="w-4 h-4 text-[#416D86]" />
                  <span>İklim Konforu</span>
                </div>
                <span className="font-medium text-[#182019] truncate max-w-[200px]" title={station.hvacStatus}>
                  {station.hvacStatus}
                </span>
              </div>

              {/* 4. Erişilebilirlik */}
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[#5D665E]">
                  <Accessibility className="w-4 h-4 text-[#1F5A43]" />
                  <span>Erişilebilirlik</span>
                </div>
                <span className="font-medium text-[#182019] truncate max-w-[200px]" title={station.accessibility}>
                  {station.accessibility.split('(')[0].trim() || 'Tam Uyumlu'}
                </span>
              </div>
            </div>
          </div>

          {/* İKİNCİ ALAN: "BUGÜN" METRİKLERİ (2 KOLONLU SADE DÜZEN) */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#5D665E] block pb-1 border-b border-[#DDE1DA]">
              Bugün
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-white border border-[#DDE1DA]">
                <span className="text-[11px] text-[#5D665E] block">Temiz Enerji Karşılama</span>
                <span className="text-lg font-bold text-[#1F5A43] tabular-nums mt-0.5 block">
                  %{station.dailyCleanEnergyRatio}
                </span>
                <span className="text-[10px] text-[#5D665E]">Güneş enerjisi payı</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#DDE1DA]">
                <span className="text-[11px] text-[#5D665E] block">Anlık Güneş Üretimi</span>
                <span className="text-lg font-bold text-[#D59B2E] tabular-nums mt-0.5 block">
                  {station.solarProductionKw} kW
                </span>
                <span className="text-[10px] text-[#5D665E]">Çatı monokristal PV</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#DDE1DA]">
                <span className="text-[11px] text-[#5D665E] block">İç Ortam Sıcaklığı</span>
                <span className="text-lg font-bold text-[#182019] tabular-nums mt-0.5 block">
                  {station.indoorTemperature} °C
                </span>
                <span className="text-[10px] text-[#5D665E]">Bağıl nem: %{station.indoorHumidity}</span>
              </div>

              <div className="p-3 rounded-lg bg-white border border-[#DDE1DA]">
                <span className="text-[11px] text-[#5D665E] block">Hava Kalitesi</span>
                <span className="text-sm font-bold text-[#1F5A43] mt-1 block truncate">
                  {station.airQuality.split('(')[0].trim() || 'İyi'}
                </span>
                <span className="text-[10px] text-[#5D665E]">Filtrelenmiş hava</span>
              </div>
            </div>
          </div>

          {/* GÜVENLİ ENERJİ KABİNİ BİLGİLENDİRMESİ */}
          <div className="p-4 rounded-lg bg-[#E5F0EA] border border-[#1F5A43]/20 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-[#1F5A43]">
                <Lock className="w-4 h-4 text-[#1F5A43]" />
                <span>Ayrı Güvenli Enerji Kabini</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-white text-[#1F5A43] rounded border border-[#1F5A43]/30">
                EI60 Yangın Dayanımı
              </span>
            </div>

            <p className="text-[#174634] leading-relaxed">
              Batarya oturma alanında değil; bağımsız enerji kabininde korunur. Durağın yanında veya arkasında, kilitli ve zorlamalı havalandırmalı bağımsız kabinde yer alır.
            </p>
          </div>
        </div>

        {/* ALT AKSİYON BUTONLARI */}
        <div className="p-4 sm:p-5 border-t border-[#DDE1DA] bg-[#F6F6F2] space-y-2">
          {/* Birincil Buton: Yol Tarifi Al */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-4 bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-subtle"
          >
            <Navigation className="w-4 h-4" />
            <span>Yol tarifi al</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-75" />
          </a>

          {/* İkincil Buton: Sorun Bildir */}
          <button
            id="tour-step-5-feedback"
            onClick={() => onOpenFeedback(station)}
            className={`w-full py-2.5 px-4 bg-white hover:bg-[#EFF0EB] text-[#182019] border border-[#DDE1DA] font-medium text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
              tourStep === 5 ? 'tour-highlight ring-4 ring-[#1F5A43]/40 font-bold !bg-[#E5F0EA] !text-[#1F5A43]' : ''
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#5D665E]" />
            <span>Sorun bildir</span>
          </button>
        </div>
      </aside>
    </>
  );
};

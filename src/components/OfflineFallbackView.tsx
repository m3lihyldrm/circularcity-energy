import React from 'react';
import { PublicStation } from '../types';
import { getStatusBadge } from './StationDrawer';
import {
  Zap,
  Plug,
  Wifi,
  Sun,
  Snowflake,
  Accessibility,
  Eye,
  Map as MapIcon,
  Clock,
  Lock,
  MessageSquare
} from 'lucide-react';

interface OfflineFallbackViewProps {
  stations: PublicStation[];
  onSelectStation: (station: PublicStation) => void;
  onOpenFeedback: (station: PublicStation) => void;
  onSwitchToMap?: () => void;
}

export const OfflineFallbackView: React.FC<OfflineFallbackViewProps> = ({
  stations,
  onSelectStation,
  onOpenFeedback,
  onSwitchToMap,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Üst Başlık & Liste Modu Açıklaması */}
      <div className="bg-white border border-[#DDE1DA] rounded-2xl p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E5F0EA] text-[#1F5A43] border border-[#1F5A43]/20">
              Yedek / Liste Modu
            </span>
            <span className="text-xs text-[#5D665E]">Çevrimdışı ve Düşük Veri Desteği</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#182019]">
            Konya Akıllı Şehir Durakları
          </h2>
          <p className="text-xs sm:text-sm text-[#5D665E] leading-relaxed">
            Harita karolarına ihtiyaç duymadan Konya pilot duraklarının donanımlarını, şarj kapasitesini, iklimlendirme ve temiz enerji durumunu buradan liste olarak inceleyebilirsiniz.
          </p>
        </div>

        {onSwitchToMap && (
          <div>
            <button
              onClick={onSwitchToMap}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold text-xs sm:text-sm shadow-subtle transition-colors flex items-center justify-center gap-2"
            >
              <MapIcon className="w-4 h-4" />
              <span>İnteraktif Haritaya Dön</span>
            </button>
          </div>
        )}
      </div>

      {/* Durak Kartları Tablosu / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((station) => {
          const badge = getStatusBadge(station.status);

          return (
            <div
              key={station.stationId}
              className="bg-white rounded-xl border border-[#DDE1DA] shadow-subtle overflow-hidden flex flex-col justify-between hover:border-[#1F5A43]/40 transition-colors"
            >
              <div className="p-5 space-y-4">
                {/* Durak Başlığı ve Rozet */}
                <div className="flex items-start justify-between gap-2 border-b border-[#DDE1DA] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#5D665E] block">
                      {station.stationId}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#182019] leading-snug">
                      {station.name}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* 4 Satır Donanım Göstergesi */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#1F5A43] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">USB-C</span>
                      <strong className="text-[#182019] tabular-nums">{station.usbCPorts} Port</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] flex items-center gap-2">
                    <Plug className="w-4 h-4 text-[#1F5A43] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">220V Priz</span>
                      <strong className="text-[#182019] tabular-nums">{station.powerOutlets} Adet</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-[#1F5A43] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">Kablosuz (Qi)</span>
                      <strong className="text-[#182019]">{station.wirelessCharging ? 'Aktif' : 'Yok'}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] flex items-center gap-2">
                    <Snowflake className="w-4 h-4 text-[#416D86] shrink-0" />
                    <div>
                      <span className="text-[10px] text-[#5D665E] block">İklimlendirme</span>
                      <strong className="text-[#182019] truncate block max-w-[80px]">
                        {station.hvacStatus.includes('Aktif') ? 'Aktif' : 'Sınırlı'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Temiz Enerji & Sıcaklık */}
                <div className="p-2.5 bg-[#EFF0EB] rounded-lg border border-[#DDE1DA] flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-[#5D665E] block">Güneş Üretimi</span>
                    <strong className="text-[#1F5A43] tabular-nums">{station.solarProductionKw} kW</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5D665E] block">Temiz Enerji</span>
                    <strong className="text-[#1F5A43] tabular-nums">%{station.dailyCleanEnergyRatio}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5D665E] block">İç Sıcaklık</span>
                    <strong className="text-[#182019] tabular-nums">{station.indoorTemperature} °C</strong>
                  </div>
                </div>

                {/* Güvenli Enerji Kabini Bildirimi */}
                <div className="p-2.5 bg-[#E5F0EA] text-[#174634] rounded-lg border border-[#1F5A43]/20 text-[11px] flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="w-3.5 h-3.5 text-[#1F5A43] shrink-0" />
                    <span className="font-semibold text-[#1F5A43]">Güvenli Enerji Kabini:</span>
                    <span className="truncate">Durağın yanında/arkasında, ayrı, kilitli ve havalandırmalı</span>
                  </div>
                </div>
              </div>

              {/* Kart Aksiyon Butonları */}
              <div className="p-4 pt-0 border-t border-[#DDE1DA] flex items-center gap-2 bg-white">
                <button
                  onClick={() => onSelectStation(station)}
                  className="flex-1 py-2 px-3 bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-subtle"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detayları İncele</span>
                </button>
                <button
                  onClick={() => onOpenFeedback(station)}
                  className="p-2 bg-white hover:bg-[#F6F6F2] text-[#5D665E] hover:text-[#182019] border border-[#DDE1DA] rounded-lg transition-colors"
                  title="Sorun Bildir"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

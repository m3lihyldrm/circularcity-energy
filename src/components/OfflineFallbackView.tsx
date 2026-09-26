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
  Navigation2,
  ExternalLink,
  Eye,
  Layers,
  MapPin,
  Clock
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
      {/* Üst Başlık & Çevrimdışı / Statik Görünüm Açıklaması */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Yedek / Statik Liste Modu
            </span>
            <span className="text-xs text-slate-300">İnternetsiz Ortam & Düşük Veri Desteği</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Konya Akıllı Şehir Durakları
          </h2>
          <p className="text-sm text-emerald-100/80 leading-relaxed">
            İnternet bağlantınız kısıtlı olduğunda veya çevrimdışı geliştirme ortamlarında harita karolarına ihtiyaç duymadan tüm durak donanımlarını, şarj portlarını ve temiz enerji üretimini buradan inceleyebilirsiniz.
          </p>
        </div>

        <div>
          <button
            onClick={onSwitchToMap}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Layers className="w-4 h-4" />
            <span>İnteraktif Haritaya Dön</span>
          </button>
        </div>
      </div>

      {/* Şematik Statik Konya Harita Gösterimi (Offline Visual Mini Map) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Konya Şematik Durak Dağılımı (Statik Görsel)</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Merkez: 37.8746° N, 32.4932° E</span>
        </div>

        {/* CSS Tabanlı Şematik Konya Harita Şebekesi */}
        <div className="relative w-full h-44 sm:h-56 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-4 flex flex-col justify-between">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>KUZEY (Selçuklu / Kampüs)</span>
            <span>DOĞU (Karatay)</span>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {stations.map(st => {
              const badge = getStatusBadge(st.status);
              return (
                <button
                  key={st.stationId}
                  onClick={() => onSelectStation(st)}
                  className="flex items-center gap-2 p-2 bg-white/90 hover:bg-white rounded-lg border border-slate-200 shadow-2xs text-left transition-all hover:scale-102 group"
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${badge.dot}`} />
                  <div className="truncate">
                    <span className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-700 block truncate">
                      {st.name.replace(' Akıllı Durak', '')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{st.stationId}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>GÜNEY (Meram)</span>
            <span>Şehir Merkezi (Alaaddin)</span>
          </div>
        </div>
      </div>

      {/* Durak Kartları Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stations.map((station) => {
          const badge = getStatusBadge(station.status);
          const [lat, lng] = station.coordinates;

          return (
            <div
              key={station.stationId}
              className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Kart Başlığı */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.bg}`}>
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </span>
                  <span className="text-xs font-mono font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {station.stationId}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {station.name}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span>
                  </div>
                  {station.distanceKm !== undefined && (
                    <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                      {station.distanceKm} km
                    </span>
                  )}
                </div>
              </div>

              {/* Kart İçerik Göstergeleri */}
              <div className="p-4 sm:p-5 space-y-4 flex-1">
                {/* Şarj & Donanım Özeti */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-blue-800 font-medium block">USB-C Şarj</span>
                      <strong className="text-slate-900">{station.usbCPorts} Port</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center gap-2">
                    <Plug className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-amber-800 font-medium block">220V Priz</span>
                      <strong className="text-slate-900">{station.powerOutlets} Adet</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-violet-50/70 border border-violet-100 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-violet-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-violet-800 font-medium block">Kablosuz (Qi)</span>
                      <strong className="text-slate-900">{station.wirelessCharging ? 'Aktif' : 'Yok'}</strong>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-100 flex items-center gap-2">
                    <Snowflake className="w-4 h-4 text-cyan-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-cyan-800 font-medium block">İklimlendirme</span>
                      <strong className="text-slate-900 truncate block">
                        {station.hvacStatus.includes('Aktif') ? 'Aktif' : 'Sınırlı/Kapalı'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Temiz Enerji & Sıcaklık */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Güneş Üretimi</span>
                    <strong className="text-emerald-700">{station.solarProductionKw} kW</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Temiz Enerji</span>
                    <strong className="text-emerald-700">%{station.dailyCleanEnergyRatio}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">İç Sıcaklık</span>
                    <strong className="text-slate-800">{station.indoorTemperature} °C</strong>
                  </div>
                </div>

                {/* Erişilebilirlik Notu */}
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Accessibility className="w-4 h-4 text-teal-600 shrink-0" />
                  <span className="truncate">{station.accessibility}</span>
                </div>

                {/* Güvenli Enerji Kabini Bildirimi */}
                <div className="p-2.5 bg-slate-900 text-white rounded-xl text-[11px] flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="font-semibold text-emerald-300">Güvenli Enerji Kabini:</span>
                    <span className="text-slate-300 truncate">Durağın yanında/arkasında, ayrı, kilitli ve havalandırmalı</span>
                  </div>
                  <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800 shrink-0">
                    Yangına Dayanımlı
                  </span>
                </div>
              </div>

              {/* Kart Aksiyon Butonları */}
              <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onSelectStation(station)}
                  className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detayları İncele</span>
                </button>
                <button
                  onClick={() => onOpenFeedback(station)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  title="Sorun Bildir"
                >
                  Bildir
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

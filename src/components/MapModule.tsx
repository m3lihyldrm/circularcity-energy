import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PublicStation, StationStatus } from '../types';
import { Zap, Sun, Shield, Layers, Navigation2, Compass, AlertTriangle, Eye } from 'lucide-react';
import { getStatusBadge } from './StationDrawer';

interface MapModuleProps {
  stations: PublicStation[];
  selectedStation: PublicStation | null;
  onSelectStation: (station: PublicStation) => void;
  userLocation: [number, number] | null;
  onSwitchToFallback: () => void;
}

// Konya Şehir Merkezi Koordinatı
const KONYA_CENTER: [number, number] = [37.8746, 32.4932];
const DEFAULT_ZOOM = 13;

/**
 * Harita merkezini ve zoom'unu programatik olarak değiştiren yardımcı bileşen
 */
const MapUpdater: React.FC<{
  center: [number, number];
  zoom?: number;
}> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), {
      duration: 1.2,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
};

/**
 * Marker renklerine göre özel Leaflet DivIcon üretici
 * Yeşil = Hizmet Aktif
 * Sarı = Sınırlı Mod / Düşük Enerji
 * Kırmızı = Bakımda / Hizmet Dışı
 * Gri = Bağlantı Yok
 */
const createStationIcon = (status: StationStatus, isSelected: boolean) => {
  let bgColor = '#10b981'; // Yeşil
  let borderColor = '#065f46';
  let pulseColor = 'rgba(16, 185, 129, 0.45)';

  if (status === 'sinirli') {
    bgColor = '#f59e0b'; // Sarı
    borderColor = '#92400e';
    pulseColor = 'rgba(245, 158, 11, 0.45)';
  } else if (status === 'bakimda') {
    bgColor = '#ef4444'; // Kırmızı
    borderColor = '#991b1b';
    pulseColor = 'rgba(239, 68, 68, 0.45)';
  } else if (status === 'baglanti_yok') {
    bgColor = '#64748b'; // Gri
    borderColor = '#334155';
    pulseColor = 'rgba(100, 116, 139, 0.35)';
  }

  const size = isSelected ? 44 : 36;
  const pulseHtml = isSelected
    ? `<div style="position: absolute; top: -6px; left: -6px; width: ${size + 12}px; height: ${size + 12}px; border-radius: 50%; background-color: ${pulseColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
    : '';

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;">
      ${pulseHtml}
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${bgColor};
        border: 3px solid #ffffff;
        box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: transform 0.2s ease;
        ${isSelected ? 'transform: scale(1.15);' : ''}
      ">
        <svg width="${size * 0.48}" height="${size * 0.48}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-station-pin',
    html: html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

/**
 * Kullanıcı Konumu İkonu
 */
const userLocationIcon = L.divIcon({
  className: 'user-location-pin',
  html: `
    <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; width: 28px; height: 28px; border-radius: 50%; background: rgba(59, 130, 246, 0.35); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="width: 16px; height: 16px; border-radius: 50%; background: #2563eb; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export const MapModule: React.FC<MapModuleProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  userLocation,
  onSwitchToFallback
}) => {
  const [tileError, setTileError] = useState(false);

  // Harita odağı: Seçili durak varsa ona, kullanıcı konumu varsa ona, yoksa Konya merkezine odaklan
  const currentCenter: [number, number] = selectedStation
    ? selectedStation.coordinates
    : userLocation || KONYA_CENTER;

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] bg-slate-100 overflow-hidden">
      {/* Çevrimdışı / Harita Yüklenememe Durumu Bildirimi */}
      {tileError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-amber-300 text-xs text-amber-900 flex items-center gap-2 max-w-md">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Harita karoları çevrimdışı geliştirme ortamında gecikmeli yüklenebilir.</span>
          <button
            onClick={onSwitchToFallback}
            className="ml-auto font-bold text-emerald-700 underline hover:text-emerald-800"
          >
            Liste Görünümüne Geç
          </button>
        </div>
      )}

      {/* Harita Bileşeni */}
      <MapContainer
        center={KONYA_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        touchZoom={true}
        className="w-full h-full z-0 touch-pan-x touch-pan-y"
        style={{ background: '#f8fafc' }}
      >
        {/* OpenStreetMap Harita Katmanı (API Anahtarı Zorunlu Değildir) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> katılımcıları'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          eventHandlers={{
            tileerror: () => {
              // İnternetsiz offline ortamda sessizce fallback'i hazırla
              setTileError(true);
            },
          }}
        />

        <MapUpdater center={currentCenter} zoom={selectedStation ? 15 : undefined} />

        {/* Kullanıcı Konumu Markeri */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="p-1 text-xs font-semibold text-slate-800">
                📍 Sizin Konumunuz (Geçici oturum)
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pilot Akıllı Durak Markerleri */}
        {stations.map((station) => {
          const isSelected = selectedStation?.stationId === station.stationId;
          const icon = createStationIcon(station.status, isSelected);
          const badge = getStatusBadge(station.status);

          return (
            <Marker
              key={station.stationId}
              position={station.coordinates}
              icon={icon}
              eventHandlers={{
                click: () => {
                  onSelectStation(station);
                },
              }}
            >
              <Popup className="custom-station-popup">
                <div className="p-2 space-y-2 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {station.stationId}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                    {station.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>
                      ⚡ USB-C: <strong className="text-slate-800">{station.usbCPorts}</strong>
                    </div>
                    <div>
                      🔌 Priz: <strong className="text-slate-800">{station.powerOutlets}</strong>
                    </div>
                    <div>
                      ☀️ Güneş: <strong className="text-emerald-700">{station.solarProductionKw} kW</strong>
                    </div>
                    <div>
                      🌱 Temiz: <strong className="text-emerald-700">%{station.dailyCleanEnergyRatio}</strong>
                    </div>
                  </div>

                  {station.distanceKm !== undefined && (
                    <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-1 rounded">
                      🚶 {station.distanceKm} km ({station.walkingMinutes} dk yürüme)
                    </div>
                  )}

                  <button
                    onClick={() => onSelectStation(station)}
                    className="w-full mt-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detayları Aç</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Harita Üzeri Renk Göstergesi (Legend) */}
      <div className="absolute bottom-6 left-4 z-[500] bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200/80 text-xs space-y-1.5 pointer-events-auto max-w-[220px]">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pb-1 border-b border-slate-100">
          Durak Durumu Göstergesi
        </span>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-xs shrink-0" />
          <span>Yeşil: Hizmet Aktif</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-xs shrink-0" />
          <span>Sarı: Sınırlı Mod / Düşük Enerji</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shadow-xs shrink-0" />
          <span>Kırmızı: Bakımda / Hizmet Dışı</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-slate-500 border border-white shadow-xs shrink-0" />
          <span>Gri: Bağlantı Yok</span>
        </div>
      </div>

      {/* İnternetsiz Çevrimdışı Geliştirme İçin Hızlı Geçiş Butonu */}
      <div className="absolute top-4 right-4 z-[500]">
        <button
          onClick={onSwitchToFallback}
          className="flex items-center gap-2 px-3 py-2 bg-white/95 hover:bg-white text-slate-700 text-xs font-semibold rounded-xl shadow-md border border-slate-200 transition-all hover:shadow-lg"
          title="Harita yerine kart listesini göster"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Statik / Liste Görünümü</span>
          <span className="sm:hidden">Liste</span>
        </button>
      </div>
    </div>
  );
};

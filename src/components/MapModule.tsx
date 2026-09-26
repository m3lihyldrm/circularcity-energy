import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PublicStation, StationStatus } from '../types';
import { Zap, Sun, AlertTriangle, Eye, Layers } from 'lucide-react';
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
      duration: 1.0,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
};

/**
 * Sade, yüksek kaliteli, marka uyumlu Leaflet DivIcon üretici
 * Aktif: Forest yeşili (#1F5A43) + beyaz merkez
 * Sınırlı: Sıcak amber (#B7791F)
 * Bakım: Kırmızı (#B94040)
 * Bağlantı yok: Koyu gri (#5D665E)
 */
const createStationIcon = (status: StationStatus, isSelected: boolean) => {
  let bgColor = '#1F5A43'; // Forest yeşili

  if (status === 'sinirli') {
    bgColor = '#B7791F'; // Sıcak amber
  } else if (status === 'bakimda') {
    bgColor = '#B94040'; // Kırmızı
  } else if (status === 'baglanti_yok') {
    bgColor = '#5D665E'; // Koyu gri
  }

  const size = isSelected ? 36 : 28;

  const html = `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: ${size}px; height: ${size}px;">
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${bgColor};
        border: 2.5px solid #ffffff;
        box-shadow: 0 2px 8px rgba(24, 32, 25, 0.25);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.15s ease;
        ${isSelected ? 'transform: scale(1.15); box-shadow: 0 0 0 3px rgba(31, 90, 67, 0.3);' : ''}
      ">
        <div style="width: ${size * 0.36}px; height: ${size * 0.36}px; background-color: #ffffff; border-radius: 50%;"></div>
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
 * Kullanıcı Konumu İkonu (Sakin mavi nokta)
 */
const userLocationIcon = L.divIcon({
  className: 'user-location-pin',
  html: `
    <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
      <div style="width: 14px; height: 14px; border-radius: 50%; background: #416D86; border: 2.5px solid white; box-shadow: 0 1px 6px rgba(0,0,0,0.25);"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export const MapModule: React.FC<MapModuleProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  userLocation,
  onSwitchToFallback
}) => {
  const [tileError, setTileError] = useState(false);

  const currentCenter: [number, number] = selectedStation
    ? selectedStation.coordinates
    : userLocation || KONYA_CENTER;

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[500px] bg-[#E8ECE6] overflow-hidden">
      {/* Çevrimdışı / Harita Yüklenememe Durumu Bildirimi */}
      {tileError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white px-4 py-2.5 rounded-lg shadow-subtle border border-[#DDE1DA] text-xs text-[#182019] flex items-center gap-2 max-w-md">
          <AlertTriangle className="w-4 h-4 text-[#B7791F] shrink-0" />
          <span>Harita karoları çevrimdışı ortamda gecikmeli yüklenebilir.</span>
          <button
            onClick={onSwitchToFallback}
            className="ml-auto font-semibold text-[#1F5A43] underline hover:text-[#174634]"
          >
            Liste Görünümü
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
        style={{ background: '#E8ECE6' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          eventHandlers={{
            tileerror: () => {
              setTileError(true);
            },
          }}
        />

        <MapUpdater center={currentCenter} zoom={selectedStation ? 15 : undefined} />

        {/* Kullanıcı Konumu */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="p-1 text-xs font-semibold text-[#182019]">
                Konumunuz (Geçici oturum)
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
                <div className="p-2 space-y-2 min-w-[210px] text-[#182019]">
                  <div className="flex items-center justify-between gap-2 border-b border-[#DDE1DA] pb-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-[#5D665E]">
                      {station.stationId}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#182019] leading-snug">
                    {station.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#5D665E] bg-[#F6F6F2] p-2 rounded-lg border border-[#DDE1DA]">
                    <div>
                      USB-C: <strong className="text-[#182019] tabular-nums">{station.usbCPorts} Port</strong>
                    </div>
                    <div>
                      Priz: <strong className="text-[#182019] tabular-nums">{station.powerOutlets} Adet</strong>
                    </div>
                    <div>
                      Güneş: <strong className="text-[#1F5A43] tabular-nums">{station.solarProductionKw} kW</strong>
                    </div>
                    <div>
                      Temiz Enerji: <strong className="text-[#1F5A43] tabular-nums">%{station.dailyCleanEnergyRatio}</strong>
                    </div>
                  </div>

                  {station.distanceKm !== undefined && (
                    <div className="text-[11px] text-[#1F5A43] font-medium bg-[#E5F0EA] px-2 py-1 rounded-md">
                      Mesafe: {station.distanceKm} km (~{station.walkingMinutes} dk yürüme)
                    </div>
                  )}

                  <button
                    onClick={() => onSelectStation(station)}
                    className="w-full mt-1 py-1.5 px-3 bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detayları İncele</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Harita Lejandı (Alt Sol Köşede Sade Kutu) */}
      <div className="absolute bottom-5 left-4 z-[500] bg-white/95 border border-[#DDE1DA] p-3 rounded-lg shadow-subtle text-xs space-y-1.5 pointer-events-auto max-w-[200px]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5D665E] block pb-1 border-b border-[#DDE1DA]">
          Durak Durumu
        </span>
        <div className="flex items-center gap-2 text-[#182019]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F5A43] shrink-0" />
          <span>Hizmet Aktif</span>
        </div>
        <div className="flex items-center gap-2 text-[#182019]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B7791F] shrink-0" />
          <span>Sınırlı Mod</span>
        </div>
        <div className="flex items-center gap-2 text-[#182019]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B94040] shrink-0" />
          <span>Bakımda</span>
        </div>
        <div className="flex items-center gap-2 text-[#182019]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5D665E] shrink-0" />
          <span>Bağlantı Yok</span>
        </div>
      </div>

      {/* Liste Görünümüne Hızlı Geçiş Butonu */}
      <div className="absolute top-4 right-4 z-[500]">
        <button
          onClick={onSwitchToFallback}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-[#182019] text-xs font-medium rounded-lg shadow-subtle border border-[#DDE1DA] hover:bg-[#F6F6F2] transition-colors"
          title="Yedek liste görünümüne geç"
        >
          <Layers className="w-4 h-4 text-[#1F5A43]" />
          <span className="hidden sm:inline">Liste Görünümü</span>
          <span className="sm:hidden">Liste</span>
        </button>
      </div>
    </div>
  );
};

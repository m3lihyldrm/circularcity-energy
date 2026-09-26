import React, { useState, useMemo } from 'react';
import { PublicStation, FilterState } from '../types';
import { getNearbyStations } from '../services/api';
import { MapModule } from './MapModule';
import { FilterBar } from './FilterBar';
import { OfflineFallbackView } from './OfflineFallbackView';
import { StationDrawer } from './StationDrawer';
import { FeedbackModal } from './FeedbackModal';
import { PrivacyConsentModal } from './PrivacyConsentModal';
import { Info, CheckCircle2 } from 'lucide-react';

interface CityMapViewProps {
  stations: PublicStation[];
  onSelectStation?: (station: PublicStation) => void;
  tourStep?: number;
}

export const CityMapView: React.FC<CityMapViewProps> = ({
  stations: initialStations,
  tourStep
}) => {
  const [stations, setStations] = useState<PublicStation[]>(initialStations);
  const [selectedStation, setSelectedStation] = useState<PublicStation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Jüri sunumu adımları için otomatik durak açma / kapatma
  React.useEffect(() => {
    if (tourStep === 4 || tourStep === 5) {
      const campus = stations.find((s) => s.stationId === 'ST-KNY-01') || stations[0];
      if (campus) {
        setSelectedStation(campus);
        setDrawerOpen(true);
      }
    } else if (tourStep === 3) {
      setDrawerOpen(false);
    }
  }, [tourStep, stations]);
  const [feedbackStation, setFeedbackStation] = useState<PublicStation | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isNearestActive, setIsNearestActive] = useState(false);
  const [locationNotice, setLocationNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const [filters, setFilters] = useState<FilterState>({
    chargingAvailable: false,
    wirelessCharging: false,
    powerOutlet: false,
    hvacActive: false,
    accessible: false,
    onlyActive: false,
    showNearestOnly: false,
    searchQuery: '',
  });

  const handleTriggerNearest = () => {
    if (userLocation) {
      setIsNearestActive(!isNearestActive);
    } else {
      setPrivacyModalOpen(true);
    }
  };

  const handleConsentApproved = () => {
    setLocationNotice(null);
    if (!navigator.geolocation) {
      setLocationNotice('Tarayıcınız konum servisini desteklememektedir.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setIsNearestActive(true);
        const nearby = await getNearbyStations(latitude, longitude);
        setStations(nearby);
        if (nearby.length > 0) {
          setSelectedStation(nearby[0]);
          setDrawerOpen(true);
        }
      },
      (err) => {
        const simLat = 37.8720;
        const simLng = 32.4920;
        setUserLocation([simLat, simLng]);
        setIsNearestActive(true);
        getNearbyStations(simLat, simLng).then((nearby) => {
          setStations(nearby);
          if (nearby.length > 0) {
            setSelectedStation(nearby[0]);
            setDrawerOpen(true);
          }
        });
      },
      { timeout: 8000 }
    );
  };

  const handleConsentDenied = () => {
    setLocationNotice('Konum izni verilmedi. Durakları harita veya listeden seçebilirsiniz.');
  };

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches = station.name.toLowerCase().includes(q) || station.stationId.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filters.onlyActive && station.status !== 'aktif') return false;
      if (filters.chargingAvailable && station.usbCPorts === 0 && station.powerOutlets === 0) return false;
      if (filters.wirelessCharging && !station.wirelessCharging) return false;
      if (filters.powerOutlet && station.powerOutlets === 0) return false;
      if (filters.hvacActive && !station.hvacStatus.includes('Aktif')) return false;
      if (filters.accessible && !station.accessibility.includes('Uyumlu')) return false;
      return true;
    });
  }, [stations, filters]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F6F6F2]">
      {/* Konum İzni Reddedildiğinde Bilgilendirme */}
      {locationNotice && (
        <div className="bg-white border-b border-[#DDE1DA] px-4 py-2 text-xs text-[#5D665E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#1F5A43]" />
            <span>{locationNotice}</span>
          </div>
          <button
            onClick={() => setLocationNotice(null)}
            className="text-xs text-[#5D665E] hover:text-[#182019]"
          >
            ✕
          </button>
        </div>
      )}

      {/* Filtre Barı */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        totalCount={stations.length}
        filteredCount={filteredStations.length}
        onTriggerNearest={handleTriggerNearest}
        isNearestActive={isNearestActive}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Harita veya Yedek Liste Görünümü */}
      <div
        id="tour-step-3-map"
        className={`flex-1 relative min-h-[500px] transition-all duration-300 ${
          tourStep === 3 ? 'ring-2 ring-[#1F5A43]/40' : ''
        }`}
      >
        {viewMode === 'map' ? (
          <MapModule
            stations={filteredStations}
            selectedStation={selectedStation}
            onSelectStation={(st) => {
              setSelectedStation(st);
              setDrawerOpen(true);
            }}
            userLocation={userLocation}
            onSwitchToFallback={() => setViewMode('list')}
          />
        ) : (
          <OfflineFallbackView
            stations={filteredStations}
            onSelectStation={(st) => {
              setSelectedStation(st);
              setDrawerOpen(true);
            }}
            onOpenFeedback={(st) => {
              setFeedbackStation(st);
              setFeedbackModalOpen(true);
            }}
            onSwitchToMap={() => setViewMode('map')}
          />
        )}
      </div>

      {/* Detay Paneli */}
      <StationDrawer
        station={selectedStation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpenFeedback={(st) => {
          setDrawerOpen(false);
          setFeedbackStation(st);
          setFeedbackModalOpen(true);
        }}
        tourStep={tourStep}
      />

      {/* Geri Bildirim Modal */}
      <FeedbackModal
        station={feedbackStation}
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

      {/* Konum Onay Modal */}
      <PrivacyConsentModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        onConfirm={handleConsentApproved}
        onDeny={handleConsentDenied}
      />
    </div>
  );
};

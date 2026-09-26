import React from 'react';
import {
  Zap,
  Wifi,
  Plug,
  Snowflake,
  Accessibility,
  CheckCircle,
  Navigation,
  Search,
  RotateCcw,
  SlidersHorizontal,
  Map as MapIcon,
  List
} from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalCount: number;
  filteredCount: number;
  onTriggerNearest: () => void;
  isNearestActive: boolean;
  viewMode: 'map' | 'list';
  setViewMode: (mode: 'map' | 'list') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  totalCount,
  filteredCount,
  onTriggerNearest,
  isNearestActive,
  viewMode,
  setViewMode,
}) => {
  const toggleFilter = (key: keyof Omit<FilterState, 'searchQuery'>) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetFilters = () => {
    setFilters({
      chargingAvailable: false,
      wirelessCharging: false,
      powerOutlet: false,
      hvacActive: false,
      accessible: false,
      onlyActive: false,
      showNearestOnly: false,
      searchQuery: ''
    });
  };

  const hasActiveFilters =
    filters.chargingAvailable ||
    filters.wirelessCharging ||
    filters.powerOutlet ||
    filters.hvacActive ||
    filters.accessible ||
    filters.onlyActive ||
    filters.showNearestOnly ||
    filters.searchQuery.length > 0;

  return (
    <div className="bg-white border-b border-slate-200/90 shadow-xs px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Üst Sıra: Arama, Sonuç Sayısı ve Görünüm Değiştirici */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Arama Alanı */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Durak adı veya koduna göre ara (Örn: Alaaddin, Kampüs)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Temizle
              </button>
            )}
          </div>

          {/* Durak Sayısı & Görünüm Seçici & Temizle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            <div className="text-xs text-slate-500 font-medium">
              <span className="font-bold text-emerald-700">{filteredCount}</span> / {totalCount} Durak
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Filtreleri Sıfırla</span>
              </button>
            )}

            {/* Harita / Yedek Liste Toggle Butonları */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Harita Görünümü"
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Harita</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Yedek Liste Görünümü"
              >
                <List className="w-3.5 h-3.5" />
                <span>Liste</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alt Sıra: Filtre Hapları (Touch-friendly & Horizontal Scrolling) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin pt-1">
          {/* En Yakındaki Durağı Göster */}
          <button
            onClick={onTriggerNearest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
              isNearestActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isNearestActive ? 'animate-bounce' : ''}`} />
            <span>En Yakındaki Durağı Göster</span>
          </button>

          {/* Sadece Aktif Duraklar */}
          <button
            onClick={() => toggleFilter('onlyActive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
              filters.onlyActive
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sadece Aktif Duraklar</span>
          </button>

          {/* Şarj Kullanılabilir */}
          <button
            onClick={() => toggleFilter('chargingAvailable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
              filters.chargingAvailable
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Şarj Kullanılabilir</span>
          </button>

          {/* Kablosuz Şarj Aktif */}
          <button
            onClick={() => toggleFilter('wirelessCharging')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
              filters.wirelessCharging
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Wifi className="w-3.5 h-3.5 text-violet-500" />
            <span>Kablosuz Şarj Aktif</span>
          </button>

          {/* 220V Priz Aktif */}
          <button
            onClick={() => toggleFilter('powerOutlet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
              filters.powerOutlet
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Plug className="w-3.5 h-3.5 text-blue-500" />
            <span>Priz Aktif</span>
          </button>

          {/* İklimlendirme Aktif */}
          <button
            onClick={() => toggleFilter('hvacActive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
              filters.hvacActive
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5 text-cyan-500" />
            <span>İklimlendirme Aktif</span>
          </button>

          {/* Engelli Erişimine Uygun */}
          <button
            onClick={() => toggleFilter('accessible')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shrink-0 border transition-all ${
              filters.accessible
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5 text-teal-600" />
            <span>Engelli Erişimine Uygun</span>
          </button>
        </div>
      </div>
    </div>
  );
};

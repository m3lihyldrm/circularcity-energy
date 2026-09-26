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
    <div className="bg-white border-b border-[#DDE1DA] px-4 py-3 sm:px-6 shadow-subtle">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Üst Sıra: Arama, Sonuç Sayısı ve Görünüm Değiştirici */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Arama Alanı */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#5D665E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Durak adı veya koduna göre ara (Örn: Alaaddin, Kampüs)..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-[#F6F6F2] border border-[#DDE1DA] rounded-lg text-[#182019] placeholder:text-[#5D665E] focus:bg-white focus:border-[#1F5A43] focus:outline-none transition-colors"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#5D665E] hover:text-[#182019]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Durak Sayısı & Görünüm Seçici & Temizle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            <div className="text-xs text-[#5D665E]">
              <span className="font-bold text-[#1F5A43] tabular-nums">{filteredCount}</span> / {totalCount} Durak
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#B94040] hover:bg-[#FCECEC] rounded-lg transition-colors font-medium border border-[#B94040]/20"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sıfırla</span>
              </button>
            )}

            {/* Harita / Yedek Liste Toggle Butonları */}
            <div className="flex items-center bg-[#EFF0EB] p-0.5 rounded-lg border border-[#DDE1DA]">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-[#182019] shadow-subtle font-semibold'
                    : 'text-[#5D665E] hover:text-[#182019]'
                }`}
                title="Harita Görünümü"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#1F5A43]" />
                <span>Harita</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#182019] shadow-subtle font-semibold'
                    : 'text-[#5D665E] hover:text-[#182019]'
                }`}
                title="Yedek Liste Görünümü"
              >
                <List className="w-3.5 h-3.5 text-[#5D665E]" />
                <span>Liste</span>
              </button>
            </div>
          </div>
        </div>

        {/* Alt Sıra: Filtre Butonları (Yatay ve Dokunmatik Uyumlu) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {/* En Yakındaki Durağı Göster */}
          <button
            onClick={onTriggerNearest}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              isNearestActive
                ? 'bg-[#1F5A43] text-white border-[#1F5A43] font-semibold shadow-subtle'
                : 'bg-white text-[#182019] border-[#DDE1DA] hover:border-[#1F5A43]/40 hover:bg-[#F6F6F2]'
            }`}
          >
            <Navigation className={`w-3.5 h-3.5 ${isNearestActive ? 'text-white' : 'text-[#1F5A43]'}`} />
            <span>En Yakındaki Durağı Göster</span>
          </button>

          {/* Sadece Aktif Duraklar */}
          <button
            onClick={() => toggleFilter('onlyActive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              filters.onlyActive
                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/40 font-semibold'
                : 'bg-white text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:bg-[#F6F6F2]'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#1F5A43]" />
            <span>Sadece Aktif Duraklar</span>
          </button>

          {/* Şarj Kullanılabilir */}
          <button
            onClick={() => toggleFilter('chargingAvailable')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              filters.chargingAvailable
                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/40 font-semibold'
                : 'bg-white text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:bg-[#F6F6F2]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#1F5A43]" />
            <span>Şarj Kullanılabilir</span>
          </button>

          {/* 220V Priz Aktif */}
          <button
            onClick={() => toggleFilter('powerOutlet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              filters.powerOutlet
                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/40 font-semibold'
                : 'bg-white text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:bg-[#F6F6F2]'
            }`}
          >
            <Plug className="w-3.5 h-3.5 text-[#1F5A43]" />
            <span>Priz Aktif</span>
          </button>

          {/* Kablosuz Şarj Aktif */}
          <button
            onClick={() => toggleFilter('wirelessCharging')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              filters.wirelessCharging
                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/40 font-semibold'
                : 'bg-white text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:bg-[#F6F6F2]'
            }`}
          >
            <Wifi className="w-3.5 h-3.5 text-[#1F5A43]" />
            <span>Kablosuz Şarj</span>
          </button>

          {/* İklimlendirme Aktif */}
          <button
            onClick={() => toggleFilter('hvacActive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              filters.hvacActive
                ? 'bg-[#EAF2F6] text-[#416D86] border-[#416D86]/40 font-semibold'
                : 'bg-white text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:bg-[#F6F6F2]'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5 text-[#416D86]" />
            <span>İklimlendirme</span>
          </button>

          {/* Engelli Erişimine Uygun */}
          <button
            onClick={() => toggleFilter('accessible')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all ${
              filters.accessible
                ? 'bg-[#E5F0EA] text-[#1F5A43] border-[#1F5A43]/40 font-semibold'
                : 'bg-white text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:bg-[#F6F6F2]'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5 text-[#1F5A43]" />
            <span>Erişilebilir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

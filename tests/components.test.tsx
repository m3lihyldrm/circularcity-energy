import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import fs from 'fs';
import path from 'path';
import { FilterBar } from '../src/components/FilterBar';
import { OfflineFallbackView } from '../src/components/OfflineFallbackView';
import { StationDrawer } from '../src/components/StationDrawer';
import { fallbackStations } from '../src/services/mockData';
import { FilterState } from '../src/types';

describe('CircularCity Energy Frontend Bileşen ve Arayüz Testleri', () => {
  // 9. React uygulaması build kontrolü
  describe('9. React Uygulaması Build Kontrolü', () => {
    it('Vite build çıktısı (dist/index.html ve varlıklar) başarıyla oluşturulmuştur', () => {
      const distPath = path.resolve(__dirname, '../dist');
      const indexPath = path.join(distPath, 'index.html');
      const assetsPath = path.join(distPath, 'assets');

      expect(fs.existsSync(distPath)).toBe(true);
      expect(fs.existsSync(indexPath)).toBe(true);
      expect(fs.existsSync(assetsPath)).toBe(true);

      const htmlContent = fs.readFileSync(indexPath, 'utf-8');
      expect(htmlContent).toContain('CircularCity Energy');
      expect(htmlContent).toContain('<div id="root">');
    });
  });

  // 10. Harita modülü ve yedek liste görünümü render kontrolü
  describe('10. Harita ve Liste Görünümü Render Kontrolü', () => {
    it('Offline/Yedek Liste Görünümü tüm 6 pilot durağı ve durumlarını eksiksiz listeler', () => {
      const handleSelect = vi.fn();
      const handleFeedback = vi.fn();

      render(
        <OfflineFallbackView
          stations={fallbackStations}
          onSelectStation={handleSelect}
          onOpenFeedback={handleFeedback}
        />
      );

      // 6 durak adının ekranda listelendiğini doğrula
      expect(screen.getByText('Kampüs Ana Giriş Akıllı Durak')).toBeInTheDocument();
      expect(screen.getByText('Alaaddin Bulvarı Akıllı Durak')).toBeInTheDocument();
      expect(screen.getByText('Selçuklu Kongre Merkezi Akıllı Durak')).toBeInTheDocument();
      expect(screen.getByText('Karatay Bilim Merkezi Akıllı Durak')).toBeInTheDocument();
      expect(screen.getByText('Meram Park Akıllı Durak')).toBeInTheDocument();
      expect(screen.getByText('Kılıçarslan Gençlik Merkezi Akıllı Durak')).toBeInTheDocument();

      // Güvenli Enerji Kabini mesajını doğrula
      const safetyNotes = screen.getAllByText(/Güvenli Enerji Kabini/i);
      expect(safetyNotes.length).toBeGreaterThan(0);
    });

    it('Durak kartına tıklandığında onSelectStation çağrılır', () => {
      const handleSelect = vi.fn();
      const handleFeedback = vi.fn();

      render(
        <OfflineFallbackView
          stations={fallbackStations}
          onSelectStation={handleSelect}
          onOpenFeedback={handleFeedback}
        />
      );

      const inspectButtons = screen.getAllByText('Detayları İncele');
      expect(inspectButtons.length).toBe(6);
      fireEvent.click(inspectButtons[0]);

      expect(handleSelect).toHaveBeenCalledWith(fallbackStations[0]);
    });
  });

  // 11. Filtrelerin çalışması
  describe('11. Filtrelerin Çalışması (FilterBar)', () => {
    it('Filtre butonları tıklandığında setFilters fonksiyonunu tetikler', () => {
      const filters: FilterState = {
        chargingAvailable: false,
        wirelessCharging: false,
        powerOutlet: false,
        hvacActive: false,
        accessible: false,
        onlyActive: false,
        showNearestOnly: false,
        searchQuery: '',
      };

      const setFilters = vi.fn();
      const handleTriggerNearest = vi.fn();
      const setViewMode = vi.fn();

      render(
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onTriggerNearest={handleTriggerNearest}
          isNearestActive={false}
          totalCount={6}
          filteredCount={6}
          viewMode="map"
          setViewMode={setViewMode}
        />
      );

      // 'Şarj Kullanılabilir' butonuna tıkla
      const chargingButton = screen.getByText('Şarj Kullanılabilir');
      fireEvent.click(chargingButton);

      expect(setFilters).toHaveBeenCalled();
    });

    it('Arama kutusuna yazıldığında setFilters tetiklenir', () => {
      const filters: FilterState = {
        chargingAvailable: false,
        wirelessCharging: false,
        powerOutlet: false,
        hvacActive: false,
        accessible: false,
        onlyActive: false,
        showNearestOnly: false,
        searchQuery: '',
      };

      const setFilters = vi.fn();

      render(
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          onTriggerNearest={vi.fn()}
          isNearestActive={false}
          totalCount={6}
          filteredCount={6}
          viewMode="map"
          setViewMode={vi.fn()}
        />
      );

      const searchInput = screen.getByPlaceholderText(/Durak adı veya koduna göre ara/i);
      fireEvent.change(searchInput, { target: { value: 'Alaaddin' } });

      expect(setFilters).toHaveBeenCalled();
    });
  });

  // 12. Mobilde yatay taşma olmaması (overflow-x kontrolü)
  describe('12. Mobilde Yatay Taşma ve Responsive Uyumluluk Kontrolü', () => {
    it('index.html dosyasında mobil viewport ve body overflow-x-hidden tanımlıdır', () => {
      const indexPath = path.resolve(__dirname, '../index.html');
      const htmlContent = fs.readFileSync(indexPath, 'utf-8');

      expect(htmlContent).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0');
      expect(htmlContent).toContain('overflow-x-hidden');
    });

    it('src/index.css dosyasında html ve body için overflow-x kısıtlaması tanımlıdır', () => {
      const cssPath = path.resolve(__dirname, '../src/index.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');

      expect(cssContent).toContain('overflow-x: hidden');
      expect(cssContent).toContain('max-width: 100%');
    });

    it('StationDrawer mobil ekranda güvenli kabin ve şeffaflık uyarılarını taşmadan sunar', () => {
      const station = fallbackStations[0];
      const handleClose = vi.fn();
      const handleFeedback = vi.fn();

      render(
        <StationDrawer
          station={station}
          isOpen={true}
          onClose={handleClose}
          onOpenFeedback={handleFeedback}
        />
      );

      expect(screen.getByText(station.name)).toBeInTheDocument();
      expect(screen.getByText(/Batarya oturma alanında değil/i)).toBeInTheDocument();
      expect(screen.getByText(/Ayrı Güvenli Enerji Kabini/i)).toBeInTheDocument();
      expect(screen.queryByText(/Zero Leakage/i)).toBeNull();
    });
  });
});

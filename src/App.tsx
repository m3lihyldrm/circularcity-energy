import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CityMapView } from './components/CityMapView';
import { HowItWorksView } from './components/HowItWorksView';
import { ImpactView } from './components/ImpactView';
import { FaqView } from './components/FaqView';
import { AdminPortal } from './components/AdminPortal';
import { JuryTourGuide } from './components/JuryTourGuide';
import { PublicStation } from './types';
import { getPublicStations } from './services/api';
import { fallbackStations } from './services/mockData';
import { ShieldCheck, Lock } from 'lucide-react';

export const App: React.FC = () => {
  // Sync tab with pathname or hash
  const getInitialTab = (): NavTab => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.includes('admin') || hash.includes('admin')) return 'admin';
    if (path.includes('harita') || hash.includes('harita') || path.includes('map') || hash.includes('map')) return 'map';
    if (path.includes('nasil') || hash.includes('nasil') || path.includes('works')) return 'how-it-works';
    if (path.includes('etki') || hash.includes('etki') || path.includes('impact')) return 'impact';
    if (path.includes('sss') || hash.includes('sss') || path.includes('faq')) return 'faq';
    return 'home';
  };

  const [currentTab, setCurrentTab] = useState<NavTab>(getInitialTab);
  const [stations, setStations] = useState<PublicStation[]>(fallbackStations);

  // Jüri Sunumu (Guided Tour) State
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStep, setTourStep] = useState(1);

  useEffect(() => {
    getPublicStations()
      .then(data => {
        if (data && data.length > 0) {
          setStations(data);
        }
      });
  }, []);

  const handleNavigate = (tab: NavTab) => {
    setCurrentTab(tab);
    const tabUrls: Record<NavTab, string> = {
      home: '/',
      map: '/harita',
      'how-it-works': '/nasil-calisir',
      impact: '/etki',
      faq: '/sss',
      admin: '/admin'
    };
    window.history.pushState(null, '', tabUrls[tab]);
  };

  // Jüri Sunumu Navigasyonu
  const goToTourStep = (stepNumber: number) => {
    setTourStep(stepNumber);
    if (stepNumber === 1) {
      handleNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepNumber === 2) {
      handleNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('tour-step-2-diagram');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 120);
    } else if (stepNumber === 3) {
      handleNavigate('map');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepNumber === 4) {
      handleNavigate('map');
    } else if (stepNumber === 5) {
      handleNavigate('map');
    } else if (stepNumber === 6) {
      handleNavigate('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (stepNumber === 7) {
      handleNavigate('impact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartTour = () => {
    setIsTourActive(true);
    goToTourStep(1);
  };

  const handleNextStep = () => {
    if (tourStep <= 7) {
      goToTourStep(tourStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (tourStep > 1) {
      goToTourStep(tourStep - 1);
    }
  };

  const handleCloseTour = () => {
    setIsTourActive(false);
  };

  const handleRestartTour = () => {
    goToTourStep(1);
  };

  const handleExploreMap = () => {
    setIsTourActive(false);
    handleNavigate('map');
  };

  // If on admin view without active tour, render standalone AdminPortal
  if (currentTab === 'admin' && !isTourActive) {
    return <AdminPortal onBackToPublic={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F6F2] text-[#182019] flex flex-col font-sans selection:bg-[#1F5A43] selection:text-white">
      {/* Global Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onStartJuryTour={handleStartTour}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            tourStep={isTourActive ? tourStep : undefined}
          />
        )}
        {currentTab === 'map' && (
          <CityMapView
            stations={stations}
            tourStep={isTourActive ? tourStep : undefined}
          />
        )}
        {currentTab === 'how-it-works' && <HowItWorksView />}
        {currentTab === 'impact' && (
          <ImpactView tourStep={isTourActive ? tourStep : undefined} />
        )}
        {currentTab === 'faq' && <FaqView />}
        {currentTab === 'admin' && (
          <AdminPortal
            onBackToPublic={() => handleNavigate('home')}
            tourStep={isTourActive ? tourStep : undefined}
          />
        )}
      </main>

      {/* SAKİN KURUMSAL FOOTER */}
      <footer className="bg-white border-t border-[#DDE1DA] text-[#5D665E] py-10 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#E5F0EA] border border-[#1F5A43]/20 flex items-center justify-center text-[#1F5A43]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
                    <path d="M12 6v6l4 2" />
                    <path d="M16 2v4h4" />
                  </svg>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold text-[#182019]">CircularCity</span>
                  <span className="text-sm font-semibold text-[#1F5A43]">Energy</span>
                </div>
              </div>
              <p className="text-xs text-[#5D665E] leading-relaxed">
                Konya Akıllı Şehir Ekosistemi için güneş enerjisi ve ikinci yaşam elektrikli araç bataryalarını birleştiren döngüsel enerji durağı platformu.
              </p>
              <div className="flex items-center gap-2 text-xs text-[#1F5A43] font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur.</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-[#182019] uppercase tracking-wider mb-2">Hızlı Menü</div>
              <div>
                <button onClick={() => handleNavigate('home')} className="hover:text-[#182019] transition">Ana Sayfa</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('map')} className="hover:text-[#182019] transition">Konya Şehir Haritası</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-[#182019] transition">Nasıl Çalışır?</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('impact')} className="hover:text-[#182019] transition">Sürdürülebilirlik & Etki</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('faq')} className="hover:text-[#182019] transition">Sıkça Sorulan Sorular</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('admin')} className="text-[#1F5A43] hover:text-[#174634] transition font-medium flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Yönetici Portalı Girişi →</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#5D665E]">
              <div className="font-semibold text-[#182019] uppercase tracking-wider mb-2">Yasal & Şeffaflık Notları</div>
              <p>
                <strong>Pilot Demo:</strong> Haritada ve panellerde gösterilen tüm veriler simülasyon amaçlıdır. Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır.
              </p>
              <p>
                <strong>Şebeke Aktarımı:</strong> Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir.
              </p>
              <p>
                <strong>İkinci Yaşam:</strong> İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#DDE1DA] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5D665E]">
            <div>
              © 2026 CircularCity Energy · Konya Pilot Konsepti.
            </div>
            <div className="text-[11px] max-w-xl text-right">
              Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
            </div>
          </div>
        </div>
      </footer>

      {/* Jüri Sunumu İnteraktif Rehber Modu */}
      {isTourActive && (
        <JuryTourGuide
          step={tourStep}
          onNext={handleNextStep}
          onPrev={handlePrevStep}
          onClose={handleCloseTour}
          onRestart={handleRestartTour}
          onExploreMap={handleExploreMap}
        />
      )}
    </div>
  );
};

export default App;

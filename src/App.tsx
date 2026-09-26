import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { CityMapView } from './components/CityMapView';
import { HowItWorksView } from './components/HowItWorksView';
import { ImpactView } from './components/ImpactView';
import { FaqView } from './components/FaqView';
import { AdminPortal } from './components/AdminPortal';
import { PublicStation } from './types';
import { getPublicStations } from './services/api';
import { fallbackStations } from './services/mockData';
import { ShieldCheck, Info } from 'lucide-react';

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
  const [loadingStations, setLoadingStations] = useState(true);

  useEffect(() => {
    getPublicStations()
      .then(data => {
        if (data && data.length > 0) {
          setStations(data);
        }
      })
      .finally(() => setLoadingStations(false));
  }, []);

  const handleNavigate = (tab: NavTab) => {
    setCurrentTab(tab);
    // Update hash/URL smoothly without breaking offline file or server reload
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

  // If on admin view, render AdminPortal
  if (currentTab === 'admin') {
    return <AdminPortal onBackToPublic={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Global Navbar */}
      <Navbar currentTab={currentTab} onNavigate={handleNavigate} />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && <HomeView onNavigate={handleNavigate} />}
        {currentTab === 'map' && <CityMapView stations={stations} />}
        {currentTab === 'how-it-works' && <HowItWorksView />}
        {currentTab === 'impact' && <ImpactView />}
        {currentTab === 'faq' && <FaqView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  CC
                </span>
                <span className="text-base font-bold text-white">CircularCity Energy</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Konya Akıllı Şehir Ekosistemi için güneş enerjisi ve ikinci yaşam elektrikli araç bataryalarını birleştiren döngüsel enerji durağı platformu.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur.</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-white uppercase tracking-wider mb-2">Hızlı Menü</div>
              <div>
                <button onClick={() => handleNavigate('home')} className="hover:text-emerald-400 transition">Ana Sayfa</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('map')} className="hover:text-emerald-400 transition">Konya Şehir Haritası</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('how-it-works')} className="hover:text-emerald-400 transition">Nasıl Çalışır?</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('impact')} className="hover:text-emerald-400 transition">Sürdürülebilirlik & Etki</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('faq')} className="hover:text-emerald-400 transition">Sıkça Sorulan Sorular</button>
              </div>
              <div>
                <button onClick={() => handleNavigate('admin')} className="text-amber-400 hover:text-amber-300 transition font-medium">
                  Yönetici Portalı Girişi →
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="font-semibold text-white uppercase tracking-wider mb-2">Yasal & Şeffaflık Notları</div>
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

          <div className="pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div>
              © 2026 CircularCity Energy • Konya Pilot Konsepti. Tüm hakları saklıdır.
            </div>
            <div className="text-[11px] text-slate-400 max-w-xl text-right">
              Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import {
  MapPin,
  HelpCircle,
  BarChart3,
  MessageCircleQuestion,
  Lock,
  Menu,
  X,
  Compass
} from 'lucide-react';

export type NavTab = 'home' | 'map' | 'how-it-works' | 'impact' | 'faq' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as NavTab, label: 'Ana Sayfa' },
    { id: 'map' as NavTab, label: 'Şehir Haritası', icon: MapPin },
    { id: 'how-it-works' as NavTab, label: 'Nasıl Çalışır?', icon: HelpCircle },
    { id: 'impact' as NavTab, label: 'Etki', icon: BarChart3 },
    { id: 'faq' as NavTab, label: 'SSS', icon: MessageCircleQuestion },
  ];

  const handleItemClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* SAKİN BİLGİLENDİRME BANDI (Açık taş tonu, şeffaflık uyarısı) */}
      <div className="bg-[#EFF0EB] border-b border-[#DDE1DA] text-xs py-1.5 px-4 sm:px-6 text-[#5D665E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1F5A43]" />
          <span className="font-medium text-[#182019]">Pilot arayüz</span>
          <span>·</span>
          <span>Gösterilen veriler simülasyon amaçlıdır.</span>
        </div>
        <div className="text-[11px] hidden sm:block text-[#5D665E]">
          Konya Akıllı Şehir & Döngüsel Altyapı
        </div>
      </div>

      {/* ANA NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#DDE1DA] text-[#182019]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <button
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              {/* Minimal döngü + yaprak çizgisi */}
              <div className="w-8 h-8 rounded-lg bg-[#E5F0EA] border border-[#1F5A43]/20 flex items-center justify-center text-[#1F5A43] group-hover:bg-[#1F5A43] group-hover:text-white transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
                  <path d="M12 6v6l4 2" />
                  <path d="M16 2v4h4" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-base font-bold tracking-tight text-[#182019]">CircularCity</span>
                  <span className="text-sm font-semibold text-[#1F5A43]">Energy</span>
                </div>
                <span className="text-[10px] text-[#5D665E] hidden md:block -mt-0.5">
                  Döngüsel enerjiyle çalışan kamusal durak altyapısı
                </span>
              </div>
            </button>

            {/* MASAÜSTÜ MENÜ */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#E5F0EA] text-[#1F5A43] font-semibold'
                        : 'text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* SAĞ: YÖNETİCİ GİRİŞİ BAĞLANTISI */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleItemClick('admin')}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  currentTab === 'admin'
                    ? 'bg-[#1F5A43] text-white border-[#1F5A43]'
                    : 'text-[#5D665E] border-[#DDE1DA] hover:text-[#182019] hover:border-[#CBD3C8] hover:bg-[#F6F6F2]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Yönetici Girişi</span>
              </button>
            </div>

            {/* MOBİL MENÜ BUTONU */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => handleItemClick('admin')}
                className="p-1.5 rounded-lg text-xs text-[#5D665E] border border-[#DDE1DA]"
                title="Yönetici Girişi"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#182019] hover:bg-[#F6F6F2] border border-[#DDE1DA] focus:outline-none"
                aria-label="Menüyü aç/kapat"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBİL AÇILIR MENÜ */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#DDE1DA] bg-white px-4 pt-2 pb-4 space-y-1 shadow-subtle">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#E5F0EA] text-[#1F5A43] font-semibold'
                      : 'text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-[#DDE1DA]">
              <button
                onClick={() => handleItemClick('admin')}
                className="w-full text-left px-3.5 py-2.5 rounded-lg text-sm text-[#5D665E] hover:text-[#182019] flex items-center justify-between"
              >
                <span>Yönetici Girişi</span>
                <Lock className="w-4 h-4 text-[#5D665E]" />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

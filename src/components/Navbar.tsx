import React, { useState } from 'react';
import {
  BatteryCharging,
  MapPin,
  HelpCircle,
  BarChart3,
  MessageCircleQuestion,
  Shield,
  Menu,
  X,
  Sparkles,
  Info
} from 'lucide-react';

export type NavTab = 'home' | 'map' | 'how-it-works' | 'impact' | 'faq' | 'admin';

interface NavbarProps {
  currentTab: NavTab;
  onNavigate: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home' as NavTab, label: 'Ana Sayfa', icon: Sparkles },
    { id: 'map' as NavTab, label: 'Şehir Haritası', icon: MapPin },
    { id: 'how-it-works' as NavTab, label: 'Nasıl Çalışır?', icon: HelpCircle },
    { id: 'impact' as NavTab, label: 'Etki', icon: BarChart3 },
    { id: 'faq' as NavTab, label: 'Sık Sorulan Sorular', icon: MessageCircleQuestion },
  ];

  const handleItemClick = (tab: NavTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* ŞEFFAFLIK BİLDİRİM BARI */}
      <div className="bg-slate-950 border-b border-slate-800 text-xs py-2 px-4 text-slate-300 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Pilot Demo – Simülasyon Verisi
          </span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden md:inline">Konya Akıllı Şehir Projesi</span>
          <span className="text-emerald-400 font-mono">Döngüsel Enerji</span>
        </div>
      </div>

      {/* ANA NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleItemClick('home')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-emerald-400">
                  <BatteryCharging className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block leading-tight font-display">
                  CircularCity <span className="text-amber-400">Energy</span>
                </span>
                <span className="text-[11px] text-emerald-400 font-medium tracking-wider uppercase block">
                  İkinci Yaşam Akıllı Duraklar
                </span>
              </div>
            </button>

            {/* Masaüstü Menü */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Yönetici Girişi Butonu */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => handleItemClick('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-amber-400/40'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Yönetici Girişi</span>
              </button>
            </div>

            {/* Mobil Menü Butonu */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
                aria-label="Menüyü aç/kapat"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobil Açılır Menü */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-5 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => handleItemClick('admin')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 shadow-md"
              >
                <Shield className="w-4 h-4" />
                <span>Yönetici Girişi (Jüri Demo)</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

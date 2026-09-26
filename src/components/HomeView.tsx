import React from 'react';
import {
  Sun,
  BatteryCharging,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  MapPin,
  HelpCircle,
  Leaf,
  Layers,
  Sparkles,
  TreePine,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { NavTab } from './Navbar';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-8 sm:py-12 animate-in fade-in duration-300">
      {/* 1. HERO BÖLÜMÜ - İSKANDİNAV MİNİMAL ESTETİĞİ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Arka plan ahşap ve sürdürülebilir yeşil doku ışıltıları */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-emerald-400 backdrop-blur-md">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Döngüsel Ekonomi & İkinci Yaşam Batarya Dönüşümü</span>
            </div>

            {/* Başlık ve Alt Başlık */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-display">
              Enerji Üreten, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Şehre Değer Katan
              </span> Duraklar
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed">
              Atıktan Enerjiye, Enerjiden Yaşanabilir Şehirlere.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Elektrikli araç bataryalarını sabit depolamada değerlendiren, güneş panelleriyle kendi elektriğini üreten ve halkın anlık mobil şarj ihtiyaçlarını karşılayan akıllı kent mobilyası konsepti.
            </p>

            {/* Butonlar */}
            <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
              <button
                onClick={() => onNavigate('map')}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
              >
                <MapPin className="w-4 h-4 text-slate-950" />
                <span>Şehir Haritasını Aç</span>
              </button>

              <button
                onClick={() => onNavigate('how-it-works')}
                className="px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-white font-bold text-sm border border-slate-700/80 hover:border-slate-600 transition-all flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Nasıl Çalışır?</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEŞ İSTATİSTİK KARTI (SİMÜLASYON VERİSİ ETİKETİYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Konya Pilot Ağı Göstergeleri
            </h2>
            <p className="text-lg font-bold text-white">Sürdürülebilirlik & Hizmet Metrikleri</p>
          </div>
          <span className="text-xs font-medium text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            ⚠️ Bu sayılar simülasyon verisidir; gerçek pilot ölçümü değildir.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Kart 1 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-white">6</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Pilot Akıllı Durak</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Konya metropol alanı</div>
          </div>

          {/* Kart 2 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-teal-300">%84</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Ortalama Temiz Enerji</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Öz tüketim karşılama</div>
          </div>

          {/* Kart 3 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 transition-all shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Sun className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-amber-300">42,8 kWh</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Günlük Güneş Üretimi</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Fotovoltaik çatı dizisi</div>
          </div>

          {/* Kart 4 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 transition-all shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-blue-300">18</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Aktif Şarj Noktası</div>
            <div className="text-[11px] text-slate-500 mt-0.5">USB-C, 220V, Qi kablosuz</div>
          </div>

          {/* Kart 5 */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <TreePine className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-emerald-400">1.260 kg</div>
            <div className="text-xs font-semibold text-slate-300 mt-1">Tahmini CO2 Eşdeğeri</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Önlenen sera gazı salımı</div>
          </div>
        </div>
      </section>

      {/* 3. ENERJİ AKIŞI DİYAGRAMI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Uçtan Uca Döngüsel Mimari
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Durak İçi Enerji Akışı
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Güneşten üretilen enerjinin güvenli depolama, akıllı dağıtım ve şebeke senkronizasyon aşamaları
            </p>
          </div>

          {/* Akış Adımları */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
            {/* 1. Güneş Paneli */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 relative group hover:border-amber-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">1. Güneş Paneli</div>
              <p className="text-[11px] text-slate-400">Yüksek verimli monokristal çatı panelleri</p>
            </div>

            {/* 2. MPPT / İnverter */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 relative group hover:border-teal-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">2. MPPT / İnverter</div>
              <p className="text-[11px] text-slate-400">Maksimum güç noktası takibi ve dönüşüm</p>
            </div>

            {/* 3. AI Enerji Yönetimi */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 relative group hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">3. AI Yönetimi</div>
              <p className="text-[11px] text-slate-400">Tahmine dayalı yük ve şarj optimizasyonu</p>
            </div>

            {/* 4. Güvenli Enerji Kabini */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-center space-y-2 relative group shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-emerald-200">4. Güvenli Kabin</div>
              <p className="text-[11px] text-emerald-300/80">İkinci yaşam batarya depolama kompartımanı</p>
            </div>

            {/* 5. Durak Hizmetleri */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 relative group hover:border-blue-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">5. Durak Hizmeti</div>
              <p className="text-[11px] text-slate-400">USB-C, priz, iklimlendirme, aydınlatma</p>
            </div>

            {/* 6. Şebeke Bağlantısı */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 relative group hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-white">6. Şebeke Bağı</div>
              <p className="text-[11px] text-slate-400">Mevzuata ve teknik izinlere bağlı aktarım</p>
            </div>
          </div>

          {/* GÜVENLİK VE ŞEFFAFLIK BİLDİRİMLERİ */}
          <div className="p-4.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Güvenlik Mesajı: “Batarya oturma alanında değil; ayrı güvenli enerji kabininde korunur.”</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir. Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

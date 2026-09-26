import React from 'react';
import {
  Sun,
  ShieldCheck,
  Zap,
  ArrowRight,
  MapPin,
  HelpCircle,
  Leaf,
  Layers,
  CheckCircle2,
  Plug,
  Wifi,
  Snowflake,
  Accessibility,
  Lock,
  Compass
} from 'lucide-react';
import { NavTab } from './Navbar';

interface HomeViewProps {
  onNavigate: (tab: NavTab) => void;
  tourStep?: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, tourStep }) => {
  return (
    <div className="space-y-16 py-8 sm:py-12 animate-in fade-in duration-200">
      {/* 1. HERO BÖLÜMÜ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          id="tour-step-1-hero"
          className={`bg-white border border-[#DDE1DA] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-subtle transition-all duration-300 ${
            tourStep === 1 ? 'tour-highlight ring-4 ring-[#1F5A43]/20' : ''
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Sol Taraf: Net, Güven Veren Kamu Başlığı ve Açıklama */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5F0EA] border border-[#1F5A43]/20 text-xs font-semibold text-[#1F5A43]">
                <Leaf className="w-3.5 h-3.5" />
                <span>Konya Akıllı Şehir · Döngüsel Altyapı</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#182019] leading-tight">
                Şehirde enerjiyi daha erişilebilir kılıyoruz.
              </h1>

              <p className="text-base sm:text-lg text-[#5D665E] leading-relaxed">
                Güneş enerjisi ve ikinci yaşam batarya yaklaşımıyla çalışan akıllı duraklar; şarj, konfor ve erişilebilirlik hizmetlerini tek noktada sunar.
              </p>

              {/* Birincil ve İkincil CTA */}
              <div className="pt-2 flex items-center gap-3 sm:gap-4 flex-wrap">
                <button
                  onClick={() => onNavigate('map')}
                  className="px-5 py-3 rounded-lg bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-subtle"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Yakındaki durağı bul</span>
                </button>

                <button
                  onClick={() => onNavigate('how-it-works')}
                  className="px-5 py-3 rounded-lg bg-white hover:bg-[#EFF0EB] text-[#182019] border border-[#DDE1DA] font-medium text-sm transition-colors flex items-center gap-2"
                >
                  <span>Sistemi incele</span>
                  <ArrowRight className="w-4 h-4 text-[#5D665E]" />
                </button>
              </div>

              <div className="pt-3 border-t border-[#DDE1DA] text-xs text-[#5D665E]">
                <span>Konya genelinde 6 pilot durak izleniyor · Halka açık ve ücretsiz kullanım</span>
              </div>
            </div>

            {/* Sağ Taraf: Temiz Mimari Durak İllüstrasyonu & Güvenli Enerji Kabini */}
            <div className="lg:col-span-5">
              <div
                id="tour-step-2-diagram"
                className={`bg-[#F6F6F2] border border-[#DDE1DA] rounded-xl p-5 sm:p-6 space-y-4 transition-all duration-300 ${
                  tourStep === 2 ? 'tour-highlight ring-4 ring-[#1F5A43]/20 bg-white' : ''
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#DDE1DA] pb-3">
                  <div className="text-xs font-semibold text-[#182019] uppercase tracking-wide">
                    Tipik Pilot Durak Yerleşimi
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#DDE1DA] text-[#5D665E] font-medium">
                    Modüler Yapı
                  </span>
                </div>

                {/* Şematik İllüstrasyon Kutusu */}
                <div className="bg-white rounded-lg border border-[#DDE1DA] p-4 space-y-3">
                  {/* Çatı Güneş Paneli */}
                  <div className="p-2.5 rounded-md bg-[#FBF2DD] border border-[#D59B2E]/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-[#D59B2E]" />
                      <span className="font-semibold text-[#182019]">Monokristal Çatı PV</span>
                    </div>
                    <span className="text-[11px] text-[#5D665E]">5.4 kW Üretim</span>
                  </div>

                  {/* Bekleme ve Oturma Alanı */}
                  <div className="p-3 rounded-md bg-[#EFF0EB] border border-[#DDE1DA] text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#182019]">Yolcu Bekleme & Şarj Alanı</span>
                      <span className="text-[11px] text-[#1F5A43] font-medium">Halk Kullanımı</span>
                    </div>
                    <p className="text-[11px] text-[#5D665E]">
                      USB-C hızlı şarj, 220V prizler, iklimlendirme ve engelsiz bekleme bankı.
                    </p>
                  </div>

                  {/* Ayrı Güvenli Enerji Kabini */}
                  <div className="p-3 rounded-md bg-[#E5F0EA] border border-[#1F5A43]/30 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-[#1F5A43]" />
                        <span className="font-bold text-[#1F5A43]">Güvenli Enerji Kabini</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-[#1F5A43] font-mono border border-[#1F5A43]/20">
                        EI60 Yangın Dayanımı
                      </span>
                    </div>
                    <p className="text-[11px] text-[#174634]">
                      Batarya oturma alanında değil; durağın yanında/arkasında, ayrı, kilitli ve havalandırmalı bağımsız kabinde korunur.
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#5D665E] flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5A43] shrink-0" />
                  <span>Kullanıcı güvenliği öncelikli fiziksel donanım mimarisi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HERO ALTI: ÜÇ KISA GÜVEN UNSURU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#FBF2DD] flex items-center justify-center text-[#D59B2E]">
              <Sun className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#182019]">Güneş Enerjisi</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              Durak çatısındaki monokristal paneller gün boyu temiz yerel elektrik üretir.
            </p>
          </div>

          <div className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#E5F0EA] flex items-center justify-center text-[#1F5A43]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#182019]">Güvenli Depolama</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              İkinci yaşam bataryalar oturma alanından ayrı, yangına dayanımlı kabinde saklanır.
            </p>
          </div>

          <div className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-2">
            <div className="w-9 h-9 rounded-lg bg-[#EAF2F6] flex items-center justify-center text-[#416D86]">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-[#182019]">Kamusal Erişim</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              Vatandaşların kullanımına açık ücretsiz USB-C, priz ve iklimlendirme hizmeti.
            </p>
          </div>
        </div>
      </section>

      {/* 3. YAKININDAKİ DURAKTA NELER VAR? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DDE1DA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DDE1DA] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#182019]">Yakınınızdaki durakta neler var?</h2>
              <p className="text-xs text-[#5D665E]">
                Akıllı durak donanımları bekleme süresini verimli ve konforlu hâle getirir.
              </p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="text-xs font-semibold text-[#1F5A43] hover:text-[#174634] flex items-center gap-1"
            >
              <span>Haritada filtrele</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <Zap className="w-4 h-4 text-[#1F5A43]" />
              <div className="text-xs font-bold text-[#182019]">USB-C Portları</div>
              <p className="text-[11px] text-[#5D665E]">Telefon ve tabletler için hızlı şarj noktaları.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <Plug className="w-4 h-4 text-[#1F5A43]" />
              <div className="text-xs font-bold text-[#182019]">220V Topraklı Priz</div>
              <p className="text-[11px] text-[#5D665E]">Dizüstü bilgisayar ve acil ihtiyaçlar için priz.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <Wifi className="w-4 h-4 text-[#1F5A43]" />
              <div className="text-xs font-bold text-[#182019]">Kablosuz Şarj</div>
              <p className="text-[11px] text-[#5D665E]">15W Qi uyumlu temaslı şarj alanı.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <Snowflake className="w-4 h-4 text-[#416D86]" />
              <div className="text-xs font-bold text-[#182019]">İklim Konforu</div>
              <p className="text-[11px] text-[#5D665E]">Kışın ısıtmalı bank, yazın doğal havalandırma.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2 col-span-2 sm:col-span-1">
              <Accessibility className="w-4 h-4 text-[#1F5A43]" />
              <div className="text-xs font-bold text-[#182019]">Erişilebilirlik</div>
              <p className="text-[11px] text-[#5D665E]">Tekerlekli sandalye rampası ve sesli yönlendirme.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NASIL ÇALIŞIR? 4 ADIMLI SADE NUMARALI ÇİZGİ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DDE1DA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-subtle">
          <div>
            <h2 className="text-lg font-bold text-[#182019]">Nasıl Çalışır?</h2>
            <p className="text-xs text-[#5D665E]">Döngüsel enerjinin durakta işleyiş süreci dört aşamadan oluşur.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 relative">
            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-xs font-bold text-[#182019]">Enerji üretilir</h3>
              <p className="text-[11px] text-[#5D665E] leading-relaxed">
                Çatıdaki monokristal güneş panelleri gün boyu elektrik üretir.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-xs font-bold text-[#182019]">Güvenle depolanır</h3>
              <p className="text-[11px] text-[#5D665E] leading-relaxed">
                İkinci yaşam bataryalar oturma alanından ayrı, korumalı kabinde şarj edilir.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-xs font-bold text-[#182019]">Hizmetler beslenir</h3>
              <p className="text-[11px] text-[#5D665E] leading-relaxed">
                Şarj noktaları, durak aydınlatması ve iklimlendirme kesintisiz çalışır.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-xs font-bold text-[#182019]">Sistem izlenir</h3>
              <p className="text-[11px] text-[#5D665E] leading-relaxed">
                Mühendislik telemetrisiyle sistem güvenliği ve verimlilik takip edilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ŞEFFAFLIK NOTU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EFF0EB] border border-[#DDE1DA] rounded-xl p-4 sm:p-5 text-xs text-[#5D665E] leading-relaxed space-y-1">
          <div className="font-semibold text-[#182019]">Pilot Proje ve Doğrulama İlkesi</div>
          <p>
            Bu arayüz, Konya pilot uygulaması kapsamında simülasyon ve karar destek amaçlı hazırlanmıştır. Gerçek donanım entegrasyonu sonraki aşamada planlanmaktadır. Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.
          </p>
        </div>
      </section>
    </div>
  );
};

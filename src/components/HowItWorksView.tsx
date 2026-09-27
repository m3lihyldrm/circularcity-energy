import React, { useState } from 'react';
import {
  Sun,
  Shield,
  Zap,
  Lock,
  ChevronDown,
  Info,
  CheckCircle2,
  Activity,
  Flame,
  Wind,
  Thermometer,
  Wrench
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const safetyLayers = [
    {
      title: "1. Ayrı Güvenli Enerji Kabini",
      icon: Lock,
      desc: "Batarya modülleri yolcu oturma alanının altında veya panolarda değil; durağın yanında veya arkasında bağımsız, kilitli, EI60 yangın dayanımlı ve IP65 korumalı kabin içinde muhafaza edilir."
    },
    {
      title: "2. Sıcaklık ve Termal Takip",
      icon: Thermometer,
      desc: "Kabin içi ve modül hücreleri termal sensörlerle sürekli izlenir. Sıcaklık eşik değerleri aşıldığında sistem otomatik olarak sınırlı enerji moduna geçer."
    },
    {
      title: "3. Zorlamalı Havalandırma ve Yangın Koruması",
      icon: Wind,
      desc: "Kabin içerisinde zorlamalı hava tahliye fanı ve hedefli aerosol tabanlı otomatik söndürme sistemi yer alır. Dış ortamla güvenli hava sirkülasyonu sağlanır."
    },
    {
      title: "4. Çok Katmanlı BMS (Batarya Yönetim Sistemi)",
      icon: Activity,
      desc: "Hücre voltaj dengesizliği, aşırı akım, kısa devre veya derin deşarj durumlarında devreyi anında kesen bağımsız koruma kartı devrededir."
    },
    {
      title: "5. Önleyici Bakım ve Servis Süreçleri",
      icon: Wrench,
      desc: "Saha ekipleri için planlı periyodik kontrol takvimi oluşturulur. Fiziksel kabin kilitleri ve mekanik bağlantılar yetkili personel tarafından denetlenir."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-in fade-in duration-200">
      {/* Başlık */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1F5A43] bg-[#E5F0EA] px-3 py-1 rounded-full border border-[#1F5A43]/20">
          Sistem Mimarisi
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#182019]">
          BeeHive Nasıl Çalışır?
        </h1>
        <p className="text-sm sm:text-base text-[#5D665E] leading-relaxed">
          Güneş enerjisini ikinci yaşam bataryalarla buluşturan, güvenli depolama ve kamusal hizmet odaklı akıllı durak döngüsü.
        </p>
      </div>

      {/* 4 ADIMLI SADE NUMARALI SÜREÇ HATTI */}
      <div className="bg-white border border-[#DDE1DA] rounded-2xl p-6 sm:p-8 space-y-6 shadow-subtle">
        <h2 className="text-base font-bold text-[#182019]">4 Aşamalı Enerji Döngüsü</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-xs font-bold text-[#182019]">Enerji üretilir</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              Monokristal çatı panelleri gün boyu yerel DC elektrik üretir.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-xs font-bold text-[#182019]">Güvenle depolanır</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              İkinci yaşam bataryalar oturma alanından ayrı, korumalı kabinde şarj edilir.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-xs font-bold text-[#182019]">Durak hizmetleri beslenir</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              USB-C, prizler, durak aydınlatması ve iklimlendirme kesintisiz çalışır.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F6F2] border border-[#DDE1DA] space-y-2">
            <span className="w-6 h-6 rounded-full bg-[#E5F0EA] text-[#1F5A43] font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h3 className="text-xs font-bold text-[#182019]">Sistem izlenir</h3>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              Mühendislik telemetrisiyle operasyonel güvenlik ve verim takip edilir.
            </p>
          </div>
        </div>
      </div>

      {/* GÜVENLİK KATMANLARI ACCORDION BÖLÜMÜ */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#182019]">
            Pilot Fiziksel Uygulama İçin Hedef Güvenlik Katmanları
          </h2>
          <p className="text-xs text-[#5D665E]">
            Vatandaş güvenliğini merkeze alan donanım ve izleme standartları.
          </p>
        </div>

        <div className="space-y-2.5">
          {safetyLayers.map((layer, index) => {
            const isOpen = openAccordion === index;
            const Icon = layer.icon;

            return (
              <div
                key={index}
                className="bg-white border border-[#DDE1DA] rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[#F6F6F2] transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E5F0EA] text-[#1F5A43] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#182019]">
                      {layer.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5D665E] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#5D665E] leading-relaxed border-t border-[#DDE1DA] bg-[#F6F6F2]">
                    <p>{layer.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* YASAL VE MEVZUAT BİLDİRİMLERİ (Sakin Kutular) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#DDE1DA] space-y-1.5 text-xs text-[#5D665E]">
          <div className="font-semibold text-[#182019] flex items-center gap-1.5">
            <Info className="w-4 h-4 text-[#1F5A43]" />
            <span>Şebeke Aktarım Şartı</span>
          </div>
          <p className="leading-relaxed">
            Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir. Fazla üretimin şebekeye verilmesi sonraki onay süreçlerine tâbidir.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#DDE1DA] space-y-1.5 text-xs text-[#5D665E]">
          <div className="font-semibold text-[#182019] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1F5A43]" />
            <span>Mühendislik Doğrulaması</span>
          </div>
          <p className="leading-relaxed">
            Bu ekran karar destek amaçlıdır; fiziksel sistem kontrolü yetkili mühendislik doğrulaması gerektirir. İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir.
          </p>
        </div>
      </div>
    </div>
  );
};

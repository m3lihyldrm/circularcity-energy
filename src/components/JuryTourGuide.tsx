import React, { useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
  RotateCcw,
  MapPin,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export interface TourStepData {
  step: number;
  tag: string;
  title: string;
  description: string;
  targetTab: 'home' | 'map' | 'admin' | 'impact';
  highlightNotice?: string;
}

export const TOUR_STEPS: TourStepData[] = [
  {
    step: 1,
    tag: '1/7 · Problem Tanımı',
    title: 'Kent mobilyaları enerji tüketir; bataryalar ise ikinci yaşam potansiyeli taşır.',
    description:
      'CircularCity Energy, teknik değerlendirmeden geçen ikinci yaşam batarya yaklaşımını güneş enerjisiyle birleştirerek kamusal hizmet noktalarına dönüştürür.',
    targetTab: 'home',
    highlightNotice: 'Hero Alanı & Pilot Konsept'
  },
  {
    step: 2,
    tag: '2/7 · Enerji & Güvenlik Mimarisi',
    title: 'Enerji Akışı ve Güvenli Kabin Mimarisi',
    description:
      'Güneş paneli, ikinci yaşam LFP batarya kabini ve kamusal tüketim akışı tek ekranda anlaşılır şekilde modellenir. Batarya, oturma alanından tamamen izole edilmiş kilitli ve havalandırmalı dış kabindedir.',
    targetTab: 'home',
    highlightNotice: 'Güvenli Enerji Kabini & Durak Yerleşimi'
  },
  {
    step: 3,
    tag: '3/7 · Vatandaş Haritası',
    title: 'Vatandaş İçin Şeffaf Şehir Haritası',
    description:
      'Halk, şehirdeki aktif pilot durakları, çalışan USB portlarını ve şarj durumunu teknik karmaşaya boğulmadan anlık olarak görebilir.',
    targetTab: 'map',
    highlightNotice: 'Konya Geneli Pilot Duraklar'
  },
  {
    step: 4,
    tag: '4/7 · Durak Deneyimi & Veri Ayrımı',
    title: 'Durak Deneyimi ve Güvenlik Ayrımı',
    description:
      'Vatandaş yalnızca hizmet durumunu ve çevre etkisini görür. Hücre sıcaklığı, BMS kodları ve şebeke anahtarlama verileri halka kapalıdır.',
    targetTab: 'map',
    highlightNotice: 'Kampüs Ana Giriş Akıllı Durak (Ayrıntılı Çekmece)'
  },
  {
    step: 5,
    tag: '5/7 · Katılım & Sahiplenme',
    title: 'Vatandaş Katılımı: Geribildirim Mekanizması',
    description:
      'Halk; çalışmayan port, aydınlatma sorunu veya temizlik ihtiyacını 2 tıkla belediyeye iletebilir. Katılım kamusal sahiplenmeyi artırır.',
    targetTab: 'map',
    highlightNotice: 'Sorun Bildir & Geri Bildirim Formu'
  },
  {
    step: 6,
    tag: '6/7 · Ayrılmış Yönetim',
    title: 'Güvenli ve Ayrılmış Yönetici Paneli',
    description:
      'Teknik telemetri, acil durum izolasyon protokolleri ve AI optimizasyon önerileri yalnızca yetkili belediye mühendislerine açıktır.',
    targetTab: 'admin',
    highlightNotice: 'Yetkili Mühendis Giriş Ekranı'
  },
  {
    step: 7,
    tag: '7/7 · Enerji Planlama & Etki',
    title: 'Enerji Planlama ve Çevresel Etki',
    description:
      'Kurtarılan batarya kapasitesi, önlenen karbon salımı ve tasarruf edilen enerji şeffaf metriklerle raporlanır.',
    targetTab: 'impact',
    highlightNotice: '24 Saatlik Enerji Profili & Karbon Tasarrufu'
  }
];

interface JuryTourGuideProps {
  step: number; // 1 to 7, or 8 for completion
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  onRestart: () => void;
  onExploreMap: () => void;
}

export const JuryTourGuide: React.FC<JuryTourGuideProps> = ({
  step,
  onNext,
  onPrev,
  onClose,
  onRestart,
  onExploreMap
}) => {
  const isCompleted = step > 7;
  const currentStepData = TOUR_STEPS.find((s) => s.step === step);

  // Keyboard navigation: ArrowRight -> Next, ArrowLeft -> Prev, Escape -> Close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isCompleted) {
          onNext();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (step > 1) {
          onPrev();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, isCompleted, onNext, onPrev, onClose]);

  return (
    <div
      role="region"
      aria-label="Jüri Sunumu Rehberi"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 sm:w-[430px] z-50 bg-white border border-[#DDE1DA] rounded-2xl shadow-xl p-5 font-sans animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      {/* Üst Bar: Simülasyon Rozeti, Adım Sayacı ve Kapat Butonu */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#DDE1DA]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#E5F0EA] border border-[#1F5A43]/20 flex items-center justify-center text-[#1F5A43]">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-[#182019] tracking-tight">
            Jüri Sunumu
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EFF0EB] text-[#5D665E] border border-[#DDE1DA]">
            Pilot Demo
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#1F5A43]">
            {isCompleted ? 'Tamamlandı' : `${step}/7`}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5D665E] hover:text-[#182019] hover:bg-[#F6F6F2] transition-colors"
            title="Sunumu Kapat (Esc)"
            aria-label="Sunumu Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7 Aşamalı İlerleme Çizgisi */}
      <div className="grid grid-cols-7 gap-1.5 py-3">
        {TOUR_STEPS.map((s) => {
          const isPassed = step > s.step || isCompleted;
          const isCurrent = step === s.step && !isCompleted;
          return (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isCurrent
                  ? 'bg-[#1F5A43] ring-2 ring-[#1F5A43]/20'
                  : isPassed
                  ? 'bg-[#1F5A43]/60'
                  : 'bg-[#E8ECE6]'
              }`}
            />
          );
        })}
      </div>

      {/* İçerik Gövdesi */}
      {!isCompleted && currentStepData ? (
        <div className="space-y-3 py-1">
          <div className="flex items-center justify-between text-[11px] text-[#5D665E]">
            <span className="font-semibold text-[#1F5A43]">
              {currentStepData.tag}
            </span>
            {currentStepData.highlightNotice && (
              <span className="bg-[#F6F6F2] px-2 py-0.5 rounded border border-[#DDE1DA] text-[10px] font-medium text-[#5D665E]">
                {currentStepData.highlightNotice}
              </span>
            )}
          </div>

          <h2 className="text-sm sm:text-base font-bold text-[#182019] leading-snug">
            {currentStepData.title}
          </h2>

          <p className="text-xs text-[#5D665E] leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Alt Kontrol Butonları */}
          <div className="pt-3 border-t border-[#DDE1DA] flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="text-xs text-[#5D665E] hover:text-[#182019] py-1.5 px-2 rounded hover:bg-[#F6F6F2] transition"
            >
              Sunumu Kapat
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrev}
                disabled={step === 1}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                  step === 1
                    ? 'border-transparent text-[#CBD3C8] cursor-not-allowed'
                    : 'border-[#DDE1DA] bg-white text-[#182019] hover:bg-[#F6F6F2]'
                }`}
                title="Önceki Adım (←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Geri</span>
              </button>

              <button
                onClick={onNext}
                className="px-4 py-1.5 rounded-lg bg-[#1F5A43] hover:bg-[#174634] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-subtle"
                title="Sonraki Adım (→)"
              >
                <span>{step === 7 ? 'Tamamla' : 'Sonraki'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* TAMAMLAMA EKRANI */
        <div className="space-y-4 py-2 text-left">
          <div className="w-10 h-10 rounded-xl bg-[#E5F0EA] border border-[#1F5A43]/20 flex items-center justify-center text-[#1F5A43]">
            <CheckCircle2 className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#1F5A43]">
              Sunum Tamamlandı
            </div>
            <h2 className="text-base font-bold text-[#182019] leading-snug">
              Döngüsel enerji, erişilebilir kamusal hizmet.
            </h2>
            <p className="text-xs text-[#5D665E] leading-relaxed">
              CircularCity Energy, üniversite-belediye iş birliğiyle sahaya çıkmaya hazır bir kamusal pilot konsepttir.
            </p>
          </div>

          <div className="pt-2 border-t border-[#DDE1DA] space-y-2">
            <button
              onClick={onExploreMap}
              className="w-full py-2 px-3 rounded-lg bg-[#1F5A43] hover:bg-[#174634] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-subtle"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Haritayı İncele</span>
            </button>

            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onRestart}
                className="py-1.5 px-3 rounded-lg border border-[#DDE1DA] bg-white hover:bg-[#F6F6F2] text-[#182019] text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5D665E]" />
                <span>Sunumu Baştan Başlat</span>
              </button>

              <button
                onClick={onClose}
                className="text-xs text-[#5D665E] hover:text-[#182019] py-1.5 px-2 rounded hover:bg-[#F6F6F2] transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Klavye İpucu Dipnotu */}
      <div className="pt-2.5 mt-2 border-t border-[#DDE1DA] flex items-center justify-between text-[10px] text-[#5D665E]">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-[#F6F6F2] border border-[#DDE1DA] font-mono">←</span>
          <span className="px-1.5 py-0.5 rounded bg-[#F6F6F2] border border-[#DDE1DA] font-mono">→</span>
          <span>Adımlar arası geçiş</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded bg-[#F6F6F2] border border-[#DDE1DA] font-mono">Esc</span>
          <span>Kapat</span>
        </div>
      </div>
    </div>
  );
};

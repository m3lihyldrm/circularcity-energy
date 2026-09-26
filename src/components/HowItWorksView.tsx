import React from 'react';
import {
  Sun,
  Cpu,
  Shield,
  Battery,
  Zap,
  Network,
  AlertOctagon,
  Flame,
  Wind,
  Thermometer,
  Wrench,
  CheckCircle,
  FileText
} from 'lucide-react';

export const HowItWorksView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-in fade-in duration-300">
      {/* Başlık */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          Sistem Mimarisi ve Çalışma Prensibi
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          CircularCity Energy Nasıl Çalışır?
        </h1>
        <p className="text-sm sm:text-base text-slate-300">
          Güneş enerjisini ikinci yaşam bataryalarla buluşturan, AI yönetimli, güvenli ve halk odaklı akıllı durak döngüsü.
        </p>
      </div>

      {/* Önemli Mühendislik Doğrulaması Uyarısı */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-bold text-amber-300 block">
            Mühendislik ve Mevzuat Uyarısı:
          </strong>
          <p className="leading-relaxed text-slate-300 text-xs">
            Gerçek fiziksel pilot kurulum için uzman elektrik, yangın ve statik mühendisliği hesaplamaları ile ilgili belediye ve EPDK/dağıtım şirketi mevzuat doğrulamasının yapılması zorunludur. Proje şu anda karar destek ve konsept simülasyonu aşamasındadır.
          </p>
        </div>
      </div>

      {/* 6 Temel Sistem Bileşeni */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Güneş Panelleri */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Güneş Panelleri</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Durak tavanına entegre edilen monokristal fotovoltaik modüller, gün ışığını doğrudan temiz doğru akım (DC) elektriğe çevirir. Yüksek verimli MPPT regülatörleri ile bulutlu havalarda dahi maksimum enerji hasadı sağlanır.
          </p>
        </div>

        {/* 2. AI Destekli Enerji Yönetimi */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">2. AI Destekli Enerji Yönetimi</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Hava durumu tahminleri, yolcu yoğunluk saatleri ve anlık tüketim geçmişini analiz eden kural tabanlı yapay zeka algoritması; bataryanın ne zaman şarj olacağını ve ne zaman tasarruf moduna geçeceğini dinamik olarak yönetir.
          </p>
        </div>

        {/* 3. Güvenli Enerji Kabini */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-300">3. Güvenli Enerji Kabini</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-white">Batarya oturma alanında değil;</strong> durağın yanında/arkasında, ayrı, çift kilitli, termal havalandırmalı ve yangına dayanımlı (EI60 sertifikalı) özel kabin içinde muhafaza edilir. Yolcular için sıfır temas güvenliği sunar.
          </p>
        </div>

        {/* 4. İkinci Yaşam Batarya Yaklaşımı */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
            <Battery className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">4. İkinci Yaşam Batarya Yaklaşımı</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir. Elektrikli araçlardan çıkan modüller döngüsel ekonomiye kazandırılarak karbon ayak izi en aza indirilir.
          </p>
        </div>

        {/* 5. Aydınlatma, İklimlendirme ve Şarj Hizmetleri */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">5. Şarj ve Konfor Hizmetleri</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Depolanan enerji; hızlı USB-C soketleri, 220V dizüstü bilgisayar prizleri, temassız Qi kablosuz şarj, akıllı LED aydınlatma ve enerji tasarruflu havalandırma sisteminde halkın hizmetine sunulur.
          </p>
        </div>

        {/* 6. Şebeke Bağlantısı */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Network className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">6. Şebeke Bağlantısı</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir. Fazla üretilen enerji, çift yönlü on-grid sayaç ile şehir mikro şebekesine temiz katkı sağlayabilir.
          </p>
        </div>
      </div>

      {/* Çok Katmanlı Güvenlik Mimarisi */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span>Çok Katmanlı Güvenlik Standartları</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Akıllı Batarya Yönetim Sistemi (BMS)</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <Wind className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Termostatik Cebri Havalandırma Menfezleri</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Hücre Bazlı Sıcaklık & Gaz Algılama</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Aerosol Otomatik Yangın Söndürme Kapsülü</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Acil Durum Manuel / Otomatik Güç Kesici</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
            <Wrench className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Yalnızca Yetkili RFID ile Güvenli Bakım Girişi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

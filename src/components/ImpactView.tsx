import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { Leaf, Zap, TreePine, Sun, Info } from 'lucide-react';

const mockDailyEnergyData = [
  { hour: '06:00', solarProduction: 0.5, consumption: 0.9, batterySoc: 70 },
  { hour: '08:00', solarProduction: 2.2, consumption: 1.8, batterySoc: 78 },
  { hour: '10:00', solarProduction: 4.8, consumption: 2.3, batterySoc: 88 },
  { hour: '12:00', solarProduction: 6.2, consumption: 2.6, batterySoc: 96 },
  { hour: '14:00', solarProduction: 5.9, consumption: 2.8, batterySoc: 98 },
  { hour: '16:00', solarProduction: 4.1, consumption: 3.1, batterySoc: 92 },
  { hour: '18:00', solarProduction: 1.8, consumption: 3.4, batterySoc: 84 },
  { hour: '20:00', solarProduction: 0.0, consumption: 2.5, batterySoc: 76 },
];

export const ImpactView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-200">
      {/* Başlık */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1F5A43] bg-[#E5F0EA] px-3 py-1 rounded-full border border-[#1F5A43]/20">
          Sürdürülebilirlik & Etki
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#182019]">
          Şehir ve Çevre Üzerindeki Etkimiz
        </h1>
        <p className="text-sm sm:text-base text-[#5D665E] leading-relaxed">
          Temiz yerel enerji üretimi, döngüsel batarya ekonomisi ve kamu hizmeti sürekliliğinin genel modeli.
        </p>
      </div>

      {/* 1. BÖLÜM: BİR DURAĞIN GÜNLÜK ENERJİ DÖNGÜSÜ */}
      <div className="bg-white border border-[#DDE1DA] rounded-2xl p-6 sm:p-8 space-y-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDE1DA] pb-3">
          <div>
            <h2 className="text-base font-bold text-[#182019]">Bir Durağın Günlük Enerji Döngüsü</h2>
            <p className="text-xs text-[#5D665E]">Güneş üretimi (kW), yolcu tüketimi (kW) ve batarya doluluk oranı (%)</p>
          </div>
          <span className="text-[11px] font-mono text-[#5D665E] bg-[#F6F6F2] px-2 py-0.5 rounded border border-[#DDE1DA]">
            24 Saatlik Profil
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockDailyEnergyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="impactSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D59B2E" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#D59B2E" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="impactCons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#416D86" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#416D86" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8ECE6" />
              <XAxis dataKey="hour" stroke="#5D665E" fontSize={11} tickLine={false} />
              <YAxis stroke="#5D665E" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#DDE1DA',
                  borderRadius: '8px',
                  color: '#182019',
                  fontSize: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
              <Area type="monotone" dataKey="solarProduction" name="Güneş Üretimi (kW)" stroke="#D59B2E" strokeWidth={2} fill="url(#impactSolar)" />
              <Area type="monotone" dataKey="consumption" name="Tüketim (kW)" stroke="#416D86" strokeWidth={2} fill="url(#impactCons)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-[#5D665E] pt-2 border-t border-[#DDE1DA] flex items-center justify-between">
          <span>Demo verisi – fiziksel pilot ölçümü değildir.</span>
          <span>Tipik gün ışığı modeli</span>
        </div>
      </div>

      {/* 2. BÖLÜM: 3 SADE ETKİ GÖSTERGESİ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#E5F0EA] text-[#1F5A43] flex items-center justify-center">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-[#5D665E] block">Temiz Enerji Karşılama</span>
            <div className="text-2xl font-bold text-[#1F5A43] tabular-nums mt-0.5">%84</div>
          </div>
          <p className="text-xs text-[#5D665E] leading-relaxed">
            Güneş panelleri ve batarya depolamasıyla sağlanan ortalama temiz enerji oranı.
          </p>
          <div className="text-[10px] text-[#5D665E] pt-2 border-t border-[#DDE1DA]">
            Simülasyon verisi · 6 pilot durak ortalaması
          </div>
        </div>

        <div className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#EAF2F6] text-[#416D86] flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-[#5D665E] block">Kamusal Hizmet Noktası</span>
            <div className="text-2xl font-bold text-[#182019] tabular-nums mt-0.5">18 Nokta</div>
          </div>
          <p className="text-xs text-[#5D665E] leading-relaxed">
            Halkın kullanımına açık USB-C portları, 220V prizler ve kablosuz şarj üniteleri.
          </p>
          <div className="text-[10px] text-[#5D665E] pt-2 border-t border-[#DDE1DA]">
            Simülasyon verisi · Aktif servis kapasitesi
          </div>
        </div>

        <div className="bg-white border border-[#DDE1DA] rounded-xl p-5 shadow-subtle space-y-3">
          <div className="w-9 h-9 rounded-lg bg-[#E5F0EA] text-[#1F5A43] flex items-center justify-center">
            <TreePine className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-[#5D665E] block">Tahmini Karbon Göstergesi</span>
            <div className="text-2xl font-bold text-[#1F5A43] tabular-nums mt-0.5">1.260 kg / yıl</div>
          </div>
          <p className="text-xs text-[#5D665E] leading-relaxed">
            Şebeke çekişi yerine yerel güneş üretimiyle önlenen tahmini yıllık CO₂ eşdeğeri.
          </p>
          <div className="text-[10px] text-[#5D665E] pt-2 border-t border-[#DDE1DA]">
            Simülasyon verisi · Tahmini modelleme
          </div>
        </div>
      </div>

      {/* Şeffaflık Dipnotu */}
      <div className="p-4 rounded-xl bg-[#EFF0EB] border border-[#DDE1DA] text-xs text-[#5D665E] leading-relaxed flex items-center gap-2">
        <Info className="w-4 h-4 text-[#1F5A43] shrink-0" />
        <span>
          Bu sayfada sunulan tüm etki metrikleri pilot konsept simülasyonudur. Sahadaki gerçek enerji ve karbon tasarruf ölçümleri faz 2 donanım entegrasyonu sonrasında yayınlanacaktır.
        </span>
      </div>
    </div>
  );
};

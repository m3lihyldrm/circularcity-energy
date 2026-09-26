import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {
  Leaf,
  Zap,
  TrendingUp,
  MessageSquare,
  Users,
  TreePine,
  RotateCcw,
  Sparkles,
  AlertCircle
} from 'lucide-react';

const mockDailyEnergyData = [
  { hour: '06:00', solarProduction: 0.5, consumption: 0.9, cleanEnergy: 60 },
  { hour: '08:00', solarProduction: 2.2, consumption: 1.8, cleanEnergy: 85 },
  { hour: '10:00', solarProduction: 4.8, consumption: 2.3, cleanEnergy: 95 },
  { hour: '12:00', solarProduction: 6.2, consumption: 2.6, cleanEnergy: 100 },
  { hour: '14:00', solarProduction: 5.9, consumption: 2.8, cleanEnergy: 100 },
  { hour: '16:00', solarProduction: 4.1, consumption: 3.1, cleanEnergy: 90 },
  { hour: '18:00', solarProduction: 1.8, consumption: 3.4, cleanEnergy: 75 },
  { hour: '20:00', solarProduction: 0.0, consumption: 2.5, cleanEnergy: 70 },
];

export const ImpactView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Başlık */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
          Sürdürülebilirlik Raporu
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Şehir ve Çevre Üzerindeki Etkimiz
        </h1>
        <p className="text-sm text-slate-300">
          Temiz enerji üretimi, döngüsel batarya ekonomisi ve karbon salım azaltım metrikleri.
        </p>
      </div>

      {/* Şeffaflık Uyarısı */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Bu sayfada sunulan tüm değerler <strong>demo/simülasyon verisidir; gerçek pilot ölçümü değildir.</strong></span>
        </div>
        <span className="font-mono text-[11px] text-amber-200">SİMÜLASYON MODELİ v2.4</span>
      </div>

      {/* 6 Metrik Kartı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Metrik 1 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Temiz Enerji Karşılama</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">%84</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Durak içi aydınlatma, şarj ve havalandırma ihtiyacının güneşten doğrudan karşılanma oranı.
          </p>
          <span className="text-[10px] text-slate-500 block pt-1">Demo/simülasyon verisi; gerçek pilot ölçümü değildir.</span>
        </div>

        {/* Metrik 2 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Tahmini Şebeke Desteği</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-teal-300">85,7 kWh / gün</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mevzuat ve teknik uygunluk şartları sağlandığında şebekeye beslenebilecek fazla temiz enerji.
          </p>
          <span className="text-[10px] text-slate-500 block pt-1">Demo/simülasyon verisi; gerçek pilot ölçümü değildir.</span>
        </div>

        {/* Metrik 3 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Günlük Hizmet Kullanımı</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-300">~420 Yolcu</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            6 pilot durakta USB-C, 220V priz ve kablosuz şarj servislerinden faydalanan günlük vatandaş sayısı.
          </p>
          <span className="text-[10px] text-slate-500 block pt-1">Demo/simülasyon verisi; gerçek pilot ölçümü değildir.</span>
        </div>

        {/* Metrik 4 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Vatandaş Geri Bildirimleri</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-300">14 Kayıt</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Temizlik, priz kontrolü ve aydınlatma konularında halktan gelen aktif katılımcı bildirimler.
          </p>
          <span className="text-[10px] text-slate-500 block pt-1">Demo/simülasyon verisi; gerçek pilot ölçümü değildir.</span>
        </div>

        {/* Metrik 5 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Döngüsel Ekonomi Katkısı</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-indigo-300">%70 Tasarruf</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            İkinci yaşam bataryalar sayesinde sıfır batarya üretimine kıyasla hammadde ve imalat tasarrufu.
          </p>
          <span className="text-[10px] text-slate-500 block pt-1">Demo/simülasyon verisi; gerçek pilot ölçümü değildir.</span>
        </div>

        {/* Metrik 6 */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Önlenen CO2 Salımı</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TreePine className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">1.260 kg CO2e</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Şebeke fosil yakıt tüketiminin ikame edilmesiyle aylık bazda önlenen tahmini karbon eşdeğeri.
          </p>
          <span className="text-[10px] text-slate-500 block pt-1">Demo/simülasyon verisi; gerçek pilot ölçümü değildir.</span>
        </div>
      </div>

      {/* Günlük Üretim / Tüketim Grafiği (Recharts) */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold text-white">Güneş Üretimi ve Tüketim Eğrisi (24 Saat)</h3>
            <p className="text-xs text-slate-400">Saatlik fotovoltaik üretim ve durak içi yük dengesi simülasyonu</p>
          </div>
          <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            Birim: Kilowatt (kW)
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockDailyEnergyData}>
              <defs>
                <linearGradient id="solarColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="consumpColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey="solarProduction"
                name="Güneş Üretimi (kW)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#solarColor)"
              />
              <Area
                type="monotone"
                dataKey="consumption"
                name="Durak Tüketimi (kW)"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#consumpColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

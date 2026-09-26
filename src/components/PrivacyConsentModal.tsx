import React from 'react';
import { Navigation, ShieldCheck, X } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDeny: () => void;
}

export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onDeny
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-800 text-white relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-xs">
          <Navigation className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Konum Erişimi ve Gizlilik Onayı
        </h3>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
          <div className="p-3.5 bg-emerald-950/50 rounded-2xl border border-emerald-800/80 text-emerald-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <p className="font-semibold text-xs leading-relaxed">
              “Konumunuz yalnızca size en yakın durağı göstermek için kullanılır ve sunucuda kalıcı olarak saklanmaz.”
            </p>
          </div>

          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Konumunuz üçüncü taraflarla veya sunucu veritabanıyla paylaşılmaz.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-amber-300">Haritadaki durak ve güç verileri <strong>Pilot Demo – Simülasyon Verisi</strong>dir.</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => {
              onDeny();
              onClose();
            }}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
          >
            İzin Verme
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Onayla ve Durağımı Bul</span>
          </button>
        </div>
      </div>
    </div>
  );
};

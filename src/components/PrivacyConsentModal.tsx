import React, { useEffect } from 'react';
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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#182019]/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-elevated border border-[#DDE1DA] text-[#182019] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5D665E] hover:text-[#182019] p-1.5 rounded-lg hover:bg-[#F6F6F2] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-lg bg-[#E5F0EA] text-[#1F5A43] flex items-center justify-center mb-3">
          <Navigation className="w-5 h-5" />
        </div>

        <h3 className="text-base font-bold text-[#182019] mb-1.5">
          Konum Erişimi ve Gizlilik
        </h3>

        <div className="space-y-3 text-xs text-[#5D665E] mb-6">
          <div className="p-3 bg-[#E5F0EA] rounded-lg border border-[#1F5A43]/20 text-[#174634] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#1F5A43] shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              “Konumunuz yalnızca size en yakın durağı göstermek için kullanılır ve sunucuda kalıcı olarak saklanmaz.”
            </p>
          </div>

          <ul className="space-y-1.5 text-xs text-[#5D665E]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1F5A43]" />
              <span>Konum bilginiz üçüncü taraflarla veya veritabanıyla paylaşılmaz.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B7791F]" />
              <span>Haritadaki durak ve güç verileri pilot simülasyon amaçlıdır.</span>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => {
              onDeny();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-[#5D665E] hover:text-[#182019] rounded-lg transition-colors"
          >
            İzin Verme
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1F5A43] hover:bg-[#174634] rounded-lg shadow-subtle transition-colors flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Onayla ve Durağımı Bul</span>
          </button>
        </div>
      </div>
    </div>
  );
};

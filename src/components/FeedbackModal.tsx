import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { PublicStation } from '../types';
import { sendFeedback } from '../services/api';

interface FeedbackModalProps {
  station: PublicStation | null;
  isOpen: boolean;
  onClose: () => void;
}

const ISSUE_OPTIONS = [
  "Şarj noktası çalışmıyor",
  "Priz sorunu",
  "İklimlendirme sorunu",
  "Aydınlatma sorunu",
  "Durak temiz değil",
  "Erişilebilirlik sorunu",
  "Diğer"
];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  station,
  isOpen,
  onClose
}) => {
  const [selectedIssue, setSelectedIssue] = useState<string>(ISSUE_OPTIONS[0]);
  const [message, setMessage] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<{ id: string; message: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Escape tuşu ile kapanabilme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleResetAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !station) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await sendFeedback({
        stationId: station.stationId,
        issueType: selectedIssue,
        message
      });

      if (res.success) {
        setSuccessInfo({
          id: res.feedbackId || 'FB-' + Date.now().toString().slice(-4),
          message: res.message
        });
      } else {
        setErrorMsg('Geri bildirim iletilirken bir sorun oluştu.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata meydana geldi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSuccessInfo(null);
    setMessage('');
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#182019]/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-elevated border border-[#DDE1DA] text-[#182019] relative">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-[#5D665E] hover:text-[#182019] p-1.5 rounded-lg hover:bg-[#F6F6F2] transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {successInfo ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E5F0EA] text-[#1F5A43] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#182019]">Geri Bildiriminiz Alındı</h3>
            <p className="text-xs sm:text-sm text-[#5D665E] max-w-sm mx-auto leading-relaxed">
              {successInfo.message}
            </p>
            <div className="bg-[#F6F6F2] border border-[#DDE1DA] rounded-lg p-2.5 inline-block text-xs font-mono text-[#5D665E]">
              Takip Kodu: <span className="font-bold text-[#1F5A43]">{successInfo.id}</span>
            </div>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 px-4 bg-[#1F5A43] hover:bg-[#174634] text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-[#1F5A43] uppercase tracking-wider block">
                Vatandaş Bildirim Formu
              </span>
              <h3 className="text-base font-bold text-[#182019]">
                Durak Durumu Bildir
              </h3>
              <p className="text-xs text-[#5D665E] mt-0.5">
                {station.name} ({station.stationId})
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FCECEC] border border-[#B94040]/30 rounded-lg text-[#B94040] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#182019]">
                Konu:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {ISSUE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      selectedIssue === option
                        ? 'border-[#1F5A43] bg-[#E5F0EA] text-[#1F5A43] font-semibold'
                        : 'border-[#DDE1DA] hover:border-[#CBD3C8] text-[#5D665E] bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="issueType"
                      value={option}
                      checked={selectedIssue === option}
                      onChange={() => setSelectedIssue(option)}
                      className="text-[#1F5A43] focus:ring-[#1F5A43] h-3.5 w-3.5"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#182019]">
                Açıklama (İsteğe bağlı):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Örneğin: 'Sağ taraftaki USB portu temassızlık yapıyor.'"
                className="w-full text-xs p-3 rounded-lg bg-[#F6F6F2] border border-[#DDE1DA] text-[#182019] placeholder:text-[#5D665E] focus:bg-white focus:border-[#1F5A43] focus:outline-none transition-colors"
              />
            </div>

            <p className="text-[11px] text-[#5D665E] leading-relaxed">
              Bu form üzerinden isim veya e-posta gibi kişisel veri istenmemektedir.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 text-xs font-medium text-[#5D665E] hover:text-[#182019] rounded-lg transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#1F5A43] hover:bg-[#174634] disabled:opacity-50 rounded-lg shadow-subtle transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Gönderiliyor...' : 'Geri Bildirimi İlet'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-800 text-white relative">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {successInfo ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-white">Geri Bildiriminiz Başarıyla Alındı!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {successInfo.message}
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 inline-block text-xs font-mono text-slate-300">
              Kayıt Takip Kodu: <span className="font-bold text-emerald-400">{successInfo.id}</span>
            </div>
            <div className="pt-3">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Vatandaş Katılımcı Bildirim Formu</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              Durak Durumu Bildir
            </h3>

            <p className="text-xs text-slate-400">
              Seçili Durak: <strong className="text-emerald-400">{station.name}</strong> ({station.stationId})
            </p>

            {errorMsg && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Sorun / Durum Konusu:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {ISSUE_OPTIONS.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedIssue === option
                        ? 'border-emerald-500 bg-emerald-500/15 text-white font-semibold'
                        : 'border-slate-800 hover:border-slate-700 text-slate-300 bg-slate-950/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="issueType"
                      value={option}
                      checked={selectedIssue === option}
                      onChange={() => setSelectedIssue(option)}
                      className="text-emerald-500 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Açıklama (İsteğe Bağlı):
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Örneğin: 'Sol taraftaki USB prizinde elektrik yok.' veya 'Oturma alanı temizlenmeli.'"
                className="w-full text-xs p-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            <p className="text-[11px] text-slate-400">
              🔒 <strong>Gizlilik:</strong> Bu form üzerinden ad, soyad veya e-posta gibi hiçbir kişisel veri istenmemektedir.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 text-xs font-extrabold text-slate-950 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Kaydediliyor...' : 'Geri Bildirimi İlet'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

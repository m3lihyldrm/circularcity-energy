import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { getFaqs } from '../services/api';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "Bu duraklar nasıl enerji üretiyor?",
    answer: "Durakların çatısında yer alan yüksek verimli monokristal güneş panelleri gün boyunca güneş ışığını elektrik enerjisine dönüştürür. Üretilen enerji MPPT şarj kontrol ünitesi aracılığıyla güvenli enerji kabinindeki bataryalara depolanır."
  },
  {
    id: "faq-2",
    question: "İkinci yaşam batarya nedir?",
    answer: "Elektrikli araçlarda kapasitesi belirli bir seviyeye gerilemiş ancak sabit depolama için yüksek performans sunan batarya modülleridir. İkinci yaşam bataryalar, teknik test ve güvenlik değerlendirmesi sonrasında sabit depolama için aday olabilir."
  },
  {
    id: "faq-3",
    question: "Bataryalar güvenli mi?",
    answer: "Kesinlikle güvenlidir. Batarya oturma alanında değil; durağın yanında/arkasında, ayrı, kilitli, havalandırmalı ve yangına dayanımlı (EI60 sertifikalı) “Güvenli Enerji Kabini” içinde korunur. Çok katmanlı BMS ve otomatik yangın söndürme modülü ile izlenir."
  },
  {
    id: "faq-4",
    question: "Haritadaki veriler gerçek zamanlı mı?",
    answer: "Haritadaki tüm durak, enerji üretimi ve batarya verileri pilot konsept simülasyonudur. Gerçek donanım bağlantısı sonraki aşamada planlanmaktadır."
  },
  {
    id: "faq-5",
    question: "Şarj noktaları nasıl kullanılır?",
    answer: "Durak içerisinde yer alan USB-C portları ve 220V topraklı prizler halkın ücretsiz ve anlık kullanımına açıktır. Akıllı güç yönetim sistemi tüm cihazları aşırı akıma karşı korur."
  },
  {
    id: "faq-6",
    question: "Konumum kaydediliyor mu?",
    answer: "Hayır. Konumunuz yalnızca size en yakın durağı göstermek için anlık olarak kullanılır ve sunucuda kalıcı olarak saklanmaz. Açık onay vermediğiniz sürece konum verisi talep edilmez."
  },
  {
    id: "faq-7",
    question: "Şebekeye enerji aktarımı nasıl olur?",
    answer: "Şebeke aktarımı; ilgili mevzuat, dağıtım şirketi bağlantısı ve teknik uygunluğa bağlı planlanan özelliktir. Fazla üretilen temiz enerjinin çift yönlü sayaçla mikro şebekeye verilmesi hedeflenmektedir."
  },
  {
    id: "faq-8",
    question: "Bu sistem nerelerde kurulabilir?",
    answer: "Güneş alan meydanlar, üniversite kampüsleri, aktarma merkezleri, rekreasyon alanları ve kırsal duraklar dahil olmak üzere şehir şebekesinden bağımsız veya on-grid olarak her yere kurulabilir."
  }
];

export const FaqView: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(defaultFaqs);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    getFaqs().then(data => {
      if (data && data.length > 0) setFaqs(data);
    });
  }, []);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Başlık */}
      <div className="space-y-3 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1F5A43] bg-[#E5F0EA] px-3 py-1 rounded-full border border-[#1F5A43]/20">
          Merak Edilenler
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#182019]">
          Sıkça Sorulan Sorular
        </h1>
        <p className="text-sm text-[#5D665E] leading-relaxed">
          Döngüsel şehir durakları, ikinci yaşam batarya yaklaşımı ve güvenlik standartları hakkında yanıtlar.
        </p>
      </div>

      {/* SSS Akordeon Listesi */}
      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.id || idx}
              className="bg-white border border-[#DDE1DA] rounded-xl overflow-hidden shadow-subtle transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 focus:outline-none hover:bg-[#F6F6F2] transition-colors"
              >
                <span className="text-sm sm:text-base font-semibold text-[#182019] flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E5F0EA] text-[#1F5A43] text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#5D665E] transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#1F5A43]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5D665E] leading-relaxed border-t border-[#DDE1DA] bg-[#F6F6F2]">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Şeffaf Bilgilendirme Notu */}
      <div className="p-4 rounded-xl bg-white border border-[#DDE1DA] text-xs text-[#5D665E] leading-relaxed space-y-1">
        <div className="font-semibold text-[#182019]">Şeffaf Bilgilendirme İlkesi:</div>
        <p>Halk API’sinde teknik telemetri paylaşımı tasarım gereği engellenmiştir; bu ayrım otomatik testlerle doğrulanmıştır.</p>
      </div>
    </div>
  );
};

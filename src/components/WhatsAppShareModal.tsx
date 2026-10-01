import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';
import { GoogleFormConfig } from '../types/nomination';

interface WhatsAppShareModalProps {
  formConfig: GoogleFormConfig | null;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({
  formConfig,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const responderUrl = formConfig?.responderUri || '';

  const shareText = `السلام عليكم ورحمة الله وبركاته يا دفعة 🎓✨

تعلن لجنة تسيير أعمال الدفعة عن فتح باب الترشح والترشيح لانتخابات أمانات الدفعة القادمة:

📌 الأمانات المتاحة للترشيح:
1️⃣ الأمانة العامة (منصب الأمين العام)
2️⃣ الأمانة الأكاديمية
3️⃣ الأمانة المالية (أمين المال)
4️⃣ الأمانة الاجتماعية

💡 يمكنك ترشيح نفسك أو ترشيح من تراه أهلاً للمسؤولية والكفاءة لخدمة زملائه في الدفعة.

🔗 رابط استمارة الترشح والترشيح الرسمية:
${responderUrl}

نرجو من الجميع التفاعل والمشاركة لاختيار ممثلي الدفعة بكل شفافية ومسؤولية. بالتوفيق للجميع! 🌟`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-right">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">
                مشاركة إعلان الاستمارة لقروب الدفعة
              </h4>
              <p className="text-xs text-slate-500">نص منسق وجاهز للإرسال عبر واتساب أو تيليجرام</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="relative mb-5">
          <textarea
            rows={10}
            readOnly
            value={shareText}
            className="w-full p-3.5 text-xs font-sans rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed outline-none resize-none select-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            onClick={handleOpenWhatsApp}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>مشاركة مباشرة عبر WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ النص</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

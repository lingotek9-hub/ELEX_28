import React from 'react';
import { ShieldCheck, FileSpreadsheet, Vote, CheckCircle, ArrowRight } from 'lucide-react';

interface GoogleAuthCardProps {
  onLogin: () => void;
  isLoading: boolean;
}

export const GoogleAuthCard: React.FC<GoogleAuthCardProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="max-w-3xl mx-auto my-12 p-8 sm:p-12 bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
        <Vote className="w-10 h-10" />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
        <ShieldCheck className="w-4 h-4 text-emerald-600" /> تكامل رسمي مع Google Workspace
      </span>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
        استمارة الترشح والترشيح لأمانات الدفعة
      </h2>

      <p className="text-base text-slate-600 max-w-xl mx-auto mb-8 leading-relaxed">
        لإنشاء استمارة Google Form الرسمية تلقائياً وربط كافة الردود والترشيحات بجدول بيانات Google Sheets
        المعنون بـ <strong className="text-slate-800">"سجل ترشيحات أمانات الدفعة"</strong>، يرجى تسجيل الدخول بحساب Google.
      </p>

      {/* Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto mb-8 text-right">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>استمارة ترشيح رسمية</span>
          </div>
          <p className="text-[11px] text-slate-500">
            تجهيز فوري لجميع الأمانات (العامة، الأكاديمية، المالية، الاجتماعية)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-1">
            <FileSpreadsheet className="w-4 h-4 text-teal-600 shrink-0" />
            <span>ربط تلقائي مع Sheets</span>
          </div>
          <p className="text-[11px] text-slate-500">
            جدول بيانات منسق RTL بـ 5 صفحات فرز تلقائي لمرشحي كل أمانة
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>شفافية وإحصاءات حية</span>
          </div>
          <p className="text-[11px] text-slate-500">
            متابعة فورية لعدد الأصوات والترشيحات لكل مرشح وتصدير البيانات
          </p>
        </div>
      </div>

      {/* Official Sign in with Google Button */}
      <div className="flex justify-center">
        <button
          onClick={onLogin}
          disabled={isLoading}
          className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-sm hover:shadow transition-all duration-150 disabled:opacity-50 cursor-pointer"
        >
          <div className="w-5 h-5">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
          </div>
          <span>{isLoading ? 'جاري الاتصال بحساب Google...' : 'تسجيل الدخول عبر Google للبدء'}</span>
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        يتم تخزين التوكن حصراً في الذاكرة لتنفيذ عمليات Google Forms و Google Sheets بأمان تام.
      </p>
    </div>
  );
};

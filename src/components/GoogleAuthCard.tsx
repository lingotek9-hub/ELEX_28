import React from 'react';
import {
  ShieldCheck,
  FileSpreadsheet,
  BarChart3,
  Award,
  Lock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { ElexLogo } from './ElexLogo';

interface GoogleAuthCardProps {
  onLogin: () => void;
  isLoading: boolean;
  onBackToPublic?: () => void;
}

export const GoogleAuthCard: React.FC<GoogleAuthCardProps> = ({
  onLogin,
  isLoading,
  onBackToPublic,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-8 px-3 sm:px-6">
      {/* Back button */}
      {onBackToPublic && (
        <div className="mb-4 flex justify-start">
          <button
            type="button"
            onClick={onBackToPublic}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0c121e] hover:bg-[#121c2d] border border-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4 text-[#f38035]" />
            <span>العودة إلى صفحة الدفعة العامة</span>
          </button>
        </div>
      )}

      {/* Main Container Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0c121e] via-[#080d16] to-[#0c1422] border-2 border-[#f38035]/40 shadow-2xl p-6 sm:p-10 lg:p-12 text-center text-white">
        {/* Top Dual Ambient Circuit Glows */}
        <div className="absolute -top-24 right-1/4 w-80 h-80 bg-[#f38035]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 bg-[#67B8DE]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        {/* Glowing Top Line */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE]"></div>

        {/* Central Supervisor Icon with Pulsing Circuit Rings */}
        <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-2xl bg-[#f38035]/20 blur-md animate-pulse"></div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#121c2d] via-[#090d15] to-[#15233a] border-2 border-[#f38035] flex items-center justify-center text-[#f38035] shadow-xl shadow-[#f38035]/25 relative">
              <Lock className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#67B8DE] border-2 border-[#0c121e] animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#67B8DE] border-2 border-[#0c121e]"></span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-[#f38035]/15 text-[#f38035] border border-[#f38035]/35 mb-2">
            <Cpu className="w-3.5 h-3.5 text-[#f38035]" />
            <span>ELEX28 • SUPERVISOR ACCESS</span>
          </div>

          <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
            بوابة تسجيل دخول مشرف دفعة ELEX28
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            مخصصة حصراً للمشرف المعتمد لمتابعة لوحة التحكم، الربط مع Google Sheets وإدارة وتوثيق نتائج ترشيحات الأمانات الأربعة.
          </p>
        </div>

        {/* 3 Interactive Feature Modules */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 max-w-3xl mx-auto mb-8 text-right relative z-10">
          {/* Card 1: Google Sheets */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#f38035]/50 transition-all space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#f38035]/15 text-[#f38035] flex items-center justify-center border border-[#f38035]/30">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">
              مزامنة Google Sheets
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              ربط تلقائي مع جدول "سجل ترشيحات أمانات الدفعة" وفرز فوري لكافة البيانات.
            </p>
          </div>

          {/* Card 2: Recharts Analytics */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#67B8DE]/50 transition-all space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#67B8DE]/15 text-[#67B8DE] flex items-center justify-center border border-[#67B8DE]/30">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">
              مخططات Recharts البيانية
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              رسم بياني لتوزيع الأصوات (ترشيح نفسي مقابل زميل) وترتيب المرشحين لحظياً.
            </p>
          </div>

          {/* Card 3: Evaluation Analysis */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#f38035]/50 transition-all space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#f38035]/15 text-[#f38035] flex items-center justify-center border border-[#f38035]/30">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-xs sm:text-sm">
              نتائج تقييم الرابطة
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              فرز متوسط التقييمات العامة والفرعية ومطالعة ملاحظات الطلاب وتصديرها.
            </p>
          </div>
        </div>

        {/* Google Single Sign-On Button */}
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <button
            type="button"
            onClick={onLogin}
            disabled={isLoading}
            className="w-full sm:w-auto min-w-[280px] sm:min-w-[340px] inline-flex items-center justify-center gap-3 px-8 py-4 sm:py-4.5 rounded-2xl text-sm sm:text-base font-bold text-slate-900 bg-white hover:bg-slate-100 shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                <span>جاري تسجيل الدخول بحساب المشرف...</span>
              </div>
            ) : (
              <>
                <div className="w-5 h-5 shrink-0">
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
                <span>تسجيل الدخول عبر Google بحساب المشرف</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#67B8DE]" />
            <span>SECURE GOOGLE WORKSPACE OAUTH2 AUTHENTICATION</span>
          </p>
        </div>

        {/* Bottom Return Action on Mobile & Laptop */}
        {onBackToPublic && (
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-center">
            <button
              type="button"
              onClick={onBackToPublic}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              لست مشرفاً؟ اضغط هنا للعودة إلى صفحة ترشيحات الدفعة
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

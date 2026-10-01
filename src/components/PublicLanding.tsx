import React from 'react';
import {
  Cpu,
  ArrowDown,
  Briefcase,
  GraduationCap,
  DollarSign,
  HeartHandshake,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';
import { NominationSubmission } from '../types/nomination';
import { InteractiveForm } from './InteractiveForm';
import { ElexLogo } from './ElexLogo';

interface PublicLandingProps {
  onSubmitDirect: (submission: NominationSubmission) => Promise<void>;
  isSubmitting: boolean;
  totalSubmissions: number;
}

export const PublicLanding: React.FC<PublicLandingProps> = ({
  onSubmitDirect,
  isSubmitting,
  totalSubmissions,
}) => {
  const scrollToForm = () => {
    const el = document.getElementById('nomination-form-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* High-Tech ELEX28 Hero Section - Coordinated with Logo Palette */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#070a10] via-[#0c121e] to-[#0e1627] text-white p-6 sm:p-14 shadow-2xl border-2 border-[#f38035]/30">
        {/* Dual top line accent */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE]"></div>

        {/* Ambient circuit glow matching ELEX logo colors */}
        <div className="absolute -top-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-[#f38035]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-[#67B8DE]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Logo Showcase Centered in Hero */}
          <div className="flex justify-center pt-1">
            <ElexLogo size="md" showSubtitle={true} />
          </div>

          {/* Department & Batch Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#f38035]/10 text-[#f38035] border border-[#f38035]/30 text-[11px] sm:text-xs font-mono font-bold tracking-wider backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-[#f38035] animate-pulse" />
            <span>دفعة ELEX28 • قسم الهندسة الإلكترونية</span>
          </div>

          {/* Main Title (Concise & Professional) */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
            المنصة الإلكترونية للترشح والترشيح <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE] font-mono">
              لأمانات دفعة ELEX28
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto px-2">
            منصة مخصصة لطلاب دفعة ELEX28 للمشاركة في تقييم أداء الدورة السابقة،
            وترشيح الكفاءات والكوادر المناسبة لإدارة الأمانات المختلفة للدورة القادمة بكل نزاهة وشفافية ومسؤولية.
          </p>

          {/* Counter Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
            <div className="px-4 py-2 rounded-2xl bg-[#070a10]/80 border border-[#f38035]/30 text-xs flex items-center gap-2 text-slate-200 shadow-inner">
              <Users className="w-4 h-4 text-[#f38035] shrink-0" />
              <span>إجمالي المشاركات المسجلة: <strong className="text-[#f38035] font-mono font-black text-sm">{totalSubmissions}</strong></span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-[#070a10]/80 border border-[#67B8DE]/30 text-xs flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-[#67B8DE] shrink-0" />
              <span>توثيق رسمي بالرقم الجامعي</span>
            </div>
          </div>

          {/* Centered Main CTA Button */}
          <div className="pt-3 sm:pt-4 flex justify-center">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-base text-slate-950 bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE] hover:from-[#ff9d5c] hover:to-[#f38035] shadow-[0_0_35px_rgba(243,128,53,0.35)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              <span>بدء التقييم والترشيح الآن</span>
              <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce stroke-[2.5]" />
            </button>
          </div>
        </div>
      </section>

      {/* Secretariats Overview Cards - Coordinated ELEX Palette */}
      <section className="space-y-4 sm:space-y-5">
        <div className="text-center max-w-xl mx-auto px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c121e] border border-[#f38035]/30 text-[#f38035] text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5 text-[#f38035]" />
            <span>هيكلة واختصاصات مكاتب الأمانات</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black text-white">
            الأمانات الأربعة المتاحة للترشيح
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            تعرّف على المهام الموكلة لكل أمانة لتحديد المرشح الأكفأ والأجدر لشغل المنصب
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* General Secretariat */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0c121e] border border-slate-800 shadow-md border-t-4 border-t-[#f38035] hover:border-[#f38035]/50 transition-all">
            <div className="w-9 h-9 rounded-2xl bg-[#f38035]/20 text-[#f38035] flex items-center justify-center mb-2.5">
              <Briefcase className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              الأمانة العامة (الأمين العام)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              التنسيق الإداري العام وتسيير أعمال الدفعة وتمثيل ELEX28 أمام قسم الهندسة الإلكترونية وإدارة الكلية.
            </p>
          </div>

          {/* Academic Secretariat */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0c121e] border border-slate-800 shadow-md border-t-4 border-t-[#67B8DE] hover:border-[#67B8DE]/50 transition-all">
            <div className="w-9 h-9 rounded-2xl bg-[#67B8DE]/20 text-[#67B8DE] flex items-center justify-center mb-2.5">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              الأمانة الأكاديمية
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              متابعة المحاضرات والمعامل وجداول الامتحانات، والتواصل مع الأساتذة، وتوفير المراجع والمصادر التخصصية.
            </p>
          </div>

          {/* Financial Secretariat */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0c121e] border border-slate-800 shadow-md border-t-4 border-t-[#f38035] hover:border-[#f38035]/50 transition-all">
            <div className="w-9 h-9 rounded-2xl bg-[#f38035]/20 text-[#f38035] flex items-center justify-center mb-2.5">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              الأمانة المالية (أمين المال)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              إدارة الصندوق المالي للدفعة، تحصيل الاشتراكات وضبط المصروفات بأعلى درجات الشفافية وتقديم تقارير دورية.
            </p>
          </div>

          {/* Social Secretariat */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#0c121e] border border-slate-800 shadow-md border-t-4 border-t-[#67B8DE] hover:border-[#67B8DE]/50 transition-all">
            <div className="w-9 h-9 rounded-2xl bg-[#67B8DE]/20 text-[#67B8DE] flex items-center justify-center mb-2.5">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-white text-sm mb-1">
              الأمانة الاجتماعية
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تنظيم الفعاليات والمناسبات الأخوية، تعزيز التكافل والتضامن الاجتماعي وتوطيد العلاقات بين طلاب الدفعة.
            </p>
          </div>
        </div>
      </section>

      {/* Direct Interactive Form */}
      <section>
        <InteractiveForm
          onSubmitDirect={onSubmitDirect}
          isSubmitting={isSubmitting}
        />
      </section>
    </div>
  );
};

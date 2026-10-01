import React, { useState } from 'react';
import {
  Send,
  User,
  GraduationCap,
  Briefcase,
  DollarSign,
  HeartHandshake,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Phone,
  Hash,
  ShieldCheck,
  Zap,
  UserCheck,
  Users,
  MinusCircle,
  Award,
  Check,
  ArrowDown,
  Layers,
} from 'lucide-react';
import { NominationSubmission, PreviousSecretariatEvaluation as EvalType } from '../types/nomination';
import { PreviousSecretariatEvaluation } from './PreviousSecretariatEvaluation';
import { ElexLogo } from './ElexLogo';

interface InteractiveFormProps {
  onSubmitDirect: (submission: NominationSubmission) => Promise<void>;
  isSubmitting: boolean;
}

export const InteractiveForm: React.FC<InteractiveFormProps> = ({
  onSubmitDirect,
  isSubmitting,
}) => {
  // Form State - Evaluation of Previous Secretariat (Stage 1)
  const [evaluation, setEvaluation] = useState<EvalType>({
    overallRating: 0,
    positivePoints: '',
    improvementPoints: '',
  });

  // Form State - Voter Info (Stage 2: Part 1)
  const [nominatorFullName, setNominatorFullName] = useState('');
  const [academicId, setAcademicId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Secretariat 1: General (Stage 2: Part 2)
  const [generalType, setGeneralType] = useState<'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح' | ''>('لا يوجد ترشيح');
  const [generalName, setGeneralName] = useState('');
  const [generalReasons, setGeneralReasons] = useState('');

  // Secretariat 2: Academic
  const [academicType, setAcademicType] = useState<'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح' | ''>('لا يوجد ترشيح');
  const [academicName, setAcademicName] = useState('');
  const [academicReasons, setAcademicReasons] = useState('');

  // Secretariat 3: Financial
  const [financialType, setFinancialType] = useState<'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح' | ''>('لا يوجد ترشيح');
  const [financialName, setFinancialName] = useState('');
  const [financialReasons, setFinancialReasons] = useState('');

  // Secretariat 4: Social
  const [socialType, setSocialType] = useState<'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح' | ''>('لا يوجد ترشيح');
  const [socialName, setSocialName] = useState('');
  const [socialReasons, setSocialReasons] = useState('');

  // Feedback (Stage 2: Part 3)
  const [additionalFeedback, setAdditionalFeedback] = useState('');

  // UI state
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<NominationSubmission | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-fill self nomination
  const handleNominatorNameChange = (val: string) => {
    setNominatorFullName(val);
    if (generalType === 'ترشيح نفسي') setGeneralName(val);
    if (academicType === 'ترشيح نفسي') setAcademicName(val);
    if (financialType === 'ترشيح نفسي') setFinancialName(val);
    if (socialType === 'ترشيح نفسي') setSocialName(val);
  };

  const handleGeneralTypeChange = (type: 'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح') => {
    setGeneralType(type);
    if (type === 'ترشيح نفسي') {
      setGeneralName(nominatorFullName);
    } else if (type === 'لا يوجد ترشيح') {
      setGeneralName('');
      setGeneralReasons('');
    }
  };

  const handleAcademicTypeChange = (type: 'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح') => {
    setAcademicType(type);
    if (type === 'ترشيح نفسي') {
      setAcademicName(nominatorFullName);
    } else if (type === 'لا يوجد ترشيح') {
      setAcademicName('');
      setAcademicReasons('');
    }
  };

  const handleFinancialTypeChange = (type: 'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح') => {
    setFinancialType(type);
    if (type === 'ترشيح نفسي') {
      setFinancialName(nominatorFullName);
    } else if (type === 'لا يوجد ترشيح') {
      setFinancialName('');
      setFinancialReasons('');
    }
  };

  const handleSocialTypeChange = (type: 'ترشيح نفسي' | 'ترشيح زميل آخر' | 'لا يوجد ترشيح') => {
    setSocialType(type);
    if (type === 'ترشيح نفسي') {
      setSocialName(nominatorFullName);
    } else if (type === 'لا يوجد ترشيح') {
      setSocialName('');
      setSocialReasons('');
    }
  };

  const activeNominationsCount = [
    generalType !== 'لا يوجد ترشيح' && generalType !== '',
    academicType !== 'لا يوجد ترشيح' && academicType !== '',
    financialType !== 'لا يوجد ترشيح' && financialType !== '',
    socialType !== 'لا يوجد ترشيح' && socialType !== '',
  ].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation for required student identification
    if (!nominatorFullName.trim()) {
      setValidationError('يرجى إدخال الاسم الرباعي كاملاً لمقدّم الطلب');
      const el = document.getElementById('field-student-name');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!academicId.trim()) {
      setValidationError('يرجى إدخال الرقم الجامعي / الأكاديمي');
      const el = document.getElementById('field-academic-id');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!phoneNumber.trim()) {
      setValidationError('يرجى إدخال رقم الهاتف أو الواتساب للتواصل');
      const el = document.getElementById('field-phone-number');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Validation if someone chose peer nomination without entering candidate name
    if (generalType === 'ترشيح زميل آخر' && !generalName.trim()) {
      setValidationError('يرجى إدخال اسم الزميل المرشح للأمانة العامة أو اختيار "لا يوجد ترشيح"');
      return;
    }
    if (academicType === 'ترشيح زميل آخر' && !academicName.trim()) {
      setValidationError('يرجى إدخال اسم الزميل المرشح للأمانة الأكاديمية أو اختيار "لا يوجد ترشيح"');
      return;
    }
    if (financialType === 'ترشيح زميل آخر' && !financialName.trim()) {
      setValidationError('يرجى إدخال اسم الزميل المرشح للأمانة المالية أو اختيار "لا يوجد ترشيح"');
      return;
    }
    if (socialType === 'ترشيح زميل آخر' && !socialName.trim()) {
      setValidationError('يرجى إدخال اسم الزميل المرشح للأمانة الاجتماعية أو اختيار "لا يوجد ترشيح"');
      return;
    }

    const submission: NominationSubmission = {
      id: `elex28_${Date.now()}`,
      timestamp: new Date().toISOString(),
      nominatorFullName: nominatorFullName.trim(),
      academicId: academicId.trim(),
      phoneNumber: phoneNumber.trim(),
      previousEvaluation:
        (evaluation.overallRating && evaluation.overallRating > 0) ||
        evaluation.generalSecretariatEval?.rating ||
        evaluation.positivePoints?.trim() ||
        evaluation.improvementPoints?.trim()
          ? evaluation
          : undefined,
      generalSecretariat: {
        nominationType: generalType,
        candidateName: generalType === 'لا يوجد ترشيح' ? '' : generalName.trim(),
        reasonsAndQualifications: generalType === 'لا يوجد ترشيح' ? '' : generalReasons.trim(),
      },
      academicSecretariat: {
        nominationType: academicType,
        candidateName: academicType === 'لا يوجد ترشيح' ? '' : academicName.trim(),
        reasonsAndQualifications: academicType === 'لا يوجد ترشيح' ? '' : academicReasons.trim(),
      },
      financialSecretariat: {
        nominationType: financialType,
        candidateName: financialType === 'لا يوجد ترشيح' ? '' : financialName.trim(),
        reasonsAndQualifications: financialType === 'لا يوجد ترشيح' ? '' : financialReasons.trim(),
      },
      socialSecretariat: {
        nominationType: socialType,
        candidateName: socialType === 'لا يوجد ترشيح' ? '' : socialName.trim(),
        reasonsAndQualifications: socialType === 'لا يوجد ترشيح' ? '' : socialReasons.trim(),
      },
      additionalFeedback: additionalFeedback.trim(),
    };

    try {
      await onSubmitDirect(submission);
      setSubmittedData(submission);
      setSubmitSuccess(true);
      // Reset fields
      setNominatorFullName('');
      setAcademicId('');
      setPhoneNumber('');
      setEvaluation({ overallRating: 0, positivePoints: '', improvementPoints: '' });
      setGeneralType('لا يوجد ترشيح');
      setGeneralName('');
      setGeneralReasons('');
      setAcademicType('لا يوجد ترشيح');
      setAcademicName('');
      setAcademicReasons('');
      setFinancialType('لا يوجد ترشيح');
      setFinancialName('');
      setFinancialReasons('');
      setSocialType('لا يوجد ترشيح');
      setSocialName('');
      setSocialReasons('');
      setAdditionalFeedback('');

      // Scroll smoothly to receipt
      const receiptEl = document.getElementById('nomination-form-section');
      receiptEl?.scrollIntoView({ behavior: 'smooth' });
    } catch (err: any) {
      setValidationError(err.message || 'حدث خطأ أثناء إرسال الترشيح، يرجى المحاولة ثانية');
    }
  };

  const scrollToStage2 = () => {
    const el = document.getElementById('stage-2-nomination-container');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      id="nomination-form-section"
      className="bg-[#070a10] rounded-3xl border border-slate-800/90 shadow-2xl overflow-hidden mb-12 relative"
    >
      {/* Circuit background ambient glow matching ELEX28 Logo colors */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-[#f38035]/12 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-[#67B8DE]/12 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f38035]/5 rounded-full blur-3xl pointer-events-none"></div>

      <form onSubmit={handleSubmit} className="p-4 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* Top Form Banner with Authentic ELEX 28 Logo & Dual Circuit Trim */}
        <div className="relative p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-[#0c121e] via-[#080d16] to-[#0e1627] text-white shadow-2xl border-2 border-[#f38035]/30 overflow-hidden">
          {/* Dual Brand Accent Line: ELEX Copper Orange (#f38035) & Electronic Cyan (#67B8DE) */}
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE]"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <ElexLogo size="sm" showSubtitle={true} />
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#f38035]/15 text-[#f38035] border border-[#f38035]/30">
                <Cpu className="w-3.5 h-3.5 text-[#f38035]" />
                <span>OFFICIAL PORTAL</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#67B8DE]/15 text-[#67B8DE] border border-[#67B8DE]/30">
                <span>ELEX 28</span>
              </span>
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-2 text-white">
            استمارة التقييم والترشح لأمانات دفعة ELEX28
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
            منظومة متكاملة لدفعة قسم الهندسة الإلكترونية تضم مرحلتين رئيسيتين: تقييم أداء مكتب الدورة السابقة،
            واستمارة الترشح والترشيح الرسمية للأمانات الأربعة للدورة القادمة بكل شفافية ومسؤولية ومطابقة مع السجل الأكاديمي.
          </p>

          {/* Two-Stage Progress Indicator */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#070a10]/80 border border-[#f38035]/30">
              <div className="w-8 h-8 rounded-xl bg-[#f38035]/20 text-[#f38035] flex items-center justify-center font-mono font-black shrink-0">
                01
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold text-[#f38035] uppercase tracking-wider block">
                  STAGE 1 • تقييم الأداء
                </span>
                <span className="text-white font-bold truncate block">
                  تقييم ومحاسبة مكتب الرابطة السابق
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#070a10]/80 border border-[#67B8DE]/30">
              <div className="w-8 h-8 rounded-xl bg-[#67B8DE]/20 text-[#67B8DE] flex items-center justify-center font-mono font-black shrink-0">
                02
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold text-[#67B8DE] uppercase tracking-wider block">
                  STAGE 2 • استمارة الترشيح
                </span>
                <span className="text-white font-bold truncate block">
                  التحقق والترشح لأمانات ELEX28 الأربعة
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Alert */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 flex items-center gap-3 text-sm font-semibold shadow-xl animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span className="leading-relaxed">{validationError}</span>
          </div>
        )}

        {/* Success Receipt Card (Receipt Voucher Style) */}
        {submitSuccess && submittedData && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c121e] text-white border-2 border-[#f38035] shadow-[0_0_40px_rgba(243,128,53,0.3)] space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f38035] to-[#ea580c] text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-[#f38035]/30">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#67B8DE]/20 text-[#67B8DE] border border-[#67B8DE]/30 mb-1">
                    <span>ELEX28 RECEIPT VOUCHER</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    تم توثيق واعتماد ترشيحك بنجاح! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                    شكراً لمشاركتك الفاعلة في مسيرة دفعة ELEX28 - قسم الهندسة الإلكترونية.
                  </p>
                </div>
              </div>
              <ElexLogo size="sm" showSubtitle={false} className="hidden sm:flex" />
            </div>

            {/* Receipt Summary Grid */}
            <div className="p-5 bg-[#070a10] rounded-2xl border border-slate-800 text-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-800/80">
                <div>
                  <span className="text-slate-400 text-[11px] block">اسم مقدّم الطلب:</span>
                  <span className="font-bold text-white text-sm">{submittedData.nominatorFullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">الرقم الجامعي / الأكاديمي:</span>
                  <span className="font-mono text-[#67B8DE] font-bold text-sm tracking-wider">{submittedData.academicId}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">رقم الهاتف / واتساب:</span>
                  <span className="font-mono text-[#f38035] font-bold">{submittedData.phoneNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">توقيت التسجيل والتوثيق:</span>
                  <span className="text-slate-300 font-mono text-[11px]">{new Date(submittedData.timestamp).toLocaleString('ar-EG')}</span>
                </div>
              </div>

              {/* Secretariats summary */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-mono font-bold text-[#67B8DE] uppercase block">
                  الترشيحات المعتمدة:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800/90 flex justify-between">
                    <span className="text-slate-400">الأمانة العامة:</span>
                    <span className="font-bold text-white">{submittedData.generalSecretariat.candidateName || 'لا يوجد'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800/90 flex justify-between">
                    <span className="text-slate-400">الأمانة الأكاديمية:</span>
                    <span className="font-bold text-[#67B8DE]">{submittedData.academicSecretariat.candidateName || 'لا يوجد'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800/90 flex justify-between">
                    <span className="text-slate-400">الأمانة المالية:</span>
                    <span className="font-bold text-[#f38035]">{submittedData.financialSecretariat.candidateName || 'لا يوجد'}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#0c121e] border border-slate-800/90 flex justify-between">
                    <span className="text-slate-400">الأمانة الاجتماعية:</span>
                    <span className="font-bold text-[#67B8DE]">{submittedData.socialSecretariat.candidateName || 'لا يوجد'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="px-6 py-3 rounded-2xl font-bold text-xs bg-gradient-to-r from-[#f38035] to-[#ea580c] hover:from-[#ff9d5c] hover:to-[#f38035] text-slate-950 transition-all cursor-pointer shadow-lg shadow-[#f38035]/25"
              >
                تسجيل ترشيح آخر أو تحديث
              </button>
              <span className="text-[11px] text-slate-400 font-mono">
                SECURED & ARCHIVED TO GOOGLE SHEETS
              </span>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════════════════
            STAGE 1: EVALUATION OF PREVIOUS SECRETARIAT
           ════════════════════════════════════════════════════════════════════════════════ */}
        <section className="space-y-4">
          <PreviousSecretariatEvaluation
            evaluation={evaluation}
            onChange={setEvaluation}
          />

          {/* Quick jump anchor to Stage 2 */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={scrollToStage2}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0c121e] border border-[#67B8DE]/30 text-[#67B8DE] hover:bg-[#67B8DE]/10 hover:border-[#67B8DE]/60 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <span>الانتقال مباشرة للمرحلة الثانية: استمارة الترشيح</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#67B8DE] animate-bounce" />
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════════════
            STAGE 2: THE OFFICIAL NOMINATION FORM (استمارة الترشح والترشيح لأمانات الدفعة)
           ════════════════════════════════════════════════════════════════════════════════ */}
        <div id="stage-2-nomination-container" className="space-y-8 scroll-mt-24">
          
          {/* Stage 2 Section Header Banner */}
          <div className="relative p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0c121e] via-[#090e18] to-[#121c2d] border-2 border-[#f38035]/50 shadow-2xl overflow-hidden">
            {/* Ambient circuit glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#f38035]/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#67B8DE]/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Glowing top line */}
            <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE]"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f38035] to-[#ea580c] text-slate-950 flex items-center justify-center font-black text-xl shrink-0 shadow-lg shadow-[#f38035]/30">
                  <Zap className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#67B8DE] uppercase tracking-wider">
                      المرحلة الثانية • STAGE 2
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f38035]/20 text-[#f38035] border border-[#f38035]/40">
                      OFFICIAL BALLOT
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-black text-white mt-0.5">
                    استمارة الترشح والترشيح لأمانات دفعة ELEX28
                  </h3>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 bg-[#070a10] px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs shrink-0 font-mono">
                <Layers className="w-3.5 h-3.5 text-[#67B8DE]" />
                <span className="text-slate-300">الترشيحات المحددة:</span>
                <span className="font-bold text-[#f38035]">{activeNominationsCount} / 4</span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-3 relative z-10 max-w-2xl">
              ابدأ بإدخال بياناتك الأكاديمية للتحقق، ثم اختر نوع الترشيح (ترشيح نفسك أو ترشيح زميل آخر كفء)
              لكل أمانة ترغب بالمشاركة في اختيار مرشح لها.
            </p>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              Stage 2 - Part 1: Voter Identity & Academic Verification
             ────────────────────────────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0c121e] border border-[#f38035]/30 shadow-xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/90">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#f38035]/15 text-[#f38035] border border-[#f38035]/30">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">
                    1. بيانات الطالب والتحقق الأكاديمي
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    مطلوبة لمطابقة الهوية ومنع تكرار التصويت في السجل الانتخابي للدفعة
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[#67B8DE] bg-[#070a10] px-3 py-1.5 rounded-xl border border-[#67B8DE]/20 font-mono self-start sm:self-auto">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VERIFIED IDENTITY</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Field 1: Student Full Name */}
              <div id="field-student-name" className="sm:col-span-2 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <User className="w-3.5 h-3.5 text-[#f38035]" />
                    <span>الاسم الرباعي لمقدّم الطلب (الطالب)</span>
                    <span className="text-[#f38035] font-black">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">حسب كشوفات القسم الرسمية</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: عمر فتحي علي طه"
                    value={nominatorFullName}
                    onChange={(e) => handleNominatorNameChange(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-[#070a10] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] focus:ring-2 focus:ring-[#f38035]/20 focus:shadow-[0_0_20px_rgba(243,128,53,0.15)] outline-none transition-all font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  يرجى كتابة الاسم رباعياً كما يظهر في السجلات الأكاديمية لكلية الهندسة.
                </p>
              </div>

              {/* Field 2: Academic ID */}
              <div id="field-academic-id" className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Hash className="w-3.5 h-3.5 text-[#67B8DE]" />
                    <span>الرقم الجامعي / الأكاديمي</span>
                    <span className="text-[#67B8DE] font-black">*</span>
                  </label>
                  <span className="text-[10px] text-[#67B8DE] font-mono">ACADEMIC ID</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="مثال: 20210543"
                    value={academicId}
                    onChange={(e) => setAcademicId(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-[#070a10] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] focus:ring-2 focus:ring-[#67B8DE]/20 focus:shadow-[0_0_20px_rgba(103,184,222,0.15)] outline-none transition-all font-mono tracking-wider font-bold"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  رقم القيد الأكاديمي لمنع التكرار وحفظ أمانة التصويت.
                </p>
              </div>

              {/* Field 3: Phone / WhatsApp */}
              <div id="field-phone-number" className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Phone className="w-3.5 h-3.5 text-[#f38035]" />
                    <span>رقم الهاتف أو الواتساب</span>
                    <span className="text-[#f38035] font-black">*</span>
                  </label>
                  <span className="text-[10px] text-[#f38035] font-mono">CONTACT</span>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="09xxxxxxxx أو +249..."
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-2xl bg-[#070a10] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] focus:ring-2 focus:ring-[#f38035]/20 focus:shadow-[0_0_20px_rgba(243,128,53,0.15)] outline-none transition-all font-mono tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  للتواصل السريع وتأكيد الترشيح من قِبل اللجنة المشرفة.
                </p>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              Stage 2 - Part 2: The 4 Secretariat Modules (Coordinated ELEX Theme)
             ────────────────────────────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#f38035] to-[#67B8DE]"></span>
                <div>
                  <h4 className="font-black text-white text-base sm:text-lg">
                    2. بطاقات الترشيح والترشح لأمانات دفعة ELEX28
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    حدد موقفك في كل أمانة على حدة: ترشيح نفسك، أو ترشيح زميل، أو لا يوجد ترشيح
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#67B8DE] hidden sm:inline">
                4 SECRETARIATS
              </span>
            </div>

            {/* ────────────────────────────────────────────────────────────
                SECRETARIAT A: GENERAL SECRETARIAT (الأمانة العامة)
                Brand Color: Circuit Orange (#f38035)
               ──────────────────────────────────────────────────────────── */}
            <div className={`p-6 sm:p-7 rounded-3xl bg-[#0c121e] border-2 transition-all duration-300 space-y-5 ${
              generalType !== 'لا يوجد ترشيح' && generalType !== ''
                ? 'border-[#f38035] shadow-[0_0_25px_rgba(243,128,53,0.18)]'
                : 'border-slate-800/90 hover:border-slate-700'
            }`}>
              {/* Secretariat Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#f38035]/15 text-[#f38035] border border-[#f38035]/30 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#f38035] uppercase tracking-wider">
                        SECRETARIAT 01
                      </span>
                      {generalType !== 'لا يوجد ترشيح' && generalType !== '' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f38035]/20 text-[#f38035] border border-[#f38035]/40">
                          {generalType}
                        </span>
                      )}
                    </div>
                    <h5 className="font-black text-white text-base sm:text-lg">
                      أ. الأمانة العامة (منصب الأمين العام للدفعة)
                    </h5>
                  </div>
                </div>
                <p className="text-xs text-slate-400 max-w-sm sm:text-left leading-relaxed">
                  القيادة والتنسيق الإداري العام وتسيير أعمال الدفعة وتمثيل ELEX28 أمام القسم والكلية
                </p>
              </div>

              {/* Custom High-Tech Segmented Cards (No generic radio inputs) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  اختر نوع الترشيح للأمانة العامة:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Self */}
                  <button
                    type="button"
                    onClick={() => handleGeneralTypeChange('ترشيح نفسي')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      generalType === 'ترشيح نفسي'
                        ? 'bg-[#f38035]/20 border-[#f38035] text-[#f38035] shadow-[0_0_15px_rgba(243,128,53,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      generalType === 'ترشيح نفسي'
                        ? 'bg-[#f38035] text-slate-950 border-[#f38035]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {generalType === 'ترشيح نفسي' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <UserCheck className="w-3 h-3" />}
                    </div>
                    <span>ترشيح نفسي (أرغب بالترشح)</span>
                  </button>

                  {/* Option 2: Peer */}
                  <button
                    type="button"
                    onClick={() => handleGeneralTypeChange('ترشيح زميل آخر')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      generalType === 'ترشيح زميل آخر'
                        ? 'bg-[#f38035]/20 border-[#f38035] text-[#f38035] shadow-[0_0_15px_rgba(243,128,53,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      generalType === 'ترشيح زميل آخر'
                        ? 'bg-[#f38035] text-slate-950 border-[#f38035]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {generalType === 'ترشيح زميل آخر' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Users className="w-3 h-3" />}
                    </div>
                    <span>ترشيح زميل آخر للدفعة</span>
                  </button>

                  {/* Option 3: None */}
                  <button
                    type="button"
                    onClick={() => handleGeneralTypeChange('لا يوجد ترشيح')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      generalType === 'لا يوجد ترشيح'
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-[#070a10] border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      generalType === 'لا يوجد ترشيح'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {generalType === 'لا يوجد ترشيح' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <MinusCircle className="w-3 h-3" />}
                    </div>
                    <span>لا يوجد ترشيح حالياً</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Candidate Input Fields */}
              {generalType === 'ترشيح نفسي' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#f38035]/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#f38035]">
                    <UserCheck className="w-4 h-4" />
                    <span>تم اعتماد ترشيحك الشخصي للأمانة العامة باسم:</span>
                    <span className="font-mono text-white underline decoration-[#f38035]">
                      {nominatorFullName || '(يرجى إكمال كتابة اسمك في بيانات الطالب بالأعلى)'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      البرنامج والرؤية الانتخابية لقيادة الأمانة العامة (اختياري):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="اذكر خططك التنسيقية ورؤيتك لتمثيل دفعة ELEX28 أمام عمادة الكلية وإدارة القسم..."
                      value={generalReasons}
                      onChange={(e) => setGeneralReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {generalType === 'ترشيح زميل آخر' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#f38035]/30 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      اسم الزميل المرشح الثلاثي أو الرباعي:
                      <span className="text-[#f38035] mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="اكتب اسم الزميل المرشح لمنصب الأمين العام..."
                      value={generalName}
                      onChange={(e) => setGeneralName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      أسباب ومسوغات الترشيح والمؤهلات القيادية:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="بيان القدرات القيادية والخبرة وسبب اختيارك لهذا الزميل..."
                      value={generalReasons}
                      onChange={(e) => setGeneralReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ────────────────────────────────────────────────────────────
                SECRETARIAT B: ACADEMIC SECRETARIAT (الأمانة الأكاديمية)
                Brand Color: Electronic Cyan (#67B8DE)
               ──────────────────────────────────────────────────────────── */}
            <div className={`p-6 sm:p-7 rounded-3xl bg-[#0c121e] border-2 transition-all duration-300 space-y-5 ${
              academicType !== 'لا يوجد ترشيح' && academicType !== ''
                ? 'border-[#67B8DE] shadow-[0_0_25px_rgba(103,184,222,0.18)]'
                : 'border-slate-800/90 hover:border-slate-700'
            }`}>
              {/* Secretariat Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#67B8DE]/15 text-[#67B8DE] border border-[#67B8DE]/30 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#67B8DE] uppercase tracking-wider">
                        SECRETARIAT 02
                      </span>
                      {academicType !== 'لا يوجد ترشيح' && academicType !== '' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#67B8DE]/20 text-[#67B8DE] border border-[#67B8DE]/40">
                          {academicType}
                        </span>
                      )}
                    </div>
                    <h5 className="font-black text-white text-base sm:text-lg">
                      ب. الأمانة الأكاديمية
                    </h5>
                  </div>
                </div>
                <p className="text-xs text-slate-400 max-w-sm sm:text-left leading-relaxed">
                  متابعة المحاضرات، المعامل، جداول الامتحانات، التواصل مع الأساتذة، وتوفير المراجع المتخصصة
                </p>
              </div>

              {/* Custom High-Tech Segmented Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  اختر نوع الترشيح للأمانة الأكاديمية:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Self */}
                  <button
                    type="button"
                    onClick={() => handleAcademicTypeChange('ترشيح نفسي')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      academicType === 'ترشيح نفسي'
                        ? 'bg-[#67B8DE]/20 border-[#67B8DE] text-[#67B8DE] shadow-[0_0_15px_rgba(103,184,222,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      academicType === 'ترشيح نفسي'
                        ? 'bg-[#67B8DE] text-slate-950 border-[#67B8DE]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {academicType === 'ترشيح نفسي' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <UserCheck className="w-3 h-3" />}
                    </div>
                    <span>ترشيح نفسي (أرغب بالترشح)</span>
                  </button>

                  {/* Option 2: Peer */}
                  <button
                    type="button"
                    onClick={() => handleAcademicTypeChange('ترشيح زميل آخر')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      academicType === 'ترشيح زميل آخر'
                        ? 'bg-[#67B8DE]/20 border-[#67B8DE] text-[#67B8DE] shadow-[0_0_15px_rgba(103,184,222,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      academicType === 'ترشيح زميل آخر'
                        ? 'bg-[#67B8DE] text-slate-950 border-[#67B8DE]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {academicType === 'ترشيح زميل آخر' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Users className="w-3 h-3" />}
                    </div>
                    <span>ترشيح زميل آخر للدفعة</span>
                  </button>

                  {/* Option 3: None */}
                  <button
                    type="button"
                    onClick={() => handleAcademicTypeChange('لا يوجد ترشيح')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      academicType === 'لا يوجد ترشيح'
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-[#070a10] border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      academicType === 'لا يوجد ترشيح'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {academicType === 'لا يوجد ترشيح' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <MinusCircle className="w-3 h-3" />}
                    </div>
                    <span>لا يوجد ترشيح حالياً</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Candidate Input Fields */}
              {academicType === 'ترشيح نفسي' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#67B8DE]/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#67B8DE]">
                    <UserCheck className="w-4 h-4" />
                    <span>تم اعتماد ترشيحك الشخصي للأمانة الأكاديمية باسم:</span>
                    <span className="font-mono text-white underline decoration-[#67B8DE]">
                      {nominatorFullName || '(يرجى إكمال كتابة اسمك في بيانات الطالب بالأعلى)'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      الرؤية والخطط الأكاديمية لتطوير مصادر ومراجع الدفعة:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="اذكر خططك لتسهيل الدراسة والمعامل، وتوفير الشيتات والمراجع والتواصل مع الأساتذة..."
                      value={academicReasons}
                      onChange={(e) => setAcademicReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {academicType === 'ترشيح زميل آخر' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#67B8DE]/30 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      اسم الزميل المرشح للأمانة الأكاديمية:
                      <span className="text-[#67B8DE] mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="اكتب اسم الزميل المرشح للأمانة الأكاديمية..."
                      value={academicName}
                      onChange={(e) => setAcademicName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      أسباب الترشيح والكفاءة الأكاديمية:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="بيان التميز الأكاديمي، التفاني، والقدرة على توفير المصادر ومساعدة الزملاء..."
                      value={academicReasons}
                      onChange={(e) => setAcademicReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ────────────────────────────────────────────────────────────
                SECRETARIAT C: FINANCIAL SECRETARIAT (الأمانة المالية)
                Brand Color: Circuit Orange / Copper Amber (#f38035)
               ──────────────────────────────────────────────────────────── */}
            <div className={`p-6 sm:p-7 rounded-3xl bg-[#0c121e] border-2 transition-all duration-300 space-y-5 ${
              financialType !== 'لا يوجد ترشيح' && financialType !== ''
                ? 'border-[#f38035] shadow-[0_0_25px_rgba(243,128,53,0.18)]'
                : 'border-slate-800/90 hover:border-slate-700'
            }`}>
              {/* Secretariat Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#f38035]/15 text-[#f38035] border border-[#f38035]/30 shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#f38035] uppercase tracking-wider">
                        SECRETARIAT 03
                      </span>
                      {financialType !== 'لا يوجد ترشيح' && financialType !== '' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f38035]/20 text-[#f38035] border border-[#f38035]/40">
                          {financialType}
                        </span>
                      )}
                    </div>
                    <h5 className="font-black text-white text-base sm:text-lg">
                      ج. الأمانة المالية (أمين المال)
                    </h5>
                  </div>
                </div>
                <p className="text-xs text-slate-400 max-w-sm sm:text-left leading-relaxed">
                  إدارة صندوق الدفعة، ضبط الاشتراكات والمصروفات، وتقديم تقارير دورية بشفافية تامة
                </p>
              </div>

              {/* Custom High-Tech Segmented Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  اختر نوع الترشيح للأمانة المالية:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Self */}
                  <button
                    type="button"
                    onClick={() => handleFinancialTypeChange('ترشيح نفسي')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      financialType === 'ترشيح نفسي'
                        ? 'bg-[#f38035]/20 border-[#f38035] text-[#f38035] shadow-[0_0_15px_rgba(243,128,53,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      financialType === 'ترشيح نفسي'
                        ? 'bg-[#f38035] text-slate-950 border-[#f38035]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {financialType === 'ترشيح نفسي' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <UserCheck className="w-3 h-3" />}
                    </div>
                    <span>ترشيح نفسي (أرغب بالترشح)</span>
                  </button>

                  {/* Option 2: Peer */}
                  <button
                    type="button"
                    onClick={() => handleFinancialTypeChange('ترشيح زميل آخر')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      financialType === 'ترشيح زميل آخر'
                        ? 'bg-[#f38035]/20 border-[#f38035] text-[#f38035] shadow-[0_0_15px_rgba(243,128,53,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      financialType === 'ترشيح زميل آخر'
                        ? 'bg-[#f38035] text-slate-950 border-[#f38035]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {financialType === 'ترشيح زميل آخر' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Users className="w-3 h-3" />}
                    </div>
                    <span>ترشيح زميل آخر للدفعة</span>
                  </button>

                  {/* Option 3: None */}
                  <button
                    type="button"
                    onClick={() => handleFinancialTypeChange('لا يوجد ترشيح')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      financialType === 'لا يوجد ترشيح'
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-[#070a10] border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      financialType === 'لا يوجد ترشيح'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {financialType === 'لا يوجد ترشيح' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <MinusCircle className="w-3 h-3" />}
                    </div>
                    <span>لا يوجد ترشيح حالياً</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Candidate Input Fields */}
              {financialType === 'ترشيح نفسي' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#f38035]/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#f38035]">
                    <UserCheck className="w-4 h-4" />
                    <span>تم اعتماد ترشيحك الشخصي للأمانة المالية باسم:</span>
                    <span className="font-mono text-white underline decoration-[#f38035]">
                      {nominatorFullName || '(يرجى إكمال كتابة اسمك في بيانات الطالب بالأعلى)'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      آلية ضبط الصندوق والشفافية المالية المقترحة:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="اذكر خبرتك المحاسبية وطرق إدارة الصندوق المالي والتقارير الدورية..."
                      value={financialReasons}
                      onChange={(e) => setFinancialReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {financialType === 'ترشيح زميل آخر' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#f38035]/30 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      اسم الزميل المرشح لمنصب أمين المال:
                      <span className="text-[#f38035] mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="اكتب اسم الزميل المرشح للأمانة المالية..."
                      value={financialName}
                      onChange={(e) => setFinancialName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      أسباب الترشيح والأمانة والنزاهة المالية:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="بيان النزاهة وحسن التدبير المالي والالتزام بالشفافية..."
                      value={financialReasons}
                      onChange={(e) => setFinancialReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ────────────────────────────────────────────────────────────
                SECRETARIAT D: SOCIAL SECRETARIAT (الأمانة الاجتماعية)
                Brand Color: Electronic Cyan (#67B8DE)
               ──────────────────────────────────────────────────────────── */}
            <div className={`p-6 sm:p-7 rounded-3xl bg-[#0c121e] border-2 transition-all duration-300 space-y-5 ${
              socialType !== 'لا يوجد ترشيح' && socialType !== ''
                ? 'border-[#67B8DE] shadow-[0_0_25px_rgba(103,184,222,0.18)]'
                : 'border-slate-800/90 hover:border-slate-700'
            }`}>
              {/* Secretariat Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-[#67B8DE]/15 text-[#67B8DE] border border-[#67B8DE]/30 shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-[#67B8DE] uppercase tracking-wider">
                        SECRETARIAT 04
                      </span>
                      {socialType !== 'لا يوجد ترشيح' && socialType !== '' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#67B8DE]/20 text-[#67B8DE] border border-[#67B8DE]/40">
                          {socialType}
                        </span>
                      )}
                    </div>
                    <h5 className="font-black text-white text-base sm:text-lg">
                      د. الأمانة الاجتماعية
                    </h5>
                  </div>
                </div>
                <p className="text-xs text-slate-400 max-w-sm sm:text-left leading-relaxed">
                  تنظيم المناسبات والفعاليات الأخوية، تعزيز الترابط والتكافل الاجتماعي بين طلاب الدفعة
                </p>
              </div>

              {/* Custom High-Tech Segmented Cards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">
                  اختر نوع الترشيح للأمانة الاجتماعية:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Self */}
                  <button
                    type="button"
                    onClick={() => handleSocialTypeChange('ترشيح نفسي')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      socialType === 'ترشيح نفسي'
                        ? 'bg-[#67B8DE]/20 border-[#67B8DE] text-[#67B8DE] shadow-[0_0_15px_rgba(103,184,222,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      socialType === 'ترشيح نفسي'
                        ? 'bg-[#67B8DE] text-slate-950 border-[#67B8DE]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {socialType === 'ترشيح نفسي' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <UserCheck className="w-3 h-3" />}
                    </div>
                    <span>ترشيح نفسي (أرغب بالترشح)</span>
                  </button>

                  {/* Option 2: Peer */}
                  <button
                    type="button"
                    onClick={() => handleSocialTypeChange('ترشيح زميل آخر')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      socialType === 'ترشيح زميل آخر'
                        ? 'bg-[#67B8DE]/20 border-[#67B8DE] text-[#67B8DE] shadow-[0_0_15px_rgba(103,184,222,0.25)]'
                        : 'bg-[#070a10] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      socialType === 'ترشيح زميل آخر'
                        ? 'bg-[#67B8DE] text-slate-950 border-[#67B8DE]'
                        : 'border-slate-700 bg-slate-900 text-slate-500'
                    }`}>
                      {socialType === 'ترشيح زميل آخر' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Users className="w-3 h-3" />}
                    </div>
                    <span>ترشيح زميل آخر للدفعة</span>
                  </button>

                  {/* Option 3: None */}
                  <button
                    type="button"
                    onClick={() => handleSocialTypeChange('لا يوجد ترشيح')}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer text-right ${
                      socialType === 'لا يوجد ترشيح'
                        ? 'bg-slate-900 border-slate-700 text-slate-300'
                        : 'bg-[#070a10] border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                      socialType === 'لا يوجد ترشيح'
                        ? 'bg-slate-700 text-white border-slate-600'
                        : 'border-slate-800 bg-slate-950 text-slate-600'
                    }`}>
                      {socialType === 'لا يوجد ترشيح' ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <MinusCircle className="w-3 h-3" />}
                    </div>
                    <span>لا يوجد ترشيح حالياً</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Candidate Input Fields */}
              {socialType === 'ترشيح نفسي' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#67B8DE]/30 space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#67B8DE]">
                    <UserCheck className="w-4 h-4" />
                    <span>تم اعتماد ترشيحك الشخصي للأمانة الاجتماعية باسم:</span>
                    <span className="font-mono text-white underline decoration-[#67B8DE]">
                      {nominatorFullName || '(يرجى إكمال كتابة اسمك في بيانات الطالب بالأعلى)'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      الأفكار والمبادرات المقترحة للأنشطة والترابط:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="اذكر مقترحاتك للفعاليات الأخوية، مبادرات التكافل ودعم الزملاء..."
                      value={socialReasons}
                      onChange={(e) => setSocialReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {socialType === 'ترشيح زميل آخر' && (
                <div className="p-4 rounded-2xl bg-[#070a10] border border-[#67B8DE]/30 space-y-3 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      اسم الزميل المرشح للأمانة الاجتماعية:
                      <span className="text-[#67B8DE] mr-1">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="اكتب اسم الزميل المرشح للأمانة الاجتماعية..."
                      value={socialName}
                      onChange={(e) => setSocialName(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      أسباب الترشيح والمبادرات المجتمعية:
                    </label>
                    <textarea
                      rows={2}
                      placeholder="بيان العلاقات الطيبة مع الزملاء وروح المبادرة والتكافل..."
                      value={socialReasons}
                      onChange={(e) => setSocialReasons(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#0c121e] border border-slate-800 text-white placeholder-slate-600 focus:border-[#67B8DE] outline-none resize-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              Stage 2 - Part 3: Vision & Additional Recommendations
             ────────────────────────────────────────────────────────────────────────── */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0c121e] border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <div className="p-2 rounded-xl bg-[#f38035]/15 text-[#f38035]">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">
                  3. توصيات ومقترحات إضافية لمكتب دفعة ELEX28 القادم (اختياري)
                </h4>
                <p className="text-xs text-slate-400">
                  شارك بأي أفكار، نصائح أو لجان مساعدة ترى أنها تخدم الدفعة وتطور مسيرتها
                </p>
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="اكتب أي مقترحات، توصيات، أو آراء تراها مفيدة لخدمة وتطوير مسيرة ELEX28..."
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl bg-[#070a10] border border-slate-800 text-white placeholder-slate-600 focus:border-[#f38035] focus:ring-1 focus:ring-[#f38035]/25 outline-none resize-none transition-all"
            />
          </div>

          {/* ──────────────────────────────────────────────────────────────────────────
              Submission Zone (ELEX28 High-Tech CTA Button)
             ────────────────────────────────────────────────────────────────────────── */}
          <div className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[280px] sm:min-w-[380px] inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-base sm:text-lg text-slate-950 bg-gradient-to-r from-[#f38035] via-[#ff9d5c] to-[#67B8DE] hover:from-[#ff9d5c] hover:to-[#f38035] shadow-[0_0_35px_rgba(243,128,53,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  <span>جاري توثيق واعتماد الترشيح...</span>
                </div>
              ) : (
                <>
                  <Zap className="w-5 h-5 text-slate-950 fill-slate-950 stroke-[2.5]" />
                  <span>إرسال وتوثيق استمارة ترشيح دفعة ELEX28</span>
                </>
              )}
            </button>
            
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#67B8DE]" />
              <span>ELEX28 OFFICIAL BALLOT • ENCRYPTED & LINKED TO GOOGLE SHEETS</span>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

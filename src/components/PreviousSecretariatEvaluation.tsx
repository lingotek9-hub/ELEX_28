import React from 'react';
import {
  Star,
  ThumbsUp,
  AlertTriangle,
  Briefcase,
  GraduationCap,
  DollarSign,
  HeartHandshake,
  Award,
} from 'lucide-react';
import { PreviousSecretariatEvaluation as EvalType } from '../types/nomination';

interface EvaluationProps {
  evaluation: EvalType;
  onChange: (evaluation: EvalType) => void;
}

const RATING_DESCRIPTIONS = [
  'ضعيف جداً',
  'دون المتوقع',
  'أداء متوسط ومقبول',
  'أداء جيد جداً',
  'أداء ممتاز ومتميز',
];

interface StarRatingInputProps {
  label: string;
  sublabel?: string;
  rating: number;
  onRate: (rating: number) => void;
  icon?: React.ReactNode;
}

const StarRatingInput: React.FC<StarRatingInputProps> = ({
  label,
  sublabel,
  rating,
  onRate,
  icon,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs sm:text-sm font-bold text-white">{label}</span>
      </div>
      {sublabel && (
        <p className="text-[11px] text-slate-400 leading-relaxed pr-6">{sublabel}</p>
      )}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 pr-6">
        <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#070a10] rounded-xl border border-slate-800 shadow-inner">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRate(star)}
              className="p-1 hover:scale-125 active:scale-95 transition-all cursor-pointer focus:outline-none"
              title={`${star} نجوم`}
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= rating
                    ? 'fill-[#f38035] text-[#f38035] drop-shadow-[0_0_8px_rgba(243,128,53,0.6)]'
                    : 'text-slate-700 hover:text-amber-400'
                }`}
              />
            </button>
          ))}
        </div>
        {rating > 0 ? (
          <span className="text-[11px] font-bold text-[#f38035] bg-[#f38035]/15 px-2.5 py-1 rounded-lg border border-[#f38035]/30">
            {RATING_DESCRIPTIONS[rating - 1]} ({rating}/5)
          </span>
        ) : (
          <span className="text-[11px] text-slate-500 italic">حدد التقييم</span>
        )}
      </div>
    </div>
  );
};

export const PreviousSecretariatEvaluation: React.FC<EvaluationProps> = ({
  evaluation,
  onChange,
}) => {
  const updateGeneral = (rating: number, notes?: string) => {
    onChange({
      ...evaluation,
      generalSecretariatEval: {
        rating,
        notes: notes !== undefined ? notes : evaluation.generalSecretariatEval?.notes,
      },
    });
  };

  const updateAcademic = (rating: number, notes?: string) => {
    onChange({
      ...evaluation,
      academicSecretariatEval: {
        rating,
        notes: notes !== undefined ? notes : evaluation.academicSecretariatEval?.notes,
      },
    });
  };

  const updateFinancial = (rating: number, notes?: string) => {
    onChange({
      ...evaluation,
      financialSecretariatEval: {
        rating,
        notes: notes !== undefined ? notes : evaluation.financialSecretariatEval?.notes,
      },
    });
  };

  const updateSocial = (rating: number, notes?: string) => {
    onChange({
      ...evaluation,
      socialSecretariatEval: {
        rating,
        notes: notes !== undefined ? notes : evaluation.socialSecretariatEval?.notes,
      },
    });
  };

  return (
    <div className="p-5 sm:p-8 rounded-3xl bg-[#0e1422] text-white border border-[#f38035]/30 shadow-2xl relative overflow-hidden space-y-6">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#f38035]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Section Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="p-2.5 rounded-2xl bg-[#f38035]/15 text-[#f38035] border border-[#f38035]/30 shadow-[0_0_15px_rgba(243,128,53,0.15)] shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#67B8DE] uppercase tracking-wider">
              المرحلة الأولى • تقييم أداء الرابطة السابقة
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white">
            استطلاع تقييم أداء أمانات مكتب دفعة ELEX28 السابق
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            تقييم موضوعي ومفصّل لأداء كل أمانة للمساعدة في التطوير المؤسسي وضمان الشفافية
          </p>
        </div>
      </div>

      {/* Grid for Detailed Secretariat Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 relative z-10">
        {/* 1. General Secretariat Evaluation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#f38035]/40 transition-colors space-y-3">
          <StarRatingInput
            label="1. الأمانة العامة (الأمين العام)"
            sublabel="مستوى التنسيق الإداري العام، تمثيل الدفعة أمام القسم وإدارة الكلية، وإدارة شؤون الدفعة."
            rating={evaluation.generalSecretariatEval?.rating || 0}
            onRate={(r) => updateGeneral(r)}
            icon={<Briefcase className="w-4 h-4 text-[#f38035]" />}
          />
          <input
            type="text"
            placeholder="ملاحظة أو تعليق مختصر على الأمانة العامة (اختياري)..."
            value={evaluation.generalSecretariatEval?.notes || ''}
            onChange={(e) =>
              updateGeneral(evaluation.generalSecretariatEval?.rating || 0, e.target.value)
            }
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0b0f17] border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-[#f38035] focus:ring-1 focus:ring-[#f38035]/30 outline-none transition-all"
          />
        </div>

        {/* 2. Academic Secretariat Evaluation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#67B8DE]/40 transition-colors space-y-3">
          <StarRatingInput
            label="2. الأمانة الأكاديمية"
            sublabel="متابعة الجداول الدراسية والمعامل، الامتحانات، والتواصل مع الأساتذة وتوفير المصادر."
            rating={evaluation.academicSecretariatEval?.rating || 0}
            onRate={(r) => updateAcademic(r)}
            icon={<GraduationCap className="w-4 h-4 text-[#67B8DE]" />}
          />
          <input
            type="text"
            placeholder="ملاحظة أو تعليق مختصر على الأمانة الأكاديمية (اختياري)..."
            value={evaluation.academicSecretariatEval?.notes || ''}
            onChange={(e) =>
              updateAcademic(evaluation.academicSecretariatEval?.rating || 0, e.target.value)
            }
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0b0f17] border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-[#67B8DE] focus:ring-1 focus:ring-[#67B8DE]/30 outline-none transition-all"
          />
        </div>

        {/* 3. Financial Secretariat Evaluation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#f38035]/40 transition-colors space-y-3">
          <StarRatingInput
            label="3. الأمانة المالية (أمين المال)"
            sublabel="الشفافية المالية، إدارة الصندوق والاشتراكات، ووضوح التقارير والمصروفات."
            rating={evaluation.financialSecretariatEval?.rating || 0}
            onRate={(r) => updateFinancial(r)}
            icon={<DollarSign className="w-4 h-4 text-[#f38035]" />}
          />
          <input
            type="text"
            placeholder="ملاحظة أو تعليق على الإدارة المالية (اختياري)..."
            value={evaluation.financialSecretariatEval?.notes || ''}
            onChange={(e) =>
              updateFinancial(evaluation.financialSecretariatEval?.rating || 0, e.target.value)
            }
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0b0f17] border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-[#f38035] focus:ring-1 focus:ring-[#f38035]/30 outline-none transition-all"
          />
        </div>

        {/* 4. Social Secretariat Evaluation */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10]/80 border border-slate-800 hover:border-[#67B8DE]/40 transition-colors space-y-3">
          <StarRatingInput
            label="4. الأمانة الاجتماعية"
            sublabel="تنظيم الفعاليات، المناسبات الأخوية، مبادرات التكافل والترابط بين طلاب الدفعة."
            rating={evaluation.socialSecretariatEval?.rating || 0}
            onRate={(r) => updateSocial(r)}
            icon={<HeartHandshake className="w-4 h-4 text-[#67B8DE]" />}
          />
          <input
            type="text"
            placeholder="ملاحظة أو تعليق على الأنشطة الاجتماعية (اختياري)..."
            value={evaluation.socialSecretariatEval?.notes || ''}
            onChange={(e) =>
              updateSocial(evaluation.socialSecretariatEval?.rating || 0, e.target.value)
            }
            className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#0b0f17] border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-[#67B8DE] focus:ring-1 focus:ring-[#67B8DE]/30 outline-none transition-all"
          />
        </div>
      </div>

      {/* Overall Score */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#070a10] border border-[#f38035]/40 shadow-inner relative z-10">
        <StarRatingInput
          label="التقييم الإجمالي العام لأداء مكتب الرابطة السابقة ككل:"
          sublabel="التقييم الشامل لكفاءة ومخرجات الدورة السابقة على مستوى دفعة ELEX28."
          rating={evaluation.overallRating || 0}
          onRate={(r) => onChange({ ...evaluation, overallRating: r })}
          icon={<Star className="w-4 h-4 text-[#f38035] fill-[#f38035]" />}
        />
      </div>

      {/* Qualitative Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 relative z-10">
        <div className="p-4 rounded-2xl bg-[#070a10]/80 border border-slate-800 space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
            <span>أبرز الإيجابيات والمكتسبات التي تحسب للرابطة السابقة:</span>
          </label>
          <textarea
            rows={2}
            placeholder="مثال: التنسيق الجيد، الوقفة في الامتحانات، الشفافية والتعاون..."
            value={evaluation.positivePoints || ''}
            onChange={(e) =>
              onChange({ ...evaluation, positivePoints: e.target.value })
            }
            className="w-full p-3 text-xs rounded-xl bg-[#0b0f17] border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-emerald-500 outline-none resize-none"
          />
        </div>

        <div className="p-4 rounded-2xl bg-[#070a10]/80 border border-slate-800 space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>أبرز التوصيات ونقاط التطوير الموجهة للرابطة القادمة:</span>
          </label>
          <textarea
            rows={2}
            placeholder="مثال: سرعة الإعلانات الأكاديمية، متابعة المعامل، تفعيل الصندوق..."
            value={evaluation.improvementPoints || ''}
            onChange={(e) =>
              onChange({ ...evaluation, improvementPoints: e.target.value })
            }
            className="w-full p-3 text-xs rounded-xl bg-[#0b0f17] border border-slate-800 text-slate-200 placeholder-slate-600 focus:border-rose-500 outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
};

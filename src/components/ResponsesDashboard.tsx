import React, { useState, useMemo } from 'react';
import {
  Users,
  Briefcase,
  GraduationCap,
  DollarSign,
  HeartHandshake,
  Search,
  Download,
  Award,
  FileSpreadsheet,
  Star,
  ThumbsUp,
  AlertTriangle,
  MessageSquareHeart,
  BarChart3,
} from 'lucide-react';
import { NominationSubmission, GoogleSheetConfig } from '../types/nomination';
import { MAIN_HEADERS, submissionToMainRow } from '../lib/googleSheets';
import { SecretariatCharts } from './SecretariatCharts';

interface ResponsesDashboardProps {
  submissions: NominationSubmission[];
  sheetConfig: GoogleSheetConfig | null;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ResponsesDashboard: React.FC<ResponsesDashboardProps> = ({
  submissions,
  sheetConfig,
  onRefresh,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSecretariat, setSelectedSecretariat] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<NominationSubmission | null>(null);
  const [activeView, setActiveView] = useState<'charts' | 'nominations' | 'evaluation'>('charts');

  // Statistics calculation
  const stats = useMemo(() => {
    let generalCount = 0;
    let academicCount = 0;
    let financialCount = 0;
    let socialCount = 0;

    // Evaluations
    let evalRatingsSum = 0;
    let evalRatingsCount = 0;
    let generalEvalSum = 0;
    let generalEvalCount = 0;
    let academicEvalSum = 0;
    let academicEvalCount = 0;
    let financialEvalSum = 0;
    let financialEvalCount = 0;
    let socialEvalSum = 0;
    let socialEvalCount = 0;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const positiveFeedbackList: { text: string; nominator: string }[] = [];
    const improvementFeedbackList: { text: string; nominator: string }[] = [];

    // Leaderboards
    const generalMap: Record<string, { count: number; self: number; colleague: number }> = {};
    const academicMap: Record<string, { count: number; self: number; colleague: number }> = {};
    const financialMap: Record<string, { count: number; self: number; colleague: number }> = {};
    const socialMap: Record<string, { count: number; self: number; colleague: number }> = {};

    submissions.forEach((s) => {
      const prev = s.previousEvaluation;
      if (prev) {
        if (prev.overallRating && prev.overallRating > 0) {
          evalRatingsSum += prev.overallRating;
          evalRatingsCount++;
          ratingDistribution[prev.overallRating] =
            (ratingDistribution[prev.overallRating] || 0) + 1;
        }

        if (prev.generalSecretariatEval?.rating) {
          generalEvalSum += prev.generalSecretariatEval.rating;
          generalEvalCount++;
        }

        if (prev.academicSecretariatEval?.rating) {
          academicEvalSum += prev.academicSecretariatEval.rating;
          academicEvalCount++;
        }

        if (prev.financialSecretariatEval?.rating) {
          financialEvalSum += prev.financialSecretariatEval.rating;
          financialEvalCount++;
        }

        if (prev.socialSecretariatEval?.rating) {
          socialEvalSum += prev.socialSecretariatEval.rating;
          socialEvalCount++;
        }

        if (prev.positivePoints?.trim()) {
          positiveFeedbackList.push({
            text: prev.positivePoints.trim(),
            nominator: s.nominatorFullName,
          });
        }
        if (prev.improvementPoints?.trim()) {
          improvementFeedbackList.push({
            text: prev.improvementPoints.trim(),
            nominator: s.nominatorFullName,
          });
        }
      }

      // General
      if (s.generalSecretariat?.candidateName && s.generalSecretariat.nominationType !== 'لا يوجد ترشيح') {
        generalCount++;
        const name = s.generalSecretariat.candidateName.trim();
        if (!generalMap[name]) generalMap[name] = { count: 0, self: 0, colleague: 0 };
        generalMap[name].count++;
        if (s.generalSecretariat.nominationType === 'ترشيح نفسي') generalMap[name].self++;
        else generalMap[name].colleague++;
      }

      // Academic
      if (s.academicSecretariat?.candidateName && s.academicSecretariat.nominationType !== 'لا يوجد ترشيح') {
        academicCount++;
        const name = s.academicSecretariat.candidateName.trim();
        if (!academicMap[name]) academicMap[name] = { count: 0, self: 0, colleague: 0 };
        academicMap[name].count++;
        if (s.academicSecretariat.nominationType === 'ترشيح نفسي') academicMap[name].self++;
        else academicMap[name].colleague++;
      }

      // Financial
      if (s.financialSecretariat?.candidateName && s.financialSecretariat.nominationType !== 'لا يوجد ترشيح') {
        financialCount++;
        const name = s.financialSecretariat.candidateName.trim();
        if (!financialMap[name]) financialMap[name] = { count: 0, self: 0, colleague: 0 };
        financialMap[name].count++;
        if (s.financialSecretariat.nominationType === 'ترشيح نفسي') financialMap[name].self++;
        else financialMap[name].colleague++;
      }

      // Social
      if (s.socialSecretariat?.candidateName && s.socialSecretariat.nominationType !== 'لا يوجد ترشيح') {
        socialCount++;
        const name = s.socialSecretariat.candidateName.trim();
        if (!socialMap[name]) socialMap[name] = { count: 0, self: 0, colleague: 0 };
        socialMap[name].count++;
        if (s.socialSecretariat.nominationType === 'ترشيح نفسي') socialMap[name].self++;
        else socialMap[name].colleague++;
      }
    });

    const toSortedArray = (map: Record<string, { count: number; self: number; colleague: number }>) =>
      Object.entries(map)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.count - a.count);

    return {
      total: submissions.length,
      generalCount,
      academicCount,
      financialCount,
      socialCount,
      evalRatingsCount,
      averageRating: evalRatingsCount > 0 ? (evalRatingsSum / evalRatingsCount).toFixed(1) : '—',
      generalAverage: generalEvalCount > 0 ? (generalEvalSum / generalEvalCount).toFixed(1) : '—',
      academicAverage: academicEvalCount > 0 ? (academicEvalSum / academicEvalCount).toFixed(1) : '—',
      financialAverage: financialEvalCount > 0 ? (financialEvalSum / financialEvalCount).toFixed(1) : '—',
      socialAverage: socialEvalCount > 0 ? (socialEvalSum / socialEvalCount).toFixed(1) : '—',
      ratingDistribution,
      positiveFeedbackList,
      improvementFeedbackList,
      leaderboards: {
        general: toSortedArray(generalMap),
        academic: toSortedArray(academicMap),
        financial: toSortedArray(financialMap),
        social: toSortedArray(socialMap),
      },
    };
  }, [submissions]);

  // Filtered submissions list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      const matchesSearch =
        s.nominatorFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.academicId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phoneNumber?.includes(searchQuery) ||
        s.generalSecretariat?.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.academicSecretariat?.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.financialSecretariat?.candidateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.socialSecretariat?.candidateName?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedSecretariat === 'general') {
        return s.generalSecretariat?.candidateName && s.generalSecretariat.nominationType !== 'لا يوجد ترشيح';
      }
      if (selectedSecretariat === 'academic') {
        return s.academicSecretariat?.candidateName && s.academicSecretariat.nominationType !== 'لا يوجد ترشيح';
      }
      if (selectedSecretariat === 'financial') {
        return s.financialSecretariat?.candidateName && s.financialSecretariat.nominationType !== 'لا يوجد ترشيح';
      }
      if (selectedSecretariat === 'social') {
        return s.socialSecretariat?.candidateName && s.socialSecretariat.nominationType !== 'لا يوجد ترشيح';
      }

      return true;
    });
  }, [submissions, searchQuery, selectedSecretariat]);

  // Export to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const rows = [MAIN_HEADERS, ...submissions.map(submissionToMainRow)];
    const csvContent =
      '\uFEFF' +
      rows
        .map((row) =>
          row
            .map((val) => `"${String(val || '').replace(/"/g, '""')}"`)
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سجل_ترشيحات_ELEX28_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Submissions */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-[11px] font-bold">إجمالي المشاركين</span>
            <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {stats.total}
          </div>
          <span className="text-[10px] text-slate-400">طالب في ELEX28</span>
        </div>

        {/* Previous Evaluation Average */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs">
          <div className="flex items-center justify-between text-amber-400 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300">التقييم العام للرابطة</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {stats.averageRating} <span className="text-xs text-slate-500 font-normal">/ 5</span>
          </div>
          <span className="text-[10px] text-slate-400">{stats.evalRatingsCount} استطلاع</span>
        </div>

        {/* General Secretariat */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs">
          <div className="flex items-center justify-between text-purple-400 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300">الأمانة العامة</span>
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Briefcase className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300 font-mono">
            {stats.generalCount}
          </div>
          <span className="text-[10px] text-slate-400">ترشيح للأمين العام</span>
        </div>

        {/* Academic Secretariat */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs">
          <div className="flex items-center justify-between text-blue-400 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300">الأمانة الأكاديمية</span>
            <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-300 font-mono">
            {stats.academicCount}
          </div>
          <span className="text-[10px] text-slate-400">ترشيح للأكاديمية</span>
        </div>

        {/* Financial Secretariat */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs">
          <div className="flex items-center justify-between text-amber-400 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300">أمين المال</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {stats.financialCount}
          </div>
          <span className="text-[10px] text-slate-400">ترشيح للمالية</span>
        </div>

        {/* Social Secretariat */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-teal-400 mb-1.5">
            <span className="text-[11px] font-bold text-slate-300">الأمانة الاجتماعية</span>
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-300 font-mono">
            {stats.socialCount}
          </div>
          <span className="text-[10px] text-slate-400">ترشيح للاجتماعية</span>
        </div>
      </div>

      {/* Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveView('charts')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'charts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>الرسوم البيانية وتوزيع الترشيحات (Recharts)</span>
        </button>

        <button
          onClick={() => setActiveView('nominations')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'nominations'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>لوحة صدارة المرشحين (Leaderboard)</span>
        </button>

        <button
          onClick={() => setActiveView('evaluation')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeView === 'evaluation'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <MessageSquareHeart className="w-3.5 h-3.5" />
          <span>نتائج استطلاع الرابطة السابقة لكل أمانة</span>
        </button>
      </div>

      {activeView === 'charts' ? (
        /* Recharts Visual Analytics */
        <SecretariatCharts stats={stats} />
      ) : activeView === 'evaluation' ? (
        /* Detailed Evaluation Insights for Each Secretariat */
        <div className="bg-slate-900/90 text-white rounded-3xl border border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                نتائج التقييم التفصيلي لأداء مكاتب الأمانات السابقة
              </h3>
              <p className="text-xs text-slate-400">
                متوسط التقييم بالنجوم وملاحظات طلاب دفعة ELEX28 لكل أمانة
              </p>
            </div>
            <div className="flex items-center gap-2 bg-amber-500/15 px-3.5 py-1.5 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>المتوسط الإجمالي: {stats.averageRating} / 5</span>
            </div>
          </div>

          {/* Cards for each Secretariat's Average Score */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/25">
              <div className="text-[11px] font-bold text-purple-300 mb-1">الأمانة العامة</div>
              <div className="text-xl font-black font-mono text-purple-400 flex items-center gap-1">
                {stats.generalAverage} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">من 5 نجوم</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/25">
              <div className="text-[11px] font-bold text-blue-300 mb-1">الأمانة الأكاديمية</div>
              <div className="text-xl font-black font-mono text-blue-400 flex items-center gap-1">
                {stats.academicAverage} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">من 5 نجوم</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/25">
              <div className="text-[11px] font-bold text-amber-300 mb-1">الأمانة المالية</div>
              <div className="text-xl font-black font-mono text-amber-400 flex items-center gap-1">
                {stats.financialAverage} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">من 5 نجوم</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/25">
              <div className="text-[11px] font-bold text-teal-300 mb-1">الأمانة الاجتماعية</div>
              <div className="text-xl font-black font-mono text-teal-400 flex items-center gap-1">
                {stats.socialAverage} <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <span className="text-[10px] text-slate-500">من 5 نجوم</span>
            </div>
          </div>

          {/* Qualitative Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 pb-2 border-b border-slate-800">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span>أبرز الإيجابيات والمكتسبات ({stats.positiveFeedbackList.length}):</span>
              </div>
              {stats.positiveFeedbackList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">لا توجد ملاحظات مسجلة بعد</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {stats.positiveFeedbackList.map((f, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <p className="leading-relaxed text-slate-200">"{f.text}"</p>
                      <span className="text-[10px] text-emerald-400 font-semibold block">— {f.nominator}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300 pb-2 border-b border-slate-800">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>توصيات التطوير للرابطة القادمة ({stats.improvementFeedbackList.length}):</span>
              </div>
              {stats.improvementFeedbackList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">لا توجد ملاحظات مسجلة بعد</p>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {stats.improvementFeedbackList.map((f, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <p className="leading-relaxed text-slate-200">"{f.text}"</p>
                      <span className="text-[10px] text-rose-400 font-semibold block">— {f.nominator}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Secretariats Leaderboard */
        <div className="bg-slate-900/90 text-white rounded-3xl border border-slate-800 p-5 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  لوحة المرشحين وتكرار الترشيحات في دفعة ELEX28
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                حصر مباشر لجميع الأسماء الموصى بها في كل أمانة وعدد مرات ترشيحهم
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {/* General */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/25">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-3 pb-2 border-b border-slate-800">
                <Briefcase className="w-4 h-4 text-purple-400" />
                <span>الأمانة العامة</span>
              </div>
              {stats.leaderboards.general.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد ترشيحات بعد</p>
              ) : (
                <div className="space-y-2">
                  {stats.leaderboards.general.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200 truncate max-w-[120px]" title={c.name}>
                        {c.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px]">
                        {c.count} ترشيح
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Academic */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-blue-500/25">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-300 mb-3 pb-2 border-b border-slate-800">
                <GraduationCap className="w-4 h-4 text-blue-400" />
                <span>الأمانة الأكاديمية</span>
              </div>
              {stats.leaderboards.academic.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد ترشيحات بعد</p>
              ) : (
                <div className="space-y-2">
                  {stats.leaderboards.academic.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200 truncate max-w-[120px]" title={c.name}>
                        {c.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-[11px]">
                        {c.count} ترشيح
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Financial */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/25">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-3 pb-2 border-b border-slate-800">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>أمين المال</span>
              </div>
              {stats.leaderboards.financial.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد ترشيحات بعد</p>
              ) : (
                <div className="space-y-2">
                  {stats.leaderboards.financial.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200 truncate max-w-[120px]" title={c.name}>
                        {c.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-[11px]">
                        {c.count} ترشيح
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/25">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-3 pb-2 border-b border-slate-800">
                <HeartHandshake className="w-4 h-4 text-teal-400" />
                <span>الأمانة الاجتماعية</span>
              </div>
              {stats.leaderboards.social.length === 0 ? (
                <p className="text-xs text-slate-500 py-3 text-center">لا توجد ترشيحات بعد</p>
              ) : (
                <div className="space-y-2">
                  {stats.leaderboards.social.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200 truncate max-w-[120px]" title={c.name}>
                        {c.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono font-bold text-[11px]">
                        {c.count} ترشيح
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submissions Detailed Table */}
      <div className="bg-slate-900/90 text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              سجل استجابات واستمارات ELEX28
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              عرض تفصيلي لكافة البيانات المدخلة وتفاصيل الترشيحات
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="بحث بالاسم أو الرقم الجامعي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 pl-3 py-1.5 text-xs rounded-xl border border-slate-800 bg-slate-950 text-slate-200 outline-none w-44 sm:w-56 focus:border-emerald-500"
              />
            </div>

            {/* Secretariat Filter */}
            <select
              value={selectedSecretariat}
              onChange={(e) => setSelectedSecretariat(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-800 bg-slate-950 text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">كافة الأمانات</option>
              <option value="general">الأمانة العامة</option>
              <option value="academic">الأمانة الأكاديمية</option>
              <option value="financial">الأمانة المالية</option>
              <option value="social">الأمانة الاجتماعية</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              disabled={submissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تصدير CSV</span>
            </button>

            {sheetConfig?.spreadsheetUrl && (
              <a
                href={sheetConfig.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Google Sheet</span>
              </a>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">مقدّم الطلب</th>
                <th className="px-4 py-3 whitespace-nowrap">الرقم الجامعي</th>
                <th className="px-4 py-3 whitespace-nowrap">تقييم الرابطة</th>
                <th className="px-4 py-3 whitespace-nowrap">الأمانة العامة</th>
                <th className="px-4 py-3 whitespace-nowrap">الأمانة الأكاديمية</th>
                <th className="px-4 py-3 whitespace-nowrap">أمين المال</th>
                <th className="px-4 py-3 whitespace-nowrap">الأمانة الاجتماعية</th>
                <th className="px-4 py-3 whitespace-nowrap">التوقيت</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">التفاصيل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-slate-500">
                    لا توجد ردود مطابقة للبحث المختار
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, idx) => (
                  <tr key={sub.responseId || sub.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-bold text-white">
                      {sub.nominatorFullName || '—'}
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-400">
                      {sub.academicId || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {sub.previousEvaluation?.overallRating ? (
                        <span className="inline-flex items-center gap-1 font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                          {sub.previousEvaluation.overallRating} <Star className="w-3 h-3 fill-amber-400" />
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-purple-300">
                      {sub.generalSecretariat?.candidateName || '—'}
                    </td>
                    <td className="px-4 py-3 text-blue-300">
                      {sub.academicSecretariat?.candidateName || '—'}
                    </td>
                    <td className="px-4 py-3 text-amber-300">
                      {sub.financialSecretariat?.candidateName || '—'}
                    </td>
                    <td className="px-4 py-3 text-teal-300">
                      {sub.socialSecretariat?.candidateName || '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(sub.timestamp).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-2.5 py-1 rounded-lg text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 font-bold transition-colors cursor-pointer"
                      >
                        عرض
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-right max-h-[90vh] overflow-y-auto border border-emerald-500/30 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base sm:text-lg font-black text-white">تفاصيل استمارة الترشيح</h4>
                <p className="text-xs text-slate-400">التسجيل: {new Date(selectedSubmission.timestamp).toLocaleString('ar-EG')}</p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
              >
                ✕ إغلاق
              </button>
            </div>

            {/* Voter Details */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500 block">الاسم:</span>
                  <span className="font-bold text-white">{selectedSubmission.nominatorFullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">الرقم الجامعي:</span>
                  <span className="font-mono text-emerald-400">{selectedSubmission.academicId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">الهاتف / واتساب:</span>
                  <span className="font-mono text-slate-300" dir="ltr">{selectedSubmission.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Previous Evaluation Details */}
            {selectedSubmission.previousEvaluation && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-300 border-b border-slate-800 pb-1.5">
                  <span>تقييم أداء الرابطة السابقة:</span>
                  <span>التقييم الإجمالي: {selectedSubmission.previousEvaluation.overallRating || '—'} / 5 ⭐</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 pt-1">
                  <div>العامة: {selectedSubmission.previousEvaluation.generalSecretariatEval?.rating || '—'} / 5</div>
                  <div>الأكاديمية: {selectedSubmission.previousEvaluation.academicSecretariatEval?.rating || '—'} / 5</div>
                  <div>المالية: {selectedSubmission.previousEvaluation.financialSecretariatEval?.rating || '—'} / 5</div>
                  <div>الاجتماعية: {selectedSubmission.previousEvaluation.socialSecretariatEval?.rating || '—'} / 5</div>
                </div>
                {selectedSubmission.previousEvaluation.positivePoints && (
                  <p className="text-slate-300 pt-1">
                    <strong className="text-emerald-400">الإيجابيات: </strong>{selectedSubmission.previousEvaluation.positivePoints}
                  </p>
                )}
                {selectedSubmission.previousEvaluation.improvementPoints && (
                  <p className="text-slate-300">
                    <strong className="text-rose-400">التوصيات: </strong>{selectedSubmission.previousEvaluation.improvementPoints}
                  </p>
                )}
              </div>
            )}

            {/* Secretariat Nominations */}
            <div className="space-y-3 text-xs">
              <h5 className="font-bold text-white">ترشيحات الأمانات:</h5>
              <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/20">
                <span className="font-bold text-purple-300 block">الأمانة العامة: {selectedSubmission.generalSecretariat.nominationType}</span>
                {selectedSubmission.generalSecretariat.candidateName && <p className="text-white mt-1">المرشح: {selectedSubmission.generalSecretariat.candidateName}</p>}
                {selectedSubmission.generalSecretariat.reasonsAndQualifications && <p className="text-slate-400 mt-0.5">المبررات: {selectedSubmission.generalSecretariat.reasonsAndQualifications}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/20">
                <span className="font-bold text-blue-300 block">الأمانة الأكاديمية: {selectedSubmission.academicSecretariat.nominationType}</span>
                {selectedSubmission.academicSecretariat.candidateName && <p className="text-white mt-1">المرشح: {selectedSubmission.academicSecretariat.candidateName}</p>}
                {selectedSubmission.academicSecretariat.reasonsAndQualifications && <p className="text-slate-400 mt-0.5">المبررات: {selectedSubmission.academicSecretariat.reasonsAndQualifications}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20">
                <span className="font-bold text-amber-300 block">أمين المال: {selectedSubmission.financialSecretariat.nominationType}</span>
                {selectedSubmission.financialSecretariat.candidateName && <p className="text-white mt-1">المرشح: {selectedSubmission.financialSecretariat.candidateName}</p>}
                {selectedSubmission.financialSecretariat.reasonsAndQualifications && <p className="text-slate-400 mt-0.5">المبررات: {selectedSubmission.financialSecretariat.reasonsAndQualifications}</p>}
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-teal-500/20">
                <span className="font-bold text-teal-300 block">الأمانة الاجتماعية: {selectedSubmission.socialSecretariat.nominationType}</span>
                {selectedSubmission.socialSecretariat.candidateName && <p className="text-white mt-1">المرشح: {selectedSubmission.socialSecretariat.candidateName}</p>}
                {selectedSubmission.socialSecretariat.reasonsAndQualifications && <p className="text-slate-400 mt-0.5">المبررات: {selectedSubmission.socialSecretariat.reasonsAndQualifications}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

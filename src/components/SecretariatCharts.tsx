import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieChartIcon,
  Briefcase,
  GraduationCap,
  DollarSign,
  HeartHandshake,
  Activity,
  Layers,
} from 'lucide-react';

interface CandidateData {
  name: string;
  count: number;
  self: number;
  colleague: number;
}

interface SecretariatChartsProps {
  stats: {
    total: number;
    generalCount: number;
    academicCount: number;
    financialCount: number;
    socialCount: number;
    generalAverage: string;
    academicAverage: string;
    financialAverage: string;
    socialAverage: string;
    averageRating: string;
    leaderboards: {
      general: CandidateData[];
      academic: CandidateData[];
      financial: CandidateData[];
      social: CandidateData[];
    };
  };
}

const COLORS = {
  general: '#f38035', // ELEX circuit orange
  academic: '#67B8DE', // ELEX electronic cyan
  financial: '#ff9d5c', // ELEX warm copper amber
  social: '#38bdf8', // ELEX bright sky blue
  self: '#f38035', // ELEX circuit orange
  colleague: '#67B8DE', // ELEX electronic cyan
};

// Custom Tooltip for dark tech theme
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 shadow-2xl text-right text-xs space-y-1">
        <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-3 text-slate-300">
            <span style={{ color: item.color || item.fill }} className="font-semibold">
              {item.name}:
            </span>
            <span className="font-mono font-bold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SecretariatCharts: React.FC<SecretariatChartsProps> = ({ stats }) => {
  const [activeSecretariatTab, setActiveSecretariatTab] = useState<
    'overview' | 'general' | 'academic' | 'financial' | 'social'
  >('overview');

  // Distribution across the 4 secretariats
  const distributionData = [
    {
      name: 'الأمانة العامة',
      shortName: 'العامة',
      total: stats.generalCount,
      'ترشيح نفسي': stats.leaderboards.general.reduce((acc, c) => acc + c.self, 0),
      'ترشيح زميل': stats.leaderboards.general.reduce((acc, c) => acc + c.colleague, 0),
      color: COLORS.general,
    },
    {
      name: 'الأمانة الأكاديمية',
      shortName: 'الأكاديمية',
      total: stats.academicCount,
      'ترشيح نفسي': stats.leaderboards.academic.reduce((acc, c) => acc + c.self, 0),
      'ترشيح زميل': stats.leaderboards.academic.reduce((acc, c) => acc + c.colleague, 0),
      color: COLORS.academic,
    },
    {
      name: 'الأمانة المالية',
      shortName: 'المالية',
      total: stats.financialCount,
      'ترشيح نفسي': stats.leaderboards.financial.reduce((acc, c) => acc + c.self, 0),
      'ترشيح زميل': stats.leaderboards.financial.reduce((acc, c) => acc + c.colleague, 0),
      color: COLORS.financial,
    },
    {
      name: 'الأمانة الاجتماعية',
      shortName: 'الاجتماعية',
      total: stats.socialCount,
      'ترشيح نفسي': stats.leaderboards.social.reduce((acc, c) => acc + c.self, 0),
      'ترشيح زميل': stats.leaderboards.social.reduce((acc, c) => acc + c.colleague, 0),
      color: COLORS.social,
    },
  ];

  // Pie chart data
  const pieData = distributionData
    .filter((d) => d.total > 0)
    .map((d) => ({
      name: d.name,
      value: d.total,
      color: d.color,
    }));

  // Radar evaluation data
  const radarData = [
    {
      secretariat: 'الأمانة العامة',
      'التقييم (من 5)': parseFloat(stats.generalAverage) || 0,
      fullMark: 5,
    },
    {
      secretariat: 'الأكاديمية',
      'التقييم (من 5)': parseFloat(stats.academicAverage) || 0,
      fullMark: 5,
    },
    {
      secretariat: 'المالية',
      'التقييم (من 5)': parseFloat(stats.financialAverage) || 0,
      fullMark: 5,
    },
    {
      secretariat: 'الاجتماعية',
      'التقييم (من 5)': parseFloat(stats.socialAverage) || 0,
      fullMark: 5,
    },
  ];

  const totalNominations =
    stats.generalCount + stats.academicCount + stats.financialCount + stats.socialCount;

  // Render top candidates bar chart for a secretariat
  const renderCandidateChart = (
    candidates: CandidateData[],
    title: string,
    color: string,
    icon: React.ReactNode
  ) => {
    const topCandidates = candidates.slice(0, 6).map((c) => ({
      name: c.name,
      'ترشيح نفسي': c.self,
      'ترشيح زميل': c.colleague,
      'إجمالي الترشيحات': c.count,
    }));

    if (topCandidates.length === 0) {
      return (
        <div className="p-8 text-center text-slate-500 bg-slate-950/60 rounded-2xl border border-slate-800">
          لا توجد ترشيحات مسجلة لهذه الأمانة حتى الآن
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-sm font-bold text-white">{title} - ترتيب المرشحين</h4>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {candidates.length} مرشحاً
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topCandidates}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#e2e8f0', fontSize: 11 }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                formatter={(value) => <span className="text-slate-300">{value}</span>}
              />
              <Bar dataKey="ترشيح نفسي" stackId="a" fill={COLORS.self} radius={[0, 0, 0, 0]} />
              <Bar dataKey="ترشيح زميل" stackId="a" fill={color} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 text-white rounded-3xl border border-slate-800 p-5 sm:p-8 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">
              التحليل البياني وتوزيع الترشيحات (Recharts Analytics)
            </h3>
            <p className="text-xs text-slate-400">
              مخططات بصرية دقيقة توضح حجم التفاعل وتوزيع المرشحين ونوع الترشيح في كل أمانة
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSecretariatTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSecretariatTab === 'overview'
                ? 'bg-gradient-to-r from-[#f38035] to-[#ff9d5c] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveSecretariatTab('general')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSecretariatTab === 'general'
                ? 'bg-[#f38035] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            العامة
          </button>
          <button
            onClick={() => setActiveSecretariatTab('academic')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSecretariatTab === 'academic'
                ? 'bg-[#67B8DE] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الأكاديمية
          </button>
          <button
            onClick={() => setActiveSecretariatTab('financial')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSecretariatTab === 'financial'
                ? 'bg-[#ff9d5c] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            المالية
          </button>
          <button
            onClick={() => setActiveSecretariatTab('social')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeSecretariatTab === 'social'
                ? 'bg-[#38bdf8] text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الاجتماعية
          </button>
        </div>
      </div>

      {/* Overview Mode: Distribution Bar + Donut Pie + Radar */}
      {activeSecretariatTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Bar Chart: Self vs Colleague nominations per secretariat */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">
                    حجم ونوع الترشيحات لكل أمانة (ترشيح نفسي مقابل زميل)
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {totalNominations} ترشيحاً
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={distributionData}
                    margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="shortName"
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: '#94a3b8', fontSize: 11 }}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                      formatter={(value) => <span className="text-slate-300">{value}</span>}
                    />
                    <Bar
                      dataKey="ترشيح نفسي"
                      fill={COLORS.self}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="ترشيح زميل"
                      fill={COLORS.colleague}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. Donut Pie Chart: Share of Nominations */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-teal-400" />
                <h4 className="text-sm font-bold text-white">النسب المئوية لحصص الأمانات</h4>
              </div>

              <div className="h-60 w-full relative">
                {pieData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-500">
                    لا توجد بيانات كافية
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
                {/* Center total */}
                {pieData.length > 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-black font-mono text-white">
                      {totalNominations}
                    </span>
                    <span className="text-[10px] text-slate-400">إجمالي</span>
                  </div>
                )}
              </div>

              {/* Legend Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800/80">
                {distributionData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-slate-300 truncate">{item.shortName}:</span>
                    <span className="font-mono font-bold text-white">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Radar Chart: Association Evaluation Overview */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">
                  المخطط الراداري لمستويات تقييم الرابطة السابقة (من 5 درجات)
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-400">
                المتوسط الإجمالي: {stats.averageRating} / 5 ⭐
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="secretariat"
                    tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 5]}
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Radar
                    name="التقييم"
                    dataKey="التقييم (من 5)"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.4}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Specific Secretariat Tabs: Highlighting individual candidate counts visually */}
      {activeSecretariatTab === 'general' && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-[#f38035]/40">
          {renderCandidateChart(
            stats.leaderboards.general,
            'الأمانة العامة (منصب الأمين العام)',
            COLORS.general,
            <Briefcase className="w-5 h-5 text-[#f38035]" />
          )}
        </div>
      )}

      {activeSecretariatTab === 'academic' && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-[#67B8DE]/40">
          {renderCandidateChart(
            stats.leaderboards.academic,
            'الأمانة الأكاديمية',
            COLORS.academic,
            <GraduationCap className="w-5 h-5 text-[#67B8DE]" />
          )}
        </div>
      )}

      {activeSecretariatTab === 'financial' && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-[#ff9d5c]/40">
          {renderCandidateChart(
            stats.leaderboards.financial,
            'الأمانة المالية (أمين المال)',
            COLORS.financial,
            <DollarSign className="w-5 h-5 text-[#ff9d5c]" />
          )}
        </div>
      )}

      {activeSecretariatTab === 'social' && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-[#38bdf8]/40">
          {renderCandidateChart(
            stats.leaderboards.social,
            'الأمانة الاجتماعية',
            COLORS.social,
            <HeartHandshake className="w-5 h-5 text-[#38bdf8]" />
          )}
        </div>
      )}
    </div>
  );
};

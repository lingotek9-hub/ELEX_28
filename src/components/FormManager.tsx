import React, { useState } from 'react';
import {
  FileText,
  TableProperties,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Link as LinkIcon,
  Layers,
  ArrowUpRight,
  Clock,
  PlayCircle,
  HelpCircle,
  Code2,
} from 'lucide-react';
import { GoogleFormConfig, GoogleSheetConfig } from '../types/nomination';

interface FormManagerProps {
  formConfig: GoogleFormConfig | null;
  sheetConfig: GoogleSheetConfig | null;
  onCreateAll: () => Promise<void>;
  onSyncNow: () => Promise<void>;
  isCreating: boolean;
  isSyncing: boolean;
  autoSyncEnabled: boolean;
  onToggleAutoSync: (enabled: boolean) => void;
  lastSyncTime: string | null;
  totalSubmissionsCount: number;
}

export const FormManager: React.FC<FormManagerProps> = ({
  formConfig,
  sheetConfig,
  onCreateAll,
  onSyncNow,
  isCreating,
  isSyncing,
  autoSyncEnabled,
  onToggleAutoSync,
  lastSyncTime,
  totalSubmissionsCount,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showAppsScriptModal, setShowAppsScriptModal] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const isConfigured = !!(formConfig && sheetConfig);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Top Banner / Call to Action if not configured */}
      {!isConfigured ? (
        <div className="text-center py-6">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-700 mb-4">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            جاهز لإنشاء استمارة الدفعة وجدول البيانات بضغطة واحدة؟
          </h3>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
            سيقوم النظام بإنشاء نموذج Google Form احترافي بكافة أسئلة الأمانات الأربعة وبيانات مقدّم الطلب،
            وإنشاء جدول Google Sheet باسم <strong className="text-slate-800">"سجل ترشيحات أمانات الدفعة"</strong> مع
            تنسيق الأعمدة والصفحات المنفصلة لكل أمانة.
          </p>

          <button
            onClick={onCreateAll}
            disabled={isCreating}
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isCreating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري إنشاء الاستمارة وربط الشيت...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>إنشاء استمارة Google Form وجدول Google Sheets الآن</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div>
          {/* Header bar with Status & Sync */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-lg font-bold text-slate-900">
                  حالة التكامل والربط الفعّال
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                الاستمارة وجدول البيانات متصلان ومتاحان في حساب Google الخاص بك
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onSyncNow}
                disabled={isSyncing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة الردود الآن'}</span>
              </button>

              <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSyncEnabled}
                  onChange={(e) => onToggleAutoSync(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                />
                <span>مزامنة تلقائية (كل 30 ثانية)</span>
              </label>

              <button
                onClick={() => setShowAppsScriptModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
                title="كود الربط الفوري المباشر عبر Apps Script"
              >
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>ربط فوري (Apps Script)</span>
              </button>
            </div>
          </div>

          {/* Cards for Google Form & Google Sheets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {/* Google Form Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-white border border-purple-200/70 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-purple-600 text-white shadow-sm shadow-purple-600/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700">
                      نموذج الاستمارة الرسمي
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      {formConfig.title}
                    </h4>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                {formConfig.description}
              </p>

              {/* Responder URL Box (For sharing with students) */}
              <div className="p-3 bg-white rounded-xl border border-purple-100 mb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-700">رابط تعبئة الاستمارة للطلاب:</span>
                  {copiedLink === 'responder' ? (
                    <span className="text-emerald-600 flex items-center gap-1 text-[11px] font-bold">
                      <Check className="w-3 h-3" /> تم النسخ!
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={formConfig.responderUri}
                    className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 select-all"
                  />
                  <button
                    onClick={() => copyToClipboard(formConfig.responderUri, 'responder')}
                    className="p-1.5 text-purple-700 hover:bg-purple-50 rounded border border-purple-200 shrink-0 transition-colors"
                    title="نسخ الرابط"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-purple-100/70">
                <a
                  href={formConfig.responderUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  <PlayCircle className="w-3.5 h-3.5" />
                  <span>تعبئة الاستمارة</span>
                </a>
                <a
                  href={formConfig.editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-purple-800 bg-purple-100 hover:bg-purple-200 transition-colors"
                >
                  <span>تعديل النموذج</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Google Sheet Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border border-emerald-200/70 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
                    <TableProperties className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                      جدول البيانات المتصل
                    </span>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      {sheetConfig.title}
                    </h4>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 text-[11px] font-semibold">
                  جميع الردود
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  الأمانة العامة
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  الأمانة الأكاديمية
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  الأمانة المالية
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  الأمانة الاجتماعية
                </span>
              </div>

              {/* Status bar */}
              <div className="p-3 bg-white rounded-xl border border-emerald-100 mb-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>إجمالي الردود المسجلة:</span>
                  </span>
                  <span className="font-bold text-slate-900">{totalSubmissionsCount} رد</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>آخر مزامنة:</span>
                  </span>
                  <span>{lastSyncTime ? new Date(lastSyncTime).toLocaleTimeString('ar-EG') : 'منذ لحظات'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-emerald-100/70">
                <a
                  href={sheetConfig.spreadsheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                >
                  <TableProperties className="w-3.5 h-3.5" />
                  <span>فتح في Google Sheets</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => copyToClipboard(sheetConfig.spreadsheetUrl, 'sheet')}
                  className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors"
                  title="نسخ رابط الشيت"
                >
                  {copiedLink === 'sheet' ? (
                    <span className="text-emerald-700 font-bold">تم النسخ</span>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الرابط</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apps Script Helper Modal */}
      {showAppsScriptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-right max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                <h4 className="text-lg font-bold text-slate-900">
                  ربط الاستمارة بالشيت تلقائياً عبر Google Apps Script
                </h4>
              </div>
              <button
                onClick={() => setShowAppsScriptModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕ إغلاق
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              يقوم هذا التطبيق بالفعل بمزامنة الاستمارة مع الشيت تلقائياً. إذا رغبت أيضاً في تفعيل الإرسال اللحظي
              (On Form Submit Trigger) داخل حسابك على Google، يمكنك فتح الاستمارة في Google Forms ثم النقر على
              <strong> (الثلاث نقاط) &gt; محرر النصوص البرمجية (Script editor)</strong> ولصق الكود التالي:
            </p>

            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto text-left ltr mb-4">
{`function onFormSubmit(e) {
  var spreadsheetId = "${sheetConfig?.spreadsheetId || 'SPREADSHEET_ID'}";
  var ss = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName("جميع الردود والترشيحات");
  
  var itemResponses = e.response.getItemResponses();
  var row = [new Date()];
  
  for (var i = 0; i < itemResponses.length; i++) {
    row.push(itemResponses[i].getResponse());
  }
  row.push(e.response.getId());
  sheet.appendRow(row);
}`}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAppsScriptModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                فهمت ذلك
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

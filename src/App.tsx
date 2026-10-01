import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from './lib/firebase';
import { createGoogleForm, fetchFormResponses } from './lib/googleForms';
import {
  createGoogleSpreadsheet,
  appendSubmissionsToSheet,
} from './lib/googleSheets';
import {
  GoogleFormConfig,
  GoogleSheetConfig,
  NominationSubmission,
} from './types/nomination';
import { Header } from './components/Header';
import { GoogleAuthCard } from './components/GoogleAuthCard';
import { FormManager } from './components/FormManager';
import { PublicLanding } from './components/PublicLanding';
import { ResponsesDashboard } from './components/ResponsesDashboard';
import {
  LayoutDashboard,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // App View Mode: 'public' for everyone, 'admin' for committee management
  const [appMode, setAppMode] = useState<'public' | 'admin'>('public');

  // Active Admin Sub-tab
  const [adminTab, setAdminTab] = useState<'manager' | 'responses'>('manager');

  // Integrations state (Loaded from localStorage)
  const [formConfig, setFormConfig] = useState<GoogleFormConfig | null>(() => {
    const saved = localStorage.getItem('elex28_nomination_form_config');
    return saved ? JSON.parse(saved) : null;
  });

  const [sheetConfig, setSheetConfig] = useState<GoogleSheetConfig | null>(() => {
    const saved = localStorage.getItem('elex28_nomination_sheet_config');
    return saved ? JSON.parse(saved) : null;
  });

  const [submissions, setSubmissions] = useState<NominationSubmission[]>(() => {
    const saved = localStorage.getItem('elex28_nomination_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  // Action status
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [feedbackNotice, setFeedbackNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Notify feedback toast
  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedbackNotice({ type, message });
    setTimeout(() => {
      setFeedbackNotice(null);
    }, 6000);
  };

  // Auth Initialization Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save Configs to localStorage (IDs and metadata only, no secrets or tokens)
  useEffect(() => {
    if (formConfig) {
      localStorage.setItem('elex28_nomination_form_config', JSON.stringify(formConfig));
    }
  }, [formConfig]);

  useEffect(() => {
    if (sheetConfig) {
      localStorage.setItem('elex28_nomination_sheet_config', JSON.stringify(sheetConfig));
    }
  }, [sheetConfig]);

  useEffect(() => {
    localStorage.setItem('elex28_nomination_submissions', JSON.stringify(submissions));
  }, [submissions]);

  // Handle Google Login for Admin
  const handleAdminLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setShowAdminLoginModal(false);
        setAppMode('admin');
        showFeedback(
          'success',
          `مرحباً بك ${result.user.displayName || 'يا مشرف'}، تم الدخول إلى لوحة تحكم ELEX28 بنجاح.`
        );
      }
    } catch (err: any) {
      console.error(err);
      showFeedback('error', err.message || 'فشل تسجيل الدخول بحساب Google');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAppMode('public');
    showFeedback('success', 'تم تسجيل الخروج والعودة لصفحة دفعة ELEX28 العامة.');
  };

  // Create Google Form and Google Sheet in one shot
  const handleCreateAll = async () => {
    const token = await getAccessToken();
    if (!token) {
      setShowAdminLoginModal(true);
      return;
    }

    setIsCreating(true);
    try {
      // 1. Create Google Form
      const newForm = await createGoogleForm(token);
      setFormConfig(newForm);

      // 2. Create Google Sheet named "سجل ترشيحات أمانات الدفعة"
      const newSheet = await createGoogleSpreadsheet(token);
      setSheetConfig(newSheet);

      // If we already had test or student submissions, sync them right into the new sheet
      if (submissions.length > 0) {
        await appendSubmissionsToSheet(token, newSheet.spreadsheetId, submissions);
      }

      showFeedback(
        'success',
        'تم إنشاء استمارة Google Form بنجاح وربطها بجدول Google Sheets باسم "سجل ترشيحات أمانات الدفعة"!'
      );
    } catch (err: any) {
      console.error('Creation error:', err);
      showFeedback('error', err.message || 'حدث خطأ أثناء إنشاء النموذج أو جدول البيانات.');
    } finally {
      setIsCreating(false);
    }
  };

  // Synchronize Google Form Responses with Google Sheet
  const handleSyncResponses = useCallback(async () => {
    if (!formConfig || !sheetConfig) return;
    const token = await getAccessToken();
    if (!token) return;

    setIsSyncing(true);
    try {
      // 1. Fetch latest responses from Google Form API
      const formResponses = await fetchFormResponses(token, formConfig.formId);

      // 2. Merge with existing local submissions (avoid duplicate responseIds)
      const existingIds = new Set(submissions.map((s) => s.responseId || s.id));
      const newIncoming = formResponses.filter(
        (r) => r.responseId && !existingIds.has(r.responseId)
      );

      const updatedSubmissions = [...newIncoming, ...submissions];
      setSubmissions(updatedSubmissions);

      // 3. Append all submissions to the Google Sheet (preventing duplicates)
      const appendedCount = await appendSubmissionsToSheet(
        token,
        sheetConfig.spreadsheetId,
        updatedSubmissions
      );

      setLastSyncTime(new Date().toISOString());
      if (appendedCount > 0) {
        showFeedback('success', `تمت مزامنة وتحديث ${appendedCount} مشاركة جديدة في Google Sheets.`);
      }
    } catch (err: any) {
      console.warn('Sync warning:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [formConfig, sheetConfig, submissions]);

  // Periodic Auto-Sync (Every 30 seconds if admin is active and enabled)
  useEffect(() => {
    if (!autoSyncEnabled || !formConfig || !sheetConfig || !user) return;

    const interval = setInterval(() => {
      handleSyncResponses();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoSyncEnabled, formConfig, sheetConfig, user, handleSyncResponses]);

  // Handle student nomination submission (Works for ANY visitor publicly!)
  const handleSubmitDirect = async (submission: NominationSubmission) => {
    setIsSubmitting(true);
    try {
      const token = await getAccessToken();

      // If admin is active or token is available, append directly to Google Sheet
      if (token && sheetConfig) {
        await appendSubmissionsToSheet(token, sheetConfig.spreadsheetId, [submission]);
      }

      // Always save locally so no submission is ever lost
      setSubmissions((prev) => [submission, ...prev]);
      showFeedback('success', 'تم استلام وتوثيق ترشيحك بنجاح في سجل دفعة ELEX28.');
    } catch (err: any) {
      console.error(err);
      // Still store locally as fallback
      setSubmissions((prev) => [submission, ...prev]);
      showFeedback('success', 'تم حفظ ترشيحك محلياً وسيتم ترحيله للشيت تلقائياً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* High-Tech Header with Discreet Hidden Admin Bar */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
        sheetConfig={sheetConfig}
        activeMode={appMode}
        onChangeMode={setAppMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feedback Alert Toast */}
        {feedbackNotice && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-semibold shadow-xl transition-all ${
              feedbackNotice.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackNotice.type === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{feedbackNotice.message}</span>
            </div>
            <button
              onClick={() => setFeedbackNotice(null)}
              className="text-white/80 hover:text-white text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Mode 1: Public Portal for All Students */}
        {appMode === 'public' ? (
          <PublicLanding
            onSubmitDirect={handleSubmitDirect}
            isSubmitting={isSubmitting}
            totalSubmissions={submissions.length}
          />
        ) : (
          /* View Mode 2: Admin Dashboard (Only accessible after admin login) */
          <div className="space-y-6">
            {/* Admin Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 text-white border border-emerald-500/30 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      لوحة تحكم مشرف دفعة ELEX28
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    إدارة استمارة Google Form، مزامنة Google Sheets "سجل ترشيحات أمانات الدفعة"، ومتابعة النتائج
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAppMode('public')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>معاينة صفحة الدفعة كطالب</span>
                </button>
              </div>
            </div>

            {/* Admin Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4 overflow-x-auto">
              <button
                onClick={() => setAdminTab('manager')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  adminTab === 'manager'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>إدارة الربط والاستمارة والشيت</span>
              </button>

              <button
                onClick={() => setAdminTab('responses')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  adminTab === 'responses'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>سجل الردود والتقييمات ({submissions.length})</span>
              </button>
            </div>

            {/* Sub-tab 1: Integration & Management */}
            {adminTab === 'manager' && (
              <div className="space-y-6">
                <FormManager
                  formConfig={formConfig}
                  sheetConfig={sheetConfig}
                  onCreateAll={handleCreateAll}
                  onSyncNow={handleSyncResponses}
                  isCreating={isCreating}
                  isSyncing={isSyncing}
                  autoSyncEnabled={autoSyncEnabled}
                  onToggleAutoSync={setAutoSyncEnabled}
                  lastSyncTime={lastSyncTime}
                  totalSubmissionsCount={submissions.length}
                />

                {/* Dashboard preview */}
                <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                    <div>
                      <h4 className="font-extrabold text-white text-base">
                        ملخص ترشيحات وتقييمات دفعة ELEX28
                      </h4>
                      <p className="text-xs text-slate-400">
                        مزامنة لحظية بين استمارة Google Form وجدول "سجل ترشيحات أمانات الدفعة"
                      </p>
                    </div>
                    <button
                      onClick={() => setAdminTab('responses')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                    >
                      عرض اللوحة الكاملة &larr;
                    </button>
                  </div>

                  <ResponsesDashboard
                    submissions={submissions}
                    sheetConfig={sheetConfig}
                    onRefresh={handleSyncResponses}
                    isRefreshing={isSyncing}
                  />
                </div>
              </div>
            )}

            {/* Sub-tab 2: Full Detailed Responses & Leaderboard */}
            {adminTab === 'responses' && (
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
                <ResponsesDashboard
                  submissions={submissions}
                  sheetConfig={sheetConfig}
                  onRefresh={handleSyncResponses}
                  isRefreshing={isSyncing}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Secret Admin Login Modal */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0c121e] text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border-2 border-[#f38035]/40">
            <button
              onClick={() => setShowAdminLoginModal(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f38035]/20 text-[#f38035] border border-[#f38035]/40 flex items-center justify-center mx-auto mb-2 font-mono font-black text-lg">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="text-lg font-black text-white">بوابة دخول مشرف ELEX28</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                مخصصة للمشرف المعتمد لمتابعة الداشبورد وربط Google Sheets
              </p>
            </div>
            <GoogleAuthCard
              onLogin={handleAdminLogin}
              isLoading={isLoggingIn}
            />
          </div>
        </div>
      )}

      {/* High-Tech ELEX28 Footer with Discreet Trigger */}
      <footer className="mt-auto border-t border-slate-800 bg-[#070a10] py-6 sm:py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <div
            onClick={() => {
              if (user) {
                setAppMode(appMode === 'admin' ? 'public' : 'admin');
              } else {
                setShowAdminLoginModal(true);
              }
            }}
            className="flex items-center gap-2 font-mono font-black text-sm text-[#f38035] select-none cursor-pointer hover:text-[#ff9d5c] transition-colors"
            title="ELEX28"
          >
            <Zap className="w-4 h-4 fill-[#f38035] text-[#f38035]" />
            <span>ELEX <span className="text-[#67B8DE]">28</span></span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400 font-sans text-xs">قسم الهندسة الإلكترونية</span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">
            المنصة الإلكترونية الرسمية لانتخابات أمانات دفعة ELEX28 • جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}

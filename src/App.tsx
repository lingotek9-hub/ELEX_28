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
  appendNominationRow,
  MAIN_HEADERS,
} from './lib/googleSheets';
import {
  GoogleFormConfig,
  GoogleSheetConfig,
  NominationSubmission,
} from './types/nomination';
import { Header } from './components/Header';
import { PublicLanding } from './components/PublicLanding';
import { FormManager } from './components/FormManager';
import { ResponsesDashboard } from './components/ResponsesDashboard';
import { GoogleAuthCard } from './components/GoogleAuthCard';
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
      setFeedbackNotice((curr) => (curr?.message === message ? null : curr));
    }, 6000);
  };

  // Auth listener
  useEffect(() => {
    const unsubscribe = initAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Save configs to localStorage
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
    try {
      await logout();
      setUser(null);
      setAppMode('public');
      showFeedback('success', 'تم تسجيل الخروج بنجاح.');
    } catch (err: any) {
      console.error(err);
      showFeedback('error', 'فشل تسجيل الخروج');
    }
  };

  // Create Google Form and Sheets together
  const handleCreateAll = async () => {
    const token = await getAccessToken();
    if (!token) {
      showFeedback('error', 'الرجاء تسجيل الدخول بحساب Google أولاً');
      return;
    }

    setIsCreating(true);
    try {
      showFeedback('success', 'جاري إنشاء Google Form و Google Sheets لأمانات دفعة ELEX28...');

      // 1. Create Spreadsheet
      const newSheetConfig = await createGoogleSpreadsheet(token);
      setSheetConfig(newSheetConfig);

      // 2. Create Google Form
      const newFormConfig = await createGoogleForm(token);
      setFormConfig(newFormConfig);

      showFeedback(
        'success',
        'تم إنشاء الاستمارة وجدول البيانات بنجاح! الاستمارة جاهزة للربط ومشاركة الرابط.'
      );
    } catch (err: any) {
      console.error(err);
      showFeedback('error', `حدث خطأ: ${err.message || 'فشلت عملية الإنشاء'}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Sync Responses from Google Forms
  const handleSyncResponses = useCallback(async () => {
    const token = await getAccessToken();
    if (!token) return;

    if (!formConfig) {
      showFeedback('error', 'لم يتم إنشاء الاستمارة بعد');
      return;
    }

    setIsSyncing(true);
    try {
      const newResponses = await fetchFormResponses(token, formConfig.formId);

      // Deduplicate with existing submissions
      setSubmissions((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const added = newResponses.filter((r) => !existingIds.has(r.id));
        if (added.length > 0) {
          showFeedback('success', `تمت المزامنة بنجاح! تم العثور على ${added.length} ترشيح جديد.`);

          // If sheet exists, append new items
          if (sheetConfig) {
            added.forEach((sub) => {
              appendNominationRow(token, sheetConfig.spreadsheetId, sub).catch(console.error);
            });
          }
        }
        return [...added, ...prev];
      });

      setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
    } catch (err: any) {
      console.error(err);
      showFeedback('error', `فشلت مزامنة الردود: ${err.message || 'خطأ في الاتصال'}`);
    } finally {
      setIsSyncing(false);
    }
  }, [formConfig, sheetConfig]);

  // Periodic Auto-Sync
  useEffect(() => {
    if (!autoSyncEnabled || !formConfig || !user) return;
    const interval = setInterval(() => {
      handleSyncResponses();
    }, 45000); // 45 seconds
    return () => clearInterval(interval);
  }, [autoSyncEnabled, formConfig, user, handleSyncResponses]);

  // Direct Submission from public students
  const handleSubmitDirect = async (submission: NominationSubmission) => {
    setIsSubmitting(true);
    try {
      const token = await getAccessToken();
      if (token && sheetConfig) {
        await appendNominationRow(token, sheetConfig.spreadsheetId, submission);
      }
      setSubmissions((prev) => [submission, ...prev]);
      showFeedback('success', 'تم استلام وتوثيق ترشيحك بنجاح في سجل دفعة ELEX28.');
    } catch (err: any) {
      console.warn('Direct sheet append error:', err);
      // Still store locally as fallback
      setSubmissions((prev) => [submission, ...prev]);
      showFeedback('success', 'تم حفظ ترشيحك محلياً وسيتم ترحيله للشيت تلقائياً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* High-Tech Header with Discreet Hidden Admin Bar */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAdminLogin={() => setAppMode('admin')}
        sheetConfig={sheetConfig}
        activeMode={appMode}
        onChangeMode={setAppMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Feedback Alert Toast */}
        {feedbackNotice && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-semibold shadow-xl transition-all ${
              feedbackNotice.type === 'success'
                ? 'bg-[#f38035] text-slate-950 font-bold shadow-[#f38035]/25'
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
              className="text-slate-950/80 hover:text-slate-950 font-bold text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Routing */}
        {appMode === 'public' ? (
          /* View Mode 1: Public Portal for All Students */
          <PublicLanding
            onSubmitDirect={handleSubmitDirect}
            isSubmitting={isSubmitting}
            totalSubmissions={submissions.length}
          />
        ) : !user ? (
          /* Full-Page Coordinated Admin Login Portal for Laptops & Smartphones */
          <GoogleAuthCard
            onLogin={handleAdminLogin}
            isLoading={isLoggingIn}
            onBackToPublic={() => setAppMode('public')}
          />
        ) : (
          /* View Mode 2: Admin Dashboard (Only accessible after admin login) */
          <div className="space-y-6 animate-fadeIn">
            {/* Admin Header Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0c121e] via-[#090d16] to-[#121c2d] text-white border-2 border-[#f38035]/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-[#f38035] to-[#ea580c] text-slate-950 font-black shadow-lg shadow-[#f38035]/25 shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                      لوحة تحكم مشرف دفعة ELEX28
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#f38035]/20 text-[#f38035] border border-[#f38035]/30">
                      ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    إدارة استمارة Google Form، مزامنة Google Sheets "سجل ترشيحات أمانات الدفعة"، ومتابعة النتائج
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAppMode('public')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#070a10] hover:bg-[#121c2d] text-white border border-[#f38035]/30 hover:border-[#f38035]/60 transition-all cursor-pointer shadow-sm"
                >
                  <Eye className="w-4 h-4 text-[#f38035]" />
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
                    ? 'bg-gradient-to-r from-[#f38035] to-[#ea580c] text-slate-950 shadow-lg shadow-[#f38035]/20'
                    : 'text-slate-400 hover:text-white hover:bg-[#0c121e]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>إدارة الربط والاستمارة والشيت</span>
              </button>

              <button
                onClick={() => setAdminTab('responses')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  adminTab === 'responses'
                    ? 'bg-gradient-to-r from-[#f38035] to-[#ea580c] text-slate-950 shadow-lg shadow-[#f38035]/20'
                    : 'text-slate-400 hover:text-white hover:bg-[#0c121e]'
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
                <div className="bg-[#0c121e] rounded-3xl border border-slate-800 p-5 sm:p-8 shadow-xl">
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
                      className="text-xs font-bold text-[#f38035] hover:text-[#ff9d5c] hover:underline cursor-pointer"
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
              <div className="bg-[#0c121e] rounded-3xl border border-slate-800 p-5 sm:p-8 shadow-xl">
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

      {/* High-Tech ELEX28 Footer with Discreet Trigger */}
      <footer className="mt-auto border-t border-slate-800 bg-[#070a10] py-6 sm:py-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <div
            onClick={() => {
              setAppMode(appMode === 'admin' ? 'public' : 'admin');
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

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  TableProperties,
  LogOut,
  Zap,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { GoogleSheetConfig } from '../types/nomination';
import { ElexLogo } from './ElexLogo';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenAdminLogin: () => void;
  sheetConfig: GoogleSheetConfig | null;
  activeMode: 'public' | 'admin';
  onChangeMode: (mode: 'public' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onOpenAdminLogin,
  sheetConfig,
  activeMode,
  onChangeMode,
}) => {
  // Secret triple click on logo to open admin panel discreetly
  const [secretClickCount, setSecretClickCount] = useState(0);

  const handleSecretClick = () => {
    const newCount = secretClickCount + 1;
    setSecretClickCount(newCount);
    if (newCount >= 3) {
      setSecretClickCount(0);
      if (user) {
        onChangeMode(activeMode === 'admin' ? 'public' : 'admin');
      } else {
        onOpenAdminLogin();
      }
    }
  };

  useEffect(() => {
    if (secretClickCount > 0) {
      const timer = setTimeout(() => setSecretClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [secretClickCount]);

  // Keyboard shortcut: Ctrl+Shift+A for Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a' || e.key === 'ش')) {
        e.preventDefault();
        if (user) {
          onChangeMode(activeMode === 'admin' ? 'public' : 'admin');
        } else {
          onOpenAdminLogin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, activeMode, onChangeMode, onOpenAdminLogin]);

  return (
    <>
      {/* Discreet Admin Top Bar (Only visible when Admin is logged in) */}
      {user && (
        <div className="bg-slate-950 text-white px-3 sm:px-6 py-2 border-b border-emerald-500/30 text-xs font-semibold flex items-center justify-between sticky top-0 z-50 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-emerald-400">لوحة المشرف:</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline">{user.email}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onChangeMode(activeMode === 'admin' ? 'public' : 'admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'admin'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {activeMode === 'admin' ? 'لوحة التحكم ⚙️' : 'صفحة الدفعة 👁️'}
            </button>

            {sheetConfig?.spreadsheetUrl && (
              <a
                href={sheetConfig.spreadsheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900 transition-colors text-[11px]"
              >
                <TableProperties className="w-3 h-3" />
                <span className="hidden sm:inline">Sheets</span>
              </a>
            )}

            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main High-Tech ELEX28 Header - Ultra Responsive for all Phones */}
      <header className="bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 text-white sticky top-0 z-40 shadow-xl shadow-slate-950/40">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* ELEX28 Logo with Secret Admin Trigger */}
            <div
              onClick={handleSecretClick}
              className="cursor-pointer select-none group min-w-0"
              title={user ? 'انقر 3 مرات للتبديل' : 'ELEX28'}
            >
              <ElexLogo size="sm" showSubtitle={true} />
            </div>

            {/* Header Right: Hidden trigger or admin status */}
            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-emerald-500/30 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-emerald-300 text-[11px] sm:text-xs">مشرف</span>
                </div>
              ) : (
                /* Discreet trigger (invisible to regular students) */
                <button
                  onClick={onOpenAdminLogin}
                  className="opacity-10 hover:opacity-100 p-2 text-slate-400 hover:text-emerald-400 rounded-lg transition-opacity cursor-pointer"
                  title="المشرف (Ctrl+Shift+A)"
                  aria-label="Admin Access"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

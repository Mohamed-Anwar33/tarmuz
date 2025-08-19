import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getLoginOptionsPublic } from '@/admin/api/settings';

type FormData = { username: string; email?: string; password: string };

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginShowEmail, setLoginShowEmail] = React.useState(false);
  const [loginEnableEmail, setLoginEnableEmail] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const opts = await getLoginOptionsPublic();
        setLoginShowEmail(!!opts.loginShowEmail);
        setLoginEnableEmail(!!opts.loginEnableEmail);
      } catch {
        // fallback defaults already set
      }
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      // Use username for authentication; email is optional UI field
      await login(data.username, data.password);
      navigate('/admin');
    } catch (e: any) {
      setError(e?.message || t('messages.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-slate-200/60 dark:border-slate-800">
        <div className="bg-gradient-to-l from-indigo-600 via-violet-600 to-fuchsia-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
              <p className="text-sm/6 opacity-90">لوحة إدارة المحتوى</p>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
        <div className="backdrop-blur bg-white/80 dark:bg-neutral-900/70 p-7 space-y-6">

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900 rounded p-2 text-center">
              {error}
            </div>
          )}

          {/* Username (required) */}
          <div className="space-y-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t('account.username') || 'Username'}</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 my-auto text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M4 21v-2a4 4 0 0 1 3-3.87"/><circle cx="12" cy="7" r="4"/></svg>
              </span>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2 bg-white/90 dark:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                type="text"
                placeholder="اسم المستخدم"
                autoComplete="username"
                {...register('username', { required: true, minLength: 3 })}
              />
            </div>
          </div>

          {/* Email (optional, toggle visibility and enabled state) */}
          {loginShowEmail && (
            <div className="space-y-1">
              <label className="text-sm text-slate-700 dark:text-slate-300">{t('contact.email')}</label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 my-auto text-slate-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z" opacity="0"/><path d="M4 6l8 7 8-7"/></svg>
                </span>
                <input
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 pl-10 pr-3 py-2 bg-white/90 dark:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-60"
                  type="email"
                  placeholder="example@mail.com"
                  autoComplete="email"
                  disabled={!loginEnableEmail}
                  required={loginShowEmail && loginEnableEmail}
                  {...register('email', { required: loginShowEmail && loginEnableEmail })}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm text-slate-700 dark:text-slate-300">كلمة المرور</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 my-auto text-slate-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </span>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 pl-10 pr-10 py-2 bg-white/90 dark:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                aria-label="toggle password"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 my-auto p-1.5 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? (
                  // eye-off icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-10-8-10-8a18.45 18.45 0 0 1 5.06-6.94" />
                    <path d="M1 1l22 22" />
                    <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
                    <path d="M6.1 6.1A10.94 10.94 0 0 1 12 4c7 0 10 8 10 8a18.5 18.5 0 0 1-2.24 3.4" />
                  </svg>
                ) : (
                  // eye icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s3-8 11-8 11 8 11 8-3 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-start text-sm">
            <label className="inline-flex items-center gap-2 select-none text-slate-700 dark:text-slate-300">
              <input type="checkbox" className="rounded border-slate-300 dark:border-slate-600" />
              تذكرني
            </label>
          </div>

          <button
            className="w-full rounded-lg bg-gradient-to-l from-indigo-600 via-violet-600 to-fuchsia-600 text-white py-2.5 hover:opacity-95 disabled:opacity-60 shadow"
            type="submit"
            disabled={loading}
          >
            {loading ? t('common.loading') : 'دخول'}
          </button>

          <div className="text-center text-xs text-neutral-500">© {new Date().getFullYear()} {t('layout.brandName')}</div>
        </div>
      </form>
    </div>
  );
};

export default Login;

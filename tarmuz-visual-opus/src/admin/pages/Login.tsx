import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type FormData = { email: string; password: string };

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      await login(data.email, data.password);
      navigate('/admin');
    } catch (e: any) {
      setError(e?.message || t('messages.serverError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md backdrop-blur bg-white/80 dark:bg-neutral-900/70 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl p-7 shadow-2xl space-y-6">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1 text-center flex-1">
              <h1 className="text-2xl font-bold">{t('layout.logout').replace(t('layout.logout'), 'تسجيل الدخول')}</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{t('layout.contentManagement')}</p>
            </div>
            <LanguageSwitcher />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-900 rounded p-2 text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm">{t('contact.email')}</label>
            <input
              className="w-full rounded-lg border px-3 py-2 bg-white/80 dark:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-black/10"
              type="text"
              placeholder="admin"
              autoComplete="username"
              {...register('email', { required: true })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm">{t('forms.required')}</label>
            <div className="relative">
              <input
                className="w-full rounded-lg border px-3 py-2 pr-10 bg-white/80 dark:bg-neutral-900/70 focus:outline-none focus:ring-2 focus:ring-black/10"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password', { required: true })}
              />
              <button
                type="button"
                aria-label="toggle password"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-2 my-auto p-1 text-neutral-500 hover:text-neutral-700"
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
            <label className="inline-flex items-center gap-2 select-none">
              <input type="checkbox" className="rounded border" />
              {t('common.save')}
            </label>
          </div>

          <button
            className="w-full rounded-lg bg-black text-white py-2.5 hover:opacity-90 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? t('common.loading') : t('layout.logout').replace(t('layout.logout'), 'دخول')}
          </button>

          <div className="text-center text-xs text-neutral-500">© {new Date().getFullYear()} {t('layout.brandName')}. {t('common.success')}</div>
      </form>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '@/lib/api';
import { updateProfile, changePassword } from '@/admin/api/auth';
import { useNavigate } from 'react-router-dom';
import { getLoginOptions, updateLoginOptions } from '@/admin/api/settings';
import { showSuccessToast, showErrorToast } from '@/utils/swal';

const Account: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login options (dashboard-controlled)
  const [loginShowEmail, setLoginShowEmail] = useState(false);
  const [loginEnableEmail, setLoginEnableEmail] = useState(true);
  const [savingLoginOptions, setSavingLoginOptions] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingProfile(true);
        const res = await apiFetch<{ user: { username: string; email: string } }>("/auth/verify");
        setUsername(res.user?.username || '');
        setEmail(res.user?.email || '');
        // load login options
        const opts = await getLoginOptions();
        setLoginShowEmail(!!opts.loginShowEmail);
        setLoginEnableEmail(!!opts.loginEnableEmail);
      } catch (e: any) {
        showErrorToast(e?.message || 'Error');
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  const onSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      await updateProfile({ username: username.trim(), email: email.trim().toLowerCase() });
      showSuccessToast(t('messages.saveSuccess'));
    } catch (e: any) {
      showErrorToast(e?.message || t('messages.saveError'));
    } finally {
      setSavingProfile(false);
    }
  };

  const onSaveLoginOptions = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingLoginOptions(true);
      await updateLoginOptions({ loginShowEmail, loginEnableEmail });
      showSuccessToast(t('messages.saveSuccess'));
    } catch (e: any) {
      showErrorToast(e?.message || t('messages.saveError'));
    } finally {
      setSavingLoginOptions(false);
    }
  };

  const onChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showErrorToast(t('forms.passwordMismatch'));
      return;
    }
    try {
      setChangingPass(true);
      await changePassword({ currentPassword, newPassword });
      showSuccessToast(t('messages.saveSuccess'));
      // Clear fields after success
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      showErrorToast(e?.message || t('messages.saveError'));
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('account.title')}</h2>

      {/* Profile form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{t('account.profile')}</h3>

        {loadingProfile ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded" />
            <div className="h-10 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        ) : (
          <form onSubmit={onSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">{t('account.username')}</label>
              <input
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t('account.usernamePlaceholder')}
                required
                minLength={3}
                maxLength={32}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">{t('account.email')}</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('account.emailPlaceholder')}
                required
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm disabled:opacity-60"
              >
                {savingProfile && (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                {t('common.save')}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Password form */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{t('account.password')}</h3>
        <form onSubmit={onChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">{t('account.currentPassword')}</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('account.currentPassword')}
              required
              minLength={6}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">{t('account.newPassword')}</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('account.newPassword')}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-600 dark:text-slate-300">{t('account.confirmPassword')}</label>
              <input
                type="password"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('account.confirmPassword')}
                required
                minLength={6}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={changingPass}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm disabled:opacity-60"
            >
              {changingPass && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {t('account.updatePassword')}
            </button>
          </div>
        </form>
      </div>

      {/* Login options */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{t('account.loginOptions')}</h3>
        <form onSubmit={onSaveLoginOptions} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t('account.showEmailField')}</label>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 dark:border-slate-600"
              checked={loginShowEmail}
              onChange={(e) => setLoginShowEmail(e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-slate-700 dark:text-slate-300">{t('account.enableEmailField')}</label>
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-slate-300 dark:border-slate-600"
              checked={loginEnableEmail}
              onChange={(e) => setLoginEnableEmail(e.target.checked)}
              disabled={!loginShowEmail}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={savingLoginOptions}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm disabled:opacity-60"
            >
              {savingLoginOptions && (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              )}
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;

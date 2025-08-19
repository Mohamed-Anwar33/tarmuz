import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showSuccessToast } from '@/utils/swal';
import { useProjects, useTestimonials, useCategories, useServices, useAbout, useContact, useHero } from '@/hooks/useAPI';

const getQuickActions = (t: any) => [
  {
    title: t('nav.hero'),
    description: t('hero.title') + ' - ' + t('hero.description'),
    link: '/admin/hero',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
      </svg>
    ),
    color: 'from-blue-500 to-indigo-500'
  },
  {
    title: t('nav.about'),
    description: t('about.companyDescription'),
    link: '/admin/about',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'from-emerald-500 to-teal-500'
  },
  {
    title: t('nav.services'),
    description: t('services.addService'),
    link: '/admin/services',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: t('nav.portfolio'),
    description: t('portfolio.addProject'),
    link: '/admin/portfolio',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    color: 'from-orange-500 to-red-500'
  },
  {
    title: t('nav.testimonials'),
    description: t('testimonials.addTestimonial'),
    link: '/admin/testimonials',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'from-cyan-500 to-blue-500'
  },
  {
    title: t('nav.contact'),
    description: t('contact.contactInfo'),
    link: '/admin/contact',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'from-slate-500 to-gray-600'
  },
];

// Cards will be filled from live data below

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const quickActions = getQuickActions(t);
  // Live data queries
  const projectsQ = useProjects();
  const testimonialsQ = useTestimonials();
  const servicesContentQ = useServices();
  const { data: categories, isLoading: loadingCategories, error: errorCategories } = useCategories();
  const aboutQ = useAbout();
  const contactQ = useContact();
  const heroQ = useHero();

  // Toast + navigation state
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure fresh numbers when opening dashboard
  useEffect(() => {
    projectsQ.refetch();
    testimonialsQ.refetch();
    servicesContentQ.refetch();
    aboutQ.refetch();
    contactQ.refetch();
    heroQ.refetch();
  }, []);

  const { data: projects, isLoading: loadingProjects, error: errorProjects } = projectsQ;
  const { data: testimonials, isLoading: loadingTestimonials, error: errorTestimonials } = testimonialsQ;
  const { data: servicesContent, isLoading: loadingServicesContent, error: errorServicesContent } = servicesContentQ;
  const { data: aboutContent, isLoading: loadingAbout } = aboutQ as any;
  const { data: contactContent, isLoading: loadingContact } = contactQ as any;
  const { data: heroContent, isLoading: loadingHero } = heroQ as any;

  const servicesCount = servicesContent?.services?.length ?? 0;
  const loadingServices = loadingServicesContent;
  const errorServices = (errorServicesContent as Error | null) ?? null;

  // Show success toast if navigated with state
  useEffect(() => {
    const st: any = location.state;
    const successMsg = st?.success || st?.successMessage || st?.message;
    if (successMsg) {
      showSuccessToast(successMsg);
      // Clear state so it doesn't reappear on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const stats = [
    { label: 'إجمالي المشاريع', value: projects?.length ?? 0, icon: '📊', loading: loadingProjects, error: errorProjects as Error | null },
    { label: 'آراء العملاء', value: testimonials?.length ?? 0, icon: '💬', loading: loadingTestimonials, error: errorTestimonials as Error | null },
    { label: 'الخدمات المتاحة', value: servicesCount, icon: '⚡', loading: loadingServices, error: errorServices as Error | null },
    { label: 'تصنيفات الأعمال', value: categories?.length ?? 0, icon: '🏷️', loading: loadingCategories, error: errorCategories as Error | null },
  ];

  // Errors banner
  const hasErrors = Boolean(errorProjects || errorTestimonials || errorServices || errorCategories);

  // Helper to format relative time (simple Arabic strings)
  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    const then = new Date(dateStr).getTime();
    if (isNaN(then)) return '';
    const now = Date.now();
    const diff = Math.max(0, now - then);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  };

  // Build recent activities using available updatedAt fields
  const latestCategory = categories && categories.length
    ? [...categories].sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  const recentActivities: Array<{ color: string; title: string; time: string }> = [];
  if (heroContent?.updatedAt) {
    recentActivities.push({ color: 'bg-blue-500', title: 'تحديث الصفحة الرئيسية', time: formatRelativeTime(heroContent.updatedAt) });
  }
  if (aboutContent?.updatedAt) {
    recentActivities.push({ color: 'bg-green-500', title: 'تحديث قسم نبذة عنا', time: formatRelativeTime(aboutContent.updatedAt) });
  }
  if (servicesContent?.updatedAt) {
    recentActivities.push({ color: 'bg-purple-500', title: 'تحديث قسم الخدمات', time: formatRelativeTime(servicesContent.updatedAt) });
  }
  if (contactContent?.updatedAt) {
    recentActivities.push({ color: 'bg-cyan-500', title: 'تحديث معلومات التواصل', time: formatRelativeTime(contactContent.updatedAt) });
  }
  if (latestCategory?.updatedAt) {
    recentActivities.push({ color: 'bg-orange-500', title: `تحديث تصنيف: ${latestCategory.name_ar || latestCategory.name}`, time: formatRelativeTime(latestCategory.updatedAt) });
  }
  // Show at least 3 items; if not enough data, fill with placeholders
  while (recentActivities.length < 3) {
    recentActivities.push({ color: 'bg-slate-400', title: 'لا يوجد نشاط حديث', time: '' });
  }

  return (
    <div className="space-y-8">
      {/* Global Error Banner */}
      {hasErrors && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 dark:border-red-800/50 dark:bg-red-900/30 dark:text-red-200 p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86l-7.4 12.84A2 2 0 004.6 20h14.8a2 2 0 001.71-3.3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <p className="text-sm">{t('messages.loadError')}: حدث خطأ أثناء تحميل بعض البيانات. حاول التحديث لاحقًا.</p>
          </div>
        </div>
      )}
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">مرحباً بك في لوحة الإدارة</h1>
            <p className="text-blue-100 sm:text-lg">إدارة محتوى موقع ترمُز بسهولة وفعالية</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-4xl">🚀</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Create */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">إجراءات سريعة</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/portfolio" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">+ مشروع جديد</Link>
          <Link to="/admin/testimonials" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">+ شهادة جديدة</Link>
          <Link to="/admin/services" className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">+ خدمة جديدة</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                {stat.loading ? (
                  <div className="mt-2 w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                ) : (
                  <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</p>
                )}
                {stat.error && (
                  <p className="text-xs mt-2 text-red-600 dark:text-red-400">{t('messages.loadError')}</p>
                )}
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mini Chart for Stats */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">نظرة مرئية سريعة</h3>
        <div className="space-y-3">
          {stats.map((s, i) => {
            const max = Math.max(1, ...stats.map((x) => Number(x.value) || 0));
            const pct = Math.min(100, Math.round(((Number(s.value) || 0) / max) * 100));
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{s.label}</span>
                  {s.loading ? (
                    <span className="w-8 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse inline-block" />
                  ) : (
                    <span>{s.value}</span>
                  )}
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded overflow-hidden">
                  <div className={`h-2 rounded ${s.loading ? 'animate-pulse bg-slate-300 dark:bg-slate-600' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={{ width: s.loading ? '40%' : `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">{t('dashboard.welcome')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{action.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{action.description}</p>
              <div className="flex items-center mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                <span>{t('common.view')}</span>
                <svg className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">{t('dashboard.recentActivity')}</h3>
        <div className="space-y-4">
          {(() => {
            const loadingRecent = Boolean(loadingCategories || loadingAbout || loadingContact || loadingHero || loadingServicesContent);
            if (loadingRecent) {
              return Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 bg-slate-200 dark:bg-slate-600 rounded" />
                    <div className="h-2 w-24 bg-slate-200 dark:bg-slate-600 rounded" />
                  </div>
                </div>
              ));
            }
            return recentActivities.slice(0, 5).map((act, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${act.color}`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-white">{act.title}</p>
                  {act.time && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">{act.time}</p>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      
    </div>
  );
};

export default Dashboard;

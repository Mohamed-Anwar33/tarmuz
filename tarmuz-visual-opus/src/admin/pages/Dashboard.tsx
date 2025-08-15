import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjects, useTestimonials, useCategories, useServices } from '@/hooks/useAPI';

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

  // Ensure fresh numbers when opening dashboard
  useEffect(() => {
    projectsQ.refetch();
    testimonialsQ.refetch();
    servicesContentQ.refetch();
  }, []);

  const { data: projects, isLoading: loadingProjects, error: errorProjects } = projectsQ;
  const { data: testimonials, isLoading: loadingTestimonials, error: errorTestimonials } = testimonialsQ;
  const { data: servicesContent, isLoading: loadingServicesContent, error: errorServicesContent } = servicesContentQ;

  const servicesCount = servicesContent?.services?.length ?? 0;
  const loadingServices = loadingServicesContent;
  const errorServices = (errorServicesContent as Error | null) ?? null;

  const stats = [
    { label: 'إجمالي المشاريع', value: projects?.length ?? 0, icon: '📊', loading: loadingProjects, error: errorProjects as Error | null },
    { label: 'آراء العملاء', value: testimonials?.length ?? 0, icon: '💬', loading: loadingTestimonials, error: errorTestimonials as Error | null },
    { label: 'الخدمات المتاحة', value: servicesCount, icon: '⚡', loading: loadingServices, error: errorServices as Error | null },
    { label: 'تصنيفات الأعمال', value: categories?.length ?? 0, icon: '🏷️', loading: loadingCategories, error: errorCategories as Error | null },
  ];

  return (
    <div className="space-y-8">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('nav.testimonials')}</p>
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
        <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">النشاط الأخير</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-white">تم تحديث قسم "نبذة عنا"</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">منذ ساعتين</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-white">تم إضافة مشروع جديد</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">منذ 4 ساعات</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-white">تم تحديث معلومات التواصل</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('nav.portfolio')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

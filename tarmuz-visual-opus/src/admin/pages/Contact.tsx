import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContent, updateContent, ContentDoc } from '@/admin/api/content';
import { getContactRecipient, updateContactRecipient } from '@/admin/api/settings';
import { showSuccessToast, showErrorToast } from '@/utils/swal';

type FormData = {
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  email?: string;
  phone?: string;
  address_ar?: string;
  address_en?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_linkedin?: string;
  social_facebook?: string;
  social_youtube?: string;
  social_tiktok?: string;
  social_snapchat?: string;
  social_whatsapp?: string;
  social_telegram?: string;
  social_pinterest?: string;
  social_behance?: string;
  social_dribbble?: string;
  location_lat?: number;
  location_lng?: number;
};

const Contact: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['content', 'contact'],
    queryFn: () => getContent('contact'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // keep in cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
  const { register, handleSubmit, reset } = useForm<FormData>();
  // Settings form for recipient email
  const { register: registerSettings, handleSubmit: handleSettingsSubmit, reset: resetSettings } = useForm<{ contactRecipient: string }>();

  useEffect(() => {
    if (data) {
      const d = data as ContentDoc;
      reset({
        title_ar: d.title_ar || '',
        title_en: d.title_en || '',
        description_ar: d.description_ar || '',
        description_en: d.description_en || '',
        email: d.contact?.email || '',
        phone: d.contact?.phone || '',
        address_ar: d.contact?.address_ar || '',
        address_en: d.contact?.address_en || '',
        social_instagram: d.social?.instagram || '',
        social_twitter: d.social?.twitter || '',
        social_linkedin: d.social?.linkedin || '',
        social_facebook: d.social?.facebook || '',
        social_youtube: d.social?.youtube || '',
        social_tiktok: d.social?.tiktok || '',
        social_snapchat: d.social?.snapchat || '',
        social_whatsapp: d.social?.whatsapp || '',
        social_telegram: d.social?.telegram || '',
        social_pinterest: d.social?.pinterest || '',
        social_behance: d.social?.behance || '',
        social_dribbble: d.social?.dribbble || '',
        location_lat: d.location?.lat,
        location_lng: d.location?.lng,
      });
    }
  }, [data, reset]);

  // Load current contact recipient from backend settings
  const recipientQuery = useQuery({
    queryKey: ['settings', 'contact-recipient'],
    queryFn: getContactRecipient,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (recipientQuery.data) {
      resetSettings({ contactRecipient: recipientQuery.data.contactRecipient || '' });
    }
  }, [recipientQuery.data, resetSettings]);

  const mutation = useMutation({
    mutationFn: (values: FormData) => updateContent('contact', {
      title_ar: values.title_ar,
      title_en: values.title_en,
      description_ar: values.description_ar,
      description_en: values.description_en,
      contact: {
        email: values.email,
        phone: values.phone,
        address_ar: values.address_ar,
        address_en: values.address_en,
      },
      social: {
        instagram: values.social_instagram,
        twitter: values.social_twitter,
        linkedin: values.social_linkedin,
        facebook: values.social_facebook,
        youtube: values.social_youtube,
        tiktok: values.social_tiktok,
        snapchat: values.social_snapchat,
        whatsapp: values.social_whatsapp,
        telegram: values.social_telegram,
        pinterest: values.social_pinterest,
        behance: values.social_behance,
        dribbble: values.social_dribbble,
      },
      location: { lat: Number(values.location_lat), lng: Number(values.location_lng) },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content', 'contact'] });
      showSuccessToast('تم حفظ بيانات التواصل بنجاح!');
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'حدث خطأ أثناء حفظ البيانات.');
    },
  });

  const onSubmit = (values: FormData) => {
    mutation.mutate(values);
  };

  // Mutation to update recipient email
  const updateRecipientMutation = useMutation({
    mutationFn: (values: { contactRecipient: string }) => updateContactRecipient(values.contactRecipient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', 'contact-recipient'] });
      showSuccessToast('تم تحديث بريد الاستلام بنجاح.');
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'حدث خطأ أثناء تحديث البريد.');
    },
  });

  const onSubmitRecipient = (values: { contactRecipient: string }) => {
    updateRecipientMutation.mutate(values);
  };

  if (isLoading) return (
    <div className="space-y-6">
      <div className="h-24 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
      <div className="space-y-4">
        <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
        <div className="h-40 rounded-xl bg-slate-100 animate-pulse" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
          <div className="h-24 rounded-xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">إدارة صفحة التواصل</h1>
            <p className="text-rose-100 mt-1">تحرير بيانات التواصل والموقع الجغرافي وروابط الاتصال</p>
          </div>
        </div>
      </div>


      {/* Settings: Contact Recipient */}
      <form onSubmit={handleSettingsSubmit(onSubmitRecipient)} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
          </div>
          البريد المستلم لرسائل الموقع
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">الإيميل الذي ستصل إليه رسائل نموذج التواصل</label>
            <input
              type="email"
              placeholder="recipient@example.com"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              {...registerSettings('contactRecipient')}
            />
            {recipientQuery.isLoading && <div className="text-sm text-slate-500">جاري التحميل...</div>}
            {recipientQuery.isError && <div className="text-sm text-red-600">تعذر تحميل البريد الحالي</div>}
          </div>
          <button
            type="submit"
            disabled={updateRecipientMutation.isPending}
            className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-50"
          >
            {updateRecipientMutation.isPending ? 'جاري الحفظ...' : 'حفظ البريد'}
          </button>
        </div>

      </form>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            بيانات التواصل
          </h2>

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">العنوان (AR)</label>
                <input className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('title_ar')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Title (EN)</label>
                <input className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('title_en')} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">الوصف (AR)</label>
              <textarea rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none" {...register('description_ar')} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description (EN)</label>
              <textarea rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors resize-none" {...register('description_en')} />
            </div>
            <hr className="my-6"/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">البريد الإلكتروني</label>
                <input type="email" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('email')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">الهاتف</label>
                <input type="tel" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('phone')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">العنوان (AR)</label>
                <input className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('address_ar')} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Address (EN)</label>
                <input className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('address_en')} />
              </div>
            </div>
             <hr className="my-6"/>
            <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" />
              </svg>
              روابط التواصل الاجتماعي
            </h3>
            
            {/* الشبكات الاجتماعية الرئيسية */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="text-md font-medium text-slate-600 mb-4">الشبكات الاجتماعية الرئيسية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
                    Instagram
                  </label>
                  <input placeholder="https://instagram.com/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_instagram')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    Twitter
                  </label>
                  <input placeholder="https://twitter.com/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_twitter')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    LinkedIn
                  </label>
                  <input placeholder="https://linkedin.com/in/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_linkedin')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    Facebook
                  </label>
                  <input placeholder="https://facebook.com/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_facebook')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    YouTube
                  </label>
                  <input placeholder="https://youtube.com/@username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_youtube')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-black rounded"></div>
                    TikTok
                  </label>
                  <input placeholder="https://tiktok.com/@username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_tiktok')} />
                </div>
              </div>
            </div>
            
            {/* تطبيقات المراسلة */}
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="text-md font-medium text-slate-600 mb-4">تطبيقات المراسلة</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded"></div>
                    WhatsApp
                  </label>
                  <input placeholder="https://wa.me/966501234567" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_whatsapp')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    Telegram
                  </label>
                  <input placeholder="https://t.me/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_telegram')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    Snapchat
                  </label>
                  <input placeholder="https://snapchat.com/add/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_snapchat')} />
                </div>
              </div>
            </div>
            
            {/* المنصات الإبداعية والمهنية */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="text-md font-medium text-slate-600 mb-4">المنصات الإبداعية والمهنية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    Pinterest
                  </label>
                  <input placeholder="https://pinterest.com/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_pinterest')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded"></div>
                    Behance
                  </label>
                  <input placeholder="https://behance.net/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_behance')} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-4 h-4 bg-pink-600 rounded"></div>
                    Dribbble
                  </label>
                  <input placeholder="https://dribbble.com/username" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors" {...register('social_dribbble')} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12m0 0l4.243-4.243M13.414 12H3" />
              </svg>
            </div>
            الموقع الجغرافي
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Latitude</label>
              <input type="number" step="any" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" {...register('location_lat', { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Longitude</label>
              <input type="number" step="any" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" {...register('location_lng', { valueAsNumber: true })} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="px-8 py-4 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg"
          >
            {mutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Contact;

import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContent, updateContent, ContentDoc } from '../api/content';
import { showConfirmationDialog, showErrorToast, showSuccessToast } from '@/utils/swal';
import { useForm } from 'react-hook-form';

const Services: React.FC = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  type ServiceItem = Required<ContentDoc>["services"][number] & {
    _key?: string; // local key for stable editing when no id
  };

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ServiceItem>();

  const iconOptions: string[] = [
    // Originals
    'interior','exterior','branding','landscape','urban','social',
    // Additional common options
    'architecture','planning','engineering','construction','supervision','renovation',
    'lighting','furniture','painting','graphics','visualization','masterplan',
    'hospitality','sanitary','fixtures','industrial','resort','sustainability','premium',
  ];

  const { data: content, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ['content','services'],
    queryFn: () => getContent('services'),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const services: ServiceItem[] = (content?.services ?? []).map((s, i) => ({ _key: `${i}-${s?.name_ar || s?.name_en || 'srv'}` , ...s }));

  const saveMutation = useMutation({
    mutationFn: (payload: { services: ServiceItem[]; message: string }) => updateContent('services', { services: payload.services }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['content', 'services'] });
      setEditingId(null);
      setShowForm(false);
      reset();
      showSuccessToast(variables.message);
    },
    onError: (err: any) => {
      // eslint-disable-next-line no-console
      console.error('Service update failed', err);
      showErrorToast(err.message || 'فشلت العملية. حاول مرة أخرى.');
    }
  });

  const onSubmit = (data: ServiceItem) => {
    if (editingId !== null) {
      const idx = services.findIndex(s => s._key === editingId);
      const next = [...services];
      if (idx >= 0) next[idx] = { ...next[idx], ...data };
      saveMutation.mutate({ services: next, message: 'تم تحديث الخدمة بنجاح!' });
    } else {
      const next = [...services, { ...data }];
      saveMutation.mutate({ services: next, message: 'تم إضافة الخدمة بنجاح!' });
    }
  };

  const startEdit = (service: ServiceItem) => {
    setEditingId(service._key || null);
    setShowForm(true);
    setValue('name_ar', service.name_ar || '');
    setValue('name_en', service.name_en || '');
    setValue('description_ar', service.description_ar || '');
    setValue('description_en', service.description_en || '');
    setValue('icon', service.icon || 'interior');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowForm(false);
    reset();
  };

  const filteredServices = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return services;
    return services.filter(service =>
      (service.name_ar || '').toLowerCase().includes(q) ||
      (service.name_en || '').toLowerCase().includes(q)
    );
  }, [services, searchTerm]);

  if (isLoading) {
    // Initial skeletons for first load (no cache yet)
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="h-8 w-48 bg-white/30 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 animate-pulse">
              <div className="h-12 w-12 bg-slate-200 rounded-xl mb-4" />
              <div className="h-4 w-2/3 bg-slate-200 rounded mb-2" />
              <div className="h-3 w-1/2 bg-slate-200 rounded mb-4" />
              <div className="h-3 w-full bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          حدث خطأ أثناء تحميل قسم الخدمات: {(error as Error)?.message || ''}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Background fetch indicator */}
      {isFetching && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      )}
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">إدارة الخدمات</h1>
              <p className="text-purple-100 mt-1">إضافة وتعديل وحذف الخدمات المقدمة</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{services.length}</div>
            <div className="text-purple-100 text-sm">إجمالي الخدمات</div>
          </div>
        </div>
      </div>


      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="البحث في الخدمات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            />
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              reset();
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            إضافة خدمة جديدة
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {editingId ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
            </h2>
            <button onClick={cancelEdit} className="p-2 text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700">المحتوى العربي</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">اسم الخدمة</label>
                  <input
                    {...register('name_ar', { required: 'اسم الخدمة مطلوب' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="مثل: التصميم الداخلي"
                  />
                  {errors.name_ar && <p className="text-red-500 text-sm">{errors.name_ar.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">وصف الخدمة</label>
                  <textarea
                    {...register('description_ar', { required: 'وصف الخدمة مطلوب' })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    placeholder="اكتب وصف مفصل للخدمة..."
                  />
                  {errors.description_ar && <p className="text-red-500 text-sm">{errors.description_ar.message as string}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-700">English Content</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Service Name</label>
                  <input
                    {...register('name_en', { required: 'Service name is required' })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    placeholder="e.g: Interior Design"
                  />
                  {errors.name_en && <p className="text-red-500 text-sm">{errors.name_en.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Service Description</label>
                  <textarea
                    {...register('description_en', { required: 'Service description is required' })}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                    placeholder="Write a detailed description..."
                  />
                  {errors.description_en && <p className="text-red-500 text-sm">{errors.description_en.message as string}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">أيقونة الخدمة</label>
              <select
                {...register('icon')}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white"
                defaultValue={watch('icon') || 'interior'}
              >
                {iconOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p className="text-xs text-slate-500">اختر الأيقونة المناسبة. يمكن إضافة أيقونات أكثر لاحقًا.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={cancelEdit} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50">
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
              >
                {saveMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {editingId ? 'جاري الحفظ...' : 'جاري الحفظ...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {editingId ? 'حفظ التغييرات' : 'إضافة الخدمة'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, idx) => (
          <div key={service._key || idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(service)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={async () => {
                    const confirmed = await showConfirmationDialog(
                      'هل أنت متأكد من الحذف؟',
                      `سيتم حذف خدمة "${service.name_ar}". لا يمكن التراجع عن هذا الإجراء.`
                    );
                    if (confirmed) {
                      const next = services.filter(s => (s._key || '') !== (service._key || ''));
                      saveMutation.mutate({ services: next, message: 'تم حذف الخدمة بنجاح!' });
                    }
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">{service.name_ar}</h3>
            <p className="text-sm text-slate-500 mb-3">{service.name_en}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{service.description_ar}</p>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center text-slate-500 border border-slate-200">
          لا توجد نتائج مطابقة
        </div>
      )}
    </div>
  );
};

export default Services;

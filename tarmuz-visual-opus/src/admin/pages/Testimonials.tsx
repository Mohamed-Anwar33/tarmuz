import React, { useMemo, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTestimonial, deleteTestimonial, getTestimonials, Testimonial, updateTestimonial } from '@/admin/api/testimonials';
import { showConfirmationDialog, showErrorToast, showSuccessToast } from '@/utils/swal';
import { API_BASE } from '@/lib/config';

type FormData = Omit<Testimonial, '_id'> & { _id?: string };

const Testimonials: React.FC = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });
  const { register, handleSubmit, reset, setValue, control } = useForm<FormData>();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const toAbs = (p?: string) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return `${API_BASE}/${p.replace(/^\/+/, '')}`;
  };

  const filtered = useMemo(() => {
    if (!data) return [] as Testimonial[];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((t) => `${t.clientName_ar} ${t.clientName_en} ${t.company_ar} ${t.company_en} ${t.quote_ar} ${t.quote_en}`.toLowerCase().includes(q));
  }, [data, search]);

  const createMut = useMutation({
    mutationFn: createTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      setShowModal(false);
      showSuccessToast('تمت إضافة الرأي بنجاح');
    },
    onError: (err: any) => showErrorToast(err.message || 'فشل إنشاء الرأي'),
  });
  const updateMut = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Testimonial> }) => updateTestimonial(payload.id, payload.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      setShowModal(false);
      showSuccessToast('تم تحديث الرأي بنجاح');
    },
    onError: (err: any) => showErrorToast(err.message || 'فشل تحديث الرأي'),
  });
  const deleteMut = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['testimonials'] });
      showSuccessToast('تم حذف الرأي بنجاح');
    },
    onError: (err: any) => showErrorToast(err.message || 'فشل حذف الرأي'),
  });

  const startCreate = () => {
    setEditingTestimonial(null);
        reset({ quote_ar: '', quote_en: '', clientName_ar: '', clientName_en: '', position_ar: '', position_en: '', company_ar: '', company_en: '', rating: 5, status: 'active' });
    setShowModal(true);
  };

  const startEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    reset(t);
    setShowModal(true);
  };

  const onSubmit = (values: FormData) => {
    const { _id, ...payload } = values;
    if (_id) {
      updateMut.mutate({ id: _id, data: payload });
    } else {
      createMut.mutate(payload);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirmationDialog(
      'هل أنت متأكد من الحذف؟',
      'سيتم حذف هذا الرأي ولا يمكن التراجع عن هذا الإجراء.'
    );
    if (confirmed) {
      deleteMut.mutate(id);
    }
  };


  if (isLoading) return <div>...يجري التحميل</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">آراء العملاء</h1>
          <p className="text-slate-500 mt-1">إضافة وتعديل وحذف آراء العملاء.</p>
        </div>
        <button
          onClick={startCreate}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-200/80"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" /></svg>
          <span>إضافة رأي</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="البحث في الآراء..."
          className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
        />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div key={t._id} className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200 flex flex-col">
            <div className="p-5 flex-grow">
              <div className="flex items-center gap-4 mb-4">
                {t.avatar ? (
                  <img src={toAbs(t.avatar)} className="w-14 h-14 rounded-full object-cover border-2 border-white ring-2 ring-indigo-200" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">👤</div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{t.clientName_ar || t.clientName_en}</h3>
                  <p className="text-sm text-slate-500">{t.position_ar || t.position_en} • {t.company_ar || t.company_en}</p>
                </div>
              </div>
              <blockquote className="text-slate-600 italic border-r-4 border-indigo-200 pr-4">“{t.quote_ar || t.quote_en}”</blockquote>
            </div>
            <div className="flex gap-2 p-3 bg-slate-50 border-t border-slate-100">
              <button type="button" onClick={() => startEdit(t)} className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors">تعديل</button>
              <button
                type="button"
                onClick={() => handleDelete(t._id)}
                disabled={deleteMut.isPending && deleteMut.variables === t._id}
                className="w-full px-4 py-2 rounded-lg border font-semibold text-sm transition-colors text-red-600 hover:bg-red-50 border-red-200 disabled:opacity-50"
              >
                {deleteMut.isPending && deleteMut.variables === t._id ? 'جارٍ الحذف...' : 'حذف'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
          <h3 className="text-xl font-semibold">لا توجد نتائج</h3>
          <p className="mt-1">لم يتم العثور على آراء تطابق بحثك.</p>
        </div>
      )}

      {/* Slide-over Panel */}
      {showModal && (
        <div className="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)}></div>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:pl-10">
                <div className="pointer-events-auto w-screen max-w-2xl transform transition ease-in-out duration-300 translate-x-0">
                  <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <h2 className="text-xl font-semibold leading-6 text-gray-900" id="slide-over-title">
                              {editingTestimonial ? 'تعديل الرأي' : 'رأي جديد'}
                            </h2>
                            <p className="text-sm text-gray-500">املأ التفاصيل أدناه.</p>
                          </div>
                          <div className="flex h-7 items-center">
                            <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" onClick={() => setShowModal(false)}>
                              <span className="sr-only">Close panel</span>
                              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Form Body */}
                      <div className="space-y-6 px-4 py-6 sm:px-6">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                          <div>
                            <label htmlFor="clientName_ar" className="block text-sm font-medium leading-6 text-gray-900">اسم العميل (AR)</label>
                            <div className="mt-2"><input type="text" id="clientName_ar" className="form-input" {...register('clientName_ar')} /></div>
                          </div>
                          <div>
                            <label htmlFor="clientName_en" className="block text-sm font-medium leading-6 text-gray-900">Client Name (EN)</label>
                            <div className="mt-2"><input type="text" id="clientName_en" className="form-input" {...register('clientName_en')} /></div>
                          </div>
                          <div>
                            <label htmlFor="position_ar" className="block text-sm font-medium leading-6 text-gray-900">المنصب (AR)</label>
                            <div className="mt-2"><input type="text" id="position_ar" className="form-input" {...register('position_ar')} /></div>
                          </div>
                          <div>
                            <label htmlFor="position_en" className="block text-sm font-medium leading-6 text-gray-900">Position (EN)</label>
                            <div className="mt-2"><input type="text" id="position_en" className="form-input" {...register('position_en')} /></div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="quote_ar" className="block text-sm font-medium leading-6 text-gray-900">الاقتباس (AR)</label>
                          <div className="mt-2"><textarea id="quote_ar" rows={4} className="form-input" {...register('quote_ar')}></textarea></div>
                        </div>
                        <div>
                          <label htmlFor="quote_en" className="block text-sm font-medium leading-6 text-gray-900">Quote (EN)</label>
                          <div className="mt-2"><textarea id="quote_en" rows={4} className="form-input" {...register('quote_en')}></textarea></div>
                        </div>


                        <div className="grid grid-cols-2 gap-6">
                           <div>
                            <label htmlFor="rating" className="block text-sm font-medium leading-6 text-gray-900">التقييم</label>
                            <div className="mt-2"><input type="number" min="1" max="5" id="rating" className="form-input" {...register('rating', { valueAsNumber: true })} /></div>
                          </div>
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">الحالة</label>
                            <div className="mt-2">
                              <select id="status" className="form-input" {...register('status')}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-end gap-x-4">
                      <button type="button" onClick={() => setShowModal(false)} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        إلغاء
                      </button>
                      <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="inline-flex justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                        {createMut.isPending || updateMut.isPending ? 'جاري الحفظ...' : 'حفظ'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;

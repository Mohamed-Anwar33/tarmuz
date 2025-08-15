import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProject, deleteProject, getProjects, Project, updateProject } from '@/admin/api/projects';
// removed featured projects content linkage
import { API_BASE } from '@/lib/config';

// Normalize image URLs and fix malformed stored paths across Admin UI
function toAbs(p?: string) {
  if (!p) return '';
  let path = String(p).trim();
  // Already absolute
  if (/^https?:\/\//i.test(path)) return path;
  // Strip common malformed prefixes
  path = path.replace(/^:5000\/+/, '');
  path = path.replace(/^localhost:5000\/+/, '');
  path = path.replace(/^127\.0\.0\.1:5000\/+/, '');
  try {
    const api = new URL(API_BASE);
    const hostPort = `${api.hostname}${api.port ? ':' + api.port : ''}`.replace(/\./g, '\\.');
    const re = new RegExp(`^${hostPort}\\/+`, 'i');
    path = path.replace(re, '');
  } catch {}
  // If it's just a filename (no slash), assume uploads/
  if (!path.includes('/')) {
    path = `uploads/${path}`;
  }
  const normalized = path.replace(/^\/+/, '');
  return `${API_BASE}/${normalized}`;
}

type FormData = {
  _id?: string;
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  category?: string;
  images?: string[]; // existing paths
  // removed featured flag
};

const Portfolio: React.FC = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  // no featured content needed
  const { register, handleSubmit, reset, setValue } = useForm<FormData>();
  const [files, setFiles] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  

  const filtered = useMemo(() => {
    if (!data) return [] as Project[];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) => `${p.title_ar} ${p.title_en} ${p.category}`.toLowerCase().includes(q));
  }, [data, search]);
  // removed featured set

  const createMut = useMutation({
    mutationFn: (payload: { data: Omit<Project, '_id'>; files: File[] }) => createProject(payload.data, payload.files),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
  const updateMut = useMutation({
    mutationFn: (payload: { id: string; data: Partial<Project>; files: File[] }) => updateProject(payload.id, payload.data, payload.files),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('[deleteProject] failed', err);
    },
  });

  const startCreate = () => {
    setEditingProject(null);
    reset({ title_ar: '', title_en: '', description_ar: '', description_en: '', category: '', images: [] });
    setFiles([]);
    setShowModal(true);
  };

  const startEdit = (p: Project) => {
    setEditingProject(p);
    reset({
      _id: p._id,
      title_ar: p.title_ar || '',
      title_en: p.title_en || '',
      description_ar: p.description_ar || '',
      description_en: p.description_en || '',
      category: p.category || '',
      images: p.images || [],
    });
    setFiles([]);
    setShowModal(true);
  };

  const onSubmit = async (values: FormData) => {
    const payload = {
      title_ar: values.title_ar,
      title_en: values.title_en,
      description_ar: values.description_ar,
      description_en: values.description_en,
      category: values.category,
    } as Project;
    // Save project
    let saved: Project | undefined;
    if (values._id) {
      saved = await updateMut.mutateAsync({ id: values._id, data: payload, files });
    } else {
      saved = await createMut.mutateAsync({ data: payload, files });
    }

    // removed featuredIds sync
    reset({});
    setFiles([]);
    setShowModal(false);
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    try {
      setDeletingId(id);
      // eslint-disable-next-line no-console
      console.debug('[onDelete] deleting id', id);
      await deleteMut.mutateAsync(id);
      // eslint-disable-next-line no-alert
      // alert('تم حذف المشروع بنجاح'); // اختياري
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[onDelete] error', e);
      // eslint-disable-next-line no-alert
      alert('تعذر حذف المشروع، حاول مرة أخرى');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) return <div>...يجري التحميل</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">إدارة المشاريع</h1>
          <p className="text-slate-500 mt-1">إضافة وتعديل وحذف المشاريع في محفظة أعمالك.</p>
        </div>
        <button
          onClick={startCreate}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-200/80"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" /></svg>
          <span>مشروع جديد</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="البحث في المشاريع..."
          className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-slate-200">
            <div className="aspect-video bg-slate-100 overflow-hidden">
              {p.images?.find((x) => !!x && String(x).trim() !== '') ? (
                <img src={toAbs(p.images!.find((x) => !!x && String(x).trim() !== '') as string)} alt="cover" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">لا توجد صورة</div>
              )}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <span className="inline-block bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">{p.category || 'غير مصنف'}</span>
                {/* Optional: Featured Badge */}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-3 truncate">{p.title_ar || p.title_en}</h3>
              <p className="text-sm text-slate-600 mt-1 h-10 line-clamp-2">{p.description_ar || p.description_en}</p>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => startEdit(p)} className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors">تعديل</button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!p._id) return;
                    if (confirmDeleteId !== p._id) {
                      setConfirmDeleteId(p._id);
                      setTimeout(() => setConfirmDeleteId((curr) => (curr === p._id ? null : curr)), 3000);
                      return;
                    }
                    onDelete(p._id);
                  }}
                  disabled={deletingId === p._id || deleteMut.isPending}
                  className={`w-full px-4 py-2 rounded-lg border font-semibold text-sm transition-colors ${confirmDeleteId === p._id ? 'text-white bg-red-600 hover:bg-red-700 border-red-600' : 'text-red-600 hover:bg-red-50 border-red-200'} disabled:opacity-50`}
                >
                  {deletingId === p._id ? 'جارٍ...' : (confirmDeleteId === p._id ? 'تأكيد؟' : 'حذف')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-200">
          <h3 className="text-xl font-semibold">لا توجد نتائج</h3>
          <p className="mt-1">لم يتم العثور على مشاريع تطابق بحثك.</p>
        </div>
      )}

      {/* Slide-over Panel */}
      {showModal && (
        <div className="relative z-50" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={() => setShowModal(false)}></div>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full sm:pl-10">
                <div className="pointer-events-auto w-screen max-w-3xl transform transition ease-in-out duration-300 translate-x-0">
                  <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between space-x-3">
                          <div className="space-y-1">
                            <h2 className="text-xl font-semibold leading-6 text-gray-900" id="slide-over-title">
                              {editingProject ? 'تعديل المشروع' : 'مشروع جديد'}
                            </h2>
                            <p className="text-sm text-gray-500">املأ التفاصيل أدناه. الحقول باللغة العربية هي المطلوبة على الأقل.</p>
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
                      <div className="space-y-8 px-4 py-6 sm:px-6">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
                          <div>
                            <label htmlFor="title_ar" className="block text-sm font-medium leading-6 text-gray-900">العنوان (AR)</label>
                            <div className="mt-2">
                              <input type="text" id="title_ar" className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...register('title_ar')} />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="title_en" className="block text-sm font-medium leading-6 text-gray-900">Title (EN)</label>
                            <div className="mt-2">
                              <input type="text" id="title_en" className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...register('title_en')} />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="description_ar" className="block text-sm font-medium leading-6 text-gray-900">الوصف (AR)</label>
                          <div className="mt-2">
                            <textarea id="description_ar" rows={4} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...register('description_ar')}></textarea>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="description_en" className="block text-sm font-medium leading-6 text-gray-900">Description (EN)</label>
                          <div className="mt-2">
                            <textarea id="description_en" rows={4} className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...register('description_en')}></textarea>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">التصنيف</label>
                          <div className="mt-2">
                            <input type="text" id="category" className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" {...register('category')} />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                          <h3 className="text-sm font-medium leading-6 text-gray-900">صور المشروع</h3>
                          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                              <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                  <span>اختر الملفات</span>
                                  <input id="file-upload" type="file" multiple accept="image/*" className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                                </label>
                                <p className="pl-1">أو اسحبها وأفلتها هنا</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          </div>
                          {(editingProject?.images?.length || files.length > 0) && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 pt-4">
                              {editingProject?.images?.map((p, idx) => (
                                <div key={`existing-${idx}`} className="relative aspect-square rounded-lg border overflow-hidden shadow-sm">
                                  <img className="w-full h-full object-cover" src={toAbs(p)} alt={`Existing project image ${idx + 1}`} />
                                </div>
                              ))}
                              {files.map((f, idx) => (
                                <div key={`new-${idx}`} className="relative aspect-square rounded-lg border overflow-hidden shadow-sm">
                                  <img className="w-full h-full object-cover" src={URL.createObjectURL(f)} alt={`New file preview ${idx + 1}`} />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-end gap-x-4">
                      <button type="button" onClick={() => setShowModal(false)} className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        إلغاء
                      </button>
                      <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="inline-flex justify-center rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50">
                        {createMut.isPending || updateMut.isPending ? 'جاري الحفظ...' : 'حفظ المشروع'}
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

function ImagesPreview({ controlValueGetter }: { controlValueGetter: () => string[] }) {
  const [vals, setVals] = useState<string[]>([]);
  useEffect(() => {
    setVals(controlValueGetter());
  }, [controlValueGetter]);
  if (!vals?.length) return null;
  return (
    <div className="flex gap-2 flex-wrap">
      {vals.map((p, idx) => (
        <img
          key={idx}
          className="w-24 h-24 object-cover rounded border"
          src={toAbs(p)}
        />
      ))}
    </div>
  );
}

export default Portfolio;

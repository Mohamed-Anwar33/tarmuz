import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBranding, updateBranding, type Branding } from '@/admin/api/settings';
import { uploadFile } from '@/lib/api';
import { showSuccessToast, showErrorToast } from '@/utils/swal';
import { API_BASE } from '@/lib/config';
import logoFallback from '@/assets/logo.png';

type FormData = Branding;

const toAbs = (p?: string) => {
  const v = (p || '').trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v) || v.startsWith('data:')) return v;
  const path = v.startsWith('/') ? v : `/${v}`;
  return `${API_BASE}${path}`;
};

const BrandingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: { logoUrl: '', logoUrlScrolled: '' },
  });
  const logoUrl = watch('logoUrl');
  const logoUrlScrolled = watch('logoUrlScrolled');
  const [uploading, setUploading] = useState(false);
  const [uploadingScrolled, setUploadingScrolled] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['settings', 'branding'],
    queryFn: getBranding,
  });

  useEffect(() => {
    if (data) {
      setValue('logoUrl', data.logoUrl || '');
      setValue('logoUrlScrolled', data.logoUrlScrolled || '');
    }
  }, [data, setValue]);

  const mutation = useMutation({
    mutationFn: (payload: Branding) => updateBranding(payload),
    onSuccess: (resp) => {
      queryClient.setQueryData(['settings', 'branding'], resp);
      // Refresh public branding so Navbar/Footer pick latest logo
      queryClient.invalidateQueries({ queryKey: ['branding-public'] });
      showSuccessToast('تم حفظ العلامة التجارية بنجاح!');
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'حدث خطأ أثناء حفظ العلامة التجارية.');
    },
  });

  const onSubmit = (values: FormData) => {
    mutation.mutate({
      logoUrl: (values.logoUrl || '').trim(),
      logoUrlScrolled: (values.logoUrlScrolled || '').trim(),
    });
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const result = await uploadFile(file);
      const path = result.filePath;
      setValue('logoUrl', path, { shouldDirty: true });
      showSuccessToast('تم رفع الشعار الأساسي بنجاح.');
    } catch (err: any) {
      console.error('Upload error', err);
      showErrorToast(err.message || 'فشل رفع الشعار.');
    } finally {
      setUploading(false);
    }
  };

  const onUploadScrolled = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingScrolled(true);
      const result = await uploadFile(file);
      const path = result.filePath;
      setValue('logoUrlScrolled', path, { shouldDirty: true });
      showSuccessToast('تم رفع شعار التمرير بنجاح.');
    } catch (err: any) {
      console.error('Upload error', err);
      showErrorToast(err.message || 'فشل رفع الشعار.');
    } finally {
      setUploadingScrolled(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 015.657 5.657L12 16l-5.657-5.657A4 4 0 1112 4.354z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">الهوية والعلامة</h1>
            <p className="text-blue-100 mt-1">تحديث شعار الموقع وسيظهر تلقائيًا في الهيدر والفوتر</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-48 text-slate-600">جاري التحميل...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">رابط الشعار</label>
                <input
                  {...register('logoUrl')}
                  placeholder="/uploads/logo.png أو https://..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-slate-500">يمكنك إدخال رابط مباشر أو رفع صورة جديدة أدناه</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">رفع صورة الشعار</label>
                <div className="flex items-center gap-3">
                  <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={onUpload} />
                  <label htmlFor="logo-upload" className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer">
                    {uploading ? 'جاري الرفع...' : 'اختيار صورة'}
                  </label>
                  {uploading && <span className="text-slate-500">قد يستغرق الأمر بضع ثوانٍ</span>}
                </div>
              </div>

              <div className="pt-4 border-t" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">رابط شعار (عند التمرير للأسفل)</label>
                <input
                  {...register('logoUrlScrolled')}
                  placeholder="اختياري - شعار يظهر على خلفية فاتحة"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-slate-500">يُنصح بتوفير نسخة تتناسب مع خلفية بيضاء للنافبار بعد التمرير</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">رفع صورة الشعار (عند التمرير)</label>
                <div className="flex items-center gap-3">
                  <input id="logo-upload-scrolled" type="file" accept="image/*" className="hidden" onChange={onUploadScrolled} />
                  <label htmlFor="logo-upload-scrolled" className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer">
                    {uploadingScrolled ? 'جاري الرفع...' : 'اختيار صورة'}
                  </label>
                  {uploadingScrolled && <span className="text-slate-500">قد يستغرق الأمر بضع ثوانٍ</span>}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {mutation.isPending ? 'جاري الحفظ...' : 'حفظ الشعار'}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">معاينة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Primary on dark bg */}
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">الشعار الأساسي (خلفية داكنة/الـHero)</div>
                  <div
                    className="flex items-center justify-center border border-dashed border-slate-300 rounded-xl p-6"
                    style={{
                      backgroundColor: '#666',
                      backgroundImage:
                        'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%),\n                         linear-gradient(-45deg, rgba(255,255,255,.15) 25%, transparent 25%),\n                         linear-gradient(45deg, transparent 75%, rgba(255,255,255,.15) 75%),\n                         linear-gradient(-45deg, transparent 75%, rgba(255,255,255,.15) 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  >
                    <img src={logoUrl ? toAbs(logoUrl) : logoFallback} alt="Logo preview" className="h-20 object-contain" />
                  </div>
                </div>

                {/* Scrolled on light bg */}
                <div>
                  <div className="text-sm font-medium text-slate-700 mb-2">شعار عند التمرير (خلفية فاتحة)</div>
                  <div
                    className="flex items-center justify-center border border-dashed border-slate-300 rounded-xl p-6"
                    style={{
                      backgroundColor: '#e5e7eb',
                      backgroundImage:
                        'linear-gradient(45deg, rgba(0,0,0,.05) 25%, transparent 25%),\n                         linear-gradient(-45deg, rgba(0,0,0,.05) 25%, transparent 25%),\n                         linear-gradient(45deg, transparent 75%, rgba(0,0,0,.05) 75%),\n                         linear-gradient(-45deg, transparent 75%, rgba(0,0,0,.05) 75%)',
                      backgroundSize: '20px 20px',
                      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    }}
                  >
                    <img src={logoUrlScrolled ? toAbs(logoUrlScrolled) : (logoUrl ? toAbs(logoUrl) : logoFallback)} alt="Scrolled Logo preview" className="h-20 object-contain" />
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-3">يُنصح باستخدام صورة PNG بخلفية شفافة</div>
            </div>
          </div>

        </form>
      )}
    </div>
  );
};

export default BrandingPage;

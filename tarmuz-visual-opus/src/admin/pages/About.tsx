import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getContent, updateContent, ContentDoc } from '@/admin/api/content';
import { uploadFile } from '@/lib/api';
import { API_BASE } from '@/lib/config';

type FormData = {
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  image?: string;
  images?: string[];
};

const About: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  
  const toAbs = (p?: string) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return `${API_BASE}/${(p || '').replace(/^\/+/, '')}`;
  };
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['content', 'about'],
    queryFn: () => getContent('about'),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateContent('about', data),
    onSuccess: (resp: any, variables: FormData) => {
      const sentImages = (variables as any).images || images;
      queryClient.setQueryData(['content','about'], (prev: any) => ({
        ...(prev || {}),
        ...(resp || {}),
        images: Array.isArray(resp?.images) && resp.images.length ? resp.images : sentImages,
        image: resp?.image || (Array.isArray(sentImages) && sentImages.length ? sentImages.join(',') : prev?.image),
      }));
      queryClient.invalidateQueries({ queryKey: ['content', 'about'] });
    },
    onError: (error: any) => {
      console.error('Save error:', error);
    },
  });

  React.useEffect(() => {
    if (content) {
      setValue('title_ar', content.title_ar || '');
      setValue('title_en', content.title_en || '');
      setValue('description_ar', content.description_ar || '');
      setValue('description_en', content.description_en || '');
      setValue('image', content.image || '');
      const csv = (content.image || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const imgs = (content.images && content.images.length > 0) ? content.images : csv;
      setImages(imgs);
      setImagePreview(imgs[0] ? toAbs(imgs[0]) : '');
    }
  }, [content, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    setImagePreview(URL.createObjectURL(selected[0]));
    try {
      setUploadingImage(true);
      const newPaths: string[] = [];
      for (const file of selected) {
        try {
          const res = await uploadFile(file);
          newPaths.push(res.filePath);
        } catch (err) {
          console.error('Upload error for file:', file.name, err);
        }
      }
      if (newPaths.length) {
        setImages(prev => [...prev, ...newPaths]);
        const csv = [...images, ...newPaths].join(',');
        setValue('image', csv);
        setImagePreview(toAbs(newPaths[newPaths.length - 1]));
      }
    } catch (error) {
      console.error('Upload error:', error);
      setImagePreview('');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit = (data: FormData) => {
    const clean = (images || []).map(s => (s ?? '').trim()).filter(Boolean);
    const unique = Array.from(new Set(clean));
    const csv = unique.join(',');
    const payload = {
      ...data,
      images: unique,
      gallery: unique,
      image: csv || data.image || '',
    } as any;
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="text-lg">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">إدارة نبذة عنا</h1>
            <p className="text-emerald-100 mt-1">تحرير معلومات الشركة ونبذة عن الخدمات والرؤية</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {mutation.isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-green-800 font-medium">تم حفظ التغييرات بنجاح!</span>
        </div>
      )}

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <span className="text-red-800 font-medium">حدث خطأ أثناء الحفظ. يرجى المحاولة مرة أخرى.</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Content Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            المحتوى النصي
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Arabic Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">المحتوى العربي</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">عنوان القسم</label>
                <input
                  {...register('title_ar', { required: 'العنوان العربي مطلوب' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="مثل: نبذة عنا، من نحن، رؤيتنا"
                />
                {errors.title_ar && <p className="text-red-500 text-sm">{errors.title_ar.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">الوصف التفصيلي</label>
                <textarea
                  {...register('description_ar', { required: 'الوصف العربي مطلوب' })}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  placeholder="اكتب نبذة مفصلة عن الشركة، رؤيتها، رسالتها، وقيمها..."
                />
                {errors.description_ar && <p className="text-red-500 text-sm">{errors.description_ar.message}</p>}
              </div>
            </div>

            {/* English Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">English Content</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Section Title</label>
                <input
                  {...register('title_en', { required: 'English title is required' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="e.g: About Us, Who We Are, Our Vision"
                />
                {errors.title_en && <p className="text-red-500 text-sm">{errors.title_en.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Detailed Description</label>
                <textarea
                  {...register('description_en', { required: 'English description is required' })}
                  rows={6}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Write a detailed description about the company, its vision, mission, and values..."
                />
                {errors.description_en && <p className="text-red-500 text-sm">{errors.description_en.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            صورة القسم
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">رفع صور</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-emerald-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="about-image-upload"
                  />
                  <label htmlFor="about-image-upload" className="cursor-pointer">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium">اضغط لرفع صور متعددة</p>
                    <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF حتى 10MB</p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">أو أضف رابط صورة إلى المعرض</label>
                <div className="flex gap-2">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="https://example.com/about-image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = newImageUrl.trim();
                      if (!v) return;
                      const next = [...images, v];
                      setImages(next);
                      setNewImageUrl('');
                      setValue('image', next.join(','));
                      setImagePreview(toAbs(v));
                    }}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">معرض الصور</label>
              {uploadingImage && (
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                  <span>جاري رفع الصورة...</span>
                </div>
              )}
              {images.length === 0 ? (
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-slate-50 aspect-video flex items-center justify-center text-slate-400">
                  لا توجد صور في المعرض بعد
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, i) => (
                    <div key={img + i} className="relative group border border-slate-200 rounded-xl overflow-hidden">
                      <img src={toAbs(img)} alt={`About ${i + 1}`} className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          className="px-2 py-1 bg-white/80 rounded hover:bg-white text-slate-700 border"
                          onClick={() => {
                            if (i === 0) return;
                            const next = [...images];
                            [next[i - 1], next[i]] = [next[i], next[i - 1]];
                            setImages(next);
                            setValue('image', next.join(','));
                            setImagePreview(toAbs(next[0] || ''));
                          }}
                          title="أعلى"
                        >▲</button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-white/80 rounded hover:bg-white text-slate-700 border"
                          onClick={() => {
                            if (i === images.length - 1) return;
                            const next = [...images];
                            [next[i + 1], next[i]] = [next[i], next[i + 1]];
                            setImages(next);
                            setValue('image', next.join(','));
                            setImagePreview(toAbs(next[0] || ''));
                          }}
                          title="أسفل"
                        >▼</button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => {
                            const next = images.filter((_, idx) => idx !== i);
                            setImages(next);
                            setValue('image', next.join(','));
                            setImagePreview(toAbs(next[0] || ''));
                          }}
                          title="حذف"
                        >حذف</button>
                      </div>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">الصورة الرئيسية</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending || uploadingImage}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg"
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

export default About;

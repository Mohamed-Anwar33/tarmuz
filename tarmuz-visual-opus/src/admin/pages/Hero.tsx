import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContent, updateContent } from '@/admin/api/content';
import { uploadFile } from '@/lib/api';
import { API_BASE } from '@/lib/config';

type FormData = {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  images?: string[];
};

const Hero: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const toAbs = (p?: string) => {
    if (!p) return '';
    if (/^https?:\/\//i.test(p)) return p;
    return `${API_BASE}/${p.replace(/^\/+/, '')}`;
  };
  
  const { data: content, isLoading } = useQuery({
    queryKey: ['content', 'hero'],
    queryFn: () => getContent('hero'),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => updateContent('hero', data),
    onSuccess: (resp: any, variables: FormData) => {
      // Optimistically ensure images are in cache, even if backend drops them
      const sentImages = (variables as any).images || images;
      queryClient.setQueryData(['content','hero'], (prev: any) => ({
        ...(prev || {}),
        ...(resp || {}),
        images: Array.isArray(resp?.images) && resp.images.length ? resp.images : sentImages,
        image: resp?.image || (Array.isArray(sentImages) ? sentImages[0] : undefined) || prev?.image,
      }));
      // Background refetch to stay in sync
      queryClient.invalidateQueries({ queryKey: ['content', 'hero'] });
      // Warn if server did not return images
      if (!Array.isArray(resp?.images) || resp.images.length === 0) {
        console.warn('Backend response lacks images array; kept local gallery. Please update backend to persist images[].');
      }
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
      setImagePreview(content.image ? toAbs((content.image || '').split(',')[0]) : '');
      // If backend didn't persist images[], but stored CSV in image, parse it
      const parsedFromCsv = (content.image || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      setImages(content.images && content.images.length > 0 ? content.images : parsedFromCsv);
    }
  }, [content, setValue]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    // set quick preview to first file
    setImageFile(selected[0]);
    setImagePreview(URL.createObjectURL(selected[0]));

    try {
      setUploadingImage(true);
      const newPaths: string[] = [];
      for (const file of selected) {
        try {
          const result = await uploadFile(file);
          newPaths.push(result.filePath);
        } catch (err) {
          console.error('Upload error for file:', file.name, err);
        }
      }
      if (newPaths.length) {
        setImages(prev => [...prev, ...newPaths]);
        setValue('image', newPaths[0]);
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
    const cleanImages = (images || [])
      .map(v => (v ?? '').toString().trim())
      .filter(v => v.length > 0);
    const uniqueImages = Array.from(new Set(cleanImages));
    const imageCsv = uniqueImages.join(',');
    const payload = {
      ...data,
      images: uniqueImages,
      // Put full gallery as CSV into image so backends that store single field keep all
      image: imageCsv || data.image || '',
      // some backends might expect a different field name
      gallery: uniqueImages,
    } as any;
    // debug to verify what we send
    console.debug('Saving hero payload:', payload);
    mutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg">جاري تحميل البيانات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14l-2-16" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">إدارة الصفحة الرئيسية</h1>
            <p className="text-blue-100 mt-1">تحرير العنوان الرئيسي والوصف والصورة الخلفية</p>
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
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <label className="text-sm font-medium text-slate-700">العنوان الرئيسي</label>
                <input
                  {...register('title_ar', { required: 'العنوان العربي مطلوب' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="أدخل العنوان الرئيسي بالعربية"
                />
                {errors.title_ar && <p className="text-red-500 text-sm">{errors.title_ar.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">الوصف</label>
                <textarea
                  {...register('description_ar', { required: 'الوصف العربي مطلوب' })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="أدخل وصف مختصر عن الشركة والخدمات"
                />
                {errors.description_ar && <p className="text-red-500 text-sm">{errors.description_ar.message}</p>}
              </div>
            </div>

            {/* English Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">English Content</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Main Title</label>
                <input
                  {...register('title_en', { required: 'English title is required' })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter main title in English"
                />
                {errors.title_en && <p className="text-red-500 text-sm">{errors.title_en.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Description</label>
                <textarea
                  {...register('description_en', { required: 'English description is required' })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Enter a brief description about the company and services"
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
            الصورة الخلفية
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">رفع صورة جديدة</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-medium">اضغط لرفع صورة</p>
                    <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF حتى 10MB</p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">إضافة رابط صورة إلى المعرض</label>
                <div className="flex gap-2">
                  <input
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const v = newImageUrl.trim();
                      if (!v) return;
                      setImages(prev => [...prev, v]);
                      setNewImageUrl('');
                      setImagePreview(toAbs(v));
                      setValue('image', v);
                    }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    إضافة
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">معرض الصور</label>
              {uploadingImage && (
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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
                      <img src={toAbs(img)} alt={`Hero ${i + 1}`} className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          className="px-2 py-1 bg-white/80 rounded hover:bg-white text-slate-700 border"
                          onClick={() => {
                            if (i === 0) return;
                            const next = [...images];
                            [next[i - 1], next[i]] = [next[i], next[i - 1]];
                            setImages(next);
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
                          }}
                          title="أسفل"
                        >▼</button>
                        <button
                          type="button"
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
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
              <div className="text-xs text-slate-500 mt-2">سيتم استخدام أول صورة كصورة رئيسية.</div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={mutation.isPending || uploadingImage}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg"
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

export default Hero;

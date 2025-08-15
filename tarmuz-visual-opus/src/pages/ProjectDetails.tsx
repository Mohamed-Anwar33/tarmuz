import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus, Minus, RotateCcw } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjects } from "@/hooks/useAPI";
import { API_BASE } from "@/lib/config";
// Dev-only cache buster to avoid stale 304 responses while backend stays running
const IMG_BUST = import.meta.env.DEV ? `?v=${Date.now()}` : '';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import portfolio1 from "@/assets/portfolio-1.jpg";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { data: projectsData, isLoading } = useProjects();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Zoom/Pan state
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const project = projectsData?.find(p => p._id === id);

  const nextImage = () => {
    if (project?.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project?.images && project.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  // Reset zoom/pan when switching image or project
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsPanning(false);
    setLastPos(null);
  }, [currentImageIndex, project?._id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-lg">Loading project...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">{language === 'ar' ? 'المشروع غير موجود' : 'Project Not Found'}</h1>
          <p className="text-muted-foreground mb-8">{language === 'ar' ? 'المشروع المطلوب غير موجود.' : "The project you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = project?.images || [];
  // Ensure default image matches Projects page cover: first non-empty image
  useEffect(() => {
    if (!images || images.length === 0) return;
    const validIndex = images.findIndex((img) => !!img && String(img).trim() !== '');
    if (validIndex >= 0) setCurrentImageIndex(validIndex);
    else setCurrentImageIndex(0);
  }, [project?._id]);

  const currentImage = images[currentImageIndex];
  
  // Build a safe image URL from API, fixing malformed stored paths
  const toImageUrl = (path?: string) => {
    if (!path) return '';
    let p = String(path).trim();
    if (/^https?:\/\//i.test(p)) return p;
    // Remove accidental leading port-only or host+port prefixes
    p = p.replace(/^:5000\/+/, '');
    p = p.replace(/^localhost:5000\/+/, '');
    p = p.replace(/^127\.0\.0\.1:5000\/+/, '');
    try {
      const api = new URL(API_BASE);
      const hostPort = `${api.hostname}${api.port ? ':' + api.port : ''}`.replace(/\./g, '\\.');
      const re = new RegExp(`^${hostPort}\\/+`, 'i');
      p = p.replace(re, '');
    } catch {}
    // If it's just a filename (no slash), assume uploads/
    if (!p.includes('/')) {
      p = `uploads/${p}`;
    }
    const normalized = p.replace(/^\/+/, '');
    return `${API_BASE}/${normalized}${IMG_BUST}`;
  };

  // Zoom helpers
  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));
  // Use native wheel listener to allow preventDefault without warnings
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!zoomEnabled) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => clamp(Number((z + delta).toFixed(2)), 1, 4));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel as EventListener);
    };
  }, [zoomEnabled]);
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomEnabled || zoom <= 1) return;
    setIsPanning(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomEnabled || !isPanning || !lastPos) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const endPan = () => {
    setIsPanning(false);
    setLastPos(null);
  };
  const zoomIn = () => setZoom((z) => clamp(Number((z + 0.2).toFixed(2)), 1, 4));
  const zoomOut = () => setZoom((z) => clamp(Number((z - 0.2).toFixed(2)), 1, 4));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  useEffect(() => { if (!zoomEnabled) resetZoom(); }, [zoomEnabled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      {/* Header: Title and Meta (Category/Date) */}
      <section className="pt-28 pb-8 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              {language === 'ar' ? (project.title_ar || project.title_en || '') : (project.title_en || project.title_ar || '')}
            </h1>
            {(project.category) && (
              <p className="text-sm text-muted-foreground">
                {project.category}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Large Image or Slider */}
      {images.length > 0 && (
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto relative rounded-xl overflow-hidden elegant-shadow">
              {/* Image viewport with zoom/pan */}
              <div
                className={`w-full h-[380px] md:h-[520px] bg-black flex items-center justify-center ${zoomEnabled && zoom > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'}`}
                style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
                ref={viewportRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={endPan}
                onMouseLeave={endPan}
              >
                <img
                  src={currentImage ? toImageUrl(currentImage) : portfolio1}
                  alt={language === 'ar' ? project.title_ar : project.title_en}
                  className="max-w-full max-h-full object-contain select-none"
                  onError={(e) => { e.currentTarget.src = portfolio1; }}
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transition: isPanning ? 'none' : 'transform 0.15s ease-out',
                  }}
                  draggable={false}
                />
              </div>

              {/* Zoom controls */}
              <div className={`absolute top-3 ${language === 'ar' ? 'left-3' : 'right-3'} flex items-center gap-2 bg-white/90 backdrop-blur rounded-full p-2 shadow`}
              >
                <Button variant="outline" size="sm" onClick={() => setZoomEnabled((v) => !v)}>
                  {language === 'ar' ? (zoomEnabled ? 'إيقاف الزوم' : 'تفعيل الزوم') : (zoomEnabled ? 'Disable Zoom' : 'Enable Zoom')}
                </Button>
                <Button variant="outline" size="icon" onClick={zoomOut} disabled={!zoomEnabled}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={zoomIn} disabled={!zoomEnabled}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetZoom} disabled={!zoomEnabled}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              {images.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      )}
      {images.length === 0 && (
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl border border-primary/10 p-6 text-center">
              <div className="w-full h-64 bg-muted/20 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                <img src={portfolio1} alt="placeholder" className="max-w-full max-h-full object-contain" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                {language === 'ar' ? 'لا توجد صور لهذا المشروع' : 'No images for this project'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'ar' ? 'يمكنك العودة إلى صفحة المشاريع للاطلاع على مشاريع أخرى.' : 'You can go back to the projects page to view other projects.'}
              </p>
              <div className="mt-4">
                <Button variant="outline" onClick={() => navigate('/projects')}>
                  <ArrowLeft className="mr-2 w-4 h-4" />
                  {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About the Project + Full Description */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-primary mb-4">
              {language === 'ar' ? 'عن المشروع' : 'About the Project'}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words">
                {language === 'ar' ? (project.description_ar || project.description_en || '') : (project.description_en || project.description_ar || '')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button onClick={() => navigate('/projects')} variant="outline">
              <ArrowLeft className="mr-2 w-4 h-4" />
              {language === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetails;

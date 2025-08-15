import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Filter, Grid, List, Search, ArrowRight, ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { API_BASE } from "@/lib/config";
// Dev-only cache buster to avoid stale 304s while server is running
const IMG_BUST = import.meta.env.DEV ? `?v=${Date.now()}` : '';
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import aboutBg from "@/assets/about-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import { useProjects, useCategories, useProjectCategories } from "@/hooks/useAPI";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  // Zoom & Pan state for modal image
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [zoomEnabled, setZoomEnabled] = useState(true);
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: projectCategoriesData, isLoading: projectCategoriesLoading } = useProjectCategories();
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const projectsPerPage = 6;

  // Normalize image URLs and fix malformed stored paths
  const toImageUrl = (path?: string) => {
    if (!path) return '';
    let p = String(path).trim();
    // Already absolute
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
    // If it's just a filename (no slash), assume it should live under uploads/
    if (!p.includes('/')) {
      p = `uploads/${p}`;
    }
    const normalized = p.replace(/^\/+/, '');
    return `${API_BASE}/${normalized}${IMG_BUST}`;
  };

  // Extract all images from all projects for gallery view
  const allImages = [];
  projectsData?.forEach((project) => {
    if (project.images && Array.isArray(project.images)) {
      project.images.forEach((img, index) => {
        if (img && String(img).trim() !== '') {
          allImages.push({
            id: `${project._id}-${index}`,
            src: img,
            projectTitle: project.title_en || project.title_ar || '',
            projectTitleAr: project.title_ar || project.title_en || '',
            category: project.category || '',
            projectId: project._id,
            description: project.description_en || '',
            descriptionAr: project.description_ar || '',
          });
        }
      });
    }
  });

  // Projects sourced from backend API (keep for compatibility)
  const allProjects = projectsData?.map((p) => ({
    id: p._id,
    title: p.title_en || '',
    titleAr: p.title_ar || '',
    category: p.category || '',
    image: (p.images?.find((img) => !!img && String(img).trim() !== '')) || '',
    description: p.description_en || '',
    descriptionAr: p.description_ar || '',
    location: "",
    locationAr: "",
    year: "",
    area: "",
    status: "",
    statusAr: "",
  })) || [];

  // Dynamic filters based on categories from backend
  // Use formal categories first, fallback to project categories for backward compatibility
  const availableCategories = categoriesData?.length ? 
    categoriesData.map(cat => ({
      id: cat.name,
      label: cat.name,
      labelAr: cat.name_ar
    })) :
    (projectCategoriesData || []).map(category => ({
      id: category,
      label: category,
      labelAr: category
    }));

  // Hide categories that have no images
  const categoriesWithImages = new Set(
    allImages.map((img) => (img.category || '').trim()).filter((c) => c !== '')
  );
  const filteredAvailableCategories = (availableCategories || []).filter((cat) =>
    categoriesWithImages.has((cat.id || '').toString().trim())
  );

  const filters = [
    { id: "all", label: "All Projects", labelAr: "جميع المشاريع" },
    ...filteredAvailableCategories
  ];

  // Filter and search images - with safety checks
  const filteredImages = allImages?.filter((image) => {
    const matchesFilter = activeFilter === "all" || image.category === activeFilter;
    const matchesSearch = image.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.projectTitleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  // Also keep filtered projects for backward compatibility
  const filteredProjects = allProjects?.filter((project) => {
    const matchesFilter = activeFilter === "all" || project.category === activeFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.titleAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.descriptionAr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  // Pagination for images
  const imagesPerPage = 24; // More images per page for gallery view
  const totalPages = Math.ceil(filteredImages.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = filteredImages.slice(startIndex, startIndex + imagesPerPage);
  
  // Keep project pagination for compatibility
  const currentProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage);

  // Loading effect
  useEffect(() => {
    setIsLoading(projectsLoading || categoriesLoading || projectCategoriesLoading);
  }, [projectsLoading, categoriesLoading, projectCategoriesLoading]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchTerm]);

  // Ensure activeFilter stays valid when categories list changes
  useEffect(() => {
    if (
      activeFilter !== 'all' &&
      !(filteredAvailableCategories || []).some((c) => (c.id || '').toString().trim() === (activeFilter || '').toString().trim())
    ) {
      setActiveFilter('all');
    }
  }, [filteredAvailableCategories, activeFilter]);

  // Reset zoom/pan when slide changes or selected project changes
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentSlideIndex, selectedImage && (selectedImage as any).projectId]);

  // Attach non-passive wheel listener to the zoom container to avoid warnings
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!zoomEnabled) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((z) => Math.min(4, Math.max(1, +(z + delta).toFixed(2))));
    };
    const el = zoomContainerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [zoomEnabled]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-primary/90 to-accent/90 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroBg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
              {language === 'ar' ? 'معرض المشاريع' : 'Our Projects'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              {language === 'ar' 
                ? 'استكشف مجموعة متنوعة من مشاريعنا المبتكرة والمبهرة في مختلف المجالات'
                : 'Explore our diverse collection of innovative and stunning projects across various fields'
              }
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{allProjects.length}+</div>
                <div className="text-sm opacity-80">{language === 'ar' ? 'مشروع' : 'Projects'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">5+</div>
                <div className="text-sm opacity-80">{language === 'ar' ? 'سنوات خبرة' : 'Years Experience'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-80">{language === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                <div className="text-sm opacity-80">{language === 'ar' ? 'دعم فني' : 'Support'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Controls Section */}
      <section className="py-12 bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder={language === 'ar' ? 'البحث في المشاريع...' : 'Search projects...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-primary/20 focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all duration-300"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter.id)}
                  className="transition-all duration-300 hover:scale-105"
                >
                  {language === 'ar' ? (filter.labelAr || filter.label) : (filter.label || filter.labelAr)}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-primary/10 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="transition-all duration-300"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="transition-all duration-300"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          
          {/* Results Info */}
          <div className="mb-8 text-center">
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? `عرض ${currentImages.length} من ${filteredImages.length} صورة`
                : `Showing ${currentImages.length} of ${filteredImages.length} images`
              }
            </p>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden elegant-shadow animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Images Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {currentImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className="group relative bg-white rounded-lg overflow-hidden elegant-shadow hover:shadow-xl transition-all duration-300 cursor-pointer animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => {
                      setSelectedImage(image);
                      setModalOpen(true);
                      // Find all images from the same project for slideshow
                      const projectImages = allImages.filter(img => img.projectId === image.projectId);
                      setCurrentSlideIndex(projectImages.findIndex(img => img.id === image.id));
                      // Reset zoom & pan on open
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square">
                      <img 
                        src={toImageUrl(image.src)} 
                        alt={language === 'ar' ? image.projectTitleAr : image.projectTitle}
                        className="w-full h-full object-contain bg-gray-100"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = portfolio1; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Project Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-sm font-medium truncate">
                          {language === 'ar' ? image.projectTitleAr : image.projectTitle}
                        </p>
                        <p className="text-xs opacity-80">{image.category}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal for Image Details */}
              {modalOpen && selectedImage && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                      <div>
                        <h2 className="text-xl font-bold">
                          {language === 'ar' ? selectedImage.projectTitleAr : selectedImage.projectTitle}
                        </h2>
                        <p className="text-sm text-muted-foreground">{selectedImage.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={zoomEnabled ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => {
                            setZoomEnabled((v) => {
                              const next = !v;
                              if (!next) { setZoom(1); setPan({ x: 0, y: 0 }); }
                              return next;
                            });
                          }}
                        >
                          {language === 'ar' ? (zoomEnabled ? 'التكبير: تشغيل' : 'التكبير: إيقاف') : (zoomEnabled ? 'Zoom: On' : 'Zoom: Off')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
                          disabled={!zoomEnabled || zoom <= 1}
                        >
                          -
                        </Button>
                        <div className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setZoom((z) => Math.min(4, +(z + 0.2).toFixed(2)))}
                          disabled={!zoomEnabled}
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                          disabled={!zoomEnabled || (zoom === 1 && pan.x === 0 && pan.y === 0)}
                        >
                          {language === 'ar' ? 'إعادة' : 'Reset'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setModalOpen(false)}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4">
                      {(() => {
                        const projectImages = allImages.filter(img => img.projectId === selectedImage.projectId);
                        return (
                          <div className="space-y-4">
                            {/* Current Image */}
                            <div
                              className="relative overflow-hidden"
                              ref={zoomContainerRef}
                              style={{
                                cursor: zoomEnabled && zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                                touchAction: 'none',
                                overscrollBehavior: 'contain',
                              }}
                              onMouseDown={(e) => {
                                if (!zoomEnabled || zoom <= 1) return;
                                setIsPanning(true);
                                setLastPos({ x: e.clientX, y: e.clientY });
                              }}
                              onMouseMove={(e) => {
                                if (!zoomEnabled || !isPanning) return;
                                const dx = e.clientX - lastPos.x;
                                const dy = e.clientY - lastPos.y;
                                setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
                                setLastPos({ x: e.clientX, y: e.clientY });
                              }}
                              onMouseUp={() => setIsPanning(false)}
                              onMouseLeave={() => setIsPanning(false)}
                            >
                              <img
                                src={toImageUrl(projectImages[currentSlideIndex]?.src || selectedImage.src)}
                                alt={language === 'ar' ? selectedImage.projectTitleAr : selectedImage.projectTitle}
                                className="w-full h-96 object-contain bg-black rounded-lg"
                                style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomEnabled ? zoom : 1})`, transition: isPanning ? 'none' : 'transform 150ms ease-out' }}
                                draggable={false}
                              />
                              
                              {/* Navigation Arrows */}
                              {projectImages.length > 1 && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                    onClick={() => setCurrentSlideIndex(prev => 
                                      prev > 0 ? prev - 1 : projectImages.length - 1
                                    )}
                                  >
                                    <ChevronLeft className="w-5 h-5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                                    onClick={() => setCurrentSlideIndex(prev => 
                                      prev < projectImages.length - 1 ? prev + 1 : 0
                                    )}
                                  >
                                    <ChevronRight className="w-5 h-5" />
                                  </Button>
                                </>
                              )}
                            </div>

                            {/* Thumbnails */}
                            {projectImages.length > 1 && (
                              <div className="flex gap-2 overflow-x-auto pb-2">
                                {projectImages.map((img, index) => (
                                  <button
                                    key={img.id}
                                    onClick={() => setCurrentSlideIndex(index)}
                                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                      index === currentSlideIndex ? 'border-primary' : 'border-gray-200'
                                    }`}
                                  >
                                    <img
                                      src={toImageUrl(img.src)}
                                      alt=""
                                      className="w-full h-full object-contain bg-gray-100"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Project Description */}
                            {selectedImage.description && (
                              <div className="pt-4 border-t">
                                <h3 className="font-semibold mb-2">
                                  {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
                                </h3>
                                <p className="text-muted-foreground">
                                  {language === 'ar' ? selectedImage.descriptionAr : selectedImage.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* No Results */}
              {currentImages.length === 0 && (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === 'ar' 
                      ? 'جرب تغيير المرشحات أو مصطلح البحث'
                      : 'Try changing your filters or search term'
                    }
                  </p>
                  <Button onClick={() => { setActiveFilter("all"); setSearchTerm(""); }}>
                    {language === 'ar' ? 'إعادة تعيين المرشحات' : 'Reset Filters'}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="transition-all duration-300"
              >
                {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                {language === 'ar' ? 'السابق' : 'Previous'}
              </Button>
              
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? "default" : "outline"}
                    onClick={() => setCurrentPage(index + 1)}
                    className="w-10 h-10 transition-all duration-300"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="transition-all duration-300"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
                {language === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </div>
          )}
          
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Projects;

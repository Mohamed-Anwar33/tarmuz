import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjects, useCategories, useProjectCategories } from "@/hooks/useAPI";
import { API_BASE } from "@/lib/config";
// Dev-only cache buster to avoid stale 304 responses while backend is not restarted
const IMG_BUST = import.meta.env.DEV ? `?v=${Date.now()}` : '';
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
// removed content API usage for featured projects

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: projectCategoriesData, isLoading: projectCategoriesLoading } = useProjectCategories();

  const projects = projectsData || [];

  // Normalize image URL and fix malformed stored paths
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
    // If it's just a filename (no slash), assume it should be under uploads/
    if (!p.includes('/')) {
      p = `uploads/${p}`;
    }
    const normalized = p.replace(/^\/+/, '');
    return `${API_BASE}/${normalized}${IMG_BUST}`;
  };

  // Dynamic filters based on backend categories (unified with Projects page)
  const availableCategories = (categoriesData?.length
    ? categoriesData.map(cat => ({
        id: cat.name,
        label: cat.name,
        labelAr: cat.name_ar,
      }))
    : (projectCategoriesData || []).map((category: string) => ({
        id: category,
        label: category,
        labelAr: category,
      }))
  );

  // Compute categories that actually have projects with valid images
  const hasValidImage = (p: any) => Array.isArray(p.images) && p.images.some((img: any) => !!img && String(img).trim() !== '');
  const categoriesWithImages = new Set(
    (projects || [])
      .filter((p: any) => hasValidImage(p) && (p.category || '').trim() !== '')
      .map((p: any) => (p.category || '').toString().trim())
  );
  const filteredAvailableCategories = (availableCategories || []).filter((cat: any) =>
    categoriesWithImages.has((cat.id || '').toString().trim())
  );

  const filters = [
    { id: "all", label: "All Projects", labelAr: "جميع المشاريع" },
    ...filteredAvailableCategories,
  ];

  const filteredProjects = activeFilter === "all" 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  // Ensure active filter remains valid when categories change
  useEffect(() => {
    if (activeFilter !== 'all' && !(filteredAvailableCategories || []).some((c: any) => (c.id || '').toString().trim() === (activeFilter || '').toString().trim())) {
      setActiveFilter('all');
    }
  }, [activeFilter, filteredAvailableCategories]);

  // Show first 4 from filtered list only (no featured logic)
  const DISPLAY_LIMIT = 4;
  const displayProjects = useMemo(() => filteredProjects.slice(0, DISPLAY_LIMIT), [filteredProjects]);

  const isLoadingAll = projectsLoading || categoriesLoading || projectCategoriesLoading;

  if (isLoadingAll) {
    return (
      <section id="portfolio" className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4 text-center">
          <div className="text-lg">Loading projects...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up opacity-0">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('portfolioTitle')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'نعرض أفضل أعمالنا في مجال العمارة والتصميم والهوية التجارية'
              : 'Showcasing our finest work across architecture, design, and branding'
            }
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 fade-in-up opacity-0 stagger-1">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={activeFilter === filter.id ? "default" : "outline"}
              onClick={() => setActiveFilter(filter.id)}
              className="transition-all duration-300"
            >
              {language === 'ar' ? filter.labelAr : filter.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid (limited subset for homepage) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project, index) => (
            <div 
              key={project._id || index}
              dir={language === 'ar' ? 'rtl' : 'ltr'}
              className={`group bg-white rounded-xl border border-primary/10 overflow-hidden elegant-shadow hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 fade-in-up opacity-0 stagger-${(index % 3) + 2}`}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-64 bg-muted/20">
                <img 
                  src={(project.images && project.images.find((img) => !!img && String(img).trim() !== ''))
                        ? toImageUrl(project.images.find((img) => !!img && String(img).trim() !== ''))
                        : portfolio1}
                  alt={language === 'ar' ? (project.title_ar || project.title_en || '') : (project.title_en || project.title_ar || '')}
                  className="w-full h-full object-contain bg-gray-100"
                  onError={(e) => { e.currentTarget.src = portfolio1; }}
                />
                {/* Category Badge */}
                <div className={`absolute top-3 ${language === 'ar' ? 'right-3' : 'left-3'} bg-white/90 text-primary text-xs font-semibold px-3 py-1 rounded-full shadow`}> 
                  {project.category || ''}
                </div>
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    variant="hero" 
                    size="lg"
                    onClick={() => navigate(`/project/${project._id}`)}
                  >
                    <ExternalLink className="mr-2" />
                    {t('viewProject')}
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col gap-2 min-h-[140px]">
                <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2 break-words">
                  {language === 'ar' ? (project.title_ar || project.title_en || '') : (project.title_en || project.title_ar || '')}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3 break-words">
                  {language === 'ar' ? (project.description_ar || project.description_en || '') : (project.description_en || project.description_ar || '')}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 fade-in-up opacity-0 stagger-4">
          <Button variant="cta" size="lg" onClick={() => navigate('/projects')}>
            {language === 'ar' ? 'عرض جميع المشاريع' : 'View All Projects'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
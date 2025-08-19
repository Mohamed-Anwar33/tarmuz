
import { CheckCircle, Users, Award, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAbout } from "@/hooks/useAPI";
import { useState, useEffect, useMemo } from "react";
import { API_BASE } from "@/lib/config";
import aboutBg from "@/assets/about-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";

const About = () => {
  const { t, language } = useLanguage();
  const { data: aboutData, isLoading } = useAbout();
  
  // Normalize and build slides from backend (images[] or CSV in image) with fallback
  const normalizeUrl = (url?: string) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const slides = useMemo(() => {
    const fromArray = (aboutData?.images && aboutData.images.length > 0) ? aboutData.images : [];
    const fromCsv = (!fromArray.length && aboutData?.image)
      ? (aboutData.image.includes(',')
          ? aboutData.image.split(',').map(s => s.trim()).filter(Boolean)
          : [aboutData.image])
      : [];
    const chosen = fromArray.length ? fromArray : fromCsv;
    const normalized = chosen.map(normalizeUrl).filter(Boolean);
    if (normalized.length) return normalized.map(src => ({ src, alt: 'About slide' }));
    // fallback to static assets
    return [
      { src: aboutBg, alt: 'TARMUZ workspace' },
      { src: heroBg, alt: 'TARMUZ projects' },
      { src: portfolio1, alt: 'TARMUZ portfolio 1' },
      { src: portfolio2, alt: 'TARMUZ portfolio 2' },
    ];
  }, [aboutData]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-change images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);
  
  const features = useMemo(() => {
    const af: any = (aboutData as any)?.about_features || {};
    const isAr = language === 'ar';
    return [
      {
        icon: <Target className="w-6 h-6" />,
        title: (isAr ? af?.vision?.title_ar : af?.vision?.title_en) || t('vision'),
        description: (isAr ? af?.vision?.description_ar : af?.vision?.description_en) || t('visionDesc'),
      },
      {
        icon: <Users className="w-6 h-6" />,
        title: (isAr ? af?.team?.title_ar : af?.team?.title_en) || t('team'),
        description: (isAr ? af?.team?.description_ar : af?.team?.description_en) || t('teamDesc'),
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: (isAr ? af?.excellence?.title_ar : af?.excellence?.title_en) || t('excellence'),
        description: (isAr ? af?.excellence?.description_ar : af?.excellence?.description_en) || t('excellenceDesc'),
      },
    ];
  }, [aboutData, language, t]);

  return (
    <section id="about" className="py-20 bg-gradient-subtle relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="fade-in-up opacity-0" data-aos="fade-up">
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 underline-gradient">
                {language === 'ar' 
                  ? (aboutData?.title_ar || t('aboutTitle')) 
                  : (aboutData?.title_en || t('aboutTitle'))}
              </h2>
              <div className="w-20 h-1 bg-accent mb-8"></div>
            </div>

            <div className="fade-in-up opacity-0 stagger-1" data-aos="fade-up" data-aos-delay="100">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {language === 'ar' 
                  ? (aboutData?.description_ar || t('aboutDescription')) 
                  : (aboutData?.description_en || t('aboutDescription'))}
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`text-center fade-in-up opacity-0 stagger-${index + 2}`}
                  data-aos="zoom-in"
                  data-aos-delay={`${(index + 1) * 150}`}
                >
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {feature.icon}
                  </div>
                  <h4 className="font-semibold text-primary mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Image Slideshow */}
          <div className="fade-in-up opacity-0 stagger-2" data-aos="fade-left" data-aos-delay="200">
            <div className="relative overflow-hidden rounded-lg elegant-shadow hover-tilt">
              {/* Image Container */}
              <div className="relative w-full h-[600px]">
                {slides.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                      index === currentImageIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-105'
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20"></div>
                
                {/* Angled Line Overlay */}
                <div className="absolute inset-0 angled-line rounded-lg"></div>
                
                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex
                          ? 'bg-white scale-110'
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {slides.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
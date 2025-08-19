import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHero, useContact } from "@/hooks/useAPI";
import { API_BASE } from "@/lib/config";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const { t, language } = useLanguage();
  const { data: heroData } = useHero();
  const { data: contactData } = useContact();
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const scrollTo = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const normalizeUrl = (url?: string) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const slides = useMemo(() => {
    const imgs = (heroData?.images && heroData.images.length > 0)
      ? heroData.images
      : (heroData?.image
          ? (heroData.image.includes(',')
              ? heroData.image.split(',').map(s => s.trim()).filter(Boolean)
              : [heroData.image])
          : []);
    const normalized = imgs.map(normalizeUrl).filter(Boolean);
    return normalized.length > 0 ? normalized : [heroBg];
  }, [heroData]);

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [slides.length]);

  const whatsappLink = useMemo(() => {
    const raw = contactData?.social?.whatsapp as string | undefined;
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    const digits = (raw || '').replace(/\D/g, '');
    if (!digits) return '';
    const text = encodeURIComponent(language === 'ar' ? 'مرحبًا! أود الاستفسار.' : 'Hello! I would like to inquire.');
    return `https://wa.me/${digits}?text=${text}`;
  }, [contactData?.social?.whatsapp, language]);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {slides.map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt="Hero background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === index ? 'opacity-100 ken-burns' : 'opacity-0'}`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>
        <div className="absolute inset-0 angled-line"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center" data-aos="fade-up" data-aos-delay="100">
        <div className="max-w-4xl mx-auto">
          {/* Title from backend */}
          <div className="mb-8 fade-in-up opacity-0" data-aos="fade-up" data-aos-delay="200">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-wider">
              {language === 'ar' ? (heroData?.title_ar || 'تَرْمُز') : (heroData?.title_en || 'TARMUZ')}
            </h1>
            <div className="w-32 h-1 bg-accent mx-auto mb-6"></div>
          </div>

          {/* Description from backend with fallback */}
          <div className="mb-12 fade-in-up opacity-0 stagger-1" data-aos="fade-up" data-aos-delay="100">
            <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed">
              {language === 'ar' ? (heroData?.description_ar || t('heroTagline')) : (heroData?.description_en || t('heroTagline'))}
            </p>
          </div>

          {/* Inspirational Line from backend with fallback */}
          <div className="mb-10 fade-in-up opacity-0" data-aos="fade-up" data-aos-delay="200">
            <p className="text-3xl md:text-4xl font-extrabold tracking-wide">
              <span className="bg-gradient-to-r from-accent to-white bg-clip-text text-transparent drop-shadow text-shine">
                {language === 'ar'
                  ? (heroData?.content_ar || 'رحلتك من التخطيط إلى التميز')
                  : (heroData?.content_en || 'Your journey from planning to excellence')}
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in-up opacity-0 stagger-3" data-aos="fade-up" data-aos-delay="300">
            <Button variant="hero" size="lg" className="min-w-[200px] hover-tilt" onClick={() => scrollTo('#contact')}>
              <Phone className={language === 'ar' ? 'ml-2' : 'mr-2'} />
              {t('contactUs')}
            </Button>
            <Button variant="cta" size="lg" className="min-w-[200px] hover-tilt" onClick={() => scrollTo('#portfolio')}>
              {t('viewPortfolio')}
            </Button>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      {whatsappLink && (
        <div className={`fixed bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} z-50 fade-in-up opacity-0 stagger-3`}>
          <Button
            variant="hero"
            size="icon"
            className="w-14 h-14 rounded-full floating shadow-2xl glow-pulse"
            onClick={() => window.open(whatsappLink, '_blank')}
            title={language === 'ar' ? 'تحدث معنا عبر واتساب' : 'Chat with us on WhatsApp'}
            aria-label={language === 'ar' ? 'زر واتساب' : 'WhatsApp button'}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
          <div className="w-1 h-3 bg-white/70 rounded-full mx-auto animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
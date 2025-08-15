import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTestimonials } from "@/hooks/useAPI";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { t, language } = useLanguage();
  const { data: testimonialsData, isLoading } = useTestimonials();
  const testimonials = (testimonialsData || []).filter(t => t.status === 'active');

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <div className="text-lg text-white">Loading testimonials...</div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];
  
  if (!currentTestimonial) return null;

  return (
    <section id="testimonials" className="py-20 bg-primary relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 angled-line opacity-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up opacity-0">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('testimonials')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            {t('testimonialsDescription')}
          </p>
        </div>

        {/* Testimonial Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 elegant-shadow fade-in-up opacity-0 stagger-1">
            {/* Stars */}
            <div className="flex justify-center mb-6">
              {[...Array(currentTestimonial.rating)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-accent fill-current" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-center mb-8">
              <p className="text-xl md:text-2xl text-white leading-relaxed italic">
                "{language === 'ar' ? currentTestimonial.quote_ar : currentTestimonial.quote_en}"
              </p>
            </blockquote>

            {/* Author */}
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-1">
                {language === 'ar' ? currentTestimonial.clientName_ar : currentTestimonial.clientName_en}
              </h4>
              <p className="text-white/70">
                {language === 'ar' ? currentTestimonial.position_ar : currentTestimonial.position_en}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center mt-8 gap-4 fade-in-up opacity-0 stagger-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-accent scale-125' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
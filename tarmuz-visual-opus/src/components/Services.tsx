import {
  Building,
  Building2,
  Palette,
  TreePine,
  Map,
  Megaphone,
  Home,
  Hammer,
  Ruler,
  Lightbulb,
  Sofa,
  Paintbrush,
  PenTool,
  Layers,
  Compass,
  Grid2x2,
  Wrench,
  Bed,
  Bath,
  Lamp,
  Factory,
  Mountain,
  Sprout,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useServices } from "@/hooks/useAPI";

const Services = () => {
  const { t, language } = useLanguage();
  const { data: servicesData, isLoading } = useServices();
  const location = useLocation();
  const navigate = useNavigate();
  
  const goToContact = () => {
    if (location.pathname === '/') {
      const el = document.querySelector('#contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#contact');
    }
  };
  
  const iconMap: Record<string, JSX.Element> = {
    // Originals
    interior: <Home className="w-8 h-8" />,
    exterior: <Building className="w-8 h-8" />,
    branding: <Palette className="w-8 h-8" />,
    landscape: <TreePine className="w-8 h-8" />,
    urban: <Map className="w-8 h-8" />,
    social: <Megaphone className="w-8 h-8" />,

    // Additional common options
    architecture: <Building2 className="w-8 h-8" />,
    planning: <Compass className="w-8 h-8" />,
    engineering: <Ruler className="w-8 h-8" />,
    construction: <Hammer className="w-8 h-8" />,
    supervision: <Shield className="w-8 h-8" />,
    renovation: <Wrench className="w-8 h-8" />,
    lighting: <Lightbulb className="w-8 h-8" />,
    furniture: <Sofa className="w-8 h-8" />,
    painting: <Paintbrush className="w-8 h-8" />,
    graphics: <PenTool className="w-8 h-8" />,
    visualization: <Layers className="w-8 h-8" />,
    masterplan: <Grid2x2 className="w-8 h-8" />,
    hospitality: <Bed className="w-8 h-8" />,
    sanitary: <Bath className="w-8 h-8" />,
    fixtures: <Lamp className="w-8 h-8" />,
    industrial: <Factory className="w-8 h-8" />,
    resort: <Mountain className="w-8 h-8" />,
    sustainability: <Sprout className="w-8 h-8" />,
    premium: <Sparkles className="w-8 h-8" />,
  };

  return (
    <section id="services" className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up opacity-0" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {t('servicesTitle')}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="text-center">
            <div className="text-lg">Loading services...</div>
          </div>
        ) : servicesData?.services?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.services.map((service, index) => (
            <div 
              key={index}
              className={`group bg-white rounded-lg p-8 elegant-shadow hover:shadow-2xl transition-all duration-300 hover:transform hover:-translate-y-2 fade-in-up opacity-0 stagger-${(index % 3) + 1} relative overflow-hidden hover-tilt`}
              data-aos="fade-up"
              data-aos-delay={`${(index % 3) * 150 + 100}`}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-12 translate-x-8 -translate-y-8">
                <div className="w-full h-full bg-accent rounded-lg"></div>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-accent group-hover:text-white transition-all duration-300 glow-pulse">
                {iconMap[service.icon || 'interior'] ?? <Home className="w-8 h-8" />}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-primary transition-colors">
                {language === 'ar' ? service.name_ar : service.name_en}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {language === 'ar' ? service.description_ar : service.description_en}
              </p>

              {/* Learn More Button */}
              <Button 
                variant="outline" 
                size="sm"
                className="group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                onClick={goToContact}
              >
                {language === 'ar' ? 'اعرف المزيد' : 'Learn More'}
              </Button>
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-lg">No services available</div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
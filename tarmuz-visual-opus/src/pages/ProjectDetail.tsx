import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, User, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import aboutBg from "@/assets/about-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Mock project data - في التطبيق الحقيقي ستأتي من قاعدة البيانات
  const projects = {
    "1": {
      title: "Luxury Residential Complex",
      titleAr: "مجمع سكني فاخر",
      category: "Architecture",
      categoryAr: "العمارة",
      location: "Dubai Marina",
      locationAr: "مارينا دبي",
      year: "2024",
      client: "Elite Properties",
      clientAr: "شركة العقارات المتميزة",
      description: "A premium residential complex featuring modern luxury apartments with innovative sustainable design, cutting-edge smart home technology, and world-class amenities.",
      descriptionAr: "مجمع سكني متميز يضم شقق فاخرة حديثة بتصميم مستدام مبتكر وتكنولوجيا منزلية ذكية ووسائل راحة عالمية.",
      images: [portfolio1, portfolio2, aboutBg, heroBg],
      features: [
        { en: "Smart Home Integration", ar: "نظام المنزل الذكي" },
        { en: "Sustainable Energy", ar: "طاقة مستدامة" },
        { en: "Premium Amenities", ar: "وسائل راحة فاخرة" },
        { en: "Modern Architecture", ar: "عمارة حديثة" },
      ],
      stats: [
        { label: { en: "Total Area", ar: "المساحة الإجمالية" }, value: "50,000 m²" },
        { label: { en: "Units", ar: "الوحدات" }, value: "120" },
        { label: { en: "Floors", ar: "الطوابق" }, value: "25" },
        { label: { en: "Completion", ar: "نسبة الإنجاز" }, value: "95%" }
      ]
    },
    "2": {
      title: "Corporate Headquarters",
      titleAr: "مقر الشركة الرئيسي",
      category: "Architecture",
      categoryAr: "العمارة",
      location: "Business Bay",
      locationAr: "الخليج التجاري",
      year: "2023",
      client: "TechCorp",
      clientAr: "تك كورب",
      description: "Contemporary office building with cutting-edge design and technology.",
      descriptionAr: "مبنى مكاتب معاصر بتصميم وتكنولوجيا متطورة.",
      images: [portfolio2, aboutBg, portfolio1, heroBg],
      features: [
        { en: "Open Workspaces", ar: "مساحات عمل مفتوحة" },
        { en: "Energy Efficient", ar: "كفاءة الطاقة" },
        { en: "Smart Access", ar: "دخول ذكي" },
        { en: "Conference Halls", ar: "قاعات اجتماعات" },
      ],
      stats: [
        { label: { en: "Total Area", ar: "المساحة الإجمالية" }, value: "25,000 m²" },
        { label: { en: "Floors", ar: "الطوابق" }, value: "18" },
        { label: { en: "Employees", ar: "عدد الموظفين" }, value: "1,500" },
        { label: { en: "Completion", ar: "نسبة الإنجاز" }, value: "100%" },
      ]
    },
    "3": {
      title: "Brand Identity Package",
      titleAr: "حزمة الهوية التجارية",
      category: "Branding",
      categoryAr: "الهوية التجارية",
      location: "Digital",
      locationAr: "رقمي",
      year: "2024",
      client: "Startly",
      clientAr: "ستارتلي",
      description: "Complete brand identity for tech startup including logo and guidelines.",
      descriptionAr: "هوية تجارية كاملة لشركة تكنولوجيا ناشئة تشمل الشعار والإرشادات.",
      images: [aboutBg, portfolio1, portfolio2, heroBg],
      features: [
        { en: "Logo System", ar: "نظام الشعار" },
        { en: "Brand Guidelines", ar: "دليل الهوية" },
        { en: "Typography", ar: "الخطوط" },
        { en: "Color Palette", ar: "لوحة الألوان" },
      ],
      stats: [
        { label: { en: "Deliverables", ar: "المخرجات" }, value: "12+" },
        { label: { en: "Revision Rounds", ar: "جولات المراجعة" }, value: "3" },
        { label: { en: "Duration", ar: "المدة" }, value: "6 weeks" },
        { label: { en: "Satisfaction", ar: "رضا العميل" }, value: "100%" },
      ]
    },
    "4": {
      title: "Urban Park Design",
      titleAr: "تصميم حديقة عامة",
      category: "Landscape",
      categoryAr: "المناظر الطبيعية",
      location: "Al Barsha",
      locationAr: "البرشاء",
      year: "2024",
      client: "City Council",
      clientAr: "مجلس المدينة",
      description: "Sustainable park design promoting community interaction and biodiversity.",
      descriptionAr: "تصميم حديقة مستدامة تعزز التفاعل المجتمعي والتنوع البيولوجي.",
      images: [heroBg, portfolio2, aboutBg, portfolio1],
      features: [
        { en: "Shaded Walkways", ar: "ممرات مظللة" },
        { en: "Play Areas", ar: "مناطق لعب" },
        { en: "Native Plants", ar: "نباتات محلية" },
        { en: "Water Features", ar: "عناصر مائية" },
      ],
      stats: [
        { label: { en: "Park Area", ar: "مساحة الحديقة" }, value: "15,000 m²" },
        { label: { en: "Trees", ar: "عدد الأشجار" }, value: "1,200" },
        { label: { en: "Benches", ar: "المقاعد" }, value: "150" },
        { label: { en: "Completion", ar: "نسبة الإنجاز" }, value: "65%" },
      ]
    },
    "5": {
      title: "Smart City Development",
      titleAr: "تطوير المدينة الذكية",
      category: "Architecture",
      categoryAr: "العمارة",
      location: "MBR City",
      locationAr: "مدينة محمد بن راشد",
      year: "2025",
      client: "GovTech",
      clientAr: "حكومة التقنية",
      description: "Integrated smart city infrastructure with IoT and sustainable technologies.",
      descriptionAr: "بنية تحتية متكاملة للمدينة الذكية مع إنترنت الأشياء وتقنيات مستدامة.",
      images: [portfolio1, heroBg, portfolio2, aboutBg],
      features: [
        { en: "IoT Network", ar: "شبكة إنترنت الأشياء" },
        { en: "Renewables", ar: "طاقة متجددة" },
        { en: "Autonomous Transit", ar: "نقل ذاتي" },
        { en: "Smart Grids", ar: "شبكات ذكية" },
      ],
      stats: [
        { label: { en: "City Area", ar: "مساحة المدينة" }, value: "200,000 m²" },
        { label: { en: "Districts", ar: "الأحياء" }, value: "12" },
        { label: { en: "Stations", ar: "المحطات" }, value: "35" },
        { label: { en: "Phase", ar: "المرحلة" }, value: "Planning" },
      ]
    },
    "6": {
      title: "Hospitality Resort",
      titleAr: "منتجع الضيافة",
      category: "Architecture",
      categoryAr: "العمارة",
      location: "Jumeirah Beach",
      locationAr: "شاطئ الجميرا",
      year: "2024",
      client: "Seabreeze",
      clientAr: "سي بريز",
      description: "Luxury beachfront resort with world-class amenities and sustainable design.",
      descriptionAr: "منتجع فاخر على الشاطئ مع وسائل راحة عالمية وتصميم مستدام.",
      images: [portfolio2, portfolio1, heroBg, aboutBg],
      features: [
        { en: "Private Villas", ar: "فلل خاصة" },
        { en: "Infinity Pools", ar: "مسابح إنفينيتي" },
        { en: "Spa & Wellness", ar: "سبا وعافية" },
        { en: "Beach Access", ar: "وصول للشاطئ" },
      ],
      stats: [
        { label: { en: "Rooms", ar: "الغرف" }, value: "220" },
        { label: { en: "Restaurants", ar: "المطاعم" }, value: "8" },
        { label: { en: "Conference Halls", ar: "قاعات مؤتمرات" }, value: "4" },
        { label: { en: "Completion", ar: "نسبة الإنجاز" }, value: "70%" },
      ]
    },
    "7": {
      title: "Cultural Center",
      titleAr: "المركز الثقافي",
      category: "Architecture",
      categoryAr: "العمارة",
      location: "Al Fahidi",
      locationAr: "الفهيدي",
      year: "2023",
      client: "CultureHub",
      clientAr: "ثقافة هب",
      description: "Modern cultural center celebrating local heritage with contemporary design.",
      descriptionAr: "مركز ثقافي حديث يحتفي بالتراث المحلي بتصميم معاصر.",
      images: [aboutBg, portfolio2, portfolio1, heroBg],
      features: [
        { en: "Exhibition Halls", ar: "صالات عرض" },
        { en: "Workshops", ar: "ورش عمل" },
        { en: "Amphitheater", ar: "مدرج" },
        { en: "Cafeteria", ar: "كافيتيريا" },
      ],
      stats: [
        { label: { en: "Visitors/Year", ar: "زوار/سنة" }, value: "250,000" },
        { label: { en: "Halls", ar: "القاعات" }, value: "6" },
        { label: { en: "Parking", ar: "مواقف" }, value: "300" },
        { label: { en: "Completion", ar: "نسبة الإنجاز" }, value: "100%" },
      ]
    },
    "8": {
      title: "Green Building Initiative",
      titleAr: "مبادرة المباني الخضراء",
      category: "Landscape",
      categoryAr: "المناظر الطبيعية",
      location: "Sustainable City",
      locationAr: "المدينة المستدامة",
      year: "2024",
      client: "EcoWorks",
      clientAr: "إيكو وركس",
      description: "Eco-friendly office complex with vertical gardens and renewable energy.",
      descriptionAr: "مجمع مكاتب صديق للبيئة مع حدائق عمودية وطاقة متجددة.",
      images: [heroBg, aboutBg, portfolio1, portfolio2],
      features: [
        { en: "Vertical Gardens", ar: "حدائق عمودية" },
        { en: "Solar Energy", ar: "طاقة شمسية" },
        { en: "Water Recycling", ar: "إعادة تدوير المياه" },
        { en: "Green Roofs", ar: "أسطح خضراء" },
      ],
      stats: [
        { label: { en: "CO₂ Reduction", ar: "خفض الانبعاثات" }, value: "-35%" },
        { label: { en: "Energy Savings", ar: "توفير الطاقة" }, value: "+40%" },
        { label: { en: "Buildings", ar: "عدد المباني" }, value: "5" },
        { label: { en: "Completion", ar: "نسبة الإنجاز" }, value: "60%" },
      ]
    }
  } as const;

  const project = projects[id as keyof typeof projects];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Project Not Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      const shareData = {
        title: language === 'ar' ? project.titleAr : project.title,
        text: language === 'ar' ? 'اطّلع على هذا المشروع المميز' : 'Check out this featured project',
        url: window.location.href,
      };
      // @ts-ignore - Web Share API optional in desktop
      if (navigator.share) {
        // @ts-ignore
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareData.url);
        alert(language === 'ar' ? 'تم نسخ رابط المشروع إلى الحافظة' : 'Project link copied to clipboard');
      } else {
        // Fallback: create a temporary input
        const input = document.createElement('input');
        input.value = shareData.url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert(language === 'ar' ? 'تم نسخ رابط المشروع إلى الحافظة' : 'Project link copied to clipboard');
      }
    } catch (e) {
      console.error(e);
      alert(language === 'ar' ? 'تعذّر مشاركة المشروع' : 'Unable to share the project');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={project.images[0]} 
            alt={language === 'ar' ? project.titleAr : project.title}
            className="w-full h-full object-cover ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50"></div>
          <div className="absolute inset-0 angled-line"></div>
        </div>

        {/* Back Button */}
        <Button
          variant="hero"
          className="absolute top-28 left-8 z-[60] shadow-lg"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/projects');
            }
          }}
        >
          <ArrowLeft className="mr-2" />
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 fade-in-up opacity-0">
              <span className="inline-block bg-accent text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {language === 'ar' ? project.categoryAr : project.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in-up opacity-0 stagger-1">
              {language === 'ar' ? project.titleAr : project.title}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-6 text-white/90 mb-8 fade-in-up opacity-0 stagger-2">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {language === 'ar' ? project.locationAr : project.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {project.year}
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                {language === 'ar' ? project.clientAr : project.client}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up opacity-0 stagger-3">
              <Button variant="cta" size="lg" onClick={handleShare}>
                <Share2 className="mr-2" />
                {language === 'ar' ? 'مشاركة المشروع' : 'Share Project'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Description */}
              <div className="fade-in-up opacity-0">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                  {language === 'ar' ? 'نظرة عامة على المشروع' : 'Project Overview'}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {language === 'ar' ? project.descriptionAr : project.description}
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      <span className="text-muted-foreground">
                        {language === 'ar' ? feature.ar : feature.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="fade-in-up opacity-0 stagger-1">
                <div className="grid grid-cols-2 gap-6">
                  {project.stats.map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-white rounded-lg elegant-shadow">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {language === 'ar' ? stat.label.ar : stat.label.en}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Call to Action */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white fade-in-up opacity-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === 'ar' ? 'مهتم بمشروع مماثل؟' : 'Interested in a Similar Project?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {language === 'ar' 
                ? 'دعنا نحول رؤيتك إلى واقع مع خبرتنا في التصميم والهندسة'
                : 'Let us turn your vision into reality with our expertise in design and engineering'
              }
            </p>
            <Button variant="cta" size="lg" onClick={() => navigate('/#contact')}>
              {language === 'ar' ? 'ابدأ مشروعك' : 'Start Your Project'}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
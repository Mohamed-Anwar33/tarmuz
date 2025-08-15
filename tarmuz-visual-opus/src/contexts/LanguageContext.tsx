import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    services: "Services",
    portfolio: "Portfolio",
    testimonials: "Testimonials",
    contact: "Contact",
    admin: "Admin",
    
    // Hero
    heroTagline: "Engineering – Design – Identity – Visual Creativity",
    contactUs: "Contact Us",
    viewPortfolio: "View Portfolio",
    
    // About
    aboutTitle: "About TARMUZ",
    aboutDescription: "We lead the future of architectural design and visual creativity through innovative solutions that merge engineering excellence with artistic vision. Our mission is to craft spaces and identities that inspire, combining technical precision with a unique creative touch. With a dedicated team and years of experience, TARMUZ transforms ideas into timeless, functional, and visually striking realities.",
    
    // Services
    servicesTitle: "Our Services",
    architecture: "Architecture",
    branding: "Brand Identity",
    landscape: "Landscape Design",
    planning: "Urban Planning",
    social: "Social Media",
    consulting: "Consulting",
    
    // Portfolio
    portfolioTitle: "Our Portfolio",
    allProjects: "All Projects",
    viewProject: "View Project",
    
    // Contact
    contactTitle: "Contact Us",
    phone: "Phone",
    email: "Email",
    address: "Address",
    
    // Admin
    dashboard: "Dashboard",
    projects: "Projects",
    settings: "Settings",
    users: "Users",
    analytics: "Analytics",
    
    // About Features
    vision: "Vision",
    visionDesc: "Creating innovative spaces that inspire and transform communities",
    team: "Team",
    teamDesc: "Expert architects, designers, and engineers working together",
    excellence: "Excellence",
    excellenceDesc: "Award-winning projects that set new industry standards",
    
    // Services
    interiorArchitecture: "Interior Architecture",
    interiorArchitectureDesc: "Creating functional and aesthetic interior spaces that reflect your lifestyle and needs.",
    exteriorArchitecture: "Exterior Architecture",
    exteriorArchitectureDesc: "Designing striking building facades and structures that make lasting impressions.",
    brandIdentity: "Brand Identity",
    brandIdentityDesc: "Developing comprehensive brand identities including logos, color palettes, and marketing materials.",
    landscapeDesign: "Landscape Design",
    landscapeDesignDesc: "Creating beautiful outdoor spaces that harmonize with nature and architecture.",
    urbanPlanning: "Urban Planning",
    urbanPlanningDesc: "Comprehensive city and community planning for sustainable development.",
    socialMediaManagement: "Social Media Management",
    socialMediaManagementDesc: "Strategic social media presence to showcase your projects and engage your audience.",
    
    // Contact
    contactDescription: "Let's discuss your next project and bring your vision to life",
    sendMessage: "Send us a message",
    yourName: "Your Name",
    yourEmail: "Email",
    phoneNumber: "Phone Number",
    yourMessage: "Your Message",
    sendMessageBtn: "Send Message",
    getInTouch: "Get in touch",
    followUs: "Follow us",
    
    // Testimonials
    testimonialsDescription: "What our clients say about working with TARMUZ",
  },
  ar: {
    // Navigation
    testimonialsDescription: "ماذا يقول عملاؤنا عن العمل مع تَرْمُز",
    home: "الرئيسية",
    about: "من نحن",
    services: "خدماتنا",
    portfolio: "معرض الأعمال",
    testimonials: "آراء العملاء",
    contact: "اتصل بنا",
    admin: "لوحة التحكم",
    
    // Hero
    heroTagline: "الهندسة – التصميم – الهوية – الإبداع البصري",
    contactUs: "اتصل بنا",
    viewPortfolio: "عرض الأعمال",
    
    // About
    aboutTitle: "عن تَرْمُز",
    aboutDescription: "نقود مستقبل التصميم المعماري والإبداع البصري بحلول مبتكرة تجمع بين التميز الهندسي والرؤية الفنية. رسالتنا هي ابتكار مساحات وهويات ملهمة، ندمج فيها الدقة التقنية مع لمسة إبداعية فريدة. وبفريق عمل متخصص وخبرة تمتد لسنوات، تقوم \"تَرْمُز\" بتحويل الأفكار إلى واقع خالد يجمع بين الجمال والوظيفية.",
    
    // Services
    servicesTitle: "خدماتنا",
    architecture: "العمارة",
    branding: "الهوية التجارية",
    landscape: "تصميم المناظر الطبيعية",
    planning: "التخطيط العمراني",
    social: "وسائل التواصل الاجتماعي",
    consulting: "الاستشارات",
    
    // Portfolio
    portfolioTitle: "معرض أعمالنا",
    allProjects: "جميع المشاريع",
    viewProject: "عرض المشروع",
    
    // Contact
    contactTitle: "اتصل بنا",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    
    // Admin
    dashboard: "لوحة التحكم",
    projects: "المشاريع",
    settings: "الإعدادات",
    users: "المستخدمين",
    analytics: "التحليلات",
    
    // About Features
    vision: "الرؤية",
    visionDesc: "إنشاء مساحات مبتكرة تلهم وتحول المجتمعات",
    team: "الفريق",
    teamDesc: "مهندسون معماريون ومصممون وخبراء يعملون معاً",
    excellence: "التميز",
    excellenceDesc: "مشاريع حائزة على جوائز تضع معايير جديدة في الصناعة",
    
    // Services
    interiorArchitecture: "العمارة الداخلية",
    interiorArchitectureDesc: "إنشاء مساحات داخلية وظيفية وجمالية تعكس أسلوب حياتك واحتياجاتك.",
    exteriorArchitecture: "العمارة الخارجية",
    exteriorArchitectureDesc: "تصميم واجهات مباني ومنشآت مذهلة تترك انطباعات دائمة.",
    brandIdentity: "الهوية التجارية",
    brandIdentityDesc: "تطوير هويات تجارية شاملة تشمل الشعارات وأنظمة الألوان ومواد التسويق.",
    landscapeDesign: "تصميم المناظر الطبيعية",
    landscapeDesignDesc: "إنشاء مساحات خارجية جميلة تتناغم مع الطبيعة والعمارة.",
    urbanPlanning: "التخطيط العمراني",
    urbanPlanningDesc: "التخطيط الشامل للمدن والمجتمعات من أجل التنمية المستدامة.",
    socialMediaManagement: "إدارة وسائل التواصل الاجتماعي",
    socialMediaManagementDesc: "وجود استراتيجي على وسائل التواصل الاجتماعي لعرض مشاريعك وإشراك جمهورك.",
    
    // Contact
    contactDescription: "دعنا نناقش مشروعك القادم ونحول رؤيتك إلى واقع",
    sendMessage: "أرسل لنا رسالة",
    yourName: "اسمك",
    yourEmail: "البريد الإلكتروني",
    phoneNumber: "رقم الهاتف",
    yourMessage: "رسالتك",
    sendMessageBtn: "إرسال الرسالة",
    getInTouch: "تواصل معنا",
    followUs: "تابعنا",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  // Apply RTL direction for Arabic
  React.useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
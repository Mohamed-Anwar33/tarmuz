/**
 * DEPRECATED: SiteContentContext
 * -------------------------------------------------------------
 * This legacy context stored static/localStorage-based site content
 * (about/services/portfolio/testimonials/contact) used before the app
 * migrated to live content APIs.
 *
 * Current public pages should consume live data via React Query hooks
 * (e.g., useHero, useServices, useAbout, useContact) backed by the
 * admin/content API, not this context.
 *
 * Action: Do not use in new code. Consider removing this file once
 * confirmed unused across the app to avoid stale content divergence.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import aboutBg from "@/assets/about-bg.jpg";
import heroBg from "@/assets/hero-bg.jpg";

export type LangString = { en: string; ar: string };

export type ServiceItem = {
  id: string;
  icon?: string; // lucide icon name (optional for future), UI still uses existing icons
  title: LangString;
  description: LangString;
};

export type PortfolioProject = {
  id: number;
  category: "architecture" | "branding" | "landscape" | string;
  image?: string; // path or URL
  title: LangString;
  description: LangString;
  location?: LangString;
  year?: string;
  area?: string;
  status?: LangString;
};

export type Testimonial = {
  id: number;
  name: LangString;
  position: LangString;
  content: LangString;
  rating: number;
};

export type ContactInfo = {
  address: LangString;
  phone: string[];
  email: string[];
  social?: { instagram?: string; twitter?: string; linkedin?: string };
};

export type SiteContent = {
  about: {
    title: LangString;
    description: LangString;
    features?: Array<{ title: LangString; description: LangString }>;
  };
  services: ServiceItem[];
  portfolio: { projects: PortfolioProject[] };
  testimonials: Testimonial[];
  contact: ContactInfo;
};

export const DEFAULT_CONTENT: SiteContent = {
  about: {
    title: { en: "About TARMUZ", ar: "من نحن" },
    description: {
      en: "We are TARMUZ: Engineering – Design – Identity – Visual Creativity.",
      ar: "نحن ترمُز: هندسة – تصميم – هوية – إبداع بصري.",
    },
    features: [
      {
        title: { en: "Vision", ar: "الرؤية" },
        description: { en: "Clear vision.", ar: "رؤية واضحة." },
      },
      {
        title: { en: "Team", ar: "الفريق" },
        description: { en: "Expert team.", ar: "فريق محترف." },
      },
      {
        title: { en: "Excellence", ar: "التميز" },
        description: { en: "We aim for excellence.", ar: "نهدف إلى التميز." },
      },
    ],
  },
  services: [
    {
      id: "interior",
      title: { en: "Interior Architecture", ar: "الهندسة الداخلية" },
      description: {
        en: "Interior solutions that balance function and beauty.",
        ar: "حلول داخلية توازن بين الوظيفة والجمال.",
      },
    },
    {
      id: "exterior",
      title: { en: "Exterior Architecture", ar: "الهندسة الخارجية" },
      description: {
        en: "Modern, sustainable facades and structures.",
        ar: "واجهات وهياكل حديثة ومستدامة.",
      },
    },
    {
      id: "branding",
      title: { en: "Brand Identity", ar: "الهوية التجارية" },
      description: {
        en: "Logos, guidelines, and cohesive brands.",
        ar: "شعارات وإرشادات وهوية متماسكة.",
      },
    },
    {
      id: "landscape",
      title: { en: "Landscape Design", ar: "تصميم المناظر الطبيعية" },
      description: {
        en: "Green spaces that inspire.",
        ar: "مساحات خضراء ملهمة.",
      },
    },
    {
      id: "urban",
      title: { en: "Urban Planning", ar: "التخطيط الحضري" },
      description: {
        en: "Human-centered urban experiences.",
        ar: "تجارب حضرية تتمحور حول الإنسان.",
      },
    },
    {
      id: "social",
      title: { en: "Social Media Management", ar: "إدارة وسائل التواصل" },
      description: {
        en: "Grow and engage your audience.",
        ar: "نمِّ جمهورك وتفاعل معه.",
      },
    },
  ],
  portfolio: {
    projects: [
      {
        id: 1,
        category: "architecture",
        title: { en: "Luxury Residential Complex", ar: "مجمع سكني فاخر" },
        description: {
          en: "Modern luxury apartments with innovative design and sustainable features.",
          ar: "شقق سكنية فاخرة حديثة بتصميم مبتكر وميزات مستدامة.",
        },
        image: portfolio1,
        location: { en: "Dubai Marina", ar: "مارينا دبي" },
        year: "2024",
        area: "50,000 sqm",
        status: { en: "Completed", ar: "مكتمل" }
      },
      {
        id: 2,
        category: "architecture", 
        title: { en: "Corporate Headquarters", ar: "مقر الشركة الرئيسي" },
        description: {
          en: "Contemporary office building with cutting-edge design and technology.",
          ar: "مبنى مكاتب معاصر بتصميم وتكنولوجيا متطورة.",
        },
        image: portfolio2,
        location: { en: "Business Bay", ar: "الخليج التجاري" },
        year: "2023",
        area: "25,000 sqm", 
        status: { en: "Completed", ar: "مكتمل" }
      },
      {
        id: 6,
        category: "architecture",
        title: { en: "Hospitality Resort", ar: "منتجع الضيافة" },
        description: {
          en: "Luxury beachfront resort with world-class amenities and sustainable design.",
          ar: "منتجع فاخر على الشاطئ مع وسائل الراحة العالمية والتصميم المستدام.",
        },
        image: portfolio2,
        location: { en: "Jumeirah Beach", ar: "شاطئ الجميرا" },
        year: "2024",
        area: "75,000 sqm",
        status: { en: "In Progress", ar: "قيد التنفيذ" }
      },
      {
        id: 7,
        category: "architecture",
        title: { en: "Cultural Center", ar: "المركز الثقافي" },
        description: {
          en: "Modern cultural center celebrating local heritage with contemporary design.",
          ar: "مركز ثقافي حديث يحتفي بالتراث المحلي بتصميم معاصر.",
        },
        image: aboutBg,
        location: { en: "Al Fahidi", ar: "الفهيدي" },
        year: "2023",
        area: "12,000 sqm",
        status: { en: "Completed", ar: "مكتمل" }
      },
      {
        id: 3,
        category: "branding",
        title: { en: "Brand Identity Package", ar: "حزمة الهوية التجارية" },
        description: {
          en: "Complete brand identity for tech startup including logo and guidelines.",
          ar: "هوية تجارية كاملة لشركة تكنولوجيا ناشئة تشمل الشعار والإرشادات.",
        },
        image: aboutBg,
        location: { en: "Digital", ar: "رقمي" },
        year: "2024",
        area: "Brand Suite",
        status: { en: "Completed", ar: "مكتمل" }
      },
      {
        id: 4,
        category: "landscape",
        title: { en: "Urban Park Design", ar: "تصميم حديقة عامة" },
        description: {
          en: "Sustainable park design promoting community interaction and biodiversity.",
          ar: "تصميم حديقة مستدامة تعزز التفاعل المجتمعي والتنوع البيولوجي.",
        },
        image: heroBg,
        location: { en: "Al Barsha", ar: "البرشاء" },
        year: "2024",
        area: "15,000 sqm",
        status: { en: "In Progress", ar: "قيد التنفيذ" }
      },
    ],
  },
  testimonials: [
    {
      id: 1,
      name: { en: "Ahmed Al-Mansouri", ar: "أحمد المنصوري" },
      position: { en: "CEO, Urban Development Co.", ar: "المدير التنفيذي، شركة التطوير العمراني" },
      content: {
        en: "TARMUZ transformed our vision into reality with exceptional creativity and professionalism.",
        ar: "حولت تَرْمُز رؤيتنا إلى واقع بإبداع واحترافية استثنائيين.",
      },
      rating: 5,
    },
    {
      id: 2,
      name: { en: "Sarah Wilson", ar: "سارة ويلسون" },
      position: { en: "Brand Manager, Tech Solutions", ar: "مدير العلامة التجارية، حلول التكنولوجيا" },
      content: {
        en: "The brand identity package TARMUZ created perfectly captured our essence.",
        ar: "حزمة الهوية التجارية من تَرْمُز التقطت جوهرنا بشكل مثالي.",
      },
      rating: 5,
    },
  ],
  contact: {
    address: { en: "123 Design Street, Architecture District", ar: "الرياض، المملكة العربية السعودية" },
    phone: ["+966 11 234 5678", "+966 50 123 4567"],
    email: ["info@tarmuz.com", "projects@tarmuz.com"],
    social: {},
  },
};

const STORAGE_KEY = "siteContent_v3";

type SiteContentContextValue = {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  resetToDefault: () => void;
};

const SiteContentContext = createContext<SiteContentContextValue | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SiteContent) : DEFAULT_CONTENT;
    } catch {
      return DEFAULT_CONTENT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch {}
  }, [content]);

  const value = useMemo(() => ({ content, setContent, resetToDefault: () => setContent(DEFAULT_CONTENT) }), [content]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used within SiteContentProvider");
  return ctx;
};

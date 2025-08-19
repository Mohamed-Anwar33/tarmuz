import { MapPin, Phone, Mail, Instagram, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import logoFallback from "@/assets/logo.png";
import { useContact } from "@/hooks/useAPI";
import { useBranding } from "@/hooks/useAPI";
import { API_BASE } from "@/lib/config";

const Footer = () => {
  const { t, language } = useLanguage();
  const { data: contactData } = useContact();
  const { data: branding } = useBranding();
  const address = language === 'ar' ? (contactData?.contact?.address_ar || '') : (contactData?.contact?.address_en || '');
  const phone = contactData?.contact?.phone || '';
  const email = contactData?.contact?.email || '';
  const social = contactData?.social || {} as any;
  const resolveUrl = (u?: string) => {
    const v = (u || '').trim();
    if (!v) return '';
    if (v.startsWith('http://') || v.startsWith('https://') || v.startsWith('data:')) return v;
    const path = v.startsWith('/') ? v : `/${v}`;
    return `${API_BASE}${path}`;
  };
  const logoSrc = branding?.logoUrl ? resolveUrl(branding.logoUrl) : logoFallback;
  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 angled-line opacity-5"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" aria-label="Go to home" className="inline-block mb-4">
                <img src={logoSrc} alt="TARMUZ" className="h-12 w-auto hover:scale-105 transition-transform" />
              </Link>
              <p className="text-white/80 leading-relaxed mb-6">
                {t('heroTagline')}
              </p>
              <p className="text-white/80 leading-relaxed">
                {language === 'ar'
                  ? 'تَرْمُز هي شريكك في إنشاء مساحات استثنائية وتجارب علامة تجارية مؤثرة تدوم مع الزمن.'
                  : 'TARMUZ is your partner in creating exceptional spaces and compelling brand experiences that stand the test of time.'}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6">{language === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
              <ul className="space-y-3">
                <li><Link to="/#about" className="text-white/80 hover:text-accent transition-colors">{t('about')}</Link></li>
                <li><Link to="/#services" className="text-white/80 hover:text-accent transition-colors">{t('services')}</Link></li>
                <li><Link to="/#portfolio" className="text-white/80 hover:text-accent transition-colors">{t('portfolio')}</Link></li>
                <li><Link to="/#contact" className="text-white/80 hover:text-accent transition-colors">{t('contact')}</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-semibold mb-6">{t('contact')}</h4>
              <div className="space-y-4">
                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-white/80 text-sm">{address}</p>
                  </div>
                )}
                {phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent flex-shrink-0" />
                    <a href={`tel:${phone}`} className="text-white/80 text-sm hover:text-accent transition-colors">{phone}</a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                    <a href={`mailto:${email}`} className="text-white/80 text-sm hover:text-accent transition-colors">{email}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media & Copyright */}
          <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4 mb-4 md:mb-0">
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {social?.twitter && (
                <a href={social.twitter} target="_blank" rel="noreferrer" aria-label="Twitter" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {social?.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
            <p className="text-white/60 text-sm text-center">
              {language === 'ar' ? '© 2024 تَرْمُز. جميع الحقوق محفوظة.' : '© 2024 TARMUZ. All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
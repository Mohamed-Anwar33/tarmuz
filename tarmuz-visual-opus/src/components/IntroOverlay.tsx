import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const IntroOverlay = () => {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("introSeen");
    if (!seen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => dismiss(), 2600);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setLeaving(true);
    localStorage.setItem("introSeen", "1");
    setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = '';
    }, 600);
  };

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-primary/95 intro-overlay ${leaving ? 'intro-fade-out' : ''}`}>
      <div className="text-center px-6">
        <div className="mb-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-widest text-white intro-logo">
            {language === 'ar' ? 'تَرْمُز' : 'TARMUZ'}
          </h1>
        </div>
        <p className="text-white/90 text-lg md:text-2xl font-light intro-subtitle">
          {language === 'ar' ? 'هندسة، تصميم، وهوية بصرية' : 'Engineering, Design, and Visual Identity'}
        </p>
        <button
          onClick={dismiss}
          className="mt-8 text-white/80 hover:text-white text-sm underline underline-offset-4"
          aria-label={language === 'ar' ? 'تخطي المقدمة' : 'Skip intro'}
        >
          {language === 'ar' ? 'تخطي' : 'Skip'}
        </button>
      </div>
    </div>
  );
};

export default IntroOverlay;

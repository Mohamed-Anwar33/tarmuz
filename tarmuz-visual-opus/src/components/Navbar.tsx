import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { key: 'home', href: '#home' },
    { key: 'about', href: '#about' },
    { key: 'services', href: '#services' },
    { key: 'portfolio', href: '#portfolio' },
    { key: 'testimonials', href: '#testimonials' },
    { key: 'contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    if (location.pathname === '/') {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // fallback to hash to allow default browser behavior
        window.location.hash = href.replace('#', '');
      }
      setIsOpen(false);
    } else {
      navigate(`/${href}`);
      setIsOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      (location.pathname === '/' && !isScrolled)
        ? 'bg-transparent'
        : 'bg-white/95 backdrop-blur-md shadow-lg teal-shadow'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <button
            aria-label="Go to home"
            className="flex items-center focus:outline-none"
            onClick={() => {
              if (location.pathname !== '/') {
                navigate('/');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <img 
              src={logo} 
              alt="TARMUZ" 
              className={`h-12 w-auto transition-all duration-300 hover:scale-105 cursor-pointer ${
                (location.pathname === '/' && !isScrolled) ? '' : 'brightness-0 saturate-100'
              }`}
            />
          </button>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center ${language === 'ar' ? 'space-x-reverse space-x-8' : 'space-x-8'}`}>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className={`relative text-sm font-medium transition-all duration-300 hover:scale-105 group ${
                  (location.pathname === '/' && !isScrolled) ? 'text-white hover:text-accent' : 'text-primary hover:text-accent'
                }`}
              >
                {t(item.key)}
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                  (location.pathname === '/' && !isScrolled) ? 'bg-white' : 'bg-accent'
                }`}></span>
              </button>
            ))}
          </div>

          {/* Language & Mobile Menu */}
          <div className={`flex items-center ${language === 'ar' ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className={`transition-all duration-300 ${
                (location.pathname === '/' && !isScrolled)
                  ? 'text-white hover:text-accent hover:bg-white/10'
                  : 'text-primary hover:text-accent hover:bg-accent/10'
              }`}
            >
              <Globe className={`w-4 h-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {language === 'en' ? 'العربية' : 'English'}
            </Button>

            {/** Admin access removed */}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden transition-colors duration-300 ${
                (location.pathname === '/' && !isScrolled) ? 'text-white' : 'text-primary'
              }`}
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-t border-accent/20">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.href)}
                    className={`text-primary hover:text-accent transition-colors duration-300 ${language === 'ar' ? 'text-right' : 'text-left'} py-2 text-lg font-medium`}
                  >
                    {t(item.key)}
                  </button>
                ))}
                {/** Admin access removed (mobile) */}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
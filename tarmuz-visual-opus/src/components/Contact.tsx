import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useContact } from "@/hooks/useAPI";
import { apiFetch } from "@/lib/api";
import { MapPin, Phone, Mail, Instagram, Twitter, Linkedin, Facebook, Youtube, MessageCircle, Send, Camera, Palette, Dribbble } from "lucide-react";
import Map from './Map';

const Contact = () => {
  const { t, language } = useLanguage();
  const { data: contactData, isLoading } = useContact();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setFormStatus('success');
      setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
    } catch (error) {
      setFormStatus('error');
      console.error('Failed to submit contact form:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up opacity-0">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {language === 'ar' ? (contactData?.title_ar || t('contactTitle')) : (contactData?.title_en || t('contactTitle'))}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' ? (contactData?.description_ar || t('contactDescription')) : (contactData?.description_en || t('contactDescription'))}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="fade-in-up opacity-0 stagger-1">
            <div className="bg-white rounded-2xl p-8 elegant-shadow">
              <h3 className="text-2xl font-bold text-primary mb-6">{t('sendMessage')}</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input type="text" name="name" placeholder={t('yourName')} value={formData.name} onChange={handleChange} required className="h-12" />
                  <Input type="email" name="email" placeholder={t('yourEmail')} value={formData.email} onChange={handleChange} required className="h-12" />
                </div>
                <Input type="tel" name="phone" placeholder={t('phoneNumber')} value={formData.phone} onChange={handleChange} className="h-12" />
                <Textarea name="message" placeholder={t('yourMessage')} value={formData.message} onChange={handleChange} required rows={5} />
                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={formStatus === 'loading'}>
                  {formStatus === 'loading' ? t('sending') : t('sendMessageBtn')}
                </Button>
                {formStatus === 'success' && <p className="text-green-600">{t('messageSentSuccess')}</p>}
                {formStatus === 'error' && <p className="text-red-600">{t('messageSentError')}</p>}
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="fade-in-up opacity-0 stagger-2">
            <div className="space-y-8">
              {/* Contact Details from backend */}
              <div className="bg-white rounded-2xl p-8 elegant-shadow">
                <h3 className="text-2xl font-bold text-primary mb-6">{t('getInTouch')}</h3>
                <div className="space-y-6">
                  {contactData?.contact?.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{contactData.contact.email}</p>
                      </div>
                    </div>
                  )}
                  {contactData?.contact?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{contactData.contact.phone}</p>
                      </div>
                    </div>
                  )}
                  {contactData?.contact?.address_ar && (
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">{language === 'ar' ? contactData.contact.address_ar : contactData.contact.address_en}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-8 elegant-shadow">
                <h3 className="text-xl font-bold text-primary mb-6">{t('followUs')}</h3>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {contactData?.social?.instagram && (
                    <a href={contactData.social.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                      <Button variant="outline" size="icon" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all">
                        <Instagram className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.facebook && (
                    <a href={contactData.social.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                      <Button variant="outline" size="icon" className="hover:bg-blue-600 hover:text-white transition-all">
                        <Facebook className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.twitter && (
                    <a href={contactData.social.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                      <Button variant="outline" size="icon" className="hover:bg-blue-500 hover:text-white transition-all">
                        <Twitter className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.linkedin && (
                    <a href={contactData.social.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                      <Button variant="outline" size="icon" className="hover:bg-blue-700 hover:text-white transition-all">
                        <Linkedin className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.youtube && (
                    <a href={contactData.social.youtube} target="_blank" rel="noopener noreferrer" title="YouTube">
                      <Button variant="outline" size="icon" className="hover:bg-red-600 hover:text-white transition-all">
                        <Youtube className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.tiktok && (
                    <a href={contactData.social.tiktok} target="_blank" rel="noopener noreferrer" title="TikTok">
                      <Button variant="outline" size="icon" className="hover:bg-black hover:text-white transition-all">
                        <Camera className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.whatsapp && (
                    <a href={contactData.social.whatsapp} target="_blank" rel="noopener noreferrer" title="WhatsApp">
                      <Button variant="outline" size="icon" className="hover:bg-green-600 hover:text-white transition-all">
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.telegram && (
                    <a href={contactData.social.telegram} target="_blank" rel="noopener noreferrer" title="Telegram">
                      <Button variant="outline" size="icon" className="hover:bg-blue-500 hover:text-white transition-all">
                        <Send className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.snapchat && (
                    <a href={contactData.social.snapchat} target="_blank" rel="noopener noreferrer" title="Snapchat">
                      <Button variant="outline" size="icon" className="hover:bg-yellow-500 hover:text-white transition-all">
                        <Camera className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.pinterest && (
                    <a href={contactData.social.pinterest} target="_blank" rel="noopener noreferrer" title="Pinterest">
                      <Button variant="outline" size="icon" className="hover:bg-red-600 hover:text-white transition-all">
                        <Palette className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.behance && (
                    <a href={contactData.social.behance} target="_blank" rel="noopener noreferrer" title="Behance">
                      <Button variant="outline" size="icon" className="hover:bg-blue-600 hover:text-white transition-all">
                        <Palette className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                  {contactData?.social?.dribbble && (
                    <a href={contactData.social.dribbble} target="_blank" rel="noopener noreferrer" title="Dribbble">
                      <Button variant="outline" size="icon" className="hover:bg-pink-600 hover:text-white transition-all">
                        <Dribbble className="w-5 h-5" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>

              {/* Map Container */}
              <div className="bg-muted rounded-2xl h-80 overflow-hidden">
                {contactData?.location?.lat && contactData?.location?.lng ? (
                  <Map 
                    lat={contactData.location.lat} 
                    lng={contactData.location.lng}
                    title={language === 'ar' ? (contactData?.title_ar || 'موقعنا') : (contactData?.title_en || 'Our Location')}
                    address={language === 'ar' ? contactData?.contact?.address_ar : contactData?.contact?.address_en}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-muted-foreground">{language === 'ar' ? 'لم يتم تحديد الموقع' : 'Location not set'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
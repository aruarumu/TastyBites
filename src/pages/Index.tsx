import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import ReservationSection from '@/components/ReservationSection';
import ScrollToTop from '@/components/ScrollToTop';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MenuSection />
        <AboutSection />
        <ContactSection />
        <ReservationSection />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;

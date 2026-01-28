import { Play, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  const stats = [
    { value: '500+', label: 'Restaurants' },
    { value: '10K', label: 'Happy Customers' },
    { value: '15min', label: 'Fast Delivery' },
  ];

  // Vanilla JS scroll to menu section
  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleWatchVideo = () => {
    // Vanilla JS alert/modal trigger
    alert('Video feature coming soon!');
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 items-center">
          {/* Left Content */}
          <div className="slide-up">

            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Delicious Food{' '}
              <span className="text-gradient">Delivered Fast</span>
              <br />
              To Your Door
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8 max-w-lg">
              Experience the finest culinary delights from top restaurants, delivered hot and fresh right to your doorstep within minutes.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button size="lg" className="gap-2 px-8 glow-orange" onClick={scrollToMenu}>
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="gap-2" onClick={handleWatchVideo}>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
                Watch Video
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Image */}
              <div className="inset-0 overflow-hidden border-primary/20 float">
                <img
                  src="https://tasty-bites-rust.vercel.app/assets/chiken-6DFDDlVR.png"
                  alt="Delicious food"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Rating Badge */}
              <div className="absolute top-8 right-0 bg-card p-4 rounded-2xl shadow-xl border border-border fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-bold text-lg">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>

              {/* Delivery Badge */}
              <div className="absolute bottom-20 -left-10 bg-card p-4 rounded-2xl shadow-xl border border-border fade-in" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">15 min</p>
                    <p className="text-xs text-muted-foreground">Delivery</p>
                  </div>
                </div>
              </div>

              {/* Free Delivery Badge */}
              <div className="absolute bottom-0 right-10 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium fade-in" style={{ animationDelay: '0.7s' }}>
                Free Delivery
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

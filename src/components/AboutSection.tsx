import { ChefHat, Leaf, Truck, Check } from 'lucide-react';

const AboutSection = () => {
  // Section with scroll-margin for smooth navigation
  const features = [
    { icon: ChefHat, label: 'Expert Chefs' },
    { icon: Leaf, label: 'Quality Ingredients' },
    { icon: Truck, label: 'Fast Delivery' },
  ];

  const highlights = [
    'Fresh ingredients used daily',
    'Prepared by expert chefs',
    'Delivered hot and fresh',
  ];

  return (
    <section id="about" className="py-20 bg-card/50 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://tasty-bites-rust.vercel.app/assets/biriyani-BrzFuepm.png"
                alt="Our kitchen"
                className="w-full h-full object-cover"
              />
              
              {/* Experience Badge */}
              <div className="absolute bottom-6 left-6 bg-primary text-primary-foreground px-6 py-4 rounded-2xl">
                <div className="text-3xl font-bold">15+</div>
                <div className="text-sm">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              We Provide the <span className="text-gradient">Best Quality</span> Food for You
            </h2>
            <p className="text-muted-foreground mb-6">
              At TastyBites, we believe that great food brings people together. Our passionate 
              team of chefs crafts every dish with love, using only the freshest ingredients 
              to deliver culinary experiences that delight.
            </p>
            <p className="text-muted-foreground mb-8">
              From traditional recipes passed down through generations to modern culinary 
              innovations, we offer a diverse menu that caters to every palate. Our commitment 
              to quality and customer satisfaction has made us the top choice for food delivery.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <ul className="space-y-3">
              {highlights.map(item => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

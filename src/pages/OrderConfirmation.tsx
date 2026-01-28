import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const OrderConfirmation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-primary flex items-center justify-center bounce-in">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4 fade-in">
                Order Confirmed!
              </h1>

              <p className="text-muted-foreground mb-8 fade-in" style={{ animationDelay: '0.2s' }}>
                Thank you for your order 🎉 Your delicious food is being prepared and will be delivered soon.
              </p>

              <Link to="/">
                <Button className="px-8 fade-in" style={{ animationDelay: '0.4s' }}>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default OrderConfirmation;

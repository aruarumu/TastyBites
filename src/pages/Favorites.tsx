import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { foods } from '@/data/foods';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import FoodCard from '@/components/FoodCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const Favorites = () => {
  const { favorites } = useCart();
  const favoriteFoods = foods.filter(food => favorites.includes(food.id));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            Your <span className="text-primary">Favorites</span>
          </h1>

          {favoriteFoods.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-6">No favorites yet</p>
              <Link to="/">
                <Button>Browse Menu</Button>
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteFoods.map((food, index) => (
                <div
                  key={food.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <FoodCard food={food} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Favorites;

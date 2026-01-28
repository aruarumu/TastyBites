import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Star, Clock, Minus, Plus, ShoppingCart } from 'lucide-react';
import { getFoodById } from '@/data/foods';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { toast } from 'sonner';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const food = getFoodById(Number(id));
  const { addToCart, favorites, toggleFavorite } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!food) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Food not found</h1>
          <Button onClick={() => navigate('/')}>Go back home</Button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.includes(food.id);
  const totalPrice = food.price * quantity;

  const handleAddToCart = () => {
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      category: food.category,
    }, quantity);
    toast.success(`${food.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      category: food.category,
    }, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />

                {/* Special Price Badge */}
                {food.isSpecial && food.originalPrice && (
                  <div className="absolute top-6 left-6 w-24 h-24">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 border-2 border-dashed border-primary rounded-full" style={{ animation: 'spin 10s linear infinite' }} />
                      <div className="absolute inset-3 bg-background rounded-full flex flex-col items-center justify-center">
                        <span className="text-xs text-primary">Special Price</span>
                        <span className="text-lg font-bold text-primary">${food.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(food.id)}
                  className={`absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isFavorite
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="fade-in">
              <span className="inline-block px-4 py-1 bg-primary text-primary-foreground text-sm rounded-full mb-4">
                {food.category}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{food.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="font-semibold">{food.rating}</span>
                  <span className="text-muted-foreground">({food.reviews}+ reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <span>{food.prepTime}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{food.description}</p>

              <div className="text-3xl font-bold text-primary mb-8">
                ${food.price.toFixed(2)}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-muted-foreground">Quantity:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[200px] gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1 min-w-[200px]"
                >
                  Buy Now - ${food.price.toFixed(2)}
                </Button>
              </div>

              {/* Total */}
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total for {quantity} item(s):</span>
                  <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FoodDetail;

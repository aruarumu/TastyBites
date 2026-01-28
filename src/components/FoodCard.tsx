import { Link } from 'react-router-dom';
import { Heart, Star, Clock, ShoppingCart } from 'lucide-react';
import { Food } from '@/data/foods';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface FoodCardProps {
  food: Food;
}

const FoodCard = ({ food }: FoodCardProps) => {
  const { addToCart, favorites, toggleFavorite } = useCart();
  const isFavorite = favorites.includes(food.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: food.id,
      name: food.name,
      price: food.price,
      image: food.image,
      category: food.category,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(food.id);
  };

  return (
    <Link to={`/food/${food.id}`} className="block">
      <div className="bg-card rounded-2xl overflow-hidden border border-border card-hover group">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Category Badge */}
          <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {food.category}
          </span>

          {/* Special Price Badge */}
          {food.isSpecial && food.originalPrice && (
            <div className="absolute top-3 right-14 w-16 h-16">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 border-2 border-dashed border-primary rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
                <div className="absolute inset-2 bg-background rounded-full flex flex-col items-center justify-center">
                  <span className="text-[8px] text-primary">Special Price</span>
                  <span className="text-xs font-bold text-primary">${food.originalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Rating & Time */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3">
            <span className="flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
              <Star className="w-3 h-3 text-primary fill-primary" />
              {food.rating}
            </span>
            <span className="flex items-center gap-1 px-2 py-1 bg-background/80 backdrop-blur-sm rounded-full text-xs">
              <Clock className="w-3 h-3" />
              {food.prepTime}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
            {food.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {food.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-primary">${food.price.toFixed(2)}</span>
            <Button
              size="icon"
              onClick={handleAddToCart}
              className="w-10 h-10 rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FoodCard;

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { foods, categories } from '@/data/foods';
import FoodCard from './FoodCard';

const MenuSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with URL params (vanilla JS style state sync)
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && categories.includes(category)) {
      setActiveCategory(category);
    } else if (!category) {
      setActiveCategory('All');
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  // Vanilla JS debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredFoods = foods.filter(food => {
    const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 scroll-mt-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider">Our Menu</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Explore Our <span className="text-gradient">Delicious Foods</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From sizzling pizzas to aromatic biryanis, we've got something for every craving.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for your favorite food..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-card border border-border hover:border-primary hover:text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food, index) => (
            <div
              key={food.id}
              className="fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <FoodCard food={food} />
            </div>
          ))}
        </div>

        {filteredFoods.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No foods found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuSection;

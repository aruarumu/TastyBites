import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { categories } from '@/data/foods';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFoodsOpen, setIsFoodsOpen] = useState(false);
  const { totalItems, favorites } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Vanilla JS scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside (vanilla JS approach)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFoodsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smooth scroll to section (vanilla JS)
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleCategoryClick = (category: string) => {
    setIsFoodsOpen(false);
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate(`/?category=${category}`);
    } else {
      // Scroll to menu section and filter will be handled via URL
      navigate(`/?category=${category}`);
      setTimeout(() => {
        const element = document.getElementById('menu');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-2xl">🍔</span>
            </div>
            <span className="text-xl font-bold">
              Tasty<span className="text-primary">Bites</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Home
            </Link>
            
            {/* Foods Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsFoodsOpen(!isFoodsOpen)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Foods
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFoodsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFoodsOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-card rounded-lg shadow-xl border border-border overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                  {categories.filter(c => c !== 'All').map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="block w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => scrollToSection('about')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
            <button
              onClick={() => scrollToSection('reservation')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Book Table
            </button>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <Link
              to="/favorites"
              className="relative p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {favorites.length}
                </span>
              )}
            </Link>
            
            <Link
              to="/cart"
              className="relative p-2 hover:bg-muted rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Home
              </Link>
              <button
                onClick={() => scrollToSection('about')}
                className="px-4 py-2 rounded-lg transition-colors hover:bg-muted text-left"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="px-4 py-2 rounded-lg transition-colors hover:bg-muted text-left"
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('reservation')}
                className="px-4 py-2 rounded-lg transition-colors hover:bg-muted text-left"
              >
                Book Table
              </button>
              <div className="px-4 py-2">
                <span className="text-sm font-medium text-muted-foreground">Categories</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.filter(c => c !== 'All').map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="px-3 py-1 text-sm bg-muted rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

export interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  prepTime: string;
  isSpecial?: boolean;
}

export const categories = ['All', 'Pizza', 'Burger', 'Biryani', 'Drinks', 'Dessert'];

export const foods: Food[] = [
  {
    id: 1,
    name: 'Burger',
    description: 'Grilled beef patty stacked with mashed potato wedges, served with...',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Burger',
    rating: 4.8,
    reviews: 95,
    prepTime: '25 min',
  },
  {
    id: 2,
    name: 'Chicken Biryani',
    description: 'Aromatic basmati rice served with tender chicken pieces, infused with...',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    category: 'Biryani',
    rating: 4.5,
    reviews: 120,
    prepTime: '35 min',
  },
  {
    id: 3,
    name: 'Classic Burger Combo',
    description: 'Juicy beef patty with fresh vegetables, melted cheese, crispy fries and a refreshing cola.',
    price: 11.99,
    originalPrice: 10.99,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop',
    category: 'Burger',
    rating: 4.7,
    reviews: 120,
    prepTime: '20 min',
    isSpecial: true,
  },
  {
    id: 4,
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, basil, and olive...',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop',
    category: 'Pizza',
    rating: 4.6,
    reviews: 85,
    prepTime: '30 min',
  },
  {
    id: 5,
    name: 'Pepperoni Pizza',
    description: 'Loaded with rich pepperoni, melted mozzarella cheese on our...',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    category: 'Pizza',
    rating: 4.8,
    reviews: 110,
    prepTime: '30 min',
  },
  {
    id: 6,
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice with mixed vegetables, aromatic spices, and rich...',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
    category: 'Biryani',
    rating: 4.4,
    reviews: 75,
    prepTime: '30 min',
  },
  {
    id: 7,
    name: 'Mango Smoothie',
    description: 'Fresh tropical mango blended with creamy yogurt and a hint of honey.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop',
    category: 'Drinks',
    rating: 4.7,
    reviews: 60,
    prepTime: '5 min',
  },
  {
    id: 8,
    name: 'Chocolate Brownie',
    description: 'Rich, fudgy chocolate brownie topped with vanilla ice cream and chocolate...',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400&h=300&fit=crop',
    category: 'Dessert',
    rating: 4.9,
    reviews: 140,
    prepTime: '10 min',
  },
];

export const getFoodById = (id: number) => foods.find(f => f.id === id);

export const PRODUCTS = [
  // ── COFFEE ──────────────────────────────────────────────────────────────────
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Coffee',
    price: 4.50,
    rating: 4.9,
    reviewCount: 312,
    description: 'Rich espresso blended with perfectly steamed milk and a deep layer of velvety foam. A classic Italian masterpiece.',
    ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=800',
    popular: true,
    badge: 'Best Seller',
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  {
    id: 'caramel-latte',
    name: 'Caramel Latte',
    category: 'Coffee',
    price: 5.00,
    rating: 4.8,
    reviewCount: 278,
    description: 'Smooth espresso, silky steamed milk, and a generous drizzle of house-made caramel syrup. Indulgent and comforting.',
    ingredients: ['Espresso', 'Steamed Milk', 'Caramel Syrup'],
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800',
    popular: true,
    badge: 'Popular',
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  {
    id: 'mocha',
    name: 'Dark Mocha',
    category: 'Coffee',
    price: 5.25,
    rating: 4.7,
    reviewCount: 195,
    description: 'Espresso intertwined with rich dark chocolate, steamed milk, and a swirl of whipped cream. Pure indulgence.',
    ingredients: ['Espresso', 'Dark Chocolate', 'Steamed Milk', 'Whipped Cream'],
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800',
    popular: true,
    badge: null,
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'Coffee',
    price: 3.50,
    rating: 4.9,
    reviewCount: 421,
    description: 'Pure, intense double-shot espresso slowly poured over hot water for a bold, smooth, full-bodied finish.',
    ingredients: ['Double Espresso', 'Hot Water'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800',
    popular: true,
    badge: 'Best Seller',
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'Coffee',
    price: 4.75,
    rating: 4.8,
    reviewCount: 167,
    description: 'A velvety microfoam milk poured over a concentrated ristretto shot. Strong, silky, and perfectly balanced.',
    ingredients: ['Ristretto', 'Microfoam Milk'],
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=800',
    popular: false,
    badge: 'New',
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: true
  },
  {
    id: 'espresso',
    name: 'Double Espresso',
    category: 'Coffee',
    price: 3.00,
    rating: 4.9,
    reviewCount: 389,
    description: 'Two concentrated shots of our signature blend, full of caramel sweetness and dark chocolate depth.',
    ingredients: ['Arabica Blend Espresso'],
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800',
    popular: false,
    badge: null,
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  // ── COLD DRINKS ─────────────────────────────────────────────────────────────
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    category: 'Cold Drinks',
    price: 4.75,
    rating: 4.8,
    reviewCount: 203,
    description: 'Steeped in cold water for 18 hours for a smooth, low-acidity, naturally sweet profile served over ice.',
    ingredients: ['Coarse-Ground Coffee', 'Cold Water', 'Ice'],
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800',
    popular: false,
    badge: 'Popular',
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  {
    id: 'iced-latte',
    name: 'Iced Caramel Latte',
    category: 'Cold Drinks',
    price: 5.25,
    rating: 4.7,
    reviewCount: 184,
    description: 'Espresso and chilled milk poured over ice with golden caramel drizzle. The perfect warm-weather indulgence.',
    ingredients: ['Espresso', 'Cold Milk', 'Caramel Syrup', 'Ice'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800',
    popular: false,
    badge: 'New',
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: true
  },
  {
    id: 'matcha-latte',
    name: 'Iced Matcha Latte',
    category: 'Cold Drinks',
    price: 5.50,
    rating: 4.6,
    reviewCount: 142,
    description: 'Premium ceremonial-grade matcha whisked smooth and poured over oat milk and ice. Earthy, vibrant, beautiful.',
    ingredients: ['Ceremonial Matcha', 'Oat Milk', 'Ice', 'Honey'],
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800',
    popular: false,
    badge: null,
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  // ── TEAS ────────────────────────────────────────────────────────────────────
  {
    id: 'chai-latte',
    name: 'Masala Chai Latte',
    category: 'Teas',
    price: 4.25,
    rating: 4.8,
    reviewCount: 156,
    description: 'A bold blend of black tea with aromatic spices — cinnamon, cardamom, ginger, and cloves — steeped in warm milk.',
    ingredients: ['Black Tea', 'Cardamom', 'Cinnamon', 'Ginger', 'Steamed Milk'],
    image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=800',
    popular: false,
    badge: null,
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.50 },
      { label: 'L', price: 1.00 }
    ],
    isNew: false
  },
  {
    id: 'green-tea',
    name: 'Premium Green Tea',
    category: 'Teas',
    price: 3.75,
    rating: 4.5,
    reviewCount: 89,
    description: 'Hand-picked Japanese Sencha green tea with a delicate grassy sweetness and a clean, refreshing finish.',
    ingredients: ['Japanese Sencha', 'Hot Water'],
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800',
    popular: false,
    badge: null,
    sizes: [
      { label: 'S', price: 0 },
      { label: 'M', price: 0.25 },
      { label: 'L', price: 0.75 }
    ],
    isNew: false
  },
  // ── PASTRIES ─────────────────────────────────────────────────────────────────
  {
    id: 'croissant',
    name: 'Butter Croissant',
    category: 'Pastries',
    price: 3.50,
    rating: 4.9,
    reviewCount: 267,
    description: 'Flaky, buttery, golden-baked croissant made from scratch every morning with premium French butter.',
    ingredients: ['Flour', 'French Butter', 'Eggs', 'Yeast', 'Honey'],
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800',
    popular: false,
    badge: 'Daily Fresh',
    sizes: null,
    isNew: false
  },
  {
    id: 'blueberry-muffin',
    name: 'Blueberry Muffin',
    category: 'Pastries',
    price: 3.25,
    rating: 4.7,
    reviewCount: 198,
    description: 'Moist and fluffy muffin bursting with plump wild blueberries and a golden sugar-crust top.',
    ingredients: ['Wild Blueberries', 'Flour', 'Butter', 'Buttermilk'],
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=800',
    popular: false,
    badge: null,
    sizes: null,
    isNew: false
  },
  // ── DESSERTS ─────────────────────────────────────────────────────────────────
  {
    id: 'chocolate-cake',
    name: 'Flourless Chocolate Cake',
    category: 'Desserts',
    price: 6.50,
    rating: 4.9,
    reviewCount: 211,
    description: 'Dense, fudgy, and intensely chocolatey. An irresistible companion to a strong double espresso.',
    ingredients: ['Dark Chocolate', 'Eggs', 'Butter', 'Sugar', 'Cocoa'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800',
    popular: false,
    badge: 'Chef\'s Pick',
    sizes: null,
    isNew: false
  },
  {
    id: 'tiramisu',
    name: 'Classic Tiramisu',
    category: 'Desserts',
    price: 7.00,
    rating: 4.8,
    reviewCount: 174,
    description: 'Layers of espresso-soaked ladyfingers and rich mascarpone cream, dusted generously with dark cocoa powder.',
    ingredients: ['Mascarpone', 'Espresso', 'Ladyfingers', 'Cocoa', 'Eggs'],
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800',
    popular: false,
    badge: null,
    sizes: null,
    isNew: true
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    category: 'Desserts',
    price: 6.75,
    rating: 4.7,
    reviewCount: 132,
    description: 'Velvety smooth classic cheesecake with a graham cracker crust, served with fresh berry compote.',
    ingredients: ['Cream Cheese', 'Graham Crackers', 'Sugar', 'Berry Compote'],
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800',
    popular: false,
    badge: null,
    sizes: null,
    isNew: false
  }
];
export interface Category {
  id: string;
  label: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  price: number;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
  pack: string;
  badge: string | null;
  badgeColor: string | null;
  image: string | number;
  description: string;
  tags: string[];
  isBestseller: boolean;
  isNew: boolean;
  soldToday: number;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export const categories: Category[] = [
  { id: 'all', label: 'All' },
  { id: 'ladoo', label: 'Ladoo' },
  { id: 'barfi', label: 'Barfi' },
  { id: 'bengali', label: 'Bengali' },
  { id: 'halwa', label: 'Halwa' },
  { id: 'snacks', label: 'Snacks' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Kaju Katli',
    category: 'barfi',
    subtitle: 'Premium Cashew Barfi',
    price: 480,
    originalPrice: 600,
    rating: 4.9,
    reviewCount: 128,
    pack: '250g Pack',
    badge: "CHEF'S PICK",
    badgeColor: '#22C55E',
    image: require('../assets/images/kaju-katli.jpg'),
    description:
      'Premium Kaju Katli made from the finest cashews, delicately seasoned with cardamom and silver leaf. A royal treat for every occasion.',
    tags: ['Veg', 'Gluten Free', 'Fresh Today'],
    isBestseller: false,
    isNew: false,
    soldToday: 180,
  },
  {
    id: '2',
    name: 'Motichoor Ladoo',
    category: 'ladoo',
    subtitle: '500g Pack',
    price: 180,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 94,
    pack: '500g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/motichoor-ladoo.jpg'),
    description:
      'Soft, melt-in-your-mouth Motichoor Ladoo made with fine besan boondi, soaked in sugar syrup and flavoured with cardamom and saffron.',
    tags: ['Veg', 'Fresh Today'],
    isBestseller: false,
    isNew: false,
    soldToday: 95,
  },
  {
    id: '3',
    name: 'Rasgulla',
    category: 'bengali',
    subtitle: '500g Pack · Spongy & Fresh',
    price: 220,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 96,
    pack: '500g Pack',
    badge: 'BESTSELLER',
    badgeColor: '#22C55E',
    image: require('../assets/images/rasgulla.jpg'),
    description:
      'Light, spongy Rasgullas made from fresh chenna, cooked in light sugar syrup. A classic Bengali dessert loved by all.',
    tags: ['Veg', 'Gluten Free'],
    isBestseller: true,
    isNew: false,
    soldToday: 142,
  },
  {
    id: '4',
    name: 'Besan Barfi',
    category: 'barfi',
    subtitle: '250g Pack',
    price: 160,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 61,
    pack: '250g Pack',
    badge: 'NEW',
    badgeColor: '#22C55E',
    image: require('../assets/images/besan-barfi.png'),
    description:
      'Freshly made Besan Barfi with roasted gram flour, pure ghee and aromatic cardamom. A traditional homestyle sweet.',
    tags: ['Veg', 'Fresh Today'],
    isBestseller: false,
    isNew: true,
    soldToday: 55,
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    category: 'bengali',
    subtitle: '500g Pack',
    price: 250,
    originalPrice: 300,
    rating: 4.9,
    reviewCount: 128,
    pack: '500g Pack',
    badge: 'BESTSELLER',
    badgeColor: '#22C55E',
    image: require('../assets/images/gulab-jamun.jpg'),
    description:
      'Soft, melt-in-your-mouth Gulab Jamun made from fresh khoya, deep-fried to golden perfection and soaked in aromatic rose-cardamom syrup. A timeless Indian classic prepared fresh every morning with the finest ingredients.',
    tags: ['Veg', 'Gluten Free', 'Fresh Today'],
    isBestseller: true,
    isNew: false,
    soldToday: 240,
  },
  {
    id: '6',
    name: 'Sandesh',
    category: 'bengali',
    subtitle: '250g Pack · Saffron Flavour',
    price: 180,
    originalPrice: 220,
    rating: 4.7,
    reviewCount: 74,
    pack: '250g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/sandesh.jpg'),
    description:
      'Delicate Bengali Sandesh made from fresh chenna and flavored with saffron. A light and elegant sweet for festive occasions.',
    tags: ['Veg', 'Gluten Free'],
    isBestseller: false,
    isNew: false,
    soldToday: 88,
  },
  {
    id: '7',
    name: 'Mishti Doi',
    category: 'bengali',
    subtitle: '200g · In Clay Pot',
    price: 90,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 51,
    pack: '200g',
    badge: 'NEW',
    badgeColor: '#22C55E',
    image: require('../assets/images/mishti-doi.jpg'),
    description:
      'Traditional Bengali Mishti Doi set in clay pots with caramelized sugar. Creamy, sweet and absolutely delightful.',
    tags: ['Veg', 'Gluten Free'],
    isBestseller: false,
    isNew: true,
    soldToday: 67,
  },
  {
    id: '8',
    name: 'Chomchom',
    category: 'bengali',
    subtitle: '250g Pack · Coconut Topped',
    price: 190,
    originalPrice: null,
    rating: 4.6,
    reviewCount: 62,
    pack: '250g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/chomchom.jpg'),
    description:
      'Soft and spongy Chomchom topped with freshly grated coconut. A traditional Bengali treat with an irresistible texture.',
    tags: ['Veg'],
    isBestseller: false,
    isNew: false,
    soldToday: 43,
  },
  {
    id: '9',
    name: 'Pantua',
    category: 'bengali',
    subtitle: '500g Pack · Rich Syrup',
    price: 200,
    originalPrice: 240,
    rating: 4.5,
    reviewCount: 88,
    pack: '500g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/pantua.jpg'),
    description:
      'Deep-fried chenna balls soaked in rich sugar syrup. Similar to Gulab Jamun but with a distinct Bengali character.',
    tags: ['Veg', 'Fresh Today'],
    isBestseller: false,
    isNew: false,
    soldToday: 72,
  },
  {
    id: '10',
    name: 'Kalakand',
    category: 'barfi',
    subtitle: '250g · Pistachio Topped',
    price: 240,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 43,
    pack: '250g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/kalakand.png'),
    description:
      'Rich and grainy Kalakand made from reduced milk and topped with crushed pistachios. A melt-in-your-mouth experience.',
    tags: ['Veg', 'Gluten Free'],
    isBestseller: false,
    isNew: false,
    soldToday: 38,
  },
];

export const snackProducts: Product[] = [
  {
    id: '11',
    name: 'Aloo Bhujia',
    category: 'snacks',
    subtitle: '200g Pack',
    price: 80,
    originalPrice: null,
    rating: 4.5,
    reviewCount: 33,
    pack: '200g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/aloo-bhujia.jpg'),
    description: 'Crispy and spicy Aloo Bhujia, a classic namkeen snack.',
    tags: ['Veg'],
    isBestseller: false,
    isNew: false,
    soldToday: 120,
  },
  {
    id: '12',
    name: 'Moong Dal',
    category: 'snacks',
    subtitle: '200g Pack',
    price: 100,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 28,
    pack: '200g Pack',
    badge: null,
    badgeColor: null,
    image: require('../assets/images/moong-dal.jpg'),
    description: 'Crispy fried moong dal with a light spice blend.',
    tags: ['Veg', 'Gluten Free'],
    isBestseller: false,
    isNew: false,
    soldToday: 85,
  },
];

export const todaySpecial: Product = products.find((p) => p.badge === "CHEF'S PICK") || products[0];
export const popularSweets: Product[] = products.filter((p) => p.isBestseller).slice(0, 4);
export const bengaliSweets: Product[] = products.filter((p) => p.category === 'bengali');

export const reviews: Review[] = [
  {
    id: 'r1',
    name: 'Priya Sharma',
    avatar: 'P',
    rating: 5,
    date: '2 days ago',
    comment: 'Absolutely delicious! The freshness is unmatched. Will definitely order again.',
  },
  {
    id: 'r2',
    name: 'Rajesh Kumar',
    avatar: 'R',
    rating: 4,
    date: '1 week ago',
    comment: 'Great quality sweets. Packaging was good too. Delivered on time.',
  },
  {
    id: 'r3',
    name: 'Ananya Singh',
    avatar: 'A',
    rating: 5,
    date: '2 weeks ago',
    comment: 'Best sweets in Noida! My family loved it. The taste is authentic and traditional.',
  },
];

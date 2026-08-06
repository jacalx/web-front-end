// ===== PRODUCTS DATA =====
// 30+ dummy products across all categories and universities
// Each product has: id, name, price, category, condition, status, seller, university, location, images, description

export const products = [
  // --- Books ---
  {
    id: "p1",
    name: "Data Structures & Algorithms Textbook",
    price: 25,
    category: "Books",
    condition: "Like New",
    status: "Available",
    sellerId: "u1",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Computer Science textbook, barely used. No highlights or notes inside. Covers all core data structures and algorithms.",
    date: "2024-07-10",
    views: 142,
  },
  {
    id: "p2",
    name: "English Literature Book Set (3 books)",
    price: 25,
    category: "Books",
    condition: "Good",
    status: "Available",
    sellerId: "u1",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Set of 3 English literature books for BELTEI students. Some notes in margins but all pages intact.",
    date: "2024-07-08",
    views: 89,
  },
  {
    id: "p3",
    name: "Business Statistics Textbook",
    price: 18,
    category: "Books",
    condition: "Good",
    status: "Sold",
    sellerId: "u8",
    university: "National University of Management",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Statistics for Business and Economics, 8th edition. Great for NUM finance students.",
    date: "2024-06-20",
    views: 210,
  },

  // --- Laptops ---
  {
    id: "p4",
    name: "MacBook Air 2020 M1 Chip",
    price: 750,
    category: "Laptop",
    condition: "Like New",
    status: "Available",
    sellerId: "u2",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "MacBook Air M1, 8GB RAM, 256GB SSD. Battery cycle count: 120. Includes original charger and box.",
    date: "2024-07-09",
    views: 350,
  },
  {
    id: "p5",
    name: "Dell Inspiron 15 3000",
    price: 320,
    category: "Laptop",
    condition: "Used",
    status: "Available",
    sellerId: "u5",
    university: "CamTech University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Dell Inspiron 15, Intel i5, 8GB RAM, 512GB SSD. Great for coding and assignments. Minor scratches on lid.",
    date: "2024-07-05",
    views: 178,
  },
  {
    id: "p6",
    name: "HP Pavilion x360 Convertible",
    price: 450,
    category: "Laptop",
    condition: "Good",
    status: "Reserved",
    sellerId: "u1",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "HP Pavilion x360, 2-in-1 touchscreen, i7, 16GB RAM, 512GB SSD. Comes with stylus pen.",
    date: "2024-07-01",
    views: 265,
  },

  // --- Phones ---
  {
    id: "p7",
    name: "iPhone 12 64GB Blue",
    price: 380,
    category: "Phone",
    condition: "Good",
    status: "Available",
    sellerId: "u3",
    university: "National University of Management",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "iPhone 12, 64GB, Blue. Battery health 85%. Screen protector applied since day one. No scratches.",
    date: "2024-07-07",
    views: 410,
  },
  {
    id: "p8",
    name: "Samsung Galaxy S21 Ultra",
    price: 420,
    category: "Phone",
    condition: "Like New",
    status: "Available",
    sellerId: "u6",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Galaxy S21 Ultra, 256GB, Phantom Black. Moving abroad so selling everything. Excellent condition.",
    date: "2024-07-03",
    views: 320,
  },

  // --- Tablets ---
  {
    id: "p9",
    name: "iPad Air 4th Gen 64GB",
    price: 350,
    category: "Tablet",
    condition: "Like New",
    status: "Available",
    sellerId: "u4",
    university: "BELTEI International University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/1337753/pexels-photo-1337753.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "iPad Air 4, 64GB, Sky Blue. Used mainly for note-taking. Includes Apple Pencil 2 and case.",
    date: "2024-07-06",
    views: 198,
  },

  // --- Calculators ---
  {
    id: "p10",
    name: "Casio FX-991EX Scientific Calculator",
    price: 15,
    category: "Calculator",
    condition: "Good",
    status: "Sold",
    sellerId: "u8",
    university: "National University of Management",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Casio ClassWiz FX-991EX. Perfect for engineering and statistics courses. Slightly worn buttons.",
    date: "2024-06-15",
    views: 95,
  },
  {
    id: "p11",
    name: "Texas Instruments TI-84 Plus",
    price: 45,
    category: "Calculator",
    condition: "Like New",
    status: "Available",
    sellerId: "u2",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "TI-84 Plus graphing calculator. Required for ITC calculus courses. Barely used, includes manual.",
    date: "2024-07-04",
    views: 130,
  },

  // --- Notebooks ---
  {
    id: "p12",
    name: "Moleskine Notebook Set (5 pcs)",
    price: 20,
    category: "Notebook",
    condition: "New",
    status: "Available",
    sellerId: "u4",
    university: "BELTEI International University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/625329/pexels-photo-625329.jpeg?auto=compress&cs=tinyrgb&w=800",
    ],
    description: "Set of 5 Moleskine notebooks, never used. Great quality paper for journaling and note-taking.",
    date: "2024-07-02",
    views: 76,
  },

  // --- Stationery ---
  {
    id: "p13",
    name: "Complete Stationery Bundle",
    price: 12,
    category: "Stationery",
    condition: "New",
    status: "Available",
    sellerId: "u4",
    university: "BELTEI International University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/625329/pexels-photo-625329.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Pens, highlighters, sticky notes, rulers, erasers - everything you need for a semester!",
    date: "2024-07-01",
    views: 54,
  },

  // --- Bags ---
  {
    id: "p14",
    name: "North Face Backpack 30L",
    price: 55,
    category: "Bag",
    condition: "Good",
    status: "Available",
    sellerId: "u6",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/290523/pexels-photo-290523.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "North Face Borealis backpack. Great for carrying laptop and books. Minor wear on straps.",
    date: "2024-06-28",
    views: 143,
  },
  {
    id: "p15",
    name: "Canvas Tote Bag - University Edition",
    price: 8,
    category: "Bag",
    condition: "New",
    status: "Available",
    sellerId: "u3",
    university: "National University of Management",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/290523/pexels-photo-290523.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Canvas tote bag with university logo. Perfect for carrying books and groceries.",
    date: "2024-06-25",
    views: 42,
  },

  // --- Uniform ---
  {
    id: "p16",
    name: "BELTEI University Uniform (Size M)",
    price: 15,
    category: "Uniform",
    condition: "Good",
    status: "Available",
    sellerId: "u4",
    university: "BELTEI International University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "BELTEI uniform shirt and pants, size M. Worn for one semester, well maintained.",
    date: "2024-06-22",
    views: 38,
  },

  // --- Electronics ---
  {
    id: "p17",
    name: "Power Bank 20000mAh Anker",
    price: 30,
    category: "Electronics",
    condition: "Like New",
    status: "Available",
    sellerId: "u5",
    university: "CamTech University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Anker PowerCore 20000mAh. Fast charging, dual USB output. Barely used.",
    date: "2024-07-08",
    views: 167,
  },
  {
    id: "p18",
    name: "USB-C Hub 7-in-1 Adapter",
    price: 22,
    category: "Electronics",
    condition: "New",
    status: "Available",
    sellerId: "u2",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/4068314/pexels-photo-4068314.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging. Brand new, unopened.",
    date: "2024-07-06",
    views: 88,
  },

  // --- Furniture ---
  {
    id: "p19",
    name: "Drafting Table (Adjustable)",
    price: 45,
    category: "Furniture",
    condition: "Good",
    status: "Available",
    sellerId: "u7",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Adjustable drafting table, perfect for architecture students. Sturdy, some minor scratches.",
    date: "2024-06-30",
    views: 112,
  },
  {
    id: "p20",
    name: "Ergonomic Study Chair",
    price: 65,
    category: "Furniture",
    condition: "Used",
    status: "Available",
    sellerId: "u1",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Ergonomic office chair with lumbar support. Great for long study sessions. Pick up only.",
    date: "2024-06-26",
    views: 134,
  },

  // --- Accessories ---
  {
    id: "p21",
    name: "Apple Watch Series 6 44mm",
    price: 180,
    category: "Accessories",
    condition: "Good",
    status: "Available",
    sellerId: "u3",
    university: "National University of Management",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/39304/pen-pencil-writing-color-39304.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Apple Watch Series 6, GPS, 44mm, Space Gray. Includes extra sport band.",
    date: "2024-07-04",
    views: 201,
  },
  {
    id: "p22",
    name: "Leather Laptop Sleeve 15-inch",
    price: 18,
    category: "Accessories",
    condition: "New",
    status: "Available",
    sellerId: "u7",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/39304/pen-pencil-writing-color-39304.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Genuine leather laptop sleeve, fits 15-inch laptops. Brand new, never used.",
    date: "2024-06-29",
    views: 67,
  },

  // --- Printer ---
  {
    id: "p23",
    name: "Canon PIXMA Inkjet Printer",
    price: 55,
    category: "Printer",
    condition: "Used",
    status: "Available",
    sellerId: "u5",
    university: "CamTech University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Canon PIXMA all-in-one printer, scanner, copier. Works great, comes with USB cable.",
    date: "2024-06-27",
    views: 98,
  },

  // --- Monitor ---
  {
    id: "p24",
    name: "Dell Monitor 24-inch Full HD",
    price: 200,
    category: "Monitor",
    condition: "Like New",
    status: "Available",
    sellerId: "u1",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Dell UltraSharp 24-inch monitor, 1080p, IPS panel. Perfect for dual monitor setup.",
    date: "2024-07-05",
    views: 256,
  },

  // --- Keyboard ---
  {
    id: "p25",
    name: "Mechanical Keyboard Keychron K2",
    price: 75,
    category: "Keyboard",
    condition: "Good",
    status: "Available",
    sellerId: "u5",
    university: "CamTech University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Keychron K2 wireless mechanical keyboard, Brown switches. Great for typing and coding.",
    date: "2024-07-03",
    views: 189,
  },

  // --- Mouse ---
  {
    id: "p26",
    name: "Logitech MX Master 3S",
    price: 50,
    category: "Mouse",
    condition: "Like New",
    status: "Available",
    sellerId: "u2",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Logitech MX Master 3S, wireless, ergonomic. Perfect for productivity. Barely used.",
    date: "2024-07-02",
    views: 145,
  },

  // --- Headphones ---
  {
    id: "p27",
    name: "Sony WH-1000XM4 Noise Cancelling",
    price: 220,
    category: "Headphone",
    condition: "Good",
    status: "Available",
    sellerId: "u6",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Sony WH-1000XM4, industry-leading noise cancellation. Great for studying in noisy places.",
    date: "2024-07-01",
    views: 312,
  },
  {
    id: "p28",
    name: "AirPods Pro 2nd Generation",
    price: 160,
    category: "Headphone",
    condition: "Like New",
    status: "Reserved",
    sellerId: "u3",
    university: "National University of Management",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "AirPods Pro 2, with USB-C charging case. Excellent condition, includes extra ear tips.",
    date: "2024-06-28",
    views: 278,
  },

  // --- Other ---
  {
    id: "p29",
    name: "Bicycle - Mountain Bike 26 inch",
    price: 120,
    category: "Other",
    condition: "Used",
    status: "Available",
    sellerId: "u7",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "26-inch mountain bike, 21-speed. Great for getting around campus. Recently serviced.",
    date: "2024-06-24",
    views: 234,
  },
  {
    id: "p30",
    name: "Desk Lamp LED with USB Port",
    price: 15,
    category: "Other",
    condition: "New",
    status: "Available",
    sellerId: "u4",
    university: "BELTEI International University",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/1112582/pexels-photo-1112582.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "LED desk lamp with 3 brightness levels and USB charging port. Perfect for late-night studying.",
    date: "2024-06-20",
    views: 61,
  },
  {
    id: "p31",
    name: "Whiteboard Magnetic 90x60cm",
    price: 25,
    category: "Other",
    condition: "Good",
    status: "Available",
    sellerId: "u1",
    university: "Royal University of Phnom Penh",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/1112582/pexels-photo-1112582.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "Magnetic whiteboard, 90x60cm. Great for studying, brainstorming, and group projects.",
    date: "2024-06-18",
    views: 48,
  },
  {
    id: "p32",
    name: "Graphing Paper Pad (200 sheets)",
    price: 7,
    category: "Stationery",
    condition: "New",
    status: "Available",
    sellerId: "u7",
    university: "Institute of Technology of Cambodia",
    location: "Phnom Penh",
    images: [
      "https://images.pexels.com/photos/625329/pexels-photo-625329.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    description: "200 sheets of graphing paper, perfect for engineering drawings and math problems.",
    date: "2024-06-15",
    views: 33,
  },
];

// All product categories used in the marketplace
export const categories = [
  "Books", "Laptop", "Phone", "Tablet", "Calculator", "Notebook",
  "Stationery", "Bag", "Uniform", "Electronics", "Furniture",
  "Accessories", "Printer", "Monitor", "Keyboard", "Mouse",
  "Headphone", "Other",
];

// All universities used in the marketplace
export const universities = [
  "Royal University of Phnom Penh",
  "Institute of Technology of Cambodia",
  "National University of Management",
  "BELTEI International University",
  "CamTech University",
];

// Product conditions
export const conditions = ["New", "Like New", "Good", "Used"];

// Product statuses
export const statuses = ["Available", "Reserved", "Sold"];

// ===== Enrich products with pricing + review data =====
// Adds oldPrice, discount, reviewCount, and reviews to each product.
// This simulates real marketplace data without bloating the raw data above.

const dummyReviews = [
  { name: "Sok Pisey", rating: 5, text: "Great seller, fast response and fair price!" },
  { name: "Chan Dara", rating: 5, text: "Item was exactly as described. Recommended!" },
  { name: "Ly Hour", rating: 4, text: "Smooth transaction, would buy again." },
  { name: "Kim Sreypich", rating: 5, text: "Excellent communication and quick meetup." },
  { name: "Nget Visal", rating: 4, text: "Good condition, reasonable price." },
];

products.forEach((p) => {
  // Generate oldPrice: 10-35% higher than current price
  const discountRate = 0.1 + (Math.floor(Math.random() * 4) * 0.05) + 0.05;
  p.oldPrice = Math.round((p.price / (1 - discountRate)) * 100) / 100;
  p.discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
  // Generate review count proportional to views
  p.reviewCount = Math.floor(p.views / 8) + 1;
  // Assign 2-4 random reviews
  const numReviews = 2 + Math.floor(Math.random() * 3);
  p.reviews = [];
  for (let i = 0; i < numReviews; i++) {
    p.reviews.push(dummyReviews[Math.floor(Math.random() * dummyReviews.length)]);
  }
  // Average rating from reviews
  p.rating = (p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length).toFixed(1);
});

// Helper: get product by ID
export const getProductById = (id) => products.find((p) => p.id === id) || null;

// Helper: get products by seller
export const getProductsBySeller = (sellerId) => products.filter((p) => p.sellerId === sellerId);

// Helper: get trending products (highest views)
export const getFeaturedProducts = () =>
  [...products].sort((a, b) => b.views - a.views).slice(0, 10);

// Helper: get latest products (most recent date)
export const getLatestProducts = () =>
  [...products].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

// Helper: get products by category
export const getProductsByCategory = (category, limit = 10) =>
  products.filter((p) => p.category === category).slice(0, limit);

// Helper: get related products (same category, excluding current)
export const getRelatedProducts = (productId, limit = 5) => {
  const product = getProductById(productId);
  if (!product) return [];
  return products
    .filter((p) => p.category === product.category && p.id !== productId)
    .slice(0, limit);
};

// Helper: get products by multiple categories
export const getProductsByCategories = (cats, limit = 10) =>
  products.filter((p) => cats.includes(p.category)).slice(0, limit);
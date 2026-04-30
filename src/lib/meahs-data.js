import siteContent from "../data/site-content.json";

const PRICE_GBP = 4.7;

export const themes = [
  {
    id: "curry-classic",
    name: "Curry Classic",
    description: "Deep curry reds with turmeric glow and cream surfaces.",
    colors: {
      primary: "#8B1E1E",
      secondary: "#F5A623",
      background: "#FFF7EA",
      surface: "#FFF1DB",
      foreground: "#2B1A12",
      accent: "#2E7D32",
      muted: "#8C5A31",
      border: "rgba(43,26,18,0.12)",
      gradientFrom: "#8B1E1E",
      gradientVia: "#C34D22",
      gradientTo: "#F5A623",
    },
  },
  {
    id: "royal-indian",
    name: "Royal Indian",
    description: "Burgundy and gold with ceremonial ivory warmth.",
    colors: {
      primary: "#6D1023",
      secondary: "#D4A63A",
      background: "#FFF9EF",
      surface: "#F8E7CC",
      foreground: "#2A150D",
      accent: "#8C4A2F",
      muted: "#7A5631",
      border: "rgba(42,21,13,0.12)",
      gradientFrom: "#6D1023",
      gradientVia: "#9B273B",
      gradientTo: "#D4A63A",
    },
  },
  {
    id: "fresh-organic",
    name: "Fresh Organic",
    description: "Green-led natural palette with mustard warmth.",
    colors: {
      primary: "#2E7D32",
      secondary: "#DDAA22",
      background: "#FBF7E8",
      surface: "#EEF2D5",
      foreground: "#332117",
      accent: "#A34C1D",
      muted: "#6B5C3D",
      border: "rgba(51,33,23,0.12)",
      gradientFrom: "#2E7D32",
      gradientVia: "#5F8F35",
      gradientTo: "#DDAA22",
    },
  },
  {
    id: "premium-dark",
    name: "Premium Dark",
    description: "Charcoal spice room with gold and warm red highlights.",
    colors: {
      primary: "#B93E3E",
      secondary: "#D9A625",
      background: "#1C1714",
      surface: "#2A221D",
      foreground: "#F5E8D7",
      accent: "#D88D5B",
      muted: "#C5AF8E",
      border: "rgba(245,232,215,0.12)",
      gradientFrom: "#341615",
      gradientVia: "#6F2424",
      gradientTo: "#D9A625",
    },
  },
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean cream layout with bright orange and crisp contrast.",
    colors: {
      primary: "#F26A1B",
      secondary: "#FFD18A",
      background: "#FFFDF7",
      surface: "#FFF4E6",
      foreground: "#1A1A1A",
      accent: "#B63710",
      muted: "#78634B",
      border: "rgba(26,26,26,0.10)",
      gradientFrom: "#F26A1B",
      gradientVia: "#F79E31",
      gradientTo: "#FFF1C4",
    },
  },
];

export const bundleOptions = [
  {
    id: "family-pack",
    title: "Family Pack",
    quantity: 6,
    price: 28.2,
    description: "Best for trying different flavours at home.",
    badge: null,
  },
  {
    id: "stock-up-pack",
    title: "Stock-Up Pack",
    quantity: 12,
    price: 47.5,
    description: "Best value for repeat curry nights and larger households.",
    badge: "Most Popular",
  },
];

const sauceMeta = {
  korma: {
    spice: 1,
    heatLabel: "Mild",
    accent: "from-[#F5D688] via-[#F1B66D] to-[#E18D3C]",
    badge: "Best Seller",
    recipeTitle: "Chicken Korma",
  },
  "tikka-masala": {
    spice: 2,
    heatLabel: "Medium",
    accent: "from-[#F3B34D] via-[#E56F2D] to-[#B3341B]",
    badge: "Best Seller",
    recipeTitle: "Tikka Masala Traybake",
  },
  dhansak: {
    spice: 2,
    heatLabel: "Medium",
    accent: "from-[#B95834] via-[#D2762E] to-[#E4B04D]",
    badge: null,
    recipeTitle: "Dhansak with Lentils",
  },
  madras: {
    spice: 4,
    heatLabel: "Hot",
    accent: "from-[#6A0F12] via-[#9E1F16] to-[#D45318]",
    badge: "Hot",
    recipeTitle: "Beef Madras",
  },
  jalfrezi: {
    spice: 4,
    heatLabel: "Hot",
    accent: "from-[#335B22] via-[#5A8A1E] to-[#D67618]",
    badge: "Hot",
    recipeTitle: "Lamb Jalfrezi",
  },
  rogon: {
    spice: 3,
    heatLabel: "Medium",
    accent: "from-[#7C1724] via-[#A23B38] to-[#D47A45]",
    badge: null,
    recipeTitle: "Rogon with Lamb",
  },
  dopiaza: {
    spice: 3,
    heatLabel: "Medium",
    accent: "from-[#6E2A1D] via-[#B04D2E] to-[#D48A3A]",
    badge: null,
    recipeTitle: "King Prawn Dopiaza",
  },
  balti: {
    spice: 3,
    heatLabel: "Medium",
    accent: "from-[#8A2817] via-[#C34C24] to-[#E9A53E]",
    badge: null,
    recipeTitle: "Chicken Balti",
  },
  patia: {
    spice: 3,
    heatLabel: "Medium",
    accent: "from-[#7F4020] via-[#C06729] to-[#E5B142]",
    badge: null,
    recipeTitle: "Prawn Patia",
  },
};

function normalisePrice(value) {
  const numeric = Number.parseFloat(String(value).replace(/[^\d.]/g, ""));
  const price = Number.isFinite(numeric) ? numeric : PRICE_GBP;
  return {
    amount: price,
    display: `£${price.toFixed(2)}`,
  };
}

export const brand = {
  ...siteContent.brand,
  awards: siteContent.awards,
  socialLinks: siteContent.socialLinks,
  strapline: "Restaurant-style curry sauces for home kitchens and wholesale buyers.",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Products" },
  { href: "/heritage", label: "Heritage" },
  { href: "/events", label: "Events" },
  { href: "/recipes", label: "Recipes" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export const homeContent = siteContent.home;
export const heritageContent = siteContent.heritage;
export const eventsContent = siteContent.events;
export const newsContent = siteContent.news;

export const products = siteContent.products
  .filter((product) => sauceMeta[product.slug])
  .map((product) => {
    const meta = sauceMeta[product.slug];
    const price = normalisePrice(product.price);
    return {
      ...product,
      ...meta,
      price: price.display,
      priceValue: price.amount,
      servesLabel: `Serves ${product.serves}`,
      cookTime: "15 mins",
      storageShort: "Keep chilled",
    };
  });

export const featuredProducts = products.filter((product) =>
  ["korma", "tikka-masala", "dhansak", "madras", "jalfrezi", "rogon", "dopiaza", "balti"].includes(product.slug)
);

export const recipes = [
  {
    id: "chicken-korma",
    title: "Chicken Korma",
    sauce: "Korma",
    prepTime: "20 mins",
    serves: 4,
    imageUrl: homeContent.sliderImages[0],
    description: "Golden, creamy and family-friendly with coriander rice.",
  },
  {
    id: "beef-madras",
    title: "Beef Madras",
    sauce: "Madras",
    prepTime: "25 mins",
    serves: 4,
    imageUrl: homeContent.sliderImages[1],
    description: "Bold heat layered over slow-cooked beef and fresh coriander.",
  },
  {
    id: "lamb-jalfrezi",
    title: "Lamb Jalfrezi",
    sauce: "Jalfrezi",
    prepTime: "25 mins",
    serves: 4,
    imageUrl: homeContent.sliderImages[2],
    description: "Fiery peppers and onions with bright finishing herbs.",
  },
  {
    id: "king-prawn-dopiaza",
    title: "King Prawn Dopiaza",
    sauce: "Dopiaza",
    prepTime: "18 mins",
    serves: 4,
    imageUrl: homeContent.sliderImages[3],
    description: "Sweet onions and king prawns finished in a glossy pan sauce.",
  },
  {
    id: "chicken-balti",
    title: "Chicken Balti",
    sauce: "Balti",
    prepTime: "22 mins",
    serves: 4,
    imageUrl: homeContent.featureImage,
    description: "Tomato-rich and Birmingham-inspired for quick weeknight cooking.",
  },
];

export const deliveryRules = [
  {
    title: "Next-day dispatch",
    description: "Orders placed before 1:00pm are usually delivered the next day.",
  },
  {
    title: "48-hour delivery window",
    description: "Orders placed after 1:00pm arrive within 48 hours.",
  },
  {
    title: "Friday cut-off",
    description: "Friday orders are delivered on Tuesday to protect chilled quality.",
  },
  {
    title: "Chilled handling",
    description: "Refrigerate on delivery. Orders ship only in batches of 6 or 12.",
  },
];

export const storyStats = [
  { label: "Years Experience", value: 47, suffix: "+" },
  { label: "Hours Per Classic Sauce", value: 6, suffix: "" },
  { label: "Signature Sauces", value: 8, suffix: "" },
  { label: "Serves Per Jar", value: 4, suffix: "" },
];

export const productDetailsTabs = featuredProducts
  .filter((product) => ["korma", "madras", "jalfrezi", "dopiaza", "balti"].includes(product.slug))
  .map((product) => ({
    key: product.slug,
    label: product.name,
    product,
  }));

export const productDetailsBySlug = Object.fromEntries(
  products.map((product) => [product.slug, product])
);

export function getProductDetails(slug) {
  return productDetailsBySlug[slug] ?? null;
}

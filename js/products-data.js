// products-data.js (Updated with Fallback Data)

const API_URL = window.location.protocol === 'file:' ? 'http://localhost:5000/api/products' : '/api/products';

// Sample Data for Fallback/Demo (When API is offline)
const SAMPLE_PRODUCTS = [
  {
    id: "111",
    title: "Trojan Speed Rope",
    price: 150,
    originalPrice: 200,
    image: "assets/trojan-rope-2.png",
    images: [
      "assets/trojan-rope-2.png",
      "assets/trojan-rope-3.png",
      "assets/trojan-rope-4.png"
    ],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 5.0,
    reviews: 10,
    description: "Elevate your cardiovascular fitness with this lightweight, adjustable speed rope. Designed for smooth rotation, it's a highly effective tool for warming up, endurance training, and everyday workouts.",
    specs: { "Material": "PVC-coated rope", "Length": "Adjustable up to 2.7m" },
    variations: {}
  },
  {
    id: "201",
    title: "65W USB Super Fast Charger",
    price: 350,
    image: "assets/charger-65w-1.png",
    images: ["assets/charger-65w-1.png", "assets/charger-65w-2.png", "assets/charger-65w-3.png"],
    category: "Electronics",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 15,
    description: "Power up your devices in record time with this highly efficient 65W fast charger. Its compact, safe design ensures your smartphone, tablet, or laptop stays charged and ready wherever you go.",
    specs: { "Power": "65W", "Connector": "USB", "Type": "Rapid Charger" },
    variations: {}
  },
  {
    id: "202",
    title: "Cluedo Board Game (English Edition)",
    price: 1200,
    image: "assets/cluedo-1.png",
    images: ["assets/cluedo-1.png", "assets/cluedo-2.png", "assets/cluedo-4.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.7,
    reviews: 24,
    description: "Bring family game night to life with the classic mystery game. Sharpen your deductive skills and race against opponents to solve the ultimate whodunit. A timeless addition to any board game collection.",
    specs: { "Players": "2-6", "Age": "8+", "Language": "English" },
    variations: {}
  },
  {
    id: "203",
    title: "Girls Adjustable 3-Wheel Training Roller Skates",
    price: 850,
    image: "assets/skates-girls-pink-1.png",
    images: ["assets/skates-girls-pink-1.png", "assets/skates-girls-pink.png", "assets/skates-girls-pink-2.png", "assets/skates-girls-pink-3.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.8,
    reviews: 12,
    description: "Watch her confidence soar with these vibrant, adjustable 3-wheel training skates. Built for stability and smooth riding, they are the perfect first pair to help her learn balance while having a blast.",
    specs: { "Design": "3-Wheel", "Color": "Pink/Purple", "Adjustable": "Yes" },
    variations: { "Size": ["Small", "Medium"] }
  },
  {
    id: "204",
    title: "Gotcha Beach Ball Set",
    price: 300,
    image: "assets/beach-ball-set-1.png",
    images: ["assets/beach-ball-set-1.png", "assets/beach-ball-set-2.png", "assets/beach-ball-set-3.png", "assets/beach-ball-set-5.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.5,
    reviews: 8,
    description: "Make every sunny day unforgettable with this premium beach ball set. Whether in the backyard, park, or at the beach, these high-quality paddle bats offer hours of engaging outdoor fun for family and friends.",
    specs: { "Includes": "2 Bats, 1 Ball", "Activity": "Outdoor Fun" },
    variations: {}
  },
  {
    id: "205",
    title: "Trojan 55cm Anti-Burst Gym Ball",
    price: 350,
    image: "assets/trojan-ball-55cm.png",
    images: ["assets/trojan-ball-55cm.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.6,
    reviews: 10,
    description: "Enhance your core strength and flexibility with this professional-grade anti-burst fitness ball. Perfect for home workouts, yoga, or as an ergonomic desk chair alternative.",
    specs: { "Size": "55cm", "Feature": "Anti-Burst" },
    variations: {}
  },
  {
    id: "206",
    title: "Heavy-Duty Toy Dumper Truck",
    price: 350,
    image: "assets/dumper-truck-1.png",
    images: ["assets/dumper-truck-1.png", "assets/dumper-truck-2.png", "assets/dumper-truck-4.png", "assets/dumper-truck-6.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 18,
    description: "Ignite their imagination with this rugged, heavy-duty toy dumper truck. Built to withstand energetic outdoor play in the sand or garden, providing years of reliable fun.",
    specs: { "Type": "Dumper Truck", "Material": "Durable Plastic" },
    variations: {}
  },
  {
    id: "207",
    title: "Hook Junior Pogo Stick",
    price: 999,
    image: "assets/pogo-stick-1.png",
    images: ["assets/pogo-stick-1.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.4,
    reviews: 6,
    description: "Give your child the gift of active play with this durable junior pogo stick. Designed for safety and endless outdoor fun, it helps build balance and coordination while keeping them entertained for hours.",
    specs: { "Type": "Junior", "Activity": "Jumping" },
    variations: {}
  },
  {
    id: "208",
    title: "Jumanji Board Game",
    price: 499,
    image: "assets/jumanji.jpg",
    images: ["assets/jumanji.jpg", "assets/jumanji-2.jpg", "assets/jumanji-3.png", "assets/jumanji-5.png", "assets/jumanji-6.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.8,
    reviews: 30,
    description: "Step into the jungle and experience the thrill of Jumanji. This immersive board game brings the beloved movie to life, offering a wildly entertaining adventure for family and friends.",
    specs: { "Age": "8+", "Players": "2-4" },
    variations: {}
  },
  {
    id: "209",
    title: "Kids Adjustable 3-Wheel Roller Skates - Blue",
    price: 799,
    image: "assets/skates-kids-blue-1.png",
    images: ["assets/skates-kids-blue-1.png", "assets/skates-kids-blue-2.png", "assets/skates-kids-blue-3.png", "assets/skates-kids-blue-4.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.7,
    reviews: 14,
    description: "Introduce your child to the joy of skating safely. These adjustable 3-wheel skates provide excellent stability for beginners, growing with them as they master their skills.",
    specs: { "Design": "3-Wheel", "Color": "Blue", "Adjustable": "Yes" },
    variations: { "Size": ["Small", "Medium"] }
  },
  {
    id: "210",
    title: "Pictionary Board Game",
    price: 399,
    image: "assets/pictionary.png",
    images: ["assets/pictionary.png", "assets/pictionary-1.png", "assets/pictionary-2.png", "assets/pictionary-3.png", "assets/pictionary-5.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.7,
    reviews: 20,
    description: "Unleash your creativity and enjoy non-stop laughs with Pictionary. The ultimate quick-draw guessing game that turns any gathering into an unforgettable party.",
    specs: { "Age": "8+", "Category": "Family Game" },
    variations: {}
  },
  {
    id: "211",
    title: "Prowood Standard Carrom Board",
    price: 1200,
    image: "assets/carrom-board.png",
    images: ["assets/carrom-board.png", "assets/carrom-board-1.png", "assets/carrom-board-4.png", "assets/carrom-board-5.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 5,
    description: "Experience the timeless strategy of Carrom on this finely crafted wooden board. Featuring a smooth playing surface, it's perfect for both casual family game nights and competitive play.",
    specs: { "Material": "Wood", "Type": "Standard" },
    variations: {}
  },
  {
    id: "212",
    title: "RED Heavy-Duty Toy Dumper Truck",
    price: 380,
    image: "assets/dumper-truck-red-1.png",
    images: ["assets/dumper-truck-red-1.png", "assets/dumper-truck-red-2.png", "assets/dumper-truck-red-4.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 22,
    description: "Delight your little builder with this vibrant red heavy-duty dumper truck. Constructed from robust plastic, it's the perfect companion for active, imaginative outdoor play.",
    specs: { "Color": "Red", "Material": "Durable Plastic" },
    variations: {}
  },
  {
    id: "213",
    title: "Rastar 1/12 RC Mercedes-AMG F1 Car",
    price: 1500,
    image: "assets/rastar-f1-mercedes.png",
    images: ["assets/rastar-f1-mercedes.png", "assets/rastar-f1-mercedes-1.png", "assets/rastar-f1-mercedes-2.png", "assets/rastar-f1-mercedes-3.png"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 5.0,
    reviews: 3,
    description: "Take control of the track with this meticulously detailed 1/12 scale Mercedes-AMG F1 RC car. Experience precision handling and authentic styling that will thrill both collectors and racers.",
    specs: { "Scale": "1:12", "Type": "Remote Control", "Brand": "Rastar" },
    variations: {}
  },
  {
    id: "214",
    title: "Trojan 65cm Anti-Burst Gym Ball",
    price: 299,
    image: "assets/trojan-ball-65cm-1.png",
    images: ["assets/trojan-ball-65cm-1.png", "assets/trojan-ball-65cm-2.png", "assets/trojan-ball-65cm-3.png", "assets/trojan-ball-65cm-4.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.8,
    reviews: 25,
    description: "Maximize your workout potential with the versatile 65cm Trojan fitness ball. Its anti-burst design provides superior stability for stretching, core exercises, and posture improvement.",
    specs: { "Size": "65cm", "Feature": "Anti-Burst" },
    variations: {}
  },
  {
    id: "215",
    title: "Trojan Spin 140 Home Exercise Bike",
    price: 4500,
    image: "assets/trojan-spin-140.png",
    images: ["assets/trojan-spin-140.png", "assets/trojan-spin-140-22.png", "assets/trojan-spin-140-333.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 7,
    description: "Bring the cycling studio home with the Trojan Spin 140. With adjustable resistance and a sturdy build, it offers a smooth, quiet, and highly effective cardiovascular workout in your own space.",
    specs: { "Model": "Spin 140", "Resistance": "Adjustable" },
    variations: {}
  },
  {
    id: "216",
    title: "Trojan Toning Set (3-Piece)",
    price: 550,
    image: "assets/trojan-toning-set-1.png",
    images: ["assets/trojan-toning-set-1.png", "assets/trojan-toning-set-2.png", "assets/trojan-toning-set-4.png", "assets/trojan-toning-set-5.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.7,
    reviews: 11,
    description: "Kickstart your home fitness routine with this versatile 3-piece toning set. Carefully curated to target multiple muscle groups, it's your all-in-one solution for building strength and definition.",
    specs: { "Pieces": "3", "Type": "Toning Set" },
    variations: {}
  },
  {
    id: "217",
    title: "Trojan Yoga Mat 10mm",
    price: 450,
    image: "assets/trojan-yoga-mat-1.png",
    images: ["assets/trojan-yoga-mat-1.png", "assets/trojan-yoga-mat-2.png", "assets/trojan-yoga-mat-4.png", "assets/trojan-yoga-mat-6.png"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.8,
    reviews: 40,
    description: "Find your center in complete comfort. This extra-thick 10mm yoga mat provides exceptional cushioning and grip, ensuring support and stability through every pose and stretch.",
    specs: { "Thickness": "10mm", "Material": "NBR" },
    variations: { "Color": ["Black", "Blue", "Green"] }
  },
  {
    id: "218",
    title: "CAMP MASTER CLASSIC COOLER BAG",
    price: 300,
    image: "assets/CAMP MASTER CLASSIC COOLER BAG 18 can.png.jfif",
    images: ["assets/CAMP MASTER CLASSIC COOLER BAG 18 can.png.jfif", "assets/CAMP MASTER CLASSIC 18 can COOLER BAG.png (2).jfif", "assets/CAMP MASTER CLASSIC 18 can COOLER BAG.png.jfif"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.8,
    reviews: 14,
    description: "Keep your beverages chilled and your food fresh on every adventure. This classic 18-can cooler bag is lightweight, durable, and fully insulated—your perfect companion for picnics, camping, and road trips.",
    specs: { "Height": "4.0 cm", "Width": "33.0 cm", "Length": "63.0 cm" },
    variations: {}
  },
  {
    id: "219",
    title: "ADDIS 10 lt Jerry Can Petrol (RED)",
    price: 460,
    image: "assets/ADDIS 10 lt Jerry Can.PNG.webp",
    images: ["assets/ADDIS 10 lt Jerry Can.PNG.webp"],
    category: "Automotive",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 35,
    description: "Safely transport and store fuel with this robust, high-density 10L jerry can. Designed with an anti-spill nozzle and fluorine carbon internal treatment to guarantee secure and reliable storage for your peace of mind.",
    specs: { "Capacity": "10 L", "Material": "Plastic", "Colour": "Red" },
    variations: {}
  },
  {
    id: "220",
    title: "E-jet Jumbo Leaning Tower Crazy Ball",
    price: 463,
    image: "assets/E-jet Jumbo Leaning Tower Crazy Ball 1.webp",
    images: ["assets/E-jet Jumbo Leaning Tower Crazy Ball 1.webp", "assets/E-jet Jumbo Leaning Tower Crazy Ball (2).webp", "assets/E-jet Jumbo Leaning Tower Crazy Ball (3).webp", "assets/E-jet Jumbo Leaning Tower Crazy Ball (4).webp"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 4.7,
    reviews: 19,
    description: "Challenge your skills and enjoy endless laughter with the Jumbo Leaning Tower Crazy Ball game. An exciting, fast-paced activity that guarantees engaging fun for kids and adults alike.",
    specs: { "Material": "Plastic", "Age": "10+ Years", "Sport Type": "Crazy Ball" },
    variations: {}
  },
  {
    id: "221",
    title: "Pantha Push 12.5 Aluminium Kids Scooter (Grey)",
    price: 1700,
    image: "assets/Pantha Push 12.5 Aluminium Kids Scooter.webp",
    images: ["assets/Pantha Push 12.5 Aluminium Kids Scooter.webp"],
    category: "Sports",
    vendor: "MakertMyn Official",
    rating: 4.9,
    reviews: 8,
    description: "Upgrade their ride with this sleek, lightweight aluminium push scooter. Engineered for smooth gliding and maximum durability, it's the ultimate everyday cruiser for active kids and young teens.",
    specs: { "Material": "Metal", "Age": "12+ Years", "Dimensions": "55.6 cm x 1150 mm" },
    variations: {}
  },
  {
    id: "222",
    title: "Shot Renegade Dartboard Cabinet Set",
    price: 1600,
    image: "assets/Shot Renegade Dartboard Cabinet Set.jpeg",
    images: ["assets/Shot Renegade Dartboard Cabinet Set.jpeg", "assets/SHOT Renegade Cabinet Set.jfif"],
    category: "Toys & Games",
    vendor: "MakertMyn Official",
    rating: 5.0,
    reviews: 21,
    description: "Transform your entertainment area with this premium dartboard cabinet set. Featuring a high-quality bristle board and an elegant wooden cabinet, it provides a professional dart-playing experience right at home.",
    specs: { "Material": "Bristle & Wood", "Dimensions": "53cm x 57cm", "Weight": "10.5 kg" },
    variations: {}
  }
];

async function fetchProducts() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s max
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    const data = await res.json();

    if (res.ok && Array.isArray(data) && data.length > 0) {
      console.log("Loaded products from API");
      const apiProducts = data.map(p => ({
        id: p._id || p.id,
        title: p.title,
        price: p.price,
        image: p.image || (p.images && p.images[0]) || 'https://via.placeholder.com/500x500?text=No+Image+Available',
        images: p.images || [p.image],
        category: p.category,
        vendor: p.vendorName || "MarketMyn Seller",
        rating: p.rating || 4.5,
        reviews: p.numReviews || 0,
        description: p.description || "No description.",
        specs: p.specs || {},
        variations: p.variations || {}
      }));
      
      const apiTitles = new Set(apiProducts.map(p => p.title.toLowerCase()));
      const filteredSamples = SAMPLE_PRODUCTS.filter(p => !apiTitles.has(p.title.toLowerCase()));
      
      return [...apiProducts, ...filteredSamples];
    }
  } catch (err) {
    console.warn('API Error, using Fallback:', err);
  }
  return SAMPLE_PRODUCTS;
}

let products = [];
const CACHE_KEY = 'makertmyn_products_cache_v2';

function getAllProducts() { return products; }
function getProductById(id) { return products.find(p => p.id === id); }
function getBestSellers(limit = 8) { return products.slice(0, limit); }
function getNewArrivals(limit = 12) { return [...products].reverse().slice(0, limit); }
function getFlashDeals(limit = 4) { return products.length > 4 ? products.slice(4, 4 + limit) : products.slice(0, limit); }
function getDailyDrop(limit = 4) { return [...products].reverse().filter(p => p.price >= 1200).slice(0, limit); }

(async () => {
  console.log("Fetching fresh products from API...");
  const freshProducts = await fetchProducts();
  
  if (freshProducts && freshProducts.length > 0) {
    products = freshProducts;
    localStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } else {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) products = JSON.parse(cached);
    else products = SAMPLE_PRODUCTS;
  }
  window.dispatchEvent(new Event('productsLoaded'));
})();

export type Product = {
  id: string
  name: string
  brand: "KTM" | "Honda" | "Yamaha" | "Bajaj" | "Royal Enfield" | "Akrapovic" | "Yoshimura" | "SC-Project" | "Arrow" | "Termignoni" | "Ohlins" | "WP" | "Bitubo" | "Hyperpro" | "Andreani" | string
  category: "Brakes" | "Engine" | "Drive" | "Tyres" | "Exhaust" | "Suspension" | "Electronics" | "Bodywork" | "Lighting"
  price: number
  originalPrice?: number
  description: string
  image: string
  stock: number
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock"
  specs?: Record<string, string>
  performance?: PerformanceStats
  mechanicNotes?: string
  compatibleBrands?: string[] // For brand-based compatibility checking
  stats?: Partial<PerformanceStats>
}

export type Shop = {
  id: string
  name: string
  address: string
  city: string
  lat: number
  lng: number
  phone: string
  hours: string
  services: string[]
}

export type PerformanceStats = {
  speed: number
  acceleration: number
  braking: number
  handling: number
}

export type Bike = {
  id: string
  name: string
  brand: string
  model: string
  year: string
  image: string
  basePrice: number
  compatibleCategories: string[]
  stats: PerformanceStats
}

export const bikes: Bike[] = [
  {
    id: "bike-001",
    name: "KTM Duke 390",
    brand: "KTM",
    model: "Duke 390 (MY24)",
    year: "2024",
    image: "/bikes/ktm-390-duke-my24.png",
    basePrice: 350000,
    compatibleCategories: ["Brakes", "Engine", "Drive", "Tyres"],
    stats: { speed: 65, acceleration: 70, braking: 60, handling: 85 },
    mechanicNotes: "Precision-engineered backpressure optimization. Increases mid-range torque significantly for track exits."
  },
  {
    id: "bike-002",
    name: "Royal Enfield Himalayan 450",
    brand: "Royal Enfield",
    model: "Himalayan 450",
    year: "2024",
    image: "/bikes/re-himalayan-450.png",
    basePrice: 285000,
    compatibleCategories: ["Brakes", "Engine", "Drive", "Tyres"],
    stats: { speed: 50, acceleration: 45, braking: 55, handling: 70 }
  },
  {
    id: "bike-003",
    name: "Yamaha YZF-R15 V4",
    brand: "Yamaha",
    model: "YZF-R15 V4",
    year: "2024",
    image: "/bikes/yamaha-r15-v4.png",
    basePrice: 182000,
    compatibleCategories: ["Brakes", "Engine", "Drive", "Tyres"],
    stats: { speed: 55, acceleration: 60, braking: 65, handling: 90 }
  }
]

export const products: Product[] = [
  // Brakes
  {
    id: "brake-001",
    name: "Sintered Brake Pads Pro",
    brand: "KTM",
    category: "Brakes",
    price: 89.99,
    originalPrice: 119.99,
    description: "High-performance sintered brake pads with excellent heat dissipation and extended lifespan. Perfect for aggressive riding.",
    image: "/parts/brake-pads.png",
    stock: 24,
    stockStatus: "In Stock",
    specs: { "Material": "Sintered Metal", "Compatibility": "KTM Duke 390/250", "Weight": "120g" },
    stats: { braking: 15 }
  },
  {
    id: "brake-002",
    name: "Brembo GP4 Caliper",
    brand: "Honda",
    category: "Brakes",
    price: 449.99,
    description: "Racing-derived monobloc caliper with radial mount. Uncompromising braking performance.",
    image: "/parts/brembo-caliper.png",
    stock: 8,
    stockStatus: "In Stock",
    specs: { "Pistons": "4-Piston", "Material": "Aluminum Alloy", "Mount": "Radial" },
    stats: { braking: 25, handling: 5 }
  },
  {
    id: "brake-003",
    name: "Wave Disc Rotor 320mm",
    brand: "Yamaha",
    category: "Brakes",
    price: 189.99,
    description: "Lightweight wave-pattern rotor for superior heat management and consistent braking feel.",
    image: "/parts/wave-disc.png",
    stock: 3,
    stockStatus: "Low Stock",
    specs: { "Diameter": "320mm", "Thickness": "5mm", "Pattern": "Wave Cut" }
  },
  {
    id: "brake-004",
    name: "Steel Braided Brake Lines",
    brand: "Bajaj",
    category: "Brakes",
    price: 69.99,
    description: "DOT-approved steel braided lines for improved brake feel and reduced line expansion.",
    image: "/parts/brake-pads.png",
    stock: 0,
    stockStatus: "Backorder",
    specs: { "Material": "Stainless Steel", "Length": "Custom Fit", "Certification": "DOT/TUV" }
  },
  // Engine
  {
    id: "engine-001",
    name: "Forged Piston Kit 95mm",
    brand: "KTM",
    category: "Engine",
    price: 329.99,
    description: "Race-spec forged aluminum pistons with low friction coating for maximum power output.",
    image: "/parts/piston-kit.png",
    stock: 12,
    stockStatus: "In Stock",
    specs: { "Bore": "95mm", "Material": "Forged Aluminum", "Compression": "13.5:1" },
    stats: { speed: 10, acceleration: 15 }
  },
  {
    id: "engine-002",
    name: "Complete Gasket Set",
    brand: "Honda",
    category: "Engine",
    price: 149.99,
    description: "OEM-quality gasket set including all seals for a complete engine rebuild.",
    image: "/parts/gasket-set.png",
    stock: 45,
    stockStatus: "In Stock",
    specs: { "Pieces": "42 Components", "Material": "Multi-Layer Steel/Composite", "Fitment": "CBR600RR" }
  },
  {
    id: "engine-003",
    name: "Performance Crankshaft",
    brand: "Yamaha",
    category: "Engine",
    price: 899.99,
    originalPrice: 1099.99,
    description: "Precision-balanced crankshaft for high-RPM performance and reliability.",
    image: "/parts/crankshaft.png",
    stock: 2,
    stockStatus: "Low Stock",
    specs: { "Balance": "Computer Balanced", "Material": "4340 Steel", "Stroke": "Stock" }
  },
  {
    id: "engine-004",
    name: "Titanium Valve Set",
    brand: "Bajaj",
    category: "Engine",
    price: 599.99,
    description: "Lightweight titanium valves for higher rev limits and improved throttle response.",
    image: "/parts/titanium-valves.png",
    stock: 6,
    stockStatus: "In Stock",
    specs: { "Material": "Grade 5 Titanium", "Weight Savings": "45%", "Quantity": "8 Valves" }
  },
  // Drive
  {
    id: "drive-001",
    name: "520 O-Ring Chain Gold",
    brand: "KTM",
    category: "Drive",
    price: 129.99,
    description: "Premium gold O-ring chain with superior tensile strength and corrosion resistance.",
    image: "/parts/gold-chain.png",
    stock: 18,
    stockStatus: "In Stock",
    specs: { "Pitch": "520", "Links": "120", "Type": "O-Ring Sealed" },
    stats: { acceleration: 8 }
  },
  {
    id: "drive-002",
    name: "Steel Sprocket Kit",
    brand: "Honda",
    category: "Drive",
    price: 189.99,
    description: "Front and rear sprocket combo with optimized gearing for street performance.",
    image: "/parts/sprocket-kit.png",
    stock: 4,
    stockStatus: "Low Stock",
    specs: { "Front": "15T", "Rear": "45T", "Material": "Chromoly Steel" }
  },
  {
    id: "drive-003",
    name: "Quick-Change Sprocket Carrier",
    brand: "Yamaha",
    category: "Drive",
    price: 279.99,
    description: "Lightweight carrier allowing tool-free rear sprocket changes at the track.",
    image: "/parts/sprocket-kit.png",
    stock: 7,
    stockStatus: "In Stock",
    specs: { "Material": "7075-T6 Aluminum", "Weight": "890g", "Compatibility": "R1/R6" }
  },
  {
    id: "drive-004",
    name: "525 X-Ring Chain Kit",
    brand: "Bajaj",
    category: "Drive",
    price: 219.99,
    description: "Heavy-duty X-ring chain and sprocket kit for touring and adventure bikes.",
    image: "/parts/gold-chain.png",
    stock: 0,
    stockStatus: "Backorder",
    specs: { "Pitch": "525", "Links": "118", "Sprockets": "16T/42T" }
  },
  // Electronics & Maintenance
  {
    id: "maint-001",
    name: "Fully Synthetic Engine Oil 4T",
    brand: "KTM",
    category: "Engine",
    price: 49.99,
    description: "Ultra-premium 10W-40 synthetic oil for high-performance racing engines.",
    image: "/parts/engine-oil.png",
    stock: 120,
    stockStatus: "In Stock",
    specs: { "Grade": "10W-40", "Volume": "1L", "Type": "Full Synthetic" }
  },
  {
    id: "maint-002",
    name: "Iridium Power Spark Plug",
    brand: "Honda",
    category: "Engine",
    price: 19.99,
    description: "High-performance spark plug with iridium tip for superior ignition and power.",
    image: "/parts/spark-plug.png",
    stock: 85,
    stockStatus: "In Stock",
    specs: { "Material": "Iridium", "Heat Range": "9", "Longevity": "50,000 km" }
  },
  {
    id: "maint-003",
    name: "High-Flow Conical Air Filter",
    brand: "Yamaha",
    category: "Engine",
    price: 79.99,
    description: "Performance air filter with pleated media for maximum airflow and protection.",
    image: "/parts/air-filter.png",
    stock: 32,
    stockStatus: "In Stock",
    specs: { "Media": "Red Pleated Cotton", "Washable": "Yes", "Flange": "60mm" }
  },
  {
    id: "elec-001",
    name: "ApexVision Digital TFT Speedo",
    brand: "KTM",
    category: "Electronics",
    price: 449.99,
    description: "Full-color TFT display with integrated telemetry, lap timer, and Bluetooth connectivity.",
    image: "/parts/speedometer.png",
    stock: 14,
    stockStatus: "In Stock",
    specs: { "Display": "5\" TFT", "Resolution": "800x480", "Features": "GPS, Lap Timer" }
  },
  {
    id: "cool-001",
    name: "Pro-Cool Aluminum Radiator",
    brand: "Bajaj",
    category: "Engine",
    price: 299.99,
    description: "High-efficiency aluminum radiator with increased surface area for maximum cooling.",
    image: "/parts/piston-kit.png", // Temporary placeholder
    stock: 8,
    stockStatus: "In Stock",
    specs: { "Material": "Aluminum", "Core Thickness": "40mm", "Finish": "Black Powder Coat" }
  },
  // Tyres
  {
    id: "tyre-001",
    name: "Dual-Sport Adventure 170/60",
    brand: "KTM",
    category: "Tyres",
    price: 249.99,
    description: "50/50 dual-sport tyre with aggressive target pattern for on and off-road capability.",
    image: "/parts/dual-sport-tyre.png",
    stock: 14,
    stockStatus: "In Stock",
    specs: { "Size": "170/60 R17", "Type": "Dual Sport", "Load Rating": "72W" }
  },
  {
    id: "tyre-002",
    name: "Performance Slick Rear",
    brand: "Honda",
    category: "Tyres",
    price: 379.99,
    description: "Race-compound slick tyre for maximum grip on smooth track surfaces.",
    image: "/parts/dual-sport-tyre.png",
    stock: 5,
    stockStatus: "Low Stock",
    specs: { "Size": "190/55 R17", "Compound": "Soft Race", "Use": "Track Only" }
  },
  {
    id: "tyre-003",
    name: "Sport Touring Front 120/70",
    brand: "Yamaha",
    category: "Tyres",
    price: 199.99,
    description: "Long-lasting sport touring tyre with excellent wet weather performance.",
    image: "/parts/dual-sport-tyre.png",
    stock: 22,
    stockStatus: "In Stock",
    specs: { "Size": "120/70 R17", "Type": "Sport Touring", "Mileage": "12,000+ km" }
  },
  {
    id: "tyre-004",
    name: "Supermoto Street Slick",
    brand: "Bajaj",
    category: "Tyres",
    price: 159.99,
    description: "Street-legal slick-style tyre for supermoto and urban performance riding.",
    image: "/parts/dual-sport-tyre.png",
    stock: 9,
    stockStatus: "In Stock",
    specs: { "Size": "150/60 R17", "Type": "Supermoto", "DOT": "Approved" }
  }
]

export const shops: Shop[] = [
  {
    id: "shop-001",
    name: "ApexMoto Performance Hub",
    address: "123 Racing Boulevard",
    city: "Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    phone: "+91 22 1234 5678",
    hours: "9:00 AM - 8:00 PM",
    services: ["Engine Tuning", "Brake Service", "Tyre Fitting"]
  },
  {
    id: "shop-002",
    name: "ApexMoto Speedworks",
    address: "456 Motor Street",
    city: "Delhi",
    lat: 28.6139,
    lng: 77.2090,
    phone: "+91 11 2345 6789",
    hours: "10:00 AM - 7:00 PM",
    services: ["Full Service", "Parts Installation", "Diagnostics"]
  },
  {
    id: "shop-003",
    name: "ApexMoto Racing Center",
    address: "789 Track Lane",
    city: "Bangalore",
    lat: 12.9716,
    lng: 77.5946,
    phone: "+91 80 3456 7890",
    hours: "8:00 AM - 9:00 PM",
    services: ["Race Prep", "Suspension Setup", "ECU Mapping"]
  },
  {
    id: "shop-004",
    name: "ApexMoto Express",
    address: "321 Highway Road",
    city: "Chennai",
    lat: 13.0827,
    lng: 80.2707,
    phone: "+91 44 4567 8901",
    hours: "9:00 AM - 6:00 PM",
    services: ["Quick Service", "Tyre Change", "Oil Change"]
  },
  {
    id: "shop-005",
    name: "ApexMoto Pro Shop",
    address: "654 Gear Street",
    city: "Pune",
    lat: 18.5204,
    lng: 73.8567,
    phone: "+91 20 5678 9012",
    hours: "10:00 AM - 8:00 PM",
    services: ["Custom Builds", "Parts Sourcing", "Vintage Restoration"]
  },
  {
    id: "shop-006",
    name: "ApexMoto Adventure Base",
    address: "987 Trail Road",
    city: "Hyderabad",
    lat: 17.3850,
    lng: 78.4867,
    phone: "+91 40 6789 0123",
    hours: "9:00 AM - 7:00 PM",
    services: ["Adventure Prep", "Off-Road Setup", "Touring Packages"]
  },
  {
    id: "shop-007",
    name: "ApexMoto Metro",
    address: "147 Urban Plaza",
    city: "Kolkata",
    lat: 22.5726,
    lng: 88.3639,
    phone: "+91 33 7890 1234",
    hours: "10:00 AM - 6:00 PM",
    services: ["Urban Commuter Service", "Battery Service", "Chain & Sprocket"]
  },
  {
    id: "shop-008",
    name: "ApexMoto Coastal",
    address: "258 Beach Road",
    city: "Goa",
    lat: 15.2993,
    lng: 74.1240,
    phone: "+91 832 890 1234",
    hours: "9:00 AM - 5:00 PM",
    services: ["Rust Prevention", "Marine Grade Service", "Rental Fleet Maintenance"]
  }
]

// Exhaust Systems
export const exhaustProducts: Product[] = [
  {
    id: "exhaust-001",
    name: "Akrapovic Evolution Line Full System",
    brand: "Akrapovic",
    category: "Exhaust",
    price: 1899.99,
    originalPrice: 2199.99,
    description: "Race-developed titanium full exhaust system with carbon fiber end cap. Maximum power gains with unmistakable Akrapovic sound.",
    image: "/parts/piston-kit.png",
    stock: 6,
    stockStatus: "In Stock",
    specs: { "Material": "Titanium", "Weight Savings": "4.2kg", "Power Gain": "+8HP", "Certification": "EC Type Approved" },
    compatibleBrands: ["KTM", "Yamaha", "Honda"]
  },
  {
    id: "exhaust-002",
    name: "Yoshimura Alpha T Slip-On",
    brand: "Yoshimura",
    category: "Exhaust",
    price: 749.99,
    description: "Signature Yoshimura slip-on with stainless steel construction and carbon fiber heat shield. Deep, aggressive tone.",
    image: "/parts/crankshaft.png",
    stock: 12,
    stockStatus: "In Stock",
    specs: { "Material": "Stainless Steel", "Weight Savings": "1.8kg", "Sound Level": "94dB", "Finish": "Carbon Fiber Cap" },
    compatibleBrands: ["Honda", "Yamaha", "Bajaj"]
  },
  {
    id: "exhaust-003",
    name: "SC-Project CRT Full System",
    brand: "SC-Project",
    category: "Exhaust",
    price: 2299.99,
    description: "MotoGP-derived exhaust technology with twin silencer design. Extreme weight savings and maximum performance.",
    image: "/parts/titanium-valves.png",
    stock: 3,
    stockStatus: "Low Stock",
    specs: { "Material": "Titanium/Carbon", "Weight Savings": "5.1kg", "Power Gain": "+12HP", "Type": "Twin Silencer" },
    compatibleBrands: ["KTM", "Yamaha"],
    mechanicNotes: "Precision-engineered backpressure optimization. Increases mid-range torque significantly for track exits."
  },
  {
    id: "exhaust-004",
    name: "Arrow Race-Tech Silencer",
    brand: "Arrow",
    category: "Exhaust",
    price: 599.99,
    description: "Aluminum silencer with carbon end cap. Bolt-on performance upgrade with removable DB killer.",
    image: "/parts/gasket-set.png",
    stock: 18,
    stockStatus: "In Stock",
    specs: { "Material": "Aluminum", "Weight Savings": "1.2kg", "DB Killer": "Removable", "Length": "350mm" },
    compatibleBrands: ["KTM", "Honda", "Bajaj", "Royal Enfield"],
    mechanicNotes: "Ultra-lightweight titanium alloy. Reduces unsprung weight for faster lean transitions."
  },
  {
    id: "exhaust-005",
    name: "Termignoni GP Style Full System",
    brand: "Termignoni",
    category: "Exhaust",
    price: 1649.99,
    description: "Italian craftsmanship with Ducati racing heritage. Full titanium construction with carbon fiber accents.",
    image: "/parts/engine-oil.png",
    stock: 0,
    stockStatus: "Backorder",
    specs: { "Material": "Titanium", "Weight Savings": "3.8kg", "Power Gain": "+6HP", "Origin": "Made in Italy" },
    compatibleBrands: ["Honda", "Yamaha", "Royal Enfield"]
  },
]

// Suspension Parts
export const suspensionProducts: Product[] = [
  {
    id: "susp-001",
    name: "Ohlins TTX GP Rear Shock",
    brand: "Ohlins",
    category: "Suspension",
    price: 1499.99,
    description: "World Superbike-spec rear shock with through-rod technology. Fully adjustable compression and rebound damping.",
    image: "/parts/gold-chain.png",
    stock: 4,
    stockStatus: "In Stock",
    specs: { "Type": "TTX Through-Rod", "Adjustments": "Full Comp/Reb", "Spring Rate": "Custom Available", "Reservoir": "Piggyback" },
    compatibleBrands: ["KTM", "Yamaha", "Honda"]
  },
  {
    id: "susp-002",
    name: "WP XPLOR Pro Fork Cartridge Kit",
    brand: "WP",
    category: "Suspension",
    price: 1199.99,
    originalPrice: 1399.99,
    description: "Factory KTM suspension technology for aftermarket. Split-function damping with easy adjustment.",
    image: "/parts/sprocket-kit.png",
    stock: 8,
    stockStatus: "In Stock",
    specs: { "Type": "Cartridge Kit", "Damping": "Split Function", "Adjustment": "Clicker Style", "Oil Capacity": "480ml/leg" },
    compatibleBrands: ["KTM", "Bajaj"]
  },
  {
    id: "susp-003",
    name: "Bitubo WME Rear Shock",
    brand: "Bitubo",
    category: "Suspension",
    price: 649.99,
    description: "Italian-made rear shock with external reservoir. Hydraulic spring preload adjustment for easy setup.",
    image: "/parts/brembo-caliper.png",
    stock: 15,
    stockStatus: "In Stock",
    specs: { "Type": "Emulsion", "Preload": "Hydraulic", "Rebound": "12 Clicks", "Body": "Aluminum" },
    compatibleBrands: ["Honda", "Yamaha", "Royal Enfield", "Bajaj"]
  },
  {
    id: "susp-004",
    name: "Hyperpro Progressive Fork Springs",
    brand: "Hyperpro",
    category: "Suspension",
    price: 249.99,
    description: "Rising-rate progressive springs for improved comfort and control. Drop-in replacement for stock springs.",
    image: "/parts/wave-disc.png",
    stock: 22,
    stockStatus: "In Stock",
    specs: { "Type": "Progressive Rate", "Material": "Chrome Silicon", "Finish": "Purple Powder Coat", "Includes": "Preload Spacers" },
    compatibleBrands: ["KTM", "Honda", "Yamaha", "Bajaj", "Royal Enfield"]
  },
  {
    id: "susp-005",
    name: "Andreani Misano EVO Cartridge",
    brand: "Andreani",
    category: "Suspension",
    price: 899.99,
    description: "Professional-grade fork cartridge with 20-click compression and rebound adjustment. Race-proven performance.",
    image: "/parts/brake-pads.png",
    stock: 2,
    stockStatus: "Low Stock",
    specs: { "Type": "Pressurized Cartridge", "Compression": "20 Clicks", "Rebound": "20 Clicks", "Compatibility": "Most 41-43mm Forks" },
    compatibleBrands: ["Honda", "Yamaha"]
  },
  {
    id: "susp-006",
    name: "Ohlins Road & Track Front Fork Kit",
    brand: "Ohlins",
    category: "Suspension",
    price: 2199.99,
    description: "Complete front fork assembly with NIX30 cartridges. The ultimate upgrade for serious riders.",
    image: "/parts/dual-sport-tyre.png",
    stock: 1,
    stockStatus: "Low Stock",
    specs: { "Type": "NIX30 Cartridge", "Diameter": "43mm", "Adjustments": "30 Comp/30 Reb", "Finish": "Gold Anodized" },
    compatibleBrands: ["KTM", "Yamaha"]
  },
]

// Electronics & Intelligence
export const electronicsProducts: Product[] = [
  {
    id: "elec-002",
    name: "Rapid Bike EVO Fuel Module",
    brand: "Rapid Bike",
    category: "Electronics",
    price: 499.99,
    description: "Adaptive fuel injection management system. Continuously optimizes air-fuel ratio for maximum efficiency and power.",
    image: "/parts/engine-oil.png",
    stock: 15,
    stockStatus: "In Stock",
    specs: { "Type": "Piggyback ECU", "Auto-tune": "Supported", "Interface": "CAN-Bus", "Compatibility": "Universal" },
    compatibleBrands: ["KTM", "Yamaha", "Honda", "Bajaj"],
    stats: { speed: 4, acceleration: 12, braking: 0, handling: 2 },
    mechanicNotes: "The auto-adaptive logic is brilliant. It maps your riding style in real-time without needing a dyno."
  },
  {
    id: "elec-003",
    name: "Translogic Quickshifter iS4",
    brand: "Translogic",
    category: "Electronics",
    price: 389.99,
    description: "The world's smallest and most reliable multi-channel quickshifter. Seamless upshifts without using the clutch.",
    image: "/parts/titanium-valves.png",
    stock: 8,
    stockStatus: "In Stock",
    specs: { "Sensor": "Intellishift", "Channels": "4-Channel", "Adjustment": "Digital Control", "Wiring": "Plug & Play" },
    compatibleBrands: ["KTM", "Yamaha", "Honda", "Royal Enfield"],
    stats: { speed: 0, acceleration: 15, braking: 0, handling: 0 },
    mechanicNotes: "Translogic sensors are the industry standard. This unit eliminates shift-lag entirely."
  },
  {
    id: "elec-004",
    name: "Dynojet Power Commander VI",
    brand: "Dynojet",
    category: "Electronics",
    price: 449.99,
    description: "Latest generation fuel management. Allows for precise adjustments to the fuel curve based on RPM and throttle position.",
    image: "/parts/piston-kit.png",
    stock: 12,
    stockStatus: "In Stock",
    specs: { "Type": "Fuel Controller", "Software": "Power Core", "Connectivity": "USB-C", "Maps": "Pre-loaded Available" },
    compatibleBrands: ["Yamaha", "Honda", "Royal Enfield"],
    stats: { speed: 6, acceleration: 8, braking: 0, handling: 0 },
    mechanicNotes: "Best choice for custom builds. The community map library for Power Commanders is unmatched."
  }
]

// Bodywork & Aerodynamics
export const bodyworkProducts: Product[] = [
  {
    id: "body-001",
    name: "Carbon Fiber Aero Winglets",
    brand: "Apex Performance",
    category: "Bodywork",
    price: 299.99,
    description: "MotoGP-inspired winglets for increased downforce. Improves front-end stability at high speeds.",
    image: "/parts/brembo-caliper.png",
    stock: 20,
    stockStatus: "In Stock",
    specs: { "Material": "Pre-preg Carbon", "Downforce": "+15kg @ 200kmh", "Finish": "Gloss 3K Weave", "Weight": "240g/pair" },
    compatibleBrands: ["KTM", "Yamaha", "Honda"],
    stats: { speed: 0, acceleration: 0, braking: 2, handling: 18 },
    mechanicNotes: "These aren't just for looks. You'll feel the front end much more planted during high-speed exits."
  },
  {
    id: "body-002",
    name: "Puig Racing Windscreen",
    brand: "Puig",
    category: "Bodywork",
    price: 129.99,
    description: "Double-bubble design for reduced wind blast. Manufactured from high-impact acrylic for durability.",
    image: "/parts/gasket-set.png",
    stock: 45,
    stockStatus: "In Stock",
    specs: { "Material": "High-Impact Acrylic", "Thickness": "3mm", "Height": "+40mm vs Stock", "TUV": "Certified" },
    compatibleBrands: ["Bajaj", "KTM", "Yamaha", "Honda"],
    stats: { speed: 5, acceleration: 0, braking: 0, handling: 2 },
    mechanicNotes: "Essential for long-distance stability. Reduces rider fatigue by moving the air pocket over the helmet."
  }
]

// Lighting & Optics
export const lightingProducts: Product[] = [
  {
    id: "light-001",
    name: "Vision-X Adaptive LED Pods",
    brand: "Vision-X",
    category: "Lighting",
    price: 549.99,
    description: "Smart lighting that leans with the bike. Illuminates corners before you enter them using onboard gyroscopes.",
    image: "/parts/sprocket-kit.png",
    stock: 5,
    stockStatus: "Low Stock",
    specs: { "Lumens": "3200lm/pod", "Technology": "Gyro-Adaptive", "Housing": "Billet Aluminum", "IP Rating": "IP69K" },
    compatibleBrands: ["Royal Enfield", "KTM", "Honda"],
    stats: { speed: 0, acceleration: 0, braking: 0, handling: 10 },
    mechanicNotes: "A game changer for night deployments. The adaptive beam ensures you never ride into a dark corner."
  }
]

// Combined products array
export const allProducts: Product[] = [
  ...products, 
  ...exhaustProducts, 
  ...suspensionProducts, 
  ...electronicsProducts, 
  ...bodyworkProducts, 
  ...lightingProducts
]

export type CartItem = Product & { quantity: number }

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "out_for_delivery" | "delivered" | "cancelled"

export type OrderTimeline = {
  status: OrderStatus
  timestamp: string
  description: string
  location?: string
}

export type PaymentMethod = "gpay" | "cod" | "card"
export type PaymentStatus = "pending" | "paid" | "failed"

export type Order = {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  timeline: OrderTimeline[]
  shippingAddress: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  trackingNumber?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export type Loadout = {
  id: string
  name: string
  creator: string
  bikeId: string
  partIds: string[]
  stats: PerformanceStats
  totalPrice: number
  likes: number
  createdAt: string
}

// Sample orders for demo
export const sampleOrders: Order[] = [
  {
    id: "order-001",
    orderNumber: "APX-2024-001",
    customerId: "cust-001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@example.com",
    customerPhone: "+91 98765 43210",
    items: [
      { ...products[0], quantity: 2 },
      { ...products[4], quantity: 1 },
    ],
    subtotal: 509.97,
    shipping: 49.99,
    tax: 91.79,
    total: 651.75,
    status: "shipped",
    timeline: [
      { status: "pending", timestamp: "2024-01-15T10:30:00Z", description: "Order placed successfully" },
      { status: "confirmed", timestamp: "2024-01-15T11:00:00Z", description: "Payment confirmed" },
      { status: "processing", timestamp: "2024-01-15T14:00:00Z", description: "Order is being prepared", location: "ApexMoto Warehouse, Mumbai" },
      { status: "shipped", timestamp: "2024-01-16T09:00:00Z", description: "Package handed to courier", location: "Mumbai Hub" },
    ],
    shippingAddress: {
      street: "123 MG Road, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400058",
      country: "India"
    },
    trackingNumber: "APEX1234567890",
    estimatedDelivery: "2024-01-19",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T09:00:00Z"
  },
  {
    id: "order-002",
    orderNumber: "APX-2024-002",
    customerId: "cust-002",
    customerName: "Priya Patel",
    customerEmail: "priya@example.com",
    customerPhone: "+91 87654 32109",
    items: [
      { ...products[1], quantity: 1 },
      { ...products[8], quantity: 1 },
    ],
    subtotal: 579.98,
    shipping: 0,
    tax: 104.40,
    total: 684.38,
    status: "delivered",
    timeline: [
      { status: "pending", timestamp: "2024-01-10T15:20:00Z", description: "Order placed successfully" },
      { status: "confirmed", timestamp: "2024-01-10T15:45:00Z", description: "Payment confirmed" },
      { status: "processing", timestamp: "2024-01-10T18:00:00Z", description: "Order is being prepared", location: "ApexMoto Warehouse, Delhi" },
      { status: "shipped", timestamp: "2024-01-11T08:30:00Z", description: "Package handed to courier", location: "Delhi Hub" },
      { status: "out_for_delivery", timestamp: "2024-01-13T07:00:00Z", description: "Out for delivery", location: "Bangalore Local Hub" },
      { status: "delivered", timestamp: "2024-01-13T14:30:00Z", description: "Delivered successfully", location: "Bangalore" },
    ],
    shippingAddress: {
      street: "456 Indiranagar, 100 Feet Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560038",
      country: "India"
    },
    trackingNumber: "APEX0987654321",
    estimatedDelivery: "2024-01-13",
    createdAt: "2024-01-10T15:20:00Z",
    updatedAt: "2024-01-13T14:30:00Z"
  },
  {
    id: "order-003",
    orderNumber: "APX-2024-003",
    customerId: "cust-003",
    customerName: "Amit Kumar",
    customerEmail: "amit@example.com",
    customerPhone: "+91 76543 21098",
    items: [
      { ...products[6], quantity: 1 },
    ],
    subtotal: 899.99,
    shipping: 99.99,
    tax: 180.00,
    total: 1179.98,
    status: "processing",
    timeline: [
      { status: "pending", timestamp: "2024-01-18T09:00:00Z", description: "Order placed successfully" },
      { status: "confirmed", timestamp: "2024-01-18T09:30:00Z", description: "Payment confirmed" },
      { status: "processing", timestamp: "2024-01-18T12:00:00Z", description: "Order is being prepared", location: "ApexMoto Warehouse, Chennai" },
    ],
    shippingAddress: {
      street: "789 T Nagar, South Usman Road",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600017",
      country: "India"
    },
    estimatedDelivery: "2024-01-22",
    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-18T12:00:00Z"
  }
]

// Brand compatibility groups for the compatibility checker
export const brandCompatibilityGroups: Record<string, string[]> = {
  "Performance Exhaust": ["Akrapovic", "Yoshimura", "SC-Project", "Arrow", "Termignoni"],
  "Premium Suspension": ["Ohlins", "WP", "Bitubo", "Hyperpro", "Andreani"],
  "OEM Parts": ["KTM", "Honda", "Yamaha", "Bajaj", "Royal Enfield"],
}

// Helper function to check if brands are compatible
export function checkBrandCompatibility(items: CartItem[]): { isCompatible: boolean; warnings: string[] } {
  const warnings: string[] = []
  
  // Get unique brands in cart
  const brandsInCart = [...new Set(items.map(item => item.brand))]
  
  // Check if mixing performance exhaust brands
  const exhaustBrands = brandsInCart.filter(b => brandCompatibilityGroups["Performance Exhaust"].includes(b))
  if (exhaustBrands.length > 1) {
    warnings.push(`Mixing exhaust brands (${exhaustBrands.join(", ")}) may cause fitment issues. We recommend sticking to one exhaust brand.`)
  }
  
  // Check if mixing suspension brands
  const suspensionBrands = brandsInCart.filter(b => brandCompatibilityGroups["Premium Suspension"].includes(b))
  if (suspensionBrands.length > 1) {
    warnings.push(`Mixing suspension brands (${suspensionBrands.join(", ")}) is not recommended. For optimal performance, use matching front/rear components.`)
  }
  
  // Check if exhaust/suspension is compatible with OEM parts
  const oemBrands = brandsInCart.filter(b => brandCompatibilityGroups["OEM Parts"].includes(b))
  
  items.forEach(item => {
    if (item.compatibleBrands && item.compatibleBrands.length > 0) {
      const hasCompatibleOEM = oemBrands.some(oem => item.compatibleBrands?.includes(oem))
      if (oemBrands.length > 0 && !hasCompatibleOEM && (item.category === "Exhaust" || item.category === "Suspension")) {
        warnings.push(`${item.name} may not be compatible with your selected ${oemBrands.join("/")} parts.`)
      }
    }
  })
  
  return {
    isCompatible: warnings.length === 0,
    warnings
  }
}

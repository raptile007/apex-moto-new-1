"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { allProducts as initialProducts, shops as initialShops, sampleOrders, checkBrandCompatibility, type Product, type Shop, type CartItem, type Order, type OrderStatus } from "./data"

type StoreContextType = {
  // Products
  products: Product[]
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addProduct: (product: Product) => Promise<void>
  
  // Shops
  shops: Shop[]
  updateShop: (id: string, updates: Partial<Shop>) => Promise<void>
  deleteShop: (id: string) => Promise<void>
  addShop: (shop: Shop) => Promise<void>

  // Bikes
  bikes: any[]
  
  // Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  cartCount: number
  
  // Wishlist
  wishlist: string[]
  toggleWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  
  // Search & Filters
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedBrand: string | null
  setSelectedBrand: (brand: string | null) => void
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  filteredProducts: Product[]
  
  // UI State
  isLoading: boolean
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  selectedParts: Record<string, Product>
  setSelectedParts: (parts: Record<string, Product>) => void
  
  isCheckoutModalOpen: boolean
  setIsCheckoutModalOpen: (open: boolean) => void
  
  // Orders
  orders: Order[]
  addOrder: (order: Order) => Promise<void>
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => Promise<void>
  getOrderByNumber: (orderNumber: string) => Order | undefined
  
  // Garage (Saved Builds)
  garage: { id: string; name: string; bike: any; parts: Record<string, Product>; createdAt: string }[]
  saveToGarage: (name: string, bike: any, parts: Record<string, Product>) => Promise<void>
  removeFromGarage: (id: string) => Promise<void>

  // Resident Data
  telemetryData: any[]
  achievements: any[]
  activities: any[]
}

const StoreContext = createContext<StoreContextType | null>(null)

// Helper function for order status descriptions
function getStatusDescription(status: OrderStatus): string {
  const descriptions: Record<OrderStatus, string> = {
    pending: "Order placed successfully",
    confirmed: "Payment confirmed",
    processing: "Order is being prepared",
    shipped: "Package handed to courier",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered successfully",
    cancelled: "Order has been cancelled"
  }
  return descriptions[status]
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // Products state
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [shops, setShops] = useState<Shop[]>(initialShops)
  const [bikes, setBikes] = useState<any[]>([])
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [isLoading, setIsLoading] = useState(true)
  
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  
  // Wishlist state
  const [wishlist, setWishlist] = useState<string[]>([])
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  
  // UI State
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedParts, setSelectedParts] = useState<Record<string, Product>>({})
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  
  // Garage state
  const [garage, setGarage] = useState<{ id: string; name: string; bike: any; parts: Record<string, Product>; createdAt: string }[]>([])
  
  // Resident state
  const [telemetryData, setTelemetryData] = useState<any[]>([])
  // Achievement state
  const [achievements, setAchievements] = useState<any[]>([])
  
  // Booking state
  const [bookings, setBookings] = useState<any[]>([])
  
  // Activity state
  const [activities, setActivities] = useState<any[]>([])
  
  // Fetch data from backend
  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

    async function fetchAll() {
      setIsLoading(true);
      console.log('🔄 Synchronizing with ApexMoto Backend...');
      try {
        const fetchOptions = { cache: 'no-store' as RequestCache };
        const [prodRes, shopRes, bikeRes, orderRes, garageRes, bookingsRes, activitiesRes, statRes, awardRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`, fetchOptions),
          fetch(`${API_BASE}/api/shops`, fetchOptions),
          fetch(`${API_BASE}/api/bikes`, fetchOptions),
          fetch(`${API_BASE}/api/orders`, fetchOptions),
          fetch(`${API_BASE}/api/garage`, fetchOptions),
          fetch(`${API_BASE}/api/bookings`, fetchOptions),
          fetch(`${API_BASE}/api/activities`, fetchOptions),
          fetch(`${API_BASE}/api/resident/stats`, fetchOptions),
          fetch(`${API_BASE}/api/resident/achievements`, fetchOptions)
        ]);

        const safeParse = (str: any) => {
          if (!str || typeof str !== 'string') return str;
          try { return JSON.parse(str); } catch { return str; }
        };

        const ensureArray = (val: any) => {
          const parsed = safeParse(val);
          if (Array.isArray(parsed)) return parsed;
          if (!parsed) return [];
          return [parsed];
        };

        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.map((p: any) => ({
            ...p,
            specs: safeParse(p.specs) || {},
            stats: safeParse(p.stats) || {}
          })));
          console.log(`📦 Loaded ${data.length} products`);
        }
        
        if (shopRes.ok) {
          const data = await shopRes.json();
          setShops(data.map((s: any) => ({
            ...s,
            services: ensureArray(s.services)
          })));
          console.log(`🏪 Loaded ${data.length} shops`);
        }
        
        if (bikeRes.ok) {
          const data = await bikeRes.json();
          setBikes(data.map((b: any) => ({
            ...b,
            stats: safeParse(b.stats) || {},
            compatibleCategories: ensureArray(b.compatibleCategories)
          })));
          console.log(`🏍️ Loaded ${data.length} bikes`);
        }
        
        if (orderRes.ok) {
          const data = await orderRes.json();
          setOrders(data.map((o: any) => ({
            ...o,
            items: ensureArray(o.items),
            timeline: ensureArray(o.timeline),
            shippingAddress: safeParse(o.shippingAddress) || {}
          })));
          console.log(`📋 Loaded ${data.length} orders`);
        }
        
        if (garageRes.ok) {
          const data = await garageRes.json();
          setGarage(data.map((g: any) => ({
            ...g,
            bike: safeParse(g.bike) || {},
            parts: safeParse(g.parts) || {}
          })));
          console.log(`🛠️ Loaded ${data.length} garage builds`);
        }

        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookings(data);
          console.log(`📅 Loaded ${data.length} bookings`);
        }

        if (activitiesRes.ok) {
          const data = await activitiesRes.json();
          setActivities(data);
          console.log(`📡 Loaded ${data.length} activities`);
        }
        
        if (statRes.ok) setTelemetryData(await statRes.json());
        if (awardRes.ok) setAchievements(await awardRes.json());
        
        console.log('✅ Backend synchronization complete');
      } catch (err) {
        console.error('❌ Backend synchronization failed:', err);
        console.warn('⚠️ Using local fallback data');
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [])

  // Hydration from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("apexmoto_cart")
    const savedWishlist = localStorage.getItem("apexmoto_wishlist")
    const savedParts = localStorage.getItem("apexmoto_selected_parts")

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (e) {
        console.error("Failed to parse wishlist", e)
      }
    }
    if (savedParts) {
      try {
        setSelectedParts(JSON.parse(savedParts))
      } catch (e) {
        console.error("Failed to parse selected parts", e)
      }
    }
  }, [])

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem("apexmoto_cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem("apexmoto_wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem("apexmoto_selected_parts", JSON.stringify(selectedParts))
  }, [selectedParts])
  
  // Product handlers
  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === id ? updated : p));
      }
    } catch (err) {
      console.error('Failed to update product', err);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  }, [])
  
  const deleteProduct = useCallback(async (id: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete product', err);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  }, [])
  
  const addProduct = useCallback(async (product: Product) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const created = await res.json();
        setProducts(prev => [...prev, created]);
      }
    } catch (err) {
      console.error('Failed to add product', err);
      setProducts(prev => [...prev, product]);
    }
  }, [])
  
  // Shop handlers
  const updateShop = useCallback(async (id: string, updates: Partial<Shop>) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/shops/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setShops(prev => prev.map(s => s.id === id ? updated : s));
      }
    } catch (err) {
      console.error('Failed to update shop', err);
      setShops(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }
  }, [])
  
  const deleteShop = useCallback(async (id: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/shops/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setShops(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete shop', err);
      setShops(prev => prev.filter(s => s.id !== id));
    }
  }, [])
  
  const addShop = useCallback(async (shop: Shop) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/shops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shop)
      });
      if (res.ok) {
        const created = await res.json();
        setShops(prev => [...prev, created]);
      }
    } catch (err) {
      console.error('Failed to add shop', err);
      setShops(prev => [...prev, shop]);
    }
  }, [])
  
  // Cart handlers
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }, [])
  
  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }, [])
  
  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId))
    } else {
      setCart(prev => prev.map(item => 
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }, [])
  
  const clearCart = useCallback(() => {
    setCart([])
  }, [])
  
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  
  // Cart compatibility check
  const cartCompatibility = checkBrandCompatibility(cart)
  
  // Order handlers
  const addOrder = useCallback(async (order: Order) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      
      if (res.ok) {
        const savedOrder = await res.json();
        setOrders(prev => [savedOrder, ...prev]);
        console.log('✅ Order synced with backend');
      } else {
        const error = await res.json();
        console.error('❌ Backend order creation failed:', error);
        // Fallback to local state
        setOrders(prev => [order, ...prev]);
      }
    } catch (err) {
      console.warn('⚠️ Backend not reachable, order saved locally only', err);
      setOrders(prev => [order, ...prev]);
    }
  }, [])
  
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newTimeline = [...order.timeline, {
      status,
      timestamp: new Date().toISOString(),
      description: getStatusDescription(status),
    }];

    const updates = { 
      status, 
      timeline: newTimeline,
      trackingNumber: trackingNumber || order.trackingNumber,
      updatedAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      }
    } catch (err) {
      console.error('Failed to update order status', err);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    }
  }, [orders])
  
  const getOrderByNumber = useCallback((orderNumber: string) => {
    return orders.find(o => o.orderNumber === orderNumber)
  }, [orders])

  // Garage handlers
  const saveToGarage = useCallback(async (name: string, bike: any, parts: Record<string, Product>) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    const newBuild = {
      id: `build-${Date.now()}`,
      name,
      bike,
      parts,
      createdAt: new Date().toISOString()
    };
    
    try {
      const res = await fetch(`${API_BASE}/api/garage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuild)
      });
      if (res.ok) {
        const saved = await res.json();
        setGarage(prev => [...prev, saved]);
      }
    } catch (err) {
      console.error('Failed to save to garage', err);
      setGarage(prev => [...prev, newBuild]);
    }
  }, []);
  
  const removeFromGarage = useCallback(async (id: string) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/garage/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGarage(prev => prev.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove from garage', err);
      setGarage(prev => prev.filter(g => g.id !== id));
    }
  }, []);

  // Booking handlers
  const addBooking = useCallback(async (booking: any) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking)
      });
      if (res.ok) {
        const saved = await res.json();
        setBookings(prev => [saved, ...prev]);
        return saved;
      }
    } catch (err) {
      console.error('Failed to add booking', err);
      setBookings(prev => [booking, ...prev]);
      return booking;
    }
  }, []);
  
  // Wishlist handlers
  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }, [])
  
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.includes(productId)
  }, [wishlist])
  
  // Filtered products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice
  })
  
  return (
    <StoreContext.Provider value={{
      products,
      updateProduct,
      deleteProduct,
      addProduct,
      shops,
      updateShop,
      deleteShop,
      addShop,
      bikes,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      searchQuery,
      setSearchQuery,
      selectedCategory,
      setSelectedCategory,
      selectedBrand,
      setSelectedBrand,
      priceRange,
      setPriceRange,
      filteredProducts,
      isLoading,
      isCartOpen,
      setIsCartOpen,
      selectedProduct,
      setSelectedProduct,
      selectedParts,
      setSelectedParts,
      isCheckoutModalOpen,
      setIsCheckoutModalOpen,
      orders,
      addOrder,
      updateOrderStatus,
      getOrderByNumber,
      garage,
      saveToGarage,
      removeFromGarage,
      bookings,
      addBooking,
      activities,
      cartCompatibility,
      telemetryData,
      achievements,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}

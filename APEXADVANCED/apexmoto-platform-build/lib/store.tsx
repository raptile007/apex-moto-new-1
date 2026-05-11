"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { allProducts as initialProducts, shops as initialShops, sampleOrders, checkBrandCompatibility, type Product, type Shop, type CartItem, type Order, type OrderStatus } from "./data"

type StoreContextType = {
  // Products
  products: Product[]
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addProduct: (product: Product) => void
  
  // Shops
  shops: Shop[]
  updateShop: (id: string, updates: Partial<Shop>) => void
  deleteShop: (id: string) => void
  addShop: (shop: Shop) => void
  
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
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void
  getOrderByNumber: (orderNumber: string) => Order | undefined
  
  // Garage (Saved Builds)
  garage: { id: string; name: string; bike: any; parts: Record<string, Product>; createdAt: string }[]
  saveToGarage: (name: string, bike: any, parts: Record<string, Product>) => void
  removeFromGarage: (id: string) => void

  // Compatibility
  cartCompatibility: { isCompatible: boolean; warnings: string[] }
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
  
  // Shops state
  const [shops, setShops] = useState<Shop[]>(initialShops)
  
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
  
  // Orders state
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  
  // Garage state
  const [garage, setGarage] = useState<{ id: string; name: string; bike: any; parts: Record<string, Product>; createdAt: string }[]>([])
  
  // Hydration from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("apexmoto_cart")
    const savedWishlist = localStorage.getItem("apexmoto_wishlist")
    const savedParts = localStorage.getItem("apexmoto_selected_parts")
    const savedGarage = localStorage.getItem("apexmoto_garage")

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
    if (savedGarage) {
      try {
        setGarage(JSON.parse(savedGarage))
      } catch (e) {
        console.error("Failed to parse garage", e)
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

  useEffect(() => {
    localStorage.setItem("apexmoto_garage", JSON.stringify(garage))
  }, [garage])
  
  // Product handlers
  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
  }, [])
  
  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])
  
  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product])
  }, [])
  
  // Shop handlers
  const updateShop = useCallback((id: string, updates: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])
  
  const deleteShop = useCallback((id: string) => {
    setShops(prev => prev.filter(s => s.id !== id))
  }, [])
  
  const addShop = useCallback((shop: Shop) => {
    setShops(prev => [...prev, shop])
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
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [order, ...prev])
  }, [])
  
  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const newTimeline = [...order.timeline, {
          status,
          timestamp: new Date().toISOString(),
          description: getStatusDescription(status),
        }]
        return { 
          ...order, 
          status, 
          timeline: newTimeline,
          trackingNumber: trackingNumber || order.trackingNumber,
          updatedAt: new Date().toISOString()
        }
      }
      return order
    }))
  }, [])
  
  const getOrderByNumber = useCallback((orderNumber: string) => {
    return orders.find(o => o.orderNumber === orderNumber)
  }, [orders])

  // Garage handlers
  const saveToGarage = useCallback((name: string, bike: any, parts: Record<string, Product>) => {
    setGarage(prev => [
      {
        id: Math.random().toString(36).substring(2, 9),
        name,
        bike,
        parts,
        createdAt: new Date().toISOString()
      },
      ...prev
    ])
  }, [])

  const removeFromGarage = useCallback((id: string) => {
    setGarage(prev => prev.filter(item => item.id !== id))
  }, [])
  
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
      cartCompatibility,
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

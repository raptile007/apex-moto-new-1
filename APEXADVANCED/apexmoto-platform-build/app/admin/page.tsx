"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { 
  Package, 
  MapPin, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  Search,
  Pencil,
  Phone,
  ArrowLeft,
  TrendingUp,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Check,
  X,
  Clock,
  Truck,
  CheckCircle2,
  Box,
  Eye,
  Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useStore } from "@/lib/store"
import { type Product, type Shop, type Order, type OrderStatus } from "@/lib/data"
import { toast } from "sonner"

type Tab = "overview" | "products" | "orders" | "shops" | "residents" | "bookings"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs = [
    { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
    { id: "products" as Tab, label: "Products", icon: Package },
    { id: "orders" as Tab, label: "Orders", icon: Truck },
    { id: "shops" as Tab, label: "Shops", icon: MapPin },
    { id: "bookings" as Tab, label: "Bookings", icon: Clock },
    { id: "residents" as Tab, label: "Residents", icon: Users },
  ]

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-6">
              <Link href="/">
                <motion.div 
                  whileHover={{ scale: 1.05, x: -2 }} 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[10px] font-black tracking-widest uppercase italic">EXIT TO STORE</span>
                </motion.div>
              </Link>
              <div className="h-8 w-px bg-white/10 hidden sm:block" />
              <h1 className="font-display font-black text-xl tracking-tighter uppercase italic hidden sm:block">
                APEX<span className="text-apex-orange">COMMAND</span>
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="SEARCH DATABASE..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-12 h-11 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 focus:border-apex-orange/50 text-[10px] font-black tracking-widest uppercase placeholder:text-neutral-600"
                />
              </div>
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white hover:bg-white/5">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs */}
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4 hide-scrollbar">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-display font-black text-[10px] tracking-widest uppercase italic transition-all border ${
                activeTab === tab.id
                  ? "bg-apex-orange border-apex-orange text-white shadow-[0_0_20px_rgba(255,77,0,0.3)]"
                  : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" />}
          {activeTab === "products" && <ProductsTab key="products" searchQuery={searchQuery} />}
          {activeTab === "orders" && <OrdersTab key="orders" searchQuery={searchQuery} />}
          {activeTab === "shops" && <ShopsTab key="shops" searchQuery={searchQuery} />}
          {activeTab === "bookings" && <BookingsTab key="bookings" searchQuery={searchQuery} />}
          {activeTab === "residents" && <ResidentsTab key="residents" searchQuery={searchQuery} />}
        </AnimatePresence>
      </div>
    </div>
  )
}

function OverviewTab() {
  const { products, activities } = useStore()

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return then.toLocaleDateString();
  };

  const stats = [
    { 
      label: "Total Revenue", 
      value: "$48,352", 
      change: "+12.5%", 
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600"
    },
    { 
      label: "Orders", 
      value: "1,234", 
      change: "+8.2%", 
      icon: ShoppingCart,
      color: "bg-blue-100 text-blue-600"
    },
    { 
      label: "Customers", 
      value: "5,678", 
      change: "+15.3%", 
      icon: Users,
      color: "bg-purple-100 text-purple-600"
    },
    { 
      label: "Products", 
      value: products.length.toString(), 
      change: "Active", 
      icon: Package,
      color: "bg-amber-100 text-amber-600"
    },
  ]

  const lowStockProducts = products.filter(p => p.stockStatus === "Low Stock" || p.stockStatus === "Backorder")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-1 h-full bg-apex-orange transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />
              <CardContent className="p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 mb-2 uppercase">{stat.label}</p>
                    <p className="text-4xl font-display font-black italic tracking-tighter uppercase">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <TrendingUp className="w-4 h-4 text-apex-orange" />
                      <span className="text-[10px] text-apex-orange font-black italic tracking-widest uppercase">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 text-apex-orange border border-white/5`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="bg-apex-orange/5 border-apex-orange/20">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-apex-orange font-display font-black italic uppercase tracking-tighter">
              <AlertTriangle className="w-6 h-6" />
              CRITICAL STOCK ALERTS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-white/5 rounded-xl overflow-hidden">
                      <Image src={product.image} alt="" fill className="object-cover opacity-50" />
                    </div>
                    <div>
                      <p className="font-display font-black text-xs italic uppercase tracking-tight">{product.name}</p>
                      <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">{product.brand} • {product.category}</p>
                    </div>
                  </div>
                  <Badge className="bg-apex-orange text-white font-black italic text-[10px] tracking-tighter uppercase px-3 py-1">
                    {product.stock} UNITS
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
        <CardHeader>
          <CardTitle className="font-display font-black italic uppercase tracking-tighter">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.slice(0, 10).map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="font-bold text-sm text-white uppercase tracking-tight italic">
                      {activity.action}
                    </p>
                    {activity.type === 'order' && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">
                        DIRECT_DEPLOYMENT_LOGGED
                      </p>
                    )}
                    {activity.type === 'booking' && (
                      <p className="text-[10px] font-black uppercase tracking-widest text-apex-orange/70">
                        SERVICE_BLUEPRINT_SYNCED
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">
                    {formatTimeAgo(activity.createdAt)}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-[10px] font-black tracking-widest text-neutral-600 uppercase">No recent activity detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProductsTab({ searchQuery }: { searchQuery: string }) {
  const { products, updateProduct, deleteProduct, addProduct } = useStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStockChange = (id: string, newStock: number) => {
    const stockStatus = newStock > 10 ? "In Stock" : newStock > 0 ? "Low Stock" : "Backorder"
    updateProduct(id, { stock: newStock, stockStatus })
    toast.success("Stock updated successfully")
  }

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
    setDeleteConfirm(null)
    toast.success("Product deleted")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">Inventory <span className="text-apex-orange">Management</span></h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">{products.length} ACTIVE SKU UNITS</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setIsAddingProduct(true)} className="gap-2 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-6 h-12 rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)]">
            <Plus className="w-4 h-4" />
            DEPLOY NEW PRODUCT
          </Button>
        </motion.div>
      </div>

      {/* Products Table */}
      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">PRODUCT UNIT</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">SPECS</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">VALUATION</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">STOCKLEVEL</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">STATUS</th>
                <th className="text-right p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.02 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 bg-white/5 rounded-xl overflow-hidden border border-white/10">
                          <Image src={product.image} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                          <p className="font-display font-black text-xs italic uppercase tracking-tight">{product.name}</p>
                          <p className="text-[10px] text-neutral-500 font-black tracking-widest uppercase">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-[10px] font-black tracking-widest text-neutral-400 uppercase">{product.category}</td>
                    <td className="p-6 text-sm font-black italic tracking-tighter text-white uppercase">${(product.price || 0).toFixed(2)}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Input
                          type="number"
                          value={product.stock}
                          onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                          className="w-20 h-10 bg-white/5 border-white/10 rounded-xl text-center font-black italic text-xs text-white"
                          min={0}
                        />
                        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-apex-orange" : "bg-red-500"}`}
                            style={{ width: `${Math.min(100, product.stock * 5)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge className={`font-black italic text-[9px] tracking-widest uppercase px-3 py-1 rounded-full ${
                        product.stockStatus === "In Stock" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" :
                        product.stockStatus === "Low Stock" ? "bg-apex-orange/10 text-apex-orange border border-apex-orange/20 shadow-[0_0_10px_rgba(255,77,0,0.1)]" :
                        "bg-red-500/10 text-red-500 border border-red-500/20"
                      }`}>
                        {product.stockStatus}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link href="/#products">
                          <motion.div
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                            title="View on Store"
                          >
                             <Search className="w-4 h-4 text-apex-orange" />
                          </motion.div>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setEditingProduct(product)}
                          className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                          title="Edit Inventory"
                        >
                           <Pencil className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.1)" }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setDeleteConfirm(product.id)}
                          className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-red-500/30 group"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4 text-red-500/70 group-hover:text-red-500 transition-colors" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Product Dialog */}
      <ProductDialog
        product={editingProduct}
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={async (product) => {
          await updateProduct(product.id, product)
          setEditingProduct(null)
          toast.success("Product updated successfully")
        }}
      />

      {/* Add Product Dialog */}
      <ProductDialog
        open={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
        onSave={async (product) => {
          await addProduct({ ...product, id: `product-${Date.now()}` })
          setIsAddingProduct(false)
          toast.success("Product added successfully")
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black italic uppercase tracking-tighter">Delete Product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400 font-medium">
            This action cannot be undone. Are you sure you want to delete this unit from the tactical database?
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteProduct(deleteConfirm!)} className="bg-red-500 hover:bg-red-600 text-white font-black italic uppercase tracking-tighter rounded-xl">
              CONFIRM_DELETE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function ProductDialog({ 
  product, 
  open, 
  onClose, 
  onSave 
}: { 
  product?: Product | null
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({})

  // Sync form data with product prop
  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        brand: "KTM",
        category: "Brakes",
        price: 0,
        description: "",
        stock: 0,
        stockStatus: "In Stock",
        image: "/parts/product-brakes.png",
        specs: {}
      })
    }
  }, [product, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    onSave(formData as Product)
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display font-black italic uppercase tracking-tighter text-2xl">
            {product ? "RECONFIGURE" : "INITIALIZE"} <span className="text-apex-orange">UNIT</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">PRODUCT IDENTIFIER</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ENTER PRODUCT NAME"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">MANUFACTURER</label>
              <Select
                value={formData.brand}
                onValueChange={(value) => setFormData({ ...formData, brand: value as Product["brand"] })}
              >
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl font-bold text-xs uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="KTM">KTM</SelectItem>
                  <SelectItem value="Honda">Honda</SelectItem>
                  <SelectItem value="Yamaha">Yamaha</SelectItem>
                  <SelectItem value="Bajaj">Bajaj</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">SECTOR</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as Product["category"] })}
              >
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl font-bold text-xs uppercase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                  <SelectItem value="Brakes">Brakes</SelectItem>
                  <SelectItem value="Engine">Engine</SelectItem>
                  <SelectItem value="Drive">Drive</SelectItem>
                  <SelectItem value="Tyres">Tyres</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">VALUATION ($)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min={0}
                step={0.01}
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">STOCK ALLOCATION</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => {
                  const stock = parseInt(e.target.value) || 0
                  const stockStatus = stock > 10 ? "In Stock" : stock > 0 ? "Low Stock" : "Backorder"
                  setFormData({ ...formData, stock, stockStatus })
                }}
                min={0}
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">SYSTEM DESCRIPTION</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ENTER TECHNICAL SPECIFICATIONS..."
              className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-apex-orange/50 font-bold text-xs uppercase resize-none"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-8 h-12 rounded-2xl min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                   PROCESSING...
                </div>
              ) : (
                product ? "CONFIRM UPDATE" : "DEPLOY UNIT"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ShopsTab({ searchQuery }: { searchQuery: string }) {
  const { shops, updateShop, deleteShop, addShop } = useStore()
  const [editingShop, setEditingShop] = useState<Shop | null>(null)
  const [isAddingShop, setIsAddingShop] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filteredShops = shops.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDeleteShop = (id: string) => {
    deleteShop(id)
    setDeleteConfirm(null)
    toast.success("Shop deleted")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">Authorized <span className="text-apex-orange">Dealers</span></h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">{shops.length} DEPLOYED HUB LOCATIONS</p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button onClick={() => setIsAddingShop(true)} className="gap-2 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-6 h-12 rounded-2xl shadow-[0_0_20px_rgba(255,77,0,0.3)]">
            <Plus className="w-4 h-4" />
            REGISTER NEW HUB
          </Button>
        </motion.div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredShops.map((shop, index) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="bg-white/5 border-white/10 overflow-hidden hover:shadow-[0_0_30px_rgba(255,77,0,0.1)] transition-all group rounded-3xl">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-black text-lg italic uppercase tracking-tight group-hover:text-apex-orange transition-colors">{shop.name}</h3>
                      <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">{shop.city}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingShop(shop)}
                        className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-white/20 group"
                        title="Edit Hub"
                      >
                         <Pencil className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(239,68,68,0.1)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeleteConfirm(shop.id)}
                        className="p-3 bg-white/5 rounded-xl transition-all border border-white/5 hover:border-red-500/30 group"
                        title="Delete Hub"
                      >
                        <Trash2 className="w-4 h-4 text-red-500/70 group-hover:text-red-500 transition-colors" />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-4 text-[10px] font-black tracking-widest uppercase text-neutral-400">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-apex-orange" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-apex-orange" />
                      <span>{shop.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {shop.services.map((service) => (
                      <Badge key={service} className="bg-white/5 border border-white/10 text-neutral-300 text-[8px] font-black tracking-widest uppercase px-3 py-1">
                        {service}
                      </Badge>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 text-[9px] font-black tracking-widest uppercase text-neutral-600">
                    COORD_DATA: {(shop.lat || 0).toFixed(4)}, {(shop.lng || 0).toFixed(4)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Shop Dialog */}
      <ShopDialog
        shop={editingShop}
        open={!!editingShop}
        onClose={() => setEditingShop(null)}
        onSave={async (shop) => {
          await updateShop(shop.id, shop)
          setEditingShop(null)
          toast.success("Shop updated successfully")
        }}
      />

      {/* Add Shop Dialog */}
      <ShopDialog
        open={isAddingShop}
        onClose={() => setIsAddingShop(false)}
        onSave={async (shop) => {
          await addShop({ ...shop, id: `shop-${Date.now()}` })
          setIsAddingShop(false)
          toast.success("Shop added successfully")
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display font-black italic uppercase tracking-tighter">Decommission Hub?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400 font-medium">
            This action cannot be undone. Are you sure you want to remove this strategic hub from the global network?
          </p>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteShop(deleteConfirm!)} className="bg-red-500 hover:bg-red-600 text-white font-black italic uppercase tracking-tighter rounded-xl">
              CONFIRM_DELETE
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function ShopDialog({ 
  shop, 
  open, 
  onClose, 
  onSave 
}: { 
  shop?: Shop | null
  open: boolean
  onClose: () => void
  onSave: (shop: Shop) => void
}) {
  const [formData, setFormData] = useState<Partial<Shop>>({
    name: "",
    address: "",
    city: "",
    lat: 19.0760,
    lng: 72.8777,
    phone: "",
    hours: "9:00 AM - 6:00 PM",
    services: []
  })

  const [newService, setNewService] = useState("")

  // Reset form when shop changes
  useEffect(() => {
    if (shop) {
      setFormData(shop)
    } else {
      setFormData({
        name: "",
        address: "",
        city: "",
        lat: 19.0760,
        lng: 72.8777,
        phone: "",
        hours: "9:00 AM - 6:00 PM",
        services: []
      })
    }
  }, [shop, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Shop)
  }

  const addService = () => {
    if (newService.trim()) {
      setFormData({
        ...formData,
        services: [...(formData.services || []), newService.trim()]
      })
      setNewService("")
    }
  }

  const removeService = (service: string) => {
    setFormData({
      ...formData,
      services: formData.services?.filter(s => s !== service)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/10 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display font-black italic uppercase tracking-tighter text-2xl">
            {shop ? "RECONFIGURE" : "ESTABLISH"} <span className="text-apex-orange">HUB</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">HUB NAME</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ENTER HUB NAME"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">CITY</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="CITY"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">COMMS/PHONE</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 XX XXXX XXXX"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">LOCATION ADDRESS</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="FULL PHYSICAL ADDRESS"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">LAT_DATA</label>
              <Input
                type="number"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || 0 })}
                step="0.0001"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">LNG_DATA</label>
              <Input
                type="number"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) || 0 })}
                step="0.0001"
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">OPERATING WINDOW</label>
            <Input
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="9:00 AM - 6:00 PM"
              className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">SERVICE CAPABILITIES</label>
            <div className="flex gap-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="ADD CAPABILITY"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addService()
                  }
                }}
                className="h-12 bg-white/5 border-white/10 rounded-2xl focus:border-apex-orange/50 font-bold text-xs uppercase"
              />
              <Button type="button" onClick={addService} variant="outline" className="h-12 w-12 bg-white/5 border-white/10 rounded-2xl hover:bg-white/10">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.services?.map((service) => (
                <Badge key={service} className="bg-apex-orange/10 text-apex-orange border border-apex-orange/20 text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full gap-2">
                  {service}
                  <button
                    type="button"
                    onClick={() => removeService(service)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="text-neutral-400 hover:text-white">
              ABORT
            </Button>
            <Button type="submit" className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-8 h-12 rounded-2xl">
              {shop ? "CONFIRM UPDATE" : "ESTABLISH HUB"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ── RESIDENTS TAB ─────────────────────────────────────────────
function ResidentsTab({ searchQuery }: { searchQuery: string }) {
  const residents = [
    { id: "r1", name: "Alex Vlasov", tier: "Elite", points: 12450, status: "Active", lastSeen: "2m ago", bio: "KTM RC390 Specialist" },
    { id: "r2", name: "Sarah Chen", tier: "Pro", points: 8900, status: "Active", lastSeen: "15m ago", bio: "Enduro Performance Expert" },
    { id: "r3", name: "Marcus Thorne", tier: "Master", points: 15200, status: "Active", lastSeen: "1h ago", bio: "Apex Moto Founder" },
    { id: "r4", name: "Elena Rossi", tier: "Rookie", points: 2100, status: "Offline", lastSeen: "3d ago", bio: "Track Day Enthusiast" },
    { id: "r5", name: "Jack Miller", tier: "Elite", points: 11200, status: "Suspended", lastSeen: "1w ago", bio: "High Octane Tester" },
  ]

  const filteredResidents = residents.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.tier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">Resident <span className="text-apex-orange">Dashboard</span></h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">{residents.length} AUTHORIZED OPERATORS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResidents.map((resident, index) => (
          <motion.div
            key={resident.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/5 border-white/10 overflow-hidden hover:shadow-[0_0_30px_rgba(255,77,0,0.1)] transition-all group rounded-3xl">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-apex-orange/10 border border-apex-orange/20 rounded-2xl flex items-center justify-center">
                      <Users className="w-7 h-7 text-apex-orange" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg italic uppercase tracking-tight text-white group-hover:text-apex-orange transition-colors">{resident.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${
                          resident.tier === "Elite" ? "bg-amber-500/20 text-amber-500 border-amber-500/20" :
                          resident.tier === "Master" ? "bg-purple-500/20 text-purple-500 border-purple-500/20" :
                          "bg-blue-500/20 text-blue-500 border-blue-500/20"
                        }`}>
                          {resident.tier} TIER
                        </Badge>
                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{resident.points} PTS</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={`text-[8px] font-black tracking-widest uppercase px-3 py-1 rounded-full border-white/10 ${
                      resident.status === "Active" ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5" :
                      resident.status === "Suspended" ? "text-red-500 border-red-500/20 bg-red-500/5" :
                      "text-neutral-500"
                    }`}>
                      {resident.status}
                    </Badge>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 font-bold leading-relaxed border-l-2 border-apex-orange/30 pl-4 italic">
                  "{resident.bio}"
                </p>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="text-[9px] font-black tracking-widest uppercase text-neutral-600">
                    LAST_SYNC: {resident.lastSeen}
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 px-4 text-[9px] font-black tracking-widest uppercase text-neutral-400 hover:text-white hover:bg-white/5">
                    VIEW DATA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Status configuration for orders
const orderStatusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-500", icon: Clock, bgColor: "bg-yellow-500/10" },
  confirmed: { label: "Confirmed", color: "text-blue-500", icon: CheckCircle2, bgColor: "bg-blue-500/10" },
  processing: { label: "Processing", color: "text-purple-500", icon: Box, bgColor: "bg-purple-500/10" },
  shipped: { label: "Shipped", color: "text-cyan-500", icon: Truck, bgColor: "bg-cyan-500/10" },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-500", icon: Truck, bgColor: "bg-orange-500/10" },
  delivered: { label: "Delivered", color: "text-green-500", icon: CheckCircle2, bgColor: "bg-green-500/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", icon: X, bgColor: "bg-red-500/10" },
}

function OrdersTab({ searchQuery }: { searchQuery: string }) {
  const { orders, updateOrderStatus } = useStore()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("")
  const [trackingNumber, setTrackingNumber] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async () => {
    if (selectedOrder && newStatus) {
      await updateOrderStatus(selectedOrder.id, newStatus, trackingNumber || undefined)
      toast.success(`Order ${selectedOrder.orderNumber} updated to ${orderStatusConfig[newStatus].label}`)
      setSelectedOrder(null)
      setNewStatus("")
      setTrackingNumber("")
    }
  }

  const copyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber)
    toast.success("Order number copied!")
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending" || o.status === "confirmed").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped" || o.status === "out_for_delivery").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Orders", value: orderStats.total, icon: Package, color: "text-white" },
          { label: "Pending", value: orderStats.pending, icon: Clock, color: "text-yellow-500" },
          { label: "Processing", value: orderStats.processing, icon: Box, color: "text-purple-500" },
          { label: "Shipped", value: orderStats.shipped, icon: Truck, color: "text-cyan-500" },
          { label: "Delivered", value: orderStats.delivered, icon: CheckCircle2, color: "text-green-500" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <p className="text-2xl font-display font-black italic">{stat.value}</p>
                  <p className="text-[9px] font-black tracking-widest text-neutral-500 uppercase">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter">Order <span className="text-apex-orange">Management</span></h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">{filteredOrders.length} ORDERS FOUND</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
            <SelectTrigger className="w-40 h-11 bg-white/5 border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10">
              <SelectItem value="all" className="text-[10px] font-black tracking-widest uppercase">All Status</SelectItem>
              {Object.entries(orderStatusConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-[10px] font-black tracking-widest uppercase">
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">ORDER</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">CUSTOMER</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">ITEMS</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">TOTAL</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">STATUS</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">DATE</th>
                <th className="text-right p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredOrders.map((order, index) => {
                  const statusConfig = orderStatusConfig[order.status]
                  const StatusIcon = statusConfig.icon
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.02 }}
                      className="group hover:bg-white/5 transition-colors"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => copyOrderNumber(order.orderNumber)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Copy className="w-3 h-3 text-neutral-500" />
                          </button>
                          <div>
                            <p className="font-display font-black text-xs italic uppercase tracking-tight text-apex-orange">{order.orderNumber}</p>
                            {order.trackingNumber && (
                              <p className="text-[9px] font-mono text-neutral-500">{order.trackingNumber}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <p className="font-bold text-sm text-white">{order.customerName}</p>
                          <p className="text-[10px] text-neutral-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="p-6 text-sm text-neutral-300">
                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                      </td>
                      <td className="p-6">
                        <p className="font-display font-black text-sm italic text-white">${(order.total || 0).toFixed(2)}</p>
                      </td>
                      <td className="p-6">
                        <Badge className={`font-black italic text-[9px] tracking-widest uppercase px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color} border-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </td>
                      <td className="p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-end gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setSelectedOrder(order)
                              setNewStatus(order.status)
                              setTrackingNumber(order.trackingNumber || "")
                            }}
                            className="p-3 bg-apex-orange/10 rounded-xl transition-all border border-apex-orange/20 hover:bg-apex-orange/20"
                            title="Update Status"
                          >
                            <Edit2 className="w-4 h-4 text-apex-orange" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => window.open(`/orders?order=${order.orderNumber}`, '_blank')}
                            className="p-3 bg-white/5 rounded-xl transition-all border border-white/10 hover:bg-white/10"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4 text-neutral-400" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display font-black text-xl italic uppercase tracking-tighter">
              Update Order <span className="text-apex-orange">{selectedOrder?.orderNumber}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Current Status */}
            {selectedOrder && (
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-2">CURRENT STATUS</p>
                <Badge className={`${orderStatusConfig[selectedOrder.status].bgColor} ${orderStatusConfig[selectedOrder.status].color} border-0 text-xs font-black uppercase`}>
                  {orderStatusConfig[selectedOrder.status].label}
                </Badge>
              </div>
            )}

            {/* New Status */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">NEW STATUS</label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10">
                  {Object.entries(orderStatusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className={`w-4 h-4 ${config.color}`} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tracking Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">TRACKING NUMBER (Optional)</label>
              <Input
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
                className="h-12 bg-white/5 border-white/10 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setSelectedOrder(null)}
              className="flex-1 h-12 bg-white/5 border-white/10 hover:bg-white/10 rounded-xl font-black italic uppercase tracking-tighter"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={!newStatus}
              className="flex-1 h-12 bg-apex-orange hover:bg-apex-orange/90 rounded-xl font-black italic uppercase tracking-tighter shadow-[0_0_20px_rgba(255,77,0,0.3)]"
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

function BookingsTab({ searchQuery }: { searchQuery: string }) {
  const { bookings } = useStore()
  
  const filteredBookings = (bookings || []).filter(b => 
    b.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-black italic uppercase tracking-tighter text-white">
            SERVICE <span className="text-apex-orange">APPOINTMENTS</span>
          </h2>
          <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase mt-1">
            {filteredBookings.length} ACTIVE RESERVATIONS
          </p>
        </div>
      </div>

      <Card className="bg-white/5 border-white/10 overflow-hidden rounded-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">ID</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">HUB</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">SERVICE</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">APPOINTMENT_DATE</th>
                <th className="text-left p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">STATUS</th>
                <th className="text-right p-6 text-[10px] font-black tracking-widest text-neutral-500 uppercase">CREATED_AT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="group hover:bg-white/5 transition-colors"
                  >
                    <td className="p-6">
                      <p className="font-display font-black text-xs italic uppercase tracking-tight text-apex-orange">{booking.id}</p>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-sm text-white uppercase">{booking.shopName}</p>
                    </td>
                    <td className="p-6">
                      <Badge className="bg-white/5 text-neutral-300 border-white/10 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {booking.service}
                      </Badge>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-apex-orange" />
                        <p className="text-xs font-black text-white uppercase italic">
                          {new Date(booking.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <Badge className={`font-black italic text-[9px] tracking-widest uppercase px-3 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 
                        booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-neutral-500/10 text-neutral-500'
                      } border-0`}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="p-6 text-right text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredBookings.length === 0 && (
            <div className="p-20 text-center">
              <Clock className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
              <p className="text-[10px] font-black tracking-[0.2em] text-neutral-500 uppercase">NO APPOINTMENTS RECORDED</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

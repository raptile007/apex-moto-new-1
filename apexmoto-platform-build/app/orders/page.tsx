"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone,
  Copy,
  ExternalLink,
  ChevronRight,
  Box,
  Search,
  AlertCircle
} from "lucide-react"
import type { Order, OrderStatus } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType; bgColor: string }> = {
  pending: { label: "Pending", color: "text-yellow-500", icon: Clock, bgColor: "bg-yellow-500/10" },
  confirmed: { label: "Confirmed", color: "text-blue-500", icon: CheckCircle2, bgColor: "bg-blue-500/10" },
  processing: { label: "Processing", color: "text-purple-500", icon: Box, bgColor: "bg-purple-500/10" },
  shipped: { label: "Shipped", color: "text-cyan-500", icon: Truck, bgColor: "bg-cyan-500/10" },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-500", icon: Truck, bgColor: "bg-orange-500/10" },
  delivered: { label: "Delivered", color: "text-green-500", icon: CheckCircle2, bgColor: "bg-green-500/10" },
  cancelled: { label: "Cancelled", color: "text-red-500", icon: AlertCircle, bgColor: "bg-red-500/10" },
}

function OrderTimeline({ order }: { order: Order }) {
  const allStatuses: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"]
  const currentIndex = allStatuses.indexOf(order.status)
  
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-5 left-5 right-5 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (allStatuses.length - 1)) * 100}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-apex-orange to-orange-400"
        />
      </div>
      
      {/* Status Points */}
      <div className="flex justify-between relative z-10">
        {allStatuses.map((status, index) => {
          const config = statusConfig[status]
          const Icon = config.icon
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex
          
          return (
            <div key={status} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isActive 
                    ? isCurrent 
                      ? "bg-apex-orange border-apex-orange shadow-[0_0_20px_rgba(255,77,0,0.5)]" 
                      : "bg-apex-orange/20 border-apex-orange"
                    : "bg-white/5 border-white/20"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-600"}`} />
              </motion.div>
              <span className={`mt-3 text-[10px] font-black uppercase tracking-wider ${
                isActive ? "text-white" : "text-neutral-600"
              }`}>
                {config.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({ order, isExpanded, onToggle }: { order: Order; isExpanded: boolean; onToggle: () => void }) {
  const config = statusConfig[order.status]
  const StatusIcon = config.icon
  
  const copyTrackingNumber = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all"
    >
      {/* Order Header */}
      <button 
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-6">
          <div className={`w-14 h-14 rounded-2xl ${config.bgColor} flex items-center justify-center`}>
            <StatusIcon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-display font-black text-lg italic uppercase tracking-tight text-white">
                {order.orderNumber}
              </h3>
              <Badge className={`${config.bgColor} ${config.color} border-0 text-[10px] font-black uppercase`}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-neutral-500">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} - ${order.total.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-neutral-500">Estimated Delivery</p>
            <p className="text-sm font-bold text-white">
              {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : 'TBD'}
            </p>
          </div>
          <ChevronRight className={`w-5 h-5 text-neutral-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-8 border-t border-white/5">
              {/* Order Timeline */}
              <div className="pt-6">
                <h4 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-6">ORDER_TRACKING</h4>
                <OrderTimeline order={order} />
              </div>

              {/* Tracking Number */}
              {order.trackingNumber && (
                <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-1">TRACKING_NUMBER</p>
                    <p className="font-mono text-white">{order.trackingNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyTrackingNumber}
                      className="h-9 px-3 rounded-xl border-white/20 bg-transparent hover:bg-white/10 text-white"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      className="h-9 px-3 rounded-xl bg-apex-orange hover:bg-apex-orange/90 text-white"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Track
                    </Button>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h4 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-4">ORDER_ITEMS</h4>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-white/5 rounded-xl">
                      <div className="relative w-16 h-16 bg-neutral-900 rounded-xl overflow-hidden">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-sm text-white truncate">{item.name}</h5>
                        <p className="text-xs text-neutral-500">{item.brand} - Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-white">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="bg-white/5 rounded-2xl p-4">
                  <h4 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-3 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> SHIPPING_ADDRESS
                  </h4>
                  <div className="text-sm text-neutral-300 space-y-1">
                    <p className="font-bold text-white">{order.customerName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="flex items-center gap-2 mt-2 text-neutral-500">
                      <Phone className="w-3 h-3" /> {order.customerPhone}
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white/5 rounded-2xl p-4">
                  <h4 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-3">ORDER_SUMMARY</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Shipping</span>
                      <span>{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Tax (18% GST)</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-apex-orange">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline History */}
              <div>
                <h4 className="text-[10px] font-black tracking-widest text-neutral-500 uppercase mb-4">ACTIVITY_LOG</h4>
                <div className="space-y-3">
                  {order.timeline.slice().reverse().map((event, index) => {
                    const eventConfig = statusConfig[event.status]
                    const EventIcon = eventConfig.icon
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-lg ${eventConfig.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <EventIcon className={`w-4 h-4 ${eventConfig.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{event.description}</p>
                          <p className="text-xs text-neutral-500">
                            {new Date(event.timestamp).toLocaleString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {event.location && ` - ${event.location}`}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const highlightedOrder = searchParams.get('order')
  const { orders } = useStore()
  const [expandedOrder, setExpandedOrder] = useState<string | null>(highlightedOrder)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (highlightedOrder) {
      setExpandedOrder(highlightedOrder)
    }
  }, [highlightedOrder])

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      
      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge className="bg-apex-orange/10 text-apex-orange border-apex-orange/20 font-black italic tracking-widest uppercase px-4 py-1 mb-6">
              ORDER MANAGEMENT
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-display font-black italic tracking-tighter mb-4 uppercase">
              Track Your <span className="text-apex-orange text-glow">Orders</span>
            </h1>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              Monitor your tactical deployments in real-time. Every package, every step of the way.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by order number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-apex-orange/50 focus:ring-2 focus:ring-apex-orange/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Orders List */}
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OrderCard
                    order={order}
                    isExpanded={expandedOrder === order.orderNumber}
                    onToggle={() => setExpandedOrder(
                      expandedOrder === order.orderNumber ? null : order.orderNumber
                    )}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-neutral-600" />
              </div>
              <h3 className="font-display font-black text-2xl italic uppercase tracking-tight mb-3">
                No Orders Found
              </h3>
              <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
                {searchQuery 
                  ? "No orders match your search criteria. Try a different search term."
                  : "You haven't placed any orders yet. Start shopping to see your orders here."
                }
              </p>
              <Link href="/#products">
                <Button className="bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter px-8 h-12 rounded-2xl">
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

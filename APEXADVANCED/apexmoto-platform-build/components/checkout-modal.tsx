"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, MapPin, CreditCard, ShieldCheck, Zap, Truck, CheckCircle2, Smartphone, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import { type PaymentMethod, type Order } from "@/lib/data"
import { useRouter } from "next/navigation"

type Step = "address" | "payment" | "confirm"

export function CheckoutModal() {
  const router = useRouter()
  const { 
    cart, 
    cartTotal, 
    clearCart, 
    addOrder, 
    isCheckoutModalOpen, 
    setIsCheckoutModalOpen 
  } = useStore()
  
  const [step, setStep] = useState<Step>("address")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("gpay")
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "Guest Rider",
    email: "rider@apexmoto.com",
    phone: "+91 98765 43210",
    street: "123 Sector 4, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001"
  })

  const shipping = cartTotal > 500 ? 0 : 49.99
  const tax = cartTotal * 0.18
  const grandTotal = cartTotal + shipping + tax

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    // Simulate tactical processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const orderNumber = `APX-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: "guest-user",
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: cart,
      subtotal: cartTotal,
      shipping,
      tax,
      total: grandTotal,
      status: "confirmed",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "paid",
      timeline: [
        { status: "pending", timestamp: new Date(Date.now() - 60000).toISOString(), description: "Mission Parameters Accepted" },
        { status: "confirmed", timestamp: new Date().toISOString(), description: paymentMethod === "cod" ? "Payment on Deployment Verified" : "Tactical Transaction Authorized" },
      ],
      shippingAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: "India"
      },
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    addOrder(newOrder)
    setIsProcessing(false)
    setIsCheckoutModalOpen(false)
    clearCart()
    
    toast.success("MISSION_DEPLOYED", {
      description: `Order #${orderNumber} is now in transit.`
    })
    
    router.push(`/orders?order=${orderNumber}`)
  }

  if (!isCheckoutModalOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isProcessing && setIsCheckoutModalOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="h-16 md:h-20 bg-[#050505] border-b border-white/5 flex items-center justify-between px-6 md:px-10 shrink-0">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 md:w-10 md:h-10 bg-apex-orange rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-white" />
               </div>
               <div>
                  <h2 className="font-display font-black text-lg md:text-xl italic uppercase tracking-tight text-white">AUTHORIZATION</h2>
                  <p className="text-[9px] md:text-[10px] text-neutral-500 font-black uppercase tracking-widest">STEP {step === "address" ? "01" : step === "payment" ? "02" : "03"} / DEPLOYMENT</p>
               </div>
            </div>
            {!isProcessing && (
              <button onClick={() => setIsCheckoutModalOpen(false)} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
             {/* Left: Progress & Summary */}
             <div className="w-full md:w-1/3 bg-black/40 border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-8 flex flex-col justify-between shrink-0">
                <div className="space-y-4 md:space-y-6">
                   {[
                     { id: "address", label: "Drop_Zone", icon: MapPin },
                     { id: "payment", label: "Payment_Link", icon: CreditCard },
                     { id: "confirm", label: "Authorization", icon: ShieldCheck },
                   ].map((s, i) => (
                     <div key={s.id} className={`flex items-center gap-4 transition-opacity ${step === s.id ? "opacity-100" : "opacity-30"}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${step === s.id ? "bg-apex-orange border-apex-orange" : "border-white/10"}`}>
                           <s.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] font-black text-white uppercase tracking-widest hidden md:block">{s.label}</span>
                     </div>
                   ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5 hidden md:block">
                   <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      <span>Cargo_Val</span>
                      <span className="text-white">₹{cartTotal.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      <span>Logistics</span>
                      <span className="text-white">₹{shipping.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      <span>Taxes</span>
                      <span className="text-white">₹{tax.toLocaleString('en-IN')}</span>
                   </div>
                   <div className="flex justify-between text-xs font-black text-apex-orange uppercase tracking-widest pt-2 border-t border-white/5">
                      <span>Total_Credits</span>
                      <span className="text-lg italic font-display">₹{grandTotal.toLocaleString('en-IN')}</span>
                   </div>
                </div>
             </div>

             {/* Right: Content */}
             <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {step === "address" && (
                    <motion.div
                      key="address"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-apex-orange" />
                          DEPLOYMENT_COORDINATES
                       </h3>
                       <div className="grid grid-cols-1 gap-4">
                          <Input 
                            placeholder="OPERATOR_NAME" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="h-12 bg-white/5 border-white/10 rounded-xl text-xs font-black tracking-widest uppercase" 
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input 
                              placeholder="CONTACT_COMM" 
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl text-xs font-black tracking-widest uppercase" 
                            />
                            <Input 
                              placeholder="EMAIL_HASH" 
                              value={formData.email}
                              onChange={(e) => setFormData({...formData, email: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl text-xs font-black tracking-widest uppercase" 
                            />
                          </div>
                          <Input 
                            placeholder="STREET_VECTOR" 
                            value={formData.street}
                            onChange={(e) => setFormData({...formData, street: e.target.value})}
                            className="h-12 bg-white/5 border-white/10 rounded-xl text-xs font-black tracking-widest uppercase" 
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input 
                              placeholder="CITY_ZONE" 
                              value={formData.city}
                              onChange={(e) => setFormData({...formData, city: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl text-xs font-black tracking-widest uppercase" 
                            />
                            <Input 
                              placeholder="POSTAL_INDEX" 
                              value={formData.pincode}
                              onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                              className="h-12 bg-white/5 border-white/10 rounded-xl text-xs font-black tracking-widest uppercase" 
                            />
                          </div>
                       </div>
                       <Button 
                        onClick={() => setStep("payment")}
                        className="w-full h-14 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter mt-8 rounded-2xl"
                       >
                         PROCEED_TO_PAYMENT <ChevronRight className="w-4 h-4 ml-2" />
                       </Button>
                    </motion.div>
                  )}

                  {step === "payment" && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-apex-orange" />
                          TRANSACTION_PROTOCOL
                       </h3>
                       
                       <div className="grid grid-cols-1 gap-4">
                          <button 
                            onClick={() => setPaymentMethod("gpay")}
                            className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === "gpay" ? "bg-apex-orange/10 border-apex-orange" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                   <Smartphone className="w-6 h-6 text-black" />
                                </div>
                                <div className="text-left">
                                   <p className="text-xs font-black text-white uppercase tracking-widest">GOOGLE_PAY</p>
                                   <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mt-1">Instant_Verification_Required</p>
                                </div>
                             </div>
                             {paymentMethod === "gpay" && <CheckCircle2 className="w-5 h-5 text-apex-orange" />}
                          </button>

                          <button 
                            onClick={() => setPaymentMethod("cod")}
                            className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === "cod" ? "bg-apex-orange/10 border-apex-orange" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                   <DollarSign className="w-6 h-6 text-emerald-500" />
                                </div>
                                <div className="text-left">
                                   <p className="text-xs font-black text-white uppercase tracking-widest">CASH_ON_DEPLOYMENT</p>
                                   <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mt-1">Payment_Upon_Unit_Reception</p>
                                </div>
                             </div>
                             {paymentMethod === "cod" && <CheckCircle2 className="w-5 h-5 text-apex-orange" />}
                          </button>

                          <button 
                            onClick={() => setPaymentMethod("card")}
                            className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${paymentMethod === "card" ? "bg-apex-orange/10 border-apex-orange" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                   <CreditCard className="w-6 h-6 text-blue-500" />
                                </div>
                                <div className="text-left">
                                   <p className="text-xs font-black text-white uppercase tracking-widest">TACTICAL_CREDIT</p>
                                   <p className="text-[8px] text-neutral-500 font-black uppercase tracking-widest mt-1">Encrypted_Card_Authorization</p>
                                </div>
                             </div>
                             {paymentMethod === "card" && <CheckCircle2 className="w-5 h-5 text-apex-orange" />}
                          </button>
                       </div>

                       <div className="flex gap-4 pt-4">
                          <Button 
                            variant="outline"
                            onClick={() => setStep("address")}
                            className="flex-1 h-14 border-white/10 text-white font-black italic uppercase tracking-tighter rounded-2xl"
                          >
                            <ChevronLeft className="w-4 h-4 mr-2" /> REVISE_DROP
                          </Button>
                          <Button 
                            onClick={() => setStep("confirm")}
                            className="flex-[2] h-14 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter rounded-2xl"
                          >
                            VERIFY_PARAMETERS <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                       </div>
                    </motion.div>
                  )}

                  {step === "confirm" && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                       <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-apex-orange" />
                          FINAL_AUTHORIZATION
                       </h3>
                       
                       <div className="bg-white/5 rounded-2xl p-6 space-y-4 border border-white/5">
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-[0.3em] mb-1">Target_Coordinates</p>
                                <p className="text-[10px] font-black text-white uppercase leading-relaxed max-w-[200px]">
                                   {formData.name} <br />
                                   {formData.street}, {formData.city}, {formData.pincode}
                                </p>
                             </div>
                             <div className="text-right">
                                <p className="text-[8px] text-neutral-500 font-black uppercase tracking-[0.3em] mb-1">Payment_Mode</p>
                                <p className="text-[10px] font-black text-apex-orange uppercase italic">{paymentMethod === "gpay" ? "GOOGLE_PAY" : paymentMethod === "cod" ? "CASH_ON_DEPLOYMENT" : "TACTICAL_CREDIT"}</p>
                             </div>
                          </div>
                       </div>

                       <div className="bg-apex-orange/5 rounded-2xl p-6 border border-apex-orange/20 space-y-3">
                          <div className="flex items-center gap-3">
                             <Zap className="w-4 h-4 text-apex-orange" />
                             <p className="text-[10px] font-black text-white uppercase tracking-widest">Expected Deployment: <span className="text-apex-orange italic">4-5 DAYS</span></p>
                          </div>
                          <div className="flex items-center gap-3">
                             <Truck className="w-4 h-4 text-apex-orange" />
                             <p className="text-[10px] font-black text-white uppercase tracking-widest">Shipping: <span className="text-apex-orange italic">{shipping === 0 ? "FREE_CARGO" : `₹${shipping}`}</span></p>
                          </div>
                       </div>

                       <div className="flex gap-4 pt-4">
                          <Button 
                            variant="outline"
                            onClick={() => setStep("payment")}
                            disabled={isProcessing}
                            className="flex-1 h-14 border-white/10 text-white font-black italic uppercase tracking-tighter rounded-2xl"
                          >
                             REVISE_PAYMENT
                          </Button>
                          <Button 
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className="flex-[2] h-14 bg-apex-orange hover:bg-apex-orange/90 text-white font-black italic uppercase tracking-tighter rounded-2xl shadow-[0_0_30px_rgba(255,77,0,0.3)] relative overflow-hidden"
                          >
                            <AnimatePresence>
                               {isProcessing ? (
                                 <motion.div 
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: 1 }}
                                   className="flex items-center gap-3"
                                 >
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    AUTHORIZING...
                                 </motion.div>
                               ) : (
                                 "CONFIRM_DEPLOYMENT"
                               )}
                            </AnimatePresence>
                          </Button>
                       </div>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { Phone, MessageCircle, X } from "lucide-react"

// Types
export type Product = {
    id: string
    title: string
    description: string
    price: number
    original_price?: number
    unit?: string
    currency_code: string
    video_url: string
    story: string
}

// --- Components ---

// 1. WhatsApp Lead Modal
export function WhatsAppModal({
    product,
    isOpen,
    onClose,
    onSubmit
}: {
    product: Product | null,
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (data: any) => void
}) {
    const [name, setName] = useState("")
    const [mobile, setMobile] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await onSubmit({
                name,
                mobile,
                product: product?.title,
                interest_type: "Pre-book Hybrid 2"
            })
            setSent(true)
            setTimeout(() => {
                setSent(false)
                setLoading(false)
                onClose()
                setName("")
                setMobile("")
            }, 2000)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black pointer-events-auto"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-6 pointer-events-auto shadow-2xl z-50 mb-0 sm:mb-8"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
                            <X size={24} />
                        </button>

                        {!sent ? (
                            <>
                                <h2 className="text-2xl font-bold font-serif text-gray-900 mb-2">Pre-book {product?.title}</h2>
                                <p className="text-gray-600 mb-6 text-sm">Deliciously fresh. We will create a fresh batch just for you.</p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="e.g. Nagarjuna"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                            placeholder="e.g. 9876543210"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                                    >
                                        {loading ? "Sending..." : (
                                            <>
                                                <MessageCircle size={20} />
                                                Send Interest via WhatsApp
                                            </>
                                        )}
                                    </button>
                                    <p className="text-xs text-center text-gray-400 mt-4">We will message you to confirm details & delivery.</p>
                                </form>
                            </>
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                                    <MessageCircle size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Interest Received!</h3>
                                <p className="text-gray-600">We will message you shortly on WhatsApp.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

// 2. Cinematic Product Section (Refactored)
export function StickyProductSection({ product, onInterest }: { product: Product, onInterest: (p: Product) => void }) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Simplified opacity/scale for smooth entry/exit, but no heavy scroll interaction
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const scale = useTransform(scrollYProgress, [0, 1], [0.98, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

    return (
        <motion.div
            ref={containerRef}
            className="relative h-screen w-full bg-black text-white overflow-hidden flex items-end"
            style={{ opacity, scale }}
        >
            {/* Background Video Layer */}
            <div className="absolute inset-0 z-0">
                {product.video_url ? (
                    <video
                        src={product.video_url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                ) : (
                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <span className="text-zinc-600">No Video Available</span>
                    </div>
                )}
                {/* Cinematic Gradient: Clear top, dark bottom for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </div>

            {/* Content Layer - Positioned at Bottom */}
            <div className="relative z-10 w-full p-6 pb-12 sm:p-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">

                {/* Left: Branding & Story */}
                <div className="max-w-lg space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-3 py-1 bg-amber-500/90 backdrop-blur-sm text-black text-[10px] font-bold uppercase tracking-widest rounded-full mb-3 shadow-lg">
                            Taste of Andhra
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-serif font-medium leading-tight drop-shadow-lg">
                            {product.title}
                        </h2>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-sm sm:text-base text-gray-200 font-light leading-relaxed drop-shadow-md border-l-2 border-amber-500 pl-4"
                    >
                        "{product.story}"
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-2"
                    >
                        <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-light text-white drop-shadow-md">
                                ₹{product.price} <span className="text-base opacity-70">{product.unit || "/ pack"}</span>
                            </p>
                            {product.original_price && (
                                <p className="text-lg text-white/50 line-through decoration-white/30">
                                    ₹{product.original_price}
                                </p>
                            )}
                            {product.original_price && (
                                <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-medium rounded uppercase tracking-wide">
                                    {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                                </span>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right: Premium CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="w-full sm:w-auto"
                >
                    <button
                        onClick={() => onInterest(product)}
                        className="group relative w-full sm:w-auto overflow-hidden rounded-full bg-white/10 px-8 py-4 backdrop-blur-md border border-white/20 transition-all hover:bg-amber-500 hover:border-amber-500 hover:shadow-[0_0_40px_-10px_rgba(245,158,11,0.5)] active:scale-95"
                    >
                        <div className="flex items-center justify-center gap-3">
                            <div className="p-1 rounded-full bg-green-500 group-hover:bg-white transition-colors">
                                <MessageCircle size={18} className="text-white group-hover:text-green-600 transition-colors" fill="currentColor" />
                            </div>
                            <span className="font-bold tracking-wide text-white group-hover:text-black transition-colors">
                                Book via WhatsApp
                            </span>
                        </div>
                    </button>
                    <p className="text-[10px] text-center text-white/50 mt-2 uppercase tracking-wider">
                        Pre-order for Morning Batch
                    </p>
                </motion.div>

            </div>
        </motion.div>
    )
}

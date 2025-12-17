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

// 2. Sticky Product Section
export function StickyProductSection({ product, onInterest }: { product: Product, onInterest: (p: Product) => void }) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Parallax / Scroll Logic
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    const videoScale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])

    return (
        <div ref={containerRef} className="relative h-[150vh] w-full bg-black text-white">
            {/* Sticky Background Video */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <motion.div
                    style={{ scale: videoScale, opacity }}
                    className="absolute inset-0 w-full h-full"
                >
                    {product.video_url ? (
                        <video
                            src={product.video_url}
                            className="w-full h-full object-cover brightness-[0.7]"
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
                </motion.div>

                {/* Floating Gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Content Layer (positioned at bottom for mobile) */}
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 flex flex-col items-start gap-4 z-10 pb-24 sm:pb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-3 py-1 bg-amber-500 text-black text-xs font-bold uppercase tracking-widest rounded-full mb-3">
                            Taste of Andhra
                        </span>
                        <h2 className="text-4xl sm:text-6xl font-serif font-medium mb-2">{product.title}</h2>
                        <p className="text-xl sm:text-2xl text-gray-200 font-light mb-4">
                            ₹{product.price / 100} <span className="text-sm opacity-60 ml-2">/ pack</span>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Scrolling Text Overlay (The Story) */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center">
                {/* This spacer pushes the text content to appear 'during' the scroll interactions if needed, 
              but for 'Living Editorial', we often want the text to scroll OVER the stuck video.
          */}

                {/* We actually want distinct 'cards' that scroll over. */}
                <div className="w-full max-w-lg mx-auto mt-[40vh] px-6 space-y-[40vh]">
                    <motion.div
                        className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-center pointer-events-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ margin: "-20% 0px -20% 0px" }}
                    >
                        <p className="font-serif text-lg leading-relaxed text-gray-100 italic">
                            "{product.story}"
                        </p>
                    </motion.div>

                    <motion.div
                        className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center pointer-events-auto"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                    >
                        <h3 className="text-xl font-bold mb-2">Freshly Prepared</h3>
                        <p className="text-sm opacity-80 mb-6">Pre-book now to receive from the morning batch.</p>
                        <button
                            onClick={() => onInterest(product)}
                            className="w-full bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-amber-400 transition-colors shadow-lg active:scale-95"
                        >
                            Book via WhatsApp
                        </button>
                    </motion.div>
                </div>
            </div>

        </div>
    )
}

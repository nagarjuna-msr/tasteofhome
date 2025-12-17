
"use client"

import { useState } from "react"
import { StickyProductSection, WhatsAppModal, Product } from "@components/v0/LivingEditorial"

export default function LivingEditorialHome({ products, countryCode }: { products: Product[], countryCode: string }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null)

    const handleInterest = (product: Product) => {
        setSelectedProduct(product)
        setModalOpen(true)
    }

    const handleSubmit = async (data: any) => {
        // Call our API route
        await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
    }

    return (
        <main className="bg-black min-h-screen">
            {/* Hero / Intro could go here */}
            <div className="h-screen flex items-center justify-center bg-zinc-900 text-white text-center p-4">
                <div>
                    <h1 className="text-5xl md:text-8xl font-serif mb-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">TasteOfHome</h1>
                    <p className="text-xl text-gray-400 max-w-md mx-auto">Experience the authentic flavors of Andhra, crafted with tradition.</p>
                    <div className="mt-8 animate-bounce text-sm text-gray-500">Scroll to Explore ↓</div>
                </div>
            </div>

            {/* Sticky Sections */}
            {products.map(product => (
                <StickyProductSection key={product.id} product={product} onInterest={handleInterest} />
            ))}

            {/* Global Modal */}
            <WhatsAppModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                product={selectedProduct}
                onSubmit={handleSubmit}
            />
        </main>
    )
}

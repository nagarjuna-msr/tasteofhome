
import { Metadata } from "next"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products" // Assuming this exists or I need to find the right fetcher
import LivingEditorialHome from "@modules/home/components/living-editorial-home" // I'll create this as a client component wrapper

export const metadata: Metadata = {
  title: "TasteOfHome - The Living Editorial",
  description: "Experience the tradition of Andhra sweets.",
}

export const revalidate = 0 // Force dynamic rendering

import { V0_PRODUCTS } from "@lib/v0-data"

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const countryCode = params.countryCode

  // Use static V0 data directly
  const uiProducts = V0_PRODUCTS.map((p) => ({
    ...p,
    price: p.price // Component handles the /100 division
  }))

  return (
    <div>
      {/* Debug Marker for Verification */}
      <h1 className="sr-only">DEBUG: I AM HERE</h1>

      <LivingEditorialHome products={uiProducts} countryCode={countryCode} />

      {/* 
        This is a hidden debug block to verify data fetching in server logs 
        <div className="hidden">
            Checking Products: {uiProducts.length} found.
        </div>
      */}
    </div>
  )
}

import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"



export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  // V0 STANDALONE MODE: Backend calls commented out
  const customer = null // await retrieveCustomer()
  const cart = null // await retrieveCart()
  let shippingOptions: StoreCartShippingOption[] = []

  // if (cart) {
  //   const { shipping_options } = await listCartOptions()
  //   shippingOptions = shipping_options
  // }

  return (
    <>
      <div className="sticky top-0 inset-x-0 z-50 group bg-white border-b border-ui-border-base">
        <header className="relative h-16 mx-auto duration-200">
          <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-center w-full h-full text-small-regular">
            <a href="/" className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase text-2xl tracking-widest font-serif">TasteOfHome</a>
          </nav>
        </header>
      </div>
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {/* Free Shipping Nudge Removed */}
      {props.children}
      <footer className="border-t border-ui-border-base w-full">
        <div className="content-container flex flex-col w-full">
          <div className="py-10 flex w-full mb-16 justify-between items-center text-ui-fg-muted">
            <a href="/" className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase">TasteOfHome</a>
            <span className="txt-compact-small">© {new Date().getFullYear()} TasteOfHome. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  )
}

import { NextRequest, NextResponse } from "next/server"

// V0 Standalone: Simplified middleware without Medusa backend dependency
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in" // Default to India for TasteOfHome

// Static region map for V0 standalone deployment
const SUPPORTED_COUNTRIES = new Set(["in", "us", "gb", "ae"]) // India, US, UK, UAE

/**
 * Get country code from URL or use default
 */
function getCountryCode(request: NextRequest): string {
  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  
  if (urlCountryCode && SUPPORTED_COUNTRIES.has(urlCountryCode)) {
    return urlCountryCode
  }
  
  return DEFAULT_REGION
}

/**
 * V0 Standalone Middleware - Simplified region handling without Medusa backend
 */
export async function middleware(request: NextRequest) {
  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  
  // Check if URL already has a valid country code
  const urlHasCountryCode = urlCountryCode && SUPPORTED_COUNTRIES.has(urlCountryCode)

  // If URL has valid country code, proceed normally
  if (urlHasCountryCode) {
    return NextResponse.next()
  }

  // Skip static assets
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  // If no country code in URL, redirect to default region
  const countryCode = getCountryCode(request)
  const redirectPath = request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  const queryString = request.nextUrl.search || ""
  
  const redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}


import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, mobile, product, interest_type } = body;

        console.log("📝 Lead Received:", { name, mobile, product });

        // 1. Validation
        if (!name || !mobile) {
            return NextResponse.json({ error: "Name and Mobile are required" }, { status: 400 });
        }

        // NEW WEBHOOK LOGIC
        const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

        if (SCRIPT_URL) {
            try {
                // Add absolute timeout to prevent hanging
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 4000); 

                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, mobile, product, interest_type }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                console.log("✅ Lead sent to Google Script Webhook. Status:", response.status);
            } catch (webhookError) {
                console.error("❌ Webhook Error (Timeout/Network):", webhookError);
                // Continue to return success to UI
            }
        } else {
             console.warn("⚠️ Google Script URL missing.");
        }

        return NextResponse.json({ success: true, message: "Interest received!" });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

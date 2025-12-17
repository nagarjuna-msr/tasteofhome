
const BASE_URL = "http://localhost:9000";
const EMAIL = "admin@tasteofhome.food";
const PASSWORD = "tasteofhome123";

async function main() {
    console.log("Authenticating...");
    const authRes = await fetch(`${BASE_URL}/admin/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });

    if (!authRes.ok) {
        throw new Error(`Auth failed: ${authRes.statusText}`);
    }

    // Medusa uses cookie-based auth for admin usually, but let's check if we get a token or need to use the cookie.
    // For Admin API, the cookie connect.sid is key.
    const cookie = authRes.headers.get("set-cookie");

    console.log("Authenticated. Fetching regions...");

    const regionsRes = await fetch(`${BASE_URL}/admin/regions`, {
        headers: { Cookie: cookie },
    });
    const regionsData = await regionsRes.json();
    const regionId = regionsData.regions[0].id;
    const currencyCode = regionsData.regions[0].currency_code;

    console.log(`Using Region: ${regionId} (${currencyCode})`);

    const products = [
        {
            title: "Putharekulu",
            description: "Traditional Andhra paper-sweet made with rice batter and ghee.",
            options: [{ title: "Weight" }],
            variants: [
                { title: "500g", prices: [{ amount: 50000, currency_code: currencyCode }], options: [{ value: "500g" }], inventory_quantity: 10 },
                { title: "1kg", prices: [{ amount: 95000, currency_code: currencyCode }], options: [{ value: "1kg" }], inventory_quantity: 5 },
            ],
        },
        {
            title: "Buffalo Ghee",
            description: "Pure, aromatic buffalo ghee sourced from Andhra villages.",
            options: [{ title: "Volume" }],
            variants: [
                { title: "250ml", prices: [{ amount: 45000, currency_code: currencyCode }], options: [{ value: "250ml" }], inventory_quantity: 20 },
                { title: "500ml", prices: [{ amount: 85000, currency_code: currencyCode }], options: [{ value: "500ml" }], inventory_quantity: 10 },
            ],
        },
        {
            title: "Palakova",
            description: "Rich milk sweet. Pre-order only for fresh batches.",
            options: [{ title: "Weight" }],
            variants: [
                {
                    title: "500g",
                    prices: [{ amount: 48000, currency_code: currencyCode }],
                    options: [{ value: "500g" }],
                    inventory_quantity: 0, // Out of stock to force pre-order logic if configured, or just allowed backorders
                    allow_backorder: true,
                    manage_inventory: true
                }
            ],
        },
        {
            title: "Pakam Kaja",
            description: "Juicy Kakinada Kaja.",
            options: [{ title: "Count" }],
            variants: [
                { title: "Box of 10", prices: [{ amount: 35000, currency_code: currencyCode }], options: [{ value: "10 pcs" }], inventory_quantity: 15 },
            ],
        },
    ];

    for (const product of products) {
        console.log(`Creating ${product.title}...`);
        const createRes = await fetch(`${BASE_URL}/admin/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie
            },
            body: JSON.stringify(product),
        });

        if (createRes.ok) {
            console.log(`✓ Created ${product.title}`);
        } else {
            const err = await createRes.json();
            console.error(`✗ Failed to create ${product.title}:`, JSON.stringify(err));
        }
    }
}

main().catch(console.error);


import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils";
import { createProductsWorkflow, createRegionsWorkflow, deleteProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function seedTasteOfHome({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);

    const productModuleService = container.resolve(Modules.PRODUCT);

    logger.info("Seeding TasteOfHome products...");

    // 0. Cleanup existing seeded products
    const existingProducts = await productModuleService.listProducts({
        handle: ["putharekulu", "buffalo-ghee", "palakova", "pakam-kaja"],
    });

    if (existingProducts.length) {
        logger.info(`Deleting ${existingProducts.length} existing products...`);
        await deleteProductsWorkflow(container).run({
            input: { ids: existingProducts.map((p) => p.id) },
        });
    }

    // 1. Get Default Sales Channel
    const [salesChannel] = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });

    if (!salesChannel) {
        logger.error("Default Sales Channel not found. Please run the main seed script first.");
        return;
    }

    // 2. Get Default Shipping Profile
    const [shippingProfile] = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });

    if (!shippingProfile) {
        logger.error("Default Shipping Profile not found.");
        return;
    }

    // 2.5 Ensure India Region exists
    const regionModuleService = container.resolve(Modules.REGION);
    const [existingIndia] = await regionModuleService.listRegions({ currency_code: "inr" });

    if (!existingIndia) {
        const { result: regionResult } = await createRegionsWorkflow(container).run({
            input: {
                regions: [
                    {
                        name: "India",
                        currency_code: "inr",
                        countries: ["in"],
                        payment_providers: ["pp_system_default"],
                    },
                ],
            },
        });
        logger.info(`Created India region: ${regionResult[0].id}`);
    } else {
        logger.info(`India region already exists: ${existingIndia.id}`);
    }

    // 3. Create Products
    const productsData = [
        {
            title: "Putharekulu",
            description: "Traditional Andhra paper-sweet made with rice batter and ghee.",
            handle: "putharekulu",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Weight", values: ["500g", "1kg"] }],
            metadata: {
                video_url: "https://videos.pexels.com/video-files/4057348/4057348-hd_1080_1920_24fps.mp4", // Abstract rice paper making / cooking
                story: "Crafted in the villages of Atreyapuram, thin layers of rice batter are cooked in earthen pots and folded with pure ghee and jaggery.",
            },
            variants: [
                {
                    title: "500g",
                    sku: "PUTHA-500",
                    options: { Weight: "500g" },
                    prices: [{ amount: 50000, currency_code: "inr" }],
                    manage_inventory: false,
                },
                {
                    title: "1kg",
                    sku: "PUTHA-1KG",
                    options: { Weight: "1kg" },
                    prices: [{ amount: 95000, currency_code: "inr" }],
                    manage_inventory: false,
                },
            ],
            sales_channels: [{ id: salesChannel.id }],
        },
        {
            title: "Buffalo Ghee",
            description: "Pure, aromatic buffalo ghee sourced from Andhra villages.",
            handle: "buffalo-ghee",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Volume", values: ["250ml", "500ml"] }],
            metadata: {
                video_url: "/videos/ghee_video.mp4", // Pouring liquid/oil
                story: "Made from the milk of free-grazing buffaloes. Our ghee is slow-churned using the traditional Bilona method for that nostalgic aroma.",
            },
            variants: [
                {
                    title: "250ml",
                    sku: "GHEE-250",
                    options: { Volume: "250ml" },
                    prices: [{ amount: 45000, currency_code: "inr" }],
                    manage_inventory: false,
                },
                {
                    title: "500ml",
                    sku: "GHEE-500",
                    options: { Volume: "500ml" },
                    prices: [{ amount: 85000, currency_code: "inr" }],
                    manage_inventory: false,
                },
            ],
            sales_channels: [{ id: salesChannel.id }],
        },
        {
            title: "Palakova",
            description: "Rich milk sweet. Pre-order only for fresh batches.",
            handle: "palakova",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Weight", values: ["500g"] }],
            metadata: {
                video_url: "https://videos.pexels.com/video-files/5645063/5645063-hd_1080_1920_30fps.mp4", // Mixing milk/dough
                story: "Pure milk and sugar, simmered for hours until it turns into a golden, fudgy delight. No preservatives, just patience.",
            },
            variants: [
                {
                    title: "500g",
                    sku: "PALAKOVA-500",
                    options: { Weight: "500g" },
                    prices: [{ amount: 48000, currency_code: "inr" }],
                    manage_inventory: false,
                    allow_backorder: true,
                },
            ],
            sales_channels: [{ id: salesChannel.id }],
        },
        {
            title: "Pakam Kaja",
            description: "Juicy Kakinada Kaja.",
            handle: "pakam-kaja",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Count", values: ["Box of 10"] }],
            metadata: {
                video_url: "https://videos.pexels.com/video-files/4253139/4253139-hd_1080_1920_30fps.mp4", // Deep frying/desert
                story: "Crispy on the outside, juicy on the inside. These Kajas are soaked in syrup to perfection, bringing the taste of Kakinada to you.",
            },
            variants: [
                {
                    title: "Box of 10",
                    sku: "KAJA-10",
                    options: { Count: "Box of 10" },
                    prices: [{ amount: 35000, currency_code: "inr" }],
                    manage_inventory: false,
                },
            ],
            sales_channels: [{ id: salesChannel.id }],
        },
    ];

    await createProductsWorkflow(container).run({
        input: { products: productsData },
    });

    logger.info("✓ TasteOfHome products created successfully.");
}

import { priceBrackets } from "@shared/schema";
import axios from "axios";
import { eq } from "drizzle-orm";
import { getAndroidPublisher } from "server/config/googlePlay";
import { db } from "server/db";


type CreateInAppProductInput = {
    sku: string;
    title: string;
    description: string;
    price: number;
    currency?: string;
};

export class CreateInAppProductJob {
    private sku: string;
    private title: string;
    private description: string;
    private price: number;
    private currency: string;

    constructor({
        sku,
        title,
        description,
        price,
        currency = "INR",
    }: CreateInAppProductInput) {
        this.sku = sku.toLowerCase().replace(/-/g, "_");
        this.title = title;
        this.description = description;
        this.price = price;
        this.currency = currency;
    }


    async handle() {
        const packageName = process.env.ANDROID_PACKAGE_NAME!;
        const androidPublisher = getAndroidPublisher();

        try {
            // 🔒 Ensure Monetization API is available
            if (!(androidPublisher as any).monetization?.onetimeproducts) {
                throw new Error("Monetization one-time products API not available");
            }

            const priceMicros = Math.round(this.price * 1_000_000).toString();


            // const regionsVersion = await getRegionsVersion(
            //     androidPublisher,
            //     packageName,
            //     this.sku
            // );


            const money = toMoney(this.price, this.currency);

            const auth = androidPublisher.applications.context._options.auth;

            // const {
            //     regionsVersion,
            //     regionalPricingConfigs,
            // } = await convertRegionPricesRaw(
            //     auth,
            //     packageName,
            //     this.price,
            //     this.currency
            // );

            const {
                regionsVersion,
                regionalPricingConfigs,
            } = await convertRegionPrices(
                androidPublisher,
                packageName,
                this.price,
                this.currency
            );



            // await androidPublisher.applications

            console.info("Preparing one-time product", {
                productId: this.sku,
                price: this.price,
                currency: this.currency,
                packageName,
                regionsVersion
            });

            await androidPublisher.monetization.onetimeproducts.batchUpdate({
                packageName,
                requestBody: {
                    requests: [
                        {
                            // ✅ MUST include regionsVersion
                            updateMask: "listings,purchaseOptions,regionsVersion",
                            allowMissing: true,

                            // ✅ MUST be here (request level)
                            regionsVersion,

                            oneTimeProduct: {
                                packageName,
                                productId: this.sku,

                                listings: [
                                    {
                                        languageCode: "en-GB",
                                        title: this.title,
                                        description: this.description,
                                    },
                                ],

                                // taxAndComplianceSettings: {
                                //     regionalProductAgeRatingInfos: [
                                //         { regionCode: "US", ageRating: "PRODUCT_AGE_RATING_TIER_EIGHTEEN_AND_ABOVE" },
                                //     ],
                                // },

                                purchaseOptions: [
                                    {
                                        purchaseOptionId: "onetime", // ✅ FIXED
                                        // state: "ACTIVE",
                                        buyOption: {
                                            legacyCompatible: true,
                                            multiQuantityEnabled: false,
                                        },

                                        regionalPricingAndAvailabilityConfigs:
                                            regionalPricingConfigs,
                                    },
                                ],

                            },
                        },
                    ],
                },
            });

            console.info("✅ One-time product created", { sku: this.sku });
            // Activate purchase option
            // 🔹 update DB

            // Activate purchase option
            await androidPublisher.monetization.onetimeproducts.purchaseOptions.batchUpdateStates({
                packageName,
                productId: this.sku,
                requestBody: {
                    requests: [
                        {
                            activatePurchaseOptionRequest: {
                                packageName,
                                productId: this.sku,
                                purchaseOptionId: "onetime",
                            },
                        },
                    ],
                },
            });


            // console.log("priceBrackets", priceBrackets)

            await db
                .update(priceBrackets)
                .set({
                    androidStatus: "active",
                    androidLastSyncAt: new Date(),
                    androidSyncError: null,
                })
                .where(eq(priceBrackets.productId, this.sku));
        } catch (err: any) {
            console.error("🔥 Google Play error", err?.message || err);

            await db
                .update(priceBrackets)
                .set({
                    androidStatus: "error",
                    androidSyncError: err?.message || "Unknown error",
                })
                .where(eq(priceBrackets.productId, this.sku));

            throw err;
        }
    }
}


async function convertRegionPricesRaw(
    auth: any,
    packageName: string,
    price: number,
    currency: string
): Promise<{
    regionsVersion: { version: string };
    regionalPricingConfigs: any[];
}> {
    // 1️⃣ Get access token from GoogleAuth
    const client = await auth.getClient();
    const accessTokenResponse = await client.getAccessToken();

    if (!accessTokenResponse?.token) {
        throw new Error("Failed to obtain Google access token");
    }

    // 2️⃣ Convert price to Money
    const units = Math.floor(price);
    const nanos = Math.round((price - units) * 1_000_000_000);

    // 3️⃣ Call REST API directly
    const url = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/pricing:convertRegionPrices`;

    const response = await axios.post(
        url,
        {
            price: {
                currencyCode: currency,
                units: units.toString(),
                nanos,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${accessTokenResponse.token}`,
                "Content-Type": "application/json",
            },
        }
    );

    const data = response.data;

    if (!data?.regionsVersion) {
        throw new Error("regionsVersion missing from convertRegionPrices response");
    }

    // 4️⃣ Build regional pricing configs (Monetization API format)
    const regionalPricingConfigs = (data.convertedRegionPrices ?? []).map(
        (p: any) => ({
            regionCode: p.regionCode,
            price: p.price,
            availability: "AVAILABLE",
        })
    );

    return {
        regionsVersion: data.regionsVersion,
        regionalPricingConfigs,
    };
}


async function convertRegionPrices(
    androidPublisher: any,
    packageName: string,
    price: number,
    currency: string
) {
    const units = Math.floor(price);
    const nanos = Math.round((price - units) * 1_000_000_000);

    const res = await androidPublisher.monetization.convertRegionPrices({
        packageName,
        requestBody: {
            price: {
                currencyCode: currency,
                units: units.toString(),
                nanos,
            },
        },
    });

    const data = res.data;

    // ✅ FIX 1: correct field name
    if (!data.regionVersion) {
        throw new Error("regionVersion missing from pricing conversion");
    }

    // ✅ FIX 2: object → array
    const regionalPricingConfigs = Object.values(
        data.convertedRegionPrices || {}
    )
        .filter((p: any) => {
            // Google already filtered valid ones,
            // but be extra safe
            return p.price?.units !== undefined;
        })
        .map((p: any) => ({
            regionCode: p.regionCode,
            price: p.price,
            availability: "AVAILABLE",
        }));

    return {
        regionsVersion: data.regionVersion, // ✅ mapped correctly
        regionalPricingConfigs,
    };
}


function toMoney(price: number, currency: string) {
    const units = Math.floor(price);
    const nanos = Math.round((price - units) * 1_000_000_000);

    return {
        currencyCode: currency,
        units: units.toString(),
        nanos,
    };
}



async function getRegionsVersion(
    androidPublisher: any,
    packageName: string,
    productId: string
): Promise<{ version: string }> {
    try {
        // Try reading existing product
        const res = await androidPublisher.monetization.onetimeproducts.get({
            packageName,
            productId,
        });

        if (!res.data.regionsVersion?.version) {
            throw new Error("regionsVersion missing in GET response");
        }

        return res.data.regionsVersion;
    } catch (err: any) {
        if (err.code === 404) {
            // 🔑 THIS IS THE KEY
            // Ask Google what versions are supported by doing a LIST
            const listRes =
                await androidPublisher.monetization.onetimeproducts.list({
                    packageName,
                    pageSize: 1,
                });

            const version =
                listRes.data.oneTimeProducts?.[0]?.regionsVersion?.version;

            if (!version) {
                throw new Error(
                    "Unable to determine regionsVersion from Play Console"
                );
            }

            return { version };
        }
        throw err;
    }
}


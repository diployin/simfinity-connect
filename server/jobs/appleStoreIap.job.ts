import fs from "fs";
import path from "path";
import { generateAppleJWT } from "../config/appleJwt";
import { appleApi } from "server/utils/appleApi";

export class AppleStoreIapJob {
    constructor(
        private sku: string,
        private title: string,
        private description: string,
        private price: number,
        private currency = "USD",
        private country = "USA"
    ) {
        this.sku = this.sku.toLowerCase().replace(/-/g, "_");
    }

    async handle() {
        const appId = process.env.IOS_APP_ID!;
        const bundleId = process.env.IOS_BUNDLE_ID!;
        const keyId = process.env.IOS_KEY_ID!;
        const issuerId = process.env.IOS_ISSUER_ID!;

        const jwt = generateAppleJWT({ keyId, issuerId, bundleId });
        const api = appleApi(jwt);

        const existing = await this.checkExistingIAP(api, appId);

        if (existing) {
            await this.updateIAP(api, appId, existing.id);
        } else {
            await this.createIAP(api, appId);
        }
    }

    // 1️⃣ Check existing
    private async checkExistingIAP(api: any, appId: string) {
        const res = await api.get(`/v2/apps/${appId}/inAppPurchasesV2`, {
            params: { "filter[productId]": this.sku },
        });

        return res.data.data?.[0] || null;
    }

    // 2️⃣ Create IAP
    private async createIAP(api: any, appId: string) {
        console.log("Creating IAP", this.sku);
        const res = await api.post("/v2/inAppPurchases", {
            data: {
                type: "inAppPurchases",
                attributes: {
                    productId: this.sku,
                    name: this.title,
                    inAppPurchaseType: "CONSUMABLE",
                    reviewNote: this.reviewNote(),
                },
                relationships: {
                    app: { data: { type: "apps", id: appId } },
                },
            },
        });

        const iapId = res.data.data.id;

        await this.setTerritories(api, iapId);
        const price = await this.setPricing(api, iapId);
        await this.upsertLocalization(api, iapId, price);
        await this.uploadScreenshot(api, iapId);

        return iapId;
    }

    // 3️⃣ Update IAP
    private async updateIAP(api: any, appId: string, iapId: string) {
        await api.patch(`/v2/inAppPurchases/${iapId}`, {
            data: {
                id: iapId,
                type: "inAppPurchases",
                attributes: {
                    name: this.title,
                    reviewNote: this.reviewNote(),
                },
            },
        });

        const price = await this.setPricing(api, iapId);
        await this.upsertLocalization(api, iapId, price);
        await this.setTerritories(api, iapId);
        await this.uploadScreenshot(api, iapId);
    }

    // 4️⃣ Pricing
    private async setPricing(api: any, iapId: string) {
        const pp = await api.get(
            `/v2/inAppPurchases/${iapId}/pricePoints`,
            { params: { "filter[territory]": this.country, limit: 800 } }
        );

        const pricePoint = this.findBestPricePoint(pp.data.data);
        if (!pricePoint) throw new Error("No price point found");

        const tempId = `tmp-${Date.now()}`;

        await api.post("/v2/inAppPurchasePriceSchedules", {
            data: {
                type: "inAppPurchasePriceSchedules",
                relationships: {
                    inAppPurchase: { data: { type: "inAppPurchases", id: iapId } },
                    baseTerritory: { data: { type: "territories", id: this.country } },
                    manualPrices: { data: [{ type: "inAppPurchasePrices", id: tempId }] },
                },
            },
            included: [
                {
                    type: "inAppPurchasePrices",
                    id: tempId,
                    attributes: { startDate: new Date().toISOString().slice(0, 10) },
                    relationships: {
                        inAppPurchasePricePoint: {
                            data: { type: "inAppPurchasePricePoints", id: pricePoint.id },
                        },
                        territory: {
                            data: { type: "territories", id: this.country },
                        },
                    },
                },
            ],
        });

        return pricePoint.attributes.customerPrice;
    }

    // 5️⃣ Localization
    private async upsertLocalization(api: any, iapId: string, price: string) {
        const res = await api.get(
            `/v2/inAppPurchases/${iapId}/inAppPurchaseLocalizations`
        );

        const existing = res.data.data?.[0];

        const payload = {
            data: {
                type: "inAppPurchaseLocalizations",
                attributes: {
                    name: `eSIM Pack (${this.currency} ${price})`,
                    description: `Buy eSIM / Top-Up ${this.currency} ${price}`,
                    locale: "en-US",
                },
                relationships: {
                    inAppPurchaseV2: {
                        data: { type: "inAppPurchases", id: iapId },
                    },
                },
            },
        };

        if (existing) {
            await api.patch(
                `/v2/inAppPurchaseLocalizations/${existing.id}`,
                { data: { ...payload.data, id: existing.id } }
            );
        } else {
            await api.post("/v2/inAppPurchaseLocalizations", payload);
        }
    }

    // 6️⃣ Territories
    private async setTerritories(api: any, iapId: string) {
        const t = await api.get("/v2/territories", { params: { limit: 200 } });

        await api.post("/v2/inAppPurchaseAvailabilities", {
            data: {
                type: "inAppPurchaseAvailabilities",
                attributes: { availableInNewTerritories: true },
                relationships: {
                    inAppPurchase: {
                        data: { type: "inAppPurchases", id: iapId },
                    },
                    availableTerritories: {
                        data: t.data.data.map((x: any) => ({
                            type: "territories",
                            id: x.id,
                        })),
                    },
                },
            },
        });
    }

    // 7️⃣ Screenshot
    private async uploadScreenshot(api: any, iapId: string) {
        const img = path.join(
            process.cwd(),
            "storage/review_screenshots",
            `${this.sku}.png`
        );

        if (!fs.existsSync(img)) return;

        const stat = fs.statSync(img);

        const reserve = await api.post(
            "/v2/inAppPurchaseAppStoreReviewScreenshots",
            {
                data: {
                    type: "inAppPurchaseAppStoreReviewScreenshots",
                    attributes: {
                        fileName: path.basename(img),
                        fileSize: stat.size,
                    },
                    relationships: {
                        inAppPurchaseV2: {
                            data: { type: "inAppPurchases", id: iapId },
                        },
                    },
                },
            }
        );

        const op = reserve.data.data.attributes.uploadOperations[0];

        await fetch(op.url, {
            method: "PUT",
            headers: { "Content-Type": "image/png" },
            body: fs.readFileSync(img),
        });

        await api.patch(
            `/v2/inAppPurchaseAppStoreReviewScreenshots/${reserve.data.data.id}`,
            { data: { id: reserve.data.data.id, type: "inAppPurchaseAppStoreReviewScreenshots", attributes: { uploaded: true } } }
        );
    }

    private findBestPricePoint(points: any[]) {
        return points
            .filter(p => Number(p.attributes.customerPrice) >= this.price)
            .sort(
                (a, b) =>
                    Number(a.attributes.customerPrice) -
                    Number(b.attributes.customerPrice)
            )[0];
    }

    private reviewNote() {
        return `Consumable eSIM purchase.\n\nTest:\n1. Open app\n2. Select package\n3. Purchase\n4. eSIM delivered`;
    }
}

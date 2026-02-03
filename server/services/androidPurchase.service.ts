import { getAndroidPublisher } from "../config/googlePlay";

export const verifyAndroidPurchaseWithGoogle = async ({
    packageName,
    productId,
    purchaseToken,
}: {
    packageName: string;
    productId: string;
    purchaseToken: string;
}) => {
    const res = await getAndroidPublisher().purchases.products.get({
        packageName,
        productId,
        token: purchaseToken,
    });

    if (res.data.purchaseState !== 0) {
        throw new Error("Payment not completed");
    }

    return res.data;
};

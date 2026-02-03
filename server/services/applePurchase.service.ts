import axios from "axios";

const PROD_URL = process.env.APPLE_PROD_URL!;
const SANDBOX_URL = process.env.APPLE_SANDBOX_URL!;
const SHARED_SECRET = process.env.APPLE_SHARED_SECRET!;

export const verifyAppleReceipt = async (
    receiptBase64: string,
    useSandbox = false
) => {
    const url = useSandbox ? SANDBOX_URL : PROD_URL;

    const response = await axios.post(url, {
        "receipt-data": receiptBase64,
        password: SHARED_SECRET,
        "exclude-old-transactions": true,
    });

    return response.data;
};

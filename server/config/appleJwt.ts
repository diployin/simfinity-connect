import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

export const generateAppleJWT = ({
    keyId,
    issuerId,
    bundleId,
}: {
    keyId: string;
    issuerId: string;
    bundleId: string;
}) => {
    const privateKeyPath = path.join(
        process.cwd(),
        "storage/apple",
        `${keyId}.p8`
    );

    if (!fs.existsSync(privateKeyPath)) {
        throw new Error(`Apple private key not found: ${privateKeyPath}`);
    }

    const privateKey = fs.readFileSync(privateKeyPath, "utf8");

    const now = Math.floor(Date.now() / 1000);

    return jwt.sign(
        {
            iss: issuerId,
            iat: now,
            exp: now + 20 * 60,
            aud: "appstoreconnect-v1",
            bid: bundleId,
        },
        privateKey,
        {
            algorithm: "ES256",
            keyid: keyId,
        }
    );
};

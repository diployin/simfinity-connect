import { google } from "googleapis";

export const getAndroidPublisher = () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "server/config/esimconnect-21d20-4a033d4ebf46.json", // firebase.json
        scopes: ["https://www.googleapis.com/auth/androidpublisher"],
    });

    return google.androidpublisher({
        version: "v3",
        auth,
    });
};

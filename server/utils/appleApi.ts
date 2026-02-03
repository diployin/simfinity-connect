import axios from "axios";

export const appleApi = (jwt: string) =>
    axios.create({
        baseURL: "https://api.appstoreconnect.apple.com",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        },
    });

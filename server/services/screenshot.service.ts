import puppeteer from "puppeteer";
import ejs from "ejs";
import fs from "fs-extra";
import path from "path";

export interface Product {
    id: string;
    name: string;
    description: string;
    priceText: string;
}

const TEMPLATE = path.resolve("server/templates/product.ejs");
const OUTPUT = path.resolve("uploads/generate_screenshots");

let browser: puppeteer.Browser | null = null;

async function getBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
    }
    return browser;
}

export async function createImages(products: Product[]) {
    await fs.ensureDir(OUTPUT);

    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setViewport({
        width: 1242,
        height: 2688,
        deviceScaleFactor: 3
    });

    const results = [];

    // console.log("products", products)
    for (const item of products) {
        const html = await ejs.renderFile(TEMPLATE, {
            showIap: item.showIap,
            appName: item.appName,
            product: item.product
        });

        await page.setContent(html, { waitUntil: "networkidle0" });

        const phone = await page.$(".phone");
        if (!phone) throw new Error("Phone container missing");

        const file = `${OUTPUT}/${item.product.slug}.png`;
        await phone.screenshot({ path: file });

        results.push(`/uploads/generate_screenshots/${item.product.slug}.png`);
    }

    await page.close();
    return results;
}
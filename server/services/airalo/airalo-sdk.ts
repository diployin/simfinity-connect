import { Airalo } from "airalo-sdk";
import axios from "axios";

const AIRALO_BASE_URL = "https://partners-api.airalo.com/v2";

class AiraloSDKWrapper {
  private sdk: Airalo | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  private get clientId(): string {
    return process.env.AIRALO_API_KEY || "";
  }

  private get clientSecret(): string {
    return process.env.AIRALO_API_SECRET || "";
  }

  private async ensureInitialized(): Promise<Airalo> {
    if (this.initialized && this.sdk) {
      return this.sdk;
    }

    if (this.initPromise) {
      await this.initPromise;
      return this.sdk!;
    }

    this.initPromise = this.initialize();
    await this.initPromise;
    return this.sdk!;
  }

  private async initialize(): Promise<void> {
    try {
      this.sdk = new Airalo({
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });
      await this.sdk.initialize();
      this.initialized = true;
      console.log("[Airalo SDK] Initialized successfully");
    } catch (error: any) {
      console.error("[Airalo SDK] Initialization failed:", error.message);
      throw new Error("Failed to initialize Airalo SDK");
    }
  }

  async authenticate(): Promise<string> {
    return this.authenticateREST();
  }

  private async authenticateREST(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(`${AIRALO_BASE_URL}/token`, {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
      });

      this.accessToken = response.data.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.data.expires_in * 1000) - 60000;

      return this.accessToken!;
    } catch (error: any) {
      console.error("[Airalo REST] Authentication failed:", error.response?.data || error.message);
      throw new Error("Failed to authenticate with Airalo API");
    }
  }

  private async restRequest(method: string, endpoint: string, params?: any): Promise<any> {
    const token = await this.authenticateREST();

    try {
      const response = await axios({
        method,
        url: `${AIRALO_BASE_URL}${endpoint}`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: method === "GET" ? params : undefined,
        data: method !== "GET" ? params : undefined,
      });

      return response.data;
    } catch (error: any) {
      console.error(`[Airalo REST] API error (${method} ${endpoint}):`, error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Airalo API request failed");
    }
  }

  async getPackages(params?: {
    country?: string;
    type?: string;
    limit?: number;
    page?: number;
    include?: string;
    filter?: Record<string, any>;
    "filter[type]"?: string;
    "filter[country]"?: string;
  }): Promise<any> {
    const sdk = await this.ensureInitialized();

    try {
      if (params?.country) {
        return await sdk.getCountryPackages(params.country, false, params?.limit || null);
      }

      const response = await sdk.getAllPackages(false, params?.limit || null, params?.page || null);
      return response;
    } catch (error: any) {
      console.error("[Airalo SDK] getPackages failed:", error.message);
      throw error;
    }
  }

  async getAllPackagesFlat(): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getAllPackages(true);
    } catch (error: any) {
      console.error("[Airalo SDK] getAllPackagesFlat failed:", error.message);
      throw error;
    }
  }

  async getLocalPackages(flat: boolean = false): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getLocalPackages(flat);
    } catch (error: any) {
      console.error("[Airalo SDK] getLocalPackages failed:", error.message);
      throw error;
    }
  }

  async getGlobalPackages(flat: boolean = false): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getGlobalPackages(flat);
    } catch (error: any) {
      console.error("[Airalo SDK] getGlobalPackages failed:", error.message);
      throw error;
    }
  }

  async getCountryPackages(countryCode: string, flat: boolean = false): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getCountryPackages(countryCode, flat);
    } catch (error: any) {
      console.error("[Airalo SDK] getCountryPackages failed:", error.message);
      throw error;
    }
  }

  async getSimPackages(countryCode: string, flat: boolean = false): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getSimPackages(countryCode, flat);
    } catch (error: any) {
      console.error("[Airalo SDK] getSimPackages failed:", error.message);
      throw error;
    }
  }

  async getPackage(packageId: string): Promise<any> {
    return this.restRequest("GET", `/packages/${packageId}`);
  }

  async submitOrder(packageId: string, quantity: number = 1, description?: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.order(packageId, quantity, description || null);
    } catch (error: any) {
      console.error("[Airalo SDK] submitOrder failed:", error.message);
      throw error;
    }
  }

  async submitOrderAsync(packageId: string, quantity: number = 1, webhookUrl?: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.orderAsync(packageId, quantity, webhookUrl || null);
    } catch (error: any) {
      console.error("[Airalo SDK] submitOrderAsync failed:", error.message);
      throw error;
    }
  }

  async orderWithEmailSimShare(packageId: string, quantity: number, esimCloud: {
    to_email: string;
    sharing_option: ('link' | 'pdf')[];
    copy_address?: string[];
  }, description?: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.orderWithEmailSimShare(packageId, quantity, esimCloud, description || null);
    } catch (error: any) {
      console.error("[Airalo SDK] orderWithEmailSimShare failed:", error.message);
      throw error;
    }
  }

  async orderBulk(packages: Record<string, number>, description?: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.orderBulk(packages, description || null);
    } catch (error: any) {
      console.error("[Airalo SDK] orderBulk failed:", error.message);
      throw error;
    }
  }

  async orderAsyncBulk(packages: Record<string, number>, webhookUrl?: string, description?: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.orderAsyncBulk(packages, webhookUrl || null, description || null);
    } catch (error: any) {
      console.error("[Airalo SDK] orderAsyncBulk failed:", error.message);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<any> {
    return this.restRequest("GET", `/orders/${orderId}`);
  }

  async getOrdersList(params?: {
    include?: string;
    "filter[created_at]"?: string;
    "filter[code]"?: string;
    "filter[order_status]"?: string;
    "filter[iccid]"?: string;
    "filter[description]"?: string;
    limit?: number;
    page?: number;
  }): Promise<any> {
    return this.restRequest("GET", "/orders", params);
  }

  async submitTopup(iccid: string, packageId: string, description?: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.topup(packageId, iccid, description || null);
    } catch (error: any) {
      console.error("[Airalo SDK] submitTopup failed:", error.message);
      throw error;
    }
  }

  async getTopupPackages(iccid: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getSimTopups(iccid);
    } catch (error: any) {
      console.error("[Airalo SDK] getTopupPackages failed:", error.message);
      throw error;
    }
  }

  async getSimDetails(iccid: string): Promise<any> {
    return this.restRequest("GET", `/sims/${iccid}`);
  }

  async getSimInfo(iccid: string, language: string = "en"): Promise<any> {
    return this.restRequest("GET", `/sims/${iccid}`, { language });
  }

  async getUsage(iccid: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getSimUsage(iccid);
    } catch (error: any) {
      console.error("[Airalo SDK] getUsage failed:", error.message);
      throw error;
    }
  }

  async getUsageBulk(iccids: string[]): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.simUsageBulk(iccids);
    } catch (error: any) {
      console.error("[Airalo SDK] getUsageBulk failed:", error.message);
      throw error;
    }
  }

  async getSimPackageHistory(iccid: string): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getSimPackageHistory(iccid);
    } catch (error: any) {
      console.error("[Airalo SDK] getSimPackageHistory failed:", error.message);
      throw error;
    }
  }

  async getInstallationInstructions(iccid: string, params?: {
    language?: string;
    device?: string;
    model?: string;
  }): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getSimInstructions(iccid, params?.language || "en");
    } catch (error: any) {
      console.error("[Airalo SDK] getInstallationInstructions failed:", error.message);
      throw error;
    }
  }

  async getCountries(): Promise<any> {
    return this.restRequest("GET", "/countries");
  }

  async getRegions(): Promise<any> {
    return this.restRequest("GET", "/regions");
  }

  async getDevices(): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getCompatibleDevices();
    } catch (error: any) {
      console.error("[Airalo SDK] getDevices failed:", error.message);
      throw error;
    }
  }

  async submitFutureOrder(
    packageId: string,
    quantity: number,
    dueDate: string,
    webhookUrl?: string,
    description?: string,
    brandSettingsName?: string,
    toEmail?: string,
    sharingOption?: ('link' | 'pdf')[],
    copyAddress?: string[]
  ): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.createFutureOrder(
        packageId,
        quantity,
        dueDate,
        webhookUrl || null,
        description || null,
        brandSettingsName || null,
        toEmail || null,
        sharingOption || null,
        copyAddress || null
      );
    } catch (error: any) {
      console.error("[Airalo SDK] submitFutureOrder failed:", error.message);
      throw error;
    }
  }

  async cancelFutureOrder(orderId: string): Promise<any> {
    return this.restRequest("DELETE", `/orders/future/${orderId}`);
  }

  async cancelFutureOrders(requestIds: string[]): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      console.log("requestIds", JSON.stringify(requestIds, null, 2));
      return await sdk.cancelFutureOrder(...requestIds);
    } catch (error: any) {
      console.error("[Airalo SDK] cancelFutureOrders failed:", error.message);
      throw error;
    }
  }

  async getSimsList(params?: {
    iccid?: string;
    "filter[order_id]"?: string;
    "filter[iccid]"?: string;
    "filter[created_at]"?: string;
    limit?: number;
    page?: number;
    include?: string;
  }): Promise<any> {
    return this.restRequest("GET", "/sims", params);
  }

  async updateSimBrand(iccid: string, brandName: string): Promise<any> {
    return this.restRequest("PUT", `/sims/${iccid}`, {
      brand_settings_name: brandName,
    });
  }

  async getBrandedQRCode(iccid: string, params?: {
    brand_name?: string;
    size?: number;
    brand_settings_name?: string;
  }): Promise<any> {
    return this.restRequest("GET", `/sims/${iccid}/qr`, params);
  }

  async requestRefund(params: {
    iccids: string[];
    reason: "SERVICE_ISSUES" | "OTHERS";
    notes?: string;
    email?: string;
  }): Promise<any> {
    return this.restRequest("POST", "/refund", params);
  }

  async getBalance(): Promise<any> {
    return this.restRequest("GET", "/balance");
  }

  async voucher(
    usageLimit: number,
    amount: number,
    quantity: number,
    isPaid: boolean = false,
    voucherCode?: string
  ): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.voucher(usageLimit, amount, quantity, isPaid, voucherCode || null);
    } catch (error: any) {
      console.error("[Airalo SDK] voucher failed:", error.message);
      throw error;
    }
  }

  async esimVouchers(vouchers: { vouchers: { package_id: string; quantity: number }[] }): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.esimVouchers(vouchers);
    } catch (error: any) {
      console.error("[Airalo SDK] esimVouchers failed:", error.message);
      throw error;
    }
  }

  async getExchangeRates(
    date?: string,
    source?: string,
    from?: string,
    to?: string
  ): Promise<any> {
    const sdk = await this.ensureInitialized();
    try {
      return await sdk.getExchangeRates(date || null, source || null, from || null, to || null);
    } catch (error: any) {
      console.error("[Airalo SDK] getExchangeRates failed:", error.message);
      throw error;
    }
  }
}

export const airaloAPI = new AiraloSDKWrapper();

"use strict";

import { getMayaEsim, getMayaEsimPlans } from "./api-client";
import type { ProviderUsageData } from "../../providers/provider-interface";
import type { MayaGetEsimResponse, MayaGetPlansResponse } from "./types";


const BYTES_IN_MB_DECIMAL = 1_000_000;
const BYTES_IN_MIB = 1024 * 1024;

const bytesToDecimalMB = (bytes = 0) =>
  Math.round((bytes / BYTES_IN_MB_DECIMAL) * 100000) / 100000;

const bytesToMiB = (bytes = 0) =>
  Math.round((bytes / BYTES_IN_MIB) * 100) / 100;



export async function getMayaUsageData(
  iccidOrEsimId: string,
  apiKey: string,
  apiSecret: string
): Promise<ProviderUsageData> {
  try {
    const esimResponse = await getMayaEsim(
      iccidOrEsimId,
      apiKey,
      apiSecret
    ) as MayaGetEsimResponse;

    if (!esimResponse.esim) {
      throw new Error("eSIM not found");
    }

    const esim = esimResponse.esim;

    const plansResponse = await getMayaEsimPlans(
      iccidOrEsimId,
      apiKey,
      apiSecret
    ) as MayaGetPlansResponse;

    let totalBytes = 0;
    let remainingBytes = 0;
    let usedBytes = 0;
    let expiresAt: Date | undefined;
    let activatedAt: Date | undefined;

    console.log("[Maya] Plans response:", plansResponse);

    if (plansResponse.plans?.length) {
      const activePlans = plansResponse.plans.filter(
        p => p.network_status === "ACTIVE"
      );

      for (const plan of activePlans) {
        const quota = plan.data_quota_bytes || 0;
        const remaining = plan.data_bytes_remaining || 0;
        const used = quota - remaining;

        totalBytes += quota;
        remainingBytes += remaining;
        usedBytes += used;

        if (plan.end_time) {
          const expiry = new Date(plan.end_time);
          if (!expiresAt || expiry < expiresAt) {
            expiresAt = expiry;
          }
        }

        if (plan.date_activated) {
          const activated = new Date(plan.date_activated);
          if (!activatedAt || activated < activatedAt) {
            activatedAt = activated;
          }
        }
      }
    }

    // 🔁 Convert to MB
    const dataTotalMb = Math.round(bytesToDecimalMB(totalBytes));
    const dataRemainingMb = Math.round(bytesToDecimalMB(remainingBytes));
    const dataUsedMb = Math.round(bytesToDecimalMB(usedBytes));

    const percentageUsed =
      dataTotalMb > 0
        ? Math.round((dataUsedMb / dataTotalMb) * 10000) / 100
        : 0;

    let status: "active" | "inactive" | "expired" = "inactive";
    if (esim.service_status === "active") {
      status = "active";
    }

    return {
      iccid: esim.iccid,
      dataUsed: dataUsedMb,        // ✅ MB
      dataTotal: dataTotalMb,      // ✅ MB
      dataRemaining: dataRemainingMb, // ✅ MB
      percentageUsed,
      activatedAt: activatedAt ?? new Date(esim.date_assigned),
      expiresAt,
      status,
    };

  } catch (error) {
    console.error("[Maya] Get usage data failed:", error);
    throw new Error(
      `Failed to get usage data: ${error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}



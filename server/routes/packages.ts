"use strict";

import { Router, type Request, type Response } from "express";
import { storage } from "../storage";
import { asyncHandler } from "../lib/asyncHandler";
import { NotFoundError } from "../lib/errors";
import { db } from "../db";
import { orders, providers, unifiedPackages, reviews, users, insertReviewSchema, referralProgram, referrals, referralSettings, insertReferralProgramSchema, insertReferralSchema, insertReferralSettingsSchema, blogPosts, regions } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import * as ApiResponse from "../utils/response";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const packages = await storage.getAllPackages();
    
    const marginSetting = await storage.getSettingByKey("pricing_margin");
    const marginPercent = marginSetting ? parseFloat(marginSetting.value) : 0;
    
    const packagesWithDestinations = await Promise.all(
      packages.map(async (pkg) => {
        const airaloPrice = pkg.airaloPrice ? parseFloat(pkg.airaloPrice) : parseFloat(pkg.price);
        const customerPrice = airaloPrice * (1 + marginPercent / 100);
        
        const packageWithPrice = {
          ...pkg,
          airaloPrice: airaloPrice.toFixed(2),
          price: customerPrice.toFixed(2),
        };
        
        if (pkg.destinationId) {
          const destination = await storage.getDestinationById(pkg.destinationId);
          return { ...packageWithPrice, destination };
        }
        return packageWithPrice;
      })
    );
    
    return ApiResponse.success(res, "Packages fetched successfully", packagesWithDestinations);
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/featured", async (req: Request, res: Response) => {
  try {
    // Get packages marked as Popular (isPopular=true) from unified_packages
    const featuredPackages = await db.query.unifiedPackages.findMany({
      where: and(
        eq(unifiedPackages.isPopular, true),
        eq(unifiedPackages.isEnabled, true)
      ),
      orderBy: [desc(unifiedPackages.salesCount)],
      limit: 8,
    });
    
    const packagesWithDestinations = await Promise.all(
      featuredPackages.map(async (pkg) => {
        let destination = null;
        if (pkg.destinationId) {
          destination = await storage.getDestinationById(pkg.destinationId);
        }
        return {
          id: pkg.id,
          title: pkg.title,
          slug: pkg.slug,
          dataAmount: pkg.dataAmount,
          validity: pkg.validity,
          retailPrice: pkg.retailPrice,
          destinationId: pkg.destinationId,
          regionId: pkg.regionId,
          destination,
        };
      })
    );
    
    return ApiResponse.success(res, "Featured packages fetched successfully", packagesWithDestinations);
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/complete", async (req: Request, res: Response) => {
  try {
    // Get packages that have all 3 features: Data, Voice, and SMS
    const completePackages = await db.query.unifiedPackages.findMany({
      where: and(
        eq(unifiedPackages.isEnabled, true),
        sql`${unifiedPackages.voiceMinutes} > 0`,
        sql`${unifiedPackages.smsCount} > 0`,
        sql`${unifiedPackages.dataMb} > 0`
      ),
      orderBy: [desc(unifiedPackages.salesCount)],
      limit: 8,
    });
    
    const packagesWithDestinations = await Promise.all(
      completePackages.map(async (pkg) => {
        let destination = null;
        if (pkg.destinationId) {
          destination = await storage.getDestinationById(pkg.destinationId);
        }
        return {
          id: pkg.id,
          title: pkg.title,
          slug: pkg.slug,
          dataAmount: pkg.dataAmount,
          validity: pkg.validity,
          retailPrice: pkg.retailPrice,
          voiceMinutes: pkg.voiceMinutes,
          smsCount: pkg.smsCount,
          destinationId: pkg.destinationId,
          regionId: pkg.regionId,
          destination,
        };
      })
    );
    
    return ApiResponse.success(res, "Complete packages fetched successfully", packagesWithDestinations);
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/global", async (req: Request, res: Response) => {
  try {
    const globalRegion = await db.query.regions.findFirst({
      where: sql`LOWER(name) = 'global'`,
    });
    
    if (!globalRegion) {
      return ApiResponse.success(res, "Global packages fetched successfully", []);
    }
    
    const globalPackages = await db.query.unifiedPackages.findMany({
      where: and(
        eq(unifiedPackages.regionId, globalRegion.id),
        eq(unifiedPackages.isEnabled, true)
      ),
      limit: 12,
      orderBy: [desc(unifiedPackages.salesCount)],
    });
    
    const formattedPackages = globalPackages.map(pkg => ({
      id: pkg.id,
      title: pkg.title,
      dataAmount: pkg.dataAmount,
      validity: pkg.validity,
      retailPrice: pkg.retailPrice,
      slug: pkg.slug,
    }));
    
    return ApiResponse.success(res, "Global packages fetched successfully", formattedPackages);
  } catch (error: any) {
    console.error("Error fetching global packages:", error);
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const packagesResult = await db.execute(sql`SELECT COUNT(*) as count FROM unified_packages WHERE is_enabled = true`);
    const destinationsResult = await db.execute(sql`SELECT COUNT(*) as count FROM destinations WHERE active = true`);
    
    const totalPackages = Number(packagesResult.rows[0]?.count) || 0;
    const totalDestinations = Number(destinationsResult.rows[0]?.count) || 0;
    
    return ApiResponse.success(res, "Package stats fetched successfully", {
      totalPackages,
      totalDestinations,
    });
  } catch (error: any) {
    console.error("Error fetching package stats:", error);
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/slug/:slug", async (req: Request, res: Response) => {
  try {
    const pkg = await storage.getPackageBySlug(req.params.slug);
    if (!pkg) {
      return ApiResponse.notFound(res, "Package not found");
    }

    let destination;
    if (pkg.destinationId) {
      destination = await storage.getDestinationById(pkg.destinationId);
    }

    return ApiResponse.success(res, "Package fetched successfully", { ...pkg, destination });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const pkg = await storage.getPackageById(req.params.id);
    if (!pkg) {
      return ApiResponse.notFound(res, "Package not found");
    }

    let destination;
    if (pkg.destinationId) {
      destination = await storage.getDestinationById(pkg.destinationId);
    }

    return ApiResponse.success(res, "Package fetched successfully", { ...pkg, destination });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/:packageId/reviews", async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;
    const { rating, page = "1" } = req.query;
    const limit = 20;
    const offset = (parseInt(page as string) - 1) * limit;

    let whereConditions: any[] = [
      eq(reviews.packageId, packageId),
      eq(reviews.isApproved, true),
    ];

    if (rating) {
      whereConditions.push(eq(reviews.rating, parseInt(rating as string)));
    }

    const reviewsData = await db.query.reviews.findMany({
      where: and(...whereConditions),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      limit,
      offset,
      orderBy: [desc(reviews.createdAt)],
    });

    const total = await db.select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(and(...whereConditions));

    return ApiResponse.successWithPagination(
      res,
      "Reviews fetched successfully",
      { reviews: reviewsData },
      {
        page: parseInt(page as string),
        limit,
        total: total[0]?.count || 0,
      }
    );
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get("/:packageId/review-stats", async (req: Request, res: Response) => {
  try {
    const { packageId } = req.params;

    const stats = await db.select({
      rating: reviews.rating,
      count: sql<number>`count(*)`,
    })
      .from(reviews)
      .where(and(
        eq(reviews.packageId, packageId),
        eq(reviews.isApproved, true)
      ))
      .groupBy(reviews.rating);

    const total = stats.reduce((acc, s) => acc + s.count, 0);
    const average = total > 0
      ? stats.reduce((acc, s) => acc + (s.rating * s.count), 0) / total
      : 0;

    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats.forEach(s => {
      distribution[s.rating] = s.count;
    });

    return ApiResponse.success(res, "Review stats fetched successfully", {
      average: Math.round(average * 10) / 10,
      total,
      distribution,
    });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

export default router;

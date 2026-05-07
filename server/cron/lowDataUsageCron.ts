import cron from "node-cron";
import { adminMessaging } from "server/config/firebase-admin";
import { providerFactory } from "server/providers/provider-factory";
import { storage } from "server/storage";
import { sendEmail, generateLowDataEmail } from "server/email";

const USAGE_THRESHOLDS = [50, 90, 100];
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const startLowDataUsageCron = () => {
    // ⏰ Runs every hour
    cron.schedule("0 * * * *", async () => {
        console.log("⏳ Running Low Data Usage Cron...");

        try {
            const orders = await storage.getAllOrdersByStatus("completed"); // all completed orders

            for (const order of orders) {
                try {
                    const user = await storage.getUserById(order.userId);
                    if (!user?.notifyLowData) continue;

                    const providerService = await providerFactory.getServiceById(
                        order.providerId
                    );

                    const usage = await providerService.getUsageData(order.iccid);
                    if (!usage?.percentageUsed) continue;

                    const now = Date.now();
                    const lastTime = user.lastLowDataNotifiedAt
                        ? new Date(user.lastLowDataNotifiedAt).getTime()
                        : 0;

                    const canNotifyTime = !lastTime || now - lastTime > ONE_DAY_MS;

                    // find highest crossed threshold
                    const crossedLevel = USAGE_THRESHOLDS
                        .filter(level => usage.percentageUsed >= level)
                        .sort((a, b) => b - a)[0];

                    const alreadyNotifiedLevel = user.lastLowDataLevel ?? 0;

                    if (
                        crossedLevel &&
                        (
                            crossedLevel > alreadyNotifiedLevel ||
                            (crossedLevel === alreadyNotifiedLevel && canNotifyTime)
                        )
                    ) {
                        // Get package info to identify the eSIM
                        const pkg = await storage.getUnifiedPackageById(order.packageId);
                        const esimName = pkg?.title || `${order.dataAmount} eSIM`;
                        const shortIccid = order.iccid.slice(-4);

                        const title = crossedLevel >= 90 ? "⚠️ Critical: Low Data Alert" : "⚠️ Low Data Alert";
                        const message = `You've used ${crossedLevel}% of your ${esimName} data (${shortIccid}). Top up to stay connected.`;

                        // 1. Push Notification (FCM)
                        if (user.fcmToken) {
                            try {
                                const payload = {
                                    notification: {
                                        title,
                                        body: message,
                                    },
                                    data: {
                                        type: "low_data",
                                        level: crossedLevel.toString(),
                                        iccid: order.iccid,
                                    },
                                    token: user.fcmToken,
                                };
                                await adminMessaging.send(payload);
                                console.log(`📱 Push sent to User: ${user.id}`);
                            } catch (fcmError) {
                                console.error(`❌ FCM error for User ${user.id}:`, fcmError);
                            }
                        }

                        // 2. In-App Notification
                        try {
                            await storage.createNotification({
                                userId: user.id,
                                type: "low_data",
                                title,
                                message,
                                metadata: {
                                    iccid: order.iccid,
                                    level: crossedLevel,
                                    packageName: esimName
                                }
                            });
                            console.log(`🔔 In-app notification created for User: ${user.id}`);
                        } catch (notifyError) {
                            console.error(`❌ In-app notification error for User ${user.id}:`, notifyError);
                        }

                        // 3. Email Notification
                        try {
                            const formatBytes = (bytes: number) => {
                                if (bytes === 0) return "0 B";
                                const k = 1024;
                                const sizes = ["B", "KB", "MB", "GB", "TB"];
                                const i = Math.floor(Math.log(bytes) / Math.log(k));
                                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
                            };

                            const emailData = {
                                userName: user.name || "Valued Customer",
                                threshold: `${crossedLevel}_percent`,
                                remainingData: formatBytes(usage.dataRemaining),
                                totalData: formatBytes(usage.dataTotal),
                                packageName: esimName,
                                iccid: order.iccid,
                                topupUrl: `${process.env.BASE_URL || "https://voltey.com"}/topup?iccid=${order.iccid}`
                            };

                            const emailContent = await generateLowDataEmail(emailData);
                            await sendEmail({
                                to: user.email,
                                subject: emailContent.subject,
                                html: emailContent.html
                            });
                            console.log(`📧 Email sent to: ${user.email}`);
                        } catch (emailError) {
                            console.error(`❌ Email error for User ${user.id}:`, emailError);
                        }

                        await storage.updateUser(user.id, {
                            lastLowDataNotifiedAt: new Date(),
                            lastLowDataLevel: crossedLevel,
                        });
                    }
                } catch (orderError) {
                    console.error(
                        `❌ Error processing order ${order.id}:`,
                        orderError
                    );
                }
            }
        } catch (err) {
            console.error("❌ Low Data Usage Cron Failed:", err);
        }
    });
};

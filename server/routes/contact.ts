import { Router } from "express";
import { db } from "../db";
import { settings } from "@shared/schema";
import { inArray } from "drizzle-orm";
import { sendEmail } from "../email";
import * as ApiResponse from "../utils/response";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return ApiResponse.badRequest(res, "Missing required fields (name, email, message)");
        }

        // Fetch platform settings for emails
        const keys = ["platform_name", "email", "smtp_from_email"];
        const rows = await db.select().from(settings).where(inArray(settings.key, keys));

        const config: Record<string, string> = {};
        rows.forEach((row) => {
            config[row.key] = row.value;
        });

        const platformName = config.platform_name || "Voltey";
        const supportEmail = config.email || "support@voltey.com";

        // 1. Send email to support team
        await sendEmail({
            to: supportEmail,
            subject: `New Contact Request: ${subject || "General Inquiry"}`,
            html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2c7338; border-bottom: 2px solid #2c7338; padding-bottom: 10px;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin-top: 0;"><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            This message was sent via the contact form on ${platformName}.
          </p>
        </div>
      `,
        });

        // 2. Send auto-acknowledgment to the customer
        await sendEmail({
            to: email,
            subject: `We've received your message - ${platformName}`,
            html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2c7338; margin: 0;">${platformName}</h1>
          </div>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out to us! We've received your message regarding "<strong>${subject || "General Inquiry"}</strong>".</p>
          <p>Our support team has been notified and we'll get back to you as soon as possible (usually within 12-24 hours).</p>
          <p>If your matter is urgent, please check our Help Center for quick answers to common questions.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="margin-bottom: 5px;">Best regards,</p>
            <p style="margin-top: 0; font-weight: bold; color: #2c7338;">Team ${platformName}</p>
          </div>
        </div>
      `,
        });

        return ApiResponse.success(res, "Message sent successfully");
    } catch (error: any) {
        console.error("Contact API error:", error);
        return ApiResponse.serverError(res, "Failed to send message. Please try again later.");
    }
});

export default router;
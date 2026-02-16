import nodemailer from "nodemailer";
import { db } from "./db";
import { emailTemplates } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";
import { settings } from "@shared/schema";


async function loadSmtpSettings() {
  const keys = [
    "smtp_host",
    "smtp_port",
    "smtp_user",
    "smtp_pass",
    "smtp_from_email"
  ];

  const rows = await db
    .select()
    .from(settings)
    .where(inArray(settings.key, keys));

  const config: any = {};
  for (const row of rows) {
    config[row.key] = row.value;
  }

  return {
    host: config.smtp_host || "",
    port: Number(config.smtp_port || 587),
    user: config.smtp_user || "",
    pass: config.smtp_pass || "",
    fromEmail: config.smtp_from_email || ""
  };
}



let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const smtp = await loadSmtpSettings();

  // If SMTP is not fully configured, disable email sending
  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.log("⚠ SMTP not configured in DB. Email disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  return transporter;
}


// Check if SMTP is configured
const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

// const transporter = isSmtpConfigured 
//   ? nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT || "587"),
//       secure: process.env.SMTP_PORT === "465",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     })
//   : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  // In development mode without SMTP, just log the email
  // if (!isSmtpConfigured) {
  //   console.log(`📧 [DEV MODE] Email would be sent to ${to}: ${subject}`);
  //   console.log(`📧 [DEV MODE] Content:`, text || html.replace(/<[^>]*>/g, "").substring(0, 200));
  //   return; // Don't throw error, just skip sending
  // }

  const smtp = await loadSmtpSettings();
  const transporter = await getTransporter();

  if (!transporter) {
    console.log("❌ Email not sent (SMTP disabled)");
    return;
  }

  try {
    await transporter!.sendMail({
      from: `"Simfinity" <${smtp.fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error: any) {
    console.error("❌ Failed to send email:", error.message);
    // In development, don't fail the request if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ [DEV MODE] Continuing despite email failure');
      return;
    }
    throw new Error("Failed to send email");
  }
}

// Template renderer function
interface TemplateVariables {
  [key: string]: string | number | undefined;
}

async function renderTemplate(eventType: string, variables: TemplateVariables): Promise<{ subject: string; html: string } | null> {
  try {
    // Fetch template from database
    const template = await db.select().from(emailTemplates).where(eq(emailTemplates.eventType, eventType)).limit(1);

    if (!template || template.length === 0 || !template[0].isActive) {
      return null; // No template found or inactive, will use fallback
    }

    const templateData = template[0];
    let { subject, body } = templateData;

    // Replace all variables in subject and body
    // Variables are in format {{variable_name}}
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const replacement = value !== undefined && value !== null ? String(value) : '';
      // Use replaceAll to avoid regex escape issues
      subject = subject.replaceAll(placeholder, replacement);
      body = body.replaceAll(placeholder, replacement);
    });

    return { subject, html: body };
  } catch (error) {
    console.error(`❌ Error rendering template for ${eventType}:`, error);
    return null; // Will use fallback
  }
}

export async function generateOTPEmail(
  code: string,
  name?: string,
  email?: string
) {
  // 1️⃣ Try database/email template first
  try {
    const templateRendered = await renderTemplate("otp", {
      customer_name: name || "Customer",
      code,
      platform_name: "Simfinity",
      customer_email: email,
    });

    if (templateRendered) {
      return templateRendered;
    }
  } catch (err) {
    // Template failure should never break OTP emails
    console.error("OTP template render failed:", err);
  }

  // 2️⃣ Safely load settings
  const keys = ["platform_name", "platform_tagline", "smtp_from_email"];

  let settingsMap: Record<string, string> = {};

  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, keys));

    for (const row of rows ?? []) {
      if (row?.key && row?.value) {
        settingsMap[row.key] = row.value;
      }
    }
  } catch (err) {
    console.error("Settings fetch failed:", err);
  }

  // 3️⃣ Safe defaults (never undefined)
  const platformName = settingsMap.platform_name || "Simfinity";
  const greeting = name ? `Hi ${name}` : "Hello";
  const year = new Date().getFullYear();

  // 4️⃣ Fallback email (guaranteed safe)
  return {
    subject: "Your Login Code",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      ${platformName}
    </h1>
  </div>

  <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      ${greeting},
    </p>

    <p style="font-size: 16px; margin-bottom: 30px;">
      Your verification code is:
    </p>

    <div style="background: white; border: 2px solid #2c7338; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
      <h2 style="color: #2c7338; font-size: 36px; letter-spacing: 8px; margin: 0;">
        ${code}
      </h2>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      This code will expire in 10 minutes.
      If you didn’t request this code, you can safely ignore this email.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© ${year} ${platformName}. All rights reserved.</p>
  </div>

</body>
</html>
    `,
  };
}


export async function generateWelcomeEmail(
  name: string,
  email?: string
) {
  // 1️⃣ Try DB template first (never break flow)
  try {
    const templateRendered = await renderTemplate("welcome", {
      customer_name: name || "Customer",
      customer_email: email || "",
      platform_name: "Simfinity",
    });

    if (templateRendered) {
      return templateRendered;
    }
  } catch (err) {
    console.error("Welcome template render failed:", err);
  }

  // 2️⃣ Fetch settings safely
  const keys = ["platform_name"];

  let settingsMap: Record<string, string> = {};

  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, keys));

    for (const row of rows ?? []) {
      if (row?.key && row?.value) {
        settingsMap[row.key] = row.value;
      }
    }
  } catch (err) {
    console.error("Settings fetch failed:", err);
  }

  // 3️⃣ Safe defaults
  const platformName = settingsMap.platform_name || "Simfinity";
  const customerName = name || "Customer";
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";

  // 4️⃣ Fallback email (guaranteed safe)
  return {
    subject: `Welcome to ${platformName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      Welcome to ${platformName}!
    </h1>
  </div>

  <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">
      Hi ${customerName},
    </p>

    <p style="font-size: 16px;">
      Thank you for joining ${platformName}! We're excited to help you stay connected wherever you travel.
    </p>

    <p style="font-size: 16px;">
      With ${platformName}, you can:
    </p>

    <ul style="font-size: 16px; line-height: 1.8;">
      <li>Get instant eSIM delivery</li>
      <li>Browse packages for 150+ countries</li>
      <li>Avoid expensive roaming charges</li>
      <li>Monitor your usage in real-time</li>
      <li>Top up anytime, anywhere</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${baseUrl}/destinations"
        style="background: #2c7338; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;"
      >
        Browse Destinations
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      If you have any questions, our support team is here 24/7 to help.
    </p>
  </div>

</body>
</html>
    `,
  };
}


export async function generateOrderConfirmationEmail(order: any) {
  // Try to use database template first
  const templateRendered = await renderTemplate('esim_purchased', {
    customer_name: order.customerName || 'Customer',
    order_number: order.displayId || order.id,
    esim_iccid: order.iccid || 'Processing',
    country: order.destination || 'Destination',
    data_amount: order.dataAmount || 'N/A',
    validity_days: order.validity || 'N/A',
    price: order.price ? `$${order.price}` : 'N/A',
    qr_code_url: order.qrCodeUrl || '',
  });

  if (templateRendered) {
    return templateRendered;
  }

  // Fallback to hardcoded template
  return {
    subject: "Your eSIM Order Confirmation",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        </div>
        <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Your eSIM order has been confirmed and is ready to use!</p>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c7338;">Order Details</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Order ID:</td>
                <td style="padding: 8px 0; font-weight: 600;">${order.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Destination:</td>
                <td style="padding: 8px 0; font-weight: 600;">${order.destination}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Data:</td>
                <td style="padding: 8px 0; font-weight: 600;">${order.dataAmount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Validity:</td>
                <td style="padding: 8px 0; font-weight: 600;">${order.validity} days</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Amount:</td>
                <td style="padding: 8px 0; font-weight: 600;">$${order.price}</td>
              </tr>
            </table>
          </div>
          <p style="font-size: 16px; font-weight: 600; margin-top: 30px;">Next Steps:</p>
          <p style="font-size: 14px;">Check your email for installation instructions with a QR code to activate your eSIM.</p>
        </div>
      </body>
      </html>
    `,
  };
}

export function generateInstallationEmail(order: any) {
  return {
    subject: "eSIM Installation Instructions",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Install Your eSIM</h1>
        </div>
        <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
          <h3 style="color: #2c7338;">Installation Steps:</h3>
          <ol style="font-size: 14px; line-height: 1.8;">
            <li>Go to Settings > Cellular/Mobile Data > Add eSIM</li>
            <li>Scan the QR code below or enter the details manually</li>
            <li>Follow the on-screen instructions</li>
            <li>Your eSIM will activate when you arrive at your destination</li>
          </ol>
          ${order.qrCode ? `
          <div style="text-align: center; margin: 30px 0;">
            <img src="${order.qrCode}" alt="QR Code" style="max-width: 250px; border: 2px solid #e5e7eb; border-radius: 8px; padding: 10px; background: white;">
          </div>
          ` : ''}
          ${order.lpaCode ? `
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Manual Installation Code:</h4>
            <p style="font-family: monospace; font-size: 12px; word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 4px;">${order.lpaCode}</p>
          </div>
          ` : ''}
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;"><strong>Important:</strong> Install your eSIM before you travel. It will activate automatically when you reach your destination.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export async function generateLowDataEmail(data: {
  userName: string;
  threshold: string;
  remainingData: string;
  totalData: string;
  packageName: string;
  iccid: string;
  expiryDate?: string;
  topupUrl: string;
}) {
  const { userName, threshold, remainingData, totalData, packageName, iccid, expiryDate, topupUrl } = data;

  // Map threshold to event type
  const eventTypeMap: Record<string, string> = {
    "75_percent": "low_data_75",
    "90_percent": "low_data_90",
    "3_days": "expiring_3days",
    "1_day": "expiring_1day",
  };

  const eventType = eventTypeMap[threshold];

  // Calculate percentage and days for templates
  const dataUsedPercentage = threshold === "75_percent" ? "75" : threshold === "90_percent" ? "90" : "0";
  const daysUntilExpiry = threshold === "3_days" ? "3" : threshold === "1_day" ? "1" : "0";

  // Try to use database template if event type mapped
  if (eventType) {
    const templateRendered = await renderTemplate(eventType, {
      customer_name: userName,
      esim_iccid: iccid,
      country: packageName, // packageName often contains country info
      data_used_percentage: dataUsedPercentage,
      data_remaining: remainingData,
      topup_link: topupUrl,
      expiry_date: expiryDate ? new Date(expiryDate).toLocaleDateString() : '',
      days_until_expiry: daysUntilExpiry,
    });

    if (templateRendered) {
      return templateRendered;
    }
  }

  // Fallback to hardcoded template
  let title = "";
  let urgencyLevel = "";
  let message = "";
  let actionText = "";

  // Customize message based on threshold
  switch (threshold) {
    case "75_percent":
      title = "Your eSIM Data is Running Low";
      urgencyLevel = "Notice";
      message = `You've used 75% of your data on your ${packageName} eSIM. You have ${remainingData} remaining out of ${totalData}.`;
      actionText = "Consider topping up to avoid running out during your trip.";
      break;
    case "90_percent":
      title = "Almost Out of Data!";
      urgencyLevel = "Warning";
      message = `You've used 90% of your data on your ${packageName} eSIM. Only ${remainingData} remaining out of ${totalData}!`;
      actionText = "Top up now to stay connected.";
      break;
    case "3_days":
      title = "Your eSIM Expires in 3 Days";
      urgencyLevel = "Notice";
      message = `Your ${packageName} eSIM will expire in 3 days${expiryDate ? ` on ${new Date(expiryDate).toLocaleDateString()}` : ''}.`;
      actionText = "Renew now to continue using your eSIM.";
      break;
    case "1_day":
      title = "Urgent: Your eSIM Expires Tomorrow!";
      urgencyLevel = "Urgent";
      message = `Your ${packageName} eSIM expires tomorrow${expiryDate ? ` on ${new Date(expiryDate).toLocaleDateString()}` : ''}. Don't lose connectivity!`;
      actionText = "Top up immediately to extend your service.";
      break;
  }

  const urgencyColor = urgencyLevel === "Urgent" ? "#dc2626" : urgencyLevel === "Warning" ? "#f59e0b" : "#0ea5e9";

  return {
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Simfinity</h1>
          </div>
          <div style="padding: 40px 30px;">
            <div style="background: ${urgencyColor}15; border-left: 4px solid ${urgencyColor}; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
              <p style="margin: 0; color: ${urgencyColor}; font-weight: bold; font-size: 14px; text-transform: uppercase;">${urgencyLevel}</p>
              <h2 style="margin: 10px 0 0 0; font-size: 20px; color: #1f2937;">${title}</h2>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi ${userName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">${message}</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">${actionText}</p>
            
            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; font-size: 16px; color: #1f2937;">eSIM Details</h3>
              <table style="width: 100%; font-size: 14px; color: #6b7280;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Package:</strong></td>
                  <td style="padding: 8px 0;">${packageName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Remaining:</strong></td>
                  <td style="padding: 8px 0;">${remainingData} of ${totalData}</td>
                </tr>
                ${expiryDate ? `
                <tr>
                  <td style="padding: 8px 0;"><strong>Expires:</strong></td>
                  <td style="padding: 8px 0;">${new Date(expiryDate).toLocaleDateString()}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0;"><strong>ICCID:</strong></td>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${iccid}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${topupUrl}" style="display: inline-block; background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">Top Up Now</a>
            </div>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;"><strong>Tip:</strong> Top up before you run out to avoid any interruption in service. Your eSIM will continue working seamlessly!</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">Need help? Contact our support team at info@simfinity.tel</p>
          </div>
          <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} Simfinity. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export async function generateCustomNotificationEmail(subject: string, message: string, userName: string, userEmail?: string) {
  // Try to use database template first
  // For custom notifications, we don't use the message variable since admins provide full content
  // But we can still use the template for consistent branding
  const templateRendered = await renderTemplate('custom', {
    customer_name: userName,
    customer_email: userEmail || '',
    platform_name: 'Simfinity',
  });

  // If template exists, we'll use the admin's custom subject and message instead of template
  // This preserves the custom notification functionality

  // Convert line breaks to <br> tags and convert URLs to links
  const formattedMessage = message
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: #3d9a4d; text-decoration: underline;">$1</a>');

  // Fallback to hardcoded template
  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Simfinity</h1>
        </div>
        <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
          <div style="font-size: 16px; line-height: 1.8; color: #374151;">
            ${formattedMessage}
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Simfinity. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };
}

interface EnterpriseQuoteEmailData {
  to: string;
  companyName: string;
  quoteId: string;
  packageName: string;
  destination: string;
  quantity: number;
  unitPrice: string;
  discountPercent: string;
  totalPrice: string;
  validUntil: Date;
  notes: string | null;
}

export async function sendEnterpriseQuoteEmail(data: EnterpriseQuoteEmailData) {
  const formattedValidUntil = new Date(data.validUntil).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const discountAmount = parseFloat(data.unitPrice) * (parseFloat(data.discountPercent) / 100) * data.quantity;
  const subtotal = parseFloat(data.unitPrice) * data.quantity;

  const template = {
    subject: `New Bulk eSIM Quote for ${data.companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Simfinity</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Enterprise Quote</p>
        </div>
        <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.companyName},</p>
          <p style="font-size: 16px; margin-bottom: 30px;">We're pleased to provide you with a bulk eSIM quote:</p>
          
          <div style="background: white; border-radius: 8px; padding: 25px; margin: 30px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">Quote Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Quote ID:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.quoteId}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Package:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.packageName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Destination:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.destination}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Quantity:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.quantity} eSIMs</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Unit Price:</td>
                <td style="padding: 12px 0; text-align: right; color: #1f2937;">$${parseFloat(data.unitPrice).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Subtotal:</td>
                <td style="padding: 12px 0; text-align: right; color: #1f2937;">$${subtotal.toFixed(2)}</td>
              </tr>
              ${parseFloat(data.discountPercent) > 0 ? `
              <tr>
                <td style="padding: 12px 0; color: #10b981; font-size: 14px;">Discount (${data.discountPercent}%):</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">-$${discountAmount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Total Price:</td>
                <td style="padding: 15px 0; text-align: right; color: #2c7338; font-size: 20px; font-weight: 700;">$${parseFloat(data.totalPrice).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Valid Until:</td>
                <td style="padding: 12px 0; text-align: right; color: #ef4444; font-weight: 600;">${formattedValidUntil}</td>
              </tr>
            </table>
            
            ${data.notes ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Additional Notes:</p>
              <p style="color: #1f2937; font-size: 14px; margin: 0; line-height: 1.6;">${data.notes}</p>
            </div>
            ` : ''}
          </div>
          
          <p style="font-size: 16px; margin: 30px 0 20px 0;">To accept this quote and place your bulk order, please log in to your enterprise portal or contact our sales team.</p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            This quote is valid until ${formattedValidUntil}. After this date, pricing and availability may change.
          </p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            If you have any questions or need to discuss this quote, please don't hesitate to reach out to our enterprise team.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} Simfinity. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };

  await sendEmail({
    to: data.to,
    subject: template.subject,
    html: template.html,
  });
}
